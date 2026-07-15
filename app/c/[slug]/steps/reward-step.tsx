"use client";

import { Check } from "lucide-react";
import { Ticket, TicketHeader, TicketPerforation } from "@/components/ui/ticket";
import { RewardReveal } from "@/components/reward-reveal";
import type { Business } from "@/lib/supabase/types";

interface RewardStepProps {
  business: Business;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export function RewardStep({ business, customerName, customerEmail, customerPhone }: RewardStepProps) {
  const hasContactInfo = Boolean(customerEmail || customerPhone);

  return (
    <Ticket edge="bottom" className="pb-4">
      <TicketHeader business={business.name} meta="✓ done" />
      <TicketPerforation />

      <div className="flex flex-col items-center gap-3 px-6 pt-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-6" />
        </div>
        <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance">
          That&apos;s a wrap — thank you, {customerName || "friend"}!
        </h1>
        <p className="max-w-xs text-sm text-muted-foreground text-balance">
          Video or written, every answer helps {business.name} — and helps the next diner decide
          where to eat.
        </p>
      </div>

      <div className="px-3 pt-5">
        <RewardReveal
          businessName={business.name}
          rewardText={business.reward_text}
          rewardCode={business.reward_code}
          rewardTerms={business.reward_terms}
          hasContactInfo={hasContactInfo}
        />
      </div>

      <p className="px-6 pt-5 text-center text-[0.7rem] leading-relaxed text-muted-foreground/70">
        This review was submitted in exchange for a discount.
      </p>
    </Ticket>
  );
}
