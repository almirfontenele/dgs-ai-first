# Exercício 2.2 — Implementação de Spec com Spec Driven Development

## Contexto

O Product Specialist escreveu o `requirements.md` do query endpoint. O Tech Lead converteu em `plan.md`. Agora você precisa converter o plan em `tasks.md` e implementar a primeira task. Lembre-se de que na fase anterior você construiu um protótipo de RAG com ferramentas open-source — agora o código é de produção, com Azure e padrões do projeto.

## Ferramentas a Utilizar

- Claude (chat)
- GitHub Copilot

## Inputs Fornecidos

### Contexto Base
- O cenário completo (NovaTech Logistics Assistant)
- A estrutura do repositório (ver **Anexo C**)
- O `plan.md` simulado (ver seção "Plan — Query Endpoint" na tarefa 2.2.1)
- Padrões do projeto:
  - TypeScript com Azure Functions v4
  - Zod para validação de input/output
  - Retry com exponential backoff
  - Structured logging com pino

### Concept: Spec Driven Development
Spec Driven Development (SDD) é uma metodologia onde a spec (plan) vem *antes* da implementação, e as tarefas são derivadas da spec de forma estruturada.

## Tarefas

Cada tarefa está documentada em sua pasta correspondente:

1. **[Tarefa 2.2.1](tarefas/2-2-1-converter-plan-tasks.md)** — Converter `plan.md` em `tasks.md` com Claude
2. **[Tarefa 2.2.2](tarefas/2-2-2-implementar-primeira-task.md)** — Implementar primeira task com GitHub Copilot
3. **[Tarefa 2.2.3](tarefas/2-2-3-revisar-criticamente-codigo.md)** — Revisar criticamente o código gerado

## Entregáveis

Ao final do exercício, você terá:
- [ ] `tasks.md` com tarefas atômicas, critérios de aceite, dependências e estimativas
- [ ] Código implementado da primeira task (endpoint + validação)
- [ ] Revisão crítica documentada com ajustes propostos

## Critérios de Avaliação

- ✓ As tasks são realmente atômicas (cada uma pode ser implementada e testada independentemente)
- ✓ Os critérios de aceite são verificáveis (não são vagos como "funcionar corretamente")
- ✓ O código gerado pelo Copilot é funcional e segue os padrões do plan
- ✓ A revisão crítica identifica problemas reais (não inventa problemas para cumprir a tarefa)
