# Tarefa 2.3.1 — Escrever Seção "Product Rules & Guardrails"

## Objetivo
Escrever a seção do `AGENTS.md` que documenta as regras de comportamento do assistente NovaTech, em formato que seja:
- **Machine-readable:** Fácil de parsear e processar
- **Legível por humanos:** Clara em intenção e formato
- **Acionável:** Pode ser usada por desenvolvedores e agentes

## O Que Vai na Seção "Product Rules & Guardrails"?
1. Comportamentos obrigatórios (DEVE)
2. Comportamentos proibidos (NÃO DEVE)
3. Comportamentos de fallback (QUANDO EM DÚVIDA)
4. Exemplos concretos de cada regra
5. Referências aos documentos de origem (Anexo A)

## Tarefa

### Passo 1: Estruturar a Seção
Crie um arquivo que será injetado no `AGENTS.md` com estrutura:

```markdown
## Product Rules & Guardrails

Este documento define as regras de comportamento do assistente NovaTech.
Consulte [ANEXO: Guardrails Completos](./guardrails.md) para detalhes.

### DEVE (Comportamentos Obrigatórios)

#### Regra 1: Sempre Citar Fonte
- **Implementação:** Campo `source_document` obrigatório em toda resposta.
- **Formato:** `source_document: [DOCUMENTO], seção [SEÇÃO], atualizado em [DATA]`
- **Exemplo Correto:**
  ```json
  {
    "response": "SLA Gold oferece resolução em 4 horas.",
    "source_document": "SLA-2024, seção 3.1, atualizado 2026-06-01"
  }
  ```
- **Exemplo Incorreto:**
  ```json
  {
    "response": "SLA Gold oferece resolução em 4 horas."
  }
  ```
- **Rastreabilidade:** Incidente 3 (busca falhou)

---

#### Regra 2: Responder em Português Formal
- **Escopo:** Todas as respostas ao usuário
- **Definição:** Sem gírias, sem emojis em respostas técnicas, gramática padrão
- **Exemplo Correto:** "O multiplicador regional para a região Sul é 1.2"
- **Exemplo Incorreto:** "Lá no Sul é 1.2! 😊"

---

### NÃO DEVE (Comportamentos Proibidos)

#### Regra 1: Inventar Valores Numéricos
- **Escopo:** Prazos, multiplicadores, SLAs, quantidades
- **Proibição:** Gerar números sem que estejam literalmente no índice
- **Exemplo Correto:**
  ```
  Resposta: Não encontrei o multiplicador específico para essa região.
  Escalação: Consulte supervisor.
  ```
- **Exemplo Incorreto:**
  ```
  Resposta: O multiplicador é aproximadamente 1.5
  ```
- **Rastreabilidade:** Incidente 2 (versão desatualizada), Incidente 1 (alucinação)

---

#### Regra 2: Afirmar Que Carga Perigosa Pode Ser Devolvida
- **Escopo:** Qualquer pergunta sobre devolução + carga perigosa
- **Contexto:** Classes 1-6 ANTT têm restrições especiais
- **Proibição:** Não dizer que cargas perigosas seguem processo padrão
- **Exemplo Correto:**
  ```
  Cargas perigosas têm restrições especiais. Escalação necessária.
  Consulte: POL-001, PROC-042
  ```
- **Exemplo Incorreto:**
  ```
  Carga perigosa pode ser devolvida em até 7 dias conforme PROC-042.
  ```
- **Rastreabilidade:** Incidente 1 (alucinação crítica)

---

#### Regra 3: Usar Versão Desatualizada
- **Escopo:** Qualquer citação de documento versionado
- **Proibição:** Citar versão antiga quando versão mais recente existe
- **Exemplo Correto:**
  ```
  PROC-042 v2 (vigente 2026-06-01): multiplicador = 1.3
  Nota: v1 (desatualizada) tinha multiplicador = 1.1
  ```
- **Exemplo Incorreto:**
  ```
  Multiplicador é 1.1 (conforme PROC-042)
  ```
- **Rastreabilidade:** Incidente 2 (versão desatualizada)

---

### QUANDO EM DÚVIDA (Fallbacks)

#### Cenário 1: Confiança Baixa (< 0.7)
- **Comportamento:** Prefixar resposta com aviso
- **Formato:**
  ```
  ⚠ Aviso: Resposta com confiança baixa
  [resposta aqui]
  
  Recomendação: Escale para supervisor.
  Supervisor contact: [escalation_endpoint]
  ```
- **Quando acontece:** RAG confidence score < 0.7

---

#### Cenário 2: Não Encontrou Informação
- **Comportamento:** Dizer explicitamente "Não encontrei"
- **Proibição:** Não inventar ou estimar
- **Formato:**
  ```
  Não encontrei informação sobre essa combinação específica.
  O que tentei buscar: [termos usados]
  Recomendação: Escale para supervisor.
  ```

---

#### Cenário 3: Múltiplas Versões Existem
- **Comportamento:** Mostrar ambas, indicar qual é vigente
- **Formato:**
  ```
  Existem duas versões de [DOCUMENTO]:
  - Versão [v2] (vigente desde [DATA]): [resposta]
  - Versão [v1] (desatualizada): [resposta anterior]
  
  Responda conforme versão vigente, mas indique que versão anterior existe.
  ```

---
```

### Passo 2: Validar Machine-Readability
Estruture de forma que um parser consegue:
- Identificar regras (busca por "###")
- Extrair exemplos corretos/incorretos
- Mapear rastreabilidade a incidentes
- Extrair restrições de código

### Passo 3: Validar Clareza
Leia cada regra e pergunte:
- [ ] Um desenvolvedor sabe o que codar?
- [ ] Um QA sabe como testar?
- [ ] Um agente de IA pode seguir?

### Passo 4: Adicionar Metadados
Para cada regra, inclua:
- **Severity:** CRÍTICO | IMPORTANTE | NICE-TO-HAVE
- **Implementação:** Prompt | Código | Ambos
- **Teste:** Como validar

Exemplo:

```markdown
#### Regra X: [Título]
- **Severity:** CRÍTICO
- **Implementação:** Código + Prompt
- **Teste:** [Como validar]
- **Incidente Prevenido:** [Qual incidente]
- **Rastreabilidade:** Tarefa 2.2.3
```

## Entregável
Um arquivo `product-rules.md` formatado para ser injetado em `AGENTS.md`:
- Seção DEVE completa com 2+ regras
- Seção NÃO DEVE completa com 2+ regras
- Seção QUANDO EM DÚVIDA completa com 2+ cenários
- Exemplos corretos/incorretos para cada regra
- Metadados (severity, implementação, teste)
- Machine-readable

## Critério de Sucesso
Um desenvolvedor e um QA conseguem:
1. Implementar as regras sem questionar intenção
2. Testar se as regras foram implementadas
3. Documentar violações de regras
4. Escalar ambiguidades ao Product Lead
