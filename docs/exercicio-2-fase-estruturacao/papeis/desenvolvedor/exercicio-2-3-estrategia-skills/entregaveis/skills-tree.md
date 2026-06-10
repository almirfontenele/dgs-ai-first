# Árvore de Skills — NovaTech Logistics Assistant

**Desenvolvedor:** Almir Oliveira  
**Data:** 2026-06-09  
**Projeto:** NovaTech — Assistente de Suporte Logístico

---

## Visão Geral

Skills são documentos prescritivos que encapsulam *como* gerar tipos específicos de outputs com qualidade e consistência. Organizadas em hierarquia:

- **Foundation (3 skills):** Convenções globais que todas as camadas herdam
- **Domain (5 skills):** Padrões por camada de produto (backend, frontend, testes, documentação)
- **Artifact (9 skills):** Receitas concretas para artefatos específicos do projeto

**Total: 17 skills**

---

## Foundation Skills

Skills de fundação definem convenções que se aplicam a 100% do projeto. Todo código, teste e documentação os herda.

---

### F1 — Error Handling & Recovery

**Descrição:** "Como estruturamos erros em todo o projeto: tipagem, logging, retry e retorno ao usuário."

**Escopo:**
- Tipos de erro: `VALIDATION_ERROR`, `EXTERNAL_SERVICE_ERROR`, `SERVER_ERROR`, `NOT_FOUND`
- Interface `AppError`: campos `type`, `message`, `userMessage`, `context`, `timestamp`
- Padrão catch-log-transform: identificar tipo → logar com contexto → retornar mensagem amigável
- Retry com exponential backoff (1s, 2s, 4s) somente para erros retryáveis
- Usuário nunca vê stack trace; developer vê logs ricos

**Artefatos que consomem:** Endpoints Azure Functions, testes de integração, componentes React (form validation)

**Mantido por:** Tech Lead  
**Consumido por:** Developer, QA, Frontend Developer, Agentes de IA  
**Arquivo:** `/skills/foundation/SKILL-error-handling.md`

---

### F2 — Logging & Observability

**Descrição:** "Como estruturamos logs para que sejam queryáveis, rastreáveis e úteis em produção."

**Escopo:**
- Ferramenta: `pino` (JSON estruturado, nunca texto puro)
- Campos obrigatórios em todo log: `function`, `action`, `requestId`, dados contextuais relevantes
- Níveis: `trace` (dev), `debug` (staging), `info` (produção), `warn` / `error` / `fatal`
- `requestId` gerado no início de cada request e propagado em todos os eventos do ciclo
- Logs nunca incluem API keys, tokens, ou dados PII

**Artefatos que consomem:** Endpoints Azure Functions, testes de integração, logging middleware

**Mantido por:** Tech Lead  
**Consumido por:** Developer, QA, Frontend Developer, Agentes de IA  
**Arquivo:** `/skills/foundation/SKILL-logging-observability.md`

---

### F3 — Environment Configuration

**Descrição:** "Como gerenciamos variáveis de ambiente, secrets e configuração por ambiente."

**Escopo:**
- Nomes: `SCREAMING_SNAKE_CASE` para env vars
- Validação na startup: vars obrigatórias lançam erro se ausentes (não silenciam)
- Secrets nunca hardcoded; usar Azure Key Vault ou `.env` local (não commitado)
- Local vs. staging vs. produção: hierarquia de override clara
- Tipagem: Zod schema para validar env vars no startup (`z.object({ AZURE_OPENAI_ENDPOINT: z.string().url() })`)

**Artefatos que consomem:** Endpoints Azure Functions, pipeline de ingestão, configuração de agentes

**Mantido por:** Tech Lead / DevOps  
**Consumido por:** Developer, QA  
**Arquivo:** `/skills/foundation/SKILL-env-configuration.md`

---

## Domain Skills

Domain skills herdam Foundation e definem padrões por camada tecnológica ou disciplina.

---

### D1 — Azure Functions Endpoints

**Descrição:** "Como estruturamos Azure Functions como endpoints HTTP em produção no modelo programático v4."

**Herda:** F1 (Error Handling), F2 (Logging), F3 (Env Config)

**Escopo:**
- Registro via `app.http()` com `authLevel`, `methods`, `route`
- Input validation com Zod schemas antes de qualquer lógica de negócio
- Output schema com Zod antes de retornar ao cliente
- Timeout máximo: 230s (Azure Functions Consumption default)
- Payload máximo: 100MB; não aceitar >10KB em endpoints de Q&A
- Integração com Azure services via SDKs (`@azure/openai`, `@azure/search-documents`)
- Padrão de response: `{ status, jsonBody }` (nunca raw `body`)

