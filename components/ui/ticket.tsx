import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The Ticket — Vouch's signature element.
 *
 * A warm receipt/order-chit rendered with a torn perforated edge (a CSS mask,
 * so it is color-independent and survives any per-tenant brand color). It is the
 * shared DNA of both surfaces: one generous ticket on the collection page, dense
 * chits on the dashboard rail.
 */
function Ticket({
  className,
  edge = "bottom",
  lift = true,
  ...props
}: React.ComponentProps<"div"> & {
  edge?: "bottom" | "top" | "both" | "none";
  lift?: boolean;
}) {
  const edgeClass =
    edge === "bottom"
      ? "edge-torn-bottom"
      : edge === "top"
        ? "edge-torn-top"
        : edge === "both"
          ? "edge-torn-y"
          : "";
  return (
    <div className={cn(lift && edge !== "none" && "ticket-shadow")}>
      <div
        data-slot="ticket"
        className={cn(
          "flex flex-col bg-card text-card-foreground",
          edgeClass,
          className
        )}
        {...props}
      />
    </div>
  );
}

/** Mono print header — business name left, meta (progress / stamp) right. */
function TicketHeader({
  className,
  business,
  meta,
  ...props
}: React.ComponentProps<"div"> & { business: string; meta?: React.ReactNode }) {
  return (
    <div
      data-slot="ticket-header"
      className={cn(
        "flex items-center justify-between gap-3 px-5 pt-4 pb-3",
        className
      )}
      {...props}
    >
      <span className="ticket-meta truncate text-ink">{business}</span>
      {meta ? <span className="ticket-meta shrink-0">{meta}</span> : null}
    </div>
  );
}

/** The dashed perforation between ticket sections. */
function TicketPerforation({ className, ...props }: React.ComponentProps<"hr">) {
  return <hr data-slot="ticket-perforation" className={cn("perf-rule mx-5", className)} {...props} />;
}

export { Ticket, TicketHeader, TicketPerforation };
