# SKILL: create-integration-test
## NovaTech RAG Query Endpoint

---

## Activation Phrase

**Use esta skill quando:**
- Gerar teste de integração para o endpoint `POST /query`
- Validar comportamento de múltiplos componentes juntos (handler + RAG + LLM)
- Testar cenários que cruzam limites de módulo (ex: handler chama retrieval service que chama o LLM)

**NÃO use esta skill (use outra):**
- Testes unitários de funções isoladas → use **unit-test skill**
- Testes end-to-end que atravessam múltiplos serviços via HTTP real → use **e2e-test skill**
- Testes de carga/performance/throughput → use **load-test skill**

---

## Dependencies (Leia primeiro)

Antes de usar esta skill, leia os documentos abaixo na ordem indicada:

1. `docs/exercicio-2-fase-estruturacao/papeis/qa/exercicio-2-1-testing-standards/testing-standards.md`
   — Define nomenclatura, estrutura ARRANGE/ACT/ASSERT, padrões de MSW e fixtures obrigatórias

2. `docs/anexos/anexo-a-documentacao-simulada-novatech.md`
  — Fonte de contexto do dominio NovaTech para criar perguntas e respostas realistas

3. `docs/anexos/anexo-b-chunks-referencia-rag.md`
  — Base de chunks de referencia para derivar dados de teste do RAG

4. `src/functions/query/handler.ts`
  — Assinatura da função `queryHandler` e contrato de retorno `{ answer, sources, confidence }`

5. `src/functions/query/validator.ts`
  — Schemas de entrada e saida usados pelo endpoint

6. `src/functions/query/response-builder.ts`
  — Regras de validacao da resposta e formato JSON final

---

## DO — Obrigatório

### 1. Nome do `describe` + `it` no padrão "should [behavior] when [condition]"

O bloco `describe` nomeia o componente. O bloco `it` descreve comportamento observável no domínio do negócio.

```typescript
// ✓ Correto
describe('QueryEndpoint', () => {
  it('should return SLA deadline when asked about SP to Fortaleza fractioned cargo', async () => { ... })
  it('should return confidence above 0.7 when retrieval score is high', async () => { ... })
  it('should return 400 when query body is missing', async () => { ... })
})
```

### 2. Seções ARRANGE / ACT / ASSERT comentadas explicitamente

Cada seção deve ter seu próprio comentário. A seção ACT contém exatamente uma chamada — a ação sendo testada.

```typescript
it('should return SLA info when asked about fractioned cargo deadline', async () => {
  // ARRANGE
  server.use(
    http.post('http://retrieval-service/search', () =>
      HttpResponse.json({ chunks: [freightChunks.spToFortaleza] })
    )
  )
  const query = slaQuestions.spToFortaleza

  // ACT
  const result = await queryEndpoint(query)

  // ASSERT
  expect(result.answer).toContain('5 a 7 dias úteis')
  expect(result.sources).toHaveLength(1)
  expect(result.sources[0].document).toBe('POL-SLA-001')
  expect(result.confidence).toBeGreaterThan(0.7)
})
```

### 3. MSW obrigatório para todos os endpoints HTTP

Todo serviço externo (retrieval, LLM, notificações) deve ser interceptado pelo MSW. A opção `onUnhandledRequest: 'error'` garante que chamadas não mapeadas causem falha imediata.

```typescript
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### 4. Dados de teste derivados dos anexos do projeto

Nunca defina payloads de chunks ou queries sem origem de dominio. Derive os dados dos anexos A/B ou de um helper de fixtures criado pela equipe para o projeto.

```typescript
// ✓ Usa dados derivados dos anexos do projeto
server.use(
  http.post('http://retrieval-service/search', () =>
    HttpResponse.json({ chunks: [/* chunk derivado do Anexo B */] })
  )
)
const result = await queryHandler({ question: 'Qual o prazo para entrega de SP para Fortaleza?' })
```

### 5. Assertions em `answer` + `sources` + `confidence`

O contrato do endpoint é `{ answer, sources, confidence }`. Todos os tres campos devem ser verificados em testes de happy path.

```typescript
// ASSERT
expect(result.answer).toContain('5 a 7 dias úteis')
expect(result.sources).toHaveLength(1)
expect(result.sources[0].document).toBe('POL-SLA-001')
expect(result.confidence).toBeGreaterThan(0.7)
expect(result.confidence).toBeLessThanOrEqual(1.0)
```

### 6. `beforeAll` / `afterAll` + `afterEach` cleanup obrigatório

Sem cleanup, handlers de um teste contaminam o próximo, causando falhas intermitentes e difíceis de rastrear.

```typescript
const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  server.resetHandlers() // remove handlers adicionados dentro de testes individuais
})

