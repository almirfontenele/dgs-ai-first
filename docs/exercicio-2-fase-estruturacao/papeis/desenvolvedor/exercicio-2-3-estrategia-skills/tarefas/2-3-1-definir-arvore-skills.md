# Tarefa 2.3.1 — Definir Árvore de Skills com Claude

## Objetivo

Definir a árvore completa de skills do projeto seguindo a hierarquia Foundation → Domain → Artifact. Para cada skill, documentar: nome, descrição (como um agente a reconheceria), escopo, e exemplos de artefatos que ela gera.

## Contexto

Skills são reutilizáveis. Em vez de cada dev reinventar como estruturar um endpoint RAG, há um SKILL.md que documenta a forma certa de fazer. Da mesma forma, há skills para testes, componentes React, etc.

A hierarquia:
- **Foundation:** Convenções globais que todas as outras skills herdam (ex: "como logamos", "como tratamos erros", "padrão de env vars")
- **Domain:** Padrões específicos de cada camada (ex: "como endpoints RAG são estruturados", "como testes de integração são escritos", "como componentes React são organizados")
- **Artifact:** Receitas concretas (ex: "skill para criar um endpoint RAG", "skill para criar um teste de integração")

## Inputs

- Lista de artefatos do projeto (Endpoints RAG, Testes, Componentes React, ADRs, Specs)
- Papéis (Developer, Tech Lead, QA, Product Specialist, Delivery Manager)
- Contexto do projeto (Azure stack, TypeScript, React, SDD)

## Entregáveis

Um arquivo `skills-tree.md` com a seguinte estrutura:

