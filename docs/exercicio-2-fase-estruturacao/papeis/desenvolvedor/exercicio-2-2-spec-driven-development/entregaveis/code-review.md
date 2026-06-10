# Revisão Crítica — query.ts (Task 2.2.1.1)

**Desenvolvedor:** Almir Oliveira  
**Data:** 2026-06-09  
**Arquivos revisados:** `src/functions/query/handler.ts`, `src/functions/query/validator.ts`, `src/functions/query/response-builder.ts`  
**Gerado com:** GitHub Copilot (estrutura inicial) + revisão manual

---

## Resumo

A implementação da Task 2.2.1.1 produz um Azure Function com validação Zod e logging pino estruturado, organizado em três arquivos conforme a estrutura do Anexo C (`docs/anexos/anexo-c-estrutura-repositorio.md`): `validator.ts` (schemas Zod e tipos), `response-builder.ts` (helpers de erro e montagem de resposta), e `handler.ts` (trigger HTTP e registro do endpoint). O código compila e cobre os critérios de aceite básicos. No entanto, três pontos precisam de atenção antes de um code review real e antes de conectar as tasks 2–5 ao handler.

---

## Crítica 1: Logging de erros não carrega `requestId` para rastreabilidade

### Problema

O handler loga erros com `function`, `action`, `errorType` e `context`, mas não gera nem propaga um `requestId`. Em produção, com múltiplas requisições simultâneas, os logs de diferentes chamadas se misturam sem um identificador que as rastreie. Se um atendente relata "teve um erro às 10:32", não há como cruzar com o log exato daquela chamada.

Exemplo do que Copilot gerou inicialmente (sem requestId):
```typescript
logger.error({
  function: "query",
  action: "error",
  errorType: appError.type,
  context: appError.context,
  duration,
});
```

### Esperado

Todo ciclo de request deve gerar um `requestId` no início e propagá-lo em todos os logs do mesmo ciclo:

```typescript
import { randomUUID } from "crypto";

// No início do handler:
const requestId = randomUUID();

// Em cada log:
logger.warn({ function: "query", action: "validation_error", requestId, ... });
logger.info({ function: "query", action: "response_sent", requestId, ... });
logger.error({ function: "query", action: "error", requestId, ... });

// Na resposta de erro ao usuário:
return { status: 400, jsonBody: { error: "...", requestId } };
```

Assim o atendente pode fornecer o `requestId` ao suporte, que faz `grep requestId logs` e encontra todos os eventos daquela chamada específica.

### Impacto

- **Severidade:** Alta — impacta observability diretamente em produção
- **Esforço para corrigir:** Baixo (~15 min — gerar UUID no início do handler e passá-lo adiante)

---

## Crítica 2: Output placeholder pode passar na validação Zod com dados incorretos

### Problema

A implementação atual retorna um placeholder para enquanto as tasks 2–5 não estão conectadas:

```typescript
const response: QueryOutput = {
  answer: "Placeholder response — pipeline not yet connected.",
  sources: [],
  confidence: 0,
};
```

O problema é que `confidence: 0` é tecnicamente válido pelo schema Zod (`min(0).max(1)`), mas semânticamente incorreto — um `confidence` de 0 significa "nenhuma confiança" e pode ser interpretado pelo frontend como falha. Além disso, o placeholder responde HTTP 200, fazendo qualquer teste de ponta-a-ponta acreditar que o endpoint está funcional quando na verdade ainda não está.

### Esperado

Durante desenvolvimento, antes de conectar o pipeline, a função deveria retornar 503 para deixar claro que a feature está incompleta:

```typescript
// Enquanto pipeline não implementado:
if (!process.env.AZURE_OPENAI_ENDPOINT) {
  logger.warn({ function: "query", action: "pipeline_not_configured" });
  return {
    status: 503,
    jsonBody: { error: "Pipeline not yet configured." },
  };
}
```

Ou usar uma flag de feature:
```typescript
if (process.env.PIPELINE_ENABLED !== "true") {
  return { status: 503, jsonBody: { error: "Pipeline not ready." } };
}
```

### Impacto

- **Severidade:** Média — não quebra em produção mas engana testes de integração prematuros
- **Esforço para corrigir:** Muito Baixo (~5 min — adicionar guard no início do pipeline)

---

## Crítica 3: `safeParse` no output pode silenciar bugs de contrato

### Problema

O handler usa `QueryOutputSchema.safeParse(response)` e, se falhar, lança um `Error` genérico:

```typescript
const outputValidation = QueryOutputSchema.safeParse(response);
if (!outputValidation.success) {
  throw new Error(`Output schema violation: ${outputValidation.error.message}`);
}
```

O problema é duplo: (1) o erro lançado é uma `Error` genérica, não um `AppError` tipado, então cai no catch genérico e vira HTTP 500 sem contexto suficiente nos logs para identificar qual campo do output violou o schema. (2) Quando as tasks 2–5 forem integradas e retornarem um `confidence` como `string` em vez de `number` (erro comum em LLM output parsing), o log não vai mostrar qual campo falhou.

