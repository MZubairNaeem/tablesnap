import { Video, PenLine } from "lucide-react";
import { Ticket, TicketHeader, TicketPerforation } from "@/components/ui/ticket";
import type { AnswerMode } from "./answer-question";
import type { Business } from "@/lib/supabase/types";

interface ModeStepProps {
  business: Business;
  onChoose: (mode: AnswerMode) => void;
}

/**
 * Asks once, up front, how the diner would like to answer. Either choice is
 * just a starting point — every question still offers a way to switch, so
 * this isn't a one-way commitment.
 */
export function ModeStep({ business, onChoose }: ModeStepProps) {
  return (
    <Ticket edge="bottom" className="pb-3">
      <TicketHeader business={business.name} meta="2 of 2" />
      <TicketPerforation />

      <div className="flex flex-col gap-5 px-6 pt-5 pb-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-balance">
            How would you like to answer?
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Either way works — you can switch on any question.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => onChoose("video")}
            className="group flex items-center gap-4 rounded-md border-2 border-primary bg-primary/5 px-5 py-4 text-left transition-colors hover:bg-primary/10"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Video className="size-5" />
            </span>
            <span>
              <span className="block font-display text-lg leading-tight font-semibold">
                Record video answers
              </span>
              <span className="block text-sm text-muted-foreground">
                Just talk to the camera — about a minute total
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => onChoose("text")}
            className="group flex items-center gap-4 rounded-md border border-line bg-card px-5 py-4 text-left transition-colors hover:bg-muted/50"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <PenLine className="size-5" />
            </span>
            <span>
              <span className="block font-display text-lg leading-tight font-semibold">
                Type my answers
              </span>
              <span className="block text-sm text-muted-foreground">
                Quick to read, quick to write
              </span>
            </span>
          </button>
        </div>
      </div>
    </Ticket>
  );
}
