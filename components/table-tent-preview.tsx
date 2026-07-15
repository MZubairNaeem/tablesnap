import { Ticket, TicketHeader, TicketPerforation } from "@/components/ui/ticket";
import type { Business } from "@/lib/supabase/types";

/**
 * The printable table-tent artifact — the ticket in the physical world. Rendered
 * as a real ticket so what sits on the table matches what the diner sees on their
 * phone. Uses accent, never the reward color (the reward only appears at payoff).
 */
export function TableTentPreview({
  business,
  qrDataUrl,
}: {
  business: Business;
  qrDataUrl: string | null;
}) {
  return (
    <Ticket edge="bottom" className="mx-auto w-full max-w-xs pb-3">
      <TicketHeader business={business.name} meta="Scan me" />
      <TicketPerforation />
      <div className="flex flex-col items-center gap-4 px-6 pt-5 pb-6 text-center">
        <p className="font-display text-xl leading-tight font-semibold text-balance">
          Tell us how it went
        </p>
        <p className="text-sm text-muted-foreground text-balance">
          Scan the code, answer three quick questions on camera
          {business.reward_text ? `, and get ${business.reward_text}` : ""}.
        </p>
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrDataUrl} alt="QR code" className="size-40 rounded-sm border border-line" />
        ) : (
          <div className="size-40 animate-pulse rounded-sm bg-muted" />
        )}
        <p className="ticket-meta">About 90 seconds</p>
      </div>
    </Ticket>
  );
}
