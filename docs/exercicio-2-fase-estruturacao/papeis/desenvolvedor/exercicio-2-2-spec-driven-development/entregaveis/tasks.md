# Tasks — Query Endpoint Implementation

**Desenvolvedor:** Almir Oliveira  
**Data:** 2026-06-09  
**Projeto:** NovaTech — Assistente de Suporte Logístico  
**Origem:** Conversão de plan.md via Spec Driven Development

---

## Contexto: Continuidade do Cenário 1

No Cenário 1 (Exercício Dev 1.3), foi construído um protótipo RAG com ferramentas open-source (ChromaDB + HuggingFace + Flask) que validou a arquitetura de busca semântica + prompt assembly + geração de resposta para o assistente NovaTech. As tarefas abaixo não partem do zero — implementam em produção o mesmo fluxo já validado, mas agora com as tecnologias do projeto real: Azure Functions v4, Azure AI Search, Azure OpenAI e os padrões de qualidade (Zod, pino, retry com backoff) exigidos para produção.

Decisões do protótipo que se mantêm: top-K = 5 chunks, detecção de conflito de versão nos chunks, resposta com campo `confidence`. Decisões que mudam: vector store migra de ChromaDB para Azure AI Search; embeddings migram de HuggingFace para `text-embedding-3-small`; servidor HTTP migra de Flask para Azure Functions; o deploy é gerenciado via Azure Functions host, não processo local.

---

## Overview

- **Total Tasks:** 6
- **Estimated Time:** ~18-22 horas (P=1-2h, M=3-5h, G=6-10h+)
- **Stack:** TypeScript + Azure Functions v4 + Zod + pino
- **Dependências Externas:** Azure AI Search index populado, system prompt finalizado em `/prompts/system-prompt.md`

---

## Task List

| ID | Título | Tamanho | Deps | Aceite |
|----|--------|---------|------|--------|
| 2.2.1.1 | Setup Azure Function com validação Zod | P | — | `POST /api/query` retorna 200 com payload válido, 400 com inválido |
| 2.2.1.2 | Integração Azure OpenAI (embedding) | M | 2.2.1.1 | `getEmbedding()` retorna vetor 1536-dim; retry log visível |
| 2.2.1.3 | Busca semântica Azure AI Search | M | 2.2.1.2 | `searchDocuments()` retorna top-5 chunks com metadata em < 500ms |
| 2.2.1.4 | Montagem de prompt com guardrails | M | 2.2.1.3 | Prompt ≤ ~10K tokens; chunks contraditórios marcados com ⚠️ |
| 2.2.1.5 | Chamada ao GPT-4o-mini com retry | M | 2.2.1.4 | `queryModel()` retorna `{ answer, confidence }`; retry testado |
| 2.2.1.6 | Testes de integração (3 cenários) | M | 2.2.1.1–5 | 3 testes passam: simples, conflito, sem resultado |

---

## Detailed Tasks

### Task 2.2.1.1: Setup Azure Function com validação Zod

**Descrição:**  
Criar o Azure Function `query` com HTTP trigger (POST /api/query). Implementar:
- Input schema com Zod: `{ question: string (1–500 chars, trimmed) }`
- Output schema com Zod: `{ answer: string, sources: Source[], confidence: number (0–1) }`
- Type `Source`: `{ document: string, vigencia: string }`
- Logging estruturado com pino: cada evento com campos `function`, `action`, dados relevantes
- Error handling: 400 para Zod errors, 500 para server errors
- Sem secrets hardcoded; usar env vars para qualquer credencial futura

**Critérios de Aceite:**
- [ ] Arquivo `src/functions/query.ts` existe e compila sem erros (`npm run build`)
- [ ] `curl -X POST http://localhost:7071/api/query -H "Content-Type: application/json" -d '{"question":"O que é SLA?"}'` retorna HTTP 200 com JSON válido
- [ ] `curl` com `{"question":""}` retorna HTTP 400 com campo `error` na resposta
- [ ] `curl` com `{"question":"<string de 501 chars>"}` retorna HTTP 400
- [ ] Logs são JSON estruturado (campos: `function`, `action`, dados contextuais)
- [ ] Nenhum `console.log` ou log sem estrutura no código

**Dependências:** Nenhuma (task inicial)

**Estimativa:** P (1–2 horas)

**Inputs necessários:**
- Zod docs: `z.string().trim().min(1).max(500)`
- Azure Functions v4 TypeScript: estrutura de `app.http()` ou `AzureFunction`
- pino: `import pino from 'pino'; const logger = pino();`

**Context Budget:** Não aplicável nesta task

---

### Task 2.2.1.2: Integração Azure OpenAI (Embedding)

**Descrição:**  
Criar função `getEmbedding(question: string): Promise<number[]>` que:
- Inicializa client Azure OpenAI com credenciais de env vars
- Chama deployment `text-embedding-3-small` (ou configurável via env)
- Retorna embedding de 1536 dimensões
- Implementa retry com exponential backoff: 3 tentativas, delays 1s / 2s / 4s
- Timeout de 10s por tentativa
- Loga latência e tokens usados em cada chamada

