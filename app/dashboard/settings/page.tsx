import { getCurrentBusiness } from "@/lib/supabase/queries";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const business = await getCurrentBusiness();
  if (!business) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Update your business profile, branding, and reward.
      </p>
      <div className="mt-6">
        <SettingsForm business={business} />
      </div>
    </div>
  );
}
