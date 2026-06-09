# Tarefa 2.2.1 — Converter plan.md em tasks.md com Claude

## Objetivo

Converter o `plan.md` do query endpoint em um `tasks.md` estruturado com tasks atômicas. Cada task deve ter: ID, descrição, critérios de aceite, dependências, e estimativa (P/M/G).

## Contexto

Um `plan.md` descreve a abordagem arquitetural de alto nível. Um `tasks.md` quebra essa abordagem em tarefas implementáveis por um dev. A qualidade do `tasks.md` determina a velocidade e a qualidade da implementação.

Exemplo de diferença:
- **Plan:** "Azure Function HTTP trigger que recebe pergunta via POST, converte em embedding, busca chunks, monta prompt e retorna resposta"
- **Tasks:**
  - Task 1: Setup da função Azure com input validation (Zod)
  - Task 2: Integração com Azure OpenAI para embeddings
  - Task 3: Integração com Azure AI Search para busca semântica
  - Task 4: Montagem do prompt (guardrails + sistema + chunks)
  - Task 5: Testes de integração

## Inputs

O `plan.md` que você vai converter. Aqui está uma versão simulada:

```markdown
# Plan — Query Endpoint

## Approach
Azure Function HTTP trigger que:
1. Recebe pergunta do atendente via POST /api/query
2. Converte pergunta em embedding via Azure OpenAI
3. Busca top-5 chunks no Azure AI Search
4. Monta prompt com chunks + system prompt + pergunta
   (respeitando context budget: ~2K system + ~8K chunks + pergunta)
5. Envia ao GPT-4o e retorna resposta com source_document

## Technical Decisions
- TypeScript com Azure Functions v4
- Zod para validação de input/output
- Retry com exponential backoff para chamadas Azure
- Structured logging com pino

## Prior Decisions (do cenário 1)
- Context budget definido na ADR-0002: ~4K system + ~8K chunks
- Documentos contraditórios tratados com metadado de vigência (ADR-0003)
- System prompt versionado em /prompts/system-prompt.md

## Dependencies
- Azure AI Search index must be populated (pipeline de ingestão)
- System prompt must be finalized (ver /prompts/system-prompt.md)
```

## Entregáveis

Um arquivo `tasks.md` com a seguinte estrutura:

```markdown
# Tasks — Query Endpoint Implementation

## Overview
- **Total Tasks:** X
- **Estimated Time:** X hours (P=1-2h, M=3-5h, G=6-10h+)
- **Dependencies:** Azure AI Search index populated, system prompt finalized

## Task List

| ID | Título | Tamanho | Deps | Aceite |
|-----|--------|---------|------|--------|
| 2.2.1.1 | Setup Azure Function com validação Zod | P | - | Function responds to POST /api/query |
| 2.2.1.2 | Integração Azure OpenAI (embedding) | M | 2.2.1.1 | Embedding de 100 tokens leva < 1s |
| 2.2.1.3 | Busca semântica Azure AI Search | M | 2.2.1.1, 2.2.1.2 | Retorna top-5 chunks relevantes |
| 2.2.1.4 | Montagem de prompt com guardrails | M | 2.2.1.3 | Prompt respects context budget |
| 2.2.1.5 | Chamada ao GPT-4o e retry | M | 2.2.1.4 | Retry logic funciona; exponential backoff |
| 2.2.1.6 | Testes de integração | M | 2.2.1.1-5 | 3+ cenários (simples, contraditório, vazio) |

## Detailed Tasks

### Task 2.2.1.1: Setup Azure Function com validação Zod

**Descrição:**
Criar o Azure Function `query` com:
- HTTP trigger (POST /api/query)
- Input validation com Zod (question: string, maxLength: 500)
- Output schema com Zod (answer: string, sources: array, confidence: 0-1)
- Logging com pino (structured JSON)
- Error handling (4xx para bad input, 5xx para server errors)

**Critérios de Aceite:**
- [ ] Function exists em `src/functions/query.ts`
- [ ] `curl POST http://localhost:7071/api/query` com payload válido retorna 200
- [ ] `curl` com payload inválido retorna 400 com mensagem de erro clara
- [ ] Logs são estruturados (contêm fields: timestamp, level, function, message)
- [ ] Resposta segue schema Zod definido

**Dependências:** Nenhuma (task inicial)

**Estimativa:** P (1-2 horas)

**Inputs:**
- [Link to]: Zod docs / Azure Functions v4 docs
- Example: `/examples/azure-function-basic.ts`

**Context Budget:** Não aplicável nesta task

---

### Task 2.2.1.2: Integração Azure OpenAI (embedding)

**Descrição:**
Integrar chamada ao Azure OpenAI para gerar embeddings da pergunta. Implementar:
- Client initialization com credentials (env vars)
- Retry com exponential backoff (3 tentativas, 1s, 2s, 4s)
- Timeout de 10s por chamada
- Logging de latência e tokens usados

