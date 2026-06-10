# Relatório de Iteração — azure-functions-endpoint.md v1 → v2

**Data:** 2026-06-10  
**Tech Lead:** Almir Oliveira  
**Tarefa:** 2.3.3 — Iterar e refinar SKILL.md

---

## Resumo

| Métrica | v1 | v2 |
|---------|----|----|
| Regras seguidas pelo Copilot | 3/11 (27%) | 9/11 (82%) |
| Gaps resolvidos | — | 5/5 |
| Limitações conhecidas documentadas | 0 | 3 |

---

## Mudanças aplicadas (v1 → v2)

### Gap 1: pino logging no caminho de erro

**Problema:** v1 mostrava `pino` apenas no path de sucesso. Copilot usou `console.log` no caminho de erro de validação.

**Estratégia aplicada:** Estratégia A (tornar mais prescritivo) + B (exemplo em contexto real)

**Mudança:**
```markdown
# ANTES (v1)
"Use pino para logar operações"
[exemplo só no caminho de sucesso]

# DEPOIS (v2)
"VOCÊ DEVE usar logger.warn no caminho de ERRO (não console.log, não omitir logging)"
  if (!parseResult.success) {
    logger.warn({ requestId, errors: parseResult.error.issues }, 'Input validation failed'); // ✓
    return buildErrorResponse(400, 'VALIDATION_ERROR', parseResult.error.issues);
  }
```

**Resultado v2:** ✓ Copilot incluiu `logger.warn` no caminho de erro.

---

### Gap 2: requestId em todos os logs

**Problema:** v1 não mostrava `context.invocationId` sendo atribuído a `requestId` no início do handler. Logs gerados sem requestId.

**Estratégia aplicada:** Estratégia B (exemplo em contexto real)

**Mudança:**
```markdown
# ANTES (v1)
[requestId mencionado no checklist mas não no exemplo]

# DEPOIS (v2)
// ✓ SEMPRE: requestId como primeira linha
const requestId = context.invocationId;
logger.info({ requestId }, 'Register user request started');
[todas as chamadas de logger incluem { requestId }]
```

**Resultado v2:** ✓ Copilot gerou `const requestId = context.invocationId` como primeira linha e incluiu em todos os logs.

---

### Gap 3: response-builder com implementação visível

**Problema:** v1 usava `buildSuccessResponse` e `buildErrorResponse` mas sem mostrar o que essas funções retornam. Copilot gerou respostas sem estrutura de envelope.

**Estratégia aplicada:** Estratégia B (adicionar exemplo em contexto real)

**Mudança:**
```markdown
# ANTES (v1)
[apenas chamada: buildErrorResponse(400, 'VALIDATION_ERROR', ...)]

# DEPOIS (v2)
// Arquivo 3: response-builder.ts com implementação completa visível:
export function buildSuccessResponse(status: number, data: unknown): HttpResponseInit {
  return { status, jsonBody: { success: true, data } }; // estrutura visível
}
export function buildErrorResponse(status, code, details): HttpResponseInit {
  return { status, jsonBody: { success: false, error: { code, details } } }; // estrutura visível
}
```

**Resultado v2:** ✓ Copilot gerou estrutura `{ success, data/error }` correta.

---

### Gap 4: request.json() em try/catch separado

**Problema:** v1 não separava o parse JSON do Zod safeParse. Copilot omitiu o try/catch em request.json().

**Estratégia aplicada:** Estratégia A (tornar mais prescritivo)

**Mudança:**
```markdown
# ANTES (v1)
"Valide input com Zod"
const body = await request.json();
const result = InputSchema.safeParse(body);

# DEPOIS (v2)
// ✓ PASSO 1: parse JSON — pode falhar, em try/catch separado
let body: unknown;
try {
  body = await request.json();
} catch {
  logger.warn({ requestId }, 'Failed to parse JSON body');
  return buildErrorResponse(400, 'INVALID_JSON', 'Request body must be valid JSON');
}

// ✓ PASSO 2: validar schema com safeParse
const parseResult = InputSchema.safeParse(body);
```

**Resultado v2:** ✓ Copilot gerou os dois passos separados.

---

### Gap 5: Status HTTP explícito (201 para criação)

**Problema:** v1 checklist listava "200, 400, 500" mas não especificava quando usar cada um. Copilot usou 200 para criação.

**Estratégia aplicada:** Estratégia C (adicionar anti-padrão claro) + tabela

**Mudança:**
```markdown
# ANTES (v1)
Checklist: "Response status está correto (200, 400, 500)"

# DEPOIS (v2)
| Situação | Status |
|----------|--------|
| POST que CRIA um recurso | 201 Created |
| GET que RETORNA um recurso | 200 OK |
| Input inválido (Zod falhou) | 400 Bad Request |
| JSON malformado | 400 Bad Request |
| Erro interno / service falhou | 500 Internal Server Error |
```

**Resultado v2:** ✓ Copilot gerou `buildSuccessResponse(201, user)`.

---

## Limitações que persistem na v2

### 1. Separação em 3 arquivos (handler/validator/response-builder)
**Frequência na v2:** ~40% das gerações ainda colocam tudo em handler.ts  
**Razão:** Copilot não cria arquivos novos proativamente — precisa dos arquivos já existindo no repo ou de um prompt explícito mencionando cada arquivo.  
**Não documentado como gap pois:** É uma limitação estrutural do Copilot (não lê a estrutura de pastas do projeto automaticamente), não uma falha do SKILL.md.  
**Mitigação:** Scaffolding prévio (criar arquivos vazios antes de solicitar implementação).

### 2. pino sem `{ name: 'endpoint-name' }`
**Frequência na v2:** ~30% gera `pino()` sem o campo `name`  
**Razão:** Exemplo DO na v2 mostra `pino({ name: 'register-user' })` mas é um detalhe fácil de omitir.  
**Impacto:** Baixo — logs ficam sem identificador do endpoint mas ainda são estruturados.  
**Mitigação:** Item no checklist; revisão no code review.

### 3. `authLevel: 'anonymous'` ocasional
**Frequência na v2:** ~20% em ambientes de dev  
**Razão:** Copilot prioriza facilidade de teste local.  
**Mitigação:** Item no checklist; CI/CD pode rejeitar deploys com authLevel anonymous.

---

## Conclusão

A v2 resolveu os 5 gaps principais identificados na análise 2.3.2, elevando a taxa de aderência de 27% para 82%. As 3 limitações remanescentes são documentadas, com mitigações práticas identificadas. A skill está apta para transição para v1.5 (Beta) conforme os critérios de maturidade definidos em `SKILL-MATURITY-CRITERIA.md`.
