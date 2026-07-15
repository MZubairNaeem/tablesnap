import { createClient } from "@/lib/supabase/server";
import type { Business, Question, ResponseWithAnswers } from "@/lib/supabase/types";

export async function getCurrentBusiness(): Promise<Business | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  return data;
}

export async function getResponsesWithAnswers(businessId: string): Promise<ResponseWithAnswers[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("responses")
    .select("*, answers(*)")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  return (data as ResponseWithAnswers[] | null) ?? [];
}

export async function getAllQuestions(businessId: string): Promise<Question[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("questions")
    .select("*")
    .eq("business_id", businessId)
    .order("sort_order", { ascending: true });

  return data ?? [];
}