**Critérios de Aceite:**
- [ ] Função `getEmbedding(question: string)` retorna embedding de 1536 dimensões
- [ ] Retry logic testada: chamada falha 2x, sucede na 3ª
- [ ] Latência logada (ex: "embedding computed in 245ms")
- [ ] Tratamento de timeout (ex: "embedding request timed out after 10s")

**Dependências:** Task 2.2.1.1 (função base existe)

**Estimativa:** M (3-5 horas)

**Inputs:**
- Azure OpenAI endpoint: `https://${AZURE_OPENAI_RESOURCE}.openai.azure.com/`
- Model deployment: `text-embedding-3-small`
- API key: `${AZURE_OPENAI_KEY}`

**Context Budget:** Embedding leva ~1536 tokens (incluir no total de context)

---

### Task 2.2.1.3: Busca semântica Azure AI Search

**Descrição:**
Integrar chamada ao Azure AI Search para buscar documentos semelhantes. Implementar:
- Client initialization
- Busca semântica com vector search (usar embedding da pergunta)
- Top-5 results, ordenados por relevância
- Extrair chunk, source document, metadata (vigência, versão)

**Critérios de Aceite:**
- [ ] Função `searchDocuments(embedding, topK=5)` retorna array com chunks e metadata
- [ ] Cada resultado contém: `text`, `source`, `vigencia`, `version`
- [ ] Performance: busca leva < 500ms
- [ ] Tratamento de "sem resultados" (retorna [] e loga warning)

**Dependências:** Task 2.2.1.2 (embedding gerado)

**Estimativa:** M (3-5 horas)

**Inputs:**
- Azure AI Search endpoint: `https://${AZURE_SEARCH_SERVICE}.search.windows.net/`
- Index name: `novatech-docs`
- API key: `${AZURE_SEARCH_KEY}`
- Vector field: `vector_field` (1536 dimensões)

**Context Budget:** Top-5 chunks = ~8K tokens, incluir no total

---

### Task 2.2.1.4: Montagem de prompt com guardrails

**Descrição:**
Montar o prompt final respeitando context budget e guardrails. Implementar:
- System prompt carregado de `/prompts/system-prompt.md`
- Instruções de guardrail (ex: "Never make up information")
- Chunks inseridos com source attribution
- Tratamento de chunks contraditórios (incluir ambos, marcar como "conflito de info")
- Validação: prompt total ≤ ~10K tokens

**Critérios de Aceite:**
- [ ] Função `buildPrompt(question: string, chunks: Chunk[], systemPrompt: string)` retorna string
- [ ] Prompt contém: system prompt (~2K) + chunks (~8K) + pergunta
- [ ] Cada chunk atribui fonte: `[Fonte: Anexo A, v2.1]`
- [ ] Chunks contraditórios marcados: `⚠️ Conflito: Doc A diz X, Doc B diz Y`
- [ ] Token count logado antes de enviar ao modelo

**Dependências:** Task 2.2.1.3 (chunks recuperados)

**Estimativa:** M (3-5 horas)

**Inputs:**
- `/prompts/system-prompt.md` — system prompt finalizado
- ADR-0002 — context budget (2K system + 8K chunks)
- ADR-0003 — tratamento de conflitos de info

**Context Budget:** Total ≤ ~10K tokens

---

### Task 2.2.1.5: Chamada ao GPT-4o e retry

**Descrição:**
Enviar prompt montado ao GPT-4o-mini (ou versão apropriada) e implementar retry. Implementar:
- Client initialization
- Chamada com temperature (ex: 0.2 para respostas determinísticas)
- Retry com exponential backoff (3 tentativas, 1s, 2s, 4s)
- Parsing da resposta (extrair answer + confidence)
- Logging de latência e tokens usados

**Critérios de Aceite:**
- [ ] Função `queryModel(prompt: string)` retorna `{ answer: string, confidence: number }`
- [ ] Retry logic testada: falha 2x, sucede na 3ª
- [ ] Resposta contém confidence score (0-1)
- [ ] Latência e token count logados

**Dependências:** Task 2.2.1.4 (prompt montado)

**Estimativa:** M (3-5 horas)

**Inputs:**
- Azure OpenAI model: `gpt-4o-mini` (ou disponível)
- Temperature: 0.2 (recomendado para Q&A)

**Context Budget:** Resposta do modelo (tipicamente 200-500 tokens)

---

### Task 2.2.1.6: Testes de integração

**Descrição:**
Escrever testes de integração que validem o fluxo completo: pergunta → embedding → busca → prompt → modelo → resposta. Implementar:
- Teste 1: Pergunta simples sobre SLA (deve encontrar documento de SLA)
- Teste 2: Pergunta sobre conflito (política de devolução tem versões conflitantes)
- Teste 3: Pergunta sem documentação relevante (deve dizer "não achei")

