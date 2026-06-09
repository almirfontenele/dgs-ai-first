# Tarefa 2.3.1 — Escrever a Seção "Project Management Rules" do AGENTS.md

## Objetivo

Escrever a seção **"Project Management Rules"** do AGENTS.md que consolidada regras de gestão em formato consumível por agentes de IA quando criarem tasks, issues, documentação ou artefatos de gestão.

Esta seção será lida por:
- Claude quando gera tasks ou planos
- GitHub Copilot quando cria issues
- Tech Lead quando valida documentação
- QA quando estrutura testes
- Delivery Manager quando rastreia progresso

Por isso, DEVE ser machine-readable, prescritiva e específica.

## Contexto

Agentes de IA seguem instruções explícitas. Uma seção vaga ("use bom senso") é inútil. Uma seção prescritiva ("issues de bug devem ter label 'bug' e estar no Azure DevOps em 2 horas") é útil.

## Ferramentas a Utilizar

- **Claude:** Para estruturação e refinamento

## Inputs

1. O arquivo `workflow.md` do Exercício 2.1.1
2. O arquivo `gates-detalhado.md` do Exercício 2.1.3
3. O arquivo `governanca.md` do Exercício 2.2.1
4. Os validation gates simulados do exercício 2.1:
   ```
   Gate 1 — Spec → Plan: PS aprova requirements.md antes do TL gerar o plan.
   Gate 2 — Tasks → Implement: TL aprova tasks.md antes do Dev iniciar.
   Gate 3 — Code → Merge: TL faz code review; PR precisa de 1 approval.
   Gate 4 — Tests → Deploy: QA valida cobertura e cenários; TL aprova deploy.
   ```
5. A estrutura de repositório (Anexo C, ou padrão se não disponível)

## Entregável

Uma seção `project-management-rules.md` (ou conteúdo direto para AGENTS.md) com as subseções abaixo:

### 1. Nomenclatura de Tasks e Issues

Defina o formato obrigatório:

**Issues de Bug:**
```
Title: [BUG] <descrição concisa do problema>
Labels: bug, <área: api-search, ingestão, teams, web, etc>, <prioridade: p0, p1, p2>
Description: 
- Symptom: o que está quebrado
- Impact: quem é afetado
- Expected: o que deveria acontecer
- Actual: o que está acontecendo
```

**Issues de Feature:**
```
Title: [FEATURE] <descrição concisa da feature>
Labels: feature, <área>, <prioridade>
Description:
- Purpose: por quê essa feature existe
- Success criteria: como sabemos que está pronto
- Dependency: bloqueado por outra issue?
```

**Tasks Técnicas (geradas durante implementação):**
```
Title: [TASK] <descrição concisa da atividade>
Format: [TASK] <módulo>: <atividade>
Example: [TASK] search-api: implement fuzzy matching for query parser
Labels: task, <módulo>, <status: in-progress, blocked, ready>
```

**Pull Requests:**
```
Title: [PR] <descrição do que muda>
Format: [PR] <módulo>: <o que muda>
Example: [PR] search-api: implement fuzzy matching for query parser (fixes #123)
Description:
- Changes: o que foi modificado
- Tests: quais testes cobrem isso
- Validation gate: qual gate essa PR satisfaz (Gate 3: Code → Merge)
```

### 2. Organização de Tasks no Azure DevOps / GitHub

Defina:
```
Issue tracking: GitHub Issues
Planning: Azure DevOps Boards
Modules (para tagging):
- ingestão: document ingestion pipeline
- search: search API and query endpoint
- feedback: feedback collection API
- teams: Teams bot interface
- web: web dashboard
- ops: operations, DevOps, infra
- docs: documentation

Status workflow:
- Backlog → Ready (spec approved) → In Progress → In Review → Done
```

### 3. Documentação de Decisões (ADRs)

Defina:

**Quando criar um ADR?**
- Toda decisão técnica significativa (arquitetura, library choice, algoritmo)
- Toda decisão de escopo ou prioridade que afeta múltiplos módulos
- Toda mudança que afeta design anterior

**Quando NÃO criar um ADR?**
- Bug fixes
- Refactors que não mudam comportamento
- Pequenas otimizações

**Formato obrigatório:**
```
File: docs/adr/ADR-NNN-<título-em-kebab-case>.md

# ADR-NNN: <Título Descritivo>

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-MMM

## Context
[Qual é o problema? Por quê precisamos decidir?]

## Decision
[O que decidimos fazer?]

## Rationale
[Por quê essa é a melhor opção? Quais alternativas consideramos?]

## Consequences
[O que muda com essa decisão? Benefícios? Riscos?]

## References
[Links para issues, specs, code, etc]
```

**Numeração:** ADR-001, ADR-002, etc (sequencial, não reseta)

### 4. Validation Gates em Formato Machine-Readable

Defina cada gate de forma que um agente consegue checar se foi satisfeito:

