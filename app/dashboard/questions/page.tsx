import { getCurrentBusiness, getAllQuestions } from "@/lib/supabase/queries";
import { QuestionsManager } from "./questions-manager";

export default async function QuestionsPage() {
  const business = await getCurrentBusiness();
  if (!business) return null;

  const questions = await getAllQuestions(business.id);

  return <QuestionsManager initialQuestions={questions} />;
}