afterAll(() => {
  server.close() // encerra o servidor MSW após toda a suite
})
```

### 7. Dados realistas do domínio NovaTech

Use termos reais do negócio: rotas, documentos, prazos, tipos de carga. Dados genéricos mascaram erros de negócio e dificultam diagnóstico.

```typescript
// ✓ Dados com significado de domínio
const query = { query: 'Qual o prazo para entrega de SP para Fortaleza de carga fracionada?' }
const chunk = {
  document_id: 'POL-SLA-001',
  content: 'Carga fracionada SP→CE: prazo de 5 a 7 dias úteis conforme tabela regional.',
  score: 0.89,
}
```

### 8. Confidence threshold > 0.7 para happy path

Em cenários de happy path, o retrieval retorna score alto (≥ 0.85) e a confidence resultante deve ser superior a 0.7. Sempre afirme esse limiar explicitamente.

```typescript
// ARRANGE — chunk com score alto
server.use(
  http.post('http://retrieval-service/search', () =>
    HttpResponse.json({
      chunks: [{ document_id: 'POL-SLA-001', content: '...', score: 0.89 }],
    })
  )
)

// ASSERT — confidence reflete score alto
expect(result.confidence).toBeGreaterThan(0.7)
```

---

## DONT — Proibido

### 1. Assertions vagas como única verificação

`toBeDefined()` e `toBeTruthy()` passam para qualquer valor não-nulo, incluindo respostas de erro disfarçadas de objetos.

```typescript
// ✗ Não verifica o conteúdo real
expect(result).toBeDefined()
expect(result.answer).toBeTruthy()
```

### 2. Dados genéricos sem significado de domínio

Dados sem contexto de negócio passam por validações que deveriam falhar para entradas inválidas.

```typescript
// ✗ Sem contexto de negócio
const query = { query: 'test' }
const chunk = { document_id: 'doc1', content: 'foo bar', score: 0.9 }
```

### 3. Chamadas diretas a APIs externas sem MSW

Testes que fazem chamadas reais são lentos, instáveis e geram custos de API.

```typescript
// ✗ Chama API real sem interceptação
it('should generate answer', async () => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({ model: 'gpt-4o', messages: [...] }),
  })
})
```

### 4. Teste sem `describe` — só `it()` solto no módulo

Testes sem agrupamento são impossíveis de filtrar, difíceis de ler no relatório e violam os padrões do projeto.

```typescript
// ✗ it() raiz sem describe
it('should return answer', async () => {
  const result = await queryEndpoint({ query: 'prazo SP' })
  expect(result.answer).toBeDefined()
})
```

### 5. Estado global compartilhado entre testes

Variáveis mutáveis no escopo do módulo criam dependência de ordem — testes falham aleatoriamente dependendo de qual é executado primeiro.

```typescript
// ✗ Estado global mutável
let sharedResult: QueryResponse

it('first test', async () => {
  sharedResult = await queryEndpoint({ query: 'prazo SP' })
})

