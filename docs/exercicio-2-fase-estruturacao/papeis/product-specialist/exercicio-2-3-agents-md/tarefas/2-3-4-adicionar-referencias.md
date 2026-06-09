# Tarefa 2.3.4 — Adicionar Referências a Documentos de Spec

## Objetivo
Documentar todas as referências cruzadas entre a seção "Product Rules & Guardrails" do AGENTS.md e os documentos de spec no repositório, criando um índice navegável.

## Contexto
O `AGENTS.md` não é um arquivo isolado. Ele faz referência a:
- Documentos de requisitos (requirements.md)
- Documentos de guardrails (guardrails.md)
- Glossário (glossary.md)
- Documentação de domínio (Anexo A: NovaTech docs)
- Estrutura do repositório (Anexo C)

Um desenvolvedor precisa saber onde encontrar cada documento.

## Tarefa

### Passo 1: Mapear Todos os Documentos de Spec
Crie uma lista de todos os documentos que alimentam o `AGENTS.md`:

```markdown
# Mapa de Documentos de Spec

## Documentos Internos (no repositório)

### Phase 2 Deliverables (Estruturação)
- [ ] `requirements.md` — Especificação SDD dos requisitos (produto)
- [ ] `guardrails.md` — Guardrails detalhados (DEVE/NÃO DEVE/QUANDO)
- [ ] `bounded-contexts.md` — Mapa de bounded contexts do domínio
- [ ] `linguagem-ubiqua.md` — Glossário expandido de termos

### Documentação de Domínio (Anexo A)
- [ ] `POL-001-politica-devolucao.md` — Política de Devolução
- [ ] `PROC-042-v2-frete-especial-revisado.md` — Procedimento de Frete v2
- [ ] `SLA-2024-tabela-sla-clientes.md` — Tabela SLA
- [ ] `FAQ-atendimento.md` — FAQ de atendimento

### Estrutura & Configuração (Anexo C)
- [ ] Mapa de diretórios do repositório
- [ ] Padrões de nomeação
- [ ] Convenções de versionamento

## Documentos Externos (Referência)
- [ ] Arquitetura RAG (do phase 1, simulado)
- [ ] ADRs de arquitetura (ADR-0001, 0003, 0004)
```

### Passo 2: Criar Tabela de Rastreabilidade
Para cada seção do AGENTS.md, mapear para documento de origem:

```markdown
# Rastreabilidade: AGENTS.md → Documentos de Spec

## Product Rules & Guardrails → Guardrails.md

| Regra do AGENTS | Seção em guardrails.md | Tarefas Relacionadas |
|---|---|---|
| DEVE citar fonte | DEVE (Comportamentos Obrigatórios) | 2.2.1, 2.2.2 |
| NÃO DEVE inventar valores | NÃO DEVE (Comportamentos Proibidos) | 2.2.1, 2.2.2, 2.2.3 |
| Carga perigosa ≠ devolução | NÃO DEVE + Rastreabilidade Incidente 1 | 2.2.1, 2.2.3 |
| Versão mais recente | QUANDO EM DÚVIDA | 2.2.1, 2.2.2, 2.2.3 |
| Baixa confiança → escalação | QUANDO EM DÚVIDA | 2.2.2, 2.3.3 |

---

## Glossário → Linguagem Ubíqua

| Termo no Glossário | Seção em linguagem-ubiqua.md | Fonte Anexo A |
|---|---|---|
| Cliente Gold | Seção 1: Clientes & Tiers | SLA-2024, seção 3.1 |
| Cliente Silver | Seção 1: Clientes & Tiers | SLA-2024, seção 3.2 |
| Carga Perigosa | Seção 2: Logística | POL-001, PROC-042, ANTT |
| Frete Especial | Seção 2: Logística | PROC-042 v2 |
| Multiplicador Regional | Seção 2: Logística | PROC-042 v2, tabelas |

---

## Code Restrictions → Requirements + Guardrails

| Restrição de Código | Requer Guardrail | Requer Requirement |
|---|---|---|
| source_document obrigatório | DEVE citar fonte | Verification criteria |
| Números validados | NÃO DEVE inventar | Constraint: nunca inventar |
| Termos bloqueados | NÃO DEVE (carga perigosa) | — |
| RAG confidence threshold | QUANDO EM DÚVIDA | Constraint: escalação |
| Versão priorizada | QUANDO EM DÚVIDA | Constraint: usar v2 |
```

### Passo 3: Criar Índice de Referências
Arquivo `referencia-cruzada.md`:

