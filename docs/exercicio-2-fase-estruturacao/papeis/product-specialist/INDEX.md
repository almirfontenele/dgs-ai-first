# Product Specialist — Exercícios Fase 2 (Estruturação)

## Visão Geral

Três exercícios para consolidar especificação de produto e preparar documentação para implementação:

1. **Exercício 2.1** — Recorte de Domínio e Spec em SDD (5 tarefas)
2. **Exercício 2.2** — Guardrails como Artefato (3 tarefas)
3. **Exercício 2.3** — Contribuição ao AGENTS.md (4 tarefas)

**Total de tarefas:** 12  
**Tempo estimado:** 15-20 horas  
**Entregáveis:** 15+ documentos estruturados

---

## Estrutura de Diretórios

```
product-specialist/
├── INDEX.md (este arquivo)
├── exercicios.md (documento original integrado)
│
├── exercicio-2-1-dominio-spec/
│   ├── README.md (visão geral do exercício)
│   └── tarefas/
│       ├── 2-1-1-identificar-bounded-contexts.md
│       ├── 2-1-2-extrair-linguagem-ubiqua.md
│       ├── 2-1-3-escrever-requirements-sdd.md
│       ├── 2-1-4-criar-mockup-interface.md
│       └── 2-1-5-iteracao-tech-lead.md
│
├── exercicio-2-2-guardrails/
│   ├── README.md (visão geral do exercício)
│   └── tarefas/
│       ├── 2-2-1-elaborar-guardrails.md
│       ├── 2-2-2-classificar-enforcement.md
│       └── 2-2-3-conectar-aos-incidentes.md
│
└── exercicio-2-3-agents-md/
    ├── README.md (visão geral do exercício)
    └── tarefas/
        ├── 2-3-1-escrever-product-rules.md
        ├── 2-3-2-criar-glossario.md
        ├── 2-3-3-definir-restricoes-codigo.md
        └── 2-3-4-adicionar-referencias.md
```

---

## Como Usar Este Material

### Opção A: Leia de Cima para Baixo (Sequencial)
1. [Exercício 2.1 — Domínio & Spec](exercicio-2-1-dominio-spec/README.md)
   - Estabelece o "quê" do assistente
   - Entrega: bounded contexts, glossário, requirements, mockups

2. [Exercício 2.2 — Guardrails](exercicio-2-2-guardrails/README.md)
   - Formaliza os "limites" do assistente
   - Entrega: guardrails estruturados, enforcement matrix, rastreabilidade

3. [Exercício 2.3 — AGENTS.md](exercicio-2-3-agents-md/README.md)
   - Consolida tudo em formato consumível
   - Entrega: Product Rules, glossário machine-readable, restrições de código

### Opção B: Leia por Tarefa (Paralelo)
Cada tarefa é autossuficiente e tem inputs explícitos. Você pode fazer tarefas de exercícios diferentes em paralelo, desde que respeite dependências:

- Tarefa 2.2.x (Guardrails) depende de Tarefa 2.1.1 (bounded contexts)
- Tarefa 2.3.x (AGENTS.md) depende de Tarefas 2.1 e 2.2

### Opção C: Trabalhe na Sua Ordem
Se preferir, faça as tarefas na ordem que fizer sentido para você, mas finalize na sequência 2.1 → 2.2 → 2.3 para garantir consistência.

---

## Resumo de Cada Exercício

### Exercício 2.1: Recorte de Domínio e Spec em SDD

**Contexto:** Antes de escrever especificação técnica, você precisa entender o domínio.

**O Que Você Vai Entregar:**
- Mapa de bounded contexts (divisões semânticas do domínio)
- Glossário de linguagem ubíqua (termos com definições precisas)
- `requirements.md` em formato SDD (Outcomes, Scope, Constraints, Decisions, Criteria)
- Mockups de interface no Teams (como as respostas aparecem)
- Histórico de iteração com Tech Lead

