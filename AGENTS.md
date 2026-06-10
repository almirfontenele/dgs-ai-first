# AGENTS.md — NovaTech Logistics Assistant

**Versão:** 1.0  
**Data:** 2026-06-10  
**Projeto:** NovaTech — Assistente de Suporte Logístico  
**Repositório:** `db1/novatech-assistant`

> Este documento é a **constitution** do projeto. Todo agente de IA (GitHub Copilot, Claude Code) e toda specification DEVE ler e respeitar este documento antes de gerar qualquer artefato.

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
- **Endpoints:** Azure Functions v4 (TypeScript) para APIs do assistente
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
| Runtime de endpoints | Azure Functions | v4 |
| Validação de input/output | Zod | 3.x |
| Logging de endpoints | pino | 8.x |
| Orquestração RAG | LangChain | 0.2.x |
| Vector Store | ChromaDB | latest stable |

### Infraestrutura

- **Hosting:** Azure Container Apps (ChromaDB) + Azure Functions (endpoints)
- **Storage:** Azure Blob Storage (planilhas, backups ChromaDB)
- **Monitoring:** Azure Monitor + Application Insights
- **CI/CD:** GitHub Actions

### Arquitetura de alto nível

```
Atendente (Teams)
     │
     ▼
Azure Bot Service
     │
     ▼
Azure Functions v4 — Endpoint de Query (TypeScript)
     │
     ▼
LangChain RAG Orchestrator (Python)
     │
     ├──▶ Azure OpenAI GPT-4o (temperatura 0)
     ├──▶ ChromaDB collection-normativo (POL, PROC, SLA)
     ├──▶ ChromaDB collection-informal (FAQ — fallback com aviso)
     └──▶ Azure Function — Motor de Cálculo (RF-004, RF-007)
```

### Collections ChromaDB

- `collection-normativo` — fonte de verdade, prioridade máxima, filtro `where={"status": "vigente"}`
- `collection-informal` — fallback quando normativo score < 0.75, sempre com aviso explícito ao atendente

---

## 3. Coding Standards

### TypeScript — Regras obrigatórias

**VOCÊ DEVE** configurar TypeScript com `strict: true` em todo `tsconfig.json`. Não existe exceção.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "target": "ES2022",
    "module": "commonjs"
  }
}
```

**NUNCA use `any` type.** Se precisar de tipo dinâmico, use `unknown` e faça narrowing explícito com Zod ou type guards.

### Validação de input/output — Zod obrigatório

**VOCÊ DEVE** validar TODO input externo com Zod antes de usar. "Input externo" = HTTP request body, query params, variáveis de ambiente, dados de serviços externos.

```typescript
// ✓ DO — Validação Zod antes de usar
import { z } from 'zod';

const QueryInputSchema = z.object({
  question: z.string().min(1).max(500),
  sessionId: z.string().uuid(),
  attendantId: z.string().min(1),
});

type QueryInput = z.infer<typeof QueryInputSchema>;

const result = QueryInputSchema.safeParse(req.body);
if (!result.success) {
  logger.warn({ errors: result.error.issues }, 'Invalid input');
  return { status: 400, body: { error: 'Invalid input', details: result.error.issues } };
}
const input: QueryInput = result.data;
```

```typescript
// ✗ DON'T — Uso direto de req.body sem validação
const question = req.body.question; // NUNCA faça isso
const data = req.body as MyType;    // NUNCA faça isso
```

### Logging — pino obrigatório

**NUNCA use `console.log`, `console.error` ou `console.warn`** em nenhum arquivo TypeScript do projeto. Use exclusivamente `pino`.

```typescript
// ✓ DO — pino com campos estruturados
import pino from 'pino';
const logger = pino({ name: 'query-endpoint' });

