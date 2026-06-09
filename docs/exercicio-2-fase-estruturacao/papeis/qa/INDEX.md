# QA — Exercícios Fase 2 (Estruturação)

## Visão Geral

Três exercícios para definir padrões de teste, especificar planos de teste em formato SDD e criar skills que orientem a geração automática de testes de qualidade:

1. **Exercício 2.1** — Contribuição para o AGENTS.md: Seção de Testing Standards (3 tarefas)
2. **Exercício 2.2** — Criação de Spec de Testes no Formato SDD (3 tarefas)
3. **Exercício 2.3** — Definição de Skill de Geração de Testes (2 tarefas)

**Total de tarefas:** 8  
**Tempo estimado:** 10-14 horas  
**Entregáveis:** 8+ documentos estruturados + checklists e artefatos Cowork

---

## Estrutura de Diretórios

```
qa/
├── INDEX.md (este arquivo)
├── exercicios.md (documento original - pode ser descartado)
│
├── exercicio-2-1-testing-standards/
│   ├── README.md (visão geral do exercício)
│   └── tarefas/
│       ├── 2-1-1-escrever-testing-standards.md
│       ├── 2-1-2-reescrever-teste-ruim.md
│       └── 2-1-3-definir-criterios-review.md
│
├── exercicio-2-2-test-plan/
│   ├── README.md (visão geral do exercício)
│   └── tarefas/
│       ├── 2-2-1-escrever-test-plan.md
│       ├── 2-2-2-testes-robustez-ia.md
│       └── 2-2-3-organizar-com-cowork.md
│
└── exercicio-2-3-skill-testes/
    ├── README.md (visão geral do exercício)
    └── tarefas/
        ├── 2-3-1-criar-skill-md.md
        └── 2-3-2-criar-checklist-cowork.md
```

---

## Como Usar Este Material

### Opção A: Leia de Cima para Baixo (Sequencial)

1. [Exercício 2.1 — Testing Standards](exercicio-2-1-testing-standards/README.md)
   - Define padrões obrigatórios para testes gerados por IA
   - Entrega: Testing Standards do AGENTS.md, teste reescrito, critérios de review

2. [Exercício 2.2 — Test Plan em SDD](exercicio-2-2-test-plan/README.md)
   - Especifica planos de teste derivados de verification criteria
   - Entrega: test-plan.md, testes de robustez, artefato rastreável em Cowork

3. [Exercício 2.3 — Skill de Geração de Testes](exercicio-2-3-skill-testes/README.md)
   - Define skill que orienta como gerar testes de qualidade
   - Entrega: SKILL.md, checklist de revisão

### Opção B: Leia por Tarefa (Paralelo)

Cada tarefa é relativamente autossuficiente e tem inputs explícitos. Você pode fazer tarefas de exercícios diferentes em paralelo, desde que respeite dependências:

- Exercício 2.2 pode começar após 2.1.1 (Testing Standards draft)
- Exercício 2.3 pode começar após 2.1.2 (teste reescrito com exemplos)

### Opção C: Trabalhe na Sua Ordem

Se preferir, faça as tarefas na ordem que fizer sentido para você, mas finalize na sequência 2.1 → 2.2 → 2.3 para garantir consistência.

---

## Resumo de Cada Exercício

### Exercício 2.1: Padrões de Teste (Testing Standards)

**Contexto:** O AGENTS.md precisa de uma seção de Testing Standards que todo agente de IA (Copilot, Claude) leia antes de gerar código de teste. Sem padrões claros, o Copilot gera testes fracos (assertions vagas, acesso a serviços reais, dados irrealistas).

**O Que Você Vai Entregar:**
- Seção `Testing Standards` do AGENTS.md (padrões de nomenclatura, estrutura, mocking, fixtures)
- Documento `test-refactoring.md` com antes/depois e análise de melhorias
- Documento `review-criteria.md` com 6-8 critérios objetivos de review

**Tempo:** ~3-4 horas por tarefa (9-12 horas total)

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.1.1](exercicio-2-1-testing-standards/tarefas/2-1-1-escrever-testing-standards.md) | Quais são os padrões obrigatórios? | `testing-standards.md` |
| [2.1.2](exercicio-2-1-testing-standards/tarefas/2-1-2-reescrever-teste-ruim.md) | Como aplicar os padrões na prática? | `test-refactoring.md` com versões 1-3 |
| [2.1.3](exercicio-2-1-testing-standards/tarefas/2-1-3-definir-criterios-review.md) | Como revisar testes de forma objetiva? | `review-criteria.md` com 6-8 critérios |

### Exercício 2.2: Especificação de Testes em SDD

**Contexto:** No modelo SDD (Specification-Driven Development), até o plano de testes é especificado antes de ser implementado. Você precisa derivar cenários de teste a partir dos verification criteria, incluindo testes de robustez específicos para IA (prompt injection, hallucination, language confusion).

