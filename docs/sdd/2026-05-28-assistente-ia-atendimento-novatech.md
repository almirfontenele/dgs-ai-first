# Design: Assistente de IA para Atendimento NovaTech (V1/MVP)

**Data:** 2026-05-28
**Autor:** Almir Oliveira — DB1
**Status:** Draft
**Referências:** [PRD](../prds/2026-05-28-assistente-ia-atendimento-novatech.md) · [ADR-001](../ADR-001-regras-negocio-novatech.md) · [ADR-002](../ADR-002-validacao-arquitetura.md) · [Estudo de Viabilidade](../../estudo_de_viabilidade.md)

---

## Abordagem Técnica

Sistema RAG (Retrieval-Augmented Generation) em Python, integrado ao Microsoft Teams via Azure Bot Service. O assistente é uma ferramenta de **consulta e orientação** — não executa ações transacionais (registro de chamados, SLA tracking, aprovações). Cálculos financeiros são delegados a uma Azure Function determinística; o LLM extrai parâmetros e formata a resposta com citação de fonte.

Stack: **LangChain** (orquestração) + **ChromaDB** (vector store self-hosted) + **Azure OpenAI GPT-4o** (geração) + **Azure Bot Service** (interface Teams).

---

## Arquitetura

```
Atendente (Teams — Adaptive Card)
      │
      ▼
Azure Bot Service ──────────────────────────────────────────
      │                                                     │
      ▼                                                     │
Orquestrador RAG (LangChain Python — Azure Container Apps) │
      │                                                     │
      ├──▶ ChromaDB: collection-normativo                  │
      │    (POL, PROC, SLA | filtro: status=vigente)       │
      │                                                     │
      ├──▶ ChromaDB: collection-informal                   │
      │    (FAQ | fallback, score < 0.75 | aviso explícito)│
      │                                                     │
      ├──▶ Azure OpenAI GPT-4o (temperatura 0)             │
      │    ↕ extração de parâmetros                        │
      ├──▶ Azure Function: Motor de Cálculo (Python)       │
      │    (frete especial, descontos de volume)           │
      │                                                     │
      └──▶ Azure Monitor + Application Insights ───────────┘

Pipeline de Ingestão (Azure Function App — agendado diário):
  SharePoint ──▶ Document Intelligence SDK ──▶ Validação metadata ──▶ ChromaDB upsert
  Confluence ──▶ API connector              ──▶ Chunking semântico ──▶ ChromaDB upsert
  Excel      ──▶ openpyxl/pandas            ──▶ Chunking estruturado──▶ ChromaDB upsert
                                                        │
                                               Quarentena (Blob)
                                          (docs sem metadata obrigatório)
```

---

## Decisões de Arquitetura

### Decisão 1: LangChain (Python) como orquestrador

