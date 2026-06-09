# Tarefa 2.3.3 — Criar SKILL.md Foundation com GitHub Copilot

## Objetivo

Usar GitHub Copilot para criar o SKILL.md Foundation mais importante do projeto: a skill que define convenções globais de error handling. Este SKILL.md será a base que todas as outras skills herdam.

## Contexto

Um SKILL.md é um documento prescritivo que ensina como fazer algo certo. Ao contrário de documentação genérica ("error handling é importante"), um SKILL.md é concreto:
- Contém código de exemplo (DO e DON'T)
- Contém anti-padrões (coisas que Copilot geraria de errado)
- Contém regras simples e testáveis
- Contém checklist de validação

O SKILL.md Foundation de "Error Handling" é especial porque todas as outras skills herdam dele. Define:
- Como estruturar erros (tipos de erro, campos obrigatórios)
- Como retornar erro ao usuário (sem expor internals)
- Como logar erro (com contexto)
- Quando retry vs. fail-fast

## Inputs

- Contexto do projeto (Azure, TypeScript, RAG, multi-role system)
- Exemplos de erros que podem ocorrer:
  - Validation errors (input inválido)
  - External service errors (Azure API timeout, rate limit)
  - Server errors (bug no código)
  - Authorization errors (usuário não tem permissão)
- Padrões do projeto (pino para logging, Zod para validation)

## Entregáveis

Um arquivo `SKILL-error-handling.md` com a seguinte estrutura:

```markdown
# SKILL: Error Handling & Recovery

## TL;DR

Erro é estruturado, contextualizado, loggado, e retornado ao usuário sem expor internals.

**Regra de Ouro:** "O usuário vê mensagem clara. O dev vê logs ricos. Ninguém vê internals."

---

## Context

Neste projeto:
- Agentes de IA (local e cloud) consomem endpoints Azure Functions
- Erros podem ocorrer em múltiplos pontos: validation, API calls, data processing
- Alguns erros são retryáveis (network timeout), outros não (input inválido)
- Logs devem ser queryáveis (estruturados) para debugging rápido

---

## Core Rules

### Rule 1: Errors Are Typed

**DO:**
```typescript
type ErrorType = 'VALIDATION_ERROR' | 'EXTERNAL_SERVICE_ERROR' | 'SERVER_ERROR' | 'NOT_FOUND';

interface AppError {
  type: ErrorType;
  message: string;        // User-friendly
  userMessage: string;    // What to show user
  context: Record<string, any>;  // Dev debugging info
  timestamp: string;
  requestId?: string;     // For tracing
}

const validationError = (message: string, context?: any): AppError => ({
  type: 'VALIDATION_ERROR',
  message,
  userMessage: 'Please check your input and try again.',
  context: context || {},
  timestamp: new Date().toISOString(),
});
```

**DON'T:**
```typescript
// ❌ Untyped error
throw new Error("Something went wrong");

// ❌ Exposing internals to user
userMessage: `Zod validation failed: ${error.message}`;

// ❌ No context for debugging
throw error;  // Generic re-throw
```

---

### Rule 2: Catch, Log, Transform

Sempre segue este padrão:

**DO:**
```typescript
try {
  const input = QueryInputSchema.parse(req.body);
  // ... business logic ...
} catch (error) {
  // CATCH: Identify error type
  let appError: AppError;
  
  if (error instanceof z.ZodError) {
    appError = validationError('Input validation failed', { 
      errors: error.errors.map(e => ({ path: e.path, message: e.message }))
    });
  } else if (isTimeoutError(error)) {
    appError = externalServiceError('Azure service timeout', { 
      service: 'OpenAI',
      duration: 10000,
      retryable: true
    });
  } else {
    appError = serverError('Internal error', { error: String(error) });
  }
  
  // LOG: Log with context
  logger.error({
    function: 'query',
    action: 'error',
    errorType: appError.type,
    message: appError.message,
    context: appError.context,
    requestId: appError.requestId,
  });
  
  // RETURN: User-friendly response
  return {
    status: httpStatusForErrorType(appError.type),
    body: { 
      error: appError.userMessage,
      requestId: appError.requestId,  // So user can provide to support
    }
  };
}
```

**DON'T:**
```typescript
// ❌ Generic catch
try {
  // ...
} catch (error) {
  console.log(error);  // Text logs, not structured
  res.status(500).json({ error: error.message });  // Exposing internals
}

// ❌ Throwing custom errors without logging
throw new AppError(...);  // No context captured

// ❌ Retrying without checking if retryable
retry(() => fetchFromAzure(), { attempts: 3 });  // Even if auth failed (not retryable)
```

---

### Rule 3: Retry Exponential Backoff (Only When Retryable)

**DO:**
```typescript
const retryExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  options: { attempts: number; baseDelayMs: number; maxDelayMs: number }
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i < options.attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if retryable
      if (!isRetryable(error)) {
        throw error;  // Fail immediately for non-retryable
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delayMs = Math.min(
        options.baseDelayMs * Math.pow(2, i),
        options.maxDelayMs
      );
      
      logger.warn({
        action: 'retry',
        attempt: i + 1,
        delayMs,
        error: String(error),
      });
      
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  throw lastError;
};

// Usage:
const embedding = await retryExponentialBackoff(
  () => azureOpenAI.getEmbedding(question),
  { attempts: 3, baseDelayMs: 1000, maxDelayMs: 10000 }
);
```

**DON'T:**
```typescript
// ❌ Retrying without checking if retryable
for (let i = 0; i < 3; i++) {
  try {
    return fetchFromAPI();
  } catch (error) {
    if (i < 2) await sleep(1000);  // Fixed delay, always retry
  }
}

// ❌ Retry that grows without limit
for (let i = 0; i < 10; i++) {
  await sleep(i * 1000);  // Can delay up to 45s!
}
```

---

### Rule 4: Error Types Map to HTTP Status

| ErrorType | HTTP Status | User Message | Retryable |
|-----------|-------------|--------------|-----------|
| VALIDATION_ERROR | 400 | "Please check your input" | No |
| UNAUTHORIZED | 401 | "You don't have permission" | No |
| NOT_FOUND | 404 | "Resource not found" | No |
| EXTERNAL_SERVICE_ERROR | 503 | "Service temporarily unavailable, please retry" | Yes |
| SERVER_ERROR | 500 | "Internal error, please try again" | Sometimes |

**DO:**
```typescript
const httpStatusForErrorType = (type: ErrorType): number => {
  const mapping: Record<ErrorType, number> = {
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    EXTERNAL_SERVICE_ERROR: 503,
    SERVER_ERROR: 500,
  };
  return mapping[type];
};
```

---

### Rule 5: Logs Include Request Context

**DO:**
```typescript
// Every error log must include these fields:
logger.error({
  function: 'query',           // Which function
  action: 'error',             // What action failed
  errorType: appError.type,    // Classification
  message: appError.message,   // What went wrong
  context: appError.context,   // Additional data for debugging
  duration: endTime - startTime, // How long before error
  requestId: appError.requestId,  // For tracing across services
});
```

**DON'T:**
```typescript
// ❌ Logs without function/action context
logger.error("Error: " + error);

// ❌ Exposing sensitive data in logs
logger.error({ apiKey: config.API_KEY, error });

// ❌ Logs with no request tracing
logger.error({ message: "failed to fetch" });
```

---

## Anti-Patterns

### Anti-Pattern 1: Generic Error Messages

**Problem:** `"An error occurred"` doesn't tell user what went wrong or if they can retry.

**Better:**
```typescript
// User sees actionable message
{
  error: "Please check your question (max 500 characters). If problem persists, try again in a few seconds."
}

// Dev sees debugging info
logger.error({
  errorType: 'VALIDATION_ERROR',
  context: { questionLength: 2050, maxLength: 500 }
});
```

---

### Anti-Pattern 2: Exposing Stack Traces to User

**Problem:**
```typescript
res.status(500).json({ 
  error: `Error: Cannot read property 'embedding' of undefined at Object.getEmbedding (embedding.ts:42)`
});
```

This tells user nothing useful and exposes code structure.

**Better:**
```typescript
res.status(500).json({
  error: "We're having trouble processing your question. Please try again.",
  requestId: "req_abc123"  // User can report this to support
});

logger.error({
  errorType: 'SERVER_ERROR',
  context: { stack: error.stack, line: 42 }  // Dev sees details
});
```

---

### Anti-Pattern 3: Retry Everything

**Problem:**
```typescript
try {
  return await validateInput(input);  // Can't be retried; input is invalid
} catch (error) {
  return retry(() => validateInput(input), { attempts: 3 });  // Pointless
}
```

Only retry transient errors (network, rate limit, timeout).

**Better:**
```typescript
const isRetryable = (error: any): boolean => {
  return (
    isNetworkError(error) ||
    isTimeoutError(error) ||
    isRateLimitError(error) ||
    isSQLDeadlock(error)
  );
  // NOT: validation errors, auth errors, not found
};
```

---

### Anti-Pattern 4: Silent Failures

**Problem:**
```typescript
try {
  await logToAnalytics(event);
} catch {
  // Silently swallow error; user doesn't know if event was tracked
}
```

If a step fails, log it (unless truly optional).

**Better:**
```typescript
try {
  await logToAnalytics(event);
} catch (error) {
  logger.warn({ action: 'analytics_logging_failed', error: String(error) });
  // Continue (analytics is not critical), but we know it failed
}
```

---

## Checklist

When implementing error handling:

- [ ] All error types are defined (enum or type)
- [ ] Every error has: type, message, userMessage, context
- [ ] Every catch block logs with: function, action, errorType, context
- [ ] User response has no stack trace or internals
- [ ] User response has requestId (for support)
- [ ] Retry logic only applies to retryable errors
- [ ] Retry uses exponential backoff (not linear)
- [ ] Logs are structured JSON (queryable)
- [ ] Tests cover both happy path and error paths

---

## Examples by Context

### Context: Azure OpenAI Embedding Timeout

**DO:**
```typescript
try {
  const embedding = await retryExponentialBackoff(
    () => azureOpenAI.getEmbedding(question),
    { attempts: 3, baseDelayMs: 1000, maxDelayMs: 10000 }
  );
} catch (error) {
  const appError = externalServiceError('Failed to generate embedding', {
    service: 'Azure OpenAI',
    operation: 'getEmbedding',
    attempts: 3,
    error: String(error),
  });
  
  logger.error({
    function: 'query',
    action: 'embedding_failed',
    errorType: appError.type,
    context: appError.context,
    duration: 33000,  // 3x 10s + backoff
  });
  
  return {
    status: 503,
    body: { error: appError.userMessage, requestId: uuid() }
  };
}
```

### Context: Input Validation (Zod)

**DO:**
```typescript
try {
  const input = QueryInputSchema.parse(req.body);
} catch (error) {
  if (error instanceof z.ZodError) {
    const appError = validationError('Input validation failed', {
      fields: error.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    
    logger.warn({
      function: 'query',
      action: 'validation_failed',
      errorType: appError.type,
      context: appError.context,
    });
    
    return {
      status: 400,
      body: { error: appError.userMessage }
    };
  }
}
```

---

## Related Skills

- Foundation: Logging & Observability (structure of logs)
- Foundation: Environment Configuration (error-related env vars)
- Domain: Azure Functions (how to return errors from functions)
- Artifact: Query Endpoint (example of error handling in RAG)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01 | Initial version; covers typed errors, logging, retry |
| — | — | — |

---

## FAQ

**Q: Should I catch all errors or let them bubble up?**
A: Catch at boundaries (API calls, external services). Don't catch internal logic errors; let them fail (they're bugs). Use try/catch at:
- Input validation
- External API calls (Azure OpenAI, Azure Search, etc)
- Database operations
- Authorization checks

**Q: How many retries?**
A: 3 retries with exponential backoff (1s, 2s, 4s) = 7s total. Most transient errors resolve in < 5s. More than 3 rarely helps.

**Q: Should I log on success too?**
A: Yes, but at info/debug level. Quick example: `logger.info({ function: 'query', action: 'embedding_success', duration: 245 })`. Helps with performance tracking.

**Q: Can I expose the database error to the user?**
A: No. User sees: "Error processing your request." Dev sees full error in logs with context.

---

## Owning This Skill

**Maintained By:** Tech Lead  
**Last Updated:** 2024-01-15  
**Next Review:** 2024-02-15  
**Contact:** [Tech Lead name or GitHub handle]
```

## Critérios de Aceite

- [ ] SKILL.md está bem estruturado (TL;DR, Context, Rules, Anti-Patterns, Checklist, Examples)
- [ ] Contém 4-5 core rules (prescritivas, não vagos)
- [ ] Contém 3+ anti-padrões com código (things Copilot would generate wrong)
- [ ] Contém exemplos concretos de DO e DON'T (não abstratos)
- [ ] Contém checklist testável (cada item pode ser verificado)
- [ ] Arquivo compila (se inclui código TypeScript)
- [ ] Linguagem é direta (não tem fluff)

## Passo a Passo

### Passo 1: Estruturar o documento
Crie um arquivo `SKILL-error-handling.md` com seções:
- TL;DR (one sentence rule)
- Context (why this matters for this project)
- Core Rules (4-5 prescritivas, com DO/DON'T)
- Anti-Patterns (3+ things developers get wrong)
- Checklist (how to validate you followed the skill)
- Examples (real-world scenarios)

### Passo 2: Definir core rules
Pergunte-se: "O que é OBRIGATÓRIO para error handling neste projeto?"

Exemplos:
- "Errors are typed (VALIDATION_ERROR, EXTERNAL_SERVICE, SERVER_ERROR)"
- "Every error is logged with context"
- "User never sees stack traces or internals"
- "Retry only happens for retryable errors (network, timeout), not validation"

### Passo 3: Usar Copilot para gerar exemplos
Abra um novo TypeScript file e adicione comentário:

```typescript
// SKILL: Error Handling
// - Errors are typed and structured
// - Logging includes function, action, errorType, context
// - User sees friendly message; dev sees full error in logs
// - Retry only for transient errors with exponential backoff
// - Status codes: 400 (validation), 401 (auth), 503 (service), 500 (server)
```

Posicione cursor e peça a Copilot para gerar:
- Error type definition
- Error helper functions (validationError, externalServiceError, etc)
- Try/catch pattern
- Retry function

Copilot deve gerar algo como:
```typescript
type ErrorType = 'VALIDATION_ERROR' | 'EXTERNAL_SERVICE_ERROR' | 'SERVER_ERROR';

const validationError = (message: string, context?: any) => ({
  type: 'VALIDATION_ERROR',
  message,
  userMessage: 'Please check your input and try again',
  context: context || {},
  timestamp: new Date().toISOString(),
});

try {
  // ... logic ...
} catch (error) {
  const appError = error instanceof ZodError 
    ? validationError(...) 
    : serverError(...);
  logger.error({ function, action, errorType: appError.type, context: appError.context });
  return { status: 400, body: { error: appError.userMessage } };
}
```

### Passo 4: Extrair para SKILL.md
Pegue o código gerado e coloque no SKILL.md como exemplos. Para cada rule:
- Explique por que existe (context)
- Mostre DO (código correto)
- Mostre DON'T (código que Copilot geraria)
- Explique diferença

### Passo 5: Adicionar anti-padrões
Pense: "O que desenvolvedor novato faria errado sem esta skill?"

Exemplos:
- "Generic error messages ('An error occurred')"
- "Exposing stack traces to user"
- "Retrying non-retryable errors"
- "Silent failures (catch without logging)"

Para cada anti-padrão, mostre código ruim e a forma certa.

### Passo 6: Validar com Claude
Cole seu SKILL.md num chat:

> "Estou criando um SKILL.md de error handling. Há algo faltando? Alguma regra que é muito rigorosa ou muito vaga? Algum anti-padrão que é mais comum que os que listei?"

Claude deve apontar gaps.

### Passo 7: Adicionar checklist
No final, crie checklist que um dev pode usar:

```
- [ ] Todos os erros têm um tipo (enum)
- [ ] Catch blocks logam com: function, action, errorType, context
- [ ] User nunca vê stack trace
- [ ] Retry só para erros retryáveis
- [ ] Exponential backoff (1s, 2s, 4s)
- [ ] Tests cobrem happy path e error paths
```

## Dicas para Trabalhar com Copilot

- **Seja muito específico no comentário:** "Error handling" é vago. "Define AppError interface with type, message, userMessage, context, timestamp. Create helper functions (validationError, externalServiceError). Implement try/catch that logs structured JSON." é específico.

- **Revise o gerado:** Copilot pode gerar coisas como `error.message` sem validação (pode ser undefined). Corrija.

- **Use seu próprio contexto:** Se seu projeto já tem convenções de error handling, mostre exemplos a Copilot. "Here's an existing error handler... extend it for Azure Functions."

## Validação Final

Antes de submeter:

- [ ] SKILL.md é compreensível por um dev novo
- [ ] Contém código que compila (se TypeScript)
- [ ] Contém checklist que é verificável
- [ ] Linguagem não tem jargão (ou explica jargão)
- [ ] Exemplos são relevantes ao projeto (Azure, RAG, multi-role)

## Referências

- [OWASP: Error Handling](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)
- [AWS: Error Handling Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/error-handling.html)
- Logging & Observability Foundation skill (Task 2.3.x)
- Azure Functions documentation
