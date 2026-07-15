"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { businessSettingsSchema, type BusinessSettingsValues } from "@/lib/validations/business";
import type { Business } from "@/lib/supabase/types";
import { updateBusiness } from "./actions";

export function SettingsForm({ business }: { business: Business }) {
  const [logoUrl, setLogoUrl] = useState(business.logo_url ?? "");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessSettingsValues>({
    resolver: zodResolver(businessSettingsSchema),
    defaultValues: {
      name: business.name,
      brand_color: business.brand_color,
      reward_text: business.reward_text ?? "",
      reward_code: business.reward_code ?? "",
      reward_terms: business.reward_terms ?? "",
    },
  });

  async function handleLogoChange(file: File) {
    setUploadingLogo(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "png";
    const path = `${business.id}/logo.${ext}`;

    const { error } = await supabase.storage
      .from("logos")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (!error) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("logos").getPublicUrl(path);
      setLogoUrl(`${publicUrl}?t=${Date.now()}`);
    }
    setUploadingLogo(false);
  }

  async function onSubmit(values: BusinessSettingsValues) {
    setSaved(false);
    await updateBusiness(business.id, {
      name: values.name,
      brand_color: values.brand_color,
      reward_text: values.reward_text || null,
      reward_code: values.reward_code || null,
      reward_terms: values.reward_terms || null,
      logo_url: logoUrl || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-2xl flex-col gap-6">
      <Card>
        <CardContent className="flex flex-col gap-4 px-6 py-6">
          <h2 className="text-sm font-semibold">Business profile</h2>

          <div className="flex items-center gap-4">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-lg font-semibold text-muted-foreground">
                {business.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <Label htmlFor="logo" className="cursor-pointer text-sm font-medium underline underline-offset-4">
                {uploadingLogo ? "Uploading..." : "Change logo"}
              </Label>
              <input
                id="logo"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploadingLogo}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoChange(file);
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Business name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="brand_color">Brand color</Label>
            <div className="flex items-center gap-3">
              <input
                id="brand_color"
                type="color"
                className="h-10 w-14 cursor-pointer rounded border"
                {...register("brand_color")}
              />
              <span className="text-sm text-muted-foreground">
                Used as the accent color on your public collection page.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 px-6 py-6">
          <h2 className="text-sm font-semibold">Reward</h2>

          <div className="space-y-1.5">
            <Label htmlFor="reward_text">Reward description</Label>
            <Input id="reward_text" placeholder="10% off your next visit" {...register("reward_text")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reward_code">Reward code</Label>
            <Input id="reward_code" placeholder="THANKYOU10" {...register("reward_code")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reward_terms">Terms</Label>
            <Textarea
              id="reward_terms"
              rows={3}
              placeholder="Valid for 30 days. One per customer."
              {...register("reward_terms")}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save changes"}
        </Button>
        {saved && <p className="text-sm text-muted-foreground">Saved.</p>}
      </div>
    </form>
  );
}