it('second test depends on first', async () => {
  expect(sharedResult.confidence).toBeGreaterThan(0.5) // falha se executado isolado
})
```

### 6. `sleep()` / `setTimeout()` para aguardar operações assíncronas

Esperas arbitrárias tornam a suite lenta, mascaram race conditions e são indício de código assíncrono mal estruturado.

```typescript
// ✗ Espera arbitrária
it('should process query', async () => {
  queryEndpoint({ query: 'prazo Manaus' })
  await new Promise(r => setTimeout(r, 1000)) // aguarda "de boa"
  expect(cache.has('prazo Manaus')).toBe(true)
})
```

### 7. Fixture inline hardcoded dentro do teste

Chunks e respostas definidos diretamente no corpo do teste criam duplicação, dificultam manutenção e violam o princípio de fixture centralizada.

```typescript
// ✗ Fixture hardcoded inline
it('should return SLA', async () => {
  server.use(
    http.post('http://retrieval-service/search', () =>
      HttpResponse.json({
        chunks: [{ document_id: 'POL-SLA-001', content: 'Prazo 5 dias.', score: 0.88 }],
      })
    )
  )
  // ... o mesmo chunk repetido em 10 testes diferentes
})
```

### 8. Mais de 5 assertions em um único `it()`

Testes com muitas assertions verificam múltiplos comportamentos ao mesmo tempo. Quando falham, é difícil identificar qual comportamento está errado.

```typescript
// ✗ 10+ assertions em um único it()
it('should work correctly', async () => {
  const result = await queryHandler({ question: 'prazo SP' })
  expect(result.answer).toBeDefined()
  expect(result.answer).toContain('dias')
  expect(result.sources).toBeDefined()
  expect(result.sources[0].document).toMatch(/^POL/)
  expect(result.confidence).toBeDefined()
  expect(result.confidence).toBeGreaterThan(0)
  expect(result.confidence).toBeLessThan(1)
  expect(result.confidence).toBeGreaterThan(0.5)
  expect(result.confidence).toBeGreaterThan(0.7)
  expect(typeof result.answer).toBe('string')
})
```

### 9. Falta de `afterEach(server.resetHandlers())`

Sem reset, handlers adicionados em um teste com `server.use()` persistem para os próximos testes, causando falhas cruzadas.

```typescript
// ✗ Sem cleanup de handlers
beforeAll(() => server.listen())
afterAll(() => server.close())
// afterEach ausente — handlers vazam entre testes
```

### 10. Somente happy path — sem verificar `source_document` em edge cases

Testes que só cobrem o caminho feliz deixam sem verificação o comportamento quando o retrieval retorna score baixo, documentos inesperados ou nenhum chunk.

```typescript
// ✗ Apenas happy path, sem edge cases
describe('QueryEndpoint', () => {
  it('should return answer', async () => {
    // apenas o cenário ideal — retrieval perfeito, confidence alta
    const result = await queryEndpoint(slaQuestions.spToFortaleza)
    expect(result.answer).toContain('dias úteis')
  })
  // sem teste para: score baixo, chunk errado, retrieval indisponível
})
```

---

## Template com Placeholders

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { queryHandler } from '@/functions/query/handler'

// ─── MSW Setup ───────────────────────────────────────────────────────────────

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// ─── Test Suite ──────────────────────────────────────────────────────────────

describe('[PLACEHOLDER: nome do componente — ex: QueryEndpoint]', () => {

  // Happy path
  it('should [PLACEHOLDER: comportamento esperado] when [PLACEHOLDER: condição]', async () => {
    // ARRANGE
    server.use(
      http.post('http://retrieval-service/search', () =>
        HttpResponse.json({
          chunks: [
            // [PLACEHOLDER: derive from docs/anexos/anexo-a-documentacao-simulada-novatech.md and anexo-b-chunks-referencia-rag.md]
          ],
        })
      )
    )
    const query = { question: '[PLACEHOLDER: pergunta do dominio NovaTech]' }

    // ACT
    const result = await queryHandler(query)

    // ASSERT
    expect(result.answer).toContain('[PLACEHOLDER: trecho esperado na resposta]')
    expect(result.sources[0].document).toBe('[PLACEHOLDER: document_id do chunk mockado]')
    expect(result.confidence).toBeGreaterThan(0.7)
    expect(result.confidence).toBeLessThanOrEqual(1.0)
  })

  // Edge case: retrieval com score baixo
  it('should return low confidence when [PLACEHOLDER: condição de score baixo]', async () => {
    // ARRANGE
    server.use(
      http.post('http://retrieval-service/search', () =>
        HttpResponse.json({
          chunks: [
            {
              document_id: '[PLACEHOLDER: document_id]',
              content: '[PLACEHOLDER: conteúdo parcialmente relacionado]',
              score: 0.3, // [PLACEHOLDER: score abaixo do threshold]
            },
          ],
        })
      )
    )
    const query = { query: '[PLACEHOLDER: query do domínio NovaTech]' }

    // ACT
    const result = await queryEndpoint(query)

    // ASSERT
    expect(result.confidence).toBeLessThan(0.5)
    expect(result.sources[0].document).toBe('[PLACEHOLDER: document_id esperado mesmo com score baixo]')
  })

  // Error case: serviço indisponível
  it('should throw error when retrieval service returns [PLACEHOLDER: código de erro]', async () => {
    // ARRANGE
    server.use(
      http.post('http://retrieval-service/search', () =>
        HttpResponse.json(
          { error: '[PLACEHOLDER: mensagem de erro]' },
          { status: 503 } // [PLACEHOLDER: status de erro esperado]
        )
      )
    )
    const query = { query: '[PLACEHOLDER: query do domínio NovaTech]' }

    // ACT & ASSERT
    await expect(queryHandler(query)).rejects.toThrow('[PLACEHOLDER: mensagem de erro esperada]')
  })
})
```

