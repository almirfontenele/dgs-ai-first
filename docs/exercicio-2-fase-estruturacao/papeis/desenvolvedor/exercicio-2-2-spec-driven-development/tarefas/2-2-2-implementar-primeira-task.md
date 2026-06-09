# Tarefa 2.2.2 — Implementar Primeira Task com GitHub Copilot

## Objetivo

Usar GitHub Copilot para implementar a primeira task do `tasks.md`: setup do Azure Function com validação Zod.

## Contexto

A primeira task é tipicamente a mais simples: setup + boilerplate + validação. O objetivo é:
1. Demonstrar que Copilot consegue seguir a spec do tasks.md
2. Identificar padrões de código que Copilot gera (útil para validar as próximas tasks)
3. Produzir código que funciona e segue os padrões do projeto

## Inputs

- `tasks.md` gerado na Tarefa 2.2.1 (especialmente a Task 2.2.1.1)
- Estrutura do repositório (Anexo C)
- Padrões do projeto:
  - TypeScript + Azure Functions v4
  - Zod para validação
  - pino para logging
  - src/functions/ para handlers

## Entregáveis

Um arquivo TypeScript implementado: `src/functions/query.ts` (ou equivalent) com:

```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { z } from "zod";
import pino from "pino";

// Schema definitions
const QueryInputSchema = z.object({
  question: z.string().min(1).max(500),
});

const QueryOutputSchema = z.object({
  answer: z.string(),
  sources: z.array(z.object({
    document: z.string(),
    vigencia: z.string(),
  })),
  confidence: z.number().min(0).max(1),
});

export type QueryInput = z.infer<typeof QueryInputSchema>;
export type QueryOutput = z.infer<typeof QueryOutputSchema>;

const logger = pino();

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  try {
    // Validate input
    const input = QueryInputSchema.parse(req.body);
    logger.info({ function: "query", action: "input_validated", question_length: input.question.length });

    // TODO: Call embedding service, search, etc.
    // For now, return placeholder
    const response: QueryOutput = {
      answer: "Placeholder response",
      sources: [],
      confidence: 0.5,
    };

    // Validate output
    const output = QueryOutputSchema.parse(response);
    logger.info({ function: "query", action: "response_sent", confidence: output.confidence });

    context.res = {
      status: 200,
      body: output,
      headers: { "Content-Type": "application/json" },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({ function: "query", action: "validation_error", errors: error.errors });
      context.res = {
        status: 400,
        body: { error: "Invalid input", details: error.errors },
      };
    } else {
      logger.error({ function: "query", action: "error", message: String(error) });
      context.res = {
        status: 500,
        body: { error: "Internal server error" },
      };
    }
  }
};

export default httpTrigger;
```

## Critérios de Aceite

- [ ] Arquivo `src/functions/query.ts` existe e é TypeScript válido
- [ ] Usa Zod para validação de input (max 500 chars) e output
- [ ] Usa pino para logging estruturado
- [ ] `POST /api/query` com payload válido retorna 200 + JSON válido
- [ ] `POST /api/query` com payload inválido retorna 400 + erro clara
- [ ] Função segue padrão do projeto (imports, estrutura, naming)
- [ ] Código compila (`npm run build` ou equivalente)

## Passo a Passo

### Passo 1: Preparar o arquivo
Na sua IDE (VSCode com Copilot):
1. Crie o arquivo `src/functions/query.ts`
2. Adicione imports básicos:
```typescript
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { z } from "zod";
import pino from "pino";
```

### Passo 2: Usar Copilot para Zod schemas
Depois dos imports, adicione um comentário:

```typescript
// Define Zod schemas for input validation
// Input: question (string, 1-500 chars)
// Output: answer (string), sources (array of {document, vigencia}), confidence (0-1)
```

Posicione o cursor após o comentário e peça a Copilot (Ctrl+Enter ou autocomplete):
- Copilot deve gerar schemas como:
```typescript
const QueryInputSchema = z.object({
  question: z.string().min(1).max(500),
});

const QueryOutputSchema = z.object({
  answer: z.string(),
  sources: z.array(z.object({
    document: z.string(),
    vigencia: z.string(),
  })),
  confidence: z.number().min(0).max(1),
});
```

