import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  /** Optional mono line printed at the top, like a blank ticket. */
  meta?: string;
}

/**
 * An empty state is an invitation, not an apology. Rendered as a blank ticket
 * waiting to be filled — dashed perforation border, mono meta, real next action.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  meta = "No tickets on the rail",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line bg-card/40 px-6 py-16 text-center">
      <p className="ticket-meta">{meta}</p>
      <div className="mt-1 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground text-balance">{description}</p>
      {actionLabel && actionHref && (
        <Button render={<a href={actionHref}>{actionLabel}</a>} nativeButton={false} size="lg" className="mt-3" />
      )}
    </div>
  );
}
