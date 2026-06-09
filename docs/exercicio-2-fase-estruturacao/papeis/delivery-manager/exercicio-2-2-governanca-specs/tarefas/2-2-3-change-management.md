# Tarefa 2.2.3 — Definir Processo de Change Management de Specs

## Objetivo

Definir explicitamente o que acontece quando uma spec precisa mudar depois de já estar em implementação. Sem isso, mudanças criam caos: Dev implementa algo que muda no meio, QA testa contra versão antiga, etc.

## Contexto

Realidade: specs SEMPRE mudam durante implementação. Descoberta de edge cases, prioridades que mudam, feedback de usuários. A questão não é "como evitar mudanças" (impossível), mas "como gerenciar mudanças sem quebrar tudo".

**Cenários comuns:**
- Dev está implementando e descobre que spec é ambígua
- Product descobre que cliente quer feature que não está na spec
- QA está testando e descobre que spec manda fazer coisa impossível
- Tech Lead acha que escopo ficou grande demais durante implementação

## Ferramentas a Utilizar

- **Claude:** Para brainstorm sobre processos

## Inputs

1. O documento `governanca.md` da tarefa anterior
2. O documento `board-tracking.md` da tarefa anterior
3. Os validation gates do Exercício 2.1
4. Os 5 módulos (ingestão, busca, feedback, Teams, web)

## Entregável

Um documento `change-management.md` que defina:

### 1. Classificação de Mudanças

Não todas as mudanças são iguais. Defina categorias:

**Clarificação** (reinterpretação do que foi escrito)
- Exemplo: "A spec diz 'resposta rápida' — significa < 2s ou < 5s?"
- Impacto: Baixo (ninguém implementou ainda com interpretação errada)
- Processo: Dev ou QA pergunta ao author via comentário. Author responde em 24h. Atualiza spec. Pronto.

**Bug na Spec** (erro óbvio ou contradição)
- Exemplo: "API deve retornar resposta em < 100ms" mas requisitos falam de chamar LLM (impossível)
- Impacto: Médio (quebra implementação ou testes)
- Processo: Quem descobriu escala. Tech Lead + Product Specialist decidem qual é o requerimento real. Atualiza spec. Notifica Dev/QA. Eles ajustam se necessário.

**Mudança de Escopo** (adicionar/remover feature ou requisito)
- Exemplo: "Agora também precisa suportar 10 idiomas" (não estava na spec original)
- Impacto: Alto (afeta plano, timeline, design)
- Processo: Product Specialist e Tech Lead decidem: incluir nesta versão ou próxima? Se incluir, vai mudar deadline/esforço. Cria uma issue de change request. Aprovada por manager. Atualiza spec com nova versão (v1.0 → v1.1 ou v2.0). Notifica todo time.

**Mudança de Prioridade** (reprioritizar entre requirements já existentes)
- Exemplo: "Priorizar relatório de feedback sobre dashboard de métricas"
- Impacto: Médio a Alto (afeta sequência de tarefas)
- Processo: Product Specialist inicia. Tech Lead aprova se timeline é ok. Atualiza spec se ordem muda. Notifica Dev e QA.

### 2. Processo para Cada Tipo

Para cada tipo de mudança, defina:

**Quem pode iniciar a mudança?**
- Clarificação: Dev, QA, Tech Lead
- Bug: Dev, QA, Tech Lead
- Escopo: Product Specialist (com aprovação de Tech Lead)
- Prioridade: Product Specialist (com aprovação de Tech Lead)

**Quem precisa aprovar?**
- Clarificação: Author original (Product Specialist / Tech Lead)
- Bug: Tech Lead + Product Specialist
- Escopo: Tech Lead + Delivery Manager (impacto em timeline)
- Prioridade: Tech Lead + Delivery Manager

**Como é documentado?**
- Clarificação: Comentário no GitHub issue + update na spec
- Bug: GitHub issue + change log + update na spec
- Escopo: GitHub issue + change management form + CHANGELOG + spec v[nova]
- Prioridade: Spec updated + notification + CHANGELOG

**Impacto em tarefas já iniciadas?**
- Clarificação: Dev pode reinterpretar; notificar que interpretação mudou
- Bug: Dev ajusta o que tá feito; possível rework
- Escopo: Dev pode suspender task atual (não é mais válida); ou dividir (faz a parte ainda válida)
- Prioridade: Mudança na ordem de execução (prioritize ou deprioritize)

**Impacto em testes?**
- Clarificação: QA pode expandir testes (nova interpretação quer mais cenários)
- Bug: QA ajusta testes que falhavam
- Escopo: QA adiciona testes novos
- Prioridade: QA adapta ordem de testes

### 3. Fluxo Visual

Crie um fluxo que mostre:
```
Mudança solicitada
    ↓
[Tipo?] → Clarificação / Bug / Escopo / Prioridade
    ↓
[Aprovação?] → (caminho diferente por tipo)
    ↓
[Documentação] → Update spec + CHANGELOG + notificação
    ↓
[Comunicação] → Dev, QA, Tech Lead notificados
    ↓
[Execução] → Ajustar código, testes, plano conforme necessário
```

### 4. Template de Change Request

Para mudanças mais formais (escopo, prioridade), crie um template:

```markdown
## Change Request: [Nome]

**Tipo:** Clarificação / Bug / Escopo / Prioridade

**Descrição:**
O que mudou e por quê?

**Impacto Estimado:**
- Esforço adicional: [X horas/dias]
- Afeta specs: [qual módulo]
- Afeta timeline: [sim/não, quanto?]

**Propostas:**
1. [Opção A - fazer de um jeito]
2. [Opção B - fazer de outro jeito]

**Aprovação:**
- Tech Lead: [ ] Aprovado
- Product Specialist: [ ] Aprovado
- Delivery Manager: [ ] Aprovado (se impacto em timeline)

**Versão Nova:**
- v1.0 → v1.1 (ou v2.0?)
- Data de aplicação: [quando entra em vigor]
```

### 5. Exemplo Prático

Documente pelo menos 1 exemplo real ou simulado de cada tipo:
- Clarificação no módulo X
- Bug descoberto durante Y
- Escopo adicionado em Z
- Prioridade mudada entre A e B

## Critérios de Aceite

- [ ] 4 tipos de mudanças identificados e definidos
- [ ] Para cada tipo: quem pode iniciar, quem aprova, como documenta, impacto em tasks/testes
- [ ] Fluxo visual ou pseudocódigo que mostra o processo
- [ ] Template de change request (para mudanças formais)
- [ ] Pelo menos 1 exemplo real ou simulado de cada tipo
- [ ] Documento menciona ferramentas específicas (GitHub issues, CHANGELOG, etc)

## Dicas

- Pense em "o que pode dar errado" se mudança não é gerenciada (Dev implementa coisa errada, QA testa outra coisa, deploy quebra)
- Use Claude para brainstorm sobre casos extremos (urgência, conflito entre quem quer o quê, etc)
- Não torne o processo tão burocrático que ninguém o segue
- Valide contra a realidade: quanto tempo pode Dev esperar por aprovação antes de virar problema?

## Como Começar

1. Use Claude para listar tipos de mudanças comuns
2. Para cada tipo, defina o processo completo
3. Crie um fluxo visual que resume tudo
4. Documente em prosa clara

## Entrega

Coloque o arquivo em: `docs/exercicio-2-fase-estruturacao/papeis/delivery-manager/exercicio-2-2-governanca-specs/change-management.md`

**Próximo exercício:** [Exercício 2.3 — AGENTS.md](../exercicio-2-3-agents-md/README.md)
