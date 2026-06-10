# SKILL: azure-functions-endpoint

**Versão:** 1.0 (Alpha)  
**Nível:** Domain  
**Data:** 2026-06-10  
**Responsável:** Tech Lead  
**Status:** Testado com Copilot — v2 disponível com melhorias de clareza

---

## Contexto

### O que é uma Azure Function HTTP trigger

Uma Azure Function HTTP trigger é o padrão de endpoint de API deste projeto. Toda API que o assistente NovaTech expõe — incluindo o endpoint de query RAG, health check e motor de cálculo — usa este padrão.

**Quando usar:**
- Para expor uma operação como endpoint HTTP (POST, GET)
- Para receber requests do Azure Bot Service ou de sistemas externos
- Para criar APIs serverless sem gerenciar infraestrutura de servidor

**Quando NÃO usar:**
- Para lógica de negócio complexa — a Azure Function chama um service, não contém a lógica
- Para processamento de longa duração (>5min) — use Azure Durable Functions nesse caso
- Para operações de background sem trigger HTTP — use Timer Trigger ou Queue Trigger

---

## Decisões técnicas incorporadas

Estas decisões vêm do `AGENTS.md` e se aplicam obrigatoriamente a todo endpoint:

| Decisão | Regra |
|---------|-------|
| TypeScript strict | `"strict": true` no tsconfig. NUNCA `any` type. |
| Validação com Zod | TODO request body e query params validados com Zod antes de usar |
| Logging com pino | NUNCA `console.log`. Sempre `logger.info()`, `logger.warn()`, `logger.error()` |
| Error handling estruturado | Erros tipados com código, nunca `new Error('string')` |
| Separação handler/service | Handler só orquestra request→validate→call service→response. Lógica fica no service. |
| Azure Functions v4 | Usar `app.http()` model, não o model legado de `function.json` |

---

## Padrão prescritivo

### ✓ DO — Endpoint correto

```typescript
// src/functions/register-user/handler.ts
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import pino from 'pino';
import { RegisterUserInputSchema } from './validator';
import { buildSuccessResponse, buildErrorResponse } from './response-builder';
import { UserService } from '../../services/user-service';

const logger = pino({ name: 'register-user' });

export async function registerUserHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const requestId = context.invocationId;
  logger.info({ requestId }, 'Register user request started');

  // 1. Validar input com Zod
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    logger.warn({ requestId }, 'Failed to parse JSON body');
    return buildErrorResponse(400, 'INVALID_JSON', 'Request body must be valid JSON');
  }

  const parseResult = RegisterUserInputSchema.safeParse(body);
  if (!parseResult.success) {
    logger.warn({ requestId, errors: parseResult.error.issues }, 'Input validation failed');
    return buildErrorResponse(400, 'VALIDATION_ERROR', parseResult.error.issues);
  }

  const input = parseResult.data;
  logger.info({ requestId, email: input.email }, 'Input validated');

  // 2. Chamar service (lógica de negócio fora do handler)
  try {
    const result = await UserService.register(input);
    logger.info({ requestId, userId: result.id }, 'User registered successfully');
    return buildSuccessResponse(201, result);
  } catch (err) {
    logger.error({ requestId, err }, 'Failed to register user');
    return buildErrorResponse(500, 'INTERNAL_ERROR', 'Registration failed');
  }
}

app.http('register-user', {
  methods: ['POST'],
  authLevel: 'function',
  handler: registerUserHandler,
});
```

```typescript
// src/functions/register-user/validator.ts
import { z } from 'zod';

export const RegisterUserInputSchema = z.object({
  email: z.string().email('Must be a valid email'),
  name: z.string().min(1, 'Name cannot be empty').max(100),
});

export type RegisterUserInput = z.infer<typeof RegisterUserInputSchema>;

export const RegisterUserOutputSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string().datetime(),
});

export type RegisterUserOutput = z.infer<typeof RegisterUserOutputSchema>;
```

