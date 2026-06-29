# Code Review — Exercício 3.1 (Desenvolvedor)

**Arquivo revisado:** `src/services/response-validator.ts` e `response-schema.ts`  
**Revisor:** Claude (chat)  
**Data:** 2026-06-29

---

## Versão inicial gerada pelo Copilot (antes da correção)

```typescript
// response-schema.ts (v1 — gerado pelo Copilot)
import { z } from "zod";

export const AssistantResponseSchema = z.object({
  answer: z.string(),
  source_document: z.string(),
  confidence_score: z.number(),
});

export type AssistantResponse = z.infer<typeof AssistantResponseSchema>;
```

```typescript
// response-validator.ts (v1 — gerado pelo Copilot)
import { AssistantResponseSchema, AssistantResponse } from "./response-schema";

export function validateResponse(raw: unknown): AssistantResponse | null {
  const parsed = AssistantResponseSchema.safeParse(raw);
  if (!parsed.success) {
    console.log("Schema inválido:", parsed.error.message);
    return null;
  }

  const response = parsed.data;

  // Guardrail 1
  if (!response.source_document) {
    console.log("Resposta sem fonte");
    return null;
  }

  // Guardrail 2
  if (
    response.answer.includes("carga perigosa") &&
    response.answer.includes("devolução")
  ) {
    console.log("Guardrail 2 ativado");
    return null;
  }

  return response;
}
```

---

## Problemas identificados

### Problema 1 — Schema aceita campos extras (sem `.strict()`)

**Tipo:** Falha de validação estrutural  
**Onde:** `response-schema.ts`, linha 4

Sem `.strict()`, o Zod descarta campos extras silenciosamente — o modelo pode enviar `{ answer, source_document, confidence_score, _internal_notes: "bypass guardrail" }` e a validação passa. Em sistemas de governança, campos desconhecidos devem ser rejeitados explicitamente.

**Correção aplicada:** Adicionar `.strict()` ao schema.

```typescript
// ANTES
export const AssistantResponseSchema = z.object({
  answer: z.string(),
  source_document: z.string(),
  confidence_score: z.number(),
});

// DEPOIS
export const AssistantResponseSchema = z
  .object({
    answer: z.string().min(1),
    source_document: z.string().min(1),
    confidence_score: z.number().min(0).max(1),
  })
  .strict();
```

---

### Problema 2 — `console.log` em vez de `pino`

**Tipo:** Violação do AGENTS.md (seção de logging)  
**Onde:** `response-validator.ts`, linhas 8, 15, 23

O AGENTS.md define `pino 8.x` como logger obrigatório para endpoints. `console.log` não tem nível de log, não é estruturado, e não integra ao Application Insights configurado no projeto.

**Correção aplicada:** Substituir todos os `console.log` por `pino` com nível `warn`.

```typescript
// ANTES
console.log("Schema inválido:", parsed.error.message);

// DEPOIS
import pino from "pino";
const log = pino({ name: "response-validator" });
log.warn({ reason }, "Resposta rejeitada por falha no schema");
```

---

### Problema 3 — Guardrail 2 trivialmente burlável (regex simplista)

**Tipo:** Falha lógica no guardrail  
**Onde:** `response-validator.ts`, Guardrail 2

A versão do Copilot checa `includes("carga perigosa") && includes("devolução")` — dois problemas:

1. **Não detecta variações:** "devolver", "aceita devolução", "pode devolver" não são capturadas.
2. **Não verifica a negativa:** Uma resposta como *"Carga perigosa: a devolução NÃO é aceita"* seria bloqueada incorretamente — o guardrail deve bloquear apenas respostas que **afirmam** a devolução sem negá-la.

**Correção aplicada:** Regex com cobertura de variações + verificação explícita de negação antes de bloquear.

```typescript
// ANTES
if (
  response.answer.includes("carga perigosa") &&
  response.answer.includes("devolução")
) {
  return null;
}

// DEPOIS
const DANGEROUS_CARGO_PATTERN = /carga\s+perigosa/i;
const RETURN_AFFIRMATION_PATTERN =
  /devolu[cç][aã]o|devolver|pode\s+devolver|aceita\s+devolu[cç][aã]o/i;
const NEGATION_PATTERN =
  /\bn[aã]o\b|\bnão\s+é\s+poss[ií]vel\b|impossível|vedada|proibida/i;

function hasDangerousCargoPolicyViolation(answer: string): boolean {
  return (
    DANGEROUS_CARGO_PATTERN.test(answer) &&
    RETURN_AFFIRMATION_PATTERN.test(answer) &&
    !NEGATION_PATTERN.test(answer)
  );
}
```

---

### Problema 4 — `null` como retorno em falha não força resposta segura

**Tipo:** Gap de UX/segurança  
**Onde:** `response-validator.ts`, return type

Retornar `null` quando há falha delega ao consumidor a responsabilidade de lidar com o caso — se o chamador não checar `null`, a resposta inválida pode vazar para o usuário. O validador deve sempre retornar uma resposta (seja a original válida ou o fallback seguro), nunca `null`.

**Correção aplicada:** Retornar `SAFE_FALLBACK` explícito em todos os ramos de falha, com tipo discriminado `ValidationResult`.

---

## Distinção: probabilístico vs determinístico

| Camada | Tipo | Garantia |
|--------|------|----------|
| Prompt do modelo | Probabilístico | *Tende* a incluir `source_document`, mas pode esquecer |
| Schema Zod + `.strict()` | Determinístico | *Sempre* rejeita respostas sem os campos corretos |
| Guardrail 1 (source_document) | Determinístico | *Sempre* bloqueia se fonte for vazia |
| Guardrail 2 (regex + negação) | Determinístico | *Sempre* bloqueia afirmação proibida de POL-001 |

O prompt diz ao modelo o que ele deve fazer. O harness garante que respostas fora do contrato *nunca chegam ao atendente*, independentemente do comportamento do modelo.
