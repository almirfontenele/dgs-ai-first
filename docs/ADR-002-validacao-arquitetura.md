# ADR-002 — Validação da Arquitetura RAG
## Sistema de Atendimento ao Cliente — NovaTech

**Status:** Aprovado  
**Data:** 2026-05-28  
**Revisão:** 2026-05-28 — Estratégia de HA e pré-requisitos de dados confirmados (Sprint 0)  
**Autor:** Product Manager  
**Referências:** ADR-001 (Regras de Negócio), estudo_de_viabilidade.md, docs/inputs.md

---

## 1. Arquitetura Avaliada

```
Atendente (Teams)
      │
      ▼
Azure Bot Service ──▶ Azure OpenAI (GPT-4o)
                             │
                       Orquestrador RAG
                       (LangChain — Python)
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
          ChromaDB       Confluence    Blob Storage
        (vector store)   connector    (Planilhas)
```

### Stack declarado

| Camada | Tecnologia |
|--------|-----------|
| LLM | Azure OpenAI — GPT-4o |
| Embeddings | text-embedding-3-large |
| Vector Store | ChromaDB (self-hosted / Container Apps) |
| Ingestão | Azure Document Intelligence + Python pipeline |
| Orquestração | LangChain (Python) |
| Bot | Azure Bot Service + Teams channel |
| Infra | Azure App Service / Container Apps |

---

## 2. Critérios de Validação

A validação cruza a arquitetura proposta contra quatro dimensões:

1. **Cobertura dos Requisitos** — a arquitetura atende os RFs e RNFs do ADR-001?
2. **Mitigação dos Riscos** — os riscos do estudo de viabilidade estão cobertos?
3. **Adequação Técnica** — as tecnologias escolhidas são adequadas ao problema?
4. **Gaps Arquiteturais** — o que está faltando ou subdefinido?

---

## 3. Cobertura dos Requisitos Funcionais

| RF | Requisito | Suporte na arquitetura | Status |
|----|-----------|----------------------|--------|
| RF-001 | Abertura de chamado com CT-e, fotos e motivo | Fora do escopo do assistente de IA — pertence ao Portal do Cliente (sistema separado). O assistente **consulta**, não registra. | ⚠️ Fora de escopo — confirmar limite do sistema |
| RF-002 | Validar elegibilidade de devolução automaticamente | O LLM pode inferir elegibilidade via prompt + chunks recuperados da POL-001. Requer chunk especializado com RN-001 e RN-002. | ✅ Coberto via RAG + prompt engineering |
| RF-003 | Rotear cargas inelegíveis para Gestão de Riscos | Bot pode exibir instrução de roteamento com ramal 4500 quando a resposta indicar inelegibilidade. Requer lógica no prompt ou pós-processamento. | ✅ Coberto via prompt / resposta estruturada |
| RF-004 | Calcular frete especial com fórmula v2 | LLMs não executam cálculo com garantia de precisão. A arquitetura atual não tem componente de cálculo determinístico. | ❌ Lacuna crítica — ver seção 5.1 |
| RF-005 | Aplicar multiplicadores v1 para chamados pré-01/12/2023 | Depende de metadata de data de abertura do chamado disponível no contexto da consulta. Requer passagem de contexto pelo bot. | ⚠️ Dependente de design do bot |
| RF-006 | Exigir aprovação para cargas > 5.000 kg | Informação de negócio — o assistente pode responder que aprovação é necessária. Fluxo de aprovação não faz parte do escopo declarado. | ⚠️ Informativo apenas — fluxo de aprovação externo |
| RF-007 | Aplicar desconto de volume automaticamente | Mesmo problema do RF-004: cálculo numérico. O assistente pode informar a regra, mas não calcular o desconto com confiabilidade. | ❌ Lacuna — ver seção 5.1 |
| RF-008 | Classificar cliente no tier correto e exibir no painel | Requer integração com sistema de CRM/contratos da NovaTech. Não está definido na arquitetura. | ❌ Lacuna de integração |
| RF-009 | Iniciar contador de SLA e alertar atendente | Sistema de SLA é responsabilidade do Azure DevOps (conforme SLA-2024 §5). O assistente pode informar prazos, não controlá-los. | ⚠️ Fora de escopo do assistente |
| RF-010 | Pausar relógio SLA fora do horário comercial | Idem RF-009 — pertence ao sistema de chamados. | ⚠️ Fora de escopo do assistente |
| RF-011 | Detectar e classificar incidentes críticos | O bot pode identificar critérios (valor > R$ 100k, carga perigosa) a partir de dados fornecidos pelo atendente e regras na POL. | ✅ Coberto com lógica de prompt + contexto do chamado |
| RF-012 | Registrar violações de SLA e calcular créditos | Pertence ao sistema de chamados (Azure DevOps). Fora do escopo do assistente. | ⚠️ Fora de escopo |
| RF-013 | Bloquear descontos não autorizados | O assistente pode orientar que descontos requerem aprovação do Comercial. Bloqueio real pertence ao sistema de atendimento. | ⚠️ Informativo apenas |
| RF-014 | Relatório mensal de performance por tier | Fora do escopo do assistente de IA — pertence à camada de analytics/BI. | ⚠️ Fora de escopo |