**Artifact skills:** D1 → `A1 (Query Endpoint)`, `A2 (Feedback Endpoint)`, `A8 (Logging Middleware)`

**Mantido por:** Tech Lead / Senior Developer  
**Consumido por:** Developer, Agentes de IA  
**Arquivo:** `/skills/domain/SKILL-azure-functions-endpoints.md`

---

### D2 — Integration Tests

**Descrição:** "Como estruturamos testes de integração que validam fluxos end-to-end, incluindo mocks de Azure."

**Herda:** F1 (Error Handling), F2 (Logging)

**Escopo:**
- Framework: Jest + ts-jest
- Estrutura: arrange-act-assert (preparar dados, chamar endpoint, verificar resposta)
- Mocking: mockar Azure services com `jest.mock()`; usar real services em testes de smoke
- Fixtures: dados de teste versionados em `/tests/fixtures/`
- Performance assertions: endpoint de query < 2s end-to-end
- Coverage mínimo: happy path + 2 edge cases por endpoint
- Cleanup: cada teste restaura estado inicial (sem poluição entre testes)

**Artifact skills:** D2 → `A3 (Integration Test Endpoint RAG)`

**Mantido por:** Tech Lead / QA  
**Consumido por:** Developer, QA  
**Arquivo:** `/skills/domain/SKILL-integration-tests.md`

---

### D3 — React Components (Dashboard)

**Descrição:** "Como estruturamos componentes React para o painel de suporte da NovaTech."

**Herda:** F1 (Error Handling), F2 (Logging client-side)

**Escopo:**
- Componentes funcionais com hooks; sem class components
- Props tipadas com TypeScript; sem `any` em props públicas
- Estado local com `useState`; estado compartilhado com Context API
- Acessibilidade (a11y): aria-labels em elementos interativos
- Testes com React Testing Library (RTL): arrange → act → assert
- Loading e error states são sempre tratados nos componentes

**Artifact skills:** D3 → `A4 (React Query Response Card)`, `A5 (React Feedback Form)`

**Mantido por:** Frontend Developer / Tech Lead  
**Consumido por:** Frontend Developer  
**Arquivo:** `/skills/domain/SKILL-react-components.md`

---

### D4 — Architectural Decision Records (ADRs)

**Descrição:** "Como documentamos decisões técnicas de forma rastreável e duradoura."

**Herda:** nada (documentação independente)

**Escopo:**
- Seções obrigatórias: `Title`, `Status` (Proposed / Accepted / Deprecated), `Context`, `Decision`, `Consequences`, `Alternatives`
- Numeração: `ADR-XXXX-` + slug kebab-case
- Status `Deprecated` deve referenciar ADR substituto
- Exemplos do projeto: ADR-0001 (regras de negócio), ADR-0002 (validação de arquitetura), ADR-0003–0006 (decisões de RAG)

**Artifact skills:** D4 → `A6 (ADR — Context Budget)`, `A7 (ADR — Document Versioning)`

**Mantido por:** Tech Lead  
**Consumido por:** Developer, QA, Product Specialist  
**Arquivo:** `/skills/domain/SKILL-architectural-decision-records.md`

---

### D5 — Product Specs (Spec Driven Development)

**Descrição:** "Como documentamos requisitos de produto no formato SDD com critérios verificáveis."

**Herda:** nada (documentação independente)

**Escopo:**
- Seções: `Outcomes`, `Scope Boundaries`, `Constraints` (Cx), `Prior Decisions`, `Verification Criteria` (VC-Fxx, VC-Rxx)
- Cada constraint tem ID único (C1, C2...)
- Cada verification criterion tem ID único e é testável (não vago)
- Glossário com linguagem ubíqua do domínio
- Mockups: ASCII primeiro; Claude Design para visualização quando aprovado

**Artifact skills:** D5 → `A9 (Spec SDD — Query Endpoint)`

**Mantido por:** Product Specialist  
**Consumido por:** Tech Lead, Developer, QA  
**Arquivo:** `/skills/domain/SKILL-product-specs-sdd.md`

---

## Artifact Skills

Artifact skills herdam de Domain (e indiretamente de Foundation). São receitas concretas para artefatos específicos do projeto NovaTech.

---

### A1 — Query Endpoint (Padrão RAG)

**Descrição:** "Como criar um endpoint Azure Function que implementa o padrão RAG: embedding → search → prompt → modelo."

**Herda:** D1 (Azure Functions), F1 (Error Handling), F2 (Logging)

