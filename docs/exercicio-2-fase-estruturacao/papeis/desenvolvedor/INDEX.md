# Developer — Exercícios Fase 2 (Estruturação)

## Visão Geral

Três exercícios para consolidar infraestrutura, implementação e padrões:

1. **Exercício 2.1** — Configuração de MCP Servers (4 tarefas)
2. **Exercício 2.2** — Implementação com Spec Driven Development (3 tarefas)
3. **Exercício 2.3** — Estratégia de Skills do Projeto (3 tarefas)

**Total de tarefas:** 10  
**Tempo estimado:** 25-35 horas  
**Entregáveis:** 13+ documentos + código

---

## Estrutura de Diretórios

```
desenvolvedor/
├── INDEX.md (este arquivo)
├── exercicios.md (documento original integrado)
│
├── exercicio-2-1-configuracao-mcp/
│   ├── README.md (visão geral do exercício)
│   └── tarefas/
│       ├── 2-1-1-mapear-mcp-servers.md
│       ├── 2-1-2-definir-permissoes.md
│       ├── 2-1-3-criar-configuracao-mcp.md
│       └── 2-1-4-analise-riscos-seguranca.md
│
├── exercicio-2-2-spec-driven-development/
│   ├── README.md (visão geral do exercício)
│   └── tarefas/
│       ├── 2-2-1-converter-plan-tasks.md
│       ├── 2-2-2-implementar-primeira-task.md
│       └── 2-2-3-revisar-criticamente-codigo.md
│
└── exercicio-2-3-estrategia-skills/
    ├── README.md (visão geral do exercício)
    └── tarefas/
        ├── 2-3-1-definir-arvore-skills.md
        ├── 2-3-2-mapeamento-consumo.md
        └── 2-3-3-skill-foundation.md
```

---

## Como Usar Este Material

### Opção A: Leia de Cima para Baixo (Sequencial)

1. **[Exercício 2.1 — Configuração de MCP Servers](exercicio-2-1-configuracao-mcp/README.md)**
   - Mapeia quais servers o projeto precisa
   - Defende permissões e analisa riscos
   - Entrega: `.mcp.json` e matriz de segurança
   - **Pré-requisito para:** 2.2, 2.3

2. **[Exercício 2.2 — Spec Driven Development](exercicio-2-2-spec-driven-development/README.md)**
   - Converte plan técnico em tasks implementáveis
   - Implementa primeira task com Copilot
   - Revisa criticamente o código gerado
   - Entrega: `tasks.md`, código funcional, review
   - **Pré-requisito para:** 2.3 (skills herdam padrões implementados aqui)

3. **[Exercício 2.3 — Estratégia de Skills](exercicio-2-3-estrategia-skills/README.md)**
   - Define árvore de skills do projeto
   - Mapeia criação/consumo por papel
   - Cria SKILL.md Foundation (error handling)
   - Entrega: skills tree, matriz de criação, SKILL.md
   - **Conclusão:** Skills consolidam padrões

### Opção B: Leia por Tarefa (Paralelo)

Cada tarefa é quase autossuficiente e tem inputs explícitos. Você pode fazer tarefas de exercícios diferentes em paralelo, desde que respeite dependências:

- Tarefas 2.1.x (MCP) são independentes
- Tarefas 2.2.x (SDD) dependem de 2.2.1 (plan → tasks)
- Tarefas 2.3.x (Skills) dependem de tarefas anteriores (vê padrões do projeto)

### Opção C: Trabalhe na Sua Ordem

Se preferir, faça as tarefas na ordem que fizer sentido para você, mas finalize na sequência 2.1 → 2.2 → 2.3 para garantir consistência.

---

## Resumo de Cada Exercício

### Exercício 2.1: Configuração de MCP Servers

**Contexto:** Antes de implementar, configure acesso a sistemas externos (GitHub, Azure, Confluence).

**O Que Você Vai Entregar:**
- Mapeamento de MCP servers (o que cada um expõe)
- Matriz de permissões por papel (least privilege)
- Arquivo `.mcp.json` sintaticamente válido
- Análise de riscos de segurança com mitigações

