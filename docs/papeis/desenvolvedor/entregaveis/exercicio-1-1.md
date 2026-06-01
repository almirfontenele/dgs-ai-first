# Análise Técnica: Viabilidade do Assistente NovaTech RAG

**Exercício:** 1.1 — Análise de Viabilidade Técnica  
**Papel:** Desenvolvedor  
**Data:** 2026-06-01  

---

## 1. Desafios por Tipo de Fonte

### PDFs com Tabelas Complexas (SharePoint)

**Desafio Principal:**  
Tabelas com 15+ colunas (ex.: PROC-042) têm relacionamentos bidimensionais — linhas são regiões, colunas são multiplicadores/fatores de peso. Parsers padrão (pdfplumber, PyMuPDF) linearizam o conteúdo, destruindo a estrutura de célula. O resultado é um bloco de texto como `Sul 1.2 1.3 Sudeste 1.0 1.1...`, sem associação linha-coluna.

**Impacto na Qualidade das Respostas:**  
O LLM não consegue responder com precisão "qual o multiplicador para o Nordeste com carga de 2.000kg?" porque a posição relativa da célula foi perdida. Pior: existem duas versões do PROC-042 (v1 e v2) com valores diferentes coexistindo no SharePoint — sem discriminação de versão no chunk, o retrieval pode recuperar o multiplicador errado.

**Estratégia de Tratamento:**  
1. Usar biblioteca com extração estrutural de tabelas (Camelot para tabelas com bordas, pdfplumber com estratégia `lattice` para PDFs nativos).  
2. Converter tabelas para Markdown ou JSON estruturado antes de indexar, preservando cabeçalhos como metadados.  
3. Embutir metadados de versão no chunk: `[PROC-042-v2][tabela:multiplicadores-regionais]` para que o retrieval possa filtrar por versão.  
4. Para documentos com versões coexistentes, adicionar campo `version_status: active|deprecated` no vetor e filtrar no retrieval.

---

### PDFs Escaneados (SharePoint)

**Desafio Principal:**  
Documentos digitalizados exigem OCR (Optical Character Recognition). A taxa de erro do OCR varia com a qualidade do scan — documentos fotocopiados várias vezes têm ruído visual que distorce caracteres. Erros comuns: `1` lido como `l` ou `I`, `0` como `O`, termos técnicos truncados. Isso contamina o índice vetorial com tokens corrompidos.

**Impacto na Qualidade das Respostas:**  
Um chunk com "prazo de entrega é 2 dias úteis" que foi OCR'ado como "prazo de entrega é Z dias úteis" nunca será recuperado pela query correta — a distância semântica vetorial é alta. Além disso, campos numéricos críticos (valores de SLA, percentuais) corrompidos geram respostas factualmente erradas.

**Estratégia de Tratamento:**  
1. Usar OCR com alta confiança mínima (ex.: Tesseract com threshold ≥85%, ou Azure Document Intelligence para documentos corporativos).  
2. Pós-processamento com spell-check especializado no domínio logístico (dicionário customizado: CT-e, ANTT, SLA, etc.).  
3. Incluir score de confiança do OCR como metadado do chunk — chunks com confiança <75% são marcados como `low_quality: true` e excluídos do retrieval por padrão, ou exibem aviso no response.  
4. Priorizar reprocessamento dos documentos com qualidade crítica de negócio.

---

### Wiki com Links Internos (Confluence)

**Desafio Principal:**  
Páginas do Confluence contêm links internos que criam dependências de contexto. A FAQ-Atendimento, por exemplo, referencia "veja a tabela SLA-2024" — se o chunk da FAQ for recuperado sem o SLA, o LLM recebe uma referência sem contexto. Macros customizadas do Confluence (tabelas dinâmicas, status de aprovação) não são renderizadas no export de texto, gerando lacunas invisíveis.

**Impacto na Qualidade das Respostas:**  
Respostas incompletas do tipo "conforme descrito em SLA-2024" sem o conteúdo real do SLA. O LLM pode inventar (alucinar) o conteúdo referenciado se não encontrar o chunk correspondente no contexto recuperado.

**Estratégia de Tratamento:**  
1. Ao indexar, resolver links internos no momento do chunking: substituir `[veja SLA-2024]` pelo conteúdo resumido da página referenciada (summary embedding).  
2. Criar grafo de dependências entre páginas — ao recuperar um chunk, verificar se ele tem links não resolvidos e incluir chunks das páginas linkadas com penalidade de relevância.  
3. Macros não interpretadas: remover ou substituir por placeholder descritivo (`[tabela dinâmica não disponível]`) em vez de deixar markup quebrado no chunk.

---

### Planilhas com Fórmulas Interdependentes