---

## Exemplo Correto (✓)

Cenário: "Qual o prazo para entrega de SP para Fortaleza de carga fracionada?"

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { queryHandler } from '@/functions/query/handler'

// ─── MSW Setup ───────────────────────────────────────────────────────────────

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// ─── Test Suite ──────────────────────────────────────────────────────────────

describe('QueryEndpoint — SLA fractioned cargo', () => {

  it('should return delivery deadline when asked about SP to Fortaleza fractioned cargo', async () => {
    // ARRANGE
    server.use(
      http.post('http://retrieval-service/search', () =>
        HttpResponse.json({
          chunks: [
            {
              document_id: 'POL-SLA-001',
              content:
                'Carga fracionada SP→CE (Fortaleza): prazo padrão de 5 a 7 dias úteis. ' +
                'Para volumes acima de 500 kg, prazo de 6 a 8 dias úteis.',
              score: 0.91,
            },
          ],
        })
      )
    )
    const query = {
      query: 'Qual o prazo para entrega de SP para Fortaleza de carga fracionada?',
    }

    // ACT
    const result = await queryHandler(query)

    // ASSERT
    expect(result.answer).toContain('dias úteis')
    expect(result.sources[0].document).toBe('POL-SLA-001')
    expect(result.confidence).toBeGreaterThan(0.7)
    expect(result.confidence).toBeLessThanOrEqual(1.0)
  })

  it('should return low confidence when retrieval score is below threshold for fractioned cargo query', async () => {
    // ARRANGE
    server.use(
      http.post('http://retrieval-service/search', () =>
        HttpResponse.json({
          chunks: [
            {
              document_id: 'POL-SLA-001',
              content: 'Informação parcialmente relacionada ao transporte.',
              score: 0.28,
            },
          ],
        })
      )
    )
    const query = {
      query: 'Existe algum desconto para envio fracionado em paletes para o Nordeste?',
    }

    // ACT
    const result = await queryHandler(query)

    // ASSERT
    expect(result.confidence).toBeLessThan(0.5)
    expect(result.sources[0].document).toBe('POL-SLA-001')
  })

  it('should throw RetrievalUnavailableError when retrieval service returns 503', async () => {
    // ARRANGE
    server.use(
      http.post('http://retrieval-service/search', () =>
        HttpResponse.json({ error: 'Service Unavailable' }, { status: 503 })
      )
    )
    const query = {
      query: 'Qual o prazo para entrega de SP para Fortaleza de carga fracionada?',
    }

    // ACT & ASSERT
    await expect(queryHandler(query)).rejects.toThrow('Retrieval service unavailable')
  })
})
```

---

## Exemplo com Problemas (✗)

O mesmo cenário escrito com 6+ anti-padrões anotados:

```typescript
import { describe, it, expect } from 'vitest' // ❌ Problema: falta beforeAll/afterAll/afterEach — sem lifecycle de MSW

