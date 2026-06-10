import { z } from "zod";

export const QueryInputSchema = z.object({
  question: z
    .string()
    .transform((s) => s.trim())
    .refine((s) => s.length > 0, "Question cannot be empty or whitespace")
    .refine((s) => s.length <= 500, "Question must be 500 characters or fewer"),
});

export const SourceSchema = z.object({
  document: z.string(),
  vigencia: z.string(),
});

export const QueryOutputSchema = z.object({
  answer: z.string(),
  sources: z.array(SourceSchema),
  confidence: z.number().min(0).max(1),
});

export type QueryInput = z.infer<typeof QueryInputSchema>;
export type QueryOutput = z.infer<typeof QueryOutputSchema>;
export type Source = z.infer<typeof SourceSchema>;
