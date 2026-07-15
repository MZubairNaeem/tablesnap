"use client";

import { Ticket, TicketHeader, TicketPerforation } from "@/components/ui/ticket";
import type { Business, Question } from "@/lib/supabase/types";
import { AnswerQuestion, type AnswerMode } from "./answer-question";

interface QuestionStepProps {
  business: Business;
  question: Question;
  responseId: string;
  questionNumber: number;
  totalQuestions: number;
  preferredMode: AnswerMode;
  onModeChange: (mode: AnswerMode) => void;
  onAnswered: () => void;
}

export function QuestionStep({
  business,
  question,
  responseId,
  questionNumber,
  totalQuestions,
  preferredMode,
  onModeChange,
  onAnswered,
}: QuestionStepProps) {
  return (
    <Ticket edge="bottom" className="pb-3">
      <TicketHeader business={business.name} meta={`${questionNumber} / ${totalQuestions}`} />
      <TicketPerforation />

      <div className="flex flex-col gap-5 px-6 pt-5 pb-4">
        <h2 className="font-display text-2xl leading-tight font-semibold tracking-tight text-balance">
          {question.text}
        </h2>

        <AnswerQuestion
          business={business}
          question={question}
          responseId={responseId}
          initialMode={preferredMode}
          onModeChange={onModeChange}
          onAnswered={onAnswered}
        />
      </div>
    </Ticket>
  );
}
