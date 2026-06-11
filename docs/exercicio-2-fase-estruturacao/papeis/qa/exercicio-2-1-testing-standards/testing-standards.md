# Testing Standards — NovaTech RAG Query Endpoint

## Nomenclatura de Testes

Todo teste deve comunicar claramente **o que** está sendo testado e **em qual condição**. Use o padrão `describe/it` com frases no formato `should [behavior] when [condition]`.

### Exemplos

**✓ Correto**

```typescript
describe('QueryEndpoint', () => {
  it('should return SLA info when asked about delivery deadline', async () => { ... })
  it('should return confidence above 0.7 when document is found', async () => { ... })
  it('should return 400 when query body is missing', async () => { ... })
  it('should include source_document when retrieval finds a match', async () => { ... })
})
```

**✗ Incorreto**

```typescript
test('query endpoint works', () => { ... })
test('test1', () => { ... })
describe('tests', () => {
  it('ok', () => { ... })
  it('check response', () => { ... })
})
```

**Regras de nomenclatura:**

- O bloco `describe` nomeia o componente ou unidade sendo testada: `QueryEndpoint`, `RetrievalService`, `ConfidenceCalculator`
- O bloco `it` descreve um comportamento observável, não uma implementação interna
- Nunca use nomes como `test1`, `ok`, `check`, `works`, `funciona`
- Use o domínio do negócio nas frases: "SLA", "prazo de entrega", "carga perigosa", "devolução"

---

## Estrutura Obrigatória: Arrange/Act/Assert

Todo teste deve ser dividido em três seções explicitamente comentadas. Essa estrutura torna o teste legível, auditável e fácil de depurar quando falha.

- **ARRANGE**: preparar dados, mocks e estado inicial
- **ACT**: executar a ação sendo testada (uma única chamada de função ou requisição)
- **ASSERT**: verificar os resultados esperados

### Exemplo completo

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { queryEndpoint } from '@/handlers/query'

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('QueryEndpoint', () => {
  it('should return delivery SLA when asked about São Paulo to Manaus route', async () => {
    // ARRANGE
    server.use(
      http.post('http://retrieval-service/search', () => {
        return HttpResponse.json({
          chunks: [
            {
              document_id: 'sla-regioes-norte-2024',
              content: 'O prazo de entrega de São Paulo para Manaus é de 7 a 10 dias úteis para cargas padrão.',
              score: 0.92,
            },
          ],
        })
      })
    )

    const request = {
      query: 'Qual o prazo de entrega de São Paulo para Manaus?',
    }

    // ACT
    const response = await queryEndpoint(request)

    // ASSERT
    expect(response.answer).toContain('7 a 10 dias úteis')
    expect(response.source_document).toBe('sla-regioes-norte-2024')
    expect(response.confidence).toBeGreaterThanOrEqual(0.7)
  })
})
```

---

## O Que Todo Teste DEVE Ter

### 1. Descrição descritiva no `describe`/`it`

Use nomes que descrevem comportamento observável no domínio do negócio, não detalhes de implementação.

```typescript
// Correto
describe('QueryEndpoint', () => {
  it('should return dangerous cargo restrictions when asked about flammable goods', async () => { ... })
})

// Correto
describe('RetrievalService', () => {
  it('should rank documents by score when multiple chunks match the query', async () => { ... })
})
```

### 2. Seções ARRANGE/ACT/ASSERT explícitas

Cada seção deve ser delimitada por comentário. A seção ACT deve conter apenas uma chamada — a ação sendo testada.

```typescript
it('should return return policy when asked about product returns', async () => {
  // ARRANGE
  const query = { query: 'Como faço para devolver uma encomenda danificada?' }
  server.use(
    http.post('http://retrieval-service/search', () =>
      HttpResponse.json({ chunks: [returnPolicyChunk] })
    )
  )

  // ACT
  const result = await queryEndpoint(query)

  // ASSERT
  expect(result.answer).toContain('prazo de 7 dias')
  expect(result.source_document).toBe('politica-devolucoes-v3')
})
```

### 3. Dados de teste realistas (domínio logística)

Use termos reais do domínio NovaTech. Dados genéricos dificultam a leitura e mascaram erros de negócio.

```typescript
// Correto: dados do domínio
const query = { query: 'Qual o prazo máximo para contestar uma entrega extraviada?' }
const expectedSource = 'manual-atendimento-ocorrencias-2024'

