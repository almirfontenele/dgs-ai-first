# Exercício 1.3 — Revisão Crítica de Proposta de RAG

**Autor:** Tech Lead (Almir Oliveira)  
**Data:** 2026-05-29  
**Contexto:** Pipeline RAG para assistente de atendimento NovaTech — revisão de proposta de desenvolvedor júnior

---

## Proposta Original sob Revisão

> "Vamos usar Azure AI Search com embeddings do ada-002. Todos os documentos serão indexados num único índice. Chunking fixo de 512 tokens sem overlap. O LLM recebe os 3 chunks mais similares. Usaremos GPT-4o para geração. O pipeline de ingestão roda manualmente quando alguém lembra de atualizar."

---

## Parte 1 — Revisão Técnica do Tech Lead

### Problema 1: Chunking fixo sem overlap fragmenta contexto nas fronteiras

**Risco:** Chunking de 512 tokens sem overlap quebra sentenças e tabelas nas bordas. Uma pergunta sobre "prazo de devolução para carga refrigerada" pode retornar um chunk que começa na metade da regra — o LLM recebe contexto incompleto e responde de forma truncada ou errada.

**Evidência no corpus NovaTech:** POL-001 §3.2 lista exceções em bullet points; SLA-2024 tem uma tabela com linhas que se estende por múltiplos chunks. Se a linha do Tier Platinum for cortada no meio, o assistente pode omitir o SLA correto.

**Alternativa:** Overlap de 15% (~75 tokens). Para documentos estruturados com tabelas, usar chunking semântico por seção (heading-aware splitting) antes do tamanho fixo.

---

### Problema 2: Índice único mistura documentos de versões contraditórias

**Risco:** PROC-042-v1 e PROC-042-v2 coexistem com fórmulas de cálculo de frete incompatíveis (multiplicador 1.3 vs 1.35 na v2, regras de urgência divergentes). Com índice único e sem filtros, o retrieval pode trazer chunks das duas versões simultaneamente. O LLM sintetiza uma resposta mesclada que não é verdadeira em nenhuma das versões.

**Evidência:** Já documentado como risco crítico no ADR-0003 — tratamento de documentos contraditórios no pipeline RAG.

**Alternativa:** Metadados obrigatórios por chunk: `doc_id`, `versao`, `status` (`vigente` | `obsoleto` | `em_revisao`), `data_vigencia`. Filtros no retrieval: `filter="status eq 'vigente'"`. Documentos com status ambíguo entram com flag `requer_confirmacao=true` e o prompt instrui o LLM a sinalizar a ambiguidade (conforme estratégia definida em `estrategia-prompt-engineering.md`).

---

### Problema 3: Top-k=3 fixo é insuficiente para perguntas complexas

**Risco:** Uma pergunta como "Quais são as condições para devolução de uma carga Platinum com frete especial e prazo expirado?" cruza POL-001, SLA-2024 e PROC-042. Com 3 chunks, a recuperação provavelmente cobre apenas 1-2 documentos, e o LLM responde com base em contexto parcial — ou pior, inventa as partes que faltam.

**Alternativa:** Top-k dinâmico (3 a 7) baseado no score de similaridade: continuar recuperando enquanto `score > threshold_minimo` e `k <= 7`. Para perguntas classificadas como simples (FAQ, prazo único), k=3 é suficiente. Para perguntas que referenciam múltiplas entidades, k=5-7. O Azure AI Search suporta isso com score threshold nativo.

---

### Problema 4: Ingestão manual é risco operacional crítico

**Risco:** "Quando alguém lembra de atualizar" significa que o assistente pode operar com dados desatualizados por dias ou semanas sem qualquer alerta. Não há log de quando foi feita a última ingestão, não há detecção de documentos modificados, não há notificação ao time. O LLM responde com confiança sobre dados obsoletos.

**Cenário concreto:** PROC-042 foi revisado (v1 → v2). Se a ingestão não rodar, o assistente continua calculando frete com a fórmula errada — impacto financeiro direto.

**Alternativa:** Pipeline automatizado com:
- **Trigger por evento:** webhook no sistema de gestão documental quando um arquivo é atualizado
- **Fallback agendado:** varredura diária por diff de hash (MD5/SHA256) nos documentos fonte
- **Log de ingestão:** timestamp, doc_id, versão, status da ingestão (sucesso/falha)
- **Alerta:** notificação ao time se a última ingestão bem-sucedida tiver mais de 48h

---

### Problema 5: Busca puramente semântica falha em queries exatas

**Risco:** ada-002 é excelente para similaridade semântica mas performa mal em buscas por identificadores exatos: número de CT-e, ramal de contato (ex: "ramal 4500 Gestão de Riscos"), código de procedimento ("PROC-088"), valores numéricos de SLA. Um atendente perguntando "qual o SLA para cliente Tier Bronze em carga fracionada?" precisa de match exato nos termos, não semântico.

