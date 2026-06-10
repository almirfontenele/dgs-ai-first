# AGENTS.md — NovaTech Logistics Assistant

**Versão:** 2.0  
**Data:** 2026-06-10  
**Projeto:** NovaTech — Assistente de Suporte Logístico  
**Repositório:** `db1/novatech-assistant`  
**Histórico:** v1.0 (2026-06-10) → v2.0 (2026-06-10) iterado após análise de aderência Copilot

> Este documento é a **constitution** do projeto. Todo agente de IA (GitHub Copilot, Claude Code) e toda specification DEVE ler e respeitar este documento antes de gerar qualquer artefato.
>
> **IMPORTANTE PARA AGENTES:** Leia cada seção completamente. As regras são prescritivas — use os exemplos de código DO como template literal, não como referência.

---

## 1. Project Overview

O NovaTech Logistics Assistant é um sistema RAG (Retrieval-Augmented Generation) que apoia atendentes da NovaTech Transportes no atendimento ao cliente. O assistente **consulta e orienta** — não registra chamados, não executa aprovações e não calcula valores financeiros diretamente.

### Escopo do assistente
- **Inclui:** Consulta de políticas de devolução (POL-001), orientação sobre frete especial (PROC-042-v2), verificação de SLA por tier, triagem de incidentes críticos.
- **Não inclui:** Cálculo determinístico de frete (delegado a Azure Function separada), registro de chamados (Azure DevOps), RBAC de aprovação, relatórios de BI.

### Stack resumido
- **LLM:** Azure OpenAI GPT-4o (temperatura 0)
- **Embeddings:** text-embedding-3-large
- **Vector Store:** ChromaDB (self-hosted em Container Apps)
- **Orquestração RAG:** LangChain (Python)
- **Endpoints:** Azure Functions **v4** (TypeScript) — **NÃO v3**
- **Bot:** Azure Bot Service + Teams

---

## 2. Tech Stack & Architecture

### Linguagens e runtimes

| Camada | Tecnologia | Versão mínima |
|--------|-----------|--------------|
| Endpoints de API | TypeScript | 5.x, strict mode **obrigatório** |
| Pipeline RAG | Python | 3.11+ |
| Testes de endpoints | Vitest | 1.x |
| Testes do pipeline | pytest | 7.x |
| Runtime de endpoints | Azure Functions | **v4 — NÃO USE v3** |
| Validação de input/output | Zod | 3.x |
| Logging de endpoints | pino | 8.x — **NUNCA console.log** |
| Orquestração RAG | LangChain | 0.2.x |
| Vector Store | ChromaDB | latest stable |

### ⚠️ Azure Functions: APENAS v4

**NUNCA use a API legada do Azure Functions v3.** O v3 usa `AzureFunction`, `Context`, `HttpRequest` do pacote legado e exporta `default`. Isso não funciona com nosso deploy.

```typescript
// ❌ DON'T — Azure Functions v3 API (NÃO USE)
import { AzureFunction, Context, HttpRequest } from "@azure/functions"; // ❌ import errado
const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest) {
    context.res = { status: 200, body: "ok" }; // ❌ API legada
};
export default httpTrigger; // ❌ export default

// ✓ DO — Azure Functions v4 API (USE SEMPRE)
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'; // ✓
export async function myHandler(
  request: HttpRequest,       // ✓ HttpRequest do v4
  context: InvocationContext  // ✓ InvocationContext, não Context
): Promise<HttpResponseInit> {
  return { status: 200, jsonBody: { ok: true } }; // ✓ return, não context.res
}
app.http('my-handler', { methods: ['POST'], authLevel: 'function', handler: myHandler }); // ✓
```

---

## 3. Coding Standards

> **Regra de uso de exemplos:** Quando este documento mostra um bloco `✓ DO`, use esse código como template. Quando mostra `❌ DON'T`, esse padrão está **proibido** no projeto.

### 3.1 TypeScript strict — obrigatório

