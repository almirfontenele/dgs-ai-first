# Tarefa 2.2.2 — Classificar Enforcement: Prompt vs Código

## Objetivo
Para cada guardrail, decidir se será enforçado via **prompt** (probabilístico) ou via **código** (determinístico), e justificar a escolha.

## Contexto: Por Que a Classificação Importa?

### Enforcement via Prompt (Probabilístico)
- ✓ Flexível, adaptável, reflete nuances
- ✗ Não é garantido (LLM pode não seguir)
- **Exemplo:** "Responda em português formal" → o prompt sugere, mas o LLM pode ignorar
- **Quando usar:** Comportamentos que o LLM consegue aprender, que têm exceções

### Enforcement via Código (Determinístico)
- ✓ Garantido, testável, não falha
- ✗ Rígido, requer implementação antes de usar
- **Exemplo:** "Campo source_document obrigatório no JSON" → código valida antes de responder
- **Quando usar:** Restrições que não podem falhar, verificações de limite/segurança

## Tarefa

### Passo 1: Revisar Guardrails da Tarefa 2.2.1
Pegue cada guardrail e pergunte-se:
- É um comportamento que um LLM consegue aprender via prompt?
- É um comportamento que PRECISA ser garantido (compliance, segurança)?
- É um comportamento que pode ser validado automaticamente?

### Passo 2: Classificar e Justificar
Crie uma tabela em `enforcement-matrix.md`:

```markdown
# Matriz de Enforcement — Guardrails

## DEVE (Comportamentos Obrigatórios)

| Guardrail | Enforcement | Justificativa | Implementação |
|-----------|-------------|----------------|----------------|
| Citar fonte | **Código** | A resposta não é válida sem source_document. Validação JSON garante presença. | Validar campo obrigatório no schema JSON antes de retornar resposta |
| Linguagem formal | **Prompt** | LLM consegue aprender via instrução. Não é crítico se falhar ocasionalmente. | Instrução no system prompt: "Responda em português formal, sem gírias ou emojis" |
| Validação de índice | **Código** | Se a busca falhou, o código detecta (confiança < threshold). | Query RAG com threshold de confiança > 0.7 |

---

## NÃO DEVE (Comportamentos Proibidos)

| Guardrail | Enforcement | Justificativa | Implementação |
|-----------|-------------|----------------|----------------|
| Inventar valores | **Código + Prompt** | Crítico. Código valida (número está no índice?). Prompt reforça. | (1) Query RAG + validação se número existe nos documentos; (2) System prompt proíbe estimativas |
| Carga perigosa + devolução | **Código + Prompt** | Crítico. Lista de termos proibidos (classes 1-6 ANTT) valida antes de permitir resposta. | (1) Detecção de "carga perigosa" no input; (2) Bloqueio de "pode ser devolvida" se detectado |
| Versão desatualizada | **Código** | RAG pode retornar múltiplas versões. Código filtra, LLM escolhe mais recente. | RAG com metadados de versão/data; ordenar por data antes de passar ao LLM |

---

## QUANDO EM DÚVIDA (Fallbacks)

| Guardrail | Enforcement | Justificativa | Implementação |
|-----------|-------------|----------------|----------------|
| Baixa confiança → escalação | **Código** | Threshold automático não é negociável. | if confidence < 0.7: return escalation_required |
| Não encontrar informação | **Código** | Query RAG retorna confiança; se nenhum resultado, código detecta e força fallback. | if query_result.confidence < MIN_THRESHOLD: return not_found_message |
| Múltiplas versões | **Código + Prompt** | Código agrupa versões; prompt instrui LLM sobre priorização. | (1) Metadados RAG com data de documento; (2) System prompt: "Priorize versão mais recente" |

---
```

### Passo 3: Detalhar Implementações
Para cada guardrail com enforcement **Código**, especifique:

```markdown
## Guardrail: Citar Fonte

**Enforcement:** Código
**Nível de severidade:** CRÍTICO (compliance)

**Implementação:**
1. Schema JSON obrigatório:
   ```json
   {
     "response": "...",
     "source_document": "PROC-042, seção 2.1",  // OBRIGATÓRIO
     "confidence": 0.95
   }
   ```
2. Validação: Se `source_document` estiver vazio ou null, rejeitar resposta
3. Teste: QA verifica que 100% das respostas têm source_document preenchido

---

## Guardrail: Não Inventar Valores Numéricos

**Enforcement:** Código + Prompt
**Nível de severidade:** CRÍTICO (impacto operacional)

**Implementação:**
1. **Prompt:** System message inclui: "Nunca invente números. Se não tiver certeza do valor exato, diga 'Não encontrei o valor específico'."
2. **Código:** 
   - Para cada número na resposta (regex: `\d+\.?\d*`), validar se existe nos documentos indexados
   - Se número não for encontrado, não permitir resposta
   - Alternativa: LLM retorna confiança para cada número; threshold > 0.8
```

### Passo 4: Validação de Completude
Para cada guardrail, valide:
- [ ] Está classificado como Prompt ou Código?
- [ ] Tem justificativa clara?
- [ ] Implementação é específica (não vaga)?
- [ ] Severidade foi considerada (crítico vs. nice-to-have)?

## Entregável
Um arquivo `enforcement-matrix.md` com:
- Tabelas de classificação DEVE, NÃO DEVE, QUANDO EM DÚVIDA
- Justificativas para cada classificação
- Detalhes de implementação para guardrails de Código
- Indicação de severidade (crítico vs. nice-to-have)

## Critério de Sucesso
Um desenvolvedor lendo este documento consegue:
1. Saber exatamente o que vai para o prompt
2. Saber exatamente o que vai para o código
3. Entender por que cada decisão foi tomada
4. Implementar sem ambiguidade