### Esperado

Logar os detalhes de validação do output antes de lançar:

```typescript
const outputValidation = QueryOutputSchema.safeParse(response);
if (!outputValidation.success) {
  logger.error({
    function: "query",
    action: "output_schema_violation",
    errors: outputValidation.error.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
      received: e.code,
    })),
    requestId,
  });
  return {
    status: 500,
    jsonBody: {
      error: "Internal error processing response. Please try again.",
      requestId,
    },
  };
}
```

Isso torna rastreável qual campo do output falhou (ex: `confidence` era `"high"` em vez de `0.9`), o que será valioso quando integrar o parsing da resposta do modelo na Task 2.2.1.5.

### Impacto

- **Severidade:** Média — sem contexto no log, bugs de output contract são difíceis de debugar
- **Esforço para corrigir:** Baixo (~10 min — substituir o throw por log + return estruturado)

---

## Outras Observações (Não Críticas)

- **Azure Functions v4 API:** O código usa corretamente `app.http()` e `HttpRequest.json()` da API v4 (model programático), que é diferente do model baseado em `host.json`. Boa escolha.
- **`z.string().transform().refine()`:** A combinação de `transform` (trim) com dois `refine` separados funciona, mas Zod v3 executa refinements após transforms. Considerar usar `z.string().trim().min(1).max(500)` que é equivalente e mais idiomático para validações de range.
- **`await request.json().catch(() => null)`:** Boa prática — evita que erros de parse de JSON não-tratados cheguem ao catch externo como um erro ambíguo.

---

## Checklist de Correção Antes de Code Review Real

- [x] Adicionar `requestId = randomUUID()` no início do handler e propagar em todos os logs e respostas de erro
- [x] Substituir placeholder 200 por 503 guard enquanto pipeline não configurado (`AZURE_OPENAI_ENDPOINT` ausente → 503)
- [x] Substituir `throw new Error()` no output validation por log estruturado + return 500 com contexto (`buildSuccessResponse` em `response-builder.ts`)
- [x] Reestruturar em módulos conforme Anexo C: `handler.ts`, `validator.ts`, `response-builder.ts`
- [ ] Verificar que `npm run build` passa sem erros após as correções

---

## Processo com Copilot

**Prompt para geração do código:** "Implemente a Task 2.2.1.1: Azure Function HTTP (POST /api/query) com validação Zod de input (`question: string, 1-500 chars`) e output (`answer, sources, confidence`), logging estruturado com pino, e error handling para 400/500. Use Azure Functions v4 API programática (app.http). TypeScript, sem console.log."

**Output gerado:** O Copilot gerou um único arquivo `src/functions/query.ts` com a estrutura correta (`app.http()`, `safeParse`, pino), mas com três problemas identificados durante a revisão manual e sem respeitar a estrutura modular do Anexo C:

1. Nenhum `requestId` gerado — logs de diferentes requisições simultâneas seriam indistinguíveis
2. Placeholder retornava HTTP 200, o que fazia testes de integração acreditar que o pipeline estava operacional
3. `safeParse` no output lançava `Error` genérico sem logar qual campo falhou

**O que foi mantido do output:** Estrutura de `app.http()`, padrão de `safeParse` para input, integração do pino, separação entre `error.message` (logs) e `userMessage` (resposta ao usuário).

**O que foi descartado/reescrito:** Os três pontos acima foram documentados como críticas e corrigidos: (1) `requestId` adicionado com `randomUUID()` propagado em todos os logs; (2) guard de 503 substituiu placeholder 200; (3) `buildSuccessResponse` em `response-builder.ts` faz log estruturado dos erros de output. Além disso, o arquivo único foi refatorado nos três módulos do Anexo C: `validator.ts`, `response-builder.ts` e `handler.ts`.

**Iteração:** Após identificar o problema do `requestId`, um prompt pediu ao Copilot para gerar o padrão de propagação de `requestId` em todos os logs e na resposta de erro. O output (seção "Esperado" da Crítica 1) foi incorporado diretamente ao documento.

## Tempo Estimado para Corrigir

| Crítica | Tempo |
|---------|-------|
| 1 — requestId | ~15 min |
| 2 — Placeholder guard | ~5 min |
| 3 — Output validation log | ~10 min |
| **Total** | **~30 min** |

---

## Impacto Geral

Após corrigir os três pontos:
- ✓ Rastreabilidade completa: cada request tem ID propagado em todos os logs e na resposta de erro
- ✓ Estado de desenvolvimento claro: placeholder não engana testes de integração
- ✓ Output contract errors são diagnosticáveis via logs estruturados
- ✓ Código pronto para receber as tasks 2.2.1.2–5 sem risco de logs ambíguos