**Critérios de Aceite:**
- [ ] 3 testes de integração implementados
- [ ] Cada teste valida: resposta contém source, confidence > 0, formato correto
- [ ] Testes rodam em < 10s (mock ou real Azure)
- [ ] Cobertura de casos: simples, conflito, vazio

**Dependências:** Tasks 2.2.1.1-5 (fluxo completo implementado)

**Estimativa:** M (3-5 horas)

**Inputs:**
- Test framework: Jest (ou existente no projeto)
- Fixtures: 3 perguntas pré-definidas para teste

**Context Budget:** Testes não consomem context de produção (mock ou sandbox)

---

## Dependência Diagram

\`\`\`
2.2.1.1 (Setup)
  ├── 2.2.1.2 (Embedding)
  │   └── 2.2.1.3 (Search)
  │       └── 2.2.1.4 (Prompt)
  │           └── 2.2.1.5 (Model)
  │               └── 2.2.1.6 (Tests)
  └── 2.2.1.6 (Tests, pode validar setup básico)
\`\`\`

## Critérios de Avaliação

- ✓ Tasks são atômicas (pode implementar 2.2.1.1 sem 2.2.1.2)
- ✓ Critérios de aceite são verificáveis (não vagos como "funcionar bem")
- ✓ Estimativas são realistas (dev com experiência consegue fazer em estimativa)
- ✓ Dependências claras (não há ciclos)
```

## Critérios de Aceite

- [ ] `tasks.md` contém 5-8 tasks atômicas
- [ ] Cada task tem: ID, descrição, critérios de aceite, dependências, estimativa
- [ ] Critérios de aceite são verificáveis (não vagos)
- [ ] Estimativas (P/M/G) são realistas para um dev TypeScript
- [ ] Há um diagrama de dependências ou tabela clara

## Passo a Passo

### Passo 1: Ler o plan.md
Leia o plan.md fornecido na section "Inputs". Identifique:
- Quais são os componentes principais (embedding, search, prompt, model)?
- Qual é a ordem de implementação (dependências)?
- Quais são os riscos/constraints (context budget, retry, timeout)?

### Passo 2: Quebrar em tasks
Para cada componente, crie uma task. Pergunte-se:
- "Um dev consegue implementar isto independentemente?"
- "Como valido que está correto?" (critério de aceite)
- "Quanto tempo leva?" (P/M/G)

Exemplo: Embedding é uma task separada de Search, porque:
- Pode implementar Embedding sem Search (testa embeddings isoladamente)
- Critério de aceite é claro: "retorna vector de 1536 dims"
- Estimativa é previsível: ~3-5 horas

### Passo 3: Usar Claude para refinar
Copie o plan.md e paste num chat com Claude:

> "Aqui está o plan.md de um endpoint de RAG. Quebre em 5-7 tasks atômicas, onde cada task:
> - É implementável por um dev de forma independente
> - Tem critério de aceite verificável
> - Tem estimativa realista (P=1-2h, M=3-5h, G=6-10h+)
>
> Formato:
> | Task | Descrição | Aceite | Deps | Est |
> |------|-----------|--------|------|-----|
> | 2.2.1.1 | [...] | [...] | [...] | [...] |
> [...]"

Claude deve sugerir tarefas como: setup + validation, embedding, search, prompt assembly, model call, tests.

### Passo 4: Detalhar cada task
Para cada task, crie uma seção com:
- Descrição: o que implementar, como, com quais constraints
- Critérios de aceite: verificáveis, não vagos
- Dependências: quais tasks precisam estar prontas antes
- Estimativa: P/M/G
- Inputs: o que o dev precisa (env vars, docs, examples)

### Passo 5: Validar ordem e dependências
Desenhe um diagrama de dependências (texto ou ASCII art):

```
Task 1 (Setup)
  ├── Task 2 (Embedding)
  │   └── Task 3 (Search)
  │       └── Task 4 (Prompt)
  │           └── Task 5 (Model)
  │               └── Task 6 (Tests)
```

Verifique: não há ciclos, ordem faz sentido.

## Dicas

- **Task atômica = pode testar isoladamente:** Se você não consegue testar uma task sem implementar 3 outras, ela não é atômica.

- **Critério de aceite = passa em teste:** "Retorna resposta corretamente" é vago. "Retorna resposta em < 2s com confidence > 0.7" é testável.

- **Estimativa = tempo real de coding:** P=1-2h é "comida simples, template + boilerplate". M=3-5h é "integração com API external, debugging". G=6-10h+ é "complexo, muitos edge cases, retry logic".

- **Dependências matériam:** Se Task B depende de Task A, documentar isso. Não coloque falsas dependências (ex: "Task 3 depende de Task 2" se 3 pode ser feito em paralelo com 2).

## Referências

- Plan — Query Endpoint (acima, nos Inputs)
- [Spec Driven Development](https://cucumber.io/docs/bdd/) — Conceito base
- [Atomic Tasks in Software](https://en.wikipedia.org/wiki/Atomic_operation) — Definição de atomicidade
