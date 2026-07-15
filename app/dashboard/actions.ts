"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ResponseStatus } from "@/lib/supabase/types";

export async function updateResponseStatus(responseId: string, status: ResponseStatus) {
  const supabase = await createClient();
  await supabase.from("responses").update({ status }).eq("id", responseId);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/testimonials");
  revalidatePath("/dashboard/written");
  revalidatePath("/dashboard/customers");
}
