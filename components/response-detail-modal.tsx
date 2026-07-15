"use client";

import { useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/status-badge";
import { updateResponseStatus } from "@/app/dashboard/actions";
import type { Question, ResponseStatus, ResponseWithAnswers } from "@/lib/supabase/types";

interface ResponseDetailModalProps {
  response: ResponseWithAnswers | null;
  questions: Question[];
  onClose: () => void;
  onStatusChange: (responseId: string, status: ResponseStatus) => void;
}

export function ResponseDetailModal({
  response,
  questions,
  onClose,
  onStatusChange,
}: ResponseDetailModalProps) {
  const [isPending, startTransition] = useTransition();

  function setStatus(status: ResponseStatus) {
    if (!response) return;
    onStatusChange(response.id, status);
    startTransition(() => {
      updateResponseStatus(response.id, status);
    });
  }

  return (
    <Dialog open={!!response} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        {response && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2.5">
                <DialogTitle className="font-display">
                  {response.customer_name || "Anonymous"}
                </DialogTitle>
                {response.status === "approved" ? (
                  <span className="animate-stamp-press inline-flex rounded-sm border-2 border-primary/50 px-1.5 py-0.5 font-mono text-[0.62rem] font-bold tracking-[0.12em] text-primary uppercase">
                    Published
                  </span>
                ) : (
                  <StatusBadge status={response.status} />
                )}
              </div>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {response.customer_email && <p>{response.customer_email}</p>}
              {response.customer_phone && <p>{response.customer_phone}</p>}
              <p>{new Date(response.created_at).toLocaleString()}</p>
              <p>{response.consent ? "Consented to public use" : "No consent on file"}</p>
            </div>

            <Separator />

            <div className="flex flex-col gap-5">
              {response.answers.map((answer) => {
                const question = questions.find((q) => q.id === answer.question_id);
                return (
                  <div key={answer.id} className="space-y-2">
                    <p className="text-sm font-medium">{question?.text ?? "Question"}</p>
                    {answer.skipped && (
                      <Badge variant="outline" className="text-muted-foreground">
                        Skipped
                      </Badge>
                    )}
                    {answer.video_url && (
                      <div className="space-y-2">
                        <video
                          src={answer.video_url}
                          controls
                          playsInline
                          className="aspect-video w-full rounded-lg bg-black"
                        />
                        <a
                          href={answer.video_url}
                          download
                          className="text-xs font-medium underline underline-offset-4"
                        >
                          Download {answer.video_url.split(".").pop()?.toUpperCase()}
                        </a>
                      </div>
                    )}
                    {answer.text_answer && (
                      <p className="rounded-lg bg-muted/40 p-3 text-sm">{answer.text_answer}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-2">
              <p className="ticket-meta">
                {response.consent ? "Consent on file" : "No consent — do not publish"}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isPending || response.status === "rejected"}
                  onClick={() => setStatus("rejected")}
                >
                  {response.status === "rejected" ? "Hidden" : "Hide"}
                </Button>
                <Button
                  size="sm"
                  disabled={isPending || response.status === "approved"}
                  onClick={() => setStatus("approved")}
                >
                  {response.status === "approved" ? "Published" : "Publish"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
