# Delivery Manager — Exercícios Fase 2 (Estruturação)

## Visão Geral

Três exercícios para estabelecer governança, fluxo de trabalho e padrões de gestão no modelo AI First:

1. **Exercício 2.1** — Definição do Workflow de Desenvolvimento AI First (3 tarefas)
2. **Exercício 2.2** — Governança de Specs no Modelo SDD (3 tarefas)
3. **Exercício 2.3** — Contribuição ao AGENTS.md (1 tarefa)

**Total de tarefas:** 7  
**Tempo estimado:** 10-15 horas  
**Entregáveis:** 10+ documentos estruturados

---

## Estrutura de Diretórios

```
delivery-manager/
├── INDEX.md (este arquivo)
├── exercicios.md (documento original integrado)
│
├── exercicio-2-1-workflow-ai-first/
│   ├── README.md (visão geral do exercício)
│   └── tarefas/
│       ├── 2-1-1-mapear-workflow-ferramentas.md
│       ├── 2-1-2-template-validation-gates.md
│       └── 2-1-3-definir-detalhes-gates.md
│
├── exercicio-2-2-governanca-specs/
│   ├── README.md (visão geral do exercício)
│   └── tarefas/
│       ├── 2-2-1-processo-governanca-specs.md
│       ├── 2-2-2-board-tracking-specs.md
│       └── 2-2-3-change-management.md
│
└── exercicio-2-3-agents-md/
    ├── README.md (visão geral do exercício)
    └── tarefas/
        └── 2-3-1-escrever-project-management-rules.md
```

---

## Como Usar Este Material

### Opção A: Leia de Cima para Baixo (Sequencial)
1. [Exercício 2.1 — Workflow AI First](exercicio-2-1-workflow-ai-first/README.md)
   - Estabelece como o time trabalha com IA
   - Entrega: workflow, checklist de validation gates, detalhes de cada gate

2. [Exercício 2.2 — Governança de Specs](exercicio-2-2-governanca-specs/README.md)
   - Formaliza processo de specs em SDD
   - Entrega: processo de governança, board de tracking, change management

3. [Exercício 2.3 — AGENTS.md](exercicio-2-3-agents-md/README.md)
   - Consolida regras de gestão em formato consumível
   - Entrega: Seção "Project Management Rules" do AGENTS.md

### Opção B: Leia por Tarefa (Paralelo)
Cada tarefa é autossuficiente e tem inputs explícitos. Você pode fazer tarefas de exercícios diferentes em paralelo, desde que respeite dependências:

- Tarefas 2.2.x (Governança) podem ser feitas paralelas com 2.1.x
- Tarefas 2.3.x (AGENTS.md) dependem de Tarefas 2.1 e 2.2

### Opção C: Trabalhe na Sua Ordem
Se preferir, faça as tarefas na ordem que fizer sentido para você, mas finalize na sequência 2.1 → 2.2 → 2.3 para garantir consistência.

---

## Resumo de Cada Exercício

### Exercício 2.1: Definição do Workflow de Desenvolvimento AI First

**Contexto:** No modelo AI First, diferentes papéis usam diferentes ferramentas em diferentes momentos. Você precisa mapear esse fluxo e definir os pontos onde humanos obrigatoriamente revisam e aprovam.

**O Que Você Vai Entregar:**
- Fluxo de trabalho mapeando ferramentas por papel (Copilot, Claude, Cowork, Design)
- Template de checklist de validation gates (Spec → Plan → Tasks → Code → Tests → Deploy)
- Definição detalhada de cada gate (quem aprova, o que verifica, tempo, consequências)

**Tempo:** ~3-4 horas por tarefa (10-12 horas total)

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.1.1](exercicio-2-1-workflow-ai-first/tarefas/2-1-1-mapear-workflow-ferramentas.md) | Como o time trabalha? | `workflow.md` |
| [2.1.2](exercicio-2-1-workflow-ai-first/tarefas/2-1-2-template-validation-gates.md) | Onde humanos controlam? | `validation-gates-template.md` |
| [2.1.3](exercicio-2-1-workflow-ai-first/tarefas/2-1-3-definir-detalhes-gates.md) | Detalhes de cada gate | `gates-detalhado.md` |

### Exercício 2.2: Governança de Specs no Modelo SDD

**Contexto:** Specs em SDD são artefatos vivos que evoluem. Você precisa definir como são criadas, aprovadas, versionadas e o que fazer quando precisam mudar.

**O Que Você Vai Entregar:**
- Processo de governança (quem cria, aprova, onde ficam, como rastrear)
- Board de tracking (Rascunho → Em Revisão → Aprovada → Em Implementação → Validada)
- Plano de change management (o que fazer quando specs mudam)

**Tempo:** ~3-4 horas por tarefa (9-12 horas total)

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.2.1](exercicio-2-2-governanca-specs/tarefas/2-2-1-processo-governanca-specs.md) | Como specs são criadas e aprovadas? | `governanca.md` |
| [2.2.2](exercicio-2-2-governanca-specs/tarefas/2-2-2-board-tracking-specs.md) | Como rastrear specs? | `board-tracking.md` |
| [2.2.3](exercicio-2-2-governanca-specs/tarefas/2-2-3-change-management.md) | O que fazer quando specs mudam? | `change-management.md` |