```markdown
# Índice de Referências Cruzadas

## Leia em Sequência (Ordem de Descoberta)

### Para Entender Requisitos
1. **Comece aqui:** `requirements.md` (Tarefa 2.1.3)
   - Outcomes, Scope, Constraints, Prior Decisions, Verification Criteria
   - **Tempo:** 10 min

2. **Depois:** `bounded-contexts.md` (Tarefa 2.1.1)
   - Entender divisões do domínio
   - **Tempo:** 5 min

3. **Depois:** `linguagem-ubiqua.md` (Tarefa 2.1.2)
   - Definições de termos críticos
   - **Tempo:** 10 min

### Para Implementar Guardrails
1. **Comece aqui:** `guardrails.md` (Tarefa 2.2.1)
   - DEVE, NÃO DEVE, QUANDO EM DÚVIDA
   - **Tempo:** 15 min

2. **Depois:** `enforcement-matrix.md` (Tarefa 2.2.2)
   - Decidir Prompt vs Código para cada guardrail
   - **Tempo:** 10 min

3. **Depois:** `rastreabilidade-incidentes.md` (Tarefa 2.2.3)
   - Entender que cada guardrail previne um incidente real
   - **Tempo:** 10 min

### Para Implementar Código
1. **Comece aqui:** `code-restrictions.md` (Tarefa 2.3.3)
   - Schema, validações, testes
   - **Tempo:** 20 min

2. **Referência:** `guardrails.md` + `enforcement-matrix.md`
   - Saber o quê implementar e por quê
   - **Tempo:** 15 min (re-read)

### Para Escrever Prompts
1. **Comece aqui:** `glossario.md` (Tarefa 2.3.2)
   - Termos críticos para system prompt (ALTO risco de confusão)
   - **Tempo:** 10 min

2. **Referência:** `guardrails.md` (seção DEVE)
   - Comportamentos esperados
   - **Tempo:** 10 min

3. **Referência:** `requirements.md` (outcomes)
   - O quê o usuário espera
   - **Tempo:** 5 min

---

## Documentação de Domínio (Leitura Autônoma)

### Quando Necessário
Consulte os documentos do Anexo A conforme necessário para **verificar valores específicos**:

- **SLA-2024:** Prazos por tier (Gold = 4h, Silver = 8h, Standard = 24h)
- **PROC-042 v2:** Multiplicadores regionais, versão vigente desde 2026-06-01
- **POL-001:** Restrições de devolução, especialmente cargas perigosas
- **FAQ-atendimento:** Perguntas frequentes e padrões de resposta

Esses documentos são a **fonte de verdade**. Se houver dúvida entre requirements.md e POL-001, **POL-001 vence**.

---

## Estrutura do Repositório (Anexo C)

Para encontrar arquivos:
- Documentos de domínio: `/docs/anexos/`
- Documentos de especificação: `/docs/papeis/product-specialist/exercicio-2-3-agents-md/`
- Código do assistente: `/src/` (não documentado aqui)
- Testes: `/tests/`

---
```

### Passo 4: Documentar Links de Navegação
Estruture cada seção do AGENTS.md para incluir links:

```markdown
## Product Rules & Guardrails

**Documentos relacionados:**
- Guardrails completos: [guardrails.md](../exercicio-2-2-guardrails/guardrails.md)
- Enforcement matrix: [enforcement-matrix.md](../exercicio-2-2-guardrails/enforcement-matrix.md)
- Rastreabilidade a incidentes: [rastreabilidade-incidentes.md](../exercicio-2-2-guardrails/rastreabilidade-incidentes.md)

### DEVE (Comportamentos Obrigatórios)

#### Regra 1: Sempre Citar Fonte
*Veja também: [guardrails.md — Seção DEVE](../exercicio-2-2-guardrails/guardrails.md#deve-comportamentos-obrigatórios) e [requirements.md — Verification Criteria](../exercicio-2-1-dominio-spec/requirements.md#verification-criteria)*

[...]

---

## Glossário

**Documentos relacionados:**
- Linguagem ubíqua expandida: [linguagem-ubiqua.md](../exercicio-2-1-dominio-spec/linguagem-ubiqua.md)
- Fonte de domínio (Anexo A): [anexos/SLA-2024-tabela-sla-clientes.md](../../anexos/SLA-2024-tabela-sla-clientes.md)

[...]
```

### Passo 5: Criar "Navegação Rápida"
Um índice visual mostrando onde encontrar cada tipo de informação:

```markdown
# Navegação Rápida

## "Como faço para..."

### ...Entender o que o assistente deve fazer?
→ [requirements.md](./requirements.md) / [AGENTS.md — Outcomes](./AGENTS.md#outcomes)

### ...Saber quais termos usar?
→ [glossario.md](./glossario.md) / Términos com RISCO ALTO

### ...Implementar uma validação?
→ [code-restrictions.md](./code-restrictions.md) / Schema JSON

### ...Testar se cumpre requisitos?
→ [requirements.md](./requirements.md) / Verification Criteria

### ...Entender por quê uma regra existe?
→ [rastreabilidade-incidentes.md](./rastreabilidade-incidentes.md) / [Qual incidente previne]

### ...Encontrar um documento versionado?
→ [code-restrictions.md](./code-restrictions.md) / Versão Priorizada

---
```

## Entregável
Um arquivo `referencias-cruzadas.md` para `AGENTS.md` contendo:
- [ ] Mapa de todos os documentos de spec
- [ ] Tabela de rastreabilidade (regras → documentos)
- [ ] Índice de referências por papel (dev, QA, PM)
- [ ] Links de navegação nas seções do AGENTS.md
- [ ] "Navegação Rápida" por tarefa comum

## Critério de Sucesso
Um desenvolvedor novo consegue:
1. Encontrar um documento referenciado sem buscar no Google
2. Navegar de AGENTS.md para guardrails.md sem se perder
3. Saber se deve consultar Anexo A ou uma spec interna
4. Rastrear uma regra até o incidente que a motivou
5. Validar se seu código implementa o que foi requisitado
