# Critérios Objetivos de Review — Testes NovaTech

## Resumo Executivo (Checklist Rápido)

Use esta lista durante o code review. Cada item deve ser verificável em menos de 30 segundos.

1. O nome do `it()` segue o padrão `should [comportamento] when [condição]` com termos do domínio NovaTech?
2. O teste contém os comentários explícitos `// ARRANGE`, `// ACT` e `// ASSERT`?
3. As assertions validam `answer`, `source_document` **e** `confidence` com valores específicos (não apenas `toBeDefined()`)?
4. O `setupServer` do MSW está configurado com `onUnhandledRequest: 'error'`?
5. Os dados de entrada usam perguntas reais de logística (cidades brasileiras, tipos de carga, rotas reais)?
6. O `afterEach` chama `server.resetHandlers()` e o `afterAll` chama `server.close()`?
7. Dados de teste estão importados de `/tests/fixtures/novatech.ts` (não hardcoded inline no teste)?
8. A cobertura de linhas está acima de 80% ao rodar `vitest run --coverage`?

---

## Prioridades

### Critico

Critérios que **bloqueiam o merge** se falham. Um teste que viola qualquer um destes critérios não deve entrar na branch principal, pois compromete a legibilidade, confiabilidade ou o contrato do sistema.

- Critérios 1, 2, 3, 4, 5 e 6 são Críticos.
- Falha nesses critérios indica que o teste pode passar por razões erradas (assertions fracas), fazer chamadas reais a APIs (sem MSW), contaminar outros testes (sem cleanup) ou ser ilegível para qualquer membro da equipe.

### Importante

Critérios que **devem ser corrigidos antes do merge**, mas que em situações excepcionais podem ser tratados como tech debt imediato em um ticket de seguimento — desde que aprovados pelo tech lead.

- Critérios 7 e 8 são Importantes.
- Dados inline em poucos testes isolados são toleráveis na criação inicial, mas devem ser centralizados antes do merge em produção. Coverage abaixo de 80% falha o CI, mas a correção pode ser feita em um commit separado dentro do mesmo PR.

### Nice-to-Have

Sugestões de melhoria que tornam a suite mais robusta mas não bloqueiam o merge.

- Comentários de seção dentro do `describe` para separar happy paths de edge cases (`// ── Happy path`, `// ── Edge case`).
- Cobertura de branches acima de 75% (além das linhas).
- Fixtures tipadas com `as const` para garantir inferência de tipo precisa.
- Testes de edge case para entradas fora do domínio (query sem correspondência, serviço indisponível, body ausente).

---

## Critério 1: Nomenclatura Descritiva (Critico)

**Descricao:** o nome do `it()` deve descrever comportamento específico observável no domínio do negócio, não funcionalidade genérica ou detalhes de implementação.

**Passa se:** o `it()` segue o padrão `should [comportamento] when [condição]`, usando termos do negócio como "SLA", "prazo de entrega", "carga perigosa", "frete fracionado", "devolução".

**Falha se:** o `it()` usa palavras como `works`, `test`, `check`, `ok`, `funciona`, `test1`, ou não descreve a condição que provoca o comportamento.

**Verificacao rapida:** leia o nome do `it()` sem ver o código — você consegue dizer exatamente o que está sendo testado e sob qual condição?

**Exemplos:**

```typescript
// Aprovado
it('should return SLA for SP-RJ when asked about fracionada delivery')
it('should return 400 when query body is missing')
it('should return fallback message when query is outside the knowledge domain')

// Reprovado
it('should work')
it('query test')
it('check response')
it('ok')
it('test1')
```

---

## Critério 2: Estrutura Arrange/Act/Assert (Critico)

**Descricao:** todo teste deve ser dividido em três seções explicitamente delimitadas por comentários. Essa estrutura torna o teste legível, auditável e fácil de depurar quando falha.

**Passa se:** os comentários `// ARRANGE`, `// ACT` e `// ASSERT` estão presentes no teste, e a seção `// ACT` contém apenas **uma única chamada** — a ação sendo testada.

**Falha se:** os comentários estão ausentes, as seções estão mescladas sem delimitação, ou a seção ACT contém múltiplas chamadas (preparação e ação misturadas).

**Verificacao rapida:** procure os três comentários no corpo do `it()`. Se um deles estiver faltando, reprovar.

**Exemplos:**

```typescript
// Aprovado
it('should return SLA info when asked about delivery deadline', async () => {
  // ARRANGE
  server.use(http.post('http://retrieval-service/search', () => HttpResponse.json({ chunks: [...] })))
  const event = { body: JSON.stringify({ question: 'Qual o prazo SP para RJ?' }) }

  // ACT
  const result = await handler(event)

  // ASSERT
  expect(result.statusCode).toBe(200)
  expect(result.body.answer).toContain('dias úteis')
})

// Reprovado — sem comentários de seção
it('should return answer', async () => {
  const event = { body: JSON.stringify({ question: 'prazo SP' }) }
  const result = await handler(event)
  expect(result).toBeDefined()
})
```

---

## Critério 3: Assertions Específicas — Sem Assertions Vagas (Critico)

