"use client";

import { useMemo, useState } from "react";
import { Video, FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";
import { TestimonialCard } from "@/components/testimonial-card";
import { ResponseDetailModal } from "@/components/response-detail-modal";
import type { Answer, Question, ResponseStatus, ResponseWithAnswers } from "@/lib/supabase/types";

type FilterTab = "all" | ResponseStatus;

interface AnswerCard {
  answer: Answer;
  response: ResponseWithAnswers;
  question: Question | undefined;
}

interface AnswerGalleryProps {
  variant: "video" | "text";
  initialResponses: ResponseWithAnswers[];
  questions: Question[];
}

export function AnswerGallery({ variant, initialResponses, questions }: AnswerGalleryProps) {
  const [responses, setResponses] = useState(initialResponses);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);

  const allCards = useMemo<AnswerCard[]>(() => {
    const cards: AnswerCard[] = [];
    for (const response of responses) {
      for (const answer of response.answers) {
        const matches = variant === "video" ? !!answer.video_url : !!answer.text_answer;
        if (!matches) continue;
        cards.push({ answer, response, question: questions.find((q) => q.id === answer.question_id) });
      }
    }
    return cards.sort(
      (a, b) => new Date(b.response.created_at).getTime() - new Date(a.response.created_at).getTime()
    );
  }, [responses, questions, variant]);

  const filteredCards = filter === "all" ? allCards : allCards.filter((c) => c.response.status === filter);
  const selectedResponse = responses.find((r) => r.id === selectedResponseId) ?? null;

  function handleStatusChange(responseId: string, status: ResponseStatus) {
    setResponses((prev) => prev.map((r) => (r.id === responseId ? { ...r, status } : r)));
  }

  const emptyCopy =
    variant === "video"
      ? {
          icon: Video,
          title: "No testimonials yet",
          description: "Print your QR code and put it on the table. Videos land here as diners fill out the ticket.",
          meta: "Nothing on the rail",
        }
      : {
          icon: FileText,
          title: "No written answers yet",
          description: "When a diner types instead of filming, their answer shows up here.",
          meta: "Nothing on the rail",
        };

  return (
    <div>
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Published</TabsTrigger>
          <TabsTrigger value="rejected">Hidden</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        {filteredCards.length === 0 ? (
          <EmptyState
            icon={emptyCopy.icon}
            title={emptyCopy.title}
            description={emptyCopy.description}
            meta={emptyCopy.meta}
            actionLabel="Get your QR code"
            actionHref="/dashboard/qr"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCards.map(({ answer, response, question }) => (
              <TestimonialCard
                key={answer.id}
                variant={variant}
                videoUrl={answer.video_url}
                textAnswer={answer.text_answer}
                questionText={question?.text ?? "Question"}
                customerName={response.customer_name || "Anonymous"}
                date={new Date(response.created_at).toLocaleDateString()}
                status={response.status}
                onClick={() => setSelectedResponseId(response.id)}
              />
            ))}
          </div>
        )}
      </div>

      <ResponseDetailModal
        response={selectedResponse}
        questions={questions}
        onClose={() => setSelectedResponseId(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
