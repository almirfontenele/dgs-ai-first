# SKILL: Error Handling & Recovery

**Camada:** Foundation (F1)  
**Status:** Mandatory  
**Mantido por:** Tech Lead  
**Última atualização:** 2026-06-09  
**Próxima revisão:** 2026-08-09

---

## TL;DR

Erros são tipados, contextualizados, logados com campos estruturados, e retornam mensagem amigável ao usuário — nunca stack traces ou internals.

**Regra de Ouro:** "O usuário vê mensagem clara. O dev vê logs ricos. Ninguém vê internals."

---

## Context

Neste projeto:
- Agentes de IA (local e cloud) e atendentes humanos consomem endpoints Azure Functions
- Erros ocorrem em múltiplos pontos: validação de input, chamadas a Azure OpenAI, Azure AI Search, Confluence
- Alguns erros são transientes e retryáveis (timeout de rede, rate limit); outros são definitivos (input inválido, não autorizado)
- Logs precisam ser queryáveis em Azure Monitor — campos estruturados, não texto livre
- Um `requestId` rastreia toda a cadeia de eventos de uma requisição para suporte e debugging

---

## Core Rules

### Rule 1: Erros são tipados

Toda exceção que você captura deve ser mapeada para um tipo de `AppError` antes de qualquer logging ou resposta.

**DO:**
```typescript
type ErrorType =
  | "VALIDATION_ERROR"       // Input inválido — não retryável
  | "EXTERNAL_SERVICE_ERROR" // Azure timeout/rate limit — retryável
  | "NOT_FOUND"              // Recurso não existe — não retryável
  | "UNAUTHORIZED"           // Sem permissão — não retryável
  | "SERVER_ERROR";          // Bug interno — às vezes retryável

interface AppError {
  type: ErrorType;
  message: string;             // Para logs (detalhe técnico)
  userMessage: string;         // Para o usuário (sem detalhes internos)
  context: Record<string, unknown>;  // Dados para debugging
  timestamp: string;
  requestId?: string;
}

const validationError = (message: string, context?: Record<string, unknown>): AppError => ({
  type: "VALIDATION_ERROR",
  message,
  userMessage: "Please check your input and try again.",
  context: context ?? {},
  timestamp: new Date().toISOString(),
});

const externalServiceError = (message: string, context?: Record<string, unknown>): AppError => ({
  type: "EXTERNAL_SERVICE_ERROR",
  message,
  userMessage: "Service temporarily unavailable. Please try again in a few seconds.",
  context: context ?? {},
  timestamp: new Date().toISOString(),
});

const serverError = (message: string, context?: Record<string, unknown>): AppError => ({
  type: "SERVER_ERROR",
  message,
  userMessage: "We're having trouble processing your request. Please try again.",
  context: context ?? {},
  timestamp: new Date().toISOString(),
});
```

**DON'T:**
```typescript
// ❌ Throw sem tipo
throw new Error("Something went wrong");

// ❌ Expor mensagem técnica ao usuário
return { error: error.message };  // Pode revelar stack trace ou path interno

// ❌ Re-throw sem capturar contexto
} catch (error) {
  throw error;  // Perde contexto de onde falhou
}
```

---

### Rule 2: Padrão Catch → Log → Return (nunca throw após logar)

O padrão é sempre: identificar tipo → logar com contexto → retornar ao cliente. Não lançar após logar.

**DO:**
```typescript
const requestId = randomUUID();

try {
  const input = QueryInputSchema.safeParse(req.body);
  if (!input.success) {
    const appError = validationError("Input validation failed", {
      fields: input.error.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
    });

    // LOG: campos estruturados, requestId presente
    logger.warn({
      function: "query",
      action: "validation_error",
      errorType: appError.type,
      context: appError.context,
      requestId,
    });

    // RETURN: userMessage sem detalhes técnicos, mas com requestId para suporte
    return {
      status: 400,
      jsonBody: { error: appError.userMessage, requestId },
    };
  }
  // ... lógica de negócio ...
} catch (error) {
  const appError = serverError("Unexpected error", { error: String(error) });

  logger.error({
    function: "query",
    action: "error",
    errorType: appError.type,
    context: appError.context,
    requestId,
  });

  return {
    status: 500,
    jsonBody: { error: appError.userMessage, requestId },
  };
}
```