```typescript
// src/functions/register-user/response-builder.ts
import { HttpResponseInit } from '@azure/functions';

export function buildSuccessResponse(status: number, body: unknown): HttpResponseInit {
  return {
    status,
    headers: { 'Content-Type': 'application/json' },
    jsonBody: { success: true, data: body },
  };
}

export function buildErrorResponse(
  status: number,
  code: string,
  details?: unknown
): HttpResponseInit {
  return {
    status,
    headers: { 'Content-Type': 'application/json' },
    jsonBody: { success: false, error: { code, details } },
  };
}
```

### ✗ DON'T — Padrões proibidos

```typescript
// ❌ DON'T: console.log em vez de pino
export async function badHandler(req: any, res: any) {
  console.log('Received request:', req.body);  // PROIBIDO
  const email = req.body.email;                // Sem validação
  console.error('Error occurred');             // PROIBIDO
}

// ❌ DON'T: any type
async function badHandler(request: any, context: any): Promise<any> {
  const data = request.body as MyType;  // Cast sem validação — PERIGOSO
}

// ❌ DON'T: lógica de negócio dentro do handler
export async function badHandler(request: HttpRequest) {
  const body = await request.json() as { email: string };
  // Lógica de negócio DENTRO do handler — NÃO FAÇA ISSO
  const user = await db.query(`SELECT * FROM users WHERE email = '${body.email}'`);
  if (!user) {
    await sendWelcomeEmail(body.email);  // Lógica aqui? Não!
  }
}

// ❌ DON'T: erro genérico sem código
return { status: 500, body: 'Something went wrong' };  // Sem estrutura, sem código
throw new Error('Database connection failed');           // Sem código de erro, sem contexto
```

### Anti-padrões comuns

1. **Lógica de negócio no handler** — O handler deve ter no máximo: parse JSON → validate → call service → build response. Qualquer `if/else` de negócio pertence ao service.

2. **Não tratar erro de `request.json()`** — `request.json()` pode lançar se o body não for JSON válido. Sempre envolva em try/catch separado da lógica principal.

3. **Usar `as` cast em vez de Zod** — `body as MyType` não valida em runtime. TypeScript faz type erasure. Use `ZodSchema.safeParse()`.

4. **Retornar 500 para erros de validação** — Input inválido do cliente → 400. Erro interno do sistema → 500. Nunca inverta.

5. **Logger sem `requestId`** — Sempre inclua `requestId` (derivado de `context.invocationId`) em todos os logs do handler para rastreabilidade em Azure Monitor.

6. **Import do Azure Functions errado** — Use `@azure/functions` v4 API. Não use o import legado `AzureFunction`, `Context` do v3.

---

## Dependências

```json
{
  "dependencies": {
    "@azure/functions": "^4.5.0",
    "zod": "^3.23.0",
    "pino": "^8.21.0"
  },
  "devDependencies": {
    "pino-pretty": "^11.0.0",
    "typescript": "^5.4.0",
    "vitest": "^1.6.0",
    "@types/node": "^20.0.0"
  }
}
```

### Imports obrigatórios

```typescript
// Handler
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import pino from 'pino';

// Validator
import { z } from 'zod';

// Tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
```

---

## Checklist de implementação

Antes de qualquer PR de endpoint, verifique cada item:

- [ ] Função tem `HttpRequest` e `InvocationContext` como parâmetros tipados (sem `any`)
- [ ] Input é validado com Zod via `ZodSchema.safeParse()` antes de usar qualquer campo
- [ ] `request.json()` está em try/catch separado com retorno 400 em caso de falha
- [ ] Todos os logs usam `pino` com `requestId` em cada chamada (nenhum `console.*`)
- [ ] Response de erro tem estrutura `{ success: false, error: { code, details } }`
- [ ] Response de sucesso tem estrutura `{ success: true, data: ... }`
- [ ] Lógica de negócio está em `services/`, não no handler
- [ ] Nenhum `any` type em nenhum arquivo da função
- [ ] `app.http()` registra o handler com `authLevel: 'function'`
- [ ] Testes Vitest cobrem: input válido (happy path), input inválido (400), erro do service (500)
