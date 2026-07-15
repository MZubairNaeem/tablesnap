import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CollectionFlow } from "./collection-flow";

export const dynamic = "force-dynamic";

export default async function CollectionPage(props: PageProps<"/c/[slug]">) {
  const { slug } = await props.params;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!business) {
    notFound();
  }

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("business_id", business.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return <CollectionFlow business={business} questions={questions ?? []} />;
}
