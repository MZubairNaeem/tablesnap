interface StatCardProps {
  label: string;
  value: string;
}

/**
 * One cell of the stat strip — a quiet mono label over a large tabular number.
 * No tinted-icon chrome; the dashboard is a tool, not a toy.
 */
export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1.5 px-5 py-4">
      <p className="ticket-meta">{label}</p>
      <p className="font-display text-3xl font-semibold tabular-nums tracking-tight text-ink">
        {value}
      </p>
    </div>
  );
}
