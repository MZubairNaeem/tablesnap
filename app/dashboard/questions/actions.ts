"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireBusinessId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id)
    .single();
  if (!business) throw new Error("No business found");

  return { supabase, businessId: business.id as string };
}

export async function createQuestion(text: string) {
  const { supabase, businessId } = await requireBusinessId();

  const { count } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("business_id", businessId);

  const { data } = await supabase
    .from("questions")
    .insert({ business_id: businessId, text, sort_order: count ?? 0 })
    .select()
    .single();

  revalidatePath("/dashboard/questions");
  return data;
}

export async function updateQuestionText(questionId: string, text: string) {
  const supabase = await createClient();
  await supabase.from("questions").update({ text }).eq("id", questionId);
  revalidatePath("/dashboard/questions");
}

export async function toggleQuestionActive(questionId: string, isActive: boolean) {
  const supabase = await createClient();
  await supabase.from("questions").update({ is_active: isActive }).eq("id", questionId);
  revalidatePath("/dashboard/questions");
}

export async function deleteQuestion(questionId: string) {
  const supabase = await createClient();
  await supabase.from("questions").delete().eq("id", questionId);
  revalidatePath("/dashboard/questions");
}

export async function reorderQuestions(orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) => supabase.from("questions").update({ sort_order: index }).eq("id", id))
  );
  revalidatePath("/dashboard/questions");
}
