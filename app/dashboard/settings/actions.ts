"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

interface UpdateBusinessInput {
  name: string;
  brand_color: string;
  reward_text: string | null;
  reward_code: string | null;
  reward_terms: string | null;
  logo_url?: string;
}

export async function updateBusiness(businessId: string, input: UpdateBusinessInput) {
  const supabase = await createClient();
  await supabase.from("businesses").update(input).eq("id", businessId);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/qr");
}
