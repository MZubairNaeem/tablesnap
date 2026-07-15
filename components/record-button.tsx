"use client";

import { Loader2, Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type RecordState = "idle" | "arming" | "recording" | "processing" | "done";

interface RecordButtonProps {
  state: RecordState;
  secondsLeft: number;
  maxSeconds: number;
  onStart: () => void;
  onStop: () => void;
}

/**
 * The primary action of the entire product — the moment before the diner hits
 * record. One button carries every state, and the 60s countdown lives inside it
 * (a draining bar), so there is never a separate timer to track.
 */
export function RecordButton({
  state,
  secondsLeft,
  maxSeconds,
  onStart,
  onStop,
}: RecordButtonProps) {
  const base =
    "relative flex h-14 w-full items-center justify-center gap-2.5 overflow-hidden rounded-md text-base font-medium transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

  if (state === "recording") {
    const pct = (secondsLeft / maxSeconds) * 100;
    return (
      <button
        type="button"
        onClick={onStop}
        className={cn(base, "border-2 border-primary bg-transparent text-foreground")}
        aria-label={`Stop recording, ${secondsLeft} seconds left`}
      >
        {/* the countdown, draining left-to-right, is the button */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 bg-primary/12 transition-[width] duration-1000 ease-linear motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
        <span className="relative z-10 flex items-center gap-2.5">
          <span className="h-3 w-3 rounded-[2px] bg-primary" />
          <span>Stop</span>
          <span className="font-mono tabular-nums tracking-wide text-muted-foreground">
            0:{secondsLeft.toString().padStart(2, "0")}
          </span>
        </span>
      </button>
    );
  }

  if (state === "arming" || state === "processing") {
    return (
      <button type="button" disabled className={cn(base, "bg-primary text-primary-foreground")}>
        <Loader2 className="size-5 animate-spin motion-reduce:animate-none" />
        {state === "arming" ? "Starting camera" : "Saving"}
      </button>
    );
  }

  if (state === "done") {
    return (
      <button type="button" disabled className={cn(base, "bg-primary text-primary-foreground")}>
        <Check className="size-5" />
        Saved
      </button>
    );
  }

  // idle
  return (
    <button type="button" onClick={onStart} className={cn(base, "bg-primary text-primary-foreground hover:opacity-90")}>
      <span className="size-3 rounded-full bg-current opacity-90" />
      Start recording
    </button>
  );
}
