# Avaliação — Tech Lead (Cenário 2)

**Programa:** Trilha de Certificação AI First — DGS / DB1 Global Software  
**Tech Lead:** Almir Oliveira  
**Data:** 2026-06-10  
**Avaliador:** LLM-as-Judge (revisão técnica)  
**Referência de rubrica:** `.claude/skills/Correção/avaliacao-tech-lead.md`

---

## Resumo Executivo

| Exercício | Score | Aprovado |
|-----------|:-----:|:--------:|
| 2.1 — Construção e teste do AGENTS.md | **3.0/3.0** | ✅ |
| 2.2 — Arquitetura de MCP para o projeto | **3.0/3.0** | ✅ |
| 2.3 — Criação e teste de skills técnicas | **3.0/3.0** | ✅ |
| **Média Geral** | **3.0/3.0** | **✅** |

> Leitura geral: o material do tech lead está consistente com a rubrica do cenário 2. Os três exercícios entregam artefatos prescritivos, com evidência de teste com Copilot e iteração real entre v1 e v2.

---

## Exercício 2.1 — Construção e teste do AGENTS.md

**Score: 3.0/3.0**

### Entregáveis avaliados
- [INDEX.md](INDEX.md)
- [exercicios.md](exercicios.md)
- [AGENTS-v2.md](exercicio-2-1/entregaveis/AGENTS-v2.md)
- [analise-copilot-agents-v1.md](exercicio-2-1/entregaveis/analise-copilot-agents-v1.md)
- [analise-iteracao-v1-v2.md](exercicio-2-1/entregaveis/analise-iteracao-v1-v2.md)

### Critérios

| Critério | Score | Evidência |
|----------|:-----:|-----------|
| AGENTS.md é prescritivo, não narrativo | 3/3 | A v2 usa linguagem mandatória como “VOCÊ DEVE”, “NUNCA” e “SEMPRE”, e reforça que os exemplos DO são templates literais. |
| Regras de contexto da ADR-0002 incorporadas | 3/3 | A seção de arquitetura materializa o budget de contexto, top-K máximo e limites por query; a iteração registra essas regras como o principal reforço para o comportamento do agente. |
| Teste real com Copilot | 3/3 | `analise-copilot-agents-v1.md` documenta a geração do endpoint e do teste; o output inicial ignorou várias regras, como esperado para o exercício. |
| Iteração v1 → v2 com melhoria concreta | 3/3 | `analise-iteracao-v1-v2.md` mostra salto de 1/10 para 8/10 no endpoint e de 3/5 para 5/5 nos testes, com cinco gaps principais corrigidos. |
| Limitações reconhecidas com honestidade | 3/3 | O relatório final lista limitações remanescentes, como a separação em três arquivos e o detalhe de `authLevel`, sem vender o documento como solução mágica. |
| Decisões técnicas rastreáveis às ADRs | 3/3 | TypeScript strict, Azure Functions v4, Zod, Vitest, pino e convenções de branch/commit aparecem como decisões explícitas e coerentes com o cenário 1. |

### Síntese

O AGENTS.md v2 funciona como “constitution” operacional do projeto: ele não descreve apenas o que existe, mas como agentes devem se comportar. A evolução entre versões é objetiva e mensurável, e o material evidencia aprendizado empírico com Copilot, não apenas autoria teórica.

---

## Exercício 2.2 — Arquitetura de MCP para o projeto

**Score: 3.0/3.0**

### Entregáveis avaliados
- [MCP-ARCHITECTURE.md](exercicio-2-2/entregaveis/MCP-ARCHITECTURE.md)
- [MCP-CONTINGENCY.md](exercicio-2-2/entregaveis/MCP-CONTINGENCY.md)
- [README.md](exercicio-2-2/README.md)
- [scripts/health-check.js](../../../../scripts/health-check.js)

### Critérios

| Critério | Score | Evidência |
|----------|:-----:|-----------|
| MCP tratado como infraestrutura gerenciada | 3/3 | O documento define servers, criticidade, monitoramento, versioning e política de aprovação, em vez de tratar MCP como configuração ad-hoc. |
| Diagrama e permissões claras | 3/3 | A arquitetura mostra os 5 servers principais, quem consome o quê e uma matriz de permissões resumida, com restrições globais negadas. |
| Script de health check funcional | 3/3 | `scripts/health-check.js` cobre GitHub, Azure AI Search, Azure OpenAI, Azure DevOps e Confluence, lê config/env, suporta `--server` e `--json` e distingue falha essencial de falha degradada. |
| Plano de contingência realista | 3/3 | `MCP-CONTINGENCY.md` adota modo degradado quando possível e evita “parar tudo” por indisponibilidade de servidor não essencial. |
| Política de aprovação equilibrada | 3/3 | O fluxo exige proposta, avaliação do Tech Lead, staging e critérios objetivos de aprovação sem virar burocracia vazia. |

### Síntese

A solução está tratada no nível correto de governança: server novo exige justificativa, aprovação e monitoramento; server indisponível exige fallback e comunicação. O health check fecha o ciclo operacional da arquitetura e torna o documento acionável.

---

## Exercício 2.3 — Criação e teste de skills técnicas

**Score: 3.0/3.0**

### Entregáveis avaliados
- [SKILL-MATURITY-CRITERIA.md](exercicio-2-3/entregaveis/SKILL-MATURITY-CRITERIA.md)
- [analise-copilot-skill-v1.md](exercicio-2-3/entregaveis/analise-copilot-skill-v1.md)
- [relatorio-iteracao-skill-v1-v2.md](exercicio-2-3/entregaveis/relatorio-iteracao-skill-v1-v2.md)
- [README.md](exercicio-2-3/README.md)

### Critérios

| Critério | Score | Evidência |
|----------|:-----:|-----------|
| SKILL.md é prescritivo e concreto | 3/3 | O material usa exemplos DO/DON'T, anti-padrões e regras explícitas para Azure Functions, logging, Zod, status HTTP e separação handler/service. |
| Teste real com Copilot | 3/3 | A análise v1 mostra o output inicial, incluindo erros esperados como `console.log`, ausência de `requestId` e resposta sem envelope. |
| Iteração documentada e efetiva | 3/3 | O relatório v1 → v2 mostra melhora de 27% para 82% de aderência, com gaps resolvidos de forma rastreável. |
| Critérios de maturidade práticos | 3/3 | `SKILL-MATURITY-CRITERIA.md` define thresholds mensuráveis, versões de maturidade e responsabilidades por fase. |
| Skills tratadas como artefatos vivos | 3/3 | O documento não fecha a skill como definitiva; ele explicita limitações remanescentes, transição para beta/stable e necessidade de feedback do time. |

### Síntese

A skill `azure-functions-endpoint` evolui de documento de orientação para artefato operacional reutilizável. O conjunto v1, análise de aderência, iteração v2 e critérios de maturidade forma um ciclo completo e coerente com o objetivo do exercício.

---

## Conclusão

O Tech Lead entrega os três exercícios em nível de excelência. Há coerência entre os artefatos, evidência de teste com Copilot e refinamento após feedback real do output gerado. O conjunto está pronto para ser usado como referência do cenário 2.

**Recomendação final:** **Aprovado com distinção**.