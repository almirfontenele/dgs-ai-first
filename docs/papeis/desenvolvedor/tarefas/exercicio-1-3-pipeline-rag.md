### Exercício 1.3 — Construção de pipeline de RAG com ferramentas open-source

**Contexto:** O Tech Lead quer uma prova de conceito funcional do pipeline de RAG usando ferramentas gratuitas e open-source, antes de investir em licenças Azure. Você precisa construir um protótipo que ingira documentos, crie embeddings, armazene num vector store, e responda perguntas com base nos documentos.

**Ferramentas a utilizar:** Claude (chat) + GitHub Copilot

**Inputs fornecidos:**
- O cenário completo.
- Os documentos da NovaTech como arquivos individuais para ingestão (ver **Anexo A**, pasta `anexo-a-documentos-individuais/` — 5 arquivos .md, um por documento, prontos para processamento por scripts).
- Os chunks de referência (ver **Anexo B**) — use o mapa de cobertura como gabarito para validar se o pipeline recupera os chunks corretos.
- Stack sugerida (todas gratuitas/open-source):
  - **Python** como linguagem.
  - **ChromaDB** como vector store local (pip install chromadb).
  - **sentence-transformers** para embeddings open-source (pip install sentence-transformers — modelo sugerido: `all-MiniLM-L6-v2`).
  - **LangChain** ou código manual para orquestração (pip install langchain).
  - Para geração: usar o **Claude** (via chat manual, não via API) ou qualquer modelo local via **Ollama** (gratuito).
- Alternativa: se o participante preferir, pode usar outra stack free (FAISS em vez de ChromaDB, Ollama para embeddings locais, etc). O que importa é que funcione e seja gratuito.

**Entregável:** O código do pipeline (com evidência do Copilot), os resultados dos 5 testes com análise, e as propostas de correção.

**Critérios de avaliação:**
- O pipeline é funcional: ingere, busca e retorna chunks relevantes (não precisa ser perfeito, mas precisa rodar).
- A estratégia de chunking é justificada (não é apenas "512 tokens fixos" sem motivo).
- Os testes usam perguntas realistas do domínio e são comparados com o gabarito do Anexo B.
- Os problemas identificados são reais e as propostas de correção são concretas.
- O participante demonstra entendimento de que RAG é um sistema de engenharia de dados, não apenas chamada de API.
