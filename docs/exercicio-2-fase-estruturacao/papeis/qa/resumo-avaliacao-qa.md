# Avaliação — Role QA — Exercícios Fase 2 (Estruturação)

**Programa:** AI First Certification  
**Avaliado em:** 2026-06-11  
**Branch:** cenario-2  
**Avaliador:** LLM-as-Judge (3 subagentes independentes)

---

## Resultado Geral

| Exercício | Nota | Status |
|---|---|---|
| 2.1 — Testing Standards | **3.0 / 3.0** | ✅ Aprovado com distinção |
| 2.2 — Test Plan SDD | **3.0 / 3.0** | ✅ Aprovado com distinção |
| 2.3 — Skill de Geração de Testes | **3.0 / 3.0** | ✅ Aprovado com distinção |
| **Média Geral** | **3.0 / 3.0** | ✅ **Aprovado com distinção** |

---

## Exercício 2.1 — Testing Standards

### Notas por Entregável

| Entregável | Nota | Justificativa |
|---|---|---|
| `testing-standards.md` | **3.0** | Completo, prescritivo, exemplos ancorados no domínio NovaTech, regras verificáveis |
| `test-refactoring.md` | **3.0** | Três versões entregues (incluindo a opcional V3), rastreabilidade bidirecional para o testing-standards.md |
| `review-criteria.md` | **3.0** | 8 critérios com exemplos ✓/✗, tabela de erros comuns de IA, checklist executivo |

### Pontos Fortes

- **Rastreabilidade bidirecional:** cada versão do `test-refactoring.md` referencia a seção exata do `testing-standards.md` que motivou a melhoria
- **Domínio NovaTech 100% presente:** rotas (SP→AM, RJ→CE), IDs de documento reais, tipos de carga com terminologia correta
- **`review-criteria.md` vai além do mínimo:** tabela "Erros Comuns de IA" mapeia padrões incorretos de LLMs para os critérios que os reprovam

### Gaps Identificados

- **`test-refactoring.md` Versão 1, linha ~47:** `toBeDefined()` ainda presente viola formalmente o Critério 3 do `review-criteria.md` — pode confundir quem a usa como exemplo de "teste básico aceitável"
- **Fixture `slaQuestions.spToRj`** referenciada na Versão 2 não existe no `testing-standards.md` (há `spToManaus` e `rjToFortaleza`) — inconsistência que quebraria o código se copiado
- **Critério 8 (Coverage):** classificado como "Importante" no `review-criteria.md` mas o `testing-standards.md` diz que o CI bloqueia build — contradição operacional

### Recomendações

1. Substituir `toBeDefined()` na V1 por assertion mínima válida (ex: `toMatch(/^[a-z]/)`) mantendo progressão pedagógica
2. Adicionar chave `spToRj` ao fixture `slaQuestions` no `testing-standards.md`
3. Alinhar Critério 8 para "Crítico" ou adicionar nota sobre bloqueio automático do CI

---

## Exercício 2.2 — Test Plan SDD

### Notas por Entregável

| Entregável | Nota | Justificativa |
|---|---|---|
| `test-plan.md` | **3.0** | 16 cenários por 4 VCs, dados realistas, critérios de aprovação detalhados, seção de desempenho |
| `robustness-tests.md` | **3.0** | 5 categorias de risco, 17 casos com inputs realistas, mitigações com regex testável |
| `cowork-test-tracker.md` | **3.0** | Tabela rastreável, sumários por VC e por risco, roadmap de 4 fases com critérios de avanço |

### Pontos Fortes

- **Dados sem genericidade:** queries usam rotas reais, documentos com IDs padronizados (`POL-SLA-001`), terminologia logística correta (LTL/FTL, IMDG/ANTT)
- **Riscos de IA sofisticados:** cobre injeção via chunk malicioso no pipeline de ingestão (R5-4) e escalada gradual com qualificador de baixo risco (R4-2)
- **Cowork como instrumento operacional real:** roadmap com 4 fases, critério de bloqueio para falhas críticas, dependências com justificativa técnica

