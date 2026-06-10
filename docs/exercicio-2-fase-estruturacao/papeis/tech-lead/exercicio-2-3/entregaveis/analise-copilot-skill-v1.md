# Análise de Aderência — azure-functions-endpoint.md v1 com Copilot

**Data:** 2026-06-10  
**Tech Lead:** Almir Oliveira  
**Tarefa:** 2.3.2 — Testar SKILL.md com GitHub Copilot  
**SKILL.md testado:** v1.0 (criado em 2026-06-10)

---

## Procedimento de Teste

### Contexto do ambiente
- AGENTS.md v1 presente no repositório raiz
- `skills/domain/azure-functions-endpoint.md` v1 presente no repositório
- Arquivo vazio `src/functions/register-user/handler.ts` criado como ponto de entrada

### Prompt usado no Copilot

```
"Crie uma Azure Function HTTP trigger que:
- Receba um JSON com 'email' e 'name'
- Valide o input com Zod
- Log cada operação com pino
- Retorne um JSON com id, email, name, timestamp
- Siga o padrão definido em /skills/domain/azure-functions-endpoint.md"
```

### Output gerado pelo Copilot

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { z } from 'zod';
import pino from 'pino';

const logger = pino();

const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export async function registerHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {

  const body = await request.json();
  const result = RegisterSchema.safeParse(body);

  if (!result.success) {
    console.log('Validation failed:', result.error);  // ← pino não usado aqui
    return {
      status: 400,
      body: JSON.stringify({ error: result.error.issues }),
    };
  }

  const { email, name } = result.data;
  pino().info('User request received');  // ← nova instância pino (não reutilizada)

  const user = {
    id: Math.random().toString(36).substr(2, 9),  // ← lógica de negócio no handler
    email,
    name,
    timestamp: new Date().toISOString(),
  };

  return {
    status: 200,  // ← deveria ser 201 para criação
    body: JSON.stringify(user),  // ← sem envelope success/data
  };
}

app.http('register', {
  methods: ['POST'],
  authLevel: 'function',
  handler: registerHandler,
});
```

---

## Checklist de Aderência

| Regra da SKILL | Status | Observação |
|----------------|--------|-----------|
| TypeScript strict mode | ✓ | Tipagem correta com `HttpRequest`, `InvocationContext` |
| Azure Functions v4 com `app.http()` | ✓ | Usou API v4 corretamente |
| Zod validation presente | ✓ | `z.object`, `safeParse` corretos |
| `request.json()` em try/catch | ❌ | Sem tratamento de JSON inválido |
| pino logging (não console.log) | ❌ | Misturou: `console.log` no erro de validação + `pino()` (nova instância) no sucesso |
| `requestId` nos logs | ❌ | Logs sem `context.invocationId` |
| Error response estruturado `{ success, error }` | ❌ | Retornou `{ error: ... }` sem `success: false` |
| Success response estruturado `{ success, data }` | ❌ | Retornou objeto direto sem envelope |
| Status 201 para criação | ❌ | Usou 200 em vez de 201 |
| Lógica de negócio fora do handler (service) | ❌ | Gerou `id` e `timestamp` dentro do handler |
| Separação em validator.ts e response-builder.ts | ❌ | Tudo em um único arquivo |

**Resultado: 3/11 regras seguidas (27%)**

---

## Análise Qualitativa

### O que funcionou bem

1. **Azure Functions v4** — a skill v1 tem `❌ DON'T` e `✓ DO` lado a lado mostrando v3 vs v4 no começo do documento. Copilot seguiu corretamente. Essa seção estava bem prescritiva.

2. **Zod presente** — a seção de Decisões Técnicas enumera Zod explicitamente e o exemplo DO mostra `safeParse`. Copilot captou.

3. **TypeScript (sem any explícito)** — strict mode implícito nos tipos `HttpRequest` e `InvocationContext`.

### O que falhou — e por quê

#### 1. console.log misturado com pino (impacto: alto)
**Regra:** "VOCÊ DEVE usar pino.info() para logar CADA mudança de estado. ❌ NUNCA use console.log."  
**Por que ignorou:** A seção DO/DON'T da skill v1 mostra `pino` no bloco DO, mas no bloco DON'T o exemplo de erro usa `return buildErrorResponse(...)` sem logging. Copilot inferiu que logging de erro era opcional, e caiu no `console.log` por default.  
**Ação:** Adicionar exemplo explícito de `logger.warn` no caminho de erro de validação.

#### 2. Sem requestId nos logs (impacto: alto)
**Regra:** AGENTS.md seção 3.2 — "SEMPRE inclua `requestId` em todos os logs do handler"  
**Por que ignorou:** A skill v1 menciona `requestId` no checklist mas **não mostra** `context.invocationId` sendo atribuído a `requestId` no início do handler. O exemplo DO não tem essa linha.  
**Ação:** Adicionar `const requestId = context.invocationId;` como **primeira linha do handler** no exemplo.

#### 3. Respostas sem envelope success/data (impacto: médio)
**Regra:** "Response de sucesso: `{ success: true, data: ... }`. Response de erro: `{ success: false, error: { code, details } }`"  
**Por que ignorou:** A skill v1 menciona `buildSuccessResponse` e `buildErrorResponse` mas **não inclui a implementação dessas funções**. Copilot não sabe o que elas retornam; gerou respostas diretas.  
**Ação:** Incluir implementação completa de `buildSuccessResponse` e `buildErrorResponse` no exemplo de `response-builder.ts` da skill.

#### 4. `request.json()` sem try/catch (impacto: médio)
**Regra:** Checklist item — "Input é validado com Zod antes de usar"  
**Por que ignorou:** O checklist menciona validação Zod, mas `request.json()` pode lançar antes do Zod rodar. A skill v1 não tem exemplo mostrando esse try/catch separado.  
**Ação:** Separar explicitamente o step "parse JSON" do step "Zod validation" com dois blocos distintos no exemplo.

#### 5. Status 200 em vez de 201 (impacto: baixo)
**Regra:** Checklist item — "Response status está correto (200, 400, 500)"  
**Por que ignorou:** O checklist lista os códigos mas não especifica **quando usar cada um**. Copilot usou 200 (seguro por default).  
**Ação:** Adicionar tabela explícita: POST de criação → 201, GET → 200, erro de validação → 400, erro interno → 500.

---

## Itens para Corrigir na v2

1. Mostrar `logger.warn` no caminho de erro (não apenas no caminho de sucesso)
2. Adicionar `const requestId = context.invocationId;` como primeira linha do handler no exemplo DO
3. Incluir implementação de `buildSuccessResponse` e `buildErrorResponse` no exemplo de `response-builder.ts`
4. Separar try/catch do `request.json()` do safeParse Zod em dois passos distintos
5. Adicionar tabela de status HTTP (201 para POST criação, 200 para GET, 400 para validação, 500 para erro interno)
