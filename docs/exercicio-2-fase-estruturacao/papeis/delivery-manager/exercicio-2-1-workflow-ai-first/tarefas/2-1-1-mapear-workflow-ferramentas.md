# Tarefa 2.1.1 — Mapear Workflow com Ferramentas por Papel

## Objetivo

Criar um documento que mostre, para cada papel do time, quais ferramentas de IA usa em qual etapa do ciclo de desenvolvimento (Spec → Plan → Tasks → Implement → Review → Deploy).

## Contexto

O modelo AI First não significa "IA faz tudo". Significa "IA ajuda em cada etapa, mas humano mantém controle". Diferentes papéis usam diferentes ferramentas:

- **Developer:** GitHub Copilot (código), Claude (brainstorm)
- **Tech Lead:** Claude (planejamento), GitHub (reviews), Azure DevOps (tracking)
- **Product Specialist:** Claude Design (mockups), Claude (specs), Cowork (feedback)
- **QA:** Claude (testes), Cowork (test plans)
- **Delivery Manager:** Cowork (colaboração), Azure DevOps (tracking), Claude (planejamento)

## Ferramentas a Utilizar

- **Claude:** Para brainstorm e estruturação

## Inputs

1. A lista de ferramentas disponíveis (ver Contexto da tarefa pai)
2. Os papéis do time: Developer, Tech Lead, Product Specialist, QA, Delivery Manager
3. O fluxo: Spec → Plan → Tasks → Implement → Review → Deploy

## Entregável

Um documento `workflow.md` que mostre uma matriz:

```
| Papel              | Spec | Plan | Tasks | Implement | Review | Deploy |
|------------------|------|------|-------|-----------|--------|--------|
| Product Spec.    | Design+Claude | - | - | - | - | - |
| Tech Lead        | - | Claude | Claude | - | GitHub | - |
| Developer        | - | - | - | Copilot+Claude | - | GitHub |
| QA               | - | - | Claude | - | - | Claude |
| Delivery Manager | Cowork | Cowork | Cowork | - | - | Azure |
```

Mas estruturado em prosa, com:
- Uma linha por papel
- Para cada etapa, descreva qual ferramenta ele usa, por quê, e o que ele produz/entrega
- Identifique pontos onde papéis colaboram (ex: Dev com Tech Lead durante Implement)

## Critérios de Aceite

- [ ] Cada papel tem pelo menos 1 ferramenta atribuída
- [ ] Cada etapa do fluxo tem pelo menos 1 papel responsável
- [ ] As atribuições refletem a realidade (não inventam ferramentas que o time não tem)
- [ ] O documento explica o "por quê" de cada escolha (ex: "Dev usa Copilot porque trabalha em código")
- [ ] Colaborações entre papéis são explícitas (ex: "Tech Lead aprova tasks do Dev")

## Dicas

- Use Claude para brainstorm sobre quais ferramentas fazem sentido em cada etapa
- Considere que alguns papéis podem não participar de todas as etapas
- Pense em "quem cria" vs "quem aprova" vs "quem executa" em cada etapa
- Valide suas atribuições contra os papéis e ferramentas reais do projeto

## Como Começar

1. Abra Claude e descreva o fluxo de desenvolvimento do projeto
2. Peça para Claude mapear quais ferramentas cada papel deveria usar
3. Refine a sugestão baseado na sua experiência
4. Estruture em prosa clara e entregue como `workflow.md`

## Entrega

Coloque o arquivo em: `docs/exercicio-2-fase-estruturacao/papeis/delivery-manager/exercicio-2-1-workflow-ai-first/workflow.md`

**Próxima tarefa:** [2.1.2 — Template de Validation Gates](2-1-2-template-validation-gates.md)