```markdown
# Árvore de Skills — NovaTech Logistics Assistant

## Visão Geral

Skills são documentos que encapsulam como gerar tipos específicos de outputs. Organizadas em hierarquia:
- **Foundation (3 skills):** Convenções globais
- **Domain (5 skills):** Padrões por camada (backend, frontend, tests)
- **Artifact (8 skills):** Receitas específicas para artefatos

**Total: 16 skills**

---

## Foundation Skills

### Foundation: Error Handling & Recovery

**Descrição:** "Como estruturamos tratamento de erros em todo o projeto"

**Escopo:** Aplicável a todas as funções/componentes. Define:
- Padrão de tipos de erro (validation, external service, server)
- Como logamos erros (com contexto, sem expor internals)
- Retry logic (exponential backoff, quando retry vs. fail-fast)
- Como retornamos erro ao usuário (mensagem clara, sem detalhes internos)

**Artefatos Que Consomem:**
- Endpoints Azure Functions
- Testes de integração
- Componentes React (form validation)

**Mantido Por:** Tech Lead  
**Consumido Por:** Developers, QA, Agentes

---

### Foundation: Logging & Observability

**Descrição:** "Como estruturamos logs para que sejam queryáveis e úteis"

**Escopo:**
- Log format: structured JSON (não text puro)
- Log levels: trace, debug, info, warn, error, fatal
- Essential fields: timestamp, level, function, action, user/context, duration
- Tool: pino (ou equivalente)

**Artefatos Que Consomem:**
- Endpoints Azure Functions
- Testes de integração
- Componentes React (client-side logging)

**Mantido Por:** Tech Lead  
**Consumido Por:** Developers, QA, Agentes

---

### Foundation: Environment Configuration

**Descrição:** "Como gerenciamos env vars, secrets, e configuração por ambiente"

**Escopo:**
- Padrão de nomes (SCREAMING_SNAKE_CASE para env vars)
- Validation: quais vars são obrigatórias, quais são opcionais
- Tipos: string, number, boolean (com coerção segura)
- Secrets management (Azure Key Vault, não hardcoded)
- Local vs. staging vs. production config

**Artefatos Que Consomem:**
- Endpoints Azure Functions
- Agentes (local vs. cloud)

**Mantido Por:** Tech Lead / DevOps  
**Consumido Por:** Developers, QA

---

## Domain Skills

### Domain: Azure Functions Endpoints

**Descrição:** "Como estruturamos Azure Functions como endpoints HTTP em produção"

**Escopo:**
- Herda: Error Handling, Logging, Environment Configuration
- Input validation (Zod schemas)
- Output schemas
- Timeout/retry policies
- Performance constraints (max duration, max payload)
- Integration with Azure services (search, OpenAI, DevOps)

**Artefatos Que Consomem:**
- Query endpoint (RAG)
- Feedback endpoint (collect user feedback)
- Admin endpoints (manual reindexing)

**Skill ARTIFACT:** `azure-functions-endpoint`  
**Mantido Por:** Tech Lead / Senior Dev  
**Consumido Por:** Developers, Agentes

---

### Domain: Integration Tests

**Descrição:** "Como estruturamos testes que validam fluxos end-to-end"

**Escopo:**
- Herda: Error Handling, Logging
- Test structure: arrange-act-assert
- Fixtures (test data)
- Mocking vs. real services (quando mockar Azure, quando usar real)
- Coverage expectations
- Performance assertions (fluxo completo < 2s, etc)

**Artefatos Que Consomem:**
- Teste da query endpoint (embedding → search → model)
- Teste do feedback pipeline
- Teste de reindex

**Skill ARTIFACT:** `integration-test-azure-functions`  
**Mantido Por:** Tech Lead / QA  
**Consumido Por:** Developers, QA, Agentes

---

### Domain: React Components

**Descrição:** "Como estruturamos componentes React para o painel web"

**Escopo:**
- Herda: Error Handling, Logging
- Component composition (functional, hooks)
- State management (useState, useContext)
- Props types (TypeScript)
- Accessibility (a11y)
- Testing (RTL)

**Artefatos Que Consomem:**
- Query response display
- Feedback form
- Admin dashboard

**Skill ARTIFACT:** `react-component-dashboard`  
**Mantido Por:** Frontend Dev / Tech Lead  
**Consumido Por:** Frontend Developers

---

### Domain: Technical Documentation (ADRs)

**Descrição:** "Como estruturamos decisões técnicas em Architectural Decision Records"

**Escopo:**
- Herda: nada específico (é documentação)
- Status: Proposed, Accepted, Deprecated
- Sections: Title, Status, Context, Decision, Consequences, Alternatives
- Examples: ADR-001 (context budget), ADR-002 (document versioning), etc.

**Artefatos Que Consomem:**
- ADR para context budget (2K system + 8K chunks)
- ADR para document versioning
- ADR para retry policies

**Skill ARTIFACT:** `architecture-decision-record`  
**Mantido Por:** Tech Lead  
**Consumido Por:** Developers, QA, Product

---

### Domain: Product Specs (SDD)

**Descrição:** "Como estruturamos requirements de produto em formato SDD"

**Escopo:**
- Herda: nada específico (é product)
- Sections: Outcomes, Scope Boundaries, Constraints, Prior Decisions, Verification Criteria
- Examples: Spec de query endpoint, spec de feedback collection

**Skill ARTIFACT:** `product-spec-sdd`  
**Mantido Por:** Product Specialist  
**Consumido Por:** Tech Lead, Developers, QA

---

## Artifact Skills

### Artifact: Query Endpoint (RAG Pattern)

**Descrição:** "Como criar um endpoint RAG que busca docs, monta prompt, chama modelo"

**Inherits From:** Azure Functions (domain), Error Handling (foundation)

**Template:** `/skills/artifact/query-endpoint-rag/SKILL.md`

**Steps:**
1. Define schemas (Zod): input question, output answer+sources
2. Integração com Azure OpenAI (embedding)
3. Integração com Azure AI Search (vector search)
4. Prompt assembly com guardrails
5. Chamada ao modelo com retry
6. Tests (3+ cenários)

**Who Creates:** Tech Lead, Senior Dev  
**Who Consumes:** Developers (para criar endpoints semelhantes)

---

### Artifact: Feedback Endpoint

**Descrição:** "Como criar endpoint para coletar feedback de usuários e armazenar"

**Inherits From:** Azure Functions (domain), Error Handling (foundation)

**Template:** `/skills/artifact/feedback-endpoint/SKILL.md`

**Steps:**
1. Validate feedback schema (Zod): rating, comment, session_id
2. Store in Azure Table Storage
3. Log event para analytics
4. Return 200 with no-cache headers

**Who Creates:** Developer (após copiar query-endpoint)  
**Who Consumes:** Agentes de retraining

---

### Artifact: Integration Test for Endpoint

**Descrição:** "Como testar um endpoint end-to-end"

**Inherits From:** Integration Tests (domain)

**Template:** `/skills/artifact/integration-test-endpoint/SKILL.md`

**Steps:**
1. Setup (populate test data, start function locally)
2. Call endpoint com 3 cenários (simple, edge case, error)
3. Assert response (status, schema, data)
4. Cleanup

**Who Creates:** QA / Developer  
**Who Consumes:** All developers (para cada novo endpoint)

---

### Artifact: React Query Response Card

**Descrição:** "Como criar um componente React que exibe resposta de query"

**Inherits From:** React Components (domain)

**Template:** `/skills/artifact/react-query-card/SKILL.md`

**Steps:**
1. Define props (answer: string, sources: array, confidence: number)
2. Render answer text
3. Render sources as clickable links
4. Display confidence badge (colors: green > 0.8, yellow 0.5-0.8, red < 0.5)
5. Handle loading/error states
6. Test with RTL

**Who Creates:** Frontend Dev  
**Who Consumes:** Dashboard developers

---

### Artifact: ADR — Context Budget

**Descrição:** "Como documentar a decisão de context budget (2K system + 8K chunks)"

**Template:** `/skills/artifact/adr-context-budget/SKILL.md`

**Example Output:**
- ADR-0002: Context Budget for Query Endpoint
  - Título: "Limite de 2K tokens para system prompt, 8K para chunks"
  - Contexto: API costs, latency constraints, quality expectations
  - Decision: "Manter 2K + 8K para balancear custo e qualidade"
  - Consequences: "System prompt não pode ter >2K; chunks truncados se > 8K"

**Who Creates:** Tech Lead  
**Who Consumes:** Developers (implementam respeitando limits)

---

### Artifact: Spec SDD — Query Endpoint Requirements

**Descrição:** "Como documentar requisitos de um endpoint em formato SDD"

**Template:** `/skills/artifact/spec-query-endpoint/SKILL.md`

**Example Output:**
- requirements.md com seções: Outcomes, Scope, Constraints, Decisions, Criteria

**Who Creates:** Product Specialist  
**Who Consumes:** Tech Lead (converte em plan), Developers (implementam)

---

### Artifact: Spec SDD — Feedback Collection

**Descrição:** "Como documentar requisitos de feedback em SDD"

**Template:** `/skills/artifact/spec-feedback-collection/SKILL.md`

**Who Creates:** Product Specialist  
**Who Consumes:** Tech Lead, Developers

---

### Artifact: Logging Middleware for Azure Functions

**Descrição:** "Como implementar middleware de logging estruturado para Azure Functions"

**Inherits From:** Logging & Observability (foundation)

**Template:** `/skills/artifact/logging-middleware-af/SKILL.md`

**Steps:**
1. Create wrapper que intercepta todas as funções
2. Log request (timestamp, function name, input summary)
3. Log response (timestamp, status, duration)
4. Log errors com context

**Who Creates:** Tech Lead  
**Who Consumes:** All Azure Function developers

---

## Mapeamento de Criação × Consumo

| Skill | Criado Por | Consumido Por | Frequência |
|-------|-----------|---------------|-----------|
| Error Handling (F) | Tech Lead | Todos | Altíssima |
| Logging (F) | Tech Lead | Todos | Altíssima |
| Env Config (F) | Tech Lead | Devs, QA | Alta |
| Azure Functions (D) | Tech Lead | Devs | Alta |
| Integration Tests (D) | Tech Lead/QA | Devs, QA | Alta |
| React Components (D) | Frontend Dev | Frontend Devs | Média |
| ADRs (D) | Tech Lead | Todos | Média |
| Specs SDD (D) | Product | Tech Lead, Devs | Média |
| Query Endpoint (A) | Tech Lead/Dev | Devs (reutilizam) | Média |
| Feedback Endpoint (A) | Dev | Agentes | Baixa |
| Integration Test (A) | QA/Dev | QA, Devs | Alta |
| React Card (A) | Frontend Dev | Frontend Devs | Média |
| ADR—Context Budget (A) | Tech Lead | Devs | Uma vez |
| Spec—Query (A) | Product | Tech Lead | Uma vez |
| Spec—Feedback (A) | Product | Tech Lead | Uma vez |
| Logging Middleware (A) | Tech Lead | Todos | Uma vez |

---

## Dependências Entre Skills

\`\`\`
Foundation
├── Error Handling
├── Logging
└── Env Config

Domain (herdam Foundation)
├── Azure Functions
├── Integration Tests
├── React Components
├── ADRs
└── Specs SDD

Artifact (herdam Domain e Foundation)
├── Query Endpoint (herda: Azure Functions, Error Handling)
├── Feedback Endpoint (herda: Azure Functions)
├── Integration Test (herda: Integration Tests)
├── React Card (herda: React Components)
├── ADRs (herda: nada específico, mas documentam decisions)
├── Specs SDD (herda: nada específico, complementam ADRs)
└── Logging Middleware (herda: Logging)
\`\`\`

---

## Checklist de Completude

- [ ] 3+ Foundation skills (convenções globais)
- [ ] 5+ Domain skills (padrões por camada)
- [ ] 8+ Artifact skills (receitas concretas)
- [ ] Cada skill tem: nome, descrição, escopo, who creates, who consumes
- [ ] Mapeamento de criação × consumo (matriz ou tabela)
- [ ] Nenhuma skill é "ninguém usa" — todas têm consumidores claros
```