| Opção | Trade-off | Decisão |
|---|---|---|
| **LangChain Python** | Stack Python end-to-end; integração nativa com ChromaDB via `langchain-chroma`; maior ecossistema RAG | ✅ Adotado |
| Semantic Kernel (C#) | Melhor integração Teams/Microsoft nativa; exigiria pipeline de ingestão em linguagem diferente | ❌ Rejeitado |

**Por quê:** Elimina a barreira de linguagem entre pipeline de ingestão e orquestração. Todo o stack em Python reduz onboarding e surface de manutenção. Decidido no ADR-002 §5.4.

---

### Decisão 2: ChromaDB self-hosted vs. Azure AI Search

| Opção | Trade-off | Decisão |
|---|---|---|
| **ChromaDB (Container Apps)** | Sem SLA gerenciado; requer estratégia de HA própria; custo ~USD 80/mês em compute | ✅ Adotado |
| Azure AI Search S1 | SLA gerenciado 99,9%; ~USD 250/mês; busca híbrida nativa | ❌ Rejeitado |

**Por quê:** Custo operacional reduz USD 170/mês. HA coberta por 4 pilares: réplicas mínimas 2 no Container Apps, volume Azure Files ZRS, backup diário para Blob, alertas no Azure Monitor. RTO < 60s para falha de réplica (ADR-002 §5.5.3).

---

### Decisão 3: Motor de cálculo determinístico separado do LLM

| Opção | Trade-off | Decisão |
|---|---|---|
| **Azure Function Python** | Componente adicional; requer extração de parâmetros pelo LLM antes de chamar | ✅ Adotado |
| LLM faz o cálculo | Risco de alucinação em valores financeiros; não determinístico | ❌ Rejeitado |

**Por quê:** RF-004 (cálculo frete especial) e RF-007 (desconto de volume) têm implicação financeira direta — erros geram passivo contratual. LLMs não são determinísticos para operações matemáticas precisas (ADR-002 §5.1). O LLM extrai parâmetros; a Azure Function calcula com as tabelas PROC-042-v1/v2.

---

### Decisão 4: Duas collections separadas no ChromaDB

| Collection | Conteúdo | Estratégia de retrieval |
|---|---|---|
| `collection-normativo` | POL, PROC, SLA | Consultada primeiro; filtro `where={"status": "vigente"}`; sem aviso ao atendente |
| `collection-informal` | FAQ, wikis, e-mails de orientação | Fallback quando normativo retorna score < 0.75; resposta sempre prefixada com `[Fonte: informal — confirme com documentação oficial]` |

**Por quê:** Risco 2 (ADR-002 §5.2) — FAQ informal contém contradições com normativos. Segregação garante que respostas do corpus normativo tenham prioridade e que fontes informais sejam identificadas explicitamente.

---

## Fluxo de Dados

### Consulta (runtime)

```
1. Atendente envia mensagem no Teams
2. Azure Bot Service encaminha para o Orquestrador RAG
3. LangChain executa retrieval sequencial:
   a. Consulta collection-normativo (k=5, where={"status":"vigente"})
   b. Se max(score) < 0.75: consulta collection-informal (k=3) + marca para aviso
4. LangChain verifica se a consulta envolve cálculo (frete/desconto):
   a. Se sim: LLM extrai parâmetros → Azure Function calcula → LLM formata resultado com fonte
   b. Se não: LLM gera resposta com chunks recuperados + citação de fonte + trecho original
5. Resposta enviada ao Teams via Adaptive Card (inclui: resposta, fonte, versão, trecho)
6. LangChain Callbacks registram: query, chunks recuperados, resposta, scores (Application Insights)
```

### Ingestão (pipeline diário)

```
1. Azure Function App dispara às 02h UTC (cron: "0 2 * * *")
2. Para cada fonte (SharePoint, Confluence, Blob/Excel):
   a. Busca documentos modificados nas últimas 24h (delta sync)
   b. Extrai conteúdo: Document Intelligence SDK (PDF/Word), openpyxl/pandas (Excel), API (Confluence)
   c. Valida metadata obrigatório: status, versao, data_vigencia, responsavel, fonte
   d. Sem metadata: move para Blob container "chroma-quarentena/"; emite alerta Azure Monitor
   e. Com metadata: chunking semântico (chunk_size=512, overlap=50) → embeddings (text-embedding-3-large)
   f. Upsert no ChromaDB via chave (doc_id + chunk_index) — evita duplicatas
3. Emite métrica: ingestao_success (documentos indexados, rejeitados, em quarentena)
```

---

## Schema de Metadata (ChromaDB)

```python
# Campos obrigatórios — pipeline rejeita documento sem estes
METADATA_REQUIRED = {
    "status": str,          # "vigente" | "revogado" | "rascunho"
    "versao": str,          # ex: "v2.1"
    "data_vigencia": str,   # ISO 8601: "2024-01-15"
    "responsavel": str,     # email ou sigla
    "fonte": str,           # "normativo" | "informal"
}

# Campos opcionais
METADATA_OPTIONAL = {
    "tipo_documento": str,  # "POL" | "PROC" | "SLA" | "FAQ" | "WIKI"
    "doc_id": str,          # ID único do documento na fonte original
    "chunk_index": int,     # índice do chunk dentro do documento
}
```

---

## Motor de Cálculo — Interface

```python
# Azure Function endpoint (POST /api/calcular-frete)
# Input
{
  "peso_kg": float,          # peso da carga
  "regiao": str,             # "Sul" | "Sudeste" | "Centro-Oeste" | "Nordeste" | "Norte"
  "data_chamado": str,       # ISO 8601 — determina se usa PROC-042-v1 ou v2
  "valor_base": float,       # valor base do frete
  "fretes_mes": int          # total de fretes especiais do cliente no mês corrente
}

# Output
{
  "valor_calculado": float,
  "fator_peso": float,
  "multiplicador_regional": float,
  "desconto_volume": float,  # 0.0 | 0.05 | 0.10
  "versao_proc": str,        # "PROC-042-v1" | "PROC-042-v2"
  "requer_aprovacao": bool   # true se peso > 5.000 kg
}
```

---

## Arquivos a Criar

| Arquivo | Ação | Descrição |
|---|---|---|
| `src/bot/app.py` | Criar | Azure Bot Service handler — recebe mensagens do Teams e responde |
| `src/rag/orchestrator.py` | Criar | LangChain RAG pipeline — retrieval sequencial, prompt engineering |
| `src/rag/retriever.py` | Criar | Lógica de retrieval: normativo primeiro, informal como fallback |
| `src/rag/prompt_templates.py` | Criar | Templates de prompt com instrução de citação de fonte e não-interpolação |
| `src/ingestion/pipeline.py` | Criar | Pipeline de ingestão diária — SharePoint, Confluence, Excel |
| `src/ingestion/validators.py` | Criar | Validação de metadata obrigatório e roteamento para quarentena |
| `src/ingestion/extractors/pdf.py` | Criar | Extração de PDF/Word via Azure Document Intelligence SDK |
| `src/ingestion/extractors/excel.py` | Criar | Extração de Excel via openpyxl/pandas |
| `src/ingestion/extractors/confluence.py` | Criar | Extração via Confluence API (token de serviço) |
| `src/calculator/function_app.py` | Criar | Azure Function — motor de cálculo determinístico (frete + desconto) |
| `src/calculator/rules.py` | Criar | Tabelas PROC-042-v1 e v2 em código, sem hardcode inline |
| `infra/container-apps.bicep` | Criar | Definição de infra: ChromaDB server (min 2 réplicas), Azure Files ZRS, orquestrador |
| `infra/function-apps.bicep` | Criar | Definição: Azure Function App (ingestão + calculadora) |
| `infra/monitoring.bicep` | Criar | Azure Monitor alerts, Application Insights, Log Analytics Workspace |
| `tests/unit/test_calculator.py` | Criar | Testes das regras PROC-042-v1/v2 com casos conhecidos |
| `tests/integration/test_retrieval.py` | Criar | Testes de retrieval: normativo tem prioridade sobre informal |
| `tests/e2e/test_bot_responses.py` | Criar | Testes de resposta end-to-end: citação de fonte, aviso informal, recusa sem fonte |

---

## Estratégia de Testes

| Camada | O que testar | Abordagem |
|---|---|---|
| Unit | Motor de cálculo (PROC-042-v1/v2), validação de metadata, chunking | pytest — fixtures com casos conhecidos dos ADRs |
| Integration | Retrieval sequencial (normativo > informal), filtro `status=vigente`, upsert idempotente | ChromaDB em container local (Docker) — sem mock |
| E2E | Respostas do bot: citação de fonte obrigatória, aviso para fonte informal, recusa quando sem fonte, cálculo de frete via Azure Function | Bot emulado localmente (Bot Framework Emulator) + Azure Function em modo local |
| Qualidade RAG | Precisão das respostas — sample de 50 perguntas com gabarito baseado nos ADRs | Avaliação humana semanal pelo supervisor de atendimento |

---

## Rollout

### Sprint 0 (semanas 1–2) — Pré-requisito
- NovaTech resolve PROC-042 v1/v2 e aplica metadata em todos os documentos
- DB1 valida extração de tabelas críticas (SLA, multiplicadores) manualmente
- Provisionamento Azure (Container Apps, Function Apps, Bot Service, OpenAI)

### Sprint 1 (semanas 3–6) — Infraestrutura RAG
- Pipeline de ingestão + ChromaDB + embeddings do corpus normativo
- Motor de cálculo (Azure Function) com testes de regressão contra ADR-001

### Sprint 2 (semanas 7–9) — Interface e integração
- Bot no Teams + prompt engineering + Adaptive Cards
- Corpus informal (FAQ auditado) na collection-informal
- Guardrails: temperatura 0, instrução de não-interpolação, recusa sem fonte

### Sprint 3 (semanas 10–11) — Piloto
- 5–10 atendentes voluntários; coleta de feedback e ajuste de retrieval/prompt
- Validação da meta: tempo de busca < 2 min

### Go-live (semana 12)
- Rollout para 45 atendentes
- Handoff do pipeline de re-ingestão para a operação da NovaTech

---

## Questões em Aberto

- [ ] Como o bot recebe o contexto da data de abertura do chamado (para determinar v1/v2)? O atendente informa manualmente ou há integração com Azure DevOps?
- [ ] A Azure Function do motor de cálculo precisa autenticar o chamador (apenas o orquestrador RAG pode chamar)?
- [ ] Qual o threshold de score aceitável para recusa de resposta ("não encontrei informação confiável")? 0.75 é o default — validar com time de atendimento no piloto.
- [ ] Processo operacional para o owner de conhecimento da NovaTech aprovar atualizações da base: fluxo via PR no SharePoint ou interface dedicada?
- [ ] PROC-043 (cargas perigosas acima de 500kg) está em revisão pelo Compliance — indexar versão draft ou bloquear consultas sobre esse tema até publicação?
