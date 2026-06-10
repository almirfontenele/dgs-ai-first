# Análise de Aderência — AGENTS.md v1 com GitHub Copilot

**Data:** 2026-06-10  
**Tech Lead:** Almir Oliveira  
**Tarefa:** 2.1.2 — Testar AGENTS.md com GitHub Copilot  
**AGENTS.md testado:** v1.0 (criado em 2026-06-10)

---

## Procedimento de Teste

### Prompt usado no Copilot (Teste 1 — Geração de Endpoint)

```
"Crie uma Azure Function HTTP trigger que receba um JSON com 'email' e 'name',
processe a criação de um usuário, e retorne o usuário criado com id e timestamp.
Siga os padrões do AGENTS.md presente neste repositório."
```

### Output gerado pelo Copilot (Teste 1)

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    console.log('HTTP trigger function processed a request.');

    const email = req.body?.email;
    const name = req.body?.name;

    if (!email || !name) {
        context.res = {
            status: 400,
            body: "Please provide email and name"
        };
        return;
    }

    const user = {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        name: name,
        createdAt: new Date().toISOString()
    };

    context.res = {
        status: 201,
        body: user
    };
};

export default httpTrigger;
```

### Prompt usado no Copilot (Teste 2 — Geração de Teste)

```
"Crie um teste Vitest para o endpoint acima, incluindo casos de sucesso e erro."
```

### Output gerado pelo Copilot (Teste 2)

```typescript
import { describe, it, expect } from 'vitest';
import httpTrigger from './index';

describe('httpTrigger', () => {
    it('should return 201 with user data on valid input', async () => {
        const context = { res: {} } as any;
        const req = {
            body: { email: 'test@example.com', name: 'Test User' }
        } as any;

        await httpTrigger(context, req);

        expect(context.res.status).toBe(201);
        expect(context.res.body.email).toBe('test@example.com');
    });

    it('should return 400 when email is missing', async () => {
        const context = { res: {} } as any;
        const req = {
            body: { name: 'Test User' }
        } as any;

        await httpTrigger(context, req);

        expect(context.res.status).toBe(400);
    });
});
```

---

## Checklist de Aderência

### Teste 1 — Endpoint gerado

| Regra do AGENTS.md | Status | Observação |
|-------------------|--------|-----------|
| TypeScript (não JavaScript) | ✓ | Usou TypeScript |
| Azure Functions v4 com `app.http()` | ❌ | Usou API legada v3 (`AzureFunction`, `Context`) |
| TypeScript strict mode (sem `any`) | ❌ | Sem `any` direto, mas tipagem fraca (`Context` v3 implica `any` interno) |
| Validação de input com Zod | ❌ | Usou verificação `if (!email \|\| !name)` sem schema Zod |
| Logging com pino (nunca console.log) | ❌ | Usou `console.log('HTTP trigger function processed a request.')` |
| Error handling estruturado com código | ❌ | Retornou string `"Please provide email and name"` em vez de `{ error: { code, details } }` |
| Response estruturado `{ success, data }` | ❌ | Retornou objeto `user` diretamente, sem envelope |
| Lógica de negócio fora do handler | ❌ | Gerou `id` e `createdAt` dentro do handler (deveria chamar service) |
| `requestId` nos logs | ❌ | `console.log` sem requestId |
| Separação em arquivos (handler/validator/response-builder) | ❌ | Tudo em um único arquivo `index.ts` |

**Resultado Teste 1: 1/10 regras seguidas (10%)**

### Teste 2 — Teste gerado

| Regra do AGENTS.md | Status | Observação |
|-------------------|--------|-----------|
| Vitest como framework | ✓ | Importou corretamente de 'vitest' |
| Estrutura de teste organizada | ✓ | `describe/it` correto |
| Sem `any` nos testes | ❌ | Usou `as any` para context e req |
| Testa casos de erro (400, 500) | ✓ (parcial) | Testou 400, mas não testou erro 500 |
| Fixtures reutilizáveis | ❌ | Dados inline no teste |

**Resultado Teste 2: 3/5 itens seguidos (60%)**

---

## Análise Qualitativa

### O que o Copilot ignorou — e por quê

#### 1. API legada v3 (impacto: alto)
**Regra ignorada:** "VOCÊ DEVE usar Azure Functions v4 com `app.http()`"  
**Por que ignorou:** O AGENTS.md v1 menciona "Azure Functions v4" no Tech Stack, mas o exemplo de código na seção Build & Deploy usa `app.http()` apenas uma vez, no fim, como exemplo isolado. O Copilot priorizou o padrão mais comum em seu training data (v3, que tem mais exemplos públicos).  
**Impacto:** Código gerado é incompatível com nosso deploy de produção.

#### 2. console.log em vez de pino (impacto: alto)
**Regra ignorada:** "NUNCA use console.log, console.error ou console.warn"  
**Por que ignorou:** A regra existe na seção de Coding Standards, mas está em texto corrido. Não há um bloco de código explícito mostrando `console.log` → ❌ junto do exemplo pino → ✓ **no mesmo lugar onde o padrão de endpoint é apresentado**. A regra e o exemplo estão em seções separadas.  
**Impacto:** Logs não estruturados em produção, sem rastreabilidade em Azure Monitor.

#### 3. Sem Zod (impacto: alto)
**Regra ignorada:** "VOCÊ DEVE validar TODO input externo com Zod"  
**Por que ignorou:** A seção de Zod no AGENTS.md v1 tem um bom exemplo, mas o exemplo de endpoint completo (na seção Build & Deploy) não inclui validação Zod. O Copilot olhou o exemplo do endpoint e replicou o padrão do exemplo, não a regra textual.  
**Impacto:** Input não validado em runtime, vulnerável a dados malformados.

#### 4. Error response sem estrutura (impacto: médio)
**Regra ignorada:** "Response de erro tem estrutura `{ success: false, error: { code, details } }`"  
**Por que ignorou:** Esta regra aparece nos Coding Standards mas **o exemplo completo de endpoint na seção Build & Deploy retorna apenas `buildErrorResponse(400, 'VALIDATION_ERROR', ...)` sem mostrar o que `buildErrorResponse` retorna**. Copilot não viu a estrutura.  
**Impacto:** Respostas de erro inconsistentes, difíceis de tratar pelo cliente.

#### 5. Geração de ID no handler (impacto: médio)
**Regra ignorada:** "Lógica de negócio fora do handler"  
**Por que ignorou:** A regra "handler só orquestra" está em texto, mas o exemplo de endpoint v1 **não mostra a chamada ao service explicitamente** — só menciona `await UserService.register(input)` sem mostrar onde `UserService` vive ou o que ele contém.  
**Impacto:** Handler acumula responsabilidades, dificulta testes unitários.

---

## Itens para Corrigir na v2

Com base nesta análise, o AGENTS.md v2 deve:

1. **Mostrar `app.http()` no PRIMEIRO exemplo de endpoint** — não apenas na seção de Build & Deploy
2. **Colocar `// ❌ console.log` junto do `// ✓ pino`** no mesmo bloco de código do exemplo de endpoint
3. **Incluir validação Zod no exemplo completo** de endpoint — não apenas como seção separada
4. **Mostrar `buildErrorResponse` retornando `{ success: false, error: { code, details } }`** — com o tipo completo visível
5. **Adicionar exemplo mostrando `UserService.register()`** sendo chamado a partir do handler, com `UserService` em `services/`