**Critérios de Aceite:**
- [ ] Função `getEmbedding(question: string)` exportada de `src/services/embedding.ts`
- [ ] Retorna `number[]` com length 1536
- [ ] Retry testado manualmente: forçar falha simulada loga `action: 'retry'` com `attempt: 1` e `attempt: 2`
- [ ] Log de sucesso contém: `action: 'embedding_success'`, `duration` em ms, `tokenCount`
- [ ] Timeout de 10s: se exceder, lança `ExternalServiceError` com `retryable: true`
- [ ] Env vars usadas: `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT`

**Dependências:** Task 2.2.1.1 (projeto base configurado; pino e padrão de logging estabelecidos)

**Estimativa:** M (3–5 horas)

**Inputs necessários:**
- `@azure/openai` SDK
- Endpoint: `https://${AZURE_OPENAI_RESOURCE}.openai.azure.com/`
- Deployment: `text-embedding-3-small` (1536 dims)
- Função `retryExponentialBackoff` da Foundation Skill de Error Handling

**Context Budget:** Embedding é calculado externamente; não consome context do LLM nesta task

---

### Task 2.2.1.3: Busca Semântica Azure AI Search

**Descrição:**  
Criar função `searchDocuments(embedding: number[], topK = 5): Promise<Chunk[]>` que:
- Inicializa client Azure AI Search
- Executa vector search usando o embedding como query vector
- Retorna top-K resultados, cada um com: `text`, `source`, `vigencia`, `version`
- Trata caso "sem resultados" retornando `[]` e logando warning
- Performance: busca deve completar em < 500ms

**Critérios de Aceite:**
- [ ] Tipo `Chunk` definido: `{ text: string, source: string, vigencia: string, version: string }`
- [ ] Função `searchDocuments` exportada de `src/services/search.ts`
- [ ] Com embedding real, retorna array com `0 ≤ length ≤ topK`
- [ ] Cada chunk contém todos os campos definidos no tipo
- [ ] Caso sem resultado: retorna `[]` e log contém `action: 'search_no_results'`
- [ ] Latência logada: `action: 'search_success'`, `duration`, `resultCount`
- [ ] Env vars usadas: `AZURE_SEARCH_ENDPOINT`, `AZURE_SEARCH_QUERY_KEY`, `AZURE_SEARCH_INDEX_NAME`

**Dependências:** Task 2.2.1.2 (embedding gerado para testes)

**Estimativa:** M (3–5 horas)

**Inputs necessários:**
- `@azure/search-documents` SDK
- Index name: `novatech-docs` (configurável via env `AZURE_SEARCH_INDEX_NAME`)
- Vector field: `vector_field` (1536 dims)
- ADR-0003: tratamento de documentos com datas de vigência

**Context Budget:** Top-5 chunks ≈ 8K tokens; manter este limite para próxima task

---

### Task 2.2.1.4: Montagem de Prompt com Guardrails

**Descrição:**  
Criar função `buildPrompt(question: string, chunks: Chunk[], systemPrompt: string): string` que:
- Carrega system prompt de `/prompts/system-prompt.md`
- Insere chunks com atribuição de fonte: `[Fonte: ${chunk.source}, vigência: ${chunk.vigencia}]`
- Detecta e marca chunks contraditórios: `⚠️ Conflito: "${source1}" diz X, "${source2}" diz Y`
- Valida que prompt total ≤ ~10K tokens (2K system + 8K chunks + pergunta)
- Loga token count antes de retornar

**Critérios de Aceite:**
- [ ] Função `buildPrompt` exportada de `src/services/prompt.ts`
- [ ] Prompt retornado contém: system prompt, chunks com `[Fonte: ...]`, pergunta do usuário
- [ ] Com 2 chunks sobre mesmo tópico com respostas conflitantes: prompt contém `⚠️ Conflito`
- [ ] Token count logado: `action: 'prompt_assembled'`, `tokenCount`, `chunkCount`
- [ ] Token count > 10K lança warning (não erro): `action: 'prompt_budget_warning'`
- [ ] ADR-0002 respeitado: system prompt ≤ 2K tokens, chunks ≤ 8K tokens

**Dependências:** Task 2.2.1.3 (chunks disponíveis com tipo Chunk)

**Estimativa:** M (3–5 horas)

**Inputs necessários:**
- `/prompts/system-prompt.md` — system prompt do projeto
- ADR-0002: context budget (2K system + 8K chunks)
- ADR-0003: tratamento de conflitos de versão de documentos
- Biblioteca de contagem de tokens: `tiktoken` ou equivalente

**Context Budget:** Total ≤ ~10K tokens (limite definido em ADR-0002)

---

### Task 2.2.1.5: Chamada ao GPT-4o-mini com Retry

**Descrição:**  
Criar função `queryModel(prompt: string): Promise<{ answer: string, confidence: number }>` que:
- Inicializa client Azure OpenAI para chat completions
- Usa temperature 0.2 (determinístico para Q&A)
- Implementa retry com exponential backoff: 3 tentativas, 1s / 2s / 4s
- Extrai `answer` e `confidence` da resposta
- Loga latência e token count

