# Tarefa 2.3.3 — Definir Restrições que Impactam Código

## Objetivo
Documentar restrições que **devem ser implementadas em código** (não em prompts), de forma que um desenvolvedor consegue traduzir direto para TypeScript, Python, etc.

## Contexto
Algumas garantias não podem ser implementadas apenas com prompts (LLM pode desobedecer). Requerem **validação de código**:
- Campos obrigatórios em JSON
- Validação de limites/thresholds
- Bloqueios de termos proibidos
- Filtros de dados

## Tarefa

### Passo 1: Identificar Restrições de Código
A partir dos guardrails (exercício 2.2), liste quais precisam de **código**:

| Guardrail | Implementação | Razão |
|-----------|---------------|-------|
| Citar fonte | Código | Campo obrigatório no schema JSON |
| Não inventar valores | Código + Prompt | Validação se número existe no índice |
| Carga perigosa ≠ devolução | Código | Bloqueio de termo proibido |
| Versão mais recente | Código | Filtro/ordenação no RAG |
| Confiança baixa | Código | Threshold automático |

### Passo 2: Detalhar Cada Restrição
Para cada restrição, especifique em forma que um desenvolvedor possa implementar:

```markdown
## Restrição 1: Campo source_document Obrigatório

### Descrição
Toda resposta do assistente DEVE incluir o campo `source_document` no JSON de retorno, mesmo que com valor vazio em caso de escalação.

### Schema JSON Obrigatório
```json
{
  "response": "string",
  "source_document": "string (OBRIGATÓRIO)",
  "confidence": "number (0-1)",
  "escalation_required": "boolean"
}
```

### Validação
```typescript
// Pseudocódigo — implementar conforme sua stack
function validateResponse(response: Object): boolean {
  if (!response.source_document) {
    throw new Error("Missing required field: source_document");
  }
  if (typeof response.source_document !== 'string') {
    throw new Error("Invalid type for source_document");
  }
  if (response.source_document.length === 0 && !response.escalation_required) {
    throw new Error("source_document cannot be empty unless escalating");
  }
  return true;
}
```

### Teste
- [ ] Response válida: `{response: "...", source_document: "SLA-2024, seção 3.1"}`
- [ ] Response inválida (rejeitada): `{response: "..."}`  ← sem source_document
- [ ] Escalação válida: `{response: "...", source_document: "", escalation_required: true}`

### Localização no Código
- Implementar em: `response-validator.ts` (ou equivalente)
- Executar em: Antes de retornar resposta ao usuário
- Erro handling: Reject promise / throw exception

---

## Restrição 2: Não Gerar Números Sem Fonte

### Descrição
Se a resposta contém números (prazos, multiplicadores, valores), validar que cada número:
1. Existe nos documentos indexados, OU
2. É um cálculo explícito (ex: base × multiplicador), OU
3. É marcado como aproximação (com risco indicado)

### Lógica de Validação
```typescript
// Pseudocódigo
function validateNumbers(response: string, indexedDocuments: Object[]): boolean {
  const numberPattern = /\\d+(\\.\\d+)?/g;
  const numbers = response.match(numberPattern);
  
  for (const num of numbers) {
    const foundInIndex = indexedDocuments.some(doc => doc.content.includes(num));
    const isCalculated = response.includes(`${num} = `);  // ex: "4 = 2 × 2"
    
    if (!foundInIndex && !isCalculated) {
      throw new Error(`Number ${num} not found in indexed documents`);
    }
  }
  
  return true;
}
```

### Teste
- [ ] ✓ "Multiplicador é 1.2" (está em PROC-042 v2)
- [ ] ✗ "Multiplicador é aproximadamente 1.5" (não está no índice)
- [ ] ✓ "Frete = 100 × 1.2 = 120" (cálculo explícito)

### Localização no Código
- Implementar em: `validation/number-validator.ts`
- Integrar com: RAG confidence scores
- Configuração: `MIN_CONFIDENCE_FOR_NUMBERS = 0.8`

---

## Restrição 3: Bloqueio de Termos Proibidos

### Descrição
Se a resposta contém certos padrões de texto proibidos, rejeitar automaticamente.

### Lista de Bloqueios
```typescript
const PROHIBITED_PATTERNS = [
  {
    pattern: /carga perigosa.*(pode ser devolvida|devolução|devolver)/i,
    reason: "Cargas perigosas nunca podem ser devolvidas",
    action: "BLOCK"
  },
  {
    pattern: /cliente.*gold.*(não|nao).*(sla|24 horas)/i,
    reason: "Gold clients have 4-hour SLA, not 24",
    action: "BLOCK"
  }
];
```

### Validação
```typescript
function checkProhibitedPatterns(response: string): void {
  for (const rule of PROHIBITED_PATTERNS) {
    if (rule.pattern.test(response)) {
      throw new Error(`Violates rule: ${rule.reason}`);
    }
  }
}
```

### Teste
- [ ] ✗ Bloqueado: "Carga perigosa pode ser devolvida em 7 dias"
- [ ] ✗ Bloqueado: "Cliente Gold tem SLA de 24 horas"
- [ ] ✓ Permitido: "Carga perigosa requer escalação"

### Localização no Código
- Implementar em: `validation/content-blocker.ts`
- Executar em: Após LLM retorna, antes de validação final
- Configuração: `prohibited-patterns.yml`

---

## Restrição 4: RAG Confidence Threshold

### Descrição
Se a confiança da busca (RAG score) está abaixo do threshold, não retornar resposta normal; ao invés, retornar escalação.

### Lógica
```typescript
const MIN_CONFIDENCE = 0.7;  // Configurável por pergunta type