**VOCÊ DEVE** configurar TypeScript com `strict: true` em todo `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "target": "ES2022",
    "module": "commonjs"
  }
}
```

**NUNCA use `any` type.** Use `unknown` com narrowing via Zod se precisar de tipo dinâmico.

```typescript
// ❌ DON'T
const data = req.body as MyType;       // Sem validação de runtime
function handle(req: any, res: any) {} // any proibido
const context = {} as any;             // any em testes proibido

// ✓ DO
const parseResult = MySchema.safeParse(req.body); // Zod valida em runtime
if (!parseResult.success) { return buildErrorResponse(400, 'VALIDATION_ERROR', parseResult.error.issues); }
const data: MyType = parseResult.data; // tipo seguro após validação
```

### 3.2 Logging — pino OBRIGATÓRIO, console PROIBIDO

**NUNCA use `console.log`, `console.error`, `console.warn` ou `console.info`** em nenhum arquivo TypeScript do projeto.

**VOCÊ DEVE** usar `pino` com campos estruturados. **SEMPRE inclua `requestId`** em todos os logs do handler.

```typescript
// ❌ DON'T — PROIBIDO EM TODO O PROJETO
console.log('Request received');
console.log('Processing:', data);
console.error('Error:', err);

// ✓ DO — PADRÃO OBRIGATÓRIO
import pino from 'pino';
const logger = pino({ name: 'nome-do-endpoint' });

// No handler — SEMPRE com requestId:
const requestId = context.invocationId;
logger.info({ requestId }, 'Request started');
logger.info({ requestId, email: input.email }, 'Input validated');
logger.warn({ requestId, errors: result.error.issues }, 'Validation failed');
logger.error({ requestId, err }, 'Service call failed');
```

### 3.3 Validação de input — Zod OBRIGATÓRIO

**VOCÊ DEVE** validar TODO input externo com Zod usando `safeParse()` (nunca `parse()` direto, pois lança exceção).

```typescript
// ❌ DON'T — Acesso direto sem validação
const email = req.body.email;          // PERIGOSO — não validado
const email = req.body?.email ?? '';   // PERIGOSO — ainda sem schema
if (!req.body.email) { ... }           // PERIGOSO — verificação manual sem schema

// ✓ DO — Validação Zod obrigatória
import { z } from 'zod';
const InputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
});

// Passo 1: parse JSON (pode falhar)
let body: unknown;
try {
  body = await request.json();
} catch {
  return buildErrorResponse(400, 'INVALID_JSON', 'Body must be valid JSON');
}

// Passo 2: validar schema (use safeParse, não parse)
const result = InputSchema.safeParse(body);
if (!result.success) {
  logger.warn({ requestId, errors: result.error.issues }, 'Validation failed');
  return buildErrorResponse(400, 'VALIDATION_ERROR', result.error.issues);
}
const input = result.data; // Agora é type-safe
```

### 3.4 Error handling — respostas estruturadas

**VOCÊ DEVE** retornar erros com estrutura `{ success: false, error: { code, details } }`.

**NUNCA retorne** string pura, objeto ad-hoc ou status sem corpo estruturado.

```typescript
// ❌ DON'T
return { status: 400, body: "Email is required" };           // String pura proibida
return { status: 500, body: "Internal server error" };       // Sem código
return { status: 400, body: { message: "invalid email" } };  // Sem estrutura padrão

// ✓ DO — Estrutura obrigatória de erro
// src/functions/[nome]/response-builder.ts
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

// Uso:
return buildErrorResponse(400, 'VALIDATION_ERROR', result.error.issues);
return buildErrorResponse(400, 'INVALID_JSON', 'Body must be valid JSON');
return buildErrorResponse(500, 'INTERNAL_ERROR', 'Service unavailable');

// ✓ DO — Estrutura obrigatória de sucesso
export function buildSuccessResponse(status: number, data: unknown): HttpResponseInit {
  return {
    status,
    headers: { 'Content-Type': 'application/json' },
    jsonBody: { success: true, data },
  };
}
```

