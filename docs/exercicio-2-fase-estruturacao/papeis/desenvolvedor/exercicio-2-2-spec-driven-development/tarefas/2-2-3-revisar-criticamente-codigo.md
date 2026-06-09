# Tarefa 2.2.3 — Revisar Criticamente o Código Gerado

## Objetivo

Revisar o código gerado pelo Copilot na Tarefa 2.2.2 e identificar ao menos 2-3 pontos que precisariam ajuste antes de um code review real. Documentar críticas e propor correções.

## Contexto

GitHub Copilot é ótimo para boilerplate e padrões comuns, mas não é perfeito. Ele pode gerar:
- Código que compila mas não segue best practices do projeto
- Falta de trata de edge cases
- Logs que não são informativos o suficiente
- Validação incompleta

A tarefa é pensar criticamente e identificar esses problemas **antes** que vão a produção.

Exemplo BOM de crítica:
> "Copilot gera `logger.info()` sem estrutura de campos. Deveriam ser `logger.info({ function: "query", action: "validation", ... })` para serem queryáveis em logs centralizados."

Exemplo RUIM:
> "Código não é limpo o suficiente."

## Inputs

- Código implementado na Tarefa 2.2.2 (`src/functions/query.ts`)
- Padrões do projeto (Anexo C — estrutura, conventions, logging style)
- Critérios de aceite da Tarefa 2.2.1 (o que era esperado)

## Entregáveis

Um arquivo `code-review.md` com:

```markdown
# Revisão Crítica — query.ts (Task 2.2.1.1)

## Resumo
Código foi gerado pelo Copilot e funciona, mas tem 3 pontos que precisam ajuste antes de code review real.

---

## Crítica 1: Logging Não-Estruturado

### Problema
Copilot gera:
```typescript
logger.info("Validação passou");
logger.error("Erro: " + error);
```

Logs não-estruturados são difíceis de buscar em ferramentas centralizadas (Azure Monitor, Datadog, etc). Se você precisa achar "todas as queries que falharam com erro X", com logs textuais você precisa de regex; com estruturados, é um filtro simples.

### Esperado
```typescript
logger.info({ function: "query", action: "validation_passed", question_length });
logger.error({ function: "query", action: "validation_failed", error: error.message });
```

Assim em Azure Monitor você faz: `where function == "query" and action == "validation_failed"`.

### Impacto
- **Severidade:** Média (não quebra funcionalidade, mas impacta observability)
- **Esforço para corrigir:** Baixo (replace logs, ~10 min)

### Correção Proposta
```typescript
const logger = pino();

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  try {
    const input = QueryInputSchema.parse(req.body);
    logger.info({ function: "query", action: "input_validated", question_length: input.question.length });
    
    // ... resto do código ...
    
    logger.info({ function: "query", action: "response_sent", confidence: output.confidence });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn({ function: "query", action: "validation_error", error_count: error.errors.length });
    } else {
      logger.error({ function: "query", action: "error", error: String(error) });
    }
  }
};
```

---

## Crítica 2: Não Valida Tipo do Body

### Problema
Código assume que `req.body` é um objeto JSON. Mas e se o cliente enviar:
- String pura: `"Why is my package late?"`
- Array: `[{"question": "..."}]`
- Null: `null`
- Nada: (POST sem body)

Zod vai tentar fazer `.parse()` e lançar erro, que vira 400. Mas idealmente você validaria o tipo *antes* de passar a Zod.

### Esperado
```typescript
if (typeof req.body !== "object" || req.body === null) {
  return context.res = {
    status: 400,
    body: { error: "Request body must be a JSON object" },
  };
}
```

### Impacto
- **Severidade:** Baixa (Zod já trata isso com 400, mas mensagem de erro pode ser confusa)
- **Esforço para corrigir:** Muito Baixo (~5 min)

### Correção Proposta
```typescript
const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  try {
    // Validate body is an object
    if (typeof req.body !== "object" || req.body === null) {
      throw new Error("Request body must be a JSON object");
    }

    const input = QueryInputSchema.parse(req.body);
    // ... resto ...
  } catch (error) {
    // ... error handling ...
  }
};
```

---

## Crítica 3: Missing Input Coercion (Whitespace)

### Problema
Se o cliente envia `{"question": "  what is SLA?  "}`, Zod valida como sucesso (não vazio). Mas a pergunta tem espaços extras que podem prejudicar embedding e search.

Idealmente você faria `.trim()` nas strings.

### Esperado
```typescript
const QueryInputSchema = z.object({
  question: z.string().min(1).max(500).transform(s => s.trim()).refine(s => s.length > 0, "Question cannot be only whitespace"),
});
```

### Impacto
- **Severidade:** Muito Baixa (raro um cliente enviar só espaços)
- **Esforço para corrigir:** Baixo (~5 min)

### Correção Proposta
Usar `.transform()` de Zod para normalizar:
```typescript
const QueryInputSchema = z.object({
  question: z.string()
    .transform(s => s.trim())
    .refine(s => s.length > 0, "Question cannot be empty or whitespace")
    .refine(s => s.length <= 500, "Question must be <= 500 chars"),
});
```

---

## Outras Observações (Não Críticas)

- **Logger initialization:** Está OK, mas poderia incluir um `logLevel` via env var. Ex: `pino({ level: process.env.LOG_LEVEL || "info" })`
- **Type exports:** Bom que exporta `QueryInput` e `QueryOutput` types. Permite que outras funções reutilizem.
- **Missing request ID:** Em sistemas distribuídos, é útil logar um request ID para rastrear a mesma request através de múltiplos logs. Mas isso pode ser adicionado depois.

---

## Checklist de Correção

Antes de passar para code review real:
- [ ] Todos os logs estruturados com campos: `function`, `action`, dados relevantes
- [ ] Validação de tipo do body (deve ser object)
- [ ] Trimming de strings de entrada
- [ ] Sem secrets ou dados sensíveis em logs
- [ ] Código compila e passa testes

---

## Impacto Geral no Projeto

Depois de corrigir esses 3 pontos:
- ✓ Código está pronto para code review real
- ✓ Observability é boa (logs estruturados, rastreável)
- ✓ Input validation é robusta
- ✓ Segue padrões do projeto

---

## Tempo Estimado Para Corrigir
- Crítica 1 (Logging): 10 min
- Crítica 2 (Body type): 5 min
- Crítica 3 (Whitespace): 5 min
- **Total: ~20 min**

---

## Próximos Passos
1. Aplique as correções acima
2. Compile: `npm run build`
3. Teste manualmente (se possível)
4. Sinta-se à vontade para levar a code review real
```

