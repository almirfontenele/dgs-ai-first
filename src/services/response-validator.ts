import pino from "pino";
import {
  AssistantResponseSchema,
  AssistantResponse,
  SAFE_FALLBACK,
} from "./response-schema";

const log = pino({ name: "response-validator" });

// Guardrail 2: detect "carga perigosa" + devolução affirmative responses.
// Matches variations: "devolução", "devolver", "pode devolver", "aceita devolução"
// and negatives: "não", "nao", "impossível", "não é possível"
const DANGEROUS_CARGO_PATTERN =
  /carga\s+perigosa/i;
const RETURN_AFFIRMATION_PATTERN =
  /devolu[cç][aã]o|devolver|pode\s+devolver|aceita\s+devolu[cç][aã]o/i;
const NEGATION_PATTERN =
  /\bn[aã]o\b|\bnão\s+é\s+poss[ií]vel\b|impossível|vedada|proibida/i;

function hasDangerousCargoPolicyViolation(answer: string): boolean {
  const mentionsDangerousCargo = DANGEROUS_CARGO_PATTERN.test(answer);
  const mentionsReturn = RETURN_AFFIRMATION_PATTERN.test(answer);
  const hasNegation = NEGATION_PATTERN.test(answer);

  // Block only when: mentions dangerous cargo + mentions return + NO negation present
  return mentionsDangerousCargo && mentionsReturn && !hasNegation;
}

export type ValidationResult =
  | { valid: true; response: AssistantResponse }
  | { valid: false; reason: string; response: AssistantResponse };

export function validateResponse(raw: unknown): ValidationResult {
  // Step 1: Validate structured output schema
  const parsed = AssistantResponseSchema.safeParse(raw);
  if (!parsed.success) {
    const reason = `Schema inválido: ${parsed.error.message}`;
    log.warn({ reason }, "Resposta rejeitada por falha no schema");
    return { valid: false, reason, response: SAFE_FALLBACK };
  }

  const response = parsed.data;

  // Guardrail 1: source_document must be present and non-empty (enforced by schema,
  // but an explicit check here makes the intent readable and the log message specific)
  if (!response.source_document || response.source_document === "N/A") {
    const reason = "Guardrail 1: source_document ausente ou inválido";
    log.warn({ reason }, "Resposta bloqueada");
    return { valid: false, reason, response: SAFE_FALLBACK };
  }

  // Guardrail 2: dangerous cargo + return affirmation without negation
  if (hasDangerousCargoPolicyViolation(response.answer)) {
    const reason =
      "Guardrail 2: resposta afirma devolução de carga perigosa sem negativa — violação POL-001";
    log.warn({ reason }, "Resposta bloqueada");
    return { valid: false, reason, response: SAFE_FALLBACK };
  }

  return { valid: true, response };
}
