"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { RecordButton, type RecordState } from "@/components/record-button";
import { createClient } from "@/lib/supabase/client";
import { uploadWithProgress } from "@/lib/supabase/upload-with-progress";
import type { Business, Question } from "@/lib/supabase/types";

const MIME_CANDIDATES = [
  { mime: "video/mp4;codecs=avc1", ext: "mp4" },
  { mime: "video/webm;codecs=vp9", ext: "webm" },
  { mime: "video/webm", ext: "webm" },
];

function pickMimeType() {
  if (typeof MediaRecorder === "undefined") return null;
  return MIME_CANDIDATES.find((c) => MediaRecorder.isTypeSupported(c.mime)) ?? null;
}

const MAX_SECONDS = 60;

export type AnswerMode = "video" | "text";
type Mode = "record" | "upload" | "write";
type CaptureState =
  | "camera-init"
  | "camera-live"
  | "camera-denied"
  | "recording"
  | "file-pending"
  | "preview"
  | "uploading"
  | "error";

interface AnswerQuestionProps {
  business: Business;
  question: Question;
  responseId: string;
  /** The customer's chosen way of answering — every question can go either way. */
  initialMode: AnswerMode;
  /** Fired whenever the customer manually switches, so the choice carries forward. */
  onModeChange: (mode: AnswerMode) => void;
  onAnswered: () => void;
}

/**
 * Every question is answerable by video or by typing, regardless of how the
 * business configured it — the customer's choice from the mode step (and any
 * in-question switch) always wins. This is the single component that handles
 * both, so switching back and forth never means swapping components.
 */
