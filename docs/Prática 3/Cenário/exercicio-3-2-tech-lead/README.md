# Exercício 3.2 — Revisão crítica da arquitetura gerada com IA

**Papel:** Tech Lead  
**Tópico:** Revisão Crítica de Outputs de IA  
**Cenário:** [Contexto compartilhado](../cenario-3-contexto.md)

---

## Contexto

Vários artefatos do projeto foram gerados com apoio de IA. Antes do go-live, você faz uma revisão de riscos.

---

## Ferramentas a utilizar

- **Claude** (chat)

---

## Inputs fornecidos

O cenário completo (acima).

Resumo dos artefatos gerados com IA:

- *"O AGENTS.md foi gerado pelo Claude e refinado 4 vezes. A última versão tem 15 páginas."*
- *"3 skills foram criadas. A Foundation foi refinada após testes; as outras duas foram usadas sem refinamento."*
- *"O pipeline de ingestão e o query endpoint foram ~60-70% gerados pelo Copilot."*
- *"O system prompt foi iterado 6 vezes, sem documentar por que cada mudança foi feita."*

---

## Tarefa

### 1. Sua própria avaliação de riscos

Faça sua própria avaliação de riscos ANTES de usar o Claude.

Para cada artefato:
- Qual o risco de ter sido gerado por IA?
- O que verificar antes do go-live?

### 2. Avaliação do Claude

Use o **Claude** como co-reviewer e compare as listas.

### 3. Priorização

Dado que você tem 2 semanas, priorize:
- O que verifica primeiro?
- O que aceita como risco residual?

---

## Entregável

- Sua avaliação
- A complementação do Claude
- A priorização

---

## Critérios de avaliação

- [ ] Identifica que as 2 skills sem refinamento são um risco (podem gerar outputs inconsistentes)
- [ ] Identifica que o system prompt sem documentação de mudanças é risco de governança (sem rollback informado)
- [ ] A priorização é pragmática (foca no que reduz mais risco no tempo disponível)
- [ ] A comparação humano vs Claude é honesta