describe('query', () => { // ❌ Problema: nome genérico "query" — não descreve o componente nem o contexto

  it('test endpoint', async () => { // ❌ Problema: nome "test endpoint" não descreve comportamento nem condição
    // ❌ Problema: sem ARRANGE/ACT/ASSERT — estrutura não está presente

    const result = await fetch('http://retrieval-service/search', { // ❌ Problema: chamada direta sem MSW — tráfego real em teste
      method: 'POST',
      body: JSON.stringify({ query: 'test' }), // ❌ Problema: dado genérico "test" sem significado de domínio
    }).then(r => r.json())

    expect(result).toBeDefined() // ❌ Problema: assertion vaga — passa para qualquer objeto não-nulo
    // ❌ Problema: falta verificar source_document e confidence — contrato do endpoint não validado
  })
})
```

---

## Anti-Patterns Gallery

### 1. Assertions vagas: `toBeDefined()` como única assertion

```typescript
// ✗ Errado
expect(result).toBeDefined()
expect(result.answer).toBeTruthy()
```

**Por que é perigoso:** passa para `result = { answer: "erro interno" }` — valida a existência, não o conteúdo correto.

```typescript
// ✓ Correto
expect(result.answer).toContain('5 a 7 dias úteis')
expect(result.sources[0].document).toBe('POL-SLA-001')
expect(result.confidence).toBeGreaterThan(0.7)
```

---

### 2. Dados genéricos: `question: "test"` ou `"hello"`

```typescript
// ✗ Errado
const query = { query: 'hello' }
const chunk = { document_id: 'doc1', content: 'foo bar', score: 0.9 }
```

**Por que é perigoso:** queries sem contexto de domínio passam por validações de formato mas mascaram erros semânticos de negócio.

```typescript
// ✓ Correto
const query = { query: 'Qual o prazo para entrega de SP para Fortaleza de carga fracionada?' }
const chunk = {
  document_id: 'POL-SLA-001',
  content: 'Carga fracionada SP→CE: prazo de 5 a 7 dias úteis.',
  score: 0.91,
}
```

---

### 3. Sem MSW: chamada direta a `fetch()` sem mock

```typescript
// ✗ Errado
it('should return answer', async () => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({ model: 'gpt-4o', messages: [{ role: 'user', content: 'prazo SP' }] }),
  })
})
```

**Por que é perigoso:** testes fazem chamadas reais, são lentos, instáveis em CI e geram custos de API.

```typescript
// ✓ Correto
server.use(
  http.post('https://api.openai.com/v1/chat/completions', () =>
    HttpResponse.json({ choices: [{ message: { content: '5 a 7 dias úteis' } }] })
  )
)
```

---

### 4. Teste sem `describe`: só o `it()` raiz

```typescript
// ✗ Errado
it('should return answer for SP to Fortaleza', async () => {
  const result = await queryEndpoint({ query: 'prazo SP Fortaleza' })
  expect(result.answer).toBeDefined()
})
```

**Por que é perigoso:** testes soltos são impossíveis de filtrar por suite, dificultam navegação no relatório e violam o padrão do projeto.

```typescript
// ✓ Correto
describe('QueryEndpoint — SLA fractioned cargo', () => {
  it('should return deadline when asked about SP to Fortaleza fractioned cargo', async () => { ... })
})
```

---

### 5. Estado global: variável compartilhada entre testes modificada

```typescript
// ✗ Errado
let cachedResult: QueryResponse

it('first: fetch result', async () => {
  cachedResult = await queryHandler({ question: 'prazo SP Fortaleza' })
})

it('second: use cached result', async () => {
  expect(cachedResult.sources[0].document).toBe('POL-SLA-001') // falha se executado isolado
})
```

**Por que é perigoso:** cria dependência de ordem entre testes — a suite falha aleatoriamente quando os testes são executados em paralelo ou filtrados individualmente.

```typescript
// ✓ Correto
it('should return correct source document for SP to Fortaleza query', async () => {
  const result = await queryHandler({ question: 'prazo SP Fortaleza' })
  expect(result.sources[0].document).toBe('POL-SLA-001')
})
```

---

### 6. `sleep()`: `await new Promise(r => setTimeout(r, 1000))`

```typescript
// ✗ Errado
it('should process async query', async () => {
  queryEndpoint({ query: 'prazo SP Fortaleza' })
  await new Promise(r => setTimeout(r, 1000))
  expect(responseCache.has('prazo SP Fortaleza')).toBe(true)
})
```

**Por que é perigoso:** torna a suite lenta (cada teste adiciona 1s+), mascara race conditions e é indício de que a promise não está sendo aguardada corretamente.

```typescript
// ✓ Correto
it('should cache result after processing query', async () => {
  await queryEndpoint({ query: 'prazo SP Fortaleza' })
  expect(responseCache.has('prazo SP Fortaleza')).toBe(true)
})
```

---

### 7. Fixture inline hardcoded: chunks definidos dentro do teste

```typescript
// ✗ Errado
it('should return SLA for SP to Fortaleza', async () => {
  server.use(
    http.post('http://retrieval-service/search', () =>
      HttpResponse.json({
        chunks: [
          { document_id: 'POL-SLA-001', content: 'Prazo 5 a 7 dias.', score: 0.88 }, // duplicado em 8 arquivos
        ],
      })
    )
  )
})
```

**Por que é perigoso:** duplicação de dados leva a inconsistências quando o documento muda — parte dos testes passa com o valor antigo, parte falha.

```typescript
// ✓ Correto
// Derive os dados dos anexos A/B ou de um helper local de fixtures do projeto