// Correto: nomes de documentos reais
const chunk = {
  document_id: 'tabela-frete-sudeste-norte-q1-2024',
  content: 'Frete expresso SP→AM: R$ 45,00/kg, prazo 3 dias úteis.',
}
```

### 4. Assertions que validam `answer`, `source_document` e `confidence`

Nunca valide apenas um campo. O contrato do endpoint é `{ answer, source_document, confidence }` — todos devem ser verificados.

```typescript
// ASSERT
expect(result.answer).toContain('7 a 10 dias úteis')
expect(result.source_document).toBe('sla-regioes-norte-2024')
expect(result.confidence).toBeGreaterThanOrEqual(0.7)
expect(result.confidence).toBeLessThanOrEqual(1.0)
```

### 5. MSW configurado — sem chamadas a APIs reais

Todo serviço externo (retrieval, OpenAI, banco de dados) deve ser interceptado pelo MSW. Nunca permita tráfego real nos testes.

```typescript
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const server = setupServer(
  http.post('http://retrieval-service/search', () =>
    HttpResponse.json({ chunks: [slaChunk] })
  ),
  http.post('https://api.openai.com/v1/chat/completions', () =>
    HttpResponse.json(openAiMockResponse)
  )
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
```

A opção `onUnhandledRequest: 'error'` garante que qualquer chamada não mapeada cause falha no teste, evitando chamadas acidentais a APIs reais.

### 6. Cleanup no `afterEach` e `afterAll`

Sem cleanup, mocks de um teste contaminam o próximo.

```typescript
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  server.resetHandlers() // remove handlers adicionados dentro de testes individuais
})

afterAll(() => {
  server.close() // encerra o servidor MSW após a suite
})
```

### 7. Fixtures reutilizáveis importadas de `/tests/fixtures/`

Dados de teste devem ser centralizados. Nunca repita payloads de resposta inline em múltiplos arquivos.

```typescript
import {
  slaQuestions,
  freightChunks,
  dangerousCargoResponses,
} from '@/tests/fixtures/novatech'

it('should return hazmat regulations when asked about lithium batteries', async () => {
  // ARRANGE
  server.use(
    http.post('http://retrieval-service/search', () =>
      HttpResponse.json({ chunks: dangerousCargoResponses.lithiumBatteryChunks })
    )
  )

  // ACT
  const result = await queryEndpoint(slaQuestions.lithiumBattery)

  // ASSERT
  expect(result.answer).toContain('IATA')
  expect(result.source_document).toBe(dangerousCargoResponses.lithiumBatteryChunks[0].document_id)
})
```

---

## O Que Todo Teste NÃO DEVE Ter

### 1. `toBeDefined()` ou `toBeTruthy()` como única assertion

Essas assertions passam para qualquer valor não-nulo, incluindo respostas de erro disfarçadas.

```typescript
// Anti-padrão: não verifica o conteúdo real
expect(result).toBeDefined()
expect(result.answer).toBeTruthy()

// Correto: verifica o valor real
expect(result.answer).toContain('7 a 10 dias úteis')
expect(result.confidence).toBeGreaterThan(0.6)
```

### 2. Dados genéricos: "test", "foo", "hello world"

Dados sem significado de domínio passam por validações que deveriam falhar para entradas inválidas.

```typescript
// Anti-padrão
const query = { query: 'test query' }
const mockChunk = { document_id: 'doc1', content: 'foo bar' }

