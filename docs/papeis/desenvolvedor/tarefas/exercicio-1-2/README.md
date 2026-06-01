# Exercício 1.2 — Prototipação de Prompt com Engenharia de Contexto

**Objetivo:** Prototipar o system prompt do assistente de suporte NovaTech e testar iterativamente, considerando como o contexto estático e dinâmico afeta o comportamento.

**Tempo estimado:** 3-4 horas (especialmente o teste com Claude)

**Ferramentas:** Claude (chat), editor de texto

---

## 📋 Tarefas Sequenciais

Siga as tarefas nesta ordem. Cada uma depende da anterior.

### 1. [Escrita do System Prompt v1](./tarefa-01-system-prompt-v1.md)
**Objetivo:** Escrever um system prompt completo e específico que incorpore todos os guardrails da NovaTech.

**Guardrails Obrigatórios:**
- Sempre citar a fonte do documento
- Nunca inventar prazos ou valores
- Escalação clara quando não souber
- Ton formal mas acessível

**Saída esperada:** System prompt v1 bem estruturado em 5 seções.

**Conceitos:** Prompt engineering, guardrails, identidade do assistente

---

### 2. [Mapeamento de Contexto Estático/Dinâmico](./tarefa-02-mapeamento-contexto.md)
**Objetivo:** Entender quais partes do contexto mudam por query e quais são sempre iguais.

**Saída esperada:** Análise de tamanho em tokens + orçamento + trade-offs.

**Conceitos:** Context engineering, token budget, trade-offs de design

---

### 3. [Teste com Perguntas Reais](./tarefa-03-teste-perguntas.md)
**Objetivo:** Testar o prompt v1 no Claude de verdade com 3 perguntas específicas.

**As 3 Perguntas:**
1. Qual o prazo de devolução para carga perigosa?
2. Meu cliente é Gold, qual o SLA de resolução?
3. Quanto custa o frete para 600kg para Manaus?

**Saída esperada:** Respostas do Claude capturadas integralmente.

**Conceitos:** Teste experimental, rastreabilidade

---

### 4. [Análise Crítica das Respostas](./tarefa-04-analise-critica.md)
**Objetivo:** Analisar cada resposta linha-a-linha identificando acertos, erros e root causes.

**Saída esperada:** Análise detalhada com score (0-10) por pergunta.

**Conceitos:** Pensamento crítico, debug de prompts, avaliação

---

### 5. [Iteração e System Prompt v2](./tarefa-05-iteracao-v2.md)
**Objetivo:** Reescrever o prompt baseado no feedback e testar novamente.

**Saída esperada:** 
- System prompt v2 com mudanças documentadas
- Teste v2 com as mesmas 3 perguntas
- Comparação v1 vs v2 com scores

**Conceitos:** Iteração, melhoria contínua, documentação de processo

---

## 🎯 Critérios de Avaliação do Exercício

Seu trabalho será avaliado em:

- ✅ **Especificidade do Prompt:** O system prompt é específico e vinculado ao contexto NovaTech? (Não é "você é um assistente útil")

- ✅ **Compreensão de Contexto:** O mapeamento estático/dinâmico demonstra entendimento real de engenharia de contexto?

- ✅ **Teste Experimental:** Você realmente testou no Claude? As respostas são capturadas integralmente (não resumidas)?

- ✅ **Pensamento Crítico:** A análise demonstra capacidade de identificar erros e entender *por que* acontecem?

- ✅ **Iteração Produtiva:** A mudança de v1 → v2 melhorou o prompt de forma verificável?

- ✅ **Documentação:** Cada etapa está documentada de forma que alguém pudesse replicar o experimento?

---

## 💡 Conceitos-Chave

### System Prompt
Instruções que definem identidade, comportamento e restrições do assistente. Aparecem em toda interação.

### Guardrails
Regras ou restrições que o assistente deve seguir (ex: "nunca invente dados").

### Contexto Estático vs Dinâmico
- **Estático:** System prompt, instruções (aparecem sempre)
- **Dinâmico:** Chunks, histórico, dados do cliente (mudam por query)

### Context Engineering
Arte de organizar e priorizar as partes do contexto para otimizar resposta e economizar tokens.

### Lost in the Middle
LLMs tendem a esquecer informações no meio de contextos longos. Primeira e última posição são mais memoráveis.

---

## 🧪 O Experimento: Teste com 3 Perguntas

### Por que essas 3 perguntas?

**Pergunta 1 (Carga Perigosa):** Testa se o assistente responde corretamente quando há uma *exceção* na documentação. Errar aqui = não compreendeu as nuances da POL-001.

**Pergunta 2 (SLA Gold):** Testa se o assistente consegue extrair informação específica de uma tabela. Exigence *lookup exato* de um valor.

**Pergunta 3 (Frete Manaus):** Testa se o assistente consegue aplicar informação (multiplicador regional) sem inventar dados (valor base não está documentado).

Juntas, cobrem: exceções, lookup, aplicação, e guardrail de integridade de dados.

---

## 🚀 Como Começar

1. Leia [tarefa-01-system-prompt-v1.md](./tarefa-01-system-prompt-v1.md)
2. Abra seu editor favorito e comece a escrever o prompt
3. Use Claude (chat.anthropic.com) para testar
4. Siga as tarefas sequencialmente
5. Documente TUDO (prompts, testes, análises, mudanças)

---

## 📚 Referências e Contexto

**Cenário:** Assistente de Suporte NovaTech
- Clientes: Gold, Silver, Standard (cada um com SLA diferente)
- Documentação: Políticas (devolução), Tabelas (SLA), Procedimentos (frete)
- Objetivo: Responder perguntas precisas sobre operações, prazos, valores

**Desafio Principal:** O assistente precisa ser preciso (nunca inventar), mas útil (sempre fornecer resposta com base no que sabe). Balancear integridade com utilidade.

---

## ❓ Dúvidas?

Se ficar preso:
1. Releia a tarefa e sua seção "Dicas"
2. Consulte o conceito correspondente acima
3. Teste diferentes abordagens com Claude
4. Use Claude para fazer perguntas e aprofundar o entendimento

---

## 📊 Template de Progresso

**Status:** [Escolha um]
- 🟡 Não iniciado
- 🔵 Em progresso (qual tarefa?)
- 🟢 Completo

| Tarefa | Status | Score |
|--------|--------|-------|
| 1.2.1 System Prompt v1 | ⬜ | - |
| 1.2.2 Mapeamento Contexto | ⬜ | - |
| 1.2.3 Teste com Perguntas | ⬜ | - |
| 1.2.4 Análise Crítica | ⬜ | - |
| 1.2.5 Iteração v2 | ⬜ | - |

*Atualize conforme progride.*

---

## 🎁 Bônus: Se Quiser Iterar Mais

Após completar v2, você pode:
- Tentar uma **v3** com mais refinamentos
- Adicionar mais perguntas de teste (5-10)
- Testar com diferentes "personagens" (cliente Gold vs Standard)
- Medir impacto de reordenar chunks no contexto
- Testar com chunks de tamanhos variados

Mas v1 → v2 já é suficiente para o exercício base.
