# Exercício 3.1 — Critérios de go-live com harness de governança

**Papel:** Delivery Manager  
**Tópico:** Harness Engineering  
**Cenário:** [Contexto compartilhado](../cenario-3-contexto.md)

---

## Contexto

A demo para a diretoria da NovaTech é em 2 semanas. Você precisa definir o que precisa estar funcionando para que o go-live seja autorizado.

---

## Ferramentas a utilizar

- **Claude** (chat)
- **Claude Cowork**

---

## Inputs fornecidos

O cenário completo (acima).

O framework de harness (5 camadas):
1. **Tool orchestration** — coordenação de ferramentas e agentes.
2. **Verification loops** — verificação automática de outputs.
3. **Context & memory** — manutenção de contexto entre interações.
4. **Guardrails** — limites que o sistema não pode ultrapassar, incluindo pontos de human-in-the-loop.
5. **Observability** — visibilidade do que acontece em produção.

---

## Tarefa

### 1. Defina critérios de go-live (Claude)

Usando o **Claude**, defina critérios de go-live organizados pelas 5 camadas do harness.

Para cada camada, especifique:
- O que precisa estar pronto
- Classifique cada critério como **bloqueante** (sem isso não vai ao ar) ou **desejável** (pode ir ao ar sem)
- Inclua ao menos um ponto de human-in-the-loop (ex: respostas de baixa confiança sobre carga perigosa passam por revisão humana antes de chegar ao atendente)

### 2. Crie um dashboard de readiness (Claude Cowork)

Usando o **Claude Cowork**, crie um dashboard de readiness do go-live mostrando:
- Status de cada critério (verde/amarelo/vermelho)
- Responsável
- Data-alvo

### 3. Defina um plano de rollback

Defina um plano de rollback simples:
- Qual o sinal de que algo deu errado
- Quem decide desligar
- Qual a ação

---

## Entregável

- Os critérios de go-live (organizados pelas 5 camadas)
- O dashboard do Cowork
- O plano de rollback

---

## Critérios de avaliação

- [ ] Os critérios são organizados pelas 5 camadas do harness (não é lista genérica)
- [ ] A distinção bloqueante vs desejável demonstra pragmatismo
- [ ] Há ao menos um ponto de HITL concreto
- [ ] O plano de rollback tem trigger, responsável e ação (não é "avaliar a situação")