**O Que Você Vai Entregar:**
- Documento `test-plan.md` (VC → Cenários → Dados realistas → Critério aprovação)
- Documento `robustness-tests.md` (riscos de IA, cenários, mitigações)
- Artefato Cowork rastreável (tabela com ID, VC, tipo, prioridade, status, critério aprovação)

**Tempo:** ~2-3 horas por tarefa (6-9 horas total)

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.2.1](exercicio-2-2-test-plan/tarefas/2-2-1-escrever-test-plan.md) | Como derivar testes de VCs? | `test-plan.md` com 2+ cenários por VC |
| [2.2.2](exercicio-2-2-test-plan/tarefas/2-2-2-testes-robustez-ia.md) | Como testar robustez do LLM? | `robustness-tests.md` com 3-5 categorias de risco |
| [2.2.3](exercicio-2-2-test-plan/tarefas/2-2-3-organizar-com-cowork.md) | Como rastrear progresso? | Artefato Cowork com tabela rastreável |

### Exercício 2.3: Skill de Geração de Testes

**Contexto:** Skills definem padrões reutilizáveis (como gerar um tipo específico de artefato). Uma skill de teste precisa ser tão clara que Copilot consegue gerar testes que passam em review na primeira tentativa. Isso inclui: activation phrase, regras prescritivas, template com placeholders, exemplos DO/DON'T, anti-padrões documentados.

**O Que Você Vai Entregar:**
- Documento `SKILL.md` para `create-integration-test` (v1, completo)
- Documento `test-review-checklist.md` (checklist Cowork verificável em < 2 minutos)

**Tempo:** ~2-3 horas por tarefa (4-6 horas total)

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.3.1](exercicio-2-3-skill-testes/tarefas/2-3-1-criar-skill-md.md) | Como ensinar um LLM a gerar bons testes? | `create-integration-test.md` com template + 2 exemplos + 5-10 anti-padrões |
| [2.3.2](exercicio-2-3-skill-testes/tarefas/2-3-2-criar-checklist-cowork.md) | Como revisar testes rapidamente? | `test-review-checklist.md` com critérios críticos + feedback |

---

## Dependências Entre Tarefas

```
Exercício 2.1
├── 2.1.1 (Escrever Testing Standards)
│   ├── INPUT: Decisões técnicas (Vitest, msw, 80% coverage)
│   └── OUTPUT: testing-standards.md
│
├── 2.1.2 (Reescrever teste ruim) ← DEPENDE DE 2.1.1
│   ├── INPUT: testing-standards.md + teste ruim fornecido
│   └── OUTPUT: test-refactoring.md com 3 versões
│
└── 2.1.3 (Definir critérios review) ← DEPENDE DE 2.1.1 e 2.1.2
    ├── INPUT: testing-standards.md + exemplos
    └── OUTPUT: review-criteria.md com 6-8 critérios

Exercício 2.2
├── 2.2.1 (Escrever test-plan) ← PODE COMEÇAR APÓS 2.1.1
│   ├── INPUT: Testing Standards + VCs fornecidos
│   └── OUTPUT: test-plan.md
│
├── 2.2.2 (Testes robustez IA) ← DEPENDE DE 2.2.1
│   ├── INPUT: test-plan.md + categorias de risco
│   └── OUTPUT: robustness-tests.md
│
└── 2.2.3 (Organizar com Cowork) ← DEPENDE DE 2.2.1 e 2.2.2
    ├── INPUT: test-plan.md + robustness-tests.md
    └── OUTPUT: Artefato Cowork rastreável

Exercício 2.3
├── 2.3.1 (Criar SKILL.md) ← PODE COMEÇAR APÓS 2.1.2
│   ├── INPUT: testing-standards.md + anti-padrões
│   └── OUTPUT: create-integration-test.md
│
└── 2.3.2 (Criar checklist) ← DEPENDE DE 2.3.1
    ├── INPUT: SKILL.md + critérios de review
    └── OUTPUT: test-review-checklist.md com scorecard
```

---

## Checklist de Completude

Ao finalizar cada exercício:

### Exercício 2.1
- [ ] `testing-standards.md` — Nomenclatura, arrange/act/assert, DO/DON'T, mocking, fixtures
- [ ] `test-refactoring.md` — Versão 1 (básica), versão 2 (com mocking), versão 3 (avançado/opcional)
- [ ] Cada versão tem explicação de melhorias + referência aos padrões aplicados
- [ ] `review-criteria.md` — 6-8 critérios com exemplos ✓/✗
- [ ] Critérios são verificáveis em < 2 minutos sem ambiguidade

### Exercício 2.2
- [ ] `test-plan.md` — Cada VC com mínimo 2 cenários (happy path + edge case)
- [ ] Dados de teste realistas (domínio NovaTech, não genéricos)
- [ ] Critério de aprovação claro para cada cenário
- [ ] `robustness-tests.md` — 3-5 categorias de risco com 2-3 cenários cada
- [ ] Mitigações documentadas para cada risco
- [ ] Artefato Cowork — Tabela rastreável com ID, VC, tipo, prioridade, status, critério aprovação
- [ ] Sumário por VC e sumário por risco incluído