**Descricao:** as assertions devem validar valores concretos do contrato do endpoint (`answer`, `source_document`, `confidence`). Assertions que passam para qualquer valor não-nulo mascaram regressões.

**Passa se:** o teste verifica `answer` com `toContain()` ou `toBe()` para valor esperado, `source_document` com `toBe()` para o ID do documento correto, e `confidence` com `toBeGreaterThanOrEqual()` e `toBeLessThanOrEqual()` para a faixa esperada.

**Falha se:** `toBeDefined()` ou `toBeTruthy()` é a **única** assertion para qualquer campo do contrato, ou se algum dos três campos (`answer`, `source_document`, `confidence`) não é verificado.

**Verificacao rapida:** procure por `toBeDefined()` e `toBeTruthy()` no bloco ASSERT. Se aparecerem como única validação de um campo, reprovar.

**Exemplos:**

```typescript
// Aprovado
expect(result.answer).toContain('7 a 10 dias úteis')
expect(result.source_document).toBe('sla-regioes-norte-2024')
expect(result.confidence).toBeGreaterThanOrEqual(0.7)
expect(result.confidence).toBeLessThanOrEqual(1.0)

// Reprovado — assertions vagas
expect(result).toBeDefined()
expect(result.answer).toBeTruthy()
// source_document e confidence não verificados
```

---

## Critério 4: Mocking Correto com MSW (Critico)

**Descricao:** todo serviço externo acessado via HTTP (retrieval, OpenAI, notificações) deve ser interceptado pelo MSW. Nenhuma chamada HTTP real deve ocorrer durante os testes.

**Passa se:** `setupServer` do `msw/node` está presente no arquivo, `onUnhandledRequest: 'error'` está configurado no `server.listen()`, e todos os endpoints chamados pelo código sob teste têm um handler MSW correspondente.

**Falha se:** `setupServer` está ausente, `onUnhandledRequest` está omitido ou configurado como `'warn'`/`'bypass'`, ou existe alguma chamada `fetch`/`axios` direta no teste sem handler MSW.

**Verificacao rapida:** procure `setupServer` no arquivo. Se ausente, reprovar imediatamente. Se presente, verifique `onUnhandledRequest: 'error'` no `server.listen()`.

**Exemplos:**

```typescript
// Aprovado
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Reprovado — chamada real sem MSW
it('should generate answer', async () => {
  const result = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    body: JSON.stringify({ model: 'gpt-4o', messages: [...] }),
  })
})
```

---

## Critério 5: Dados de Teste Realistas do Domínio (Critico)

**Descricao:** as perguntas, rotas, documentos e cargas usados nos testes devem pertencer ao domínio de logística NovaTech. Dados genéricos mascaram erros de negócio e reduzem a confiança nos testes.

**Passa se:** as perguntas usam rotas brasileiras reais (`São Paulo para Manaus`, `RJ para Fortaleza`), tipos de carga reais (`bateria de lítio`, `produtos inflamáveis`, `carga fracionada`), e IDs de documento no padrão NovaTech (`sla-regioes-norte-2024`, `manual-cargas-perigosas-iata-2024`).

**Falha se:** os dados de entrada contêm strings genéricas como `"test"`, `"foo"`, `"hello"`, `"query"`, `"doc1"`, `"content here"`, ou qualquer placeholder sem significado de domínio.

**Verificacao rapida:** leia o campo `question`/`query` do ARRANGE. Faz sentido como uma pergunta real que um operador de logística faria ao sistema?

**Exemplos:**

```typescript
// Aprovado
const query = { query: 'Qual o prazo de entrega para o Acre?' }
const chunk = { document_id: 'sla-regioes-norte-2024', content: 'Prazo para AC: 12 dias úteis.' }

// Reprovado
const query = { query: 'test query' }
const chunk = { document_id: 'doc1', content: 'foo bar' }
```

---

## Critério 6: Isolamento entre Testes (Critico)

**Descricao:** cada teste deve ser completamente autossuficiente. O resultado de um teste não pode depender de outro ter sido executado antes, e os mocks de um teste não podem contaminar o próximo.

**Passa se:** `afterEach(() => server.resetHandlers())` está presente, `afterAll(() => server.close())` está presente, e não há variáveis de estado globais mutáveis compartilhadas entre testes (ex: `let lastResult` atribuído em um teste e lido em outro).

**Falha se:** `server.resetHandlers()` está ausente no `afterEach`, existe estado global compartilhado entre testes, ou um teste depende da execução de outro para funcionar corretamente.

**Verificacao rapida:** procure por `afterEach` no arquivo. Se ausente ou sem `resetHandlers()`, reprovar. Procure por variáveis `let` declaradas fora dos blocos `it()` — se forem escritas em um teste e lidas em outro, reprovar.

**Exemplos:**

```typescript
// Aprovado
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Reprovado — estado global compartilhado
let lastResult: QueryResponse

it('first test', async () => {
  lastResult = await queryEndpoint({ query: 'prazo SP' }) // escreve estado global
})

it('second test', async () => {
  expect(lastResult.confidence).toBeGreaterThan(0.5) // falha se executado isolado
})
```

