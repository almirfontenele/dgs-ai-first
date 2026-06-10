# Avaliação — Desenvolvedor (Cenário 2)

**Programa:** Trilha de Certificação AI First — DGS / DB1 Global Software  
**Desenvolvedor:** Almir Oliveira  
**Data:** 2026-06-10 (revisão — gaps G1/G2/G3 corrigidos em 2026-06-10)  
**Avaliador:** LLM-as-Judge (claude-sonnet-4-6)  
**Referência de rubrica:** `.claude/skills/Correção/avaliacao-desenvolvedor.md`

---

## Resumo Executivo

| Exercício | Score anterior | Score atual | Aprovado |
|-----------|:--------------:|:-----------:|:--------:|
| 2.1 — Configuração de MCP Servers | 2.6/3.0 | **3.0/3.0** | ✅ |
| 2.2 — Implementação com SDD | 2.5/3.0 | **3.0/3.0** | ✅ |
| 2.3 — Estratégia de Skills | 3.0/3.0 | **3.0/3.0** | ✅ |
| **Média Geral** | **2.7/3.0** | **3.0/3.0** | **✅** |

> **Atualização 2026-06-10:** Os três gaps da avaliação anterior (G1, G2, G3) foram corrigidos. Ver seção de histórico ao final.

---

## Exercício 2.1 — Configuração de MCP Servers

**Score: 2.6/3.0**

### Entregáveis avaliados
- `entregaveis/exercicio-2.1-mapeamento-mcp.md`
- `entregaveis/exercicio-2.1-riscos-seguranca.md`
- `exercicio-2-1-configuracao-mcp/entregaveis/mcp-permissions-matrix.md`
- `.mcp/mcp.json`

### Critérios

| Critério | Score | Evidência |
|----------|:-----:|-----------|
| 5 servers mapeados | 3/3 | 6 servers: GitHub, filesystem, Azure AI Search, Azure OpenAI, Azure DevOps, Confluence — cada um com tools/resources, quem consome, público vs. custom e permissões mínimas |
| Least privilege | 3/3 | Permissões granulares por papel e por operação. Confluence `read-only` explicitamente. Agente de IA com escopo mais restrito que qualquer papel humano. Filesystem com allowlist de diretórios. |
| Riscos de segurança específicos | 3/3 | Três riscos concretos ao projeto: Confluence com dados do cliente repassados a modelo cloud; filesystem expondo `.env`; credenciais Azure superprivilegiadas. Não genérico — cada risco nomeia o server, o cenário de abuso e a mitigação técnica. |
| .mcp.json válido | 3/3 | Arquivo em `.mcp/mcp.json` sintaticamente correto, 6 servers coerentes com o mapeamento, todas as credenciais em env vars (`${VAR}`). Confluence usa pacote `@novatech/mcp-confluence-readonly`, sinalizando restrição semântica. Filesystem com allowlist de paths. |
| Referencia Anexo C | 3/3 | ~~Gap corrigido em 2026-06-10.~~ `exercicio-2.1-mapeamento-mcp.md` agora cita explicitamente o Anexo C como base de configuração na seção de justificativa arquitetural. `.mcp.json` coerente com o exemplo do Anexo C. |

### Pontos de destaque
- A `mcp-permissions-matrix.md` vai além do exigido: define permissões cross-server para API keys, PII e logs de acesso — demonstra pensamento sistêmico sobre segurança.
- `maxResultsPerQuery: 10` e rate limit `5 req/min` no Confluence mostram mitigação operacional concreta, não apenas teórica.
- Processo com Copilot bem documentado: identifica que o Copilot gerou permissões binárias e descreve a refinação para granularidade por tool.

**Score 2.1: 3.0 / 3.0** *(score anterior: 2.6 — Gap G1 corrigido)*

---

## Exercício 2.2 — Implementação com SDD

**Score: 2.5/3.0**

