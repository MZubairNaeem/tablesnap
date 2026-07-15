import { getCurrentBusiness, getResponsesWithAnswers, getAllQuestions } from "@/lib/supabase/queries";
import { StatCard } from "./stat-card";
import { RecentResponses } from "./recent-responses";

export default async function DashboardPage() {
  const business = await getCurrentBusiness();
  if (!business) return null;

  const [responses, questions] = await Promise.all([
    getResponsesWithAnswers(business.id),
    getAllQuestions(business.id),
  ]);

  const totalResponses = responses.length;
  const videoTestimonials = responses.reduce(
    (sum, r) => sum + r.answers.filter((a) => a.video_url).length,
    0
  );
  const writtenResponses = responses.reduce(
    (sum, r) => sum + r.answers.filter((a) => a.text_answer).length,
    0
  );

  const activeQuestionIds = questions.filter((q) => q.is_active).map((q) => q.id);
  const completedResponses = responses.filter((r) =>
    activeQuestionIds.every((qId) => r.answers.some((a) => a.question_id === qId))
  );
  const completionRate =
    totalResponses === 0 ? 0 : Math.round((completedResponses.length / totalResponses) * 100);

  const pending = responses.filter((r) => r.status === "pending").length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="font-display text-2xl font-semibold tracking-tight">The pass</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {pending > 0
          ? `${pending} ticket${pending === 1 ? "" : "s"} waiting on the rail.`
          : "The rail is clear. Nothing waiting to review."}
      </p>

      <div className="mt-6 grid grid-cols-2 divide-x divide-y divide-line overflow-hidden rounded-md border border-line bg-card sm:grid-cols-4 sm:divide-y-0">
        <StatCard label="Total" value={String(totalResponses)} />
        <StatCard label="Video" value={String(videoTestimonials)} />
        <StatCard label="Written" value={String(writtenResponses)} />
        <StatCard label="Completion" value={`${completionRate}%`} />
      </div>

      <div className="mt-8">
        <h2 className="ticket-meta mb-3">On the rail</h2>
        <RecentResponses initialResponses={responses} questions={questions} />
      </div>
    </div>
  );
}