**Desafio Principal:**  
~50 planilhas com fórmulas que referenciam outras abas. O valor de uma célula pode depender de 3 outras planilhas. Para o RAG, o problema é duplo: (a) fórmulas exportadas como texto são inúteis semanticamente (`=VLOOKUP(A2,'Tabela Frete'!A:C,2,FALSE)`); (b) valores calculados são dinâmicos — mudam sem que o documento seja "atualizado" no índice.

**Impacto na Qualidade das Respostas:**  
Se a planilha for indexada com fórmulas (não valores), o retrieval não encontra dados numéricos. Se indexada com valores calculados no momento da extração, esses valores ficam desatualizados conforme o negócio evolui, gerando respostas com dados obsoletos.

**Estratégia de Tratamento:**  
1. Indexar apenas valores calculados, nunca fórmulas.  
2. Distinguir dados estáticos (tabelas de referência: multiplicadores, tiers) de dados dinâmicos (volumes mensais, contadores operacionais). Apenas dados estáticos devem ser indexados no RAG.  
3. Para dados dinâmicos, usar integração direta com a API do sistema transacional (ERP/TMS) em vez de indexar planilhas.  
4. Incluir timestamp de extração como metadado e implementar invalidação automática após N dias (ex.: 30 dias para tabelas de frete que mudam mensalmente).

---

## 2. Estimativa de Tamanho da Base em Tokens

### Cálculo de Palavras por Fonte

**PDFs (800 documentos × 10 páginas × 250 palavras/página):**  
- PDFs com tabelas complexas têm menos palavras por página (~150 palavras — tabelas ocupam espaço visual mas poucas palavras semânticas). Estimativa conservadora: 60% das páginas são densas em texto, 40% são tabelas/imagens.  
- Estimativa ajustada: 800 × 10 × (0,6 × 250 + 0,4 × 150) = 800 × 10 × 210 = **1.680.000 palavras**

**Wiki Confluence (400 páginas × 1.500 palavras):**  
- 400 × 1.500 = **600.000 palavras**

**Planilhas (~50 planilhas):**  
- Estimativa: média de 200 células com conteúdo semântico por planilha (ignorando fórmulas, células em branco, cabeçalhos duplicados), ~5 palavras por célula.  
- 50 × 200 × 5 = **50.000 palavras**

**Total de palavras: 1.680.000 + 600.000 + 50.000 = 2.330.000 palavras**

### Conversão para Tokens

```
2.330.000 palavras ÷ 0,75 = ≈ 3.107.000 tokens (~3,1M tokens)
```

### Distribuição por Tipo de Fonte

| Fonte | Palavras | % do Total | Tokens |
|-------|----------|-----------|--------|
| PDFs | 1.680.000 | 72% | ~2.240.000 |
| Wiki Confluence | 600.000 | 26% | ~800.000 |
| Planilhas | 50.000 | 2% | ~67.000 |
| **Total** | **2.330.000** | **100%** | **~3.107.000** |

### Implicações

- **Relação com context window:** A base completa (~3,1M tokens) é **24x maior** que a context window do GPT-4o (128K tokens). É impossível incluir tudo em uma única query — RAG com retrieval seletivo é mandatório.
- **Custo de indexação:** 3,1M tokens para geração de embeddings (ada-002: $0,10/1M tokens ≈ $0,31 total para indexação inicial). Aceitável.
- **Indexação completa vs. sampling:** Com 3,1M tokens, é viável indexar tudo — o limite recomendado para um índice único sem sharding é ~50M tokens. **Não é necessário sampling.**
- **Atualização incremental:** PDFs mudam raramente (versionamento no SharePoint), Wiki muda frequentemente (Confluence). Estratégia: re-index incremental por data de modificação.

---

## 3. Orçamento de Contexto

### Cálculo de Espaço Disponível

```
Context window total:              128.000 tokens
- System prompt + instruções:       -2.000 tokens
- User query (estimativa):            -500 tokens
- Response buffer (geração LLM):    -2.000 tokens
─────────────────────────────────────────────────
= Espaço disponível para chunks:   123.500 tokens
```

### Capacidade de Chunks

```
123.500 tokens ÷ 500 tokens/chunk = ~247 chunks por query
```

### Análise de Impacto

**Número máximo de chunks por query:** ~247 chunks (assumindo chunks de 500 tokens)

**Cobertura de conhecimento por query:**  
- Base total: ~3.107.000 tokens ÷ 500 tokens/chunk = ~6.214 chunks totais  
- Cobertura por query: 247 ÷ 6.214 = **~4% da base por query**  
- Isso reforça que a qualidade do retrieval (ranker) é crítica — o sistema precisa encontrar os 247 chunks mais relevantes em 6.214.

**Efeito "Lost in the Middle":**  
LLMs processam melhor informação no início e no fim do contexto. Com 247 chunks, um chunk relevante na posição 120 (meio do contexto) tem probabilidade significativamente menor de ser "utilizado" na resposta do que um chunk nas posições 1-10 ou 235-247.

