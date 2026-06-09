# Tarefa 2.2.1 — Definir Processo de Governança de Specs

## Objetivo

Criar um documento que define como specs (requirements.md, plan.md, tasks.md) são criadas, aprovadas, versionadas e rastreadas no modelo SDD.

## Contexto

Sem governança clara, specs se tornam caóticas:
- Ninguém sabe quem escreveu a versão atual
- Requirements muda sem avisar quem tá desenvolvendo
- Histórico de decisões é perdido
- Plan fica desalinhado com requirements

Governança não significa burocracia — significa clareza sobre quem faz o quê.

## Ferramentas a Utilizar

- **Claude:** Para brainstorm e estruturação

## Inputs

1. O fluxo SDD: requirements.md → plan.md → tasks.md
2. Os papéis: Product Specialist (escreve requirements), Tech Lead (escreve plan), Developer (escreve tasks com apoio)
3. Os 5 módulos que precisam de specs (ingestão, busca, feedback, Teams, web)
4. A necessidade de rastreamento de versões

## Entregável

Um documento `governanca.md` que defina:

### 1. Criação de Specs

Para cada tipo (requirements, plan, tasks):
- **Quem cria?** (qual papel)
- **Com base em quê?** (inputs, documentação de referência)
- **Em qual ferramenta?** (GitHub, Docs, etc)
- **Tem template?** (sim/não, e qual)

**Exemplo:**
```
Requirements são criados pelo Product Specialist, com base em:
- Documentação de negócio do módulo (Anexo A)
- Dados de discovery (feedback de usuários, incidentes)
- Specs de módulos dependentes (se aplicável)

Criados em: arquivo `requirements.md` no repositório
Template: Use formato SDD (Outcomes, Scope, Constraints, Decisions, Criteria)
```

### 2. Aprovação de Specs

Para cada tipo, defina:
- **Quem aprova?** (qual papel)
- **Critérios de aprovação** (checklist do que validar)
- **Feedback é obrigatório ou opcional?** (alguém revisa antes de estar "pronta"?)
- **Como fica documentado?** (commit, pull request, comentário, etc)

**Exemplo:**
```
Requirements são aprovadas pelo Tech Lead, que valida:
- [ ] Acceptance criteria são testáveis
- [ ] Nenhuma contradição com requisitos existentes
- [ ] Estimativa de esforço é realista
- [ ] Documentação de negócio está citada

Aprovação documentada em: Pull Request no GitHub (aprovação do TL = "Approved")
```

### 3. Organização no Repositório

Defina a estrutura de diretórios:
```
docs/
├── modules/
│   ├── ingestion/
│   │   ├── requirements.md
│   │   ├── plan.md
│   │   └── tasks.md
│   ├── search/
│   │   ├── requirements.md
│   │   ├── plan.md
│   │   └── tasks.md
│   └── ... (outros módulos)
└── adr/ (architectural decision records)
```

Justifique por que essa organização facilita a governança.

### 4. Versionamento

Defina:
- **Como você rastreia versões?** (git commits, tags, números de versão?)
- **O que muda de uma versão para outra?** (apenas requirements, ou tudo?)
- **Como backcompat é tratado?** (versões antigas são mantidas ou descartadas?)

**Exemplo:**
```
Versionamento usa git tags: v1.0.0, v1.1.0, etc.
- Major version (1.0 → 2.0): mudança no escopo do módulo
- Minor version (1.0 → 1.1): nova feature dentro do escopo existente
- Patch (1.0.0 → 1.0.1): bug fix sem mudança funcional

Histórico é mantido em arquivo CHANGELOG.md por módulo.
```

### 5. Rastreamento e Comunicação

Defina:
- **Quem precisa ser notificado quando spec muda?** (Dev que tá implementando? QA? Tech Lead?)
- **Qual ferramenta usa para notificar?** (slack, email, GitHub notify, etc)
- **Como faz o link entre spec e task/issue?** (referência cruzada, linking, etc)

## Critérios de Aceite

- [ ] Cada tipo de spec (requirements, plan, tasks) tem processo definido
- [ ] Criação: quem, com base em quê, em qual ferramenta, com qual template
- [ ] Aprovação: quem aprova, critérios, como fica documentado
- [ ] Repositório: estrutura clara que reflete o fluxo
- [ ] Versionamento: como rastreiar mudanças
- [ ] Comunicação: quem notificar, qual ferramenta, links entre artefatos

## Dicas

- Comece com o caminho feliz (spec criada, aprovada, implementada sem mudanças)
- Depois pense em exceções (urgência, mudança tardia, aprovação demorada)
- Use Claude para brainstorm sobre como outras equipes fazem isso
- Valide contra a realidade do projeto: essas ferramentas existem? essas pessoas têm tempo?

## Como Começar

1. Use Claude para estruturar um processo de governança genérico
2. Refine baseado no projeto NovaTech (5 módulos, 3 papéis principais)
3. Descreva em prosa clara e estruturada

## Entrega

Coloque o arquivo em: `docs/exercicio-2-fase-estruturacao/papeis/delivery-manager/exercicio-2-2-governanca-specs/governanca.md`

**Próxima tarefa:** [2.2.2 — Board de Tracking de Specs](2-2-2-board-tracking-specs.md)