**Resumo de cobertura de RFs:**
- ✅ Cobertos pela arquitetura: RF-002, RF-003, RF-011 (3/14 = 21%)
- ⚠️ Parcialmente cobertos / informativos / fora de escopo: RF-001, RF-005, RF-006, RF-009, RF-010, RF-012, RF-013, RF-014 (8/14)
- ❌ Lacunas críticas: RF-004, RF-007, RF-008 (3/14)

> **Conclusão:** A arquitetura RAG cobre bem o caso de uso principal (consulta e orientação). Requisitos de ação (cálculo, registro, roteamento automatizado, SLA tracking) estão fora do escopo declarado e precisam ser endereçados por sistemas complementares ou redefinição de escopo.

---

## 4. Cobertura dos Requisitos Não Funcionais

| RNF | Requisito | Avaliação |
|-----|-----------|-----------|
| RNF-001 | Disponibilidade 99,5% / 99,0% / 98,0% por tier | ChromaDB self-hosted no Container Apps não tem SLA gerenciado. Estratégia de HA definida na seção 5.5: replicação via Container Apps + volume persistido + backup diário para Blob Storage. Azure OpenAI tem SLA de 99,9%. | ✅ Coberto via estratégia de HA (seção 5.5) |
| RNF-002 | Validação de elegibilidade em até 3s | ChromaDB oferece retrieval em memória com latência <100ms local, melhorando o budget para geração GPT-4o. Meta de 3s é viável com otimização de chunk size. | ✅ Viável com tuning |
| RNF-003 | Imutabilidade dos parâmetros de chamados históricos | ChromaDB suporta versionamento por `collection` — snapshot por data de chamado via collections nomeadas com metadata `data_vigencia`. Schema de metadata obrigatório definido na seção 5.5. | ✅ Coberto via schema de metadata (seção 5.5) |
| RNF-004 | Rastreabilidade completa de ações | Azure Monitor + Application Insights cobrem logs de infraestrutura. LangChain Callbacks permitem log nativo de chunks recuperados e respostas. | ⚠️ Requer implementação de callbacks |
| RNF-005 | RBAC para aprovação de cargas > 5.000 kg | Não há camada de autorização definida na arquitetura. Azure AD pode ser integrado via Azure Bot Service. | ❌ Lacuna |
| RNF-006 | Validação de documentação ANTT para cargas perigosas | Não há integração com base ANTT definida. O assistente pode apenas orientar — validação real requer integração externa ou checklist manual. | ❌ Lacuna |
| RNF-007 | Relatório de SLA auditável por chamado | Pertence ao Azure DevOps / sistema de chamados. Fora do escopo do assistente. | ⚠️ Fora de escopo |
| RNF-008 | Suporte a 500 chamados simultâneos sem degradação | Volume atual é de ~192 consultas/dia (~8/hora). ChromaDB em Container Apps suporta escala horizontal com múltiplas réplicas. Pico de 500 simultâneos requer load test. | ✅ Viável com load test |
| RNF-009 | Painel do atendente com tier, SLA e tempo restante | Interface não está especificada na arquitetura. O Teams bot precisa de card adaptativo ou integração com painel dedicado. | ⚠️ Requer design de interface |

