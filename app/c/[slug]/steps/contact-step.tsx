"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Ticket, TicketHeader, TicketPerforation } from "@/components/ui/ticket";
import { createClient } from "@/lib/supabase/client";
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact";
import type { Business } from "@/lib/supabase/types";

interface ContactStepProps {
  business: Business;
  onSubmitted: (responseId: string, name: string, email: string, phone: string) => void;
}

export function ContactStep({ business, onSubmitted }: ContactStepProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", consent: false },
  });

  const consent = watch("consent");

  async function onSubmit(values: ContactFormValues) {
    setSubmitting(true);
    setSubmitError(null);

    const supabase = createClient();
    const responseId = crypto.randomUUID();

    const { error } = await supabase.from("responses").insert({
      id: responseId,
      business_id: business.id,
      customer_name: values.name,
      customer_email: values.email || null,
      customer_phone: values.phone || null,
      consent: values.consent,
    });

    if (error) {
      setSubmitError("That didn't save. Check your connection and tap continue again.");
      setSubmitting(false);
      return;
    }

    onSubmitted(responseId, values.name, values.email ?? "", values.phone ?? "");
  }

  return (
    <Ticket edge="bottom" className="pb-3">
      <TicketHeader business={business.name} meta="1 of 2" />
      <TicketPerforation />

      <div className="px-6 pt-5 pb-4">
        <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance">
          Get {business.reward_text || "a discount voucher"} for your review
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          First, so {business.name} knows who to thank.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" className="h-12 text-base" autoFocus {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email (optional)</Label>
            <Input id="email" type="email" className="h-12 text-base" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">WhatsApp number (optional)</Label>
            <Input id="phone" type="tel" className="h-12 text-base" {...register("phone")} />
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            This is so {business.name} can send you discount vouchers later, in exchange for
            testimonials like this one. Never used for marketing.
          </p>

          <div className="flex items-start gap-3 pt-1">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) =>
                setValue("consent", checked === true, { shouldValidate: true })
              }
              className="mt-0.5"
            />
            <Label htmlFor="consent" className="text-sm leading-snug font-normal text-muted-foreground">
              I&apos;m happy for {business.name} to share my video and name publicly.
            </Label>
          </div>
          {errors.consent && <p className="text-sm text-destructive">{errors.consent.message}</p>}

          {submitError && <p className="text-sm text-destructive">{submitError}</p>}

          <Button type="submit" size="xl" className="mt-1 w-full" disabled={submitting}>
            {submitting ? "One sec" : "Continue"}
          </Button>
        </form>
      </div>
    </Ticket>
  );
}
