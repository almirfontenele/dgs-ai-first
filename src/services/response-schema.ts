import { z } from "zod";

// Structured output schema for the NovaTech assistant response.
// Rejects responses missing source_document before any content guardrail runs.
export const AssistantResponseSchema = z
  .object({
    answer: z.string().min(1),
    source_document: z.string().min(1),
    confidence_score: z.number().min(0).max(1),
  })
  .strict(); // rejects unknown fields — prevents model from smuggling extra keys

export type AssistantResponse = z.infer<typeof AssistantResponseSchema>;

export const SAFE_FALLBACK: AssistantResponse = {
  answer:
    "Não foi possível processar sua solicitação. Por favor, consulte um atendente humano.",
  source_document: "N/A",
  confidence_score: 0,
};