---

## 5. Lacunas Arquiteturais Críticas

### 5.1. Ausência de Motor de Cálculo Determinístico

**Problema:** RF-004 (cálculo de frete especial) e RF-007 (desconto de volume) exigem cálculos numéricos precisos com implicação financeira. LLMs não são determinísticos para operações matemáticas e podem interpolar valores incorretamente — especialmente sob o Risco 4 do estudo de viabilidade (alucinação em dados financeiros).

**Decisão recomendada:** Implementar um **motor de cálculo dedicado** (microserviço ou função serverless) que receba os parâmetros extraídos pela IA (região, peso, data do chamado) e aplique as fórmulas das PROC-042-v1/v2 deterministicamente. O LLM extrai os parâmetros, o motor calcula.

```
Atendente informa: "carga 2.000kg, destino Nordeste"
       │
       ▼
   LLM extrai: { peso: 2000, regiao: "Nordeste", data_chamado: "2024-01-15" }
       │
       ▼
   Motor de cálculo (Azure Function):
   → Seleciona v2 (chamado > 01/12/2023)
   → Fator de peso: 1,15 (1.001–3.000 kg)
   → Multiplicador: 1,5 (Nordeste v2)
   → Resultado: Valor base × 1,5 × 1,15
       │
       ▼
   LLM formata e cita a fonte
```

### 5.2. Ausência de Segregação de Corpus na Arquitetura

**Problema:** O Risco 2 (FAQ informal misturado à base oficial) exige separação entre corpus normativo e informal. A arquitetura não define collections separadas no ChromaDB nem estratégia de retrieval diferenciada por corpus.

**Decisão recomendada:** Criar duas collections no ChromaDB:
- `collection-normativo`: POL, PROC, SLA — fonte de verdade, prioridade máxima no retrieval
- `collection-informal`: FAQ, wikis — consultado somente como complemento, com aviso explícito ao atendente

No LangChain, usar `EnsembleRetriever` ou retrieval sequencial: consultar `collection-normativo` primeiro; recorrer a `collection-informal` apenas se nenhum chunk relevante for encontrado.

### 5.3. Ausência de Pipeline de Governança de Metadata

**Problema:** O Risco 1 (documentos conflitantes) e o Risco 3 (ausência de processo de atualização) requerem que cada documento indexado tenha campos obrigatórios de metadata: `status`, `versao`, `data_vigencia`, `responsavel`. A arquitetura não define esse schema nem o mecanismo de quarentena para documentos sem metadata completo.

**Decisão recomendada:** O pipeline de ingestão deve:
1. Validar presença de metadata obrigatório antes de indexar
2. Rejeitar e colocar em quarentena documentos sem `status` ou `data_vigencia`
3. Aplicar filtro de retrieval por `status: vigente` em todas as queries — no ChromaDB via `where={"status": "vigente"}` na chamada de similarity search

### 5.5. Pré-requisitos de Dados e Estratégia de HA do ChromaDB — RESOLVIDO

#### 5.5.1 Schema de Metadata Obrigatório

Todo documento indexado no ChromaDB deve conter os seguintes campos de metadata. O pipeline de ingestão valida a presença desses campos **antes** de inserir qualquer chunk — documentos incompletos são rejeitados e colocados em quarentena.

| Campo | Tipo | Obrigatório | Uso |
|---|---|---|---|
| `status` | `string` (`vigente` \| `revogado` \| `rascunho`) | Sim | Filtro em todas as queries: `where={"status": "vigente"}` |
| `versao` | `string` (ex.: `"v2.1"`) | Sim | Controle de versão — chunks de versões anteriores permanecem com `status: revogado` |
| `data_vigencia` | `string` ISO 8601 (ex.: `"2024-01-15"`) | Sim | Descarte de documentos expirados; suporte ao RNF-003 (imutabilidade histórica) |
| `responsavel` | `string` (email ou sigla do responsável) | Sim | Rastreabilidade e governança (RNF-004) |
| `fonte` | `string` (`normativo` \| `informal`) | Sim | Roteamento para a collection correta no pipeline de ingestão |
| `tipo_documento` | `string` (`POL` \| `PROC` \| `SLA` \| `FAQ` \| `WIKI`) | Não | Filtragem opcional por tipo no retrieval |

