### Exercício 1.1 — Decisões arquiteturais documentadas como ADRs

**Contexto:** Você é o Tech Lead do projeto e precisa tomar e documentar decisões arquiteturais fundamentadas nas capacidades e limitações reais da IA generativa. Cada decisão deve ser registrada como um ADR (Architecture Decision Record) independente.

**Ferramentas a utilizar:** Claude (chat)

**Inputs fornecidos:**
- O cenário completo.
- A análise técnica do desenvolvedor (simulada): *"Base estimada em ~12M tokens. PDFs com tabelas complexas são o maior desafio para extração. Documentos escaneados (~15% da base) precisarão de OCR. Documentos contraditórios foram identificados em ao menos 3 procedimentos. Recomendação de chunking por seção com overlap de 10%."*
- Os requisitos do Product Specialist (simulados): *"Respostas devem citar fonte. Documentos contraditórios devem mostrar ambas as versões com indicação de data. Atualização máxima de 24h após publicação de novo documento. O assistente nunca deve inventar informações."*
- Formato de ADR:
  ```
  # ADR-NNNN: [Título da Decisão]
  ## Status: Proposto / Aceito / Depreciado
  ## Contexto: [Qual problema estamos resolvendo? Que forças atuam?]
  ## Decisão: [O que decidimos fazer?]
  ## Consequências: [O que isso implica — positivo e negativo?]
  ## Alternativas consideradas: [O que mais avaliamos e por que descartamos?]
  ```

**Tarefa:**
Usando o **Claude**, produza 4 ADRs independentes, uma para cada decisão abaixo. Para cada ADR, peça ao Claude que atue como "devil's advocate": apresente a decisão e peça que argumente contra. Use os contra-argumentos para fortalecer ou revisar a decisão.

**ADR-0001 — Escolha do modelo de LLM:** Considerando o ecossistema Microsoft, avalie Azure OpenAI (GPT-4o) vs alternativas (Claude via API, modelos open-source via Ollama). Justifique considerando: custo por token para o volume estimado (320 chamados/dia × 60% com consulta), janela de contexto necessária, o requisito de não alucinar, e integração com o stack Azure.

**ADR-0002 — Estratégia de gerenciamento de contexto:** Como o pipeline gerencia o contexto que o LLM recebe? Defina: tamanho máximo de contexto por query, número de chunks recuperados, estratégia para perguntas multi-domínio (que cruzam SLA + frete + devolução), e como lidar com context rot em conversas longas (o bot no Teams pode ter múltiplas perguntas na mesma sessão).

**ADR-0003 — Tratamento de documentos contraditórios:** Como o pipeline deve tratar duas versões de um mesmo documento? Opções incluem: manter apenas a mais recente, manter ambas com metadado de vigência, ou delegar a decisão ao LLM com instrução no prompt.

**ADR-0004 — Build vs buy para o pipeline de RAG:** Construir com LangChain/LlamaIndex + ChromaDB/FAISS (open-source, mais controle) vs usar Azure AI Search + Azure OpenAI nativo (managed, menos controle, mais integrado). Considere: custo, complexidade operacional, flexibilidade, e o fato de que a NovaTech já tem Azure.

**Entregável:** Os 4 ADRs completos no formato especificado e o histórico de "devil's advocate" com o Claude para ao menos 2 das 4 decisões.

**Critérios de avaliação:**
- Cada ADR é independente e autossuficiente (pode ser lido isoladamente).
- As decisões são fundamentadas em trade-offs explícitos, não em preferência de tecnologia.
- A ADR-0002 (contexto) demonstra compreensão de engenharia de contexto — context rot, orçamento de atenção, perguntas multi-domínio.
- A ADR-0003 (contradições) demonstra entendimento de que RAG é um problema de dados, não só de modelo.
- O uso do Claude como devil's advocate melhorou a qualidade das decisões (as versões finais são mais robustas que as iniciais).
