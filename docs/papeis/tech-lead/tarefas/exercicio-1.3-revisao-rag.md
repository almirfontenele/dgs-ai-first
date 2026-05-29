### Exercício 1.3 — Revisão crítica de uma proposta de RAG

**Contexto:** Um desenvolvedor mais júnior propôs uma arquitetura de RAG. Você precisa revisar.

**Ferramentas a utilizar:** Claude (chat)

**Inputs fornecidos:**
- O cenário completo.
- A proposta (simulada): *"Vamos usar Azure AI Search com embeddings do ada-002. Todos os documentos serão indexados num único índice. Chunking fixo de 512 tokens sem overlap. O LLM recebe os 3 chunks mais similares. Usaremos GPT-4o para geração. O pipeline de ingestão roda manualmente quando alguém lembra de atualizar."*

**Tarefa:**
1. Faça sua própria revisão técnica da proposta: identifique ao menos 4 problemas ou riscos.

2. Em seguida, use o **Claude** para uma segunda revisão: forneça a proposta e peça ao Claude que identifique problemas. Compare a lista do Claude com a sua: o que o Claude encontrou que você não viu? O que você encontrou que o Claude não mencionou?

3. Para cada problema (de ambas as listas), proponha uma alternativa.

4. Reescreva a proposta incorporando as melhorias.

**Entregável:** Sua revisão original, a revisão do Claude, a comparação entre as duas, e a proposta reescrita.

**Critérios de avaliação:**
- Os problemas identificados são reais e demonstram compreensão de RAG (ex: chunking fixo sem overlap perde contexto em fronteiras; 3 chunks pode ser insuficiente para perguntas complexas; ingestão manual é um risco operacional).
- A comparação humano vs Claude é honesta (reconhece onde cada um acertou e errou).
- A proposta reescrita resolve os problemas sem overengineering.
- O exercício demonstra o uso de IA como par de revisão, não como substituto do julgamento.