**Mecanismo de quarentena:** documentos sem `status` ou `data_vigencia` são movidos para um container Blob de quarentena (`chroma-quarentena/`) com log de rejeição. Nenhum chunk em quarentena é indexado. O responsável pela ingestão recebe alerta via Azure Monitor.

#### 5.5.2 Collections do ChromaDB

Duas collections separadas com estratégia de retrieval diferenciada:

```
collection-normativo
  Conteúdo : POL, PROC, SLA
  Prioridade: máxima — consultada primeiro em toda query
  Filtro    : where={"status": "vigente"}
  Aviso     : nenhum (fonte de verdade)

collection-informal
  Conteúdo : FAQ interno, wikis, e-mails de orientação
  Prioridade: fallback — consultada somente se collection-normativo
              não retornar chunk com score > threshold (default: 0.75)
  Aviso     : resposta sempre prefixada com "[Fonte: informal —
              confirme com documentação oficial]"
```

No LangChain, implementar via `EnsembleRetriever` ou retrieval sequencial:

```python
# Pseudocódigo LangChain
normativo_retriever = chroma_normativo.as_retriever(
    search_kwargs={"where": {"status": "vigente"}, "k": 5}
)
informal_retriever = chroma_informal.as_retriever(
    search_kwargs={"where": {"status": "vigente"}, "k": 3}
)

# Retrieval sequencial: informal ativado apenas se normativo score < threshold
docs = normativo_retriever.get_relevant_documents(query)
if max(doc.metadata["score"] for doc in docs) < 0.75:
    docs += informal_retriever.get_relevant_documents(query)
    # marcar docs informais para prefixo de aviso
```

#### 5.5.3 Estratégia de HA para ChromaDB Self-Hosted

ChromaDB não possui SLA gerenciado quando self-hosted. A estratégia abaixo substitui esse SLA e permite atingir o RNF-001 (99,5% para Gold).

**Pilar 1 — Modo Server em Container Apps (escala horizontal)**

```
Container Apps Environment
  ├── chroma-server (min: 2 réplicas, max: 5)
  │     Imagem  : chromadb/chroma:latest (Python server mode)
  │     Port    : 8000
  │     CPU/Mem : 1 vCPU / 2 GiB por réplica
  │     Escala  : baseada em número de requisições HTTP (threshold: 50 req/s)
  └── Volume montado (Azure Files — ZRS) em /chroma/data
        Redundância: Zone-Redundant Storage — sobrevive a falha de zona
```

> ChromaDB não suporta múltiplos escritores simultâneos no mesmo volume. As réplicas adicionais servem apenas leitura (retrieval). Escritas (ingestão) passam por uma réplica primária designada via variável de ambiente `CHROMA_PRIMARY=true`.

**Pilar 2 — Persistência em Volume Azure Files (ZRS)**

O volume `/chroma/data` é provisionado como Azure Files com redundância ZRS (Zone-Redundant Storage). Em caso de falha de uma zona de disponibilidade, os dados permanecem acessíveis sem intervenção manual. Recovery Time Objective (RTO) para falha de réplica: < 60 segundos (Container Apps reinicia automaticamente).

**Pilar 3 — Backup Diário para Blob Storage**

```
Pipeline de backup (Azure Function agendada — cron: "0 2 * * *" = 02h UTC)
  1. Chamar endpoint GET /api/v1/collections no chroma-server primário
  2. Para cada collection: exportar todos os embeddings + metadata via
     GET /api/v1/collections/{id}/get?include=embeddings,documents,metadatas
  3. Serializar como JSON comprimido (gzip)
  4. Upload para Blob Storage: chroma-backup/YYYY-MM-DD/{collection}.json.gz
  5. Retenção: 30 dias (política de lifecycle no Blob Storage)
  6. Emitir métrica custom no Azure Monitor: chroma_backup_success (1/0)
     → Alerta se chroma_backup_success = 0 por 2 dias consecutivos
```

Recovery Point Objective (RPO): 24 horas (perda máxima de dados em caso de falha catastrófica do volume).

