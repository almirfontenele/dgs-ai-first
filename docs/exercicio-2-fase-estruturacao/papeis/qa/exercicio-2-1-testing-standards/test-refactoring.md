# Test Refactoring — Aplicando Testing Standards

## Teste Original (Baseline)

```typescript
test('query endpoint works', async () => {
  const result = await handler({ body: '{"question": "test"}' });
  expect(result).toBeDefined();
});
```

### Problemas Identificados

| # | Problema |
|---|---|
| ❌ 1 | **Descrição vaga** — `'query endpoint works'` não comunica qual comportamento está sendo verificado nem em qual condição |
| ❌ 2 | **Ausência de estrutura Arrange/Act/Assert** — sem separação explícita das fases, o teste é ilegível e difícil de depurar |
| ❌ 3 | **Dado de entrada irreal** — `"question": "test"` não pertence ao domínio de logística; mascara erros de negócio e passa por validações que deveriam falhar |
| ❌ 4 | **Assertion fraca** — `expect(result).toBeDefined()` passa para qualquer valor não-nulo, incluindo respostas de erro disfarçadas de sucesso |
| ❌ 5 | **Sem mocks de serviços externos** — o teste não intercepta chamadas HTTP ao serviço de retrieval RAG nem à API de LLM, podendo fazer chamadas reais (lentas, instáveis e com custo) |
| ❌ 6 | **Sem validação de `source_document` e `confidence`** — o contrato do endpoint exige `{ answer, source_document, confidence }`, mas nenhum desses campos é verificado adequadamente |

---

## Versão 1: Padrões Básicos

```typescript
import { describe, it, expect } from 'vitest'
import { handler } from '@/handlers/query'

describe('QueryEndpoint', () => {
  it('should return SLA info when asked about delivery deadline', async () => {
    // ARRANGE
    const event = {
      body: JSON.stringify({
        question: 'Qual o prazo de entrega de São Paulo para Rio de Janeiro?',
      }),
    }

    // ACT
    const result = await handler(event)
    const body = JSON.parse(result.body)

    // ASSERT
    expect(result.statusCode).toBe(200)
    expect(body.answer).toContain('dias úteis')
    expect(body.source_document).toBeDefined()
  })
})
```

### Melhorias em relação ao Baseline

- O bloco `describe('QueryEndpoint')` identifica claramente a unidade sendo testada
- O bloco `it('should return SLA info when asked about delivery deadline')` descreve comportamento observável no domínio do negócio
- As seções `// ARRANGE`, `// ACT`, `// ASSERT` tornam o teste legível e auditável
- O dado de entrada `'Qual o prazo de entrega de São Paulo para Rio de Janeiro?'` é realista e pertence ao domínio de logística NovaTech
- `expect(result.statusCode).toBe(200)` valida o status HTTP explicitamente
- `expect(body.answer).toContain('dias úteis')` verifica conteúdo real da resposta
- `expect(body.source_document).toBeDefined()` verifica a presença do documento fonte (ainda superficial — melhorado na Versão 2)

### Padrões Aplicados

- **Seção "Nomenclatura de Testes"** — uso de `describe/it` com padrão `should [behavior] when [condition]` e termos do domínio de negócio ("SLA", "delivery deadline")
- **Seção "Estrutura Obrigatória: Arrange/Act/Assert"** — três seções explicitamente comentadas, ACT com uma única chamada
- **Seção "O Que Todo Teste DEVE Ter" › 3. Dados de teste realistas** — pergunta real do domínio NovaTech (rota SP→RJ)
- **Seção "O Que Todo Teste NÃO DEVE Ter" › 1. `toBeDefined()` como única assertion** — adicionadas assertions específicas de `statusCode` e `answer`

---

## Versão 2: Com Mocking MSW e Fixtures

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { handler } from '@/handlers/query'
import { slaQuestions, freightChunks } from '@/tests/fixtures/novatech'

// ─── Configuração do servidor MSW ────────────────────────────────────────────

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// ─── Suite de testes ─────────────────────────────────────────────────────────

