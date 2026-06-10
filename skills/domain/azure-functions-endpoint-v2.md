# SKILL: azure-functions-endpoint

**Versão:** 2.0 (Beta — 80%+ aderência confirmada)  
**Nível:** Domain  
**Data:** 2026-06-10  
**Responsável:** Tech Lead  
**Status:** Iterado após análise de aderência Copilot — v1→v2 resolve 5 gaps

---

## Contexto

### O que é uma Azure Function HTTP trigger

Uma Azure Function HTTP trigger é o padrão de endpoint de API deste projeto. Toda API exposta pelo assistente NovaTech — endpoint de query RAG, health check, motor de cálculo — usa este padrão.

**Quando usar:**
- Para expor uma operação como endpoint HTTP (POST, GET)
- Para receber requests do Azure Bot Service ou de sistemas externos
- Para criar APIs serverless sem gerenciar infraestrutura de servidor

**Quando NÃO usar:**
- Para lógica de negócio complexa — a Azure Function chama um service, não contém a lógica
- Para processamento de longa duração (>5min) — use Azure Durable Functions
- Para operações de background sem trigger HTTP — use Timer Trigger ou Queue Trigger

---

## Decisões técnicas incorporadas

| Decisão | Regra obrigatória |
|---------|-----------------|
| TypeScript strict | `"strict": true` no tsconfig. NUNCA `any` type. |
| Validação com Zod | TODO request body validado com `safeParse()` antes de usar |
| Logging com pino | NUNCA `console.*`. SEMPRE `logger.info/warn/error()` com `requestId` |
| Error handling | Respostas estruturadas com `{ success: false, error: { code, details } }` |
| Separação handler/service | Handler orquestra; lógica de negócio no service |
| Azure Functions v4 | APENAS `app.http()` com `InvocationContext` — nunca API legada v3 |
| Status HTTP correto | POST criação → 201; GET → 200; Validação inválida → 400; Erro interno → 500 |

---

## Padrão prescritivo

### ✓ DO — Estrutura completa obrigatória

**Arquivo 1: `src/functions/[nome]/handler.ts`**

```typescript
// src/functions/register-user/handler.ts
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import pino from 'pino';
import { RegisterUserInputSchema } from './validator';
import { buildSuccessResponse, buildErrorResponse } from './response-builder';
import { UserService } from '../../services/user-service';

const logger = pino({ name: 'register-user' }); // ✓ instância única, com nome

export async function registerUserHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  // ✓ SEMPRE: requestId como primeira linha
  const requestId = context.invocationId;
  logger.info({ requestId }, 'Register user request started');

  // ✓ PASSO 1: parse JSON — pode falhar, em try/catch separado
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    logger.warn({ requestId }, 'Failed to parse JSON body');
    return buildErrorResponse(400, 'INVALID_JSON', 'Request body must be valid JSON');
  }

  // ✓ PASSO 2: validar schema com safeParse (NÃO parse — safeParse não lança exceção)
  const parseResult = RegisterUserInputSchema.safeParse(body);
  if (!parseResult.success) {
    // ✓ logger.warn no caminho de ERRO (não console.log, não omitir logging)
    logger.warn({ requestId, errors: parseResult.error.issues }, 'Input validation failed');
    return buildErrorResponse(400, 'VALIDATION_ERROR', parseResult.error.issues);
  }

  const input = parseResult.data;
  logger.info({ requestId, email: input.email }, 'Input validated, calling service');

  // ✓ PASSO 3: chamar service (lógica de negócio FORA do handler)
  try {
    const user = await UserService.register(input); // ✓ service gera id, timestamp, etc.
    logger.info({ requestId, userId: user.id }, 'User registered successfully');
    return buildSuccessResponse(201, user); // ✓ 201 para criação POST
  } catch (err) {
    logger.error({ requestId, err }, 'Registration service failed');
    return buildErrorResponse(500, 'INTERNAL_ERROR', 'Registration failed');
  }
}

app.http('register-user', {
  methods: ['POST'],
  authLevel: 'function', // ✓ NUNCA 'anonymous' em produção
  handler: registerUserHandler,
});
```

**Arquivo 2: `src/functions/[nome]/validator.ts`**

```typescript
// src/functions/register-user/validator.ts
import { z } from 'zod';

export const RegisterUserInputSchema = z.object({
  email: z.string().email('Must be a valid email'),
  name: z.string().min(1, 'Name cannot be empty').max(100),
});

export type RegisterUserInput = z.infer<typeof RegisterUserInputSchema>;
```

**Arquivo 3: `src/functions/[nome]/response-builder.ts`**

