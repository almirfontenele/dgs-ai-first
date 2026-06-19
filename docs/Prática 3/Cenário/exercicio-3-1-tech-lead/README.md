# Exercício 3.1 — Design do harness do projeto

**Papel:** Tech Lead  
**Tópico:** Harness Engineering  
**Cenário:** [Contexto compartilhado](../cenario-3-contexto.md)

---

## Contexto

Você precisa projetar o harness que envolve o assistente — o que diferencia um protótipo de um sistema de produção.

---

## Ferramentas a utilizar

- **Claude** (chat)
- **GitHub Copilot**

---

## Inputs fornecidos

O cenário completo (acima).

O framework de 5 camadas do harness:

1. **Tool orchestration** — coordenação de ingestão, retrieval e geração.
2. **Verification loops** — verificação de outputs (fonte válida? schema do structured output respeitado?).
3. **Context & memory** — manutenção de contexto, respeitando o context budget da ADR-0002 (cenário 1).
4. **Guardrails** — limites via structured outputs + código (determinísticos) e via prompt (probabilísticos), com pontos de human-in-the-loop.
5. **Observability** — logs, métricas, alertas.

---

## Tarefa

### 1. Projete o harness pelas 5 camadas (Claude)

Usando o **Claude**, projete o harness pelas 5 camadas.

Para cada uma, diga:
- O que já está implementado
- O que falta
- Como fechar o gap (seja concreto)

**Pontos especiais:**
- Na camada de **Context & memory**, conecte ao context budget da ADR-0002
- Na de **Guardrails**, indique onde structured outputs e human-in-the-loop entram

### 2. Implemente uma verificação (GitHub Copilot)

Usando o **GitHub Copilot**, implemente **uma** verificação simples da camada de **Verification loops**:

Uma função que recebe a resposta do modelo e verifica se a fonte citada (`source_document`) existe na lista de documentos válidos da NovaTech.

**Detalhes:**
- A lista usa os identificadores curtos dos documentos: `POL-001`, `PROC-042`, `PROC-042-v2`, `SLA-2024`, `FAQ-Atendimento`
- Não o título completo
- Se a fonte citada não estiver na lista, marca a resposta como suspeita

---

## Entregável

- O design do harness (5 camadas)
- A função de verificação implementada

---

## Critérios de avaliação

- [ ] O harness cobre as 5 camadas (não apenas guardrails)
- [ ] A camada Context & memory conecta-se à ADR-0002 (não reinventa a estratégia de contexto)
- [ ] A camada Guardrails menciona structured outputs e ao menos um ponto de HITL
- [ ] A função de verificação é funcional e checa a fonte contra a lista de documentos válidos
