import Link from "next/link";

export default function CollectionNotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        This link doesn&apos;t look right
      </h1>
      <p className="max-w-sm text-muted-foreground">
        We couldn&apos;t find a business at this address. Double-check the QR
        code or link and try again.
      </p>
      <Link
        href="/"
        className="mt-2 text-sm font-medium underline underline-offset-4"
      >
        Go to Vouch
      </Link>
    </div>
  );
}
