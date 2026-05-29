# ADR-0002: Estratégia de Gerenciamento de Contexto no Pipeline RAG

## Status: Aceito

## Contexto

O pipeline de RAG da NovaTech precisa montar o contexto que o LLM recebe em cada chamada. Essa decisão é crítica porque **o contexto é o único fato que o LLM pode citar** — se o chunk certo não entrou, a resposta será incompleta ou inventada. O orçamento de atenção do modelo não é ilimitado: mais contexto não é automaticamente melhor.

**Forças que atuam:**

- **Volume por sessão no Teams**: O bot no Teams permite múltiplas perguntas na mesma conversa. Sem política explícita, o histórico cresce indefinidamente e corrói o orçamento disponível para chunks relevantes — fenômeno conhecido como *context rot*.
- **Perguntas multi-domínio**: Um atendente pode perguntar "Qual o prazo de devolução para cliente Gold com carga acima de 500kg?" — isso cruza POL-001 (devolução), SLA-2024 (tier Gold) e PROC-042 (frete especial). O retriever precisa trazer chunks de 3 domínios diferentes.
- **Documentos contraditórios**: PROC-042 v1 e v2 podem ser recuperadas simultaneamente. O contexto precisa incluir ambas para que o LLM aplique a lógica de vigência (ADR-0003).
- **Requisito de citação de fonte**: Cada chunk recuperado precisa carregar metadados (nome do documento, versão, seção) que o LLM reproduz na resposta. Metadados adicionam tokens ao contexto.
- **Análise técnica do desenvolvedor**: Chunking por seção com overlap de 10%. Chunks estimados em ~400–600 tokens de conteúdo + ~100 tokens de metadados = ~500–700 tokens por chunk efetivo.

**Orçamento de atenção disponível (GPT-4o, 128k janela):**

| Componente | Tokens reservados |
|---|---|
| Prompt de sistema (instruções, regras, persona) | 1.500 |
| Histórico de conversa (política) | 2.000 |
| Chunks recuperados | 6.000 |
| Pergunta atual do usuário | 500 |
| Margem de saída (resposta) | 1.500 |
| **Total** | **~11.500** |

A janela de 128k é tecnicamente usável, mas concentrar mais de 20k tokens em contexto aumenta latência de resposta (custo de atenção é quadrático) e dilui a relevância dos chunks mais importantes. O orçamento acima é deliberadamente conservador para manter latência < 5s.

## Decisão

**Adotar política de contexto com quatro regras explícitas:**

### Regra 1 — Tamanho máximo de contexto por query: 6.000 tokens para chunks

O retriever recupera no máximo **8 chunks** por query, cada chunk com até ~750 tokens (conteúdo + metadados). Se a query for identificada como multi-domínio (ver Regra 3), o limite sobe para **10 chunks** (7.500 tokens), e o histórico de conversa é reduzido para 1.000 tokens para compensar.

**Justificativa**: Benchmarks de RAG mostram retorno decrescente além de 8–10 chunks para queries de domínio único. Chunks além do 8º tendem a ter score de similaridade baixo e adicionam ruído, não sinal.

### Regra 2 — Política de context rot: janela deslizante de 2 turnos

O histórico de conversa mantém apenas os **2 últimos pares pergunta/resposta** (usuário + assistente), com cap de 2.000 tokens totais. Se o histórico exceder esse limite, truncar pelo início (manter os turnos mais recentes).

**Justificativa**: No contexto de atendimento, cada pergunta tende a ser independente ou relacionada à anterior imediata. Histórico longo raramente é necessário e consome orçamento que deveria ir para chunks. A instrução "se precisar de contexto de conversa anterior, peça ao usuário para reformular" é explicitada no prompt de sistema.

**Exceção documentada**: Sessões marcadas como "incidente em andamento" (aberto pelo sistema de chamados) mantêm histórico de 5 turnos — o atendente pode estar investigando o mesmo problema ao longo da sessão.

### Regra 3 — Detecção e tratamento de queries multi-domínio

O pipeline executa detecção de domínio **antes** do retrieval, classificando a query em: `[devolucao, frete, sla, seguro, geral]`. Se 2 ou mais domínios são detectados:

1. O retriever executa **buscas paralelas** por domínio (não uma única query vetorial).
2. Os resultados são mergeados com deduplicação por chunk_id.
3. O limite de chunks sobe para 10 (ver Regra 1).
4. O prompt de sistema inclui instrução explícita: *"Esta resposta cruza múltiplos domínios. Cite separadamente a fonte de cada afirmação."*

**Justificativa**: Uma única query vetorial para "prazo de devolução + SLA Gold + frete especial" tende a recuperar chunks do domínio mais representado semanticamente, ignorando os outros. Buscas paralelas por domínio garantem cobertura.

### Regra 4 — Composição do prompt de sistema: fixo + dinâmico

O prompt de sistema tem duas partes:

- **Parte fixa** (~800 tokens): instruções permanentes (não alucinar, citar fonte, mostrar versões conflitantes, encaminhar ao Gestão de Riscos quando aplicável).
- **Parte dinâmica** (~700 tokens): injetada por query, inclui data da consulta (para resolução de vigência de documentos) e flag de domínios detectados.

## Consequências

**Positivas:**
- Latência controlada: orçamento de contexto fixo → tempo de inferência previsível.
- Qualidade de resposta: chunks são o que o modelo usa; limitar ruído melhora precisão.
- Auditabilidade: toda chamada ao LLM tem contexto explícito e rastreável nos logs.

**Negativas:**
- **Truncamento de histórico pode frustrar usuários**: Se o atendente fizer 5 perguntas encadeadas e a 5ª referenciar a 1ª, o bot não terá memória. Mitigação: instrução no prompt orienta o bot a solicitar reformulação.
- **Detecção de domínio é um classificador adicional**: Erro no classificador resulta em retrieval incompleto para multi-domínio. Precisão do classificador precisa ser monitorada. Fallback: se incerto, tratar como multi-domínio e executar todas as buscas paralelas.
- **Custo 25% maior para queries multi-domínio**: 10 chunks vs 8 = +25% de tokens de entrada. Aceitável dado o volume, mas precisa ser monitorado se volume escalar.

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **Contexto completo da sessão (sem truncamento)** | Context rot real: sessões longas degradam qualidade progressivamente. Custo cresce linearmente com histórico. |
| **Retrieval único sem detecção de domínio** | Para queries multi-domínio, o chunk mais relevante semanticamente domina o resultado, ignorando domínios secundários. Testado internamente: query "SLA para devolução de Gold" recuperava apenas chunks de SLA, ignorando POL-001. |
| **Compressão de histórico via LLM** | Sumariazar histórico com outra chamada LLM adiciona latência e custo. A política de janela deslizante resolve 90% dos casos com zero custo adicional. |
| **Retrieval sem limite de chunks (top-K livre)** | Sem cap, retriever pode retornar 20–30 chunks para queries amplas. Dilui a atenção do modelo e aumenta latência sem ganho de qualidade comprovado. |