**Passos:**
1. Definir schemas Zod de input (`question`) e output (`answer`, `sources`, `confidence`)
2. Validar body antes de Zod (checar se é objeto, não array ou null)
3. Gerar embedding com `getEmbedding()` via Azure OpenAI
4. Buscar top-K chunks com `searchDocuments()` via Azure AI Search
5. Montar prompt com guardrails e atribuição de fontes com `buildPrompt()`
6. Chamar modelo com retry exponential backoff
7. Validar output antes de retornar
8. Propagar `requestId` em todos os logs

**Criado por:** Tech Lead / Senior Developer  
**Consumido por:** Developer (como template para novos endpoints de Q&A)  
**Arquivo:** `/skills/artifact/SKILL-query-endpoint-rag.md`

---

### A2 — Feedback Endpoint

**Descrição:** "Como criar endpoint Azure Function para coletar e persistir feedback de atendentes."

**Herda:** D1 (Azure Functions), F1 (Error Handling)

**Passos:**
1. Schema Zod: `{ rating: 1-5, comment: string (opcional, max 500), sessionId: string }`
2. Persistir em Azure Table Storage (tabela `feedbacks`)
3. Logar evento de analytics: `action: 'feedback_received'`, `rating`, `sessionId`
4. Retornar 200 com `no-cache` headers

**Criado por:** Developer (após dominar padrão de A1)  
**Consumido por:** Agentes de re-training e análise de qualidade  
**Arquivo:** `/skills/artifact/SKILL-feedback-endpoint.md`

---

### A3 — Integration Test para Endpoint RAG

**Descrição:** "Como testar o endpoint de query com os 3 cenários obrigatórios: simples, conflito, sem resultado."

**Herda:** D2 (Integration Tests)

**Passos:**
1. Setup: inicializar fixtures com 3 perguntas pré-definidas
2. Teste simples: pergunta com resposta clara → status 200, `sources.length > 0`, `confidence > 0.5`
3. Teste conflito: pergunta sobre tópico com versões conflitantes → resposta menciona ambas as fontes
4. Teste sem resultado: pergunta fora do domínio → `sources.length === 0` ou `confidence < 0.3`
5. Cleanup: nenhum estado persistido entre testes

**Criado por:** QA / Developer  
**Consumido por:** Todo developer que implementa novo endpoint RAG  
**Arquivo:** `/skills/artifact/SKILL-integration-test-endpoint-rag.md`

---

### A4 — React Query Response Card

**Descrição:** "Como criar componente React que exibe resposta do assistente com sources e badge de confiança."

**Herda:** D3 (React Components)

**Passos:**
1. Props: `{ answer: string, sources: Source[], confidence: number, isLoading: boolean }`
2. Renderizar answer como texto formatado
3. Renderizar sources como lista com links clicáveis e vigência
4. Badge de confiança: verde (> 0.8), amarelo (0.5–0.8), vermelho (< 0.5)
5. Estado loading: skeleton placeholder
6. Estado erro: mensagem amigável + botão "tentar novamente"

**Criado por:** Frontend Developer  
**Consumido por:** Dashboard de suporte da NovaTech  
**Arquivo:** `/skills/artifact/SKILL-react-query-response-card.md`

---

### A5 — React Feedback Form

**Descrição:** "Como criar formulário React de 5 estrelas + comentário para coleta de feedback."

**Herda:** D3 (React Components), F1 (Error Handling client-side)

**Passos:**
1. Props: `{ sessionId: string, onSubmit: (feedback) => void }`
2. Rating: 5 estrelas clicáveis com estado selecionado
3. Campo comment: textarea opcional, max 500 chars, counter visível
4. Validação client-side antes de submit (Zod no frontend)
5. Desabilitar submit enquanto loading; mostrar erro se falhar

**Criado por:** Frontend Developer  
**Consumido por:** Dashboard de suporte  
**Arquivo:** `/skills/artifact/SKILL-react-feedback-form.md`

---

### A6 — ADR: Context Budget

**Descrição:** "Como documentar e justificar a decisão de context budget (tokens para system prompt e chunks)."

**Herda:** D4 (ADRs)

**Exemplo de output:** ADR-0002 / ADR-0006 do projeto  
**Decisão documentada:** system prompt ≤ 2K tokens, chunks ≤ 8K tokens, threshold de confiança ≥ 0.75

**Criado por:** Tech Lead  
**Consumido por:** Developer (ao implementar prompt assembly), QA (ao definir critérios de teste)  
**Arquivo:** `/skills/artifact/SKILL-adr-context-budget.md`

---

### A7 — ADR: Document Versioning

**Descrição:** "Como documentar a decisão de tratamento de documentos com versões conflitantes."

**Herda:** D4 (ADRs)

**Exemplo de output:** ADR-0003 do projeto — estratégia de vigência para documentos contraditórios

