# Análise de Iteração — AGENTS.md v1 → v2

**Data:** 2026-06-10  
**Tech Lead:** Almir Oliveira  
**Tarefa:** 2.1.3 — Analisar e iterar para AGENTS.md v2

---

## Resumo da Iteração

| Métrica | v1 | v2 |
|---------|----|----|
| Regras seguidas pelo Copilot (endpoint) | 1/10 (10%) | 8/10 (80%) |
| Regras seguidas pelo Copilot (testes) | 3/5 (60%) | 5/5 (100%) |
| Seções reescritas | — | 5 seções |
| Exemplos DO/DON'T adicionados | 3 | 12 |

---

## Mudanças de v1 para v2

### Mudança 1: Azure Functions v4 — exemplo no início (antes estava só no final)

**Problema identificado:** O v1 mencionava "Azure Functions v4" no Tech Stack, mas o exemplo completo de `app.http()` aparecia só na seção 4 (Build & Deploy). O Copilot priorizou seu training data (v3) e gerou código legado.

**O que mudou na v2:**
- Seção 2 agora tem bloco explícito `❌ DON'T` mostrando v3 com `AzureFunction, Context` + `✓ DO` mostrando v4 com `app.http()`, `InvocationContext`, `HttpResponseInit`
- Aviso `⚠️ Azure Functions: APENAS v4` adicionado como subseção destacada

**Resultado no re-teste Copilot:** ✓ Copilot gerou `app.http()` e `InvocationContext` corretamente.

---

### Mudança 2: console.log → pino com exemplo inline

**Problema identificado:** A regra "NUNCA use console.log" estava no texto da seção 3, mas os exemplos de endpoint (seção 4) não mostravam `console.log` sendo substituído por `pino` no mesmo contexto. Copilot gerou `console.log('HTTP trigger function processed a request.')`.

**O que mudou na v2:**
- Seção 3.2 criada especificamente para logging com dois blocos lado a lado: `❌ DON'T` com 3 linhas de `console.*` e `✓ DO` com `pino` e campos estruturados
- Regra explícita: "SEMPRE inclua `requestId`" em todos os logs

**Resultado no re-teste Copilot:** ✓ Copilot gerou `pino` com `logger.info({ requestId }, ...)`. Resultado esperado.

---

### Mudança 3: Validação Zod no exemplo completo de endpoint

**Problema identificado:** No v1, a seção de Zod tinha bom exemplo isolado, mas o exemplo de endpoint completo (seção Build & Deploy) não mostrava Zod em uso. Copilot replicou o padrão do exemplo de endpoint.

**O que mudou na v2:**
- Seção 3.3 criada com `❌ DON'T` mostrando 3 formas proibidas de acesso a `req.body` sem Zod
- `✓ DO` mostra o fluxo completo em 2 passos: (1) `request.json()` em try/catch, (2) `InputSchema.safeParse(body)` com checagem de `.success`
- Regra explícita: "use `safeParse()`, não `parse()` direto" (para não lançar exceção)

**Resultado no re-teste Copilot:** ✓ Copilot incluiu `z.object({ email: z.string().email(), name: z.string() })` e `safeParse`. Zod aderido.

---

### Mudança 4: Estrutura de response de erro — buildErrorResponse explícito

**Problema identificado:** No v1, a regra de estrutura de erro `{ success: false, error: { code, details } }` estava em texto mas o exemplo de endpoint mostrava apenas `buildErrorResponse(400, 'VALIDATION_ERROR', ...)` sem mostrar o que essa função retorna. Copilot não inferiu a estrutura.

**O que mudou na v2:**
- Seção 3.4 criada com `❌ DON'T` mostrando 3 formas proibidas de retorno de erro (string pura, objeto sem estrutura, status sem corpo)
- `✓ DO` mostra a implementação completa de `buildErrorResponse` e `buildSuccessResponse` com tipos — não apenas a chamada
- Copilot agora vê o que a função deve retornar, não apenas como chamá-la

**Resultado no re-teste Copilot:** ✓ Copilot gerou `buildErrorResponse` com estrutura `{ success: false, error: { code, details } }` correta.

---

### Mudança 5: Separação handler/service com exemplo concreto

**Problema identificado:** No v1, a regra de separação estava em texto ("handler só orquestra"). O exemplo de endpoint mostrava `await UserService.register(input)` mas sem mostrar onde `UserService` vive ou o que ele contém. Copilot gerou lógica de geração de ID e timestamp dentro do handler.

**O que mudou na v2:**
- Seção 3.5 criada com `❌ DON'T` mostrando handler com `Math.random()`, `new Date()` e lógica de negócio inline
- `✓ DO` mostra `handler.ts` chamando `UserService.register()` + `user-service.ts` com a lógica — dois arquivos lado a lado
- Regra explícita listando o que o handler FAZ vs NÃO FAZ

**Resultado no re-teste Copilot:** ✓ Copilot gerou `UserService` em arquivo separado e handler apenas orquestrando.

---

### Mudança 6: Testes sem `any` — mocks tipados

**Problema identificado:** Os testes gerados usavam `const context = { res: {} } as any` e `const req = { body: {} } as any`. A regra de "sem any" estava no Coding Standards mas o exemplo de teste no AGENTS.md v1 não mostrava como mockar `HttpRequest` e `InvocationContext` sem `any`.

**O que mudou na v2:**
- Seção 5 expandida com `❌ DON'T` mostrando `as any` em testes
- `✓ DO` mostra funções `mockRequest()` e `mockContext()` com tipos corretos do `@azure/functions`

**Resultado no re-teste Copilot:** ✓ Copilot gerou mocks tipados. Nenhum `as any` nos testes.

---

## Limitações Conhecidas (o que o Copilot AINDA não segue consistentemente)

### 1. Separação em 3 arquivos (handler/validator/response-builder)
**Frequência de falha:** ~40% das gerações ainda colocam tudo em um único `handler.ts`  
**Razão:** Copilot não tem como saber que `validator.ts` e `response-builder.ts` são arquivos separados a menos que a estrutura de pasta já exista no repositório ou o prompt seja muito explícito.  
**Mitigação:** Criação prévia dos arquivos vazios no repo (scaffolding) antes de pedir ao Copilot para implementar.

### 2. pino com `name` e campos específicos
**Frequência de falha:** ~30% das gerações usam `pino()` sem `{ name: 'endpoint-name' }`  
**Razão:** A regra menciona `name` no exemplo mas Copilot omite em variações.  
**Mitigação:** Skill `azure-functions-endpoint.md` tem esse detalhe; usar a skill em conjunto com AGENTS.md.

### 3. `authLevel: 'function'` no `app.http()`
**Frequência de falha:** ~20% gera `authLevel: 'anonymous'`  
**Razão:** Copilot prefere `anonymous` para facilitar teste local.  
**Mitigação:** Regra adicionada em comentário no exemplo DO da seção 2, mas pode precisar de reforço adicional.

---

## Conclusão

- **Pontos corrigidos na v2:** 5/5 problemas principais identificados na análise 2.1.2
- **Taxa de aderência geral v2:** ~80% (de 10% na v1)
- **Limitações documentadas:** 3 casos onde aderência ainda não é consistente
- **Próxima iteração (v3):** Quando houver feedback real do time usando o AGENTS.md por 1 sprint, incorporar casos que Copilot ainda não cobre (scaffolding automático, `authLevel`, configuração de `pino` com `name`).
