# Resultado de Avaliação — Desenvolvedor (Cenário 1)

> **Programa:** Trilha de Certificação AI First — DGS / DB1 Global Software
> **Aluno:** Almir Oliveira
> **Data da avaliação:** 2026-06-01
> **Avaliador:** Claude Sonnet 4.6

---

## Resumo Executivo

Entrega de alto nível técnico. O aluno demonstra domínio real dos fundamentos de LLM e engenharia de contexto, não apenas reprodução de conceitos. O exercício 1.2 é o ponto mais forte — a detecção e correção da armadilha obrigatória (carga perigosa) foi exemplar, com análise de causa raiz e changelog documentado. O exercício 1.3 entrega um pipeline funcional com código real, testes com gabarito e problemas derivados de evidência observada, não inventados.

**Pontos de atenção:** estimativa de tokens do exercício 1.1 ficou abaixo da faixa de referência (3,1M vs 8-15M esperados), sem justificativa explícita para a divergência; e a evidência de uso do Copilot no exercício 1.3 se limita a um único trecho de código.

---

## Exercício 1.1 — Análise de Viabilidade Técnica

### Critério 1: Desafios por tipo de fonte — **3/3**

Cobertura completa com profundidade técnica genuína:

- **PDFs com tabelas:** identificou corretamente o problema de linearização bidimensional, propôs estratégias específicas (Camelot, pdfplumber com `lattice`), e levantou o problema de coexistência de versões — o risco de negócio mais crítico do cenário.
- **PDFs escaneados:** abordou qualidade de OCR com threshold quantificado (≥85%), pós-processamento com dicionário de domínio, e metadado de confiança para exclusão de chunks.
- **Wiki Confluence:** tratou dependências de links internos, macros não interpretadas, e propôs grafo de dependências — não apenas "exportar como texto".
- **Planilhas:** distinguiu dados estáticos de dinâmicos, propôs integração via API para dados operacionais, e abordou invalidação por timestamp.

Nenhuma resposta genérica. Cada fonte tem seu desafio específico e estratégia fundamentada.

### Critério 2: Estimativa de tokens razoável — **2/3**

O cálculo mostra o trabalho com metodologia clara (palavras por fonte → conversão 0,75 palavras/token). O resultado (~3,1M tokens) está, porém, fora da faixa de referência de 8-15M sem justificativa para a divergência.

Possível causa: a estimativa de palavras por página dos PDFs (210 palavras/página, considerando 40% de espaço com tabelas/imagens) e de palavras por página do Confluence (1.500) são conservadoras. Com estimativas medianas (300 palavras/página nos PDFs e 2.000 por página de wiki), o total subiria para ~5-6M — ainda abaixo da faixa. A estimativa está fundamentada mas provavelmente subestima o volume real.

**Ponto positivo:** incluiu análise de custo de indexação ($0,31 inicial) e justificou que não é necessário sharding. Isso demonstra raciocínio prático.

### Critério 3: Orçamento de contexto — **2/3**

O aluno calculou corretamente o espaço disponível (128K - 2K system ≈ 126K úteis) e chegou ao máximo teórico de 247 chunks. A análise de Lost in the Middle está presente e bem articulada, com proposta de re-ranking.

**Lacuna:** o critério exige justificativa do número de chunks por query usado na prática (5-10 é prático). O entregável calculou o limite máximo mas não recomendou um número operacional — falta a ponte entre "cabem até 247" e "vou usar N para cada categoria de pergunta".

### Critério 4: Chunking justificado — **3/3**

Estratégia híbrida com 4 categorias, cada uma com tamanho de chunk, unidade semântica, justificativa e riscos documentados:

- Lookup simples: 150-250 tokens, linha de tabela por chunk.
- Procedimento: 300-500 tokens, seção completa.
- Análise comparativa: 200-350 tokens, versionamento isolado.
- Contexto agregado: 600-1.000 tokens, menos chunks de maior qualidade.

Cada decisão cruza tipo de pergunta com efeito Lost in the Middle e formato dos documentos. Exatamente o raciocínio esperado.

### Critério 5: Iteração com Claude — **3/3**

Três feedbacks recebidos, três mudanças aplicadas com impacto descrito:

1. Estimativa de planilhas corrigida de 100 para 200 células (mais conservador).
2. Análise de custo de indexação adicionada.
3. Risco de documentos conflitantes promovido para posição 1 na tabela de riscos.

Cada mudança justifica o motivo ("o problema de versionamento é o que mais provavelmente causaria danos concretos") — não é apenas aplicação mecânica de feedback.

### Pontuação 1.1: **13/15**

---