### Exercício 2.3: Contribuição ao AGENTS.md

**Contexto:** Tech Lead está consolidando AGENTS.md. Sua contribuição é a seção de "Project Management Rules" que define como agentes devem criar tasks, documentação e artefatos de gestão.

**O Que Você Vai Entregar:**
- Seção "Project Management Rules" do AGENTS.md
- Machine-readable rules para nomenclatura, documentation, validation gates, comunicação

**Tempo:** ~2-3 horas

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.3.1](exercicio-2-3-agents-md/tarefas/2-3-1-escrever-project-management-rules.md) | Como documenta regras de gestão? | Seção AGENTS.md |

---

## Dependências Entre Tarefas

```
Exercício 2.1
├── 2.1.1 (Workflow & Ferramentas)
│   ├── INPUT: Ferramenta disponíveis (Copilot, Claude, Cowork, Design)
│   └── OUTPUT: workflow.md
│
├── 2.1.2 (Validation Gates Template) ← DEPENDE DE 2.1.1
│   ├── INPUT: workflow.md + Cowork
│   └── OUTPUT: validation-gates-template.md
│
└── 2.1.3 (Detalhes de Gates) ← DEPENDE DE 2.1.2
    ├── INPUT: validation-gates-template.md
    └── OUTPUT: gates-detalhado.md

Exercício 2.2
├── 2.2.1 (Processo de Governança)
│   ├── INPUT: Estrutura de repositório + Fluxo SDD
│   └── OUTPUT: governanca.md
│
├── 2.2.2 (Board de Tracking) ← DEPENDE DE 2.2.1
│   ├── INPUT: governanca.md + Cowork
│   └── OUTPUT: board-tracking.md
│
└── 2.2.3 (Change Management) ← DEPENDE DE 2.2.1
    ├── INPUT: governanca.md + 5 módulos do projeto
    └── OUTPUT: change-management.md

Exercício 2.3
└── 2.3.1 (Project Management Rules) ← DEPENDE DE 2.1 e 2.2
    ├── INPUT: workflow.md + gates-detalhado.md + governanca.md
    └── OUTPUT: project-management-rules.md (para AGENTS.md)
```

---

## Checklist de Completude

Ao finalizar cada exercício:

### Exercício 2.1
- [ ] `workflow.md` — Mapa claro de ferramentas por papel e fase
- [ ] `validation-gates-template.md` — Template de checklist com 4+ gates
- [ ] `gates-detalhado.md` — Cada gate com: quem aprova, critérios, tempo, consequências

### Exercício 2.2
- [ ] `governanca.md` — Processo claro: criação, aprovação, versionamento, rastreamento
- [ ] `board-tracking.md` — Board funcional com 5 módulos e 5 status
- [ ] `change-management.md` — Processo explícito de quando/como specs mudam

### Exercício 2.3
- [ ] `project-management-rules.md` — Seção formatada para AGENTS.md
  - Regras de nomenclatura de tasks e issues
  - Regras de documentação de decisões (ADR)
  - Definição de validation gates em formato machine-readable
  - Restrições de comunicação (idiomas, formatos)

---

## Próximos Passos

Após completar os 3 exercícios, você estará pronto para:
1. **Tech Lead (Fase 2):** Usar estes documentos para consolidar AGENTS.md
2. **Developer & QA (Fase 2):** Usar validation gates e governança para trabalhar dentro do framework
3. **Produto:** Usar board de tracking para manter specs vivas durante implementação

---

## Perguntas Frequentes

**P: Preciso fazer todas as 7 tarefas na ordem?**  
R: Não. Respeite as dependências (2.1 antes de 2.3, 2.2 antes de 2.3), mas você pode paralelizar tarefas dentro do mesmo exercício.

**P: Quanto tempo cada tarefa leva?**  
R: 2-5 horas, dependendo da profundidade. Veja estimativas no resumo acima.

**P: Posso usar IA (Claude, Cowork) para ajudar?**  
R: Sim! Use Claude para brainstorm e estruturar. Use Cowork para criar templates interativos. O exercício é aprender a pensar como Delivery Manager, não digitar.

**P: Os documentos precisam ser "perfeitos"?**  
R: Não. Precisam ser **executáveis** (alguém consegue seguir as regras) e **consistentes** (sem contradições).

**P: Como Cowork encaixa no exercício?**  
R: Cowork é para criar artefatos *colaborativos* — checklists que o time preenche, boards que evoluem, templates que múltiplas pessoas usam. Não é para documentação estática.

---

## Referência Rápida

| Documento | Tipo | Tamanho Estimado | Público |
|-----------|------|------------------|---------|
| workflow.md | Spec | 2-3 pág | Todo time |
| validation-gates-template.md | Template | 2-3 pág | Todo time |
| gates-detalhado.md | Spec | 3-4 pág | Tech Lead, Dev, QA |
| governanca.md | Spec | 3-4 pág | Todo time |
| board-tracking.md | Cowork | 1-2 pág | Produto, Delivery Manager |
| change-management.md | Spec | 2-3 pág | Todo time |
| project-management-rules.md (AGENTS.md) | Spec | 2-3 pág | Devs, Agents, QA |

---

Boa sorte! 🚀
