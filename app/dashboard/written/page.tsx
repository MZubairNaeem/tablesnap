import { getCurrentBusiness, getResponsesWithAnswers, getAllQuestions } from "@/lib/supabase/queries";
import { AnswerGallery } from "@/components/answer-gallery";

export default async function WrittenResponsesPage() {
  const business = await getCurrentBusiness();
  if (!business) return null;

  const [responses, questions] = await Promise.all([
    getResponsesWithAnswers(business.id),
    getAllQuestions(business.id),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Written Responses</h1>
      <p className="mt-1 text-sm text-muted-foreground">Text answers your customers have submitted.</p>
      <div className="mt-6">
        <AnswerGallery variant="text" initialResponses={responses} questions={questions} />
      </div>
    </div>
  );
}
