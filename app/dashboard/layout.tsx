import { redirect } from "next/navigation";
import { getCurrentBusiness } from "@/lib/supabase/queries";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const business = await getCurrentBusiness();

  if (!business) {
    redirect("/login");
  }

  return (
    <div className="flex h-svh">
      <DashboardSidebar business={business} />
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