// Correto
const query = { query: 'Qual o prazo de entrega para o Acre?' }
const mockChunk = { document_id: 'sla-regioes-norte-2024', content: 'Prazo para AC: 12 dias úteis.' }
```

### 3. Chamadas diretas a APIs externas

Testes que fazem chamadas reais são lentos, instáveis e podem gerar custos.

```typescript
// Anti-padrão: chama a API real do OpenAI
it('should generate answer', async () => {
  const result = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({ model: 'gpt-4o', messages: [...] }),
  })
  // ...
})

// Correto: use MSW para interceptar
server.use(
  http.post('https://api.openai.com/v1/chat/completions', () =>
    HttpResponse.json(openAiMockResponse)
  )
)
```

### 4. Dependência de ordem entre testes (estado global compartilhado)

Cada teste deve ser independente. Testes que dependem de ordem falham de forma imprevisível.

```typescript
// Anti-padrão: estado compartilhado entre testes
let lastResult: QueryResponse

it('first test sets global state', async () => {
  lastResult = await queryEndpoint({ query: 'prazo SP' })
})

it('second test depends on first', async () => {
  expect(lastResult.confidence).toBeGreaterThan(0.5) // falha se executado isolado
})

// Correto: cada teste é autossuficiente
it('should return confidence above 0.5 for SP query', async () => {
  const result = await queryEndpoint({ query: 'Qual o prazo de entrega em SP?' })
  expect(result.confidence).toBeGreaterThan(0.5)
})
```

### 5. `sleep()` / `setTimeout()` / `await new Promise(r => setTimeout(r, n))`

Esperas arbitrárias tornam a suite lenta e mascaram race conditions. Use mecanismos de espera adequados do Vitest.

```typescript
// Anti-padrão
it('should process async query', async () => {
  queryEndpoint({ query: 'prazo Manaus' })
  await new Promise(r => setTimeout(r, 2000)) // aguarda "de boa"
  expect(cache.has('prazo Manaus')).toBe(true)
})

// Correto: aguarde a promise diretamente
it('should cache result after processing', async () => {
  await queryEndpoint({ query: 'prazo Manaus' })
  expect(cache.has('prazo Manaus')).toBe(true)
})
```

### 6. Credentials de produção em variáveis de ambiente

Nunca use chaves reais em testes, mesmo que o arquivo não seja commitado.

```typescript
// Anti-padrão
process.env.OPENAI_API_KEY = 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx' // chave real
process.env.DATABASE_URL = 'postgresql://prod-user:senha@prod-host:5432/novatech'

// Correto: use valores de placeholder sem significado
process.env.OPENAI_API_KEY = 'test-key-placeholder'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/novatech_test'
```

### 7. Assertions que só verificam status HTTP sem validar o conteúdo

Status 200 não garante que a resposta está correta.

```typescript
// Anti-padrão: valida apenas o status
it('should return 200', async () => {
  const response = await request(app).post('/query').send({ query: 'prazo SP' })
  expect(response.status).toBe(200)
})