describe('QueryEndpoint', () => {
  it('should return SLA info when asked about delivery deadline', async () => {
    // ARRANGE
    server.use(
      http.post('http://retrieval-service/search', () =>
        HttpResponse.json({
          chunks: [
            {
              document_id: 'POL-SLA-001',
              content: 'O prazo de entrega de São Paulo para Rio de Janeiro é de 2 dias úteis para frete padrão.',
              score: 0.91,
            },
          ],
        })
      )
    )

    const event = {
      body: JSON.stringify(slaQuestions.spToRj),
    }

    // ACT
    const result = await handler(event)
    const body = JSON.parse(result.body)

    // ASSERT
    expect(result.statusCode).toBe(200)
    expect(body.answer).toContain('dias úteis')
    expect(body.source_document).toBe('POL-SLA-001')
    expect(body.confidence).toBeGreaterThan(0.7)
    expect(body.confidence).toBeLessThanOrEqual(1.0)
  })
})
```

> **Nota sobre fixtures:** o arquivo `/tests/fixtures/novatech.ts` deve exportar `slaQuestions.spToRj` com o valor `{ query: 'Qual o prazo de entrega de São Paulo para Rio de Janeiro?' }`. Veja a estrutura completa de fixtures na seção "Padrões de Fixtures" do `testing-standards.md`.

### Melhorias em relação à Versão 1

- **MSW intercepta o serviço de retrieval RAG** — elimina chamadas reais, tornando o teste determinístico e sem custo
- **`onUnhandledRequest: 'error'`** — qualquer chamada HTTP não mapeada causa falha imediata, evitando chamadas acidentais a APIs reais
- **`beforeAll`/`afterEach`/`afterAll`** — ciclo de vida correto do servidor MSW garante isolamento entre testes
- **Fixture `slaQuestions.spToRj`** importada de `/tests/fixtures/novatech.ts` — dados centralizados, sem repetição inline
- **`source_document` verificado com valor específico** `'POL-SLA-001'` — valida que o documento correto foi recuperado
- **`confidence` verificado com faixa** (`> 0.7` e `<= 1.0`) — valida o contrato completo do endpoint

### Padrões Aplicados

- **Seção "O Que Todo Teste DEVE Ter" › 5. MSW configurado** — `setupServer` com `onUnhandledRequest: 'error'`
- **Seção "O Que Todo Teste DEVE Ter" › 6. Cleanup no `afterEach` e `afterAll`** — `server.resetHandlers()` e `server.close()`
- **Seção "O Que Todo Teste DEVE Ter" › 7. Fixtures reutilizáveis** — import de `/tests/fixtures/novatech`
- **Seção "O Que Todo Teste DEVE Ter" › 4. Assertions que validam `answer`, `source_document` e `confidence`** — todos os três campos do contrato verificados
- **Seção "Padrões de Mocking com MSW"** — uso de `http.post` para interceptar o retrieval service

---

## Versão 3: Cobertura Completa com Edge Cases

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { handler } from '@/handlers/query'
import { slaQuestions, freightChunks } from '@/tests/fixtures/novatech'

// ─── Configuração do servidor MSW ────────────────────────────────────────────

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// ─── Suite de testes ─────────────────────────────────────────────────────────

describe('QueryEndpoint', () => {

  // ── Happy path ──────────────────────────────────────────────────────────────

  it('should return SLA info when asked about delivery deadline', async () => {
    // ARRANGE
    server.use(
      http.post('http://retrieval-service/search', () =>
        HttpResponse.json({
          chunks: [
            {
              document_id: 'POL-SLA-001',
              content: 'O prazo de entrega de São Paulo para Rio de Janeiro é de 2 dias úteis para frete padrão.',
              score: 0.91,
            },
          ],
        })
      )
    )

    const event = {
      body: JSON.stringify(slaQuestions.spToRj),
    }

    // ACT
    const result = await handler(event)
    const body = JSON.parse(result.body)

    // ASSERT
    expect(result.statusCode).toBe(200)
    expect(body.answer).toContain('dias úteis')
    expect(body.source_document).toBe('POL-SLA-001')
    expect(body.confidence).toBeGreaterThan(0.7)
    expect(body.confidence).toBeLessThanOrEqual(1.0)
  })

  // ── Edge case VC-04: query fora do domínio ──────────────────────────────────

  it('should return fallback message when query is outside the knowledge domain', async () => {
    // ARRANGE — retrieval retorna chunks vazios para query fora do domínio
    server.use(
      http.post('http://retrieval-service/search', () =>
        HttpResponse.json({ chunks: [] })
      )
    )

    const event = {
      body: JSON.stringify({
        question: 'xxx yyy zzz fora do domínio',
      }),
    }

    // ACT
    const result = await handler(event)
    const body = JSON.parse(result.body)

    // ASSERT
    expect(result.statusCode).toBe(200)
    expect(body.answer).toContain('Não encontrei informações sobre este tópico')
    expect(body.source_document).toBeNull()
    expect(body.confidence).toBe(0)
  })

  // ── Edge case: serviço de retrieval indisponível ────────────────────────────

  it('should return 503 when retrieval service is unavailable', async () => {
    // ARRANGE
    server.use(
      http.post('http://retrieval-service/search', () =>
        HttpResponse.json({ error: 'Service Unavailable' }, { status: 503 })
      )
    )

    const event = {
      body: JSON.stringify({
        question: 'Qual o prazo de entrega para Manaus?',
      }),
    }

    // ACT
    const result = await handler(event)

    // ASSERT
    expect(result.statusCode).toBe(503)
  })

  // ── Edge case: body ausente ─────────────────────────────────────────────────

  it('should return 400 when query body is missing', async () => {
    // ARRANGE
    const event = { body: null }

    // ACT
    const result = await handler(event)

    // ASSERT
    expect(result.statusCode).toBe(400)
  })

})
```