---

## Critério 7: Fixtures Reutilizáveis (Importante)

**Descricao:** dados de teste devem ser centralizados em `/tests/fixtures/novatech.ts` e importados nos testes. Payloads duplicados inline em múltiplos arquivos dificultam manutenção e criam inconsistências.

**Passa se:** perguntas, chunks de documentos e respostas esperadas são importados de `@/tests/fixtures/novatech` ao invés de definidos inline no corpo do teste.

**Falha se:** o mesmo payload de chunk ou a mesma pergunta aparece hardcoded em mais de um arquivo de teste, ou objetos de dados complexos (com múltiplos campos) estão inline no ARRANGE sem importação.

**Verificacao rapida:** procure por `import` de `fixtures/novatech` no topo do arquivo. Se ausente e o ARRANGE contém objetos de chunk inline, verificar se há duplicação em outros arquivos.

**Exemplos:**

```typescript
// Aprovado
import { slaQuestions, freightChunks } from '@/tests/fixtures/novatech'

server.use(
  http.post('http://retrieval-service/search', () =>
    HttpResponse.json({ chunks: [freightChunks.spToManaus] })
  )
)
const result = await queryEndpoint(slaQuestions.spToManaus)

// Reprovado — dados inline sem importação
const query = { query: 'Qual o prazo de entrega de São Paulo para Manaus?' }
server.use(
  http.post('http://retrieval-service/search', () =>
    HttpResponse.json({
      chunks: [{
        document_id: 'tabela-frete-sudeste-norte-q1-2024',
        content: 'Frete padrão SP→AM: 7 a 10 dias úteis.',
        score: 0.92,
      }],
    })
  )
)
```

---

## Critério 8: Coverage Mínimo (Importante)

**Descricao:** o projeto exige cobertura mínima de 80% de linhas, funções e statements em todo código de produção. Esse limite é verificado automaticamente no CI.

**Passa se:** `vitest run --coverage` retorna valores acima de 80% para lines, functions e statements, e acima de 75% para branches.

**Falha se:** qualquer uma das métricas fica abaixo do threshold configurado em `vite.config.ts`.

**Verificacao rapida (como rodar localmente):**

```bash
# Verificar coverage com os mesmos thresholds do CI
vitest run --coverage --coverage.thresholds.lines=80

# Gerar relatório HTML para inspecionar linhas não cobertas
vitest run --coverage --coverage.reporter=html
# Abrir /coverage/index.html no navegador
```

**Thresholds configurados:**

```typescript
// vite.config.ts
thresholds: {
  lines: 80,
  functions: 80,
  branches: 75,
  statements: 80,
}
```

**Nota:** linhas marcadas com `/* c8 ignore next */` são excluídas da métrica. Use essa diretiva apenas para código defensivo impossível de atingir em testes (ex: fallback de `process.exit`). Nunca use para esconder lógica de negócio sem cobertura.

---

## Erros Comuns de IA (referencia rapida)

Tabela com padrões incorretos gerados por LLMs (Copilot, Claude) sem guidance adequado sobre os standards NovaTech.

| Padrão incorreto gerado por LLM | Critério que viola | Como corrigir |
|---|---|---|
| `it('should work correctly', async () => { ... })` — nome genérico sem condição | Critério 1: Nomenclatura Descritiva | Substituir por `it('should return SLA when asked about SP-RJ fracionada delivery')` seguindo o padrão `should [comportamento] when [condição]` com termos do domínio |
| `expect(result).toBeDefined()` ou `expect(result.answer).toBeTruthy()` como única assertion | Critério 3: Assertions Específicas | Substituir por assertions de valor: `expect(result.answer).toContain('dias úteis')`, `expect(result.source_document).toBe('sla-...')`, `expect(result.confidence).toBeGreaterThanOrEqual(0.7)` |
| Teste sem `setupServer` fazendo chamadas HTTP diretamente ao retrieval ou OpenAI | Critério 4: Mocking Correto com MSW | Adicionar `setupServer` com `onUnhandledRequest: 'error'` e criar handlers MSW para todos os endpoints externos usados |
| `const query = { query: 'test' }` ou `document_id: 'doc1'` como dados de entrada | Critério 5: Dados de Teste Realistas | Substituir por dados do domínio: `{ query: 'Qual o prazo de entrega para Manaus?' }` e `document_id: 'sla-regioes-norte-2024'` |
| `let sharedResult` declarado fora dos testes e atribuído em um `it()` para ser lido em outro | Critério 6: Isolamento entre Testes | Mover a chamada para dentro de cada teste que precisar do resultado; garantir que cada `it()` seja autossuficiente |
| `afterEach` ausente — handlers MSW de um teste contaminam o próximo | Critério 6: Isolamento entre Testes | Adicionar `afterEach(() => server.resetHandlers())` imediatamente após o `beforeAll` no topo da suite |
| Payload de chunk definido inline em múltiplos arquivos de teste sem importação de fixtures | Critério 7: Fixtures Reutilizáveis | Centralizar o payload em `/tests/fixtures/novatech.ts` e importar via `import { freightChunks } from '@/tests/fixtures/novatech'` |
