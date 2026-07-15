import { getCurrentBusiness, getResponsesWithAnswers, getAllQuestions } from "@/lib/supabase/queries";
import { CustomersTable } from "./customers-table";

export default async function CustomersPage() {
  const business = await getCurrentBusiness();
  if (!business) return null;

  const [responses, questions] = await Promise.all([
    getResponsesWithAnswers(business.id),
    getAllQuestions(business.id),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
      <p className="mt-1 text-sm text-muted-foreground">Everyone who has submitted a testimonial.</p>
      <div className="mt-6">
        <CustomersTable initialResponses={responses} questions={questions} />
      </div>
    </div>
  );
}