## Critérios de Aceite

- [ ] Árvore com 3+ Foundation skills, 5+ Domain skills, 8+ Artifact skills
- [ ] Cada skill tem nome, descrição, escopo, maintainer, consumidores
- [ ] Descrições são específicas (não são abstratas como "padrão de coding")
- [ ] Há dependências documentadas (qual skill herda de qual)
- [ ] Todas as skills têm consumidores (nenhuma é "ninguém usa")

## Passo a Passo

### Passo 1: Listar artefatos que o projeto produz
Faça um brainstorm:
- Endpoints Azure Functions (query, feedback, admin)
- Testes (unit, integration, e2e)
- Componentes React (cards, forms, dashboard)
- Documentação (ADRs, READMEs, specs)

### Passo 2: Agrupar em camadas (Domain skills)
Agrupe artefatos por camada:
- Backend: Azure Functions, Tests
- Frontend: React Components
- Documentation: ADRs, Specs

### Passo 3: Identificar padrões (Foundation skills)
Pergunte: "O que todas as skills compartilham?"
- Todos tratam erros da mesma forma → Error Handling skill
- Todos usam logging estruturado → Logging skill
- Todos usam env vars → Env Config skill

### Passo 4: Usar Claude para validar
Cole sua árvore num chat:

> "Estou definindo skills para um projeto de assistente de logística. Aqui está minha árvore:
> [Sua árvore]
>
> Há gaps? Alguma skill que falta? Alguma que ninguém usaria?"

