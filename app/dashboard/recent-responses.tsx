"use client";

import { useState } from "react";
import { Inbox } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { ResponseDetailModal } from "@/components/response-detail-modal";
import type { Question, ResponseStatus, ResponseWithAnswers } from "@/lib/supabase/types";

export function RecentResponses({
  initialResponses,
  questions,
}: {
  initialResponses: ResponseWithAnswers[];
  questions: Question[];
}) {
  const [responses, setResponses] = useState(initialResponses);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = responses.find((r) => r.id === selectedId) ?? null;
  const recent = responses.slice(0, 8);

  function handleStatusChange(responseId: string, status: ResponseStatus) {
    setResponses((prev) => prev.map((r) => (r.id === responseId ? { ...r, status } : r)));
  }

  if (recent.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No testimonials yet"
        description="Print your QR code and put it on the table. The first ticket will land right here."
        actionLabel="Get your QR code"
        actionHref="/dashboard/qr"
      />
    );
  }

  return (
    <>
      <div className="divide-y divide-line overflow-hidden rounded-md border border-line bg-card">
        {recent.map((response) => (
          <button
            key={response.id}
            onClick={() => setSelectedId(response.id)}
            className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-muted/50"
          >
            <div>
              <p className="text-sm font-medium text-ink">{response.customer_name || "Anonymous"}</p>
              <p className="ticket-meta mt-0.5 text-muted-foreground/80">
                {new Date(response.created_at).toLocaleDateString()} · {response.answers.length}{" "}
                answer{response.answers.length === 1 ? "" : "s"}
              </p>
            </div>
            <StatusBadge status={response.status} />
          </button>
        ))}
      </div>

      <ResponseDetailModal
        response={selected}
        questions={questions}
        onClose={() => setSelectedId(null)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