**Criado por:** Tech Lead  
**Consumido por:** Developer (ao implementar `buildPrompt()` e detecção de conflitos)  
**Arquivo:** `/skills/artifact/SKILL-adr-document-versioning.md`

---

### A8 — Logging Middleware para Azure Functions

**Descrição:** "Como implementar wrapper de logging que intercepta todas as functions e loga request/response automaticamente."

**Herda:** F2 (Logging & Observability), D1 (Azure Functions)

**Passos:**
1. Wrapper que recebe handler e retorna handler com logging
2. Log request: `action: 'request_received'`, method, route, requestId
3. Log response: `action: 'response_sent'`, status, duration
4. Log error: `action: 'unhandled_error'` se exception não capturada

**Criado por:** Tech Lead  
**Consumido por:** Todos os developers de Azure Functions  
**Arquivo:** `/skills/artifact/SKILL-logging-middleware-af.md`

---

### A9 — Spec SDD: Query Endpoint

**Descrição:** "Como documentar os requisitos do endpoint de query no formato SDD com constraints e verification criteria."

**Herda:** D5 (Product Specs SDD)

**Exemplo de output:** `docs/exercicio-2-1-dominio-spec/entregaveis/` do projeto  
**Sections:** Outcomes, Constraints (C1–C9), Prior Decisions (6 ADRs), Verification Criteria (VC-F01–VC-F07, VC-R01–VC-R04)

**Criado por:** Product Specialist  
**Consumido por:** Tech Lead (cria plan), Developer (implementa), QA (escreve testes)  
**Arquivo:** `/skills/artifact/SKILL-spec-sdd-query-endpoint.md`

---

## Dependências Entre Skills

```
Foundation
├── F1 — Error Handling
├── F2 — Logging & Observability
└── F3 — Environment Configuration

Domain (herdam Foundation conforme descrito)
├── D1 — Azure Functions ← F1, F2, F3
├── D2 — Integration Tests ← F1, F2
├── D3 — React Components ← F1, F2
├── D4 — ADRs (independente)
└── D5 — Product Specs SDD (independente)

Artifact (herdam Domain e Foundation)
├── A1 — Query Endpoint ← D1, F1, F2
├── A2 — Feedback Endpoint ← D1, F1
├── A3 — Integration Test RAG ← D2
├── A4 — React Query Card ← D3
├── A5 — React Feedback Form ← D3, F1
├── A6 — ADR Context Budget ← D4
├── A7 — ADR Document Versioning ← D4
├── A8 — Logging Middleware ← F2, D1
└── A9 — Spec SDD Query Endpoint ← D5
```

---

## Processo com Copilot

**Prompt inicial:** "Para um projeto NovaTech com Azure Functions (TypeScript), Azure AI Search, Azure OpenAI e React, defina uma árvore de skills organizada em Foundation, Domain e Artifact. Cada skill deve ter nome, descrição, escopo, maintainer e consumidores."

**Output gerado:** O Copilot gerou 8 skills, todas no mesmo nível (sem hierarquia), todas criadas e consumidas por Developers. Skills incluíam entradas vagas como "TypeScript Best Practices" e "Azure SDK Usage" que seriam ignoradas na prática.

**O que foi descartado:** As 8 skills planas e as 2 skills genéricas — substituídas pela hierarquia F/D/A onde Foundation são convenções globais, Domain são padrões por camada e Artifact são receitas para outputs específicos do projeto.

**O que foi adicionado manualmente:**
- Separação Product Specialist cria D5/A9, QA cria A3, Frontend cria D3/A4/A5 — o Copilot centralizou tudo em Developer
- Herança explícita entre camadas (ex: `A1 ← D1, F1, F2`) para deixar claro o que cada skill pressupõe
- 9 Artifact skills em vez das 3 do Copilot, cobrindo o ciclo completo (endpoint, teste, componente React, ADR, spec)

**Iteração:** Um segundo prompt pediu ao Copilot para sugerir quais skills um Delivery Manager consumiria. O output incorretamente incluiu D1 (Azure Functions) e D2 (Integration Tests) — papéis que Delivery Manager não tem contexto para consumir. A resposta correta (D4 ADRs e A9 Spec SDD) foi definida manualmente com base no que o papel realmente precisa para acompanhar progresso.

## Checklist de Completude

- [x] 3 Foundation skills (F1, F2, F3)
- [x] 5 Domain skills (D1–D5)
- [x] 9 Artifact skills (A1–A9)
- [x] Cada skill tem: nome, descrição, escopo, maintainer, consumidores
- [x] Dependências documentadas (herança explícita)
- [x] Todas as skills têm consumidores (nenhuma "ninguém usa")
- [x] Total: 17 skills
