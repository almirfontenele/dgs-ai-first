# Exercício 1.1 — Análise de Viabilidade Técnica com RAG

**Objetivo:** Avaliar a viabilidade técnica de um assistente RAG para a NovaTech, considerando características específicas da documentação e conceitos de context engineering.

**Tempo estimado:** 2-3 horas (dependendo da profundidade)

**Ferramentas:** Claude (chat), editor de texto

---

## 📋 Tarefas Sequenciais

Siga as tarefas nesta ordem. Cada uma prepara o contexto para a próxima.

### 1. [Análise de Desafios por Tipo de Fonte](./tarefa-01-analise-desafios-tipos-fonte.md)
**Objetivo:** Identificar os desafios específicos de cada tipo de fonte de dados (PDFs com tabelas, PDFs escaneados, Wiki, Planilhas) para o pipeline de RAG.

**Saída esperada:** Documento estruturado com desafios, impactos e estratégias por tipo.

**Conceitos:** RAG pipeline, extração de dados, chunking, qualidade de retrieval

---

### 2. [Estimativa de Tamanho da Base em Tokens](./tarefa-02-estimativa-tokens.md)
**Objetivo:** Calcular quantos tokens representa a base completa de dados da NovaTech (PDFs, Wiki, Planilhas).

**Saída esperada:** Cálculo detalhado com distribuição por tipo de fonte.

**Conceitos:** Tokens, taxa de compressão de palavras, tamanho de índices

---

### 3. [Análise de Orçamento de Contexto](./tarefa-03-orcamento-contexto.md)
**Objetivo:** Entender como a context window do GPT-4o é alocada e quantos chunks cabem em cada query.

**Saída esperada:** Análise de trade-offs entre quantidade e tamanho de chunks.

**Conceitos:** Context window, orçamento de atenção, lost in the middle effect

---

### 4. [Estratégia de Chunking Justificada](./tarefa-04-estrategia-chunking.md)
**Objetivo:** Definir como chunkar a documentação considerando tipos de pergunta que usuários fazem e o efeito "lost in the middle".

**Saída esperada:** Estratégia de chunking diferenciada por tipo de pergunta.

**Conceitos:** Unidades semânticas, positioning bias em LLMs

---

### 5. [Síntese e Revisão com Claude](./tarefa-05-revisao-claude.md)
**Objetivo:** Consolidar toda a análise e iterar com Claude para melhorar a qualidade.

**Saída esperada:** 
- Análise técnica inicial
- Análise técnica final (após feedback)
- Histórico documentado de iteração

**Conceitos:** Pensamento crítico, iteração baseada em feedback

---

## 🎯 Critérios de Avaliação do Exercício

Seu trabalho será avaliado em:

- ✅ **Compreensão de RAG:** A análise demonstra entendimento profundo de que diferentes tipos de conteúdo exigem diferentes estratégias de extração e chunking?

- ✅ **Estimativa de Tokens:** O cálculo é razoável e mostra compreensão prática do conceito de tokens?

- ✅ **Context Awareness:** A análise de orçamento de contexto demonstra que context window é um recurso *limitado* que precisa ser gerenciado (não é "quanto maior melhor")?

- ✅ **Design Justificado:** A estratégia de chunking é justificada pelo tipo de pergunta e considera explicitamente o efeito *lost in the middle*?

- ✅ **Iteração Qualitativa:** As iterações com Claude melhoraram o documento de forma verificável?

---

## 💡 Conceitos-Chave para Este Exercício

### RAG (Retrieval-Augmented Generation)
Pipeline que recupera documentos relevantes e passa ao LLM junto com a pergunta do usuário.

### Context Engineering
A arte de gerenciar o contexto que o LLM recebe: quais informações, quanto espaço ocupam, em que ordem aparecem.

### Lost in the Middle
LLMs tendem a "esquecer" informações no meio de contextos longos. Primeiras e últimas posições são mais memoráveis.

### Token Budget
A context window (ex: 128K tokens no GPT-4o) é um recurso compartilhado entre: system prompt, query, contexto recuperado, e espaço para resposta.

---

## 🚀 Como Começar

1. Leia [tarefa-01-analise-desafios-tipos-fonte.md](./tarefa-01-analise-desafios-tipos-fonte.md)
2. Abra Claude (chat.anthropic.com) ou integração no seu IDE
3. Siga as instruções de cada tarefa sequencialmente
4. Use o output de uma tarefa como input para a próxima

---

## 📚 Referências e Contexto

**Cenário:** Assistente AI para logística (NovaTech)
- Documentação: PDFs de SharePoint, Wiki do Confluence, Planilhas
- LLM: GPT-4o (128K context window)
- Objetivo: Responder perguntas sobre operações, taxas, prazos, processos

**Desafio Principal:** A documentação é heterogênea (tabelas, imagens, links, fórmulas) e a quantidade é grande. Precisa-se de uma estratégia de RAG que seja eficiente e mantendo qualidade.

---

## ❓ Dúvidas?

Se ficar preso em alguma tarefa:
1. Releia a tarefa e seus "Dicas"
2. Consulte o conceito correspondente acima
3. Use Claude para fazer perguntas e aprofundar
4. Volte ao doc de entrada ([exercicio-1-1-analise-viabilidade-tecnica.md](../exercicio-1-1-analise-viabilidade-tecnica.md))

---

**Status:** [Escolha um]
- 🟡 Não iniciado
- 🔵 Em progresso (qual tarefa?)
- 🟢 Completo

*Atualize conforme progride.*