**Critérios de Aceite:**
- [ ] Função `queryModel` exportada de `src/services/model.ts`
- [ ] Retorna `{ answer: string, confidence: number }` onde `0 ≤ confidence ≤ 1`
- [ ] Retry testado: falha 2x, sucede na 3ª → log mostra `attempt: 1`, `attempt: 2`, `attempt: 3` com sucesso
- [ ] Log de sucesso: `action: 'model_success'`, `duration`, `promptTokens`, `completionTokens`
- [ ] Env vars usadas: `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_CHAT_DEPLOYMENT`

**Dependências:** Task 2.2.1.4 (prompt montado)

**Estimativa:** M (3–5 horas)

**Inputs necessários:**
- `@azure/openai` SDK (mesma instância da task 2.2.1.2)
- Model: `gpt-4o-mini` (ou `AZURE_OPENAI_CHAT_DEPLOYMENT`)
- Temperature: 0.2

**Context Budget:** Resposta típica ≈ 200–500 tokens

---

### Task 2.2.1.6: Testes de Integração

**Descrição:**  
Escrever 3 testes de integração que validam o fluxo completo: `POST /api/query` → embedding → busca → prompt → modelo → resposta.

- **Teste 1 — Pergunta simples:** `"Qual é o SLA padrão?"` → resposta com source, confidence > 0.5
- **Teste 2 — Conflito de versão:** pergunta sobre política que tem versões conflitantes → resposta contém `⚠️ Conflito` ou menciona ambas as versões
- **Teste 3 — Sem documentação relevante:** `"Qual o preço do Bitcoin?"` → resposta indica que não encontrou informação relevante

**Critérios de Aceite:**
- [ ] 3 testes implementados em `tests/integration/query.test.ts`
- [ ] Cada teste valida: status HTTP 200, resposta contém `sources` (array), `confidence` é number ≥ 0
- [ ] Testes podem rodar com mock de Azure (jest.mock) ou sandbox real
- [ ] `npm test` executa os 3 testes e todos passam
- [ ] Teste de conflito valida que a resposta menciona mais de uma fonte
- [ ] Teste sem resultado valida que `confidence < 0.5` ou `sources.length === 0`

**Dependências:** Tasks 2.2.1.1–5 (fluxo completo implementado)

**Estimativa:** M (3–5 horas)

**Inputs necessários:**
- Framework: Jest + ts-jest
- 3 fixtures de perguntas pré-definidas
- Mock de Azure services (ou credenciais de sandbox)

**Context Budget:** Testes com mock não consomem tokens de produção

---

## Diagrama de Dependências

```
2.2.1.1 (Setup + Validação)
    ├── 2.2.1.2 (Embedding)
    │       └── 2.2.1.3 (Search)
    │               └── 2.2.1.4 (Prompt)
    │                       └── 2.2.1.5 (Model)
    │                               └── 2.2.1.6 (Tests)
    └── 2.2.1.6 (Tests também validam setup básico)
```

---

## Processo com Copilot

**Prompt inicial:** "A partir do seguinte plan.md de um endpoint RAG Azure Function (TypeScript, Zod, pino), decomponha em tasks atômicas e testáveis. Cada task deve ter: ID, descrição, critérios de aceite verificáveis, dependências e estimativa de tamanho (P/M/G)."

**Output gerado:** O Copilot gerou 4 tasks grandes: (1) "Criar Azure Function com validação", (2) "Integrar Azure OpenAI e AI Search", (3) "Montar prompt e chamar modelo", (4) "Escrever testes". Tasks 2 e 3 eram interdependentes e não testáveis isoladamente.

**O que foi descartado:** As tasks 2 e 3 do Copilot — integraram embedding, search, prompt e modelo em dois blocos, violando o princípio de atomicidade. Não havia como testar `getEmbedding()` sem ter o search configurado.

**O que foi refatorado:**
- Task 2 do Copilot dividida em três tasks (2.2.1.2 Embedding, 2.2.1.3 Search, 2.2.1.4 Prompt) — cada uma com output independente e critério de aceite próprio
- Critérios de aceite reescritos: o Copilot usava "endpoint funciona corretamente" → substituídos por comandos curl específicos e assertions de tipo/valor
- Context Budget adicionado por task (ex: "Top-5 chunks ≈ 8K tokens") — o Copilot não considerava tokens como restrição de design

**Iteração:** Um segundo prompt pediu ao Copilot para revisar os critérios de aceite da Task 2.2.1.6 (testes). O output sugeriu os 3 cenários de teste (simples, conflito, sem resultado) que foram adotados com ajuste na assertion de confiança (`confidence < 0.3` para sem resultado, não apenas `< 0.5`).

## Critérios de Avaliação do tasks.md

- ✓ Tasks são atômicas: cada uma pode ser implementada e testada independentemente
- ✓ Critérios de aceite são verificáveis: todos têm comandos concretos ou comportamentos observáveis
- ✓ Estimativas realistas: P = boilerplate, M = integração com Azure API
- ✓ Dependências sem ciclos: fluxo linear 1→2→3→4→5→6
- ✓ Inputs explícitos: cada task sabe de onde vêm suas dependências