### Gaps Identificados

- **Cowork subestima cobertura:** TC-03-3, TC-03-4, TC-04-3, TC-04-4 existem no `test-plan.md` mas não aparecem na tabela principal do `cowork-test-tracker.md`
- **TR-02-3 ausente no tracker:** caso R2-3 existe no `robustness-tests.md` mas não foi incluído no Cowork sem critério explícito de exclusão
- **Ambiente de referência ausente em VC-01:** critério "95 de 100 queries < 30s" não especifica carga concorrente, ambiente (homologação/staging) ou se as queries são fixas

### Recomendações

1. Decidir escopo do Cowork: incluir todos os TCs/TRs com coluna "Ciclo" ou documentar formalmente que o Cowork rastreia apenas subconjunto crítico
2. Adicionar TR-02-3 ao tracker ou documentar critério de exclusão no cabeçalho da seção de robustez
3. Incluir campo "Ambiente de Execução" no Cowork: versão do sistema, usuários concorrentes, configuração da base de conhecimento

---

## Exercício 2.3 — Skill de Geração de Testes

### Notas por Entregável

| Entregável | Nota | Justificativa |
|---|---|---|
| `create-integration-test.md` | **3.0** | Activation phrase, regras DO/DON'T, template com 3 cenários, 10 anti-padrões com código correto |
| `test-review-checklist.md` | **3.0** | C1–C8 críticos, I1–I4 importantes, N1–N3 nice-to-have, scorecard, FAQ com 6 perguntas |

### Pontos Fortes

- **Anti-padrões cirúrgicos:** 10 padrões com código errado anotado inline, risco real explicado e código correto correspondente
- **Template com 3 cenários estruturados** (happy path, low score, 503) com placeholders explícitos sobre origem dos dados
- **Checklist com rastreabilidade de ponta a ponta:** IDs C1–C8/I1–I4/N1–N3, feedback com código de exemplo, integração CI (pre-commit + GitHub Actions/Azure DevOps)

### Gaps Identificados

- **Feedback de I1 no checklist contraditório:** bloco "Correto" reproduz o mesmo dado inline que o bloco "Errado" proibiu — não mostra importação real do helper `freightChunks.spToFortaleza`
- **Localização do helper de fixtures ausente:** skill referencia `freightChunks.*` e `slaQuestions.*` mas não indica onde o arquivo vive no projeto
- **Scorecard sem linha de exemplo:** pré-populado só com IDs sem uma linha preenchida ficticiamente — a tarefa 2.3.2 exigia ao menos um exemplo completo

### Recomendações

1. Corrigir feedback de I1: substituir bloco "Correto" por importação real (`import { freightChunks } from '@/tests/fixtures/freight'`)
2. Adicionar callout no template indicando caminho canônico do helper de fixtures no projeto
3. Preencher primeira linha do scorecard com dados fictícios de exemplo (revisor, data, resultado, notas)

---

## Síntese e Próximos Passos

Os três exercícios demonstram domínio sólido das três camadas de qualidade definidas no INDEX.md:

| Camada | Entregável | Status |
|---|---|---|
| Standards | `testing-standards.md` + `review-criteria.md` | ✅ Pronto para uso |
| Specification | `test-plan.md` + `robustness-tests.md` + `cowork-test-tracker.md` | ✅ Pronto para uso |
| Skills | `create-integration-test.md` + `test-review-checklist.md` | ✅ Pronto para uso |

Os gaps identificados são pequenos e corrigíveis em 1-2 horas. Nenhum invalida os entregáveis. A avaliação recomenda **aprovação com distinção** e aplicação imediata no onboarding de QAs e integração em CI/CD.

**Ação recomendada:** corrigir os 9 gaps acima antes do uso em produção (prioridade: inconsistência de fixtures no 2.1, ambiente de referência do VC-01 no 2.2, e scorecard sem exemplo no 2.3).