**Tempo:** ~5 horas por tarefa (25 horas total)

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.1.1](exercicio-2-1-dominio-spec/tarefas/2-1-1-identificar-bounded-contexts.md) | O quê é o domínio? | `bounded-contexts.md` |
| [2.1.2](exercicio-2-1-dominio-spec/tarefas/2-1-2-extrair-linguagem-ubiqua.md) | Como falamos sobre o domínio? | `linguagem-ubiqua.md` |
| [2.1.3](exercicio-2-1-dominio-spec/tarefas/2-1-3-escrever-requirements-sdd.md) | O que o assistente precisa fazer? | `requirements.md` |
| [2.1.4](exercicio-2-1-dominio-spec/tarefas/2-1-4-criar-mockup-interface.md) | Como se vê a resposta? | Mockups em PNG/PDF |
| [2.1.5](exercicio-2-1-dominio-spec/tarefas/2-1-5-iteracao-tech-lead.md) | Está tudo consistente? | `iteracao-tech-lead.md` |

### Exercício 2.2: Guardrails como Artefato de Produto

**Contexto:** Identificar e formalizar limites explícitos (o que o assistente NÃO faz).

**O Que Você Vai Entregar:**
- `guardrails.md` estruturado (DEVE, NÃO DEVE, QUANDO EM DÚVIDA)
- `enforcement-matrix.md` (Prompt vs Código para cada guardrail)
- `rastreabilidade-incidentes.md` (cada guardrail previne um incidente real)

**Tempo:** ~3 horas por tarefa (9 horas total)

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.2.1](exercicio-2-2-guardrails/tarefas/2-2-1-elaborar-guardrails.md) | Quais são os limites? | `guardrails.md` |
| [2.2.2](exercicio-2-2-guardrails/tarefas/2-2-2-classificar-enforcement.md) | Como enforçar (Prompt ou Código)? | `enforcement-matrix.md` |
| [2.2.3](exercicio-2-2-guardrails/tarefas/2-2-3-conectar-aos-incidentes.md) | Por quê cada guardrail existe? | `rastreabilidade-incidentes.md` |

### Exercício 2.3: Contribuição ao AGENTS.md

**Contexto:** Consolidar tudo em formato consumível por devs e agentes.

**O Que Você Vai Entregar:**
- Seção "Product Rules & Guardrails" do AGENTS.md
- Glossário machine-readable (JSON ou YAML)
- Restrições de código com pseudocódigo
- Índice de referências cruzadas

**Tempo:** ~2-3 horas por tarefa (9 horas total)

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.3.1](exercicio-2-3-agents-md/tarefas/2-3-1-escrever-product-rules.md) | Como documenta as regras? | Seção AGENTS.md |
| [2.3.2](exercicio-2-3-agents-md/tarefas/2-3-2-criar-glossario.md) | Glossário para code/agents | `glossario.md` |
| [2.3.3](exercicio-2-3-agents-md/tarefas/2-3-3-definir-restricoes-codigo.md) | Quais validações implementar? | `code-restrictions.md` |
| [2.3.4](exercicio-2-3-agents-md/tarefas/2-3-4-adicionar-referencias.md) | Mapear documentos de spec | `referencias-cruzadas.md` |

---

## Dependências Entre Tarefas

```
Exercício 2.1
├── 2.1.1 (Bounded Contexts)
│   ├── INPUT: Anexo A (NovaTech docs)
│   └── OUTPUT: bounded-contexts.md
│
├── 2.1.2 (Linguagem Ubíqua) ← DEPENDE DE 2.1.1
│   ├── INPUT: bounded-contexts.md + Anexo A
│   └── OUTPUT: linguagem-ubiqua.md
│
├── 2.1.3 (Requirements SDD) ← DEPENDE DE 2.1.1, 2.1.2
│   ├── INPUT: bounded-contexts.md + Dados de discovery
│   └── OUTPUT: requirements.md
│
├── 2.1.4 (Mockups) ← DEPENDE DE 2.1.3
│   ├── INPUT: requirements.md
│   └── OUTPUT: Mockups
│
└── 2.1.5 (Iteração) ← DEPENDE DE 2.1.1-4
    ├── INPUT: Todos os arquivos anteriores
    └── OUTPUT: iteracao-tech-lead.md + versões finais

Exercício 2.2
├── 2.2.1 (Guardrails) ← DEPENDE DE 2.1.1 (bounded contexts)
│   ├── INPUT: Incidentes simulados + guardrails informais
│   └── OUTPUT: guardrails.md
│
├── 2.2.2 (Enforcement) ← DEPENDE DE 2.2.1
│   ├── INPUT: guardrails.md
│   └── OUTPUT: enforcement-matrix.md
│
└── 2.2.3 (Rastreabilidade) ← DEPENDE DE 2.2.1, 2.2.2
    ├── INPUT: guardrails.md + incidentes
    └── OUTPUT: rastreabilidade-incidentes.md

Exercício 2.3
├── 2.3.1 (Product Rules) ← DEPENDE DE 2.2.1, 2.2.2
│   ├── INPUT: guardrails.md + enforcement-matrix.md
│   └── OUTPUT: product-rules.md (para AGENTS.md)
│
├── 2.3.2 (Glossário) ← DEPENDE DE 2.1.2
│   ├── INPUT: linguagem-ubiqua.md
│   └── OUTPUT: glossario.md (machine-readable)
│
├── 2.3.3 (Code Restrictions) ← DEPENDE DE 2.2.2
│   ├── INPUT: enforcement-matrix.md
│   └── OUTPUT: code-restrictions.md
│
└── 2.3.4 (Referências) ← DEPENDE DE 2.3.1-3
    ├── INPUT: Todos os documentos anteriores
    └── OUTPUT: referencias-cruzadas.md
```