**Pilar 4 — Health Check e Alertas**

```
Azure Monitor — alertas configurados:
  - chroma_backup_success = 0  → severidade 2 (aviso) por 2 dias
  - HTTP 5xx em /api/v1/heartbeat > 1% por 5 min → severidade 1 (crítico)
  - Réplicas disponíveis < 1 → severidade 1 (crítico) — aciona on-call
  - Latência P95 > 200ms no retrieval → severidade 3 (informativo)
```

**Resumo de SLA estimado com essa estratégia:**

| Cenário | RTO | RPO | Impacto |
|---|---|---|---|
| Falha de réplica única | < 60s | 0 (sem perda de dados) | Transparente — Container Apps reinicia |
| Falha de zona (ZRS) | < 5 min | 0 | Volume permanece disponível |
| Corrupção de volume | < 2h | 24h | Restaurar backup mais recente |
| Falha catastrófica (region) | Não coberto | 24h | Requer estratégia multi-region (fora do escopo atual) |

### 5.4. ~~Escolha não resolvida: Semantic Kernel vs LangChain~~ — RESOLVIDO

**Decisão:** **LangChain (Python)** é adotado como orquestrador RAG.

**Justificativa:**
- Stack 100% Python alinha com o pipeline de ingestão (openpyxl/pandas para Excel, Document Intelligence SDK, ChromaDB client)
- LangChain possui integração nativa com ChromaDB via `langchain-chroma`
- Comunidade e documentação RAG maior, com padrões estabelecidos para retrieval multi-collection
- Eliminação de dependência de camada Microsoft proprietária (Azure AI Search) reduz custo operacional e lock-in

---

## 6. Mitigação dos Riscos do Estudo de Viabilidade

| Risco | Severidade | Coberto pela arquitetura atual? | Ação necessária |
|-------|-----------|--------------------------------|----------------|
| RISCO 1 — Documentos conflitantes | CRÍTICA | ✅ Coberto | Schema de metadata obrigatório com campo `status` + filtro `where={"status": "vigente"}` + mecanismo de quarentena (seção 5.5.1) |
| RISCO 2 — FAQ informal misturado | ALTA | ✅ Coberto | `collection-normativo` e `collection-informal` com retrieval sequencial e aviso explícito para fontes informais (seção 5.5.2) |
| RISCO 3 — Sem processo de atualização | ALTA | ⚠️ Parcial | Pipeline Python de re-ingestão incremental com validação de metadata e upsert no ChromaDB — processo operacional a definir no Sprint 0 |
| RISCO 4 — Alucinação em dados financeiros | ALTA | ⚠️ Parcial (temperatura 0 + prompt) | Adicionar motor de cálculo determinístico (seção 5.1) |
| RISCO 5 — Prazo com dependências externas | ALTA | ⚠️ Organizacional | Sprint 0 como pré-condição contratual |
| RISCO 6 — Extração de dados tabulares | MÉDIA | ✅ Coberto | openpyxl/pandas nativos em Python; validação manual das tabelas críticas antes da ingestão |

---

## 7. Decisão

A arquitetura RAG sobre Azure é **aprovada como base**, com as seguintes condições obrigatórias antes do início do desenvolvimento:

### Condições obrigatórias (bloqueantes para Sprint 1)

1. ~~**Definir a escolha de orquestrador**~~ — **RESOLVIDO:** LangChain (Python) adotado (seção 5.4).
2. **Projetar o motor de cálculo determinístico** (Azure Function Python) para RF-004 e RF-007.
3. ~~**Criar duas collections separadas no ChromaDB**~~ — **RESOLVIDO:** `collection-normativo` e `collection-informal` com retrieval sequencial via `EnsembleRetriever` (seção 5.5.2).
4. ~~**Especificar o schema de metadata obrigatório**~~ — **RESOLVIDO:** campos `status`, `versao`, `data_vigencia`, `responsavel`, `fonte` e mecanismo de quarentena definidos (seção 5.5.1).
5. **Delimitar o escopo do assistente** — deixar explícito que SLA tracking, registro de chamados, RBAC de aprovação e relatórios de performance pertencem a sistemas complementares (Azure DevOps, Portal do Cliente, BI).
6. ~~**Definir estratégia de HA para ChromaDB**~~ — **RESOLVIDO:** 4 pilares definidos — Container Apps (min 2 réplicas ZRS), volume Azure Files ZRS, backup diário para Blob Storage e alertas no Azure Monitor (seção 5.5.3).

