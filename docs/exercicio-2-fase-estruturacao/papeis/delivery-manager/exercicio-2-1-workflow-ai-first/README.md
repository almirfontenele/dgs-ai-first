# Exercício 2.1 — Definição do Workflow de Desenvolvimento AI First

## Contexto

No modelo AI First, IA ajuda em várias etapas (geração de specs, planos, tasks, código, testes), mas humanos precisam manter controle. Você precisa mapear:

1. **Quem faz o quê com qual ferramenta?** (Copilot para devs, Claude para planejamento, Cowork para gestão, Design para produto)
2. **Onde humanos obrigatoriamente revisam?** (Validation gates)
3. **Como cada gate funciona?** (Quem aprova, critérios, tempo, consequências)

## Ferramentas a Utilizar

- Claude (chat)
- Claude Cowork (para templates colaborativos)

## Inputs Fornecidos

### Contexto Base
- O cenário completo
- Lista de ferramentas disponíveis:
  - GitHub Copilot (ativo para devs e Tech Lead)
  - Claude (disponível para todo time)
  - Claude Cowork (disponível para papéis não-dev)
  - Claude Design (disponível para Product Specialist)
  - Azure DevOps (para boards e tracking)
  - GitHub (para repositório e CI/CD)

### Fluxo de Desenvolvimento
- Spec → Plan → Tasks → Implement → Review → Deploy
- Cada etapa pode ter suporte de IA, mas precisa de validação humana

## Tarefas

Cada tarefa está documentada em sua pasta correspondente:

1. **[Tarefa 2.1.1](tarefas/2-1-1-mapear-workflow-ferramentas.md)** — Mapear workflow com ferramentas por papel
2. **[Tarefa 2.1.2](tarefas/2-1-2-template-validation-gates.md)** — Criar template de validation gates com Cowork
3. **[Tarefa 2.1.3](tarefas/2-1-3-definir-detalhes-gates.md)** — Definir detalhes de cada gate

## Entregáveis

Ao final do exercício, você terá:
- [ ] Fluxo de trabalho mapeando ferramentas por papel e fase
- [ ] Template de checklist de validation gates (4+ gates: Spec→Plan, Tasks→Implement, Code→Merge, Tests→Deploy)
- [ ] Documento detalhado: para cada gate, defina quem aprova, o que verifica, quanto tempo tem, e consequências de rejeição

## Critérios de Avaliação

- ✓ O workflow reconhece que diferentes papéis usam diferentes ferramentas
- ✓ Os validation gates são específicos o suficiente para serem executáveis
- ✓ Cada gate tem critérios concretos de aprovação (não genéricos como "revisar")
- ✓ O fluxo equilibra velocidade (IA gera) com segurança (humano valida)
- ✓ Os templates de Cowork são colaborativos (time consegue preencher/atualizar)