**Dica:** Se Copilot gerar algo diferente (ex: `maxLength` em vez de `max`), corrija. Zod usa `min`/`max`.

### Passo 3: Logger setup
Adicione:
```typescript
// Initialize logger
const logger = pino();
```

Copilot pode sugerir configurações extras (ex: nível de log). Aceite se fizerem sentido, ou mantenha simples.

### Passo 4: Main handler
Adicione um comentário descritivo:
```typescript
// HTTP trigger function for query endpoint
// - Validates input with Zod
// - Logs request with structured logging
// - Returns 400 for validation errors, 500 for server errors
```

Posicione o cursor e peça a Copilot para gerar a função:
```typescript
const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  // Copilot should fill this
};
```

Copilot provavelmente gerará:
- Try/catch block
- Validation com `QueryInputSchema.parse()`
- Logging com `logger.info()` / `logger.error()`
- Response object com status codes

### Passo 5: Error handling
Verifique se o gerado trata:
- **Zod validation errors:** Retorna 400 com erro clara
- **Server errors:** Retorna 500 com mensagem genérica (não expõe detalhes internos)
- **Logging:** Cada evento (validation, success, error) é logado

Se Copilot não gerar error handling, adicione manualmente:
```typescript
} catch (error) {
  if (error instanceof z.ZodError) {
    context.res = { status: 400, body: { error: "Invalid input", details: error.errors } };
  } else {
    context.res = { status: 500, body: { error: "Internal server error" } };
  }
}
```

### Passo 6: Export e type hints
Copilot deve gerar algo como:
```typescript
export type QueryInput = z.infer<typeof QueryInputSchema>;
export type QueryOutput = z.infer<typeof QueryOutputSchema>;
export default httpTrigger;
```

Isso permite que outras funções importem os tipos.

### Passo 7: Compilar e testar
```bash
npm run build  # Compila TypeScript
```

Se há erros, corrija com Copilot:
- Se erro é `QueryInputSchema is not defined`, Copilot provavelmente não gerou os schemas. Adicione manualmente.
- Se erro é `pino not installed`, adicione ao `package.json`: `npm install pino`

### Passo 8: Teste manual (opcional)
Se conseguir rodar localmente:
```bash
npm run start  # Inicia Azure Functions local
curl -X POST http://localhost:7071/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the SLA?"}'
```

Esperado: 200 response com JSON válido.

## Dicas para Trabalhar com Copilot

- **Contexto importa:** Se você tiver um `tsconfig.json` e `package.json` abertos na IDE, Copilot aprende com isso. Não tente gerar código TypeScript sem contexto.

- **Use comentários descritivos:** Em vez de deixar Copilot adivinhar, dê contexto. Ex:
  ```typescript
  // Azure Function v4 HTTP trigger
  // Input: POST body with { question: string }
  // Output: JSON { answer, sources[], confidence }
  // Validation: Use Zod, reject if question > 500 chars
  // Logging: Use pino with structured logs
  ```
  Copilot vai gerar código mais próximo do que você quer.

- **Revise o gerado:** Copilot não é perfeito. Se gerar algo que não faz sentido (ex: `confidence: "high"` em vez de número), corrija.

- **Reutilize padrões:** Se você já tem outro Azure Function no projeto, copie a estrutura e deixe Copilot preencher os blanks.

## Validação Final

Checklist antes de passar para a próxima task:

- [ ] Arquivo compila sem erros
- [ ] Schemas Zod são válidos e coerentes com a spec
- [ ] Handler cobre input validation + output validation + error handling + logging
- [ ] Não há secrets hardcoded (use env vars para credenciais)
- [ ] Código segue naming conventions do projeto

## Referências

- [Azure Functions v4 TypeScript](https://learn.microsoft.com/en-us/azure/azure-functions/functions-reference-node?tabs=typescript%2Cwindows%2Cazure-cli&pivots=nodejs-model-v4)
- [Zod Documentation](https://zod.dev/)
- [Pino Logger](https://getpino.io/)
- Task 2.2.1 — Definição da task que está implementando