function processRAGResult(ragResult: {score: number, content: string}): Response {
  if (ragResult.score < MIN_CONFIDENCE) {
    return {
      response: "Confiança baixa. Escalando para supervisor.",
      confidence: ragResult.score,
      source_document: "",
      escalation_required: true
    };
  }
  
  return {
    response: formatResponse(ragResult.content),
    confidence: ragResult.score,
    source_document: extractSource(ragResult)
  };
}
```

### Configuração Recomendada
| Tipo de Pergunta | Min Confidence | Razão |
|---|---|---|
| SLAs | 0.8 | Valores críticos |
| Multiplicadores | 0.85 | Impacto financeiro |
| Políticas | 0.7 | Orientação geral |
| Escalação | 0.5 | Fallback |

### Teste
- [ ] Pergunta com confidence 0.95 → resposta normal
- [ ] Pergunta com confidence 0.65 → escalação
- [ ] Pergunta com confidence 0.5 → escalação com aviso

### Localização no Código
- Implementar em: `rag/confidence-filter.ts`
- Configuração: `rag-config.yml` (thresholds por tipo)

---

## Restrição 5: Priorização de Versões

### Descrição
Quando o RAG retorna múltiplos documentos versionados (ex: PROC-042 v1 e v2), ordenar e filtrar para priorizar versão mais recente.

### Lógica
```typescript
interface RagDocument {
  id: string;
  version: string;
  effective_date: string;
  supersedes?: string[];
  content: string;
}

function prioritizeDocumentVersions(results: RagDocument[]): RagDocument[] {
  return results
    .sort((a, b) => new Date(b.effective_date) - new Date(a.effective_date))
    .filter((doc, idx) => {
      // Keep if it's the latest version or if user explicitly needs history
      return idx === 0 || isHistoricalReference(doc);
    });
}
```

### Teste
- [ ] Query PROC-042: retorna v2 (vigente), não v1
- [ ] Query PROC-042 "versão antiga": retorna ambas com indicação v1 é desatualizada

### Localização no Código
- Implementar em: `rag/version-filter.ts`
- Metadata required: `version`, `effective_date`, `supersedes`
- Database migration: Add version fields to documents table

---
```

### Passo 3: Criar Arquivo de Configuração
Algumas restrições requerem arquivo de configuração:

```yaml
# guardrails-config.yml

validation:
  required_fields:
    - source_document
    - confidence
  
  number_confidence_threshold: 0.8
  
  prohibited_patterns: !include prohibited-patterns.yml
  
rag:
  confidence_thresholds:
    sla: 0.8
    multiplier: 0.85
    policy: 0.7
    default: 0.7
  
  version_prioritization: enabled
```

### Passo 4: Documentar Integrações
Para cada restrição, indique onde se integra:

```markdown
## Integrações

| Restrição | Módulo | Interface |
|-----------|--------|-----------|
| source_document | response-validator | validateResponse(response) |
| número sem fonte | number-validator | validateNumbers(text, docs) |
| termos proibidos | content-blocker | checkProhibited(text) |
| confiança baixa | rag-filter | processRAGResult(result) |
| versão prioritizada | rag-filter | prioritizeVersions(docs) |
```

## Entregável
Um arquivo `code-restrictions.md` para `AGENTS.md` contendo:
- [ ] 5+ restrições de código documentadas
- [ ] Schema JSON para cada restrição
- [ ] Pseudocódigo ou exemplos TypeScript
- [ ] Testes (casos que devem passar/falhar)
- [ ] Localização no código (onde implementar)
- [ ] Arquivo de configuração (se necessário)
- [ ] Matriz de integrações

## Critério de Sucesso
Um desenvolvedor lendo este documento consegue:
1. Entender exatamente qual validação implementar
2. Saber onde integrar no pipeline de respostas
3. Testar se a validação funciona
4. Configurar thresholds conforme necessário
5. Adicionar novas restrições seguindo o padrão