```yaml
validation_gates:
  gate_1_spec_to_plan:
    name: "Spec → Plan Approval"
    from_status: "spec_rascunho"
    to_status: "plan_rascunho"
    approver: "product_specialist"
    artifact: "requirements.md"
    checks:
      - "file_exists: docs/modules/{module}/requirements.md"
      - "contains_section: Outcomes"
      - "contains_section: Scope"
      - "contains_section: Constraints"
      - "contains_section: Decisions"
      - "contains_section: Verification Criteria"
    approval_method: "github_pr_approved"
    max_time_hours: 48
    on_reject: "return_to_draft_for_revision"

  gate_2_tasks_to_implement:
    name: "Tasks → Implement Approval"
    from_status: "tasks_draft"
    to_status: "in_implementation"
    approver: "tech_lead"
    artifact: "tasks.md"
    checks:
      - "file_exists: docs/modules/{module}/tasks.md"
      - "each_task_has: id, title, acceptance_criteria"
      - "no_task_duration: exceeds 8 hours"
      - "all_tasks_reference: requirements.md"
    approval_method: "github_pr_approved"
    max_time_hours: 24
    on_reject: "refine_tasks_and_resubmit"

  gate_3_code_to_merge:
    name: "Code → Merge"
    from_status: "pr_open"
    to_status: "merged"
    approver: "tech_lead"
    artifact: "pull_request"
    checks:
      - "pr_references: github_issue"
      - "pr_references: gate_3_code_merge"
      - "ci_passing: true"
      - "code_review_approved: >= 1"
      - "no_dead_code_or_debug_logs"
      - "test_coverage: >= 80%"
    approval_method: "github_pr_approval"
    max_time_hours: 48
    on_reject: "request_changes_and_iterate"

  gate_4_tests_to_deploy:
    name: "Tests → Deploy"
    from_status: "ready_for_deploy"
    to_status: "deployed"
    approver: "qa_lead, tech_lead"
    artifact: "test_report"
    checks:
      - "test_coverage: >= 85%"
      - "critical_path_tests: all_passing"
      - "edge_case_tests: defined"
      - "performance_tests: baseline_met"
    approval_method: "manual_approval_both_qa_and_tl"
    max_time_hours: 24
    on_reject: "fix_tests_and_revalidate"
```

### 5. Restrições de Comunicação

Defina:

**Idioma:**
- Documentação funcional (specs, requirements, decision records): **Português**
- Código, comentários, commit messages: **Inglês**
- Issues e PRs: **Português** (mais claro para time brasileiro)
- Code review comments: **Inglês** (padrão GitHub)

**Formatos:**
- Documentação: Markdown (.md)
- Decision Records: Markdown com template ADR
- Code: Python / JavaScript conforme módulo
- Specs: SDD format (Outcomes, Scope, Constraints, Decisions, Criteria)

**Estrutura de Nomes em Código:**
- Classes: PascalCase (e.g., `SearchQueryParser`)
- Functions: camelCase (e.g., `extractFeatures()`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- Private members: _camelCase (e.g., `_validateInput()`)

**Estrutura de Nomes em Documentação:**
- Files: kebab-case (e.g., `requirements.md`, `test-plan.md`)
- Headings: Title Case (e.g., `# Validation Gates`)
- Links: relative paths (e.g., `[spec](../requirements.md)`)

### 6. Ciclo de Vida de um Artefato (Resumido)

Defina para agentes entenderem o pipeline:

```
1. REQUIREMENT PHASE
   - Product Specialist cria requirements.md (spec rascunho)
   - Tech Lead aprova (Gate 1)
   - Status: requirements_approved

2. PLANNING PHASE
   - Tech Lead cria plan.md (baseado em requirements)
   - Tech Lead aprova (Gate 2)
   - Status: plan_approved

3. TASK BREAKDOWN PHASE
   - Developer cria tasks.md com apoio de Copilot
   - Tech Lead aprova (Gate 2)
   - Status: tasks_approved

4. IMPLEMENTATION PHASE
   - Developer inicia (marca tasks como in_progress)
   - Developer abre PR quando pronto
   - Tech Lead revisa PR (Gate 3: Code → Merge)
   - Status: in_implementation / in_review / merged

5. TESTING PHASE
   - QA executa testes baseado em verification criteria
   - QA approves ou rejects (Gate 4)
   - Status: ready_for_deploy / test_failed

6. DEPLOYMENT PHASE
   - TL + QA aprovam
   - Deploy to prod
   - Status: deployed
   - Fecha a spec como "validada"
```

## Critérios de Aceite

- [ ] Seção "Project Management Rules" é machine-readable
- [ ] Nomenclatura de tasks/issues é prescritiva (diz exatamente qual formato usar)
- [ ] ADR format é claro e obrigatório
- [ ] Validation gates são em formato estruturado (YAML ou similar)
- [ ] Restrições de idioma e formato são explícitas
- [ ] Ciclo de vida de artefatos é documentado
- [ ] Nada é genérico ou vago (ex: "use bom senso" não aparece)
- [ ] Seção é específica ao projeto NovaTech (referencia módulos, estrutura, etc)

## Dicas

- Use Claude para estruturar o YAML dos validation gates
- Pense em "um agente consegue ler isso e saber exatamente o que fazer?" para cada regra
- Valide nomenclatura contra exemplos reais (bug actual que aconteceu, feature que foi feita)
- Inclua pelo menos 1 exemplo concreto para cada tipo de artefato

## Como Começar

1. Use Claude para consolidar as 3 seções anteriores (workflow, governance, gates) em regras de projeto
2. Use Claude para estruturar validation gates em YAML
3. Refine para deixar prescritivo e específico
4. Estruture em prosa clara com exemplos

## Entrega

Coloque o arquivo em: `docs/exercicio-2-fase-estruturacao/papeis/delivery-manager/exercicio-2-3-agents-md/project-management-rules.md`

Ou envie para o Tech Lead com instrução de incorporar na seção correspondente do AGENTS.md do projeto.

**Fim dos exercícios do Delivery Manager!** 🎉

Próximos passos:
- Tech Lead consolida AGENTS.md com contribuições de todos os papéis
- Developer começa exercícios da Fase 2
- QA começa exercícios da Fase 2
