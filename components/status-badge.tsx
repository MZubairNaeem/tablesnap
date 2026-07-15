import { Badge } from "@/components/ui/badge";
import type { ResponseStatus } from "@/lib/supabase/types";

/**
 * The status stamp. Reuses the ink-stamp Badge variants. Copy follows the
 * publish/hide language of the dashboard, not the raw DB enum:
 *   pending → "Pending", approved → "Published", rejected → "Hidden".
 */
const STATUS: Record<ResponseStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  approved: { label: "Published", variant: "default" },
  pending: { label: "Pending", variant: "secondary" },
  rejected: { label: "Hidden", variant: "destructive" },
};

export function StatusBadge({ status, className }: { status: ResponseStatus; className?: string }) {
  const { label, variant } = STATUS[status];
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
