# Tech Lead — Exercícios Fase 2 (Estruturação)

## Visão Geral

Três exercícios para definir padrões técnicos, gerenciar infraestrutura de IA e validar que agentes seguem as decisões arquiteturais:

1. **Exercício 2.1** — Construção e Teste do AGENTS.md (3 tarefas)
2. **Exercício 2.2** — Arquitetura de MCP para o Projeto (3 tarefas)
3. **Exercício 2.3** — Criação e Teste de Skills Técnicas (4 tarefas)

**Total de tarefas:** 10  
**Tempo estimado:** 12-16 horas  
**Entregáveis:** 10+ documentos estruturados + scripts funcionais

---

## Estrutura de Diretórios

```
tech-lead/
├── INDEX.md (este arquivo)
├── exercicios.md (documento original)
│
├── exercicio-2-1/
│   ├── README.md (visão geral do exercício)
│   └── tarefas/
│       ├── tarefa-2-1-1-escrever-agents-md.md
│       ├── tarefa-2-1-2-testar-com-copilot.md
│       └── tarefa-2-1-3-analisar-iterar.md
│
├── exercicio-2-2/
│   ├── README.md (visão geral do exercício)
│   └── tarefas/
│       ├── tarefa-2-2-1-arquitetura-mcp.md
│       ├── tarefa-2-2-2-health-check.md
│       └── tarefa-2-2-3-contingencia.md
│
└── exercicio-2-3/
    ├── README.md (visão geral do exercício)
    └── tarefas/
        ├── tarefa-2-3-1-skill-md.md
        ├── tarefa-2-3-2-testar-skill.md
        ├── tarefa-2-3-3-iterar-skill.md
        └── tarefa-2-3-4-criterios-maturidade.md
```

---

## Como Usar Este Material

### Opção A: Leia de Cima para Baixo (Sequencial)
1. [Exercício 2.1 — AGENTS.md](exercicio-2-1/README.md)
   - Define a "constitution" do projeto para agentes
   - Entrega: AGENTS.md v1 → v2, validação com Copilot

2. [Exercício 2.2 — Arquitetura de MCP](exercicio-2-2/README.md)
   - Define infraestrutura de agentes como código
   - Entrega: Arquitetura, health-check, plano de contingência

3. [Exercício 2.3 — Skills Técnicas](exercicio-2-3/README.md)
   - Define padrões reutilizáveis para geração de código
   - Entrega: Skills documentadas, testadas, com critérios de maturidade

### Opção B: Leia por Tarefa (Paralelo)
Cada tarefa é autossuficiente e tem inputs explícitos. Você pode fazer tarefas de exercícios diferentes em paralelo, desde que respeite dependências:

- Exercício 2.2 pode começar após 2.1.1 (AGENTS.md draft)
- Exercício 2.3 pode começar após 2.1.2 (Copilot testing experience)

### Opção C: Trabalhe na Sua Ordem
Se preferir, faça as tarefas na ordem que fizer sentido para você, mas finalize na sequência 2.1 → 2.2 → 2.3 para garantir consistência.

---

## Resumo de Cada Exercício

### Exercício 2.1: Construção e Teste do AGENTS.md

**Contexto:** O AGENTS.md é a constitution do projeto — todo agente (Copilot, Claude Code) lê este documento antes de gerar artefatos.

**O Que Você Vai Entregar:**
- `AGENTS.md` v1 (Project Overview, Tech Stack, Coding Standards, Build & Deploy)
- Evidência de testes com Copilot (outputs, screenshots)
- Análise do que foi seguido vs ignorado
- `AGENTS.md` v2 (iterado com melhorias na clareza)

**Tempo:** ~4-5 horas por tarefa (12-15 horas total)

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.1.1](exercicio-2-1/tarefas/tarefa-2-1-1-escrever-agents-md.md) | Qual é a constitution técnica? | `AGENTS.md` v1 |
| [2.1.2](exercicio-2-1/tarefas/tarefa-2-1-2-testar-com-copilot.md) | Copilot segue as regras? | Análise de aderência |
| [2.1.3](exercicio-2-1/tarefas/tarefa-2-1-3-analisar-iterar.md) | Como deixar mais prescritivo? | `AGENTS.md` v2 + análise |

### Exercício 2.2: Arquitetura de MCP para o Projeto

**Contexto:** MCP servers conectam agentes a serviços externos (GitHub, Azure, Confluence). Precisam ser gerenciados como infraestrutura.

