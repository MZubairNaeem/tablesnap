import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z
    .union([z.literal(""), z.string().email("Please enter a valid email")])
    .optional(),
  phone: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "Please confirm consent to continue",
  }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
