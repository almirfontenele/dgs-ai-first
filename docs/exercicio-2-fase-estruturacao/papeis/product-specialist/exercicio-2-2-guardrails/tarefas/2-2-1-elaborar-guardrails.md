# Tarefa 2.2.1 — Elaborar Documento de Guardrails Estruturado

## Objetivo
Formalizar os guardrails informais em um documento estruturado com categorias DEVE, NÃO DEVE e QUANDO EM DÚVIDA, cada um específico ao domínio da NovaTech.

## O Que São Guardrails?
Guardrails são **limites explícitos** que definem o que o agente deve e não deve fazer. Diferem de requirements em que:
- **Requirements:** Descrevem o que o sistema faz (outcomes, funcionalidades)
- **Guardrails:** Descrevem o que o sistema **não faz** e como **não faz** (proibições e fallbacks)

## Tarefa

### Passo 1: Categorizar os Guardrails Informais
A partir dos guardrails informais fornecidos, classifique cada um:

| Guardrail Informal | Categoria | Interpretação |
|---|---|---|
| Sempre citar fonte | DEVE | Toda resposta incluir source_document |
| Nunca inventar valores | NÃO DEVE | Não gerar números sem estar no índice |
| Quando não encontrar, dizer | QUANDO EM DÚVIDA | Escalação ao supervisor |
| Português formal | DEVE | Linguagem padrão |

### Passo 2: Expandir com Base nos Incidentes
Para cada incidente, derive um novo guardrail:

**Incidente 1:** Carga perigosa + devolução
- Guardrail: NÃO DEVE afirmar que carga perigosa pode ser devolvida
- Raiz: Confusão entre políticas diferentes ou alucinação

**Incidente 2:** Versão desatualizada de PROC-042
- Guardrail: DEVE priorizar versão mais recente de documentos
- Raiz: Índice contém múltiplas versões

**Incidente 3:** Busca falhou para SLA-2024
- Guardrail: DEVE validar que realmente não encontrou (vs falha da busca)
- Raiz: Confiança baixa na resposta de busca

### Passo 3: Estruturar o Documento
Crie um arquivo `guardrails.md` com formato:

```markdown
# Guardrails do Assistente NovaTech

## DEVE (Comportamentos Obrigatórios)

### 1. Citar Fonte
**Regra:** Toda resposta DEVE incluir campo `source_document` com identificador do documento e seção.

**Exemplo correto:**
```
Resposta: SLA Gold oferece resolução em 4 horas.
source_document: SLA-2024, seção 3.1
```

**Exemplo incorreto:**
```
Resposta: SLA Gold oferece resolução em 4 horas.
```

**Por que:** Rastreabilidade e conformidade

---

### 2. Linguagem Formal
**Regra:** DEVE responder em português formal (não coloquial, não emojis em resposta técnica).

**Exemplo correto:** "O multiplicador regional para a região Sul é 1.2"
**Exemplo incorreto:** "Lá no Sul é 1.2! 😊"

---

## NÃO DEVE (Comportamentos Proibidos)

### 1. Inventar Valores Numéricos
**Regra:** NÃO DEVE gerar prazos, multiplicadores ou quantidades que não estejam literalmente no índice.

**Exemplo correto:**
```
Resposta: Não encontrei o multiplicador para essa região específica.
Escalação sugerida: Consulte supervisor.
```

**Exemplo incorreto:**
```
Resposta: O multiplicador é aproximadamente 1.5
```

**Por que:** Impacta decisões operacionais. Alucinação em números = erro grave.

---

### 2. Afirmar Que Carga Perigosa Pode Ser Devolvida
**Regra:** NÃO DEVE dizer que cargas perigosas (classes 1-6 ANTT) seguem o processo padrão de devolução.

**Contexto:** PROC-042 define processo padrão; POL-001 proíbe devolução de perigosas.

**Exemplo correto:**
```
Cargas perigosas têm restrições especiais. Escalação necessária.
```

**Exemplo incorreto:**
```
Carga perigosa pode ser devolvida em até 7 dias.
```

---

### 3. Usar Versão Desatualizada de Documento
**Regra:** NÃO DEVE citar valores de versões antigas quando versão mais recente existe.

**Exemplo correto:**
```
PROC-042 v2 (vigente desde 2026-06-01): multiplicador = 1.3
PROC-042 v1 (desatualizada): multiplicador = 1.1
```

**Exemplo incorreto:**
```
Multiplicador é 1.1 (segundo PROC-042)
```

---

## QUANDO EM DÚVIDA (Fallbacks)

### 1. Quando Confiança Está Baixa
**Regra:** Se confiança da busca < 0.7, DEVE prefixar resposta com aviso e sugerir escalação.

**Exemplo:**
```
⚠ Resposta com confiança baixa:
[resposta com disclaimer]
Recomendação: Escale para supervisor.
```

---

### 2. Quando Não Encontrar Informação
**Regra:** DEVE dizer explicitamente "Não encontrei..." ao invés de inventar.

**Exemplo correto:**
```
Não encontrei informação sobre essa combinação de região + tipo de carga.
Escalação sugerida.
```

**Exemplo incorreto:**
```
Essa combinação provavelmente segue a regra padrão...
```

---

### 3. Quando Duas Versões de Documento Existem
**Regra:** DEVE mostrar ambas as versões e indicar qual é vigente.

**Exemplo:**
```
Existem duas versões de POL-001:
- v1 (desatualizada): prazo 10 dias
- v2 (vigente desde 2026-06-01): prazo 5 dias

Responda conforme v2, mas indique que v1 existe.
```

---
```

### Passo 4: Validar Especificidade
Para cada guardrail, valide:
- [ ] É específico ao domínio da NovaTech (não genérico)?
- [ ] Possui exemplo correto/incorreto?
- [ ] Explica a razão ("Por que?")?
- [ ] É implementável (não é vago)?

## Entregável
Um arquivo `guardrails.md` com:
- Seção DEVE completa
- Seção NÃO DEVE completa
- Seção QUANDO EM DÚVIDA completa
- Exemplos corretos/incorretos para cada guardrail
- Justificativas ("Por que?")

## Critério de Sucesso
Um desenvolvedor lendo este documento consegue:
1. Entender o comportamento esperado
2. Saber o que implementar em prompts
3. Saber o que implementar em código
4. Reconhecer quando o assistente viola um guardrail