---

## Checklist de Completude

Ao finalizar cada exercício:

### Exercício 2.1
- [ ] `bounded-contexts.md` — Pelo menos 4 bounded contexts com descrição clara
- [ ] `linguagem-ubiqua.md` — 15+ termos com definições específicas
- [ ] `requirements.md` — 5 seções SDD: Outcomes, Scope, Constraints, Decisions, Criteria
- [ ] Mockups — 3+ cenários de resposta (simples, contraditório, baixa confiança)
- [ ] `iteracao-tech-lead.md` — Aprovação "Pronto para desenvolvedor"

### Exercício 2.2
- [ ] `guardrails.md` — DEVE (3+ regras), NÃO DEVE (3+ regras), QUANDO EM DÚVIDA (3+ cenários)
- [ ] `enforcement-matrix.md` — Cada guardrail classificado Prompt/Código com justificativa
- [ ] `rastreabilidade-incidentes.md` — Cada guardrail conectado a ≥1 incidente

### Exercício 2.3
- [ ] `product-rules.md` — Seção formatada para AGENTS.md
- [ ] `glossario.md` — Machine-readable, termos críticos marcados
- [ ] `code-restrictions.md` — 5+ restrições com schema, validação, teste
- [ ] `referencias-cruzadas.md` — Índice navegável de documentos

---

## Próximos Passos

Após completar os 3 exercícios, você estará pronto para:
1. **Developer Role (Fase 2):** Usar estes documentos para escrever prompts e código
2. **QA Role (Fase 2):** Usar verification criteria para planejar testes
3. **Tech Lead:** Consolidar tudo em arquivo `AGENTS.md` final do projeto

---

## Perguntas Frequentes

**P: Preciso fazer todas as 12 tarefas na ordem?**  
R: Não. Respeite as dependências (2.1 antes de 2.2, 2.2 antes de 2.3), mas você pode paralelizar tarefas do mesmo exercício.

**P: Quanto tempo cada tarefa leva?**  
R: 2-5 horas, dependendo da profundidade. Veja estimativas no resumo acima.

**P: E se discordar das regras do exercício?**  
R: Documente sua posição. Se for desacordo legítimo com a spec, discuta com o Tech Lead.

**P: Posso usar IA (Claude) para ajudar?**  
R: Sim! Use Claude para brainstorm, estruturar documentos, iterar. O exercício é aprender a pensar como Product, não digitar.

**P: Os documentos precisam ser "perfeitos"?**  
R: Não. Precisam ser **úteis** (alguém consegue implementar) e **consistentes** (sem contradições).

---

## Referência Rápida

| Documento | Tipo | Tamanho Estimado | Público |
|-----------|------|------------------|---------|
| bounded-contexts.md | Spec | 2-3 pág | Produto, Devs |
| linguagem-ubiqua.md | Referência | 3-4 pág | Devs, QA, Agents |
| requirements.md | Spec | 2-3 pág | Produto, Devs, QA |
| guardrails.md | Spec | 3-4 pág | Devs, Agents |
| enforcement-matrix.md | Spec | 2 pág | Devs |
| product-rules.md (AGENTS.md) | Spec | 2-3 pág | Devs, Agents, QA |
| code-restrictions.md | Spec | 3-4 pág | Devs |

---

Boa sorte! 🚀