## Critérios de Aceite

- [ ] Documento `code-review.md` identifica 2-3 problemas reais do código
- [ ] Cada problema tem: descrição do que está errado, impacto (severidade + esforço), correção proposta
- [ ] Problemas não são triviais ("variável tem nome feio") nem óbvios (erros de compilação)
- [ ] Problemas são específicos ao código gerado (não achismos genéricos)
- [ ] Proposta de correção é concreta (inclui código/exemplo)

## Passo a Passo

### Passo 1: Ler o código gerado
Abra `src/functions/query.ts` e leia completamente. Anote pontos que parecem estranhos ou incompletos.

### Passo 2: Pensar como code reviewer
Pergunte-se:
- "Se eu fosse revisar este código em produção, o que me preocuparia?"
- "Há edge cases que não estão cobertos?"
- "Logs são úteis para debugging?"
- "Validação está completa?"
- "Há desvios dos padrões do projeto?"

### Passo 3: Usar Claude para validar
Cole o código num chat com Claude e peça:

> "Estou fazendo code review deste Azure Function. Quais são os 3-5 problemas que você vê que precisariam ajuste antes de um code review real? Foque em:
> - Validação incompleta
> - Logging pouco informativo
> - Edge cases não tratados
> - Desvios de padrão
>
> Não conte "variável poderia ter nome melhor" ou "adicione comentários" — quero problemas reais."

Claude deve sugerir coisas como:
- Logs não-estruturados
- Falta de body type check
- Sem trim de strings
- Sem handling de rate limits

### Passo 4: Documentar cada crítica
Para cada problema:
1. **Problema:** O que está errado (com código exemplo)
2. **Impacto:** Severidade (Crítica/Alta/Média/Baixa) + Esforço para corrigir
3. **Esperado:** Como deveria ser
4. **Correção:** Código concreto para corrigir

### Passo 5: Ser crítico, não destrutivo
Críticas devem ser construtivas:

❌ RUIM: "Logging é ruim demais"  
✅ BOM: "Logging não é estruturado. Isto torna impossível filtrar por `action == 'validation_error'` em logs centralizados. Deveria ser `logger.info({ function: 'query', action: 'validation_error', ... })`."

### Passo 6: Indicar esforço e severidade
Isso ajuda a priorizar correções:

| Severidade | Exemplo |
|-----------|---------|
| Crítica | Segurança ou quebra funcionalidade |
| Alta | Impacta produção ou observability significativamente |
| Média | Impacta observability ou maintainability |
| Baixa | Código ainda funciona, mas não é ideal |

| Esforço | Exemplo |
|--------|---------|
| Muito Baixo | < 5 min |
| Baixo | 5-15 min |
| Médio | 15-60 min |
| Alto | > 60 min |

## Dicas

- **Diferencie "não é perfeito" de "não funciona":** Copilot pode gerar código que compila e funciona, mas que tem subotimalidades (logging, edge cases). Identifique isto.

- **Pense em produção:** Se este código rodasse em produção processando 1000 queries/dia, o que quebraria?
  - Logs pouco estruturados → você não consegue debugar falhas
  - Sem rate limiting → DoS possível
  - Sem handling de timeout → função trava e perde requests

- **Problemas específicos ao projeto:** Se o projeto usa structured logging com certos campos, e o Copilot gerou logging diferente, isto é uma crítica válida.

## Referências

- Código da Tarefa 2.2.2 (`src/functions/query.ts`)
- [Code Review Best Practices](https://google.github.io/eng-practices/review/)
- Padrões do projeto (Anexo C)
