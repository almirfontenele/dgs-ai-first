# Avaliação — Desenvolvedor (Exercício 3.1)

**Programa:** Trilha de Certificação AI First — DGS / DB1 Global Software  
**Papel:** Desenvolvedor  
**Exercício:** 3.1 — Structured output e verificações determinísticas  
**Tópico:** Harness Engineering  
**Data:** 2026-06-29  
**Avaliador:** LLM-as-Judge (Claude Sonnet 4.6)

---

## Resultado

**Score final: 3.0 / 3.0 — Aprovado com distinção**

---

## Critérios

| Critério | Score | Evidência |
|----------|-------|-----------|
| Schema de structured output | 3 | `response-schema.ts`: schema Zod com campos obrigatórios (`answer`, `source_document`, `confidence_score`), tipos corretos, `.strict()` para rejeitar campos extras, `.min(1)` e range `0–1` em `confidence_score` |
| Guardrail 1 (source_document) | 3 | `response-validator.ts`: bloqueia schema inválido via `safeParse` e bloqueia explicitamente `source_document` vazio ou `"N/A"`, retornando `SAFE_FALLBACK` — não apenas loga |
| Guardrail 2 (carga perigosa + devolução) | 3 | Regex com variações (`devolu[cç][aã]o`, `devolver`, `aceita devolução`) + verificação de negação explícita (`não`, `impossível`, `vedada`) — não burlável por respostas que negam a devolução |
| Code review com Claude | 3 | 4 problemas identificados e corrigidos: schema sem `.strict()`, `console.log` vs `pino`, regex simplista do guardrail 2, retorno `null` vs `SAFE_FALLBACK` |
| Probabilístico vs determinístico | 3 | Tabela explícita no code review distinguindo prompt (probabilístico) de schema + guardrails (determinístico); argumento claro de por que o código complementa o prompt |

---

## Pontos fortes

- **Guardrail 2 robusto:** A implementação vai além do mínimo pedido — verifica negação explícita, evitando falsos positivos (bloquear respostas corretas que mencionam a regra para negá-la).
- **`.strict()` no schema:** Detalhe que fecha uma brecha de contorno — campos extras silenciosos são um vetor real de bypass.
- **`SAFE_FALLBACK` tipado:** Retorno discriminado (`ValidationResult`) elimina o risco de o consumidor ignorar falhas.
- **Code review honesto:** Identifica 4 problemas — dois estruturais (schema, null return) e dois de qualidade/compliance (console.log, regex) — com correções concretas aplicadas.

## Observações

- O `AGENTS.md` exige `pino 8.x` como logger; a implementação está em conformidade.
- A distinção probabilístico vs determinístico está documentada de forma didática e precisa — aspecto frequentemente negligenciado.

---

## Checklist dos critérios de avaliação do README

- [x] O schema de structured output é válido e usa Zod corretamente
- [x] Os 2 guardrails realmente bloqueiam respostas inválidas (não apenas logam)
- [x] O code review identifica problemas reais (não inventados)
- [x] A distinção entre prompt (probabilístico) e código (determinístico) fica clara