### Melhorias em relação à Versão 2

- **Comentários de seção** (`// ── Happy path`, `// ── Edge case`) organizam visualmente os casos dentro do `describe`
- **Caso VC-04 adicionado** — query `'xxx yyy zzz fora do domínio'` com retrieval retornando `chunks: []` valida o comportamento de fallback (`'Não encontrei informações sobre este tópico'`, `source_document: null`, `confidence: 0`)
- **Caso de serviço indisponível** — valida que o endpoint retorna 503 quando o retrieval falha, cobrindo a branch de erro de rede
- **Caso de body ausente** — valida retorno 400 para requisição malformada, cobrindo validação de entrada
- **`server.use()` dentro de cada teste individual** — handlers são adicionados por teste e removidos pelo `afterEach(() => server.resetHandlers())`, garantindo isolamento total
- **`beforeAll`/`afterEach`/`afterAll` no nível correto** — no topo do arquivo, antes de todos os `describe`, garantindo que o ciclo de vida cubra toda a suite

### Padrões Aplicados

- **Seção "Estrutura Obrigatória: Arrange/Act/Assert"** — cada caso mantém as três seções; o ACT contém apenas uma chamada
- **Seção "O Que Todo Teste DEVE Ter" › 6. Cleanup no `afterEach` e `afterAll`** — `server.resetHandlers()` garante que o handler de VC-04 (chunks vazios) não contamine o happy path quando a ordem de execução muda
- **Seção "O Que Todo Teste NÃO DEVE Ter" › 4. Dependência de ordem entre testes"** — cada teste configura seu próprio handler via `server.use()` e não depende de estado global compartilhado
- **Seção "Padrões de Mocking com MSW"** — exemplo de `server.use()` dentro do teste para sobrescrever o handler padrão, conforme demonstrado no exemplo "low confidence" do `testing-standards.md`
- **Seção "O Que Todo Teste NÃO DEVE Ter" › 7. Assertions que só verificam status HTTP"** — o happy path valida `answer`, `source_document` e `confidence` além do `statusCode`

---

## Resumo de Aprendizados

| Problema Original | Solução Aplicada | Padrão Referenciado |
|---|---|---|
| Descrição vaga: `'query endpoint works'` | `describe('QueryEndpoint')` + `it('should return SLA info when asked about delivery deadline')` com termos do domínio | Seção "Nomenclatura de Testes" — padrão `should [behavior] when [condition]` |
| Ausência de Arrange/Act/Assert | Três seções explicitamente comentadas; ACT contém apenas uma chamada | Seção "Estrutura Obrigatória: Arrange/Act/Assert" |
| Dado irreal: `"question": "test"` | `'Qual o prazo de entrega de São Paulo para Rio de Janeiro?'` + fixture `slaQuestions.spToRj` | Seção "O Que Todo Teste DEVE Ter" › 3. Dados de teste realistas |
| Assertion fraca: `expect(result).toBeDefined()` | `expect(body.answer).toContain(...)`, `expect(body.source_document).toBe(...)`, `expect(body.confidence).toBeGreaterThan(0.7)` | Seção "O Que Todo Teste NÃO DEVE Ter" › 1. `toBeDefined()` como única assertion |
| Sem mocks — chamadas reais a serviços externos | `setupServer` MSW com `onUnhandledRequest: 'error'` interceptando o retrieval service | Seção "Padrões de Mocking com MSW" e "O Que Todo Teste DEVE Ter" › 5. MSW configurado |
| Sem validação de `source_document` | `expect(body.source_document).toBe('POL-SLA-001')` com valor específico | Seção "O Que Todo Teste DEVE Ter" › 4. Assertions que validam `answer`, `source_document` e `confidence` |
| Sem cobertura de edge cases | Caso VC-04 (query fora do domínio), caso 503 (serviço indisponível), caso 400 (body ausente) | Seção "Estrutura Obrigatória: Arrange/Act/Assert" — exemplo completo com múltiplos casos |
| Sem cleanup entre testes | `afterEach(() => server.resetHandlers())` + `afterAll(() => server.close())` | Seção "O Que Todo Teste DEVE Ter" › 6. Cleanup no `afterEach` e `afterAll` |
| Dados inline repetidos | Importação de `slaQuestions`, `freightChunks` de `/tests/fixtures/novatech.ts` | Seção "O Que Todo Teste DEVE Ter" › 7. Fixtures reutilizáveis importadas de `/tests/fixtures/` |