**Alternativa:** Hybrid search (vetor + BM25 keyword), que o Azure AI Search suporta nativamente com o parâmetro `queryType=semantic` combinado com full-text. Peso configurável: 0.7 semântico / 0.3 keyword como ponto de partida, ajustável por avaliação offline.

---

### Problema 6: Nenhum reranker entre retrieval e geração

**Risco:** Similaridade cosine de embedding mede proximidade no espaço vetorial, não relevância para geração de resposta. Os 3 chunks com maior score podem incluir chunks irrelevantes que "poluem" o contexto do LLM, degradando a qualidade da resposta.

**Alternativa:** Reranker cross-encoder após o retrieval inicial. O Azure AI Search oferece o **Semantic Ranker** (baseado em modelos de linguagem) que reordena resultados por relevância para a query. Recuperar top-10 com embedding, reranquear, enviar top-3 ao LLM.

---

### Problema 7: GPT-4o para todas as queries — custo desproporcional

**Risco:** FAQ simples ("qual o prazo de devolução?") não justifica GPT-4o. Em produção, o volume de queries simples tende a ser 60-70% do total. Usar GPT-4o em tudo eleva custo 5-10x desnecessariamente.

**Alternativa:** Roteamento por complexidade:
- **GPT-4o-mini:** queries classificadas como simples (FAQ, prazo único, definição)
- **GPT-4o:** queries complexas (múltiplas regras, contradições detectadas, cálculos)
- Classificador leve (prompt zero-shot ou modelo de embedding) decide o tier antes do retrieval

---

## Parte 2 — Revisão do Claude

**Prompt enviado ao Claude:**

> "Você é um arquiteto de sistemas especializado em RAG. Revise esta proposta de arquitetura e identifique problemas técnicos:
> 
> 'Vamos usar Azure AI Search com embeddings do ada-002. Todos os documentos serão indexados num único índice. Chunking fixo de 512 tokens sem overlap. O LLM recebe os 3 chunks mais similares. Usaremos GPT-4o para geração. O pipeline de ingestão roda manualmente quando alguém lembra de atualizar.'
> 
> Liste ao menos 4 problemas com justificativa técnica e proponha alternativas."

**Resposta do Claude (resumida):**

O Claude identificou os seguintes problemas:

1. **Chunking sem overlap perde contexto nas fronteiras** — recomendou overlap de 10-20%, mesma conclusão que a revisão manual. Mencionou especificamente o risco para documentos legais e normativos.

2. **Top-k=3 pode ser insuficiente** — apontou o risco para perguntas multi-documento. Sugeriu k adaptativo ou janela de contexto maior.

3. **Ingestão manual é risco de qualidade de dados** — destacou o risco de staleness, ausência de versionamento e falta de rastreabilidade. Sugeriu CI/CD para ingestão.

4. **Índice único sem segmentação por tipo de documento** — apontou dificuldade de aplicar filtros ou pesos diferentes por tipo de documento. Sugeriu múltiplos índices ou campos de metadados.

5. **Dependência exclusiva de similaridade semântica** — recomendou hybrid search (BM25 + semântico).

6. **Ausência de avaliação offline do pipeline** — recomendou criar golden dataset para medir precisão do retrieval antes de ir para produção. **(problema não levantado na revisão manual)**

7. **Sem estratégia de fallback para low-confidence** — quando o score de todos os chunks é baixo, o LLM deveria responder "não sei" em vez de inventar. O Claude explicitou este risco. **(problema não levantado na revisão manual)**

---

## Parte 3 — Comparação: Tech Lead vs Claude

### Problemas identificados por ambos
| Problema | Tech Lead | Claude |
|---|---|---|
| Chunking sem overlap | ✅ | ✅ |
| Top-k=3 insuficiente | ✅ | ✅ |
| Ingestão manual | ✅ | ✅ |
| Índice único sem metadados | ✅ | ✅ |
| Busca semântica pura (sem BM25) | ✅ | ✅ |

### Problemas identificados só pelo Tech Lead
| Problema | Observação |
|---|---|
| Documentos contraditórios (PROC-042 v1/v2) | Requer conhecimento do domínio NovaTech — o Claude não tinha esse contexto sem os documentos fonte |
| Ausência de reranker | O Claude não levantou explicitamente; mencionou apenas k adaptativo |
| Custo desproporcionado GPT-4o | O Claude não mencionou otimização de custo |

### Problemas identificados só pelo Claude
| Problema | Observação |
|---|---|
| Ausência de avaliação offline (golden dataset) | Ponto válido e importante para produção — o Tech Lead focou nos riscos de runtime mas não no processo de validação pré-deploy |
| Sem fallback para low-confidence | Importante para evitar alucinação quando nenhum chunk é relevante — o Tech Lead assumiu que isso seria coberto pelo guardrail no prompt, mas não explicitou como requisito arquitetural |

### Análise da comparação