### 3.5 Separação handler / service — regra de ouro

**O handler FAZ:**
1. Parseia o JSON do request
2. Valida o input com Zod
3. Chama um método do service
4. Retorna a resposta estruturada

**O handler NÃO FAZ:**
- Qualquer lógica de negócio (`if/else` além de validação)
- Acessa banco de dados diretamente
- Gera IDs, timestamps, slugs
- Chama múltiplos services com lógica de orquestração

```typescript
// ❌ DON'T — Lógica de negócio no handler
export async function badHandler(request: HttpRequest, context: InvocationContext) {
  const body = await request.json() as any;
  // ❌ Gerando dados no handler
  const id = Math.random().toString(36).substr(2, 9);
  const createdAt = new Date().toISOString();
  // ❌ Lógica de negócio no handler
  if (body.email.endsWith('@concorrente.com')) {
    return buildErrorResponse(403, 'FORBIDDEN');
  }
  return buildSuccessResponse(201, { id, email: body.email, createdAt });
}

// ✓ DO — Handler limpo, service faz a lógica
// src/functions/register-user/handler.ts
export async function registerUserHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const requestId = context.invocationId;
  logger.info({ requestId }, 'Register user started');

  let body: unknown;
  try { body = await request.json(); }
  catch { return buildErrorResponse(400, 'INVALID_JSON', 'Body must be valid JSON'); }

  const result = RegisterUserInputSchema.safeParse(body);
  if (!result.success) {
    logger.warn({ requestId, errors: result.error.issues }, 'Validation failed');
    return buildErrorResponse(400, 'VALIDATION_ERROR', result.error.issues);
  }

  try {
    const user = await UserService.register(result.data); // ✓ Service faz a lógica
    logger.info({ requestId, userId: user.id }, 'User registered');
    return buildSuccessResponse(201, user);
  } catch (err) {
    logger.error({ requestId, err }, 'Registration failed');
    return buildErrorResponse(500, 'INTERNAL_ERROR', 'Registration failed');
  }
}

// src/services/user-service.ts — lógica de negócio aqui
export class UserService {
  static async register(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const id = crypto.randomUUID();             // ✓ Lógica de geração no service
    const createdAt = new Date().toISOString(); // ✓ Timestamp no service
    // ... persistência, validações de negócio, etc.
    return { id, email: input.email, name: input.name, createdAt };
  }
}
```

### 3.6 Estrutura de pastas obrigatória

```
src/
├── functions/
│   └── [nome-da-funcao]/
│       ├── handler.ts          # APENAS orquestração de request/response
│       ├── validator.ts        # Schemas Zod para input/output
│       └── response-builder.ts # buildSuccessResponse e buildErrorResponse
├── services/                   # LÓGICA DE NEGÓCIO aqui
├── types/                      # Types e interfaces compartilhados
└── lib/
    └── logger.ts               # Instância pino configurada

tests/
├── unit/
├── integration/
└── fixtures/
```

### 3.7 Naming conventions

- Arquivos: `kebab-case.ts` — ex: `query-handler.ts`, `response-builder.ts`
- Classes: `PascalCase` — ex: `UserService`, `QueryHandler`
- Funções e variáveis: `camelCase` — ex: `buildErrorResponse`, `requestId`
- Constantes: `SCREAMING_SNAKE_CASE` — ex: `MAX_CONTEXT_TOKENS`
- Types/Interfaces: `PascalCase` + sufixo — ex: `RegisterUserInput`, `ErrorResponse`

---

## 4. Build & Deploy

### Comandos obrigatórios

```bash
npm ci           # instalar dependências
npm run build    # compilar TypeScript
npm test         # Vitest — TODOS devem passar antes de qualquer PR
npm run lint     # ESLint @typescript-eslint/strict
npm run typecheck  # tsc --noEmit
```

`npm test` e `npm run typecheck` DEVEM passar antes de qualquer commit. CI bloqueia PRs com falha.

### CI/CD