### Condições recomendadas (a resolver no Sprint 0)

6. Definir estratégia de fallback para disponibilidade (RNF-001) — circuit breaker ou resposta degradada quando Azure OpenAI estiver indisponível.
7. Realizar load test para validar latência de 3s (RNF-002) com o volume de chunks e modelo GPT-4o escolhido.
8. Projetar o card adaptativo no Teams para exibir tier, SLA e fonte citada (RNF-009).

---

## 8. Arquitetura Alvo (revisada)

```
Atendente (Teams — Adaptive Card com tier + SLA + fonte)
      │
      ▼
Azure Bot Service (Azure AD — identidade do atendente)
      │
      ▼
Orquestrador RAG — LangChain (Python)
      │
      ├──▶ Azure OpenAI GPT-4o (temperatura 0, prompt restritivo)
      │          │
      │    [Extração de parâmetros]
      │          │
      │          ▼
      │    Azure Function (Python) — Motor de Cálculo
      │    (frete especial, descontos de volume)
      │
      ├──▶ ChromaDB — collection-normativo
      │    (POL, PROC, SLA | where: {status: vigente})
      │
      ├──▶ ChromaDB — collection-informal
      │    (FAQ | aviso explícito ao atendente)
      │
      └──▶ Blob Storage (planilhas Excel via openpyxl/pandas)

ChromaDB hospedado em Container Apps (Python server mode):
  Persistência: volume montado + backup diário para Blob Storage

Pipeline de ingestão (Python — Azure Function App agendado diariamente):
  SharePoint → Document Intelligence SDK → Validação metadata → Quarentena ou ChromaDB upsert
  Confluence → API connector → Chunking → ChromaDB upsert
  Excel → openpyxl/pandas → Chunking estruturado → ChromaDB upsert

Observabilidade:
  Azure Monitor + Application Insights + LangChain Callbacks (logs de chunks e respostas)
```

---

## 9. Consequências

- **Aprovado:** A arquitetura base (RAG sobre Azure + ChromaDB + LangChain Python) é adequada ao problema.
- **Stack definido:** Python end-to-end — LangChain como orquestrador, ChromaDB como vector store, openpyxl/pandas para ingestão de planilhas. Decisão encerra a ambiguidade Semantic Kernel vs LangChain.
- **Custo:** Eliminação do Azure AI Search S1 (~USD 250/mês) substituído por ChromaDB self-hosted em Container Apps (custo de compute).
- **Risco novo mitigado:** ChromaDB self-hosted não tem SLA gerenciado — coberto pela estratégia de HA de 4 pilares: Container Apps com mínimo 2 réplicas, volume Azure Files ZRS, backup diário para Blob Storage e alertas no Azure Monitor (seção 5.5.3). RTO < 60s para falha de réplica; RPO de 24h para falha catastrófica.
- **Governança de dados definida:** Schema de metadata obrigatório (`status`, `versao`, `data_vigencia`, `responsavel`, `fonte`) com mecanismo de quarentena e filtro `where={"status": "vigente"}` em todas as queries (seção 5.5.1).
- **Segregação de corpus definida:** `collection-normativo` (POL, PROC, SLA) com prioridade máxima; `collection-informal` (FAQ, wikis) como fallback com aviso explícito ao atendente (seção 5.5.2).
- **Risco principal mantido:** Qualidade da documentação de entrada. A melhor arquitetura não compensa base de conhecimento conflitante.
- **Escopo clarificado:** O assistente é uma ferramenta de **consulta e orientação**, não um sistema transacional. Ações (calcular, registrar, aprovar) requerem componentes adicionais ou integração com sistemas existentes.
- **Pendente para Sprint 0:** (1) Motor de cálculo determinístico para RF-004/RF-007; (2) Delimitação formal do escopo com stakeholders; (3) Processo operacional de re-ingestão incremental (RISCO 3).
