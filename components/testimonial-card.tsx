"use client";

import { Play, Quote } from "lucide-react";

import { Ticket } from "@/components/ui/ticket";
import { StatusBadge } from "@/components/status-badge";
import type { ResponseStatus } from "@/lib/supabase/types";

interface TestimonialCardProps {
  variant: "video" | "text";
  videoUrl?: string | null;
  textAnswer?: string | null;
  questionText: string;
  customerName: string;
  date: string;
  status: ResponseStatus;
  onClick: () => void;
}

/**
 * A chit on the pass. Torn top edge (the ticket signature in its dense register),
 * mono question meta, a status stamp. The whole card is the click target.
 */
export function TestimonialCard({
  variant,
  videoUrl,
  textAnswer,
  questionText,
  customerName,
  date,
  status,
  onClick,
}: TestimonialCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
    >
      <Ticket edge="top" className="rounded-b-md">
        {variant === "video" ? (
          <div className="relative aspect-video bg-ink/90">
            <video src={videoUrl ?? undefined} preload="metadata" className="h-full w-full object-cover opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-card/95 transition-transform group-hover:scale-105">
                <Play className="size-4 fill-ink text-ink" />
              </span>
            </div>
          </div>
        ) : (
          <div className="relative flex aspect-video flex-col justify-center gap-2 bg-muted/40 p-4">
            <Quote className="size-4 text-muted-foreground/60" />
            <p className="line-clamp-3 text-sm leading-snug text-ink/90">{textAnswer}</p>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-1.5 px-4 pt-3 pb-4">
          <p className="ticket-meta line-clamp-1">{questionText}</p>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-ink">{customerName || "Anonymous"}</p>
            <StatusBadge status={status} />
          </div>
          <p className="ticket-meta text-muted-foreground/70">{date}</p>
        </div>
      </Ticket>
    </button>
  );
}
