import { Button } from "@/components/ui/button";
import { Ticket, TicketHeader, TicketPerforation } from "@/components/ui/ticket";
import type { Business } from "@/lib/supabase/types";

interface WelcomeStepProps {
  business: Business;
  onStart: () => void;
}

export function WelcomeStep({ business, onStart }: WelcomeStepProps) {
  return (
    <Ticket edge="bottom" className="pb-3">
      <TicketHeader business={business.name} meta="For you" />
      <TicketPerforation />

      <div className="flex flex-col items-center gap-5 px-6 pt-6 pb-4 text-center">
        {business.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.logo_url}
            alt={business.name}
            className="size-14 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex size-14 items-center justify-center rounded-full text-lg font-semibold text-primary-foreground"
            style={{ backgroundColor: business.brand_color }}
          >
            {business.name.charAt(0).toUpperCase()}
          </div>
        )}

        <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance">
          Tell {business.name} how it went
        </h1>

        <p className="text-[0.95rem] leading-relaxed text-muted-foreground text-balance">
          Three or four quick questions, on camera. It takes about a minute — and there&apos;s
          something in it for you.
        </p>

        {business.reward_text && (
          <div className="w-full rounded-md border border-dashed border-line bg-muted/40 px-4 py-3">
            <p className="ticket-meta text-muted-foreground">Your voucher</p>
            <p className="mt-1 font-display text-lg font-semibold text-balance">
              {business.reward_text}
            </p>
          </div>
        )}

        <Button size="xl" className="mt-1 w-full" onClick={onStart}>
          Start
        </Button>
      </div>
    </Ticket>
  );
}