## Exercício 1.2 — Prototipação de Prompt com Engenharia de Contexto

### Critério 1: System prompt específico — **3/3**

O v1 tem identidade clara ("Assistente de Suporte da NovaTech, especializado em suporte logístico"), guardrails numerados (citação de fontes obrigatória, proibições absolutas, escalação, tom), instruções específicas para uso de chunks com formato esperado, e seção de casos especiais. Não é um prompt genérico.

### Critério 2: Mapeamento estático/dinâmico — **3/3**

Tabelas detalhadas com:
- Contexto estático: 4 componentes com tokens estimados, frequência e frequência de mudança. Total: ~720 tokens.
- Contexto dinâmico: 4 componentes com tamanho variável e impacto no orçamento. Total típico: ~1.350 tokens.
- Análise para dois modelos (Claude 200K e GPT-4o 128K) com espaço restante calculado.
- Estratégia de truncamento com prioridade explícita (o que cortar primeiro).

### Critério 3: 3 perguntas testadas — **3/3**

Três perguntas testadas em v1 e v2 com outputs reais documentados (não inventados), incluindo o setup completo do teste (modelo, data, método, conversa isolada). Os chunks fornecidos estão explicitados, permitindo reprodução.

### Critério 4: Iteração v1 → v2 — **3/3**

**Armadilha obrigatória tratada corretamente.** A resposta v1 à pergunta de carga perigosa deu o prazo de 7 dias sem mencionar que a carga perigosa não pode ser devolvida — erro classificado como 3/10 com análise de causa raiz ("instrução de exceção está no final do prompt, em seção de casos especiais, com baixa ativação").

O aluno identificou o erro, diagnosticou a causa (posicionamento e saliência) e corrigiu com a mudança mais eficaz possível: promoveu a regra para Guardrail 2.3 com linguagem imperativa, exemplo negativo explícito ("Resposta ERRADA"), e autocheck antes de enviar. Resultado: 3/10 → 10/10.

O changelog é preciso: 4 mudanças documentadas com "antes / depois / razão / teste relacionado".

**Lição articulada:** "A posição e saliência de uma instrução determinam se o LLM a aplica" — demonstra entendimento real de como LLMs processam contexto, não só execução mecânica.

### Pontuação 1.2: **12/12**

---

## Exercício 1.3 — Pipeline RAG

### Critério 1: Pipeline funcional — **3/3**

Três scripts entregues (`ingestao.py`, `busca.py`, `montagem_prompt.py`) com saída de execução real:

```
FAQ-atendimento.md: 11 chunks
POL-001-politica-devolucao.md: 9 chunks
PROC-042-frete-especial-v1.md: 5 chunks
PROC-042-v2-frete-especial-revisado.md: 6 chunks
SLA-2024-tabela-sla-clientes.md: 7 chunks
Total: 38 chunks | ChromaDB populado: 38
```

A saída é verificável e coerente com os documentos. O pipeline cobre ingestão → embeddings → armazenamento → busca por similaridade → montagem de prompt.

**Sobre a stack:** ChromaDB + sentence-transformers sem LangChain. O aluno implementou cada etapa sem abstração opaca — demonstra entendimento do que está acontecendo em cada camada.

### Critério 2: Chunking justificado — **3/3**

Estratégia híbrida documentada: 500 tokens máximo para texto corrido, 50 tokens de overlap, **proteção explícita de tabelas** como chunk único (detecção por regex `r"^\s*\|"`). A justificativa está no código como comentário de design e na seção de decisões:

> "Tabelas Markdown críticas não podem ser cortadas ao meio sob risco de resposta incorreta."

### Critério 3: 5 testes com gabarito — **3/3**

5 testes com gabarito explícito ("chunks esperados"), chunks recuperados com scores reais, e avaliação critério a critério. Resultado: 4/5 recuperações corretas (P4 não tem chunk correto por ausência documental — reconhecido e justificado) e 5/5 respostas corretas.

Todos os 5 guardrails testados e verificados em cada pergunta. A tabela de consolidação é clara e honesta (P4 marcado como ❌ na recuperação mesmo que o comportamento seja correto).

### Critério 4: 2+ problemas reais — **3/3**

3 problemas identificados, todos derivados de observação nos testes:

1. **Chunks contraditórios sem hierarquia** (Teste 3 — PROC-042 v1 vs v2 com scores 0.889 e 0.881): propõe enrichment de metadados com `versao`, `substitui`, `vigente_a_partir` e promoção automática no retrieval.
2. **Lacunas documentais não detectadas** (Teste 4 — despacho internacional): propõe módulo de detecção por score médio abaixo de 0.45 com fila de revisão semanal.
3. **FAQ informal competindo com normativas** (Testes 1, 2, 3, 5 — FAQ no top-4 consistentemente): propõe metadado `confiabilidade: normativo|informal|faq` e reordenação dos chunks no prompt.

