"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Check, Copy, Scissors } from "lucide-react";

interface RewardRevealProps {
  businessName: string;
  rewardText: string | null;
  rewardCode: string | null;
  rewardTerms: string | null;
  /** Shown only if the diner left contact info — an honest capability, not a promise it's already sent. */
  hasContactInfo: boolean;
}

/**
 * The payoff. This is the ONLY component in the product that uses --reward
 * (marigold), so its appearance means something. Styled explicitly as a
 * voucher — a labeled stub with a barcode strip — that tears off along a
 * perforation to reveal the code. Motion and confetti respect
 * prefers-reduced-motion.
 */
export function RewardReveal({
  businessName,
  rewardText,
  rewardCode,
  rewardTerms,
  hasContactInfo,
}: RewardRevealProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    confetti({ particleCount: 70, spread: 68, startVelocity: 34, origin: { y: 0.65 } });
  }, []);

  async function copyCode() {
    if (!rewardCode) return;
    await navigator.clipboard.writeText(rewardCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!rewardText && !rewardCode) return null;

  return (
    <div className="w-full">
      {/* the tear line */}
      <div className="relative flex items-center justify-center py-1" aria-hidden>
        <hr className="perf-rule w-full" />
        <Scissors className="absolute size-4 rotate-90 bg-background px-0.5 text-muted-foreground" />
      </div>

      {/* the stub that tears away — marigold, torn both edges, styled as a voucher */}
      <div className="edge-torn-y animate-tear-away bg-reward px-6 py-6 text-center text-reward-foreground">
        <p className="ticket-meta text-reward-foreground/70">Voucher</p>

        {rewardText && (
          <p className="mt-1.5 font-display text-lg leading-tight font-semibold text-balance">
            {rewardText}
          </p>
        )}

        {rewardCode && (
          <button
            type="button"
            onClick={copyCode}
            className="group mt-4 inline-flex items-center gap-3 rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-reward-foreground/30"
            aria-label={copied ? "Code copied" : `Copy code ${rewardCode}`}
          >
            <span className="animate-code-stamp font-mono text-2xl font-bold tracking-[0.12em]">
              {rewardCode}
            </span>
            {copied ? <Check className="size-5 shrink-0" /> : <Copy className="size-5 shrink-0 opacity-70" />}
          </button>
        )}
        {rewardCode && (
          <p className="mt-1.5 font-mono text-[0.7rem] tracking-wider uppercase opacity-70">
            {copied ? "Copied" : "Tap to copy"}
          </p>
        )}

        <div aria-hidden className="voucher-barcode mx-auto mt-4 max-w-56 text-reward-foreground/50" />

        {rewardTerms && (
          <p className="mx-auto mt-4 max-w-xs text-xs text-reward-foreground/75">{rewardTerms}</p>
        )}

        <p className="mx-auto mt-3 max-w-xs text-[0.7rem] leading-relaxed text-reward-foreground/70">
          {hasContactInfo
            ? `Copy this now — it's yours. If you ever lose it, ${businessName} can look it up with the details you gave them.`
            : "Copy this now — it's yours to keep, and it won't show again after you close this page."}
        </p>
      </div>
    </div>
  );
}