**DON'T:**
```typescript
// ❌ Log sem campos estruturados
logger.error("Error occurred: " + error);

// ❌ Log + throw (duplo tratamento)
logger.error({ error });
throw error;  // Vai ser logado novamente no catch externo

// ❌ Retornar sem requestId
return { status: 500, jsonBody: { error: "Internal error" } };  // Inrastreável
```

---

### Rule 3: Retry somente para erros retryáveis, com exponential backoff

**DO:**
```typescript
const isRetryable = (error: unknown): boolean => {
  const msg = String(error).toLowerCase();
  return (
    msg.includes("timeout") ||
    msg.includes("econnreset") ||
    msg.includes("rate limit") ||
    msg.includes("429") ||
    msg.includes("503")
  );
  // NOT retryable: validation errors, 401, 404, bugs de lógica
};

const retryExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  opts: { attempts: number; baseDelayMs: number; maxDelayMs: number; requestId?: string }
): Promise<T> => {
  let lastError: unknown;

  for (let i = 0; i < opts.attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRetryable(error)) throw error;  // Fail imediato se não retryável

      const delayMs = Math.min(opts.baseDelayMs * Math.pow(2, i), opts.maxDelayMs);

      logger.warn({
        action: "retry",
        attempt: i + 1,
        delayMs,
        error: String(error),
        requestId: opts.requestId,
      });

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
};

// Uso:
const embedding = await retryExponentialBackoff(
  () => azureOpenAI.getEmbedding(question),
  { attempts: 3, baseDelayMs: 1000, maxDelayMs: 10000, requestId }
);
```

**DON'T:**
```typescript
// ❌ Retry sem checar se é retryável
for (let i = 0; i < 3; i++) {
  try {
    return await validateInput(input);  // Validação não é retryável!
  } catch (error) {
    if (i < 2) await sleep(1000);
  }
}

// ❌ Delay fixo (não exponencial)
await sleep(1000);  // Sempre 1s independente da tentativa

// ❌ Retry sem log
for (let i = 0; i < 3; i++) {
  try { return await fn(); } catch {}  // Silencioso — invisível em produção
}
```

---

### Rule 4: HTTP status codes mapeados por tipo de erro

| ErrorType | HTTP Status | Retryável |
|-----------|:-----------:|:---------:|
| VALIDATION_ERROR | 400 | Não |
| UNAUTHORIZED | 401 | Não |
| NOT_FOUND | 404 | Não |
| EXTERNAL_SERVICE_ERROR | 503 | Sim |
| SERVER_ERROR | 500 | Às vezes |

**DO:**
```typescript
const httpStatusForErrorType = (type: ErrorType): number =>
  ({
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    EXTERNAL_SERVICE_ERROR: 503,
    SERVER_ERROR: 500,
  }[type]);
```

**DON'T:**
```typescript
// ❌ Sempre 500 para qualquer erro
return { status: 500, jsonBody: { error: "Error" } };

// ❌ 200 com campo de erro no body (confunde clientes)
return { status: 200, jsonBody: { success: false, error: "..." } };
```

---

### Rule 5: Logs incluem requestId e campos rastreáveis

Cada request deve ter um `requestId` gerado no início e propagado em todos os logs do mesmo ciclo.

**DO:**
```typescript
import { randomUUID } from "crypto";

// No início de cada handler:
const requestId = randomUUID();

// Em todo log do ciclo:
logger.info({ function: "query", action: "input_validated", questionLength: 42, requestId });
logger.warn({ function: "query", action: "retry", attempt: 1, requestId });
logger.error({ function: "query", action: "error", errorType: "SERVER_ERROR", requestId });

// Em respostas de erro ao usuário (para que possam reportar ao suporte):
return { status: 500, jsonBody: { error: "...", requestId } };
```