**Tempo:** ~2-3 horas por tarefa (10-12 horas total)

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.1.1](exercicio-2-1-configuracao-mcp/tarefas/2-1-1-mapear-mcp-servers.md) | Quais MCP servers? | `mcp-servers-mapping.md` |
| [2.1.2](exercicio-2-1-configuracao-mcp/tarefas/2-1-2-definir-permissoes.md) | Quais permissões? | `mcp-permissions-matrix.md` |
| [2.1.3](exercicio-2-1-configuracao-mcp/tarefas/2-1-3-criar-configuracao-mcp.md) | Criar `.mcp.json` | `.mcp.json` arquivo |
| [2.1.4](exercicio-2-1-configuracao-mcp/tarefas/2-1-4-analise-riscos-seguranca.md) | Riscos? | `mcp-security-analysis.md` |

### Exercício 2.2: Spec Driven Development

**Contexto:** Converter especificação técnica em tarefas implementáveis e executar.

**O Que Você Vai Entregar:**
- `tasks.md` com tarefas atômicas (5-8 tasks)
- Código da primeira task (Azure Function com validação)
- Code review crítica (2-3 problemas identificados + correções)

**Tempo:** ~3-5 horas por tarefa (10-15 horas total)

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.2.1](exercicio-2-2-spec-driven-development/tarefas/2-2-1-converter-plan-tasks.md) | Plan → Tasks | `tasks.md` estruturado |
| [2.2.2](exercicio-2-2-spec-driven-development/tarefas/2-2-2-implementar-primeira-task.md) | Implementar com Copilot | Código funcional |
| [2.2.3](exercicio-2-2-spec-driven-development/tarefas/2-2-3-revisar-criticamente-codigo.md) | Code review crítica | `code-review.md` |

### Exercício 2.3: Estratégia de Skills

**Contexto:** Documentar padrões como skills reutilizáveis (Foundation → Domain → Artifact).

**O Que Você Vai Entregar:**
- Árvore de skills (16-20 skills organizadas em hierarquia)
- Matriz de criação/consumo por papel
- SKILL.md Foundation (error handling com regras prescritivas)

**Tempo:** ~2-3 horas por tarefa (6-10 horas total)

| Tarefa | Foco | Entregável |
|--------|------|-----------|
| [2.3.1](exercicio-2-3-estrategia-skills/tarefas/2-3-1-definir-arvore-skills.md) | Que skills? | `skills-tree.md` |
| [2.3.2](exercicio-2-3-estrategia-skills/tarefas/2-3-2-mapeamento-consumo.md) | Quem cria/consome? | `creation-consumption-matrix.md` |
| [2.3.3](exercicio-2-3-estrategia-skills/tarefas/2-3-3-skill-foundation.md) | SKILL de error handling | `SKILL-error-handling.md` |

---

## Dependências Entre Tarefas

```
Exercício 2.1 (Configuração MCP)
├── 2.1.1 (Mapear servers) — INPUT: sistemas do projeto
├── 2.1.2 (Permissões) ← DEPENDE DE 2.1.1
├── 2.1.3 (Config) ← DEPENDE DE 2.1.1, 2.1.2
└── 2.1.4 (Riscos) ← DEPENDE DE 2.1.1, 2.1.2, 2.1.3

Exercício 2.2 (Spec Driven Development)
├── 2.2.1 (Plan → Tasks) — INPUT: plan.md do query endpoint
├── 2.2.2 (Implementar) ← DEPENDE DE 2.2.1
└── 2.2.3 (Code Review) ← DEPENDE DE 2.2.2

Exercício 2.3 (Estratégia de Skills)
├── 2.3.1 (Árvore de skills) — INPUT: artefatos do projeto (de 2.2)
├── 2.3.2 (Criação/Consumo) ← DEPENDE DE 2.3.1
└── 2.3.3 (SKILL Foundation) ← DEPENDE DE 2.3.1, 2.3.2 (entende padrões)

Dependências Cross-Exercício:
├── 2.2 ← usa padrões que podem estar em 2.1 (MCP, env config)
└── 2.3 ← consolida aprendizados de 2.1 e 2.2 em skills reutilizáveis
```

---

## Checklist de Completude

### Exercício 2.1
- [ ] `mcp-servers-mapping.md` — 5+ servers mapeados
- [ ] `mcp-permissions-matrix.md` — Matriz servers × papéis
- [ ] `.mcp.json` — Arquivo sintaticamente válido
- [ ] `mcp-security-analysis.md` — 2-3 riscos identificados + mitigações