Mitigação: após o retrieval, **re-ranquear** os chunks por relevância e posicioná-los nas primeiras e últimas posições do contexto. Os chunks de menor relevância (necessários para contexto, mas não críticos) ficam no meio.

**Trade-offs de tamanho de chunk:**

| Tamanho do Chunk | Chunks que cabem | Cobertura | Fragmentação |
|-----------------|-----------------|-----------|-------------|
| 250 tokens | ~494 chunks | ~8% da base | Alta (contexto fragmentado) |
| 500 tokens | ~247 chunks | ~4% da base | Média (padrão) |
| 1.000 tokens | ~123 chunks | ~2% da base | Baixa (contexto rico) |

**Recomendação:** Estratégia híbrida por tipo de pergunta (detalhada na Seção 4).

---

## 4. Estratégia de Chunking

### Categoria A — Lookup Simples
*"Qual é a taxa de frete para o Nordeste com 2.000kg?"*

**Tamanho do Chunk:** 150–250 tokens

**Unidade Semântica:** Uma linha de tabela com seu cabeçalho contextualizado, ou um par pergunta-resposta de FAQ.

**Justificativa:**
- Tipo de pergunta exige: contexto compacto e preciso. A resposta está em um único dado.
- Com chunks de 200 tokens, cabem ~617 chunks no contexto — alta diversidade de cobertura.
- Efeito Lost in the Middle: chunks pequenos e focados são menos afetados porque a resposta está concentrada em poucos tokens, não diluída em prosa.
- Exemplo: a tabela de multiplicadores regionais do PROC-042-v2 deve ser chunkeada linha por linha: `[PROC-042-v2][tabela:multiplicadores] Nordeste: 1.5`

**Riscos:** Chunks muito pequenos perdem contexto do cabeçalho da tabela. Mitigação: incluir sempre os 2 primeiros tokens do cabeçalho como prefixo do chunk.

---

### Categoria B — Procedimento/Processo
*"Quais são os passos para processar uma devolução?"*

**Tamanho do Chunk:** 300–500 tokens

**Unidade Semântica:** Uma seção numerada completa (ex.: seção 3.3 do POL-001, com todos os 5 passos do procedimento).

**Justificativa:**
- Tipo de pergunta exige: contexto rico e sequencial. Fragmentar um procedimento em 5 chunks separados (um por passo) obriga o LLM a reordenar e montar a resposta — risco de gaps ou inversões de ordem.
- Preservar a sequência lógica (passos 1→5) em um único chunk garante que o LLM receba a narrativa completa.
- Efeito Lost in the Middle: com chunks de 400 tokens, cabem ~308 chunks no contexto. O procedimento está em um único chunk — mesmo que caia no "meio", o LLM tem todo o contexto necessário em um bloco coeso.
- Exemplo: POL-001 seção 3.3 (5 passos do procedimento de devolução) deve ser um único chunk de ~350 tokens.

**Riscos:** Se um documento tem 20 seções de procedimento, cada uma como chunk de 450 tokens, cabem ~274 chunks — cobertura ainda adequada.

---

### Categoria C — Análise Comparativa
*"Compare taxas de frete entre v1 e v2 do PROC-042"*

**Tamanho do Chunk:** 200–350 tokens por "opção" comparada

**Unidade Semântica:** Um item comparável isolado (ex.: tabela de multiplicadores da v1 como chunk separado da v2, com metadados de versão).

**Justificativa:**
- Tipo de pergunta exige: múltiplas perspectivas isoladas que o LLM possa comparar.
- Se v1 e v2 estiverem no mesmo chunk, o LLM pode confundir os valores. Chunks separados permitem que o retrieval traga ambos explicitamente, e o LLM compara lado a lado.
- Metadados essenciais: `version: v1|v2`, `status: deprecated|active`, `date: 2023-03|2023-11`
- Efeito Lost in the Middle: itens comparáveis devem ser posicionados consecutivamente no início do contexto — o LLM compara melhor quando os dados estão próximos e na zona de maior atenção.

**Riscos:** O problema crítico da NovaTech: PROC-042-v1 e v2 coexistem sem hierarquia clara. O sistema deve sempre apresentar a v2 como primária e v1 como histórica, com aviso explícito no prompt.

---

### Categoria D — Contexto Agregado
*"Qual é a situação geral dos SLAs para clientes Gold?"*

**Tamanho do Chunk:** 600–1.000 tokens

**Unidade Semântica:** Uma seção completa de documento que cobre o tema de forma abrangente (ex.: tabela SLA completa + definição de incidente crítico + penalidades).