**DON'T:**
```typescript
// ❌ Log sem requestId (impossível rastrear em prod com múltiplas req simultâneas)
logger.error({ message: "failed to fetch embedding" });

// ❌ Log com API key ou dados sensíveis
logger.error({ apiKey: process.env.AZURE_OPENAI_API_KEY, error });

// ❌ requestId não propagado para resposta (usuário não pode reportar)
return { status: 500, jsonBody: { error: "Something went wrong" } };
```

---

## Anti-Patterns

### Anti-Pattern 1: Mensagem genérica para o usuário sem actionability

**Problema:**
```typescript
return { status: 400, jsonBody: { error: "Bad request" } };
```
O usuário não sabe o que corrigir. Se a pergunta excedeu 500 caracteres, diga isso.

**Correto:**
```typescript
const appError = validationError("Question too long", {
  questionLength: question.length,
  maxLength: 500,
});
// userMessage: "Please check your input and try again."  ← acionável
// context no log: questionLength=523, maxLength=500    ← debugável
```

---

### Anti-Pattern 2: Expor stack trace ou path interno ao usuário

**Problema:**
```typescript
return {
  status: 500,
  jsonBody: {
    error: `TypeError: Cannot read properties of undefined (reading 'embedding') at Object.getEmbedding (src/services/embedding.ts:42:18)`
  }
};
```
Expõe estrutura do código, facilita engenharia reversa, e não ajuda o usuário.

**Correto:**
```typescript
logger.error({
  function: "query",
  action: "error",
  context: { stack: error.stack },  // Dev vê no log
  requestId,
});

return {
  status: 500,
  jsonBody: {
    error: "We're having trouble processing your request.",  // Usuário vê mensagem genérica
    requestId,  // Usuário fornece ao suporte para lookup no log
  },
};
```

---

### Anti-Pattern 3: Retry para erros não-retryáveis

**Problema:**
```typescript
// ❌ Retentando validação de schema — o resultado nunca muda
for (let i = 0; i < 3; i++) {
  const result = QueryInputSchema.safeParse(req.body);
  if (result.success) return result.data;
  if (i < 2) await sleep(1000);
}
```
Validação é determinística: se falhou uma vez, vai falhar 3 vezes. Desperdiça 2s e confunde logs.

**Correto:**
```typescript
const result = QueryInputSchema.safeParse(req.body);
if (!result.success) {
  // Sem retry — responde imediatamente
  return { status: 400, jsonBody: { error: "...", requestId } };
}
```

---

### Anti-Pattern 4: Falha silenciosa em operações opcionais

**Problema:**
```typescript
try {
  await logAnalyticsEvent(event);
} catch {
  // silencioso — nem sabemos que analytics falhou
}
```
Quando analytics parar de funcionar, ninguém saberá por semanas.

**Correto:**
```typescript
try {
  await logAnalyticsEvent(event);
} catch (error) {
  // Loga como warn (não erro crítico), mas não é silencioso
  logger.warn({
    function: "query",
    action: "analytics_failed",
    error: String(error),
    requestId,
  });
  // Continua — analytics não é crítico para a resposta ao usuário
}
```

---

## Checklist

Ao implementar qualquer função que acessa sistemas externos ou processa input de usuário:

- [ ] Todos os tipos de erro estão definidos (`ErrorType` enum/union)
- [ ] Cada `catch` mapeia para um `AppError` com `type`, `message`, `userMessage`, `context`
- [ ] Cada `catch` loga com: `function`, `action`, `errorType`, `context`, `requestId`
- [ ] Resposta ao usuário não contém stack trace, path interno ou detalhes técnicos
- [ ] Resposta de erro contém `requestId` para rastreabilidade
- [ ] Retry somente em caminhos com `isRetryable(error)` verificado
- [ ] Retry usa exponential backoff (não delay fixo)
- [ ] Falhas opcionais (analytics, logging secundário) são logadas como `warn`, não silenciadas
- [ ] Testes cobrem happy path E pelo menos 2 cenários de erro

---

## Exemplos por Contexto do Projeto

### Azure OpenAI — Timeout no embedding