export function AnswerQuestion({
  business,
  question,
  responseId,
  initialMode,
  onModeChange,
  onAnswered,
}: AnswerQuestionProps) {
  const [mode, setMode] = useState<Mode>(initialMode === "text" ? "write" : "record");
  const [captureState, setCaptureState] = useState<CaptureState>("camera-init");
  const [cameraAttempt, setCameraAttempt] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(MAX_SECONDS);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [textValue, setTextValue] = useState("");
  const [submittingText, setSubmittingText] = useState(false);

  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const extRef = useRef<string>("webm");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // Request the camera as soon as we're in record mode, and again on retake
  // (cameraAttempt bump) -- keeps a single getUserMedia code path instead of
  // duplicating it between mount and retake.
  useEffect(() => {
    if (mode !== "record") return;
    let cancelled = false;

    async function startCamera() {
      setCaptureState("camera-init");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = stream;
        }
        setCaptureState("camera-live");
      } catch {
        if (!cancelled) setCaptureState("camera-denied");
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [mode, cameraAttempt]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function switchMode(next: Mode) {
    setUploadError(null);
    setMode(next);
    if (next === "upload") setCaptureState("file-pending");
    onModeChange(next === "write" ? "text" : "video");
  }

  function retryCamera() {
    setMode("record");
    setCameraAttempt((n) => n + 1);
    onModeChange("video");
  }

  function startRecording() {
    const stream = streamRef.current;
    const picked = pickMimeType();
    if (!stream || !picked) {
      setCaptureState("camera-denied");
      return;
    }
    extRef.current = picked.ext;

    const recorder = new MediaRecorder(stream, { mimeType: picked.mime });
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: picked.mime });
      blobRef.current = blob;
      setPreviewUrl(URL.createObjectURL(blob));
      setCaptureState("preview");
    };

    recorderRef.current = recorder;
    recorder.start();
    setCaptureState("recording");
    setSecondsLeft(MAX_SECONDS);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          recorder.stop();
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function stopRecording() {
    recorderRef.current?.stop();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function retake() {
    blobRef.current = null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setUploadError(null);
    if (mode === "record") {
      setCameraAttempt((n) => n + 1);
    } else {
      setCaptureState("file-pending");
    }
  }

  function handleFileSelected(file: File) {
    const ext = file.name.split(".").pop() || "mp4";
    extRef.current = ext;
    blobRef.current = file;
    setPreviewUrl(URL.createObjectURL(file));
    setCaptureState("preview");
  }

  async function uploadAndSave() {
    const blob = blobRef.current;
    if (!blob) return;

    stopCamera();
    setCaptureState("uploading");
    setUploadProgress(0);
    setUploadError(null);

    try {
      const path = `${business.id}/${responseId}/${question.id}.${extRef.current}`;
      const url = await uploadWithProgress("testimonials", path, blob, setUploadProgress);

      const supabase = createClient();
      await supabase.from("answers").insert({
        id: crypto.randomUUID(),
        response_id: responseId,
        question_id: question.id,
        video_url: url,
        skipped: false,
      });

      onAnswered();
    } catch (err) {
      console.error("Video upload failed:", err);
      setUploadError("Upload failed. Check your connection and try again.");
      setCaptureState("error");
    }
  }

  async function submitSkip() {
    stopCamera();
    const supabase = createClient();
    await supabase.from("answers").insert({
      id: crypto.randomUUID(),
      response_id: responseId,
      question_id: question.id,
      skipped: true,
    });
    onAnswered();
  }

  async function submitWrittenAnswer() {
    if (!textValue.trim()) return;
    setSubmittingText(true);
    const supabase = createClient();
    await supabase.from("answers").insert({
      id: crypto.randomUUID(),
      response_id: responseId,
      question_id: question.id,
      text_answer: textValue.trim(),
      skipped: false,
    });
    onAnswered();
  }

  const showEscapeHatches = ["camera-init", "camera-live", "file-pending", "error"].includes(
    captureState
  );

  const recordState: RecordState =
    captureState === "camera-init" ? "arming" : captureState === "recording" ? "recording" : "idle";

  if (mode === "write") {
    return (
      <div className="flex flex-1 flex-col gap-4">
        <Textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Type your answer here"
          rows={6}
          className="resize-none text-base"
          autoFocus
        />
        <div className="flex flex-col gap-3">
          <Button
            size="xl"
            className="w-full"
            disabled={!textValue.trim() || submittingText}
            onClick={submitWrittenAnswer}
          >
            Continue
          </Button>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <button type="button" className="underline underline-offset-4" onClick={retryCamera}>
              Record a video instead
            </button>
            <button type="button" className="underline underline-offset-4" onClick={submitSkip}>
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {captureState === "preview" && previewUrl && (
        <div className="flex flex-1 flex-col gap-4">
          <video
            src={previewUrl}
            controls
            playsInline
            className="aspect-3/4 w-full rounded-md bg-ink object-cover"
          />
          <p className="text-center text-sm text-muted-foreground">
            Happy with it? You can always record again.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="xl" className="flex-1" onClick={retake}>
              Record again
            </Button>
            <Button size="xl" className="flex-1" onClick={uploadAndSave}>
              Use this
            </Button>
          </div>
        </div>
      )}

      {captureState === "uploading" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10">
          <p className="ticket-meta">Sending your video · {uploadProgress}%</p>
          <Progress value={uploadProgress} className="h-2 w-full max-w-xs" />
        </div>
      )}

      {captureState === "error" && (
        <div className="flex flex-col gap-3 rounded-md border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            {uploadError} You can try again, or type your answer instead.
          </p>
          <div className="flex gap-3">
            <Button size="lg" className="flex-1" onClick={uploadAndSave}>
              Try again
            </Button>
            <Button variant="outline" size="lg" className="flex-1" onClick={() => switchMode("write")}>
              Type it instead
            </Button>
          </div>
        </div>
      )}

      {mode === "record" &&
        (captureState === "camera-init" ||
          captureState === "camera-live" ||
          captureState === "recording") && (
          <>
            <div className="relative">
              <video
                ref={liveVideoRef}
                autoPlay
                muted
                playsInline
                className="aspect-3/4 w-full rounded-md bg-ink object-cover"
              />
              {captureState === "recording" && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-sm bg-ink/70 px-2.5 py-1 font-mono text-xs font-medium tracking-wide text-primary-foreground">
                  <span className="size-2 animate-pulse rounded-full bg-primary motion-reduce:animate-none" />
                  REC
                </div>
              )}
            </div>

            {/* The moment before record — write to the self-conscious diner. */}
            {captureState === "camera-live" && (
              <p className="text-center text-sm leading-relaxed text-muted-foreground text-balance">
                No one sees this but {business.name} — and only if they choose to share it. Record as
                many times as you like. Ready when you are.
              </p>
            )}

            <RecordButton
              state={recordState}
              secondsLeft={secondsLeft}
              maxSeconds={MAX_SECONDS}
              onStart={startRecording}
              onStop={stopRecording}
            />
          </>
        )}

      {/* Camera blocked is a fork in the road, not an error. */}
      {mode === "record" && captureState === "camera-denied" && (
        <div className="flex flex-col gap-4 rounded-md border border-dashed border-line bg-muted/40 p-5 text-center">
          <div>
            <p className="font-display text-lg font-semibold">Your camera&apos;s off</p>
            <p className="mt-1 text-sm text-muted-foreground text-balance">
              Turn it on in your browser settings — or just type your answer, it&apos;s just as
              welcome.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button size="xl" className="w-full" onClick={() => switchMode("write")}>
              Type it instead
            </Button>
            <Button size="lg" variant="outline" className="w-full" onClick={retryCamera}>
              Try the camera again
            </Button>
          </div>
        </div>
      )}

      {mode === "upload" && captureState === "file-pending" && (
        <label className="flex aspect-3/4 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-line text-center text-muted-foreground">
          <span className="text-sm font-medium">Tap to choose a video</span>
          <input
            type="file"
            accept="video/*"
            capture="user"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelected(file);
            }}
          />
        </label>
      )}

      {showEscapeHatches && (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {mode !== "upload" && (
            <button
              type="button"
              className="underline underline-offset-4"
              onClick={() => switchMode("upload")}
            >
              Upload a video
            </button>
          )}
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={() => switchMode("write")}
          >
            Type it instead
          </button>
          <button type="button" className="underline underline-offset-4" onClick={submitSkip}>
            Skip
          </button>
        </div>
      )}
    </div>
  );
}