server.use(
  http.post('http://retrieval-service/search', () =>
    HttpResponse.json({ chunks: [freightChunks.spToFortaleza] })
  )
)
```

---

### 8. Teste que verifica muita coisa: 10+ assertions em um único `it()`

```typescript
// ✗ Errado
it('should work correctly', async () => {
  const result = await queryHandler({ question: 'prazo SP Fortaleza' })
  expect(result.answer).toBeDefined()
  expect(typeof result.answer).toBe('string')
  expect(result.answer.length).toBeGreaterThan(0)
  expect(result.answer).toContain('dias')
  expect(result.answer).toContain('úteis')
  expect(result.sources).toBeDefined()
  expect(result.sources[0].document).toContain('POL')
  expect(result.confidence).toBeDefined()
  expect(result.confidence).toBeGreaterThan(0)
  expect(result.confidence).toBeLessThanOrEqual(1)
  expect(result.confidence).toBeGreaterThan(0.7)
})
```

**Por que é perigoso:** quando o teste falha, não é possível identificar rapidamente qual comportamento está errado sem ler todas as 11 assertions.

```typescript
// ✓ Correto — um it() por comportamento
it('should include delivery deadline in answer for SP to Fortaleza query', async () => {
  const result = await queryHandler(query)
  expect(result.answer).toContain('dias úteis')
})

it('should reference POL-SLA-001 as source when fractioned cargo policy matches', async () => {
  const result = await queryEndpoint(query)
  expect(result.sources[0].document).toBe('POL-SLA-001')
})

it('should return confidence above 0.7 when retrieval score is high', async () => {
  const result = await queryHandler(query)
  expect(result.confidence).toBeGreaterThan(0.7)
})
```

---

### 9. Sem cleanup: falta `afterEach(server.resetHandlers())`

```typescript
// ✗ Errado
const server = setupServer()
beforeAll(() => server.listen())
afterAll(() => server.close())
// afterEach ausente

it('first test adds a handler', async () => {
  server.use(http.post('http://retrieval-service/search', () => HttpResponse.json({ chunks: [] })))
  // ...
})

it('second test is contaminated by first handler', async () => {
  // recebe chunks: [] porque o handler do teste anterior ainda está ativo
  const result = await queryEndpoint({ query: 'prazo SP Fortaleza' })
})
```

**Por que é perigoso:** handlers adicionados com `server.use()` dentro de testes persistem para os seguintes, causando comportamentos inesperados e falhas difíceis de reproduzir.

```typescript
// ✓ Correto
afterEach(() => {
  server.resetHandlers()
})
```

---

### 10. Happy-path apenas: sem testar `source_document` em edge cases

```typescript
// ✗ Errado — só happy path
describe('QueryEndpoint', () => {
  it('should return answer for SP to Fortaleza', async () => {
    // apenas cenário ideal — retrieval retorna score perfeito
    const result = await queryEndpoint(slaQuestions.spToFortaleza)
    expect(result.answer).toContain('dias úteis')
  })
  // sem teste para: score abaixo do threshold, chunks de documento errado,
  // retrieval retornando 503, query sem correspondência
})
```

**Por que é perigoso:** a lógica de seleção de `source_document` e cálculo de `confidence` para casos limítrofes nunca é validada — bugs nesses caminhos chegam silenciosamente à produção.

```typescript
// ✓ Correto — happy path + edge cases
it('should return POL-SLA-001 as source when fractioned cargo chunk matches', async () => {
  server.use(
    http.post('http://retrieval-service/search', () =>
      HttpResponse.json({ chunks: [{ document_id: 'POL-SLA-001', content: '5 a 7 dias úteis', score: 0.91 }] })
    )
  )
  const result = await queryHandler({ question: 'prazo SP Fortaleza carga fracionada' })
  expect(result.sources[0].document).toBe('POL-SLA-001')
})

it('should return source document from low-score chunk when no better match exists', async () => {
  server.use(
    http.post('http://retrieval-service/search', () =>
      HttpResponse.json({ chunks: [{ document_id: 'POL-SLA-001', content: 'Conteúdo parcial.', score: 0.25 }] })
    )
  )
  const result = await queryHandler({ question: 'existe desconto para frete fracionado?' })
  expect(result.sources[0].document).toBe('POL-SLA-001')
  expect(result.confidence).toBeLessThan(0.5)
})
```
