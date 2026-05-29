# ADR-0001: Escolha do Modelo de LLM — Azure OpenAI (GPT-4o)

## Status: Aceito

## Contexto

O assistente de atendimento da NovaTech precisa responder consultas sobre documentação normativa (POL, PROC, SLA) integrada via RAG. O volume operacional é de **320 chamados/dia**, com estimativa de **60% com consulta ao LLM** (~192 chamadas/dia, ~5.760/mês). A base documental tem aproximadamente **12M tokens** no total, mas o contexto por chamada é limitado ao que o retriever recupera.

**Forças que atuam:**

- A NovaTech já opera sobre Azure (Azure DevOps para medição de SLA, SharePoint para documentação). Há investimento consolidado no ecossistema Microsoft.
- O requisito do Product Specialist é explícito: **o assistente nunca deve inventar informações**. Isso coloca precisão factual como restrição hard, não como nice-to-have.
- Documentos contraditórios (PROC-042 v1 vs v2) exigem que o modelo siga instrução de prompt com fidelidade — raciocínio sobre conflito, não geração criativa.
- Documentos escaneados (~15% da base) já passarão por OCR antes do pipeline; a entrada ao LLM é sempre texto estruturado.
- O requisito de **citação de fonte** em toda resposta exige que o modelo respeite e reproduza metadados de contexto sem desvio.

**Volume de custo estimado (referência):**
- Média estimada por chamada: ~3.000 tokens de entrada (prompt de sistema + chunks recuperados + histórico) + ~500 tokens de saída.
- GPT-4o (Azure): ~$0,005/1k input + $0,015/1k output ≈ $0,0225/chamada → ~$130/mês no volume projetado.

## Decisão

**Adotar Azure OpenAI com modelo GPT-4o** como LLM de geração para o pipeline de RAG.

Justificativas objetivas:

1. **Conformidade de dados residência**: Dados da NovaTech processados no Azure OpenAI permanecem na região Azure contratada. Alternativas (Claude via API Anthropic, modelos Hugging Face externos) implicam saída de dados para servidores fora do contrato Azure — requer avaliação jurídica e de compliance que não está no escopo deste projeto.

2. **Janela de contexto suficiente**: GPT-4o tem janela de 128k tokens. Para o cenário NovaTech (5–8 chunks de ~500 tokens + prompt de sistema + histórico de sessão), a janela é adequada com margem. Claude 3.5 Sonnet oferece 200k, mas o custo via API Anthropic é adicional ao contrato Azure já existente.

3. **Integração nativa com stack Azure**: Azure AI Search, Azure Functions, Azure Bot Service (Teams) e Azure OpenAI compartilham o mesmo plano de controle, autenticação (Entra ID), e rede privada (VNet). Modelos open-source via Ollama demandam infraestrutura de GPU própria — custo operacional e SRE não previstos.

4. **Custo dentro do envelope aprovado**: ~$130/mês no volume projetado é compatível com o crédito Azure da NovaTech. Modelos open-source (Llama 3, Mixtral) em GPU dedicada têm custo fixo de infra (~$300–800/mês por instância A10G) independente do volume.

5. **Comportamento de seguir instrução (instruction following)**: GPT-4o tem benchmark consolidado em tarefas de extração fiel de contexto e seguimento de restrições de prompt. O requisito de não alucinar é endereçado pela arquitetura RAG (o modelo só gera a partir do contexto recuperado), mas o modelo precisa honrar a instrução "responda apenas com base nos documentos fornecidos" — GPT-4o demonstra comportamento confiável nesse padrão.

## Consequências

**Positivas:**
- Pipeline completo dentro do ecossistema Azure — um único vendor, uma única fatura, uma única camada de segurança.
- Onboarding mais rápido para o time de operações já familiarizado com Azure.
- SLA de disponibilidade do Azure OpenAI (99,9%) compatível com o requisito do portal de tracking (99,5% para Gold).

**Negativas:**
- **Lock-in de vendor**: Mudar de GPT-4o para outro modelo exige reescrita de integrações de autenticação e possível ajuste de prompts (comportamento de modelos difere). Mitigação: abstrair chamadas LLM atrás de uma interface (ver ADR-0004).
- **Sem fine-tuning na decisão atual**: Fine-tuning de GPT-4o no Azure é possível mas caro e fora de escopo. Se o comportamento base não atender, a alternativa é engenharia de prompt — que tem limites.
- **Custo escala com volume**: Se o volume de chamadas crescer 5×, o custo sobe proporcionalmente. Modelos open-source têm custo fixo de infra independente de volume.

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **Claude 3.5 Sonnet via API Anthropic** | Janela maior (200k) e excelente instruction following, mas custo duplicado (Azure + Anthropic) e dados saem do envelope Azure — questão de compliance não resolvida neste ciclo. |
| **Llama 3 / Mixtral via Ollama** | Custo fixo de GPU, complexidade operacional de manter infra de inferência, e benchmarks de instruction following inferiores ao GPT-4o para tarefas estruturadas com restrições de prompt. |
| **GPT-4o-mini** | Custo ~10× menor, mas performance inferior em tarefas que exigem raciocínio sobre documentos contraditórios e multi-step retrieval. Para o caso de uso da NovaTech (precisão > custo), o trade-off não compensa. |

---

## Devil's Advocate — Registro da sessão de revisão

**Argumento contra apresentado ao Claude:**
> "Você está decidindo pelo GPT-4o apenas porque a NovaTech já usa Azure. Isso é viés de status quo. Claude Sonnet tem janela maior, melhor instruction following em benchmarks recentes, e o custo adicional é marginal comparado ao risco de lock-in no Azure OpenAI."

**Resposta e revisão:**

O contra-argumento é parcialmente válido. A janela maior do Claude (200k vs 128k) é irrelevante no volume de contexto real do caso de uso (~4k tokens por chamada). O argumento de instruction following é contestável — ambos os modelos performam bem em tarefas de RAG com prompt bem estruturado. O ponto de lock-in foi aceito como risco real e incorporado às consequências negativas com mitigação documentada (abstração de interface).

O argumento de conformidade de dados residência **não é viés de status quo** — é requisito operacional real para empresa no setor de logística com dados de clientes corporativos. Esse ponto encerrou o debate: Claude via API Anthropic requer análise jurídica separada não prevista no escopo.

**Impacto na decisão:** A decisão mantida, com adição explícita da mitigação de lock-in via abstração de interface (ADR-0004) e reconhecimento que GPT-4o-mini deve ser reavaliado se volume crescer sem crescimento proporcional de complexidade das queries.