// Correto: valida o conteúdo da resposta
it('should return SLA answer with source document when query is valid', async () => {
  const response = await request(app).post('/query').send({ query: 'Qual o prazo de SP para RJ?' })
  expect(response.status).toBe(200)
  expect(response.body.answer).toContain('dias úteis')
  expect(response.body.source_document).toMatch(/^sla-/)
  expect(response.body.confidence).toBeGreaterThan(0)
})
```

---

## Padrões de Mocking com MSW

### Quando usar MSW vs `vi.mock()`

| Situação | Ferramenta |
|---|---|
| Interceptar requisições HTTP a serviços externos (retrieval, OpenAI, notificações) | **MSW** |
| Mockar módulos internos TypeScript/Node (logger, config, utils) | **`vi.mock()`** |
| Simular respostas de erro de rede (timeout, 503) | **MSW** |
| Substituir dependências injetadas em classes | **`vi.mock()`** |

**Use MSW** quando o código faz `fetch`, `axios` ou qualquer cliente HTTP para fora do processo.

**Use `vi.mock()`** quando o código importa um módulo e você precisa substituir seu comportamento sem envolver rede.

### Exemplo completo com MSW

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { queryEndpoint } from '@/handlers/query'
import { freightChunks } from '@/tests/fixtures/novatech'

// Configura o servidor MSW com handlers padrão
const server = setupServer(
  http.post('http://retrieval-service/search', () => {
    return HttpResponse.json({
      chunks: [
        {
          document_id: 'tabela-frete-sudeste-norte-q1-2024',
          content: 'Frete padrão de São Paulo para Manaus: prazo 7 a 10 dias úteis.',
          score: 0.88,
        },
      ],
    })
  })
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('QueryEndpoint — freight queries', () => {
  it('should return freight info when asked about SP to Manaus route', async () => {
    // ARRANGE
    const query = { query: 'Qual o prazo de entrega de São Paulo para Manaus?' }

    // ACT
    const result = await queryEndpoint(query)

    // ASSERT
    expect(result.answer).toContain('7 a 10 dias úteis')
    expect(result.source_document).toBe('tabela-frete-sudeste-norte-q1-2024')
    expect(result.confidence).toBeGreaterThanOrEqual(0.7)
  })

  it('should return low confidence when retrieval score is below threshold', async () => {
    // ARRANGE — sobrescreve o handler padrão para este teste
    server.use(
      http.post('http://retrieval-service/search', () => {
        return HttpResponse.json({
          chunks: [
            {
              document_id: 'tabela-frete-sudeste-norte-q1-2024',
              content: 'Conteúdo parcialmente relacionado.',
              score: 0.31,
            },
          ],
        })
      })
    )

    const query = { query: 'Existe desconto para envio em paletes?' }

    // ACT
    const result = await queryEndpoint(query)

    // ASSERT
    expect(result.confidence).toBeLessThan(0.5)
  })

  it('should return 503 error when retrieval service is unavailable', async () => {
    // ARRANGE
    server.use(
      http.post('http://retrieval-service/search', () => {
        return HttpResponse.json({ error: 'Service Unavailable' }, { status: 503 })
      })
    )

    const query = { query: 'Qual o prazo para o Amazonas?' }

    // ACT & ASSERT
    await expect(queryEndpoint(query)).rejects.toThrow('Retrieval service unavailable')
  })
})
```

---

## Padrões de Fixtures

### Localização

Todas as fixtures do projeto NovaTech ficam em:

```
/tests/fixtures/novatech.ts
```

Fixtures de outros domínios (autenticação, erros de rede) ficam em arquivos separados no mesmo diretório.

### Estrutura: exports nomeados por categoria

```typescript
// /tests/fixtures/novatech.ts

// ─── Perguntas de SLA ────────────────────────────────────────────────────────

export const slaQuestions = {
  spToManaus: {
    query: 'Qual o prazo de entrega de São Paulo para Manaus?',
  },
  rjToFortaleza: {
    query: 'Quanto tempo demora uma entrega do Rio de Janeiro para Fortaleza?',
  },
  lithiumBattery: {
    query: 'Posso enviar bateria de lítio para o Amazonas? Qual o prazo?',
  },
} as const

// ─── Chunks de documentos de frete ──────────────────────────────────────────

export const freightChunks = {
  spToManaus: {
    document_id: 'tabela-frete-sudeste-norte-q1-2024',
    content: 'Frete padrão SP→AM: 7 a 10 dias úteis. Frete expresso SP→AM: 3 dias úteis, adicional R$ 45,00/kg.',
    score: 0.92,
  },
  rjToFortaleza: {
    document_id: 'tabela-frete-sudeste-nordeste-q1-2024',
    content: 'Entrega RJ→CE: prazo padrão 5 a 7 dias úteis.',
    score: 0.85,
  },
} as const

// ─── Respostas de carga perigosa ─────────────────────────────────────────────

export const dangerousCargoResponses = {
  lithiumBatteryChunks: [
    {
      document_id: 'manual-cargas-perigosas-iata-2024',
      content: 'Baterias de lítio devem ser declaradas conforme IATA DGR seção II. Prazo adicional de 2 dias úteis para processamento aduaneiro.',
      score: 0.94,
    },
  ],
  flammableGoodsChunks: [
    {
      document_id: 'manual-cargas-perigosas-antt-2024',
      content: 'Produtos inflamáveis classe 3 requerem veículo homologado ANTT. Transporte restrito a rotas federais.',
      score: 0.91,
    },
  ],
}

// ─── Respostas esperadas completas (para testes de integração) ───────────────

export const expectedResponses = {
  spToManaus: {
    answer: 'O prazo de entrega de São Paulo para Manaus é de 7 a 10 dias úteis para frete padrão.',
    source_document: 'tabela-frete-sudeste-norte-q1-2024',
    confidence: 0.92,
  },
}
```

