# ADR-0004: Build vs Buy para o Pipeline de RAG

## Status: Aceito

## Contexto

O pipeline de RAG da NovaTech precisa de uma decisão arquitetural sobre onde construir e onde comprar: usar **Azure AI Search + Azure OpenAI nativo** (stack managed, integrada ao ecossistema existente) ou **LangChain/LlamaIndex + ChromaDB/FAISS** (stack open-source, mais controle, mais responsabilidade operacional).

Esta decisão tem ramificações para custo total de propriedade, velocidade de entrega, flexibilidade futura e carga sobre o time de engenharia — que, no contexto da NovaTech, é pequeno e não tem histórico em MLOps.

**Contexto operacional da NovaTech:**

- Infraestrutura: Azure (Azure DevOps, SharePoint, Azure Bot Service para o Teams).
- Time de engenharia: perfil de desenvolvimento de software, sem especialistas em MLOps ou operações de vector stores.
- Base documental: ~12M tokens, documentos em PDF (incluindo PDFs escaneados com OCR), Markdown e planilhas.
- Atualização máxima de 24h após publicação de novo documento (requisito do Product Specialist).
- Volumes: 320 chamados/dia, 60% com consulta ao LLM.

**Comparativo objetivo das opções:**

| Critério | Azure AI Search + Azure OpenAI | LangChain/LlamaIndex + ChromaDB/FAISS |
|---|---|---|
| Tempo até MVP funcional | 2–3 semanas | 4–6 semanas |
| Custo mensal estimado | $200–400/mês (Search + OpenAI) | $300–600/mês (GPU para FAISS em escala + infra) |
| Operação do vector store | Managed pelo Azure | Responsabilidade do time (backups, upgrades, HA) |
| Flexibilidade de chunking | Limitada (Azure indexer) | Total (código Python) |
| Flexibilidade de retrieval | Media (hybrid search nativo) | Total (custom re-rankers, HyDE, MMR) |
| Monitoramento de qualidade RAG | Básico (Azure Monitor) | Requer tooling adicional (LangSmith, etc.) |
| Conformidade de dados | Nativa no Azure | Requer configuração (dados ficam em infra própria) |
| Abstração de LLM | Acoplada ao Azure OpenAI | Suporta múltiplos providers via interface |

## Decisão

**Adotar Azure AI Search + Azure OpenAI nativo para o MVP, com abstração de interface que preserve a opção de migrar.**

A decisão não é "Azure é melhor que open-source" — é "para o perfil de time, prazo e infraestrutura da NovaTech, o managed stack entrega o MVP com menor risco operacional e menor time-to-value".

**Justificativas objetivas:**

### 1. Velocidade de entrega com qualidade operacional

O Azure AI Search oferece hybrid search (vetorial + BM25 keyword) nativo, com re-ranking semântico via Azure AI. Para o caso de uso da NovaTech (documentos com terminologia específica como "CT-e", "ANTT", "frete especial"), hybrid search performa melhor que busca puramente vetorial — e não requer código customizado.

Com LangChain + FAISS, implementar hybrid search requer integração manual de um BM25 index (ex: Elasticsearch ou BM25Retriever do LangChain), adicionando 2–3 semanas de desenvolvimento e uma dependência operacional adicional.

### 2. Conformidade e governança sem configuração adicional

Azure AI Search e Azure OpenAI compartilham o mesmo tenant Azure da NovaTech. Dados nunca saem do ambiente controlado, logs de acesso são nativos no Azure Monitor, e a configuração de rede privada (VNet) está disponível sem código adicional.

Com ChromaDB/FAISS, o time precisaria configurar: persistência de dados (disco ou blob storage), rede privada, autenticação, backup automático e upgrade strategy. Para um time sem experiência em MLOps, isso é risco real de incidente silencioso (ex: índice vetorial crescendo sem política de limpeza, degradando performance sem alerta).

### 3. Integração com pipeline de ingestão de documentos (requisito de 24h)

Azure AI Search tem indexers nativos para SharePoint, Azure Blob Storage e Azure DevOps — as fontes de documentos da NovaTech. O ciclo de atualização de 24h é configurável via agendamento de indexer sem código customizado.

Com LangChain/LlamaIndex, a ingestão é código Python que o time precisaria desenvolver, testar, monitorar e manter. O requisito de OCR para os ~15% de PDFs escaneados é suportado nativamente pelo Azure AI Document Intelligence, que se integra ao indexer do Azure AI Search.

