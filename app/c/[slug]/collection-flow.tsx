"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import type { Business, Question } from "@/lib/supabase/types";
import { WelcomeStep } from "./steps/welcome-step";
import { ContactStep } from "./steps/contact-step";
import { ModeStep } from "./steps/mode-step";
import { QuestionStep } from "./steps/question-step";
import { RewardStep } from "./steps/reward-step";
import type { AnswerMode } from "./steps/answer-question";

type Step =
  | { kind: "welcome" }
  | { kind: "contact" }
  | { kind: "mode" }
  | { kind: "question"; index: number }
  | { kind: "reward" };

interface CollectionFlowProps {
  business: Business;
  questions: Question[];
}

export function CollectionFlow({ business, questions }: CollectionFlowProps) {
  const [step, setStep] = useState<Step>({ kind: "welcome" });
  const [responseId, setResponseId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [preferredMode, setPreferredMode] = useState<AnswerMode>("video");

  function advancePastQuestion(currentIndex: number) {
    const next = currentIndex + 1;
    setStep(next < questions.length ? { kind: "question", index: next } : { kind: "reward" });
  }

  // The tenant paints the accent. The signature (the ticket) is structural, so it
  // survives any brand color; --reward is never overridden.
  const themeStyle = {
    "--primary": business.brand_color,
    "--ring": business.brand_color,
  } as CSSProperties;

  return (
    <div style={themeStyle} className="flex min-h-svh flex-col bg-background">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-6">
        {step.kind === "welcome" && (
          <WelcomeStep business={business} onStart={() => setStep({ kind: "contact" })} />
        )}

        {step.kind === "contact" && (
          <ContactStep
            business={business}
            onSubmitted={(id, name, email, phone) => {
              setResponseId(id);
              setCustomerName(name);
              setCustomerEmail(email);
              setCustomerPhone(phone);
              setStep(questions.length > 0 ? { kind: "mode" } : { kind: "reward" });
            }}
          />
        )}

        {step.kind === "mode" && (
          <ModeStep
            business={business}
            onChoose={(mode) => {
              setPreferredMode(mode);
              setStep({ kind: "question", index: 0 });
            }}
          />
        )}

        {step.kind === "question" && responseId && (
          <QuestionStep
            key={questions[step.index].id}
            business={business}
            question={questions[step.index]}
            responseId={responseId}
            questionNumber={step.index + 1}
            totalQuestions={questions.length}
            preferredMode={preferredMode}
            onModeChange={setPreferredMode}
            onAnswered={() => advancePastQuestion(step.index)}
          />
        )}

        {step.kind === "reward" && (
          <RewardStep
            business={business}
            customerName={customerName}
            customerEmail={customerEmail}
            customerPhone={customerPhone}
          />
        )}
      </main>
    </div>
  );
}
