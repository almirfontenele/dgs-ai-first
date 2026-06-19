# Exercício 3.2 — Revisão crítica de código gerado por IA

**Papel:** Desenvolvedor  
**Tópico:** Revisão Crítica de Outputs de IA  
**Cenário:** [Contexto compartilhado](../cenario-3-contexto.md)

---

## Contexto

O Copilot gerou um módulo de feedback. O Tech Lead pediu que você revise antes do merge.

---

## Ferramentas a utilizar

- **Claude** (chat)
- **GitHub Copilot**

---

## Inputs fornecidos

O cenário completo (acima).

A estrutura do repositório (ver **Anexo C**) — o código deveria estar em `/src/functions/feedback/handler.ts`.

O módulo gerado pelo Copilot (simulado):

```typescript
// feedback-handler.ts — gerado pelo Copilot
import { app, HttpRequest, HttpResponseInit } from '@azure/functions';

export async function feedbackHandler(
  request: HttpRequest
): Promise<HttpResponseInit> {
  const body = await request.json() as any;

  const feedback = {
    queryId: body.queryId,
    rating: body.rating,
    comment: body.comment,
    attendantEmail: body.attendantEmail,
    timestamp: new Date().toISOString()
  };

  console.log('Feedback recebido:', JSON.stringify(feedback));

  const { CosmosClient } = require('@azure/cosmos');
  const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
  const database = client.database('novatech');
  const container = database.container('feedbacks');

  await container.items.create(feedback);

  return { status: 200, body: 'OK' };
}

app.http('feedback', {
  methods: ['POST'],
  handler: feedbackHandler
});
```

O AGENTS.md do projeto, construído no cenário 2 (resumo): *"TypeScript strict mode. Zod para validação de input. pino para logging (nunca console.log). Nunca logar dados pessoais (e-mail, nome). Imports estáticos no topo (nunca require dinâmico)."*

---

## Tarefa

### 1. Sua própria revisão

Faça sua própria revisão ANTES de usar o Claude.

Liste os problemas, classificando cada um:
- Violação do AGENTS.md
- Problema de segurança
- Bug potencial

### 2. Revisão do Claude

Use o **Claude** para uma segunda revisão e compare as listas.

### 3. Reescreva o módulo (GitHub Copilot)

Usando o **GitHub Copilot**, reescreva o módulo corrigindo os problemas.

O código final deve seguir o AGENTS.md.

---

## Entregável

- Sua revisão
- A revisão do Claude
- A comparação
- O código reescrito

---

## Critérios de avaliação

- [ ] São identificados no mínimo: `as any` sem validação Zod, `console.log` em vez de pino, `require` dinâmico, e o `attendantEmail` (dado pessoal) sendo logado
- [ ] A comparação humano vs Claude é honesta
- [ ] O código reescrito resolve os problemas e segue o AGENTS.md