Todos os problemas têm causa raiz, proposta de correção e prioridade. Nenhum é inventado.

### Critério 5: Copilot evidenciado — **2/3**

Evidência presente mas limitada. O aluno cita o Copilot em um único ponto: a função `detectar_blocos()` ("Copilot sugeriu esta abordagem de regex... confirmada como correta para o padrão dos documentos NovaTech"). A síntese final confirma: "A função `detectar_blocos()` foi sugerida pelo Copilot".

Para Score 3, seria esperado evidência em múltiplos pontos do exercício (pelo menos em outro script ou outra função), com o prompt enviado ao Copilot ou a completion capturada.

### Pontuação 1.3: **14/15**

---

## Pontuação Final

| Exercício | Critério | Pontuação |
|-----------|----------|-----------|
| **1.1** | Desafios por tipo de fonte | 3/3 |
| | Estimativa de tokens | 2/3 |
| | Orçamento de contexto | 2/3 |
| | Chunking justificado | 3/3 |
| | Iteração com Claude | 3/3 |
| | **Subtotal 1.1** | **13/15** |
| **1.2** | System prompt específico | 3/3 |
| | Mapeamento estático/dinâmico | 3/3 |
| | 3 perguntas testadas | 3/3 |
| | Iteração v1 → v2 | 3/3 |
| | **Subtotal 1.2** | **12/12** |
| **1.3** | Pipeline funcional | 3/3 |
| | Chunking justificado | 3/3 |
| | 5 testes com gabarito | 3/3 |
| | 2+ problemas reais | 3/3 |
| | Copilot evidenciado | 2/3 |
| | **Subtotal 1.3** | **14/15** |
| | **TOTAL** | **39/42** |

---

## Pontos Fortes

1. **Raciocínio causal, não apenas execução.** Em todos os exercícios, o aluno explica o *porquê* de cada decisão — o efeito Lost in the Middle determina o tamanho do chunk, a posição no prompt determina a ativação do guardrail, a coesão semântica determina o score de similaridade. Isso diferencia domínio real de reprodução de receitas.

2. **Tratamento exemplar da armadilha obrigatória (1.2).** A resposta errada da v1 foi detectada, classificada como erro crítico, diagnosticada na causa raiz (posicionamento do guardrail) e corrigida com a mudança mais eficaz. O changelog é o melhor tipo de evidência: mostra que o aluno entende o que mudou e por que funcionou.

3. **RAG tratado como engenharia de dados.** A síntese do exercício 1.3 articula o ponto mais importante da trilha: "o problema mais crítico do RAG não é o modelo de embeddings nem o LLM — é a qualidade e consistência da base documental." O aluno chegou a essa conclusão por experiência, não por leitura.

4. **Honestidade na avaliação.** O teste P4 (lacuna documental) foi marcado como ❌ na recuperação mesmo que o comportamento seja o correto. A estimativa de tokens do 1.1 foi justificada com as premissas explicitadas. O aluno não inflou os resultados.

---

## Pontos de Desenvolvimento

1. **Estimativa de tokens (1.1):** A estimativa de ~3,1M tokens ficou abaixo da faixa de referência sem análise da divergência. Para um exercício de análise de viabilidade, seria valioso incluir uma análise de sensibilidade ("se as estimativas de palavras forem 50% maiores, o total seria X") para demonstrar que a ordem de grandeza foi considerada.

2. **Orçamento prático de contexto (1.1):** O aluno calculou que cabem 247 chunks no contexto, mas não conectou esse número a uma recomendação prática ("para uso real, recomendar 5-10 chunks por query"). A análise de capacidade máxima está lá; falta a ponte para a recomendação operacional.

3. **Evidência de Copilot (1.3):** Uma única citação limita a verificação do uso real da ferramenta. Capturar e documentar 2-3 exemplos de uso (incluindo o prompt enviado e a completion aceita ou modificada) deixaria a evidência inequívoca e demonstraria o padrão de colaboração dev ↔ ferramenta.

---

## Resultado

**Aprovado com distinção.** Pontuação 39/42 (93%). O aluno demonstra domínio técnico dos fundamentos de LLM, engenharia de contexto e construção de pipelines RAG, com julgamento próprio aplicado em todas as etapas. Os dois pontos de melhoria identificados são oportunidades de refinamento, não lacunas de compreensão.
