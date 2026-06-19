# Exercício 3.2 — Harness de produto para melhoria contínua

**Papel:** Product Specialist  
**Tópico:** Harness Engineering  
**Cenário:** [Contexto compartilhado](../cenario-3-contexto.md)

---

## Contexto

O assistente vai evoluir após o go-live. Você define, do ponto de vista de produto, como garantir que ele melhore sem degradar.

---

## Ferramentas a utilizar

- **Claude** (chat)

---

## Inputs fornecidos

O cenário completo (acima).

O conceito de harness de produto: *"Define quais métricas de qualidade são monitoradas, como o feedback de usuários é processado, e como mudanças no assistente são validadas antes de ir a produção (regression testing de produto)."*

Os guardrails formalizados no cenário 2 (DEVE / NÃO DEVE / QUANDO EM DÚVIDA), que o harness deve preservar ao longo da evolução.

---

## Tarefa

Usando o **Claude**, projete um harness de produto que cubra:

### 1. Processo de feedback

Como o feedback do atendente vira melhoria:
- Novo documento?
- Ajuste de prompt?
- Reindexação?

### 2. Regression testing de produto

Antes de mudar o prompt ou adicionar documentos:
- Como verificar que as respostas existentes não pioraram?
- Como garantir que os guardrails do cenário 2 continuam sendo respeitados?

### 3. Ponto de human-in-the-loop

- Quais mudanças no assistente exigem aprovação humana antes de ir a produção?
- Quem aprova?

---

## Entregável

O documento do harness de produto.

---

## Critérios de avaliação

- [ ] O processo de feedback é completo (do atendente até a melhoria efetiva)
- [ ] O regression testing reconhece que mudanças em IA podem ter efeitos colaterais e verifica que os guardrails não regridem
- [ ] O ponto de HITL é concreto (define o que precisa de aprovação humana e quem aprova)
