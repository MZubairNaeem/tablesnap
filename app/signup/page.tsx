"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupFormValues } from "@/lib/validations/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SignupPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { businessName: "", email: "", password: "" },
  });

  async function onSubmit(values: SignupFormValues) {
    setSubmitting(true);
    setFormError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { business_name: values.businessName } },
    });
    console.log("signup data", data, "error", error);

    if (error) {
      setFormError(error.message);
      setSubmitting(false);
      return;
    }

    if (!data.session) {
      // "Confirm email" is on for this project -- signUp succeeds but no
      // session is issued until the user clicks the confirmation link.
      setCheckEmail(true);
      setSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  if (checkEmail) {
    return (
      <div className="relative mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-4 px-6 py-10 text-center">
        <ThemeToggle className="absolute top-6 right-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted-foreground">
          We sent you a confirmation link. Click it to activate your account, then log in.
        </p>
        <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-6 px-6 py-10">
      <ThemeToggle className="absolute top-6 right-6" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create your Vouch account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;ll set up your first 9 questions automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="businessName">Business name</Label>
          <Input id="businessName" autoFocus {...register("businessName")} />
          {errors.businessName && (
            <p className="text-sm text-destructive">{errors.businessName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {formError && <p className="text-sm text-destructive">{formError}</p>}

        <Button type="submit" className="mt-2 h-11" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
          Log in
        </Link>
      </p>
    </div>
  );
}