### 4. Abstração de interface para preservar optionalidade

A decisão de usar Azure AI Search **não elimina a opção de migrar para open-source no futuro**. A interface entre o pipeline de RAG e o restante do sistema (bot do Teams, API de chamados) será definida de forma agnóstica ao retriever:

```
retriever.search(query: str, domain: list[str], top_k: int) → list[Chunk]
```

Trocar a implementação de Azure AI Search para ChromaDB exige apenas reimplementar essa interface — não requer mudanças no LLM, no prompt de sistema, ou na lógica de detecção de contradições (ADR-0003).

Essa abstração também resolve o risco de lock-in identificado no ADR-0001.

## Consequências

**Positivas:**
- MVP em 2–3 semanas ao invés de 4–6 semanas.
- Zero responsabilidade operacional sobre vector store: Azure gerencia HA, backup, upgrades.
- Hybrid search disponível nativamente — requisito de recuperação de documentos técnicos com terminologia específica.
- Ingestão automática via indexers do Azure, atendendo o SLA de atualização de 24h sem pipeline customizado.
- Custo previsível: Azure AI Search tem pricing por unidade de busca (SU), não por volume de queries.

**Negativas:**
- **Flexibilidade de retrieval limitada no curto prazo**: Técnicas avançadas como HyDE (Hypothetical Document Embeddings), MMR (Maximum Marginal Relevance), ou custom re-rankers não estão disponíveis nativamente. Se a qualidade do retrieval provar insuficiente, a migração para open-source será necessária — mas esse momento será informado por métricas reais, não por especulação.
- **Chunking via Azure indexer é menos flexível**: A estratégia de chunking por seção com overlap de 10% (recomendada pelo desenvolvedor) requer configuração do Azure indexer — possível, mas com menos granularidade que código Python customizado. Para PDFs complexos com tabelas, o Azure AI Document Intelligence processa a estrutura, mas o controle fino de chunking é menor.
- **Custo de Azure AI Search**: Uma unidade de busca (SU) tem custo fixo independente de volume (~$250/mês). Se a NovaTech for pequena suficiente para que isso represente overhead, reavaliar.
- **Acoplamento ao ecossistema Azure**: Apesar da abstração de interface, os indexers de ingestão são Azure-nativos. Migrar a ingestão para ambiente diferente no futuro exige reescrita do pipeline de ingestão.

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **LangChain + ChromaDB (cloud managed, ex: Chroma Cloud)** | Resolve a operação do vector store, mas não resolve o pipeline de ingestão customizado nem o hybrid search. Custo adicional ao Azure existente sem ganho proporcional de flexibilidade para o MVP. |
| **LlamaIndex + FAISS on-premises** | Máxima flexibilidade técnica, mas máxima responsabilidade operacional. Requer GPU ou CPU otimizada para FAISS em escala, backups manuais, sem HA nativa. Incompatível com o perfil do time de engenharia da NovaTech neste momento. |
| **Azure AI Search + LangChain como orquestrador** | Tentador para preservar flexibilidade, mas introduz uma camada de abstração adicional sem benefício imediato. O Azure AI Search tem SDK Python próprio que já serve como camada de abstração suficiente para o MVP. |
| **Full managed: Azure AI Foundry (prompt flow)** | Solução completamente managed, low-code. Descartada porque elimina a capacidade do time de implementar a lógica de detecção de contradições (ADR-0003) e gerenciamento de contexto (ADR-0002) com o controle necessário. |

## Critério de reavaliação

Esta decisão deve ser reavaliada se qualquer uma das seguintes condições for observada nos primeiros 90 dias:

1. **Qualidade de retrieval insuficiente**: Se o recall@8 para queries multi-domínio ficar abaixo de 70% nos primeiros 30 dias, iniciar prova de conceito com LlamaIndex + ChromaDB usando técnicas avançadas de retrieval.
2. **Limitação de chunking impacta qualidade**: Se PDFs com tabelas complexas (ex: tabelas de SLA, multiplicadores regionais) forem recuperados com conteúdo truncado ou misturado, avaliar pipeline de ingestão customizado.
3. **Volume cresce 5×**: Se o volume subir para ~1.600 chamados/dia, o custo do Azure AI Search (fixo por SU) torna-se vantagem relativa sobre soluções baseadas em custo por query. Mas a capacidade de processamento do indexer precisa ser reavaliada.