**Justificativa:**
- Tipo de pergunta exige: visão ampla. Chunks pequenos forçariam muitas recuperações e o LLM precisaria sintetizar de múltiplos fragmentos — risco de informação inconsistente.
- Chunks maiores (800 tokens) garantem que o contexto relevante está disponível de forma coesa para síntese.
- Com chunks de 800 tokens, cabem ~154 chunks no contexto — cobertura de ~2,5% da base por query, suficiente para perguntas temáticas.
- Efeito Lost in the Middle: para queries agregadas, usar menos chunks de maior qualidade é melhor que muitos chunks pequenos. Os top-5 chunks mais relevantes devem ir para as primeiras posições.

**Riscos:** Chunks grandes incluem informação tangencial que pode confundir o LLM. Mitigação: criar chunks temáticos (não por documento), agrupando seções de diferentes documentos sobre o mesmo tema.

---

## 5. Conclusões e Recomendações

### É Viável?

**Sim, tecnicamente viável**, com condicionantes importantes.

A base de ~3,1M tokens é gerenciável com um único índice vetorial. O volume não exige arquitetura distribuída de alto custo. O GPT-4o com 128K de context window acomoda até 247 chunks por query — suficiente para a maioria dos casos de uso da NovaTech.

### Riscos Críticos (a resolver antes de produção)

| Risco | Severidade | Ação Necessária |
|-------|-----------|----------------|
| Documentos conflitantes (PROC-042-v1 vs v2) | **Alta** | Definir política de versionamento antes da indexação. Sem isso, o assistente pode citar valores errados de frete. |
| FAQ informal não validada | **Alta** | A FAQ-Atendimento contém informações práticas valiosas mas não validadas pelo Compliance. Indexá-la sem aviso pode propagar informações incorretas. |
| PDFs escaneados com OCR de baixa qualidade | **Média** | Implementar score de confiança de OCR e excluir chunks <75% de confiança. |
| Planilhas com dados dinâmicos | **Média** | Não indexar dados operacionais que mudam frequentemente — conectar via API do sistema transacional. |
| Contexto fragmentado no Confluence | **Baixa** | Resolver links internos no momento da indexação para evitar respostas incompletas. |

### Trade-offs Principais

1. **Precisão vs. Cobertura:** Chunks menores aumentam cobertura mas fragmentam contexto. Para a NovaTech, recomenda-se estratégia híbrida por categoria de pergunta (seção 4).

2. **Atualidade vs. Custo:** Re-indexar tudo diariamente seria ideal para dados dinâmicos, mas caro. Recomendação: re-index incremental por data de modificação + timestamp de validade por tipo de documento.

3. **Completude vs. Confiabilidade:** Incluir a FAQ informal aumenta a cobertura de casos edge, mas introduz risco de informação não validada. Recomendação: indexar com metadado `source_type: informal` e exibir aviso no response quando a resposta vier exclusivamente de fontes informais.

### Próximos Passos Recomendados

1. **Imediato:** Definir política de versionamento com o time de Operações — qual versão do PROC-042 está ativa?
2. **Semana 1:** Prototipar extração de tabelas do PROC-042-v2 e validar se a estrutura é preservada.
3. **Semana 2:** Implementar pipeline de OCR com score de confiança nos PDFs escaneados de maior criticidade.
4. **Semana 3:** Construir índice vetorial piloto com os 5 documentos da `fonte-da-verdade` e testar as 4 categorias de pergunta.

---

## Histórico de Iteração com Claude

### Iteração 1 → 2 (Revisão Crítica)

**Feedback recebido:**
1. **Estimativa de planilhas subestimada** — A análise inicial usava 100 células/planilha. O feedback apontou que planilhas corporativas com fórmulas interdependentes tipicamente têm mais células relevantes (200+), e a estimativa deve ser mais conservadora.
2. **Falta de análise de custo de indexação** — A estimativa de tokens não incluía implicação de custo. Adicionada análise de custo de embeddings (~$0,31 para indexação inicial).
3. **Risco dos documentos conflitantes não era o principal destaque** — O problema da coexistência de PROC-042-v1 e v2 é o risco de negócio mais crítico e deve aparecer com maior destaque na conclusão, não apenas na análise de fonte.

**Mudanças aplicadas:**
- **Planilhas:** Antes: 100 células × 3 palavras = 15.000 palavras. Depois: 200 células × 5 palavras = 50.000 palavras. Impacto mínimo no total (~0,5% da base), mas mais realista.
- **Custo de indexação:** Seção 2 expandida com análise de custo de embeddings e threshold de viabilidade financeira.
- **Risco de documentos conflitantes:** Movido para a posição 1 na tabela de riscos críticos, com ação clara de resolução pré-produção.

**Impacto:**
A análise ficou mais honesta sobre os riscos de negócio. O problema de versionamento conflitante é o que mais provavelmente causaria danos concretos (cobranças erradas de frete), então precisa ser o primeiro item a resolver — não uma observação técnica enterrada na seção de fontes.
