import { z } from "zod";

export const businessSettingsSchema = z.object({
  name: z.string().min(1, "Please enter a business name"),
  brand_color: z.string().min(1),
  reward_text: z.string().optional(),
  reward_code: z.string().optional(),
  reward_terms: z.string().optional(),
});

export type BusinessSettingsValues = z.infer<typeof businessSettingsSchema>;