```typescript
// src/functions/register-user/response-builder.ts
import { HttpResponseInit } from '@azure/functions';

// ✓ Estrutura obrigatória de SUCESSO: { success: true, data: ... }
export function buildSuccessResponse(status: number, data: unknown): HttpResponseInit {
  return {
    status,
    headers: { 'Content-Type': 'application/json' },
    jsonBody: { success: true, data },
  };
}

// ✓ Estrutura obrigatória de ERRO: { success: false, error: { code, details } }
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

### Status HTTP obrigatórios

| Situação | Status |
|----------|--------|
| POST que CRIA um recurso | **201** Created |
| GET que RETORNA um recurso | **200** OK |
| Input inválido (Zod falhou) | **400** Bad Request |
| JSON malformado | **400** Bad Request |
| Erro interno / service falhou | **500** Internal Server Error |

### ✗ DON'T — Padrões proibidos

```typescript
// ❌ 1: Azure Functions v3 (API legada) — NÃO USE
import { AzureFunction, Context, HttpRequest } from "@azure/functions"; // ❌
const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest) => {
  context.res = { body: "ok" }; // ❌ context.res legado
};

// ❌ 2: console.log em qualquer parte — PROIBIDO
logger.info({ requestId }, 'request received');  // ✓ OK
console.log('Validation failed:', result.error); // ❌ PROIBIDO — inclusive no caminho de erro

// ❌ 3: pino sem requestId
const logger = pino();
logger.info('request received');        // ❌ sem requestId, não rastreável
pino().info('something happened');      // ❌ nova instância por chamada — ERRADO

// ❌ 4: acesso a body sem Zod
const email = req.body.email;           // ❌ sem validação de runtime
const body = await request.json() as MyType; // ❌ cast sem Zod não valida

// ❌ 5: request.json() sem try/catch
const body = await request.json();      // ❌ pode lançar para JSON inválido — não tratado

// ❌ 6: response sem estrutura padrão
return { status: 400, body: "Email required" };         // ❌ string pura
return { status: 201, jsonBody: user };                  // ❌ sem envelope success/data
return { status: 400, jsonBody: { message: "invalid" }}; // ❌ sem { error: { code } }

// ❌ 7: lógica de negócio no handler
const id = Math.random().toString(36).substr(2, 9); // ❌ geração de ID no handler
const createdAt = new Date().toISOString();          // ❌ timestamp no handler
```

### Anti-padrões comuns

1. **Nova instância `pino()` a cada chamada** — `pino()` deve ser instanciado **uma vez** fora do handler como `const logger = pino({ name: 'endpoint-name' })`.

2. **Omitir logging no caminho de erro** — Toda branch de erro DEVE ter `logger.warn` ou `logger.error`. Erros silenciosos são impossíveis de diagnosticar em produção.

3. **`parse()` em vez de `safeParse()`** — `ZodSchema.parse()` lança exceção se a validação falha. Use `safeParse()` que retorna `{ success, data/error }` sem lançar.

4. **`authLevel: 'anonymous'`** — Facilita desenvolvimento local mas é proibido em produção. Sempre `'function'`.

5. **Status 200 para criação** — POST que cria um recurso retorna 201, não 200. Copilot frequentemente usa 200 por default.

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

---

## Checklist de implementação

Antes de qualquer PR de endpoint:

- [ ] `const requestId = context.invocationId;` é a **primeira linha** do handler
- [ ] Todos os `logger.*` incluem `{ requestId }` como primeiro campo
- [ ] NENHUM `console.*` no arquivo
- [ ] `request.json()` está em try/catch **separado** do safeParse Zod
- [ ] `InputSchema.safeParse(body)` com checagem de `.success`
- [ ] `logger.warn` no caminho de erro de validação (não apenas no caminho de sucesso)
- [ ] `buildErrorResponse(status, code, details)` para todos os erros
- [ ] `buildSuccessResponse(status, data)` para sucesso
- [ ] POST de criação retorna **201** (não 200)
- [ ] `authLevel: 'function'` no `app.http()`
- [ ] Lógica de negócio está em `services/`, não no handler
- [ ] Testes Vitest cobrem: happy path (201), validação inválida (400), JSON inválido (400), service erro (500)

---

## Limitações conhecidas

| Limitação | Frequência | Mitigação |
|-----------|-----------|-----------|
| Copilot cria tudo em 1 arquivo em vez de 3 | ~40% | Crie os arquivos vazios antes de pedir ao Copilot |
| `authLevel: 'anonymous'` gerado por default | ~20% | Revisar sempre no checklist |
| pino sem `{ name: 'endpoint-name' }` | ~30% | Verificar na revisão de código |