### Exercício 2.2
- [ ] `tasks.md` — 5-8 tasks atômicas com critérios de aceite
- [ ] Código `src/functions/query.ts` — Compila e valida input/output
- [ ] `code-review.md` — 2-3 críticas reais (não triviais)

### Exercício 2.3
- [ ] `skills-tree.md` — 3+ Foundation, 5+ Domain, 8+ Artifact skills
- [ ] `creation-consumption-matrix.md` — Matriz skills × papéis
- [ ] `SKILL-error-handling.md` — 4+ core rules, 3+ anti-patterns, exemplos de código

---

## Próximos Passos

Após completar os 3 exercícios, você estará pronto para:

1. **Tech Lead Role (Fase 2):** Usar estes documentos para validar implementações futuras
2. **QA Role (Fase 2):** Usar skills para estruturar testes
3. **Consolidação:** Arquivar skills em `/skills/` para reutilização em futuros endpoints

---

## Perguntas Frequentes

**P: Preciso fazer todas as 10 tarefas na ordem?**  
R: Não. Respeite as dependências (2.1 antes de 2.2 em geral, 2.2.1 antes de 2.2.2), mas você pode paralelizar tarefas do mesmo exercício.

**P: Quanto tempo cada tarefa leva?**  
R: 2-5 horas, dependendo da profundidade. Veja estimativas acima. Se está demorando muito mais, peça ajuda de Claude.

**P: E se discordar das regras do exercício?**  
R: Documente sua posição. Se for desacordo legítimo com a spec, discuta com o Tech Lead.

**P: Posso usar IA (Claude, Copilot) para ajudar?**  
R: Sim! Use Claude para brainstorm, estruturar documentos, iterar. Use Copilot para gerar código. O exercício é aprender a pensar como Dev e estruturador, não digitar.

**P: Os documentos precisam ser "perfeitos"?**  
R: Não. Precisam ser **úteis** (alguém consegue implementar) e **consistentes** (sem contradições entre tarefas).

---

## Referência Rápida

| Exercício | Tipo | Tamanho Total | Público |
|-----------|------|---------------|---------|
| 2.1 | Infraestrutura | ~15-20 páginas | Devs, Security |
| 2.2 | Implementação | ~20-30 páginas | Devs, QA |
| 2.3 | Padrões | ~25-35 páginas | Devs, Tech Lead, Team |

---

## Estrutura Esperada ao Final

```
desenvolvedor/
├── exercicio-2-1-configuracao-mcp/
│   ├── README.md
│   ├── tarefas/
│   │   ├── 2-1-1-mapear-mcp-servers.md
│   │   ├── 2-1-2-definir-permissoes.md
│   │   ├── 2-1-3-criar-configuracao-mcp.md
│   │   └── 2-1-4-analise-riscos-seguranca.md
│   └── entregaveis/
│       ├── mcp-servers-mapping.md ✓
│       ├── mcp-permissions-matrix.md ✓
│       ├── .mcp.json ✓
│       └── mcp-security-analysis.md ✓
│
├── exercicio-2-2-spec-driven-development/
│   ├── README.md
│   ├── tarefas/
│   │   ├── 2-2-1-converter-plan-tasks.md
│   │   ├── 2-2-2-implementar-primeira-task.md
│   │   └── 2-2-3-revisar-criticamente-codigo.md
│   └── entregaveis/
│       ├── tasks.md ✓
│       ├── query.ts ✓
│       └── code-review.md ✓
│
├── exercicio-2-3-estrategia-skills/
│   ├── README.md
│   ├── tarefas/
│   │   ├── 2-3-1-definir-arvore-skills.md
│   │   ├── 2-3-2-mapeamento-consumo.md
│   │   └── 2-3-3-skill-foundation.md
│   └── entregaveis/
│       ├── skills-tree.md ✓
│       ├── creation-consumption-matrix.md ✓
│       └── SKILL-error-handling.md ✓
│
└── INDEX.md (este arquivo)
```

---

## Boa Sorte! 🚀

Você está estruturando os blocos de construção do projeto. Quando terminar, o NovaTech Logistics Assistant terá:
- ✓ Infraestrutura de integração clara (MCP)
- ✓ Processo de desenvolvimento estruturado (SDD)
- ✓ Padrões reutilizáveis documentados (Skills)

Isso é **muita coisa** — respire, trabalhe consistentemente, e peça ajuda quando precisar.