- **Branch strategy:** `feature/*` → PR obrigatório → main (1 approval + CI verde)
- **Conventional Commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- **Pipeline:** typecheck → lint → test → build (falha em qualquer etapa bloqueia)

---

## 5. Testing Standards

**VOCÊ DEVE** usar Vitest. Proibido: Jest, Mocha, qualquer outro framework.

Azure Functions DEVEM ser testáveis sem infraestrutura Azure. **NUNCA use `as any` em testes** — use tipos corretos ou mocks tipados.

```typescript
// ❌ DON'T — any nos testes
const context = { res: {} } as any;    // ❌ any proibido nos testes
const req = { body: {} } as any;       // ❌ any proibido

// ✓ DO — Mocks tipados
import { describe, it, expect, vi } from 'vitest';
import type { HttpRequest, InvocationContext } from '@azure/functions';

function mockRequest(body: unknown): Partial<HttpRequest> {
  return {
    json: vi.fn().mockResolvedValue(body),
    method: 'POST',
  };
}

function mockContext(): Partial<InvocationContext> {
  return { invocationId: 'test-invocation-id-123' };
}

describe('registerUserHandler', () => {
  it('returns 201 with user on valid input', async () => {
    const request = mockRequest({ email: 'a@b.com', name: 'Alice' });
    const response = await registerUserHandler(
      request as HttpRequest,
      mockContext() as InvocationContext
    );
    expect(response.status).toBe(201);
    expect((response.jsonBody as any).success).toBe(true);
    expect((response.jsonBody as any).data.email).toBe('a@b.com');
  });

  it('returns 400 on invalid email', async () => {
    const request = mockRequest({ email: 'not-an-email', name: 'Alice' });
    const response = await registerUserHandler(
      request as HttpRequest,
      mockContext() as InvocationContext
    );
    expect(response.status).toBe(400);
    expect((response.jsonBody as any).error.code).toBe('VALIDATION_ERROR');
  });
});
```

---

## 6. Context Management Rules

### Budget de contexto por query RAG

| Componente | Tokens reservados |
|-----------|-----------------|
| System prompt | ~4.000 tokens |
| Chunks ChromaDB (top-K=5) | ~8.000 tokens máximo |
| Histórico (últimas 3 turns) | ~2.000 tokens |
| Output reservado | ~2.000 tokens |
| **Total máximo** | **~16.000 tokens** |

### Regras obrigatórias

1. **Top-K máximo = 5.** NUNCA passe mais de 5 chunks para o LLM.
2. **Threshold = 0,75.** Chunks com score cosine < 0,75 são descartados.
3. **Histórico = 3 turns.** Turns mais antigos são truncados, não resumidos.
4. **Zero cálculos financeiros no LLM.** Delegue ao motor de cálculo (Azure Function).
5. **Fonte informal** → prefixe a resposta com `[Fonte: informal — confirme com documentação oficial]`.

---

## 7. MCP Servers

Servidores autorizados (ver `MCP-ARCHITECTURE.md` para detalhes e processo de aprovação):

| Server | Criticidade | Uso |
|--------|-----------|-----|
| `github` | Essential | Repositório, branches, PRs |
| `filesystem` | Essential | Arquivos do projeto (read-only) |
| `azureAiSearch` | Important | Busca semântica RAG |
| `azureOpenAI` | Essential | Completions e embeddings |
| `azureDevOps` | Important | Work items e boards |
| `confluence` | Nice-to-have | Documentação de negócio |

**Nenhum novo server sem aprovação do Tech Lead.** Ver processo em `MCP-ARCHITECTURE.md`.

---

## 8. Security Rules

1. **Secrets nunca em código** — Azure Key Vault ou `.env.local` (no `.gitignore`)
2. **Least privilege** — Ver `mcp-permissions-matrix.md`
3. **Input sempre validado com Zod** — TODO dado de origem externa
4. **Logs sem PII** — Nunca logue email, CPF, nome completo em texto plano
5. **Agentes não escrevem em sistemas transacionais** — Escrita requer ação humana explícita