```typescript
try {
  const embedding = await retryExponentialBackoff(
    () => azureOpenAI.getEmbedding(question),
    { attempts: 3, baseDelayMs: 1000, maxDelayMs: 10000, requestId }
  );
  logger.info({ function: "query", action: "embedding_success", duration: elapsed, requestId });
  return embedding;
} catch (error) {
  const appError = externalServiceError("Failed to generate embedding", {
    service: "Azure OpenAI",
    operation: "getEmbedding",
    attempts: 3,
    error: String(error),
  });
  logger.error({ function: "query", action: "embedding_failed", errorType: appError.type, context: appError.context, requestId });
  return { status: 503, jsonBody: { error: appError.userMessage, requestId } };
}
```

### Zod — Validação de input

```typescript
const parseResult = QueryInputSchema.safeParse(rawBody);
if (!parseResult.success) {
  const appError = validationError("Input validation failed", {
    fields: parseResult.error.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
  });
  logger.warn({ function: "query", action: "validation_error", errorType: appError.type, context: appError.context, requestId });
  return { status: 400, jsonBody: { error: appError.userMessage, details: appError.context.fields, requestId } };
}
```

---

## Processo com Copilot

**Prompt inicial:** "Escreva uma Foundation Skill de Error Handling para um projeto TypeScript com Azure Functions e Azure SDK. Inclua: tipos de erro, padrão de catch/log/return, retry com exponential backoff, mapeamento de HTTP status codes e anti-padrões que LLMs costumam gerar errado. Formato: DO/DON'T com código TypeScript real."

**Output gerado:** O Copilot gerou 3 regras com exemplos de código, mas com dois problemas: (1) todos os erros mapeavam para HTTP 500; (2) retry sem verificar se o erro é retryável (o exemplo retentava validação de schema Zod, que é determinística).

**O que foi descartado:** A Rule 4 original do Copilot (mapeamento de status codes) foi reescrita para incluir todos os tipos de `ErrorType` com status correspondente — o Copilot mapeava apenas 500 e 400. O exemplo de retry foi inteiramente reescrito para incluir `isRetryable()`.

**O que foi adicionado manualmente:**
- Rule 5 (requestId em todos os logs) — ausente no output do Copilot
- Anti-Pattern 3 (retry para erros não-retryáveis com exemplo de Zod) — identificado ao revisar o código gerado pelo Copilot na task 2.2.1.1
- Anti-Pattern 4 (falha silenciosa em operações opcionais) — padrão recorrente em código gerado por LLMs
- Seção FAQ — perguntas que surgem naturalmente ao implementar as regras

**Iteração:** Após a versão inicial, um prompt pediu ao Copilot para gerar o exemplo de `retryExponentialBackoff` com log de `attempt` e `delayMs`. O output foi incorporado à Rule 3 com ajuste no log para incluir `requestId` (que o Copilot havia omitido).

## Related Skills

- **F2 — Logging & Observability:** define estrutura de campos nos logs (complementa Rule 5)
- **F3 — Env Config:** define como credenciais Azure são injetadas (nunca hardcoded em catch)
- **D1 — Azure Functions Endpoints:** define onde e como aplicar este padrão em handlers HTTP
- **A1 — Query Endpoint RAG:** exemplo concreto de toda esta skill aplicada ao fluxo de Q&A

---

## FAQ

**Q: Devo logar em todo `catch` ou apenas nos externos?**  
A: Logue em todo `catch` que esteja em uma boundary pública: entrada de request, chamada a serviço externo, acesso a banco. Não logue em helpers internos que relançam para o catch externo capturar.

**Q: Quantas tentativas de retry?**  
A: 3 tentativas com backoff 1s → 2s → 4s = 7s total. A maioria dos erros transientes de Azure resolve em < 5s. Mais de 3 raramente ajuda e aumenta latência para o usuário.

**Q: O usuário deve receber `requestId` em respostas de sucesso também?**  
A: Opcional, mas recomendado para endpoints de Q&A. Facilita correlação se o usuário reportar "a resposta que recebi às 14h32 estava errada".

**Q: Como diferenciar `SERVER_ERROR` retryável de não-retryável?**  
A: Erros de lógica interna (NullPointerException, schema violation) nunca são retryáveis. Erros de infraestrutura (connection reset, lock timeout em banco) às vezes são. Prefira o caminho conservador: se há dúvida, não retente e registre para análise.