### Exercício 2.3
- [ ] `create-integration-test.md` — Activation phrase, regras prescritivas, template, 2 exemplos
- [ ] Anti-padrões gallery com 5-10 padrões reais que LLMs geram
- [ ] Dependências listadas (quais skills ler antes)
- [ ] `test-review-checklist.md` — Crítico (6+), Importante (4+), Nice-to-Have (2+)
- [ ] Feedback sugerido para cada item
- [ ] Scorecard para rastrear resultados
- [ ] FAQ com perguntas comuns

---

## Dependências de Entrada (Inputs)

Este exercício depende de:
- **Exercício Developer (Fase 2):** Entendimento do RAG pipeline e dados reais do NovaTech
- **Exercício Product Specialist (Fase 2):** Requirements e verification criteria do query endpoint
- **Exercício Tech Lead (Fase 2):** Decisões técnicas (Vitest, msw, coverage mínimo)
- **Documentação NovaTech (Anexo A, B):** Dados realistas para testes

---

## Próximos Passos

Após completar os 3 exercícios, você estará pronto para:

1. **Onboard de QAs:** Usar Testing Standards + Review Criteria para treinar novos QAs
2. **Integração em CI/CD:** Usar Review Checklist para automação parcial de code review
3. **Governance de testes:** Executar test plan e rastrear cobertura com artefato Cowork
4. **Evolução de skills:** Iterar SKILL.md com feedback de desenvolvedores, melhorando qualidade dos testes gerados

---

## Perguntas Frequentes

**P: Posso fazer exercícios em paralelo?**  
R: Sim, respeite as dependências. Por exemplo: 2.2 pode começar após 2.1.1 (draft).

**P: Quanto tempo cada tarefa leva?**  
R: 2-3 horas, dependendo de profundidade. Veja estimativas no resumo acima.

**P: E se o teste reescrito (2.1.2) não melhorar muito?**  
R: Isso é OK! O objetivo é aprender a aplicar os padrões. Documente o que melhorou e por quê.

**P: Posso usar dados fabricados em vez de dados reais?**  
R: Tente não fazer. Use o Anexo A (documentação NovaTech) para criar dados realistas. Se não houver dados, crie um exemplo realista baseado no domínio de logística.

**P: Os documentos precisam ser "perfeitos"?**  
R: Não. Precisam ser **prescritivos** (QA consegue seguir) e **validados** (testado com revisor).

**P: E se discordar dos padrões técnicos do Tech Lead?**  
R: Documente sua posição e proponha variante. A seção Testing Standards é um contrato entre Tech Lead e QA.

**P: Posso usar Claude para ajudar?**  
R: Sim! Use Claude para brainstorm, estruturar documentos, revisar iterações. O exercício é aprender a pensar como QA em contexto de IA/LLMs.

---

## Referência Rápida

| Documento | Tipo | Tamanho Estimado | Público |
|-----------|------|------------------|---------|
| testing-standards.md | Spec | 3-4 pág | Devs, Agents, QAs |
| test-refactoring.md | Análise | 3-4 pág | QAs, Devs |
| review-criteria.md | Spec | 2-3 pág | QAs, Code Reviewers |
| test-plan.md | Spec | 4-5 pág | QAs, Devs, Tech Lead |
| robustness-tests.md | Spec | 3-4 pág | QAs, Security, Tech Lead |
| Artefato Cowork | Tabela | Variável | QAs, Product, Tech Lead |
| create-integration-test.md | Skill | 3-4 pág | Devs, Agents, QAs |
| test-review-checklist.md | Checklist | 2-3 pág | QAs, Code Reviewers |

---

## Modelo Conceitual: Três Camadas de Qualidade

Este exercício estabelece **três camadas**:

1. **Standards (Testing Standards)** — decisões duráveis sobre como escrever testes
2. **Specification (Test Plan SDD)** — como verificar requisitos específicos com testes
3. **Skills (Skill.md + Checklist)** — receitas reutilizáveis para gerar testes com IA

Juntas, estas camadas garantem que:
- Testes são consistentes (seguem padrões) ✓
- Testes cobrem os requisitos (derivados de VCs) ✓
- Testes são fáceis de revisar (checklist rápido) ✓
- LLMs conseguem gerar testes de qualidade (skill clara) ✓

---

## Links Relacionados

- [Tech Lead — AGENTS.md](../tech-lead/exercicio-2-1/README.md) — Contexto de decisões técnicas
- [Product Specialist — Requirements & VCs](../product-specialist/exercicio-2-1-dominio-spec/README.md) — Origem dos verification criteria
- [Developer — RAG Pipeline](../desenvolvedor/README.md) — Contexto do endpoint testado

---

Boa sorte! 🚀