### Entregáveis avaliados
- `exercicio-2-2-spec-driven-development/entregaveis/tasks.md`
- `exercicio-2-2-spec-driven-development/entregaveis/code-review.md`
- `src/functions/query.ts`

### Critérios

| Critério | Score | Evidência |
|----------|:-----:|-----------|
| Tasks atômicas | 3/3 | 6 tasks, cada uma com output independente e critério de aceite próprio. Tasks 2–4 foram separadas (embedding, search, prompt) em vez do bloco único que o Copilot gerou. |
| Critérios de aceite verificáveis | 3/3 | Comandos `curl` específicos com payloads exatos, assertions de tipo (`number[] com length 1536`), thresholds numéricos (`confidence < 0.3`, `< 500ms`). Não há critérios vagos como "funciona". |
| Código segue padrões do plan | 3/3 | `query.ts`: TypeScript, Zod schemas tipados, `app.http()` (Azure Functions v4), pino, sem `console.log`, sem secrets hardcoded, `httpStatusForErrorType()` mapeando todos os tipos. |
| Código segue Anexo C | 3/3 | ~~Gap G3 corrigido em 2026-06-10.~~ Código refatorado em três módulos em `src/functions/query/`: `handler.ts`, `validator.ts`, `response-builder.ts` — alinhado à estrutura de pasta do Anexo C. |
| Revisão crítica real | 3/3 | 3 críticas com evidência no código: (1) ausência de `requestId` — identificado e corrigido em `handler.ts`; (2) placeholder retorna 200 → substituído por guard 503; (3) `safeParse` output sem log de campo — substituído por log estruturado em `response-builder.ts`. Todas verificáveis diretamente no código. |
| Conecta com cenário 1 | 3/3 | ~~Gap G2 corrigido em 2026-06-10.~~ `tasks.md` agora tem seção "Contexto: Continuidade do Cenário 1" documentando o que o protótipo validou (top-K=5, detecção de conflito, campo `confidence`) e o que muda para produção (ChromaDB → Azure AI Search, Flask → Azure Functions). |

### Pontos de destaque
- A decomposição de tasks é pedagogicamente correta: o Copilot gerou 4 blocos grandes e o aluno os refatorou em 6 tasks atômicas com `Context Budget` explícito por task — demonstra compreensão real de SDD.
- `code-review.md` é cirúrgico: as 3 críticas têm código antes/depois, impacto e estimativa de esforço para corrigir. Nenhuma crítica cosmética.
- Referência cruzada entre tasks (ex: "Foundation Skill de Error Handling" na Task 2.2.1.2) mostra integração com o Exercício 2.3.

**Score 2.2: 3.0 / 3.0** *(score anterior: 2.5 — Gaps G2 e G3 corrigidos)*

---

## Exercício 2.3 — Estratégia de Skills

**Score: 3.0/3.0**

### Entregáveis avaliados
- `exercicio-2-3-estrategia-skills/entregaveis/skills-tree.md`
- `exercicio-2-3-estrategia-skills/entregaveis/creation-consumption-matrix.md`
- `exercicio-2-3-estrategia-skills/entregaveis/SKILL-error-handling.md`

### Critérios

| Critério | Score | Evidência |
|----------|:-----:|-----------|
| Árvore coerente com projeto | 3/3 | 17 skills (F1–F3, D1–D5, A1–A9) cobrindo o ciclo completo: endpoint RAG, testes de integração, componente React, ADRs, spec SDD. Skills que o projeto realmente usaria — não teóricas ou genéricas. |
| Criação/consumo multi-papel | 3/3 | Product Specialist cria D5/A9; QA cria A3; Frontend Developer cria D3/A4/A5; Developer cria A2; Tech Lead cria Foundation + Domain backend + Artifacts críticos. Delivery Manager consome apenas D4/A9. |
| SKILL.md Foundation concreto | 3/3 | `SKILL-error-handling.md`: 5 regras com DO/DON'T em TypeScript real, 4 anti-padrões, exemplos do projeto (Azure OpenAI timeout, Zod validation), checklist de 9 itens, FAQ de 4 perguntas, seção de exemplos por contexto. |
| Anti-padrões úteis | 3/3 | Anti-Pattern 3 (retry para Zod `safeParse` — determinístico, nunca muda) e Anti-Pattern 4 (falha silenciosa em analytics) são exatamente o que LLMs geram errado. Anti-Pattern 2 (expor stack trace) é diretamente relevante ao cenário. |
| Referencia Anexo C | 3/3 | Hierarquia `/skills/foundation/`, `/skills/domain/`, `/skills/artifact/` usada explicitamente nos caminhos de arquivo de cada skill. SKILL-error-handling referenciado como `/skills/foundation/SKILL-error-handling.md`. |