### Exemplo de uso em teste

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { queryEndpoint } from '@/handlers/query'
import {
  slaQuestions,
  freightChunks,
  dangerousCargoResponses,
  expectedResponses,
} from '@/tests/fixtures/novatech'

const server = setupServer()

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('QueryEndpoint — SLA queries', () => {
  it('should return delivery time when asked about Manaus route', async () => {
    // ARRANGE
    server.use(
      http.post('http://retrieval-service/search', () =>
        HttpResponse.json({ chunks: [freightChunks.spToManaus] })
      )
    )

    // ACT
    const result = await queryEndpoint(slaQuestions.spToManaus)

    // ASSERT
    expect(result.answer).toContain('7 a 10 dias úteis')
    expect(result.source_document).toBe(expectedResponses.spToManaus.source_document)
    expect(result.confidence).toBeGreaterThanOrEqual(0.7)
  })
})
```

---

## Coverage Mínimo

### Meta: 80% de linhas

O projeto exige cobertura mínima de **80% de linhas** em todo código de produção. Esse limite é verificado automaticamente no CI e falha o build se não for atingido.

### Como gerar o relatório localmente

```bash
# Gera relatório de cobertura e exibe no terminal
vitest run --coverage

# Gera relatório HTML navegável em /coverage/index.html
vitest run --coverage --coverage.reporter=html

# Verifica com threshold explícito (mesmo que o CI)
vitest run --coverage --coverage.thresholds.lines=80
```

### O que está excluído da cobertura

Configure o `vite.config.ts` para excluir arquivos que não devem contar na métrica:

```typescript
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      exclude: [
        '**/*.d.ts',           // arquivos de tipos — sem lógica executável
        '**/__mocks__/**',     // mocks de teste — não são código de produção
        '**/index.ts',         // re-exports — não contêm lógica
        '**/types/**',         // diretórios só de tipos
        'vitest.config.ts',
        'vite.config.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
})
```

### Como o CI verifica

O pipeline executa:

```bash
vitest run --coverage --coverage.thresholds.lines=80
```

Se a cobertura de linhas cair abaixo de 80%, o processo retorna exit code não-zero e o build falha. O desenvolvedor deve adicionar testes antes de fazer merge.

### Como interpretar o relatório

O relatório HTML em `/coverage/index.html` mostra cada arquivo com linhas coloridas:

| Cor | Significado |
|---|---|
| Verde | Linha executada por ao menos um teste |
| Vermelho | **"Uncovered"** — linha existe e é executável, mas nenhum teste a atingiu |
| Cinza/amarelo | **"Not covered"** — linha está excluída da análise (ex: `/* c8 ignore */`) |

**"Uncovered" vs "Not covered":**

- **Uncovered**: a linha existe, é código de produção real, e precisa de testes. É isso que reduz o percentual de cobertura.
- **Not covered**: a linha foi explicitamente excluída da métrica via comentário `/* c8 ignore next */` ou pelo campo `exclude` da configuração. Não afeta o percentual.

Use `/* c8 ignore next */` com moderação — apenas para código defensivo impossível de atingir em testes (ex: fallback de `process.exit`). Nunca use para esconder lógica de negócio sem testes.