logger.info({ sessionId, attendantId }, 'Query received');
logger.warn({ sessionId, errorCode: 'ZOD_VALIDATION' }, 'Input validation failed');
logger.error({ err, sessionId }, 'Upstream error calling LangChain');
```

```typescript
// ✗ DON'T
console.log('Query received'); // PROIBIDO
console.error(err);            // PROIBIDO
```

### Error handling — padrão estruturado

**VOCÊ DEVE** usar erros tipados, nunca lançar `new Error('string genérica')`.

```typescript
// ✓ DO — Erro tipado com código e contexto
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// No handler:
try {
  // operação
} catch (err) {
  if (err instanceof ValidationError) {
    logger.warn({ code: err.code, details: err.details }, err.message);
    return { status: 400, body: { error: err.code, message: err.message } };
  }
  logger.error({ err }, 'Unexpected error');
  return { status: 500, body: { error: 'INTERNAL_ERROR' } };
}
```

```typescript
// ✗ DON'T
throw new Error('Something went wrong'); // Sem código, sem contexto
return { status: 500, body: 'Error' };   // Sem estrutura
```

### Estrutura de pastas

```
src/
├── functions/          # Azure Function handlers (HTTP triggers)
│   ├── query/
│   │   ├── handler.ts      # Somente orquestração de request/response
│   │   ├── validator.ts    # Schemas Zod para input/output
│   │   └── response-builder.ts  # Constrói respostas estruturadas
│   └── health/
│       └── handler.ts
├── services/           # Lógica de negócio (sem acoplamento ao Azure Functions)
├── types/              # Interfaces e tipos compartilhados
└── lib/                # Utilitários e helpers

tests/
├── unit/               # Testes de funções puras, serviços
├── integration/        # Testes com mocks de serviços externos
└── fixtures/           # Dados de teste reutilizáveis
```

**Regra de separação:** Azure Function handlers (`functions/`) NUNCA contêm lógica de negócio. Eles APENAS recebem o request, validam, chamam um service, e formatam a resposta.

### Naming conventions

- **Arquivos:** `kebab-case.ts` (ex: `query-handler.ts`, `response-builder.ts`)
- **Classes:** `PascalCase` (ex: `QueryService`, `ValidationError`)
- **Funções e variáveis:** `camelCase` (ex: `buildErrorResponse`, `sessionId`)
- **Constantes:** `SCREAMING_SNAKE_CASE` (ex: `MAX_CONTEXT_TOKENS`, `DEFAULT_TIMEOUT_MS`)
- **Types e Interfaces:** `PascalCase` com sufixo descritivo (ex: `QueryInput`, `QueryOutput`, `ErrorResponse`)

---

## 4. Build & Deploy

### Comandos obrigatórios

```bash
# Instalar dependências
npm ci

# Build TypeScript
npm run build      # tsc --noEmit para checar tipos; tsc para compilar

# Testes
npm test           # Vitest — TODOS os testes devem passar antes de qualquer PR

# Lint
npm run lint       # ESLint com @typescript-eslint/strict

# Type check
npm run typecheck  # tsc --noEmit
```

**Regra:** `npm test` e `npm run typecheck` DEVEM passar antes de qualquer commit. CI/CD bloqueia PRs com falha em qualquer um deles.

### Azure Functions — padrão de deploy

**VOCÊ DEVE** usar Azure Functions v4 com o modelo de programação baseado em `app.http()`:

```typescript
// ✓ DO — Azure Functions v4 model
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { logger } from '../lib/logger';
import { QueryInputSchema } from './validator';
import { buildErrorResponse, buildSuccessResponse } from './response-builder';

export async function queryHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const requestId = context.invocationId;
  logger.info({ requestId }, 'Query request started');

  const parseResult = QueryInputSchema.safeParse(await request.json());
  if (!parseResult.success) {
    logger.warn({ requestId, errors: parseResult.error.issues }, 'Input validation failed');
    return buildErrorResponse(400, 'VALIDATION_ERROR', parseResult.error.issues);
  }

  // ... chamar service
  return buildSuccessResponse(result);
}