**Onde o Tech Lead foi mais forte:** Conhecimento de domínio específico (PROC-042 contraditório), otimização de custo, e reranking. O contexto dos documentos NovaTech permite identificar riscos que não são visíveis na proposta abstrata.

**Onde o Claude foi mais forte:** Processo de engenharia (avaliação offline, golden dataset) e tratamento de casos de borda em produção (low-confidence fallback). O Claude mantém um checklist mental de boas práticas de MLOps que é menos sujeito a viés de contexto.

**Conclusão:** A revisão combinada é mais completa que qualquer uma isolada. O Tech Lead traz o contexto do negócio; o Claude traz a checklist sistemática. Nenhum substitui o outro.

---

## Parte 4 — Proposta Reescrita

### Proposta RAG NovaTech — Versão Revisada v1.1

**Stack:** Azure AI Search + Azure OpenAI (ada-002 para embeddings, GPT-4o e GPT-4o-mini para geração)

#### Indexação e Metadados

Cada documento é indexado com os campos obrigatórios:
- `doc_id` — identificador único do documento fonte
- `versao` — versão do documento (ex: "3.1", "v2")
- `status` — `vigente` | `obsoleto` | `em_revisao`
- `tipo` — `politica` | `procedimento` | `sla` | `faq`
- `data_vigencia` — data a partir da qual o documento é vigente
- `requer_confirmacao` — `true` para documentos com status ambíguo

Documentos com status ambíguo (como PROC-042-v1 que coexiste com v2) são marcados com `status=em_revisao` e `requer_confirmacao=true` até resolução formal.

#### Chunking

- **Tamanho:** 512 tokens
- **Overlap:** 75 tokens (~15%) para preservar contexto nas fronteiras
- **Heading-aware:** seções com título H2/H3 não são quebradas no meio; a quebra respeita parágrafos
- **Tabelas:** linhas de tabela não são separadas entre chunks distintos

#### Retrieval

- **Estratégia:** Hybrid search — embedding (ada-002) + BM25 full-text, peso 0.7/0.3
- **Filtro obrigatório:** `status eq 'vigente' OR (status eq 'em_revisao' AND requer_confirmacao eq true)`
- **Top-k inicial:** 10 candidatos
- **Reranker:** Azure Semantic Ranker reordena os 10 candidatos; os top-5 são enviados ao LLM
- **Threshold mínimo:** chunks com score < 0.65 após reranking são descartados; se nenhum chunk passa do threshold, o LLM responde com mensagem de fallback definida

#### Geração

- **Classificador de complexidade:** antes do retrieval, uma chamada leve (GPT-4o-mini, prompt zero-shot) classifica a query como `simples` ou `complexa`
  - `simples`: resposta baseada em fato único, prazo, definição → GPT-4o-mini para geração
  - `complexa`: múltiplas regras, cálculo, contradição detectada → GPT-4o para geração
- **System prompt:** versão 1.0 definida em `estrategia-prompt-engineering.md`, com hierarquia de confiança de fontes e obrigatoriedade de citação
- **Guardrail determinístico:** harness de pós-processamento verifica presença de citação antes de retornar a resposta

#### Pipeline de Ingestão

- **Trigger primário:** webhook disparado pelo sistema de gestão documental quando um arquivo é criado ou modificado
- **Fallback agendado:** varredura diária às 02h00 com comparação de hash SHA-256 nos documentos fonte; re-ingere apenas documentos modificados
- **Log de ingestão:** timestamp, doc_id, versão, hash, status (`sucesso` | `falha`), número de chunks gerados
- **Alerta operacional:** notificação automática se a última ingestão bem-sucedida tiver mais de 48h sem nova execução
- **Versionamento:** cada ingestão cria uma nova versão do índice; rollback disponível para a versão anterior

#### Avaliação Offline (pré-deploy)

- **Golden dataset:** 30 pares (pergunta, resposta esperada + chunk fonte) cobrindo os casos críticos do corpus NovaTech
- **Métricas mínimas para deploy:** Recall@5 ≥ 0.85, precisão de citação ≥ 0.90
- **Execução:** a cada PR que altere chunking, embedding ou parâmetros de retrieval

#### Resumo das Mudanças em Relação à Proposta Original

| Dimensão | Proposta Original | Proposta Revisada |
|---|---|---|
| Chunking | 512t fixo, sem overlap | 512t + 75t overlap, heading-aware |
| Índice | Único, sem metadados | Metadados de versão/status/tipo |
| Retrieval | Top-3 semântico | Hybrid + reranker, top-5 filtrado |
| Fallback | Nenhum | Threshold + mensagem padrão |
| Geração | GPT-4o fixo | Roteamento GPT-4o-mini / GPT-4o |
| Ingestão | Manual | Automática (webhook + agendada) |
| Avaliação | Nenhuma | Golden dataset pré-deploy |

---

*Referências: ADR-0001 (seleção LLM), ADR-0003 (documentos contraditórios), ADR-0004 (build vs buy), `estrategia-prompt-engineering.md` (system prompt e guardrails)*