### Pontos de destaque
- A `creation-consumption-matrix.md` inclui **Governança de Skills** (quem aprova, como criar, como deprecar, como tornar mandatório, processo de update) — não exigido na rubrica mas demonstra maturidade de pensamento sobre ciclo de vida.
- A **Matriz de Adoção** com status atual (D4/D5/A6/A7/A9 em 100% pois já existem no projeto) conecta a árvore à realidade do cenário.
- Carga de trabalho estimada por papel (~180h Tech Lead no Y1) demonstra que o aluno pensa em viabilidade, não apenas em arquitetura.
- O processo com Copilot documenta uma iteração valiosa: o aluno pediu ao Copilot para sugerir skills para o Delivery Manager, o Copilot incluiu D1/D2 (técnicas demais), e o aluno corrigiu para D4/A9 — evidência de julgamento crítico real.

---

## Análise da Dimensão "Processo com Copilot" (GAP D2)

Todos os entregáveis têm seção `## Processo com Copilot` documentando:
- Prompt inicial enviado ao Copilot
- O que o Copilot gerou
- O que foi descartado (com justificativa)
- O que foi adicionado manualmente
- Iterações subsequentes

**Padrão consistente de uso:** O aluno usa o Copilot para gerar estrutura inicial e exemplos, mas identifica sistematicamente gaps de contextualização, granularidade e segurança que exigem refinamento manual. Isso é exatamente o comportamento esperado de um desenvolvedor AI-first que mantém julgamento próprio.

---

## Score Final

| Dimensão | 2.1 | 2.2 | 2.3 |
|----------|:---:|:---:|:---:|
| Completude técnica | 3.0 | 3.0 | 3.0 |
| Qualidade dos entregáveis | 3.0 | 3.0 | 3.0 |
| Referência ao Anexo C | 3.0 | 3.0 | 3.0 |
| Processo com Copilot | 3.0 | 3.0 | 3.0 |
| Conexão com contexto do cenário | 3.0 | 3.0 | 3.0 |
| **Score exercício** | **3.0** | **3.0** | **3.0** |

**Score médio geral: 3.0/3.0**

---

## Histórico de Correções

| Gap | Descrição original | Corrigido em | Como foi corrigido |
|-----|-------------------|:------------:|-------------------|
| G1 | Sem referência ao Anexo C no 2.1 | 2026-06-10 | Seção de justificativa arquitetural em `mapeamento-mcp.md` cita explicitamente o Anexo C |
| G2 | Sem conexão com Cenário 1 no 2.2 | 2026-06-10 | `tasks.md` recebeu seção "Contexto: Continuidade do Cenário 1" no início |
| G3 | `query.ts` arquivo único vs. pasta `query/` | 2026-06-10 | Código refatorado em `src/functions/query/` com `handler.ts`, `validator.ts`, `response-builder.ts` |

---

**Recomendação:** Aprovado com distinção. O candidato demonstra domínio de MCP, SDD e Skills, e o comportamento AI-first central da certificação: usar Copilot como acelerador mantendo julgamento técnico sobre o output. A resposta rápida aos gaps identificados (corrigidos no mesmo dia) confirma essa capacidade.