Claude deve sugerir:
- Skills que faltam (ex: "Security/secrets management")
- Skills que podem ser mergeadas (ex: "Logging e Observability são a mesma coisa")
- Removido skills inúteis

### Passo 5: Estruturar como documento
Crie `skills-tree.md` com seções: Foundation, Domain, Artifact. Para cada skill:
- Nome e descrição
- Escopo (o que cobre)
- Dependências (qual Foundation/Domain herda)
- Who creates / consumes
- Artefatos de exemplo

### Passo 6: Validar matriz de criação/consumo
Crie uma tabela: Skill × Criado Por × Consumido Por

Se alguma skill não tem consumidor, questione:
- "Realmente precisamos desta skill?"
- "Qual é o artefato que ela gera?"

## Dicas

- **Foundation é reutilizável:** Se 100% das skills compartilham um padrão (ex: logging), está em Foundation. Se 80%, está em Domain.

- **Artifact é específico:** Uma skill Artifact é uma receita concreta para um artefato. "React Components" é Domain (padrão geral). "React Query Response Card" é Artifact (receita específica).

- **Consumidores devem ser claros:** Se você não consegue apontar quem vai usar uma skill, ela provavelmente não deveria existir.

## Referências

- Contexto do projeto (Anexo C)
- Lista de artefatos (ver contexto acima)