app.http('query', {
  methods: ['POST'],
  authLevel: 'function',
  handler: queryHandler,
});
```

### CI/CD — GitHub Actions

- **Branch strategy:** `feature/*` → PR obrigatório para `main`; PR requer 1 approval + CI verde
- **Conventional Commits** obrigatório: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- **CI pipeline:** typecheck → lint → test → build (nessa ordem, falha em qualquer etapa bloqueia)

---

## 5. Testing Standards

### Vitest — padrão de testes TypeScript

**VOCÊ DEVE** usar Vitest para todos os testes TypeScript. Proibido usar Jest, Mocha ou qualquer outro framework.

```typescript
// ✓ DO — Estrutura de teste Vitest
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { queryHandler } from './handler';

describe('queryHandler', () => {
  describe('input validation', () => {
    it('returns 400 when question is empty', async () => {
      const request = new MockHttpRequest({ body: { question: '', sessionId: 'uuid-...' } });
      const response = await queryHandler(request, mockContext);
      expect(response.status).toBe(400);
      expect(response.jsonBody?.error).toBe('VALIDATION_ERROR');
    });
  });
});
```

**Azure Functions DEVEM ser testáveis sem Azure:** Handlers recebem `HttpRequest` e `InvocationContext` que podem ser mockados. Serviços externos são injetados via parâmetro ou variável de ambiente.

---

## 6. Context Management Rules

> Derivado de ADR-0006 (threshold de confiança RAG) e decisões de arquitetura da Fase 1.

### Budget de contexto por operação de query

| Componente | Tokens reservados |
|-----------|-----------------|
| System prompt + instruções do assistente | ~4.000 tokens |
| Chunks recuperados do ChromaDB (top-K=5) | ~8.000 tokens (max 1.600/chunk) |
| Histórico de conversa (últimas 3 turns) | ~2.000 tokens |
| Output reservado (resposta) | ~2.000 tokens |
| **Total máximo** | **~16.000 tokens** |

### Regras de contexto obrigatórias

1. **Top-K máximo:** 5 chunks por query. NUNCA passe mais de 5 chunks para o contexto do LLM.
2. **Threshold de confiança:** Chunks com score cosine < 0,75 são descartados. Se nenhum chunk atingir 0,75 em `collection-normativo`, fazer fallback para `collection-informal` (com aviso ao atendente).
3. **Dados de histórico:** Máximo 3 turns de histórico. Turns mais antigos são truncados, não resumidos.
4. **Dados financeiros:** NUNCA pedir ao LLM para calcular valores de frete, descontos ou créditos. Toda operação matemática com implicação financeira DEVE ser delegada ao motor de cálculo (Azure Function separada).

### Aviso de fonte informal

Quando qualquer chunk vem de `collection-informal`, a resposta DEVE iniciar com:
```
[Fonte: informal — confirme com documentação oficial antes de agir]
```

---

## 7. MCP Servers

Os MCP servers autorizados estão definidos em `MCP-ARCHITECTURE.md`. A configuração de referência está em `docs/anexos/anexo-c-estrutura-repositorio.md`.

Servidores ativos no projeto:
1. **github** — consulta de repositório, branches, issues, PRs
2. **filesystem** — acesso read-only a diretórios do projeto
3. **azureAiSearch** — busca semântica no índice NovaTech
4. **azureOpenAI** — geração de completions e embeddings
5. **azureDevOps** — leitura de work items e boards
6. **confluence** — leitura de documentação de negócio (read-only, espaço NOVATECH-DOC)

**Regra:** Nenhum novo MCP server pode ser adicionado sem aprovação do Tech Lead. Veja `MCP-ARCHITECTURE.md` para o processo de aprovação.

---

## 8. Security Rules

1. **Secrets NUNCA em código:** Use variáveis de ambiente + Azure Key Vault. Nunca commit de `.env`, `*.key`, `*.pem`.
2. **Least privilege:** Cada componente acessa apenas o que precisa. Ver `mcp-permissions-matrix.md`.
3. **Input sempre validado:** Todo dado de origem externa passa por Zod antes de uso.
4. **Logs sem PII:** NUNCA logue dados pessoais (email, CPF, nome completo) em texto plano. Use hashing ou mascaramento.
5. **Agentes não escrevem em sistemas transacionais:** Agentes de IA têm permissão de leitura — escrita requer ação humana explícita.