**O Que Você Vai Entregar:**
- `MCP-ARCHITECTURE.md` (diagrama, política de aprovação, monitoramento, versioning)
- `health-check.js` ou `health-check.py` (script funcional gerado com Copilot)
- `MCP-CONTINGENCY.md` (plano de degradação graciosa por servidor)

**Tempo:** ~3-4 horas por tarefa (9-12 horas total)

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.2.1](exercicio-2-2/tarefas/tarefa-2-2-1-arquitetura-mcp.md) | Como gerenciar MCP servers? | `MCP-ARCHITECTURE.md` |
| [2.2.2](exercicio-2-2/tarefas/tarefa-2-2-2-health-check.md) | Como monitorar? | Script `health-check.*` |
| [2.2.3](exercicio-2-2/tarefas/tarefa-2-2-3-contingencia.md) | E se quebrar? | `MCP-CONTINGENCY.md` |

### Exercício 2.3: Criação e Teste de Skills Técnicas

**Contexto:** Skills definem padrões reutilizáveis (Azure Functions, testes, componentes React). Devem ser tão claras que agentes conseguem seguir.

**O Que Você Vai Entregar:**
- `skills/domain/azure-functions-endpoint.md` (v1 + v2 iterado)
- Evidência de testes com Copilot (antes/depois)
- `SKILL-MATURITY-CRITERIA.md` (framework para avaliar quando skill está pronta)

**Tempo:** ~2-3 horas por tarefa (8-12 horas total)

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.3.1](exercicio-2-3/tarefas/tarefa-2-3-1-skill-md.md) | Como documenta um padrão? | `azure-functions-endpoint.md` v1 |
| [2.3.2](exercicio-2-3/tarefas/tarefa-2-3-2-testar-skill.md) | Copilot consegue seguir? | Análise de aderência |
| [2.3.3](exercicio-2-3/tarefas/tarefa-2-3-3-iterar-skill.md) | Como melhorar? | `azure-functions-endpoint.md` v2 |
| [2.3.4](exercicio-2-3/tarefas/tarefa-2-3-4-criterios-maturidade.md) | Quando skill é "pronta"? | `SKILL-MATURITY-CRITERIA.md` |

---

## Dependências Entre Tarefas

```
Exercício 2.1
├── 2.1.1 (Escrever AGENTS.md)
│   ├── INPUT: ADRs da Fase 1 + Stack decisions
│   └── OUTPUT: AGENTS.md v1
│
├── 2.1.2 (Testar com Copilot) ← DEPENDE DE 2.1.1
│   ├── INPUT: AGENTS.md v1 no repositório
│   └── OUTPUT: Análise de aderência
│
└── 2.1.3 (Iterar para v2) ← DEPENDE DE 2.1.2
    ├── INPUT: Análise de 2.1.2
    └── OUTPUT: AGENTS.md v2 + relatório de iteração

Exercício 2.2
├── 2.2.1 (Arquitetura MCP) ← PODE COMEÇAR APÓS 2.1.1
│   ├── INPUT: MCP servers mapeados pelo developer
│   └── OUTPUT: MCP-ARCHITECTURE.md
│
├── 2.2.2 (Health Check) ← DEPENDE DE 2.2.1
│   ├── INPUT: Lista de servidores em MCP-ARCHITECTURE.md
│   └── OUTPUT: Script health-check
│
└── 2.2.3 (Contingência) ← DEPENDE DE 2.2.1, 2.2.2
    ├── INPUT: Arquitetura + lista de servidores
    └── OUTPUT: MCP-CONTINGENCY.md

Exercício 2.3
├── 2.3.1 (Escrever SKILL.md) ← PODE COMEÇAR APÓS 2.1.2
│   ├── INPUT: AGENTS.md v1 + padrões técnicos
│   └── OUTPUT: azure-functions-endpoint.md v1
│
├── 2.3.2 (Testar com Copilot) ← DEPENDE DE 2.3.1
│   ├── INPUT: SKILL.md v1 no repositório
│   └── OUTPUT: Análise de aderência
│
├── 2.3.3 (Iterar para v2) ← DEPENDE DE 2.3.2
│   ├── INPUT: Análise de 2.3.2
│   └── OUTPUT: azure-functions-endpoint.md v2
│
└── 2.3.4 (Critérios de Maturidade) ← PODE COMEÇAR APÓS 2.3.3
    ├── INPUT: Experiência de 2.3.1-3
    └── OUTPUT: SKILL-MATURITY-CRITERIA.md
```

---

## Checklist de Completude

Ao finalizar cada exercício:

### Exercício 2.1
- [ ] `AGENTS.md` v1 — 4 seções: Project Overview, Tech Stack, Coding Standards, Build & Deploy
- [ ] Context management rules (ADR-0002) incorporadas explicitamente
- [ ] Outputs do Copilot (primeira rodada) documentados
- [ ] Análise de aderência: checklist ✓/❌ para cada decisão técnica
- [ ] `AGENTS.md` v2 — seções melhoradas com exemplos mais prescritivos
- [ ] Comparação v1 → v2 mostrando melhoria concreta

### Exercício 2.2
- [ ] `MCP-ARCHITECTURE.md` — Diagrama de 5 servers + matriz de permissões
- [ ] Política de aprovação clara: quem decide, critérios, SLA
- [ ] Monitoramento: métricas, alertas, responsáveis
- [ ] Versionamento: estratégia de backward compatibility
- [ ] `health-check.js` ou `.py` — script executável, suporta todos os 5 servers
- [ ] `MCP-CONTINGENCY.md` — Matriz criticidade, fallbacks, procedimentos de recuperação

### Exercício 2.3
- [ ] `azure-functions-endpoint.md` v1 — Contexto, decisões técnicas, DO/DON'T, anti-padrões, checklist
- [ ] Outputs do Copilot (primeira rodada) documentados
- [ ] Análise de aderência: checklist ✓/❌ para regras da skill
- [ ] `azure-functions-endpoint.md` v2 — seções reescritas com 80%+ aderência
- [ ] `SKILL-MATURITY-CRITERIA.md` — Checklist, versioning (v0.1-v2.0), responsabilidades por fase

---

## Dependências de Entrada (Inputs)

Este exercício depende de:
- **Exercício Developer (Fase 2):** Mapeamento de MCP servers usado em 2.2
- **ADRs (Fase 1):** Decisões técnicas que alimentam AGENTS.md
- **Especificação do AGENTS.md:** Conceito que "constitution do projeto" aparece em 2.1

---

## Próximos Passos

Após completar os 3 exercícios, você estará pronto para:
1. **Onboard da equipe:** Usar AGENTS.md como referência para novos devs
2. **Review de código:** Usar AGENTS.md + Skills para validar PRs
3. **Iteração de padrões:** Usar feedback do time para atualizar AGENTS.md e Skills
4. **Governance de MCP:** Executar procedimentos definidos em MCP-ARCHITECTURE.md

---

## Perguntas Frequentes

**P: Posso fazer exercícios em paralelo?**  
R: Sim, respeite as dependências. Por exemplo: 2.2 pode começar após 2.1.1 (v1 draft).

**P: Quanto tempo cada tarefa leva?**  
R: 2-4 horas, dependendo de profundidade. Veja estimativas no resumo acima.

**P: E se Copilot não seguir as regras?**  
R: Isso é esperado! O exercício é iterar e tornar as regras mais claras. 80% de aderência é vitória.

**P: Posso usar Claude para ajudar?**  
R: Sim! Use Claude para brainstorm, estruturar documentos, revisar iterações. O exercício é aprender a pensar como Tech Lead.

**P: Os documentos precisam ser "perfeitos"?**  
R: Não. Precisam ser **prescritivos** (agente consegue seguir) e **validados** (testado com Copilot).

**P: E se discordar das decisões técnicas?**  
R: Documente sua posição. Se for desacordo legítimo com AGENTS.md, proponha ajuste ou variante.

---

## Referência Rápida

| Documento | Tipo | Tamanho Estimado | Público |
|-----------|------|------------------|---------|
| AGENTS.md v1-v2 | Spec | 4-5 pág | Devs, Agents |
| MCP-ARCHITECTURE.md | Spec | 3-4 pág | Tech Lead, Devs, Ops |
| health-check script | Código | 100-200 linhas | DevOps, Ops |
| MCP-CONTINGENCY.md | Spec | 2-3 pág | Tech Lead, Devs, Support |
| azure-functions-endpoint.md v1-v2 | Spec | 3-4 pág | Devs, Agents |
| SKILL-MATURITY-CRITERIA.md | Framework | 2-3 pág | Tech Lead, Agents |

---

## Modelo Conceitual: Três Camadas de Governança

Este exercício estabelece **três camadas**:

1. **Constitution (AGENTS.md)** — decisões duráveis que guiam todo agente e toda spec
2. **Infrastructure (MCP)** — como agentes se conectam a serviços, com resiliência
3. **Patterns (Skills)** — receitas reutilizáveis para geração de código consistente

Juntas, estas camadas garantem que agentes geram código que:
- Segue as decisões técnicas do projeto ✓
- É testável com Copilot ✓
- Degrada graciosamente quando infraestrutura falha ✓

---

Boa sorte! 🚀
