import { getCurrentBusiness } from "@/lib/supabase/queries";
import { QrPanel } from "./qr-panel";

export default async function QrPage() {
  const business = await getCurrentBusiness();
  if (!business) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">QR & Link</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Print this at your counter or share the link directly.
      </p>
      <div className="mt-6">
        <QrPanel business={business} />
      </div>
    </div>
  );
}
