"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TableTentPreview } from "@/components/table-tent-preview";
import type { Business } from "@/lib/supabase/types";

export function QrPanel({ business }: { business: Business }) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const publicUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/c/${business.slug}`;

  useEffect(() => {
    QRCode.toDataURL(publicUrl, {
      width: 1024,
      margin: 4,
      errorCorrectionLevel: "H",
    }).then(setQrDataUrl);
  }, [publicUrl]);

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const whatsappMessage = `We'd love your feedback! Leave a quick video review here: ${publicUrl}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 px-6 py-8">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="QR code" className="h-56 w-56 rounded-lg border" />
          ) : (
            <div className="h-56 w-56 animate-pulse rounded-lg bg-muted" />
          )}

          <div className="flex w-full items-center gap-2 rounded-lg border px-3 py-2">
            <p className="flex-1 truncate text-sm text-muted-foreground">{publicUrl}</p>
            <button onClick={copyLink} aria-label="Copy link">
              {copied ? (
                <Check className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Button
              render={
                <a href={qrDataUrl ?? undefined} download="vouch-qr-code.png">
                  <Download className="h-4 w-4" />
                  Download QR PNG
                </a>
              }
              nativeButton={false}
              className="flex-1"
              disabled={!qrDataUrl}
            />
            <Button
              render={
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Send via WhatsApp
                </a>
              }
              nativeButton={false}
              variant="outline"
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      <div>
        <p className="ticket-meta mb-3">Table-tent preview</p>
        <TableTentPreview business={business} qrDataUrl={qrDataUrl} />
      </div>
    </div>
  );
}
