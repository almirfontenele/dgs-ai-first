# Test Review Checklist — create-integration-test
## NovaTech RAG Query Endpoint

---

## Como Usar Esta Checklist

3 passos para completar uma revisão em menos de 2 minutos:

1. **Execute os checks de automação** (seção "Guia de Automação") antes de abrir o arquivo de teste — eles eliminam os anti-padrões mais comuns automaticamente.
2. **Percorra os itens Críticos (C1–C8)** linha a linha. Se qualquer item falhar, reprove o PR imediatamente e deixe o comentário correspondente da seção "Feedback Sugerido".
3. **Percorra os itens Importantes (I1–I4)** e os Nice-to-Have (N1–N3). Para cada falha, deixe um comentário construtivo — esses itens não bloqueiam o merge, mas devem ser endereçados antes do próximo ciclo.

---

## Crítico (Falha na revisão se qualquer item não passar)

- [ ] **C1**: `describe()` tem nome que identifica o componente sendo testado (não "query", "test", "spec")
- [ ] **C2**: `it()` segue o padrão "should [comportamento] when [condição]"
- [ ] **C3**: Seções `// ARRANGE`, `// ACT`, `// ASSERT` presentes como comentários explícitos
- [ ] **C4**: `setupServer` do MSW configurado — nenhuma chamada HTTP real (fetch, axios, http) sem mock
- [ ] **C5**: Nenhum assertion vago como único check: `toBeDefined()`, `toBeTruthy()`, `expect(result)` sem propriedade
- [ ] **C6**: Dados de teste são realistas: perguntas reais de logística NovaTech, não strings genéricas como "test", "foo", "hello world"
- [ ] **C7**: `sources` é validado em pelo menos um assertion (não só `answer`)
- [ ] **C8**: `afterEach(() => server.resetHandlers())` presente quando múltiplos testes no describe

---

## Importante (Recomendado — deixar comentário no review)

- [ ] **I1**: Dados derivados dos anexos A/B ou de um helper de fixtures do projeto em vez de dados inline hardcoded
- [ ] **I2**: Sem `sleep()`, `setTimeout()` ou `await new Promise(r => setTimeout(r, n))`
- [ ] **I3**: MSW handler retorna estrutura completa: `{ answer, sources, confidence }`
- [ ] **I4**: `confidence` validado com `toBeGreaterThan(0.7)` no happy path

---

## Nice-to-Have (Sugestões opcionais)

- [ ] **N1**: Teste inclui sad path (query sem match → mensagem padrão)
- [ ] **N2**: Fixture tem comentário explicando a origem do dado (ex: `// de POL-SLA-001 seção 3.2`)
- [ ] **N3**: Coverage reportada acima de 80% para o módulo testado

---

## Guia de Automação (CI)

Comandos para detectar automaticamente anti-padrões antes do review humano:

```bash
# C4: detectar chamadas HTTP sem mock
grep -n "fetch(\|axios\.\|http\.get\|http\.post" "$TEST_FILE"

# C5: detectar assertions vagas
grep -n "\.toBeDefined()\|\.toBeTruthy()\|expect(result)" "$TEST_FILE"

# I2: detectar sleep/timeout
grep -n "setTimeout\|new Promise.*setTimeout\|sleep(" "$TEST_FILE"
```

### Integrando no pipeline CI

**Opção 1 — Pre-commit hook (`.git/hooks/pre-commit` ou via Husky):**

```bash
#!/bin/sh
# .husky/pre-commit

TEST_FILES=$(git diff --cached --name-only | grep -E "\.test\.(ts|tsx)$")

for TEST_FILE in $TEST_FILES; do
  echo "Verificando anti-padrões em $TEST_FILE..."

  # C4: chamadas HTTP sem mock
  if grep -qE "fetch\(|axios\.|http\.get|http\.post" "$TEST_FILE"; then
    echo "ERRO [C4]: Chamada HTTP sem MSW detectada em $TEST_FILE"
    exit 1
  fi

  # C5: assertions vagas
  if grep -qE "\.toBeDefined\(\)|\.toBeTruthy\(\)" "$TEST_FILE"; then
    echo "AVISO [C5]: Assertion vaga detectada em $TEST_FILE — revise antes do merge"
  fi

  # I2: sleep/timeout
  if grep -qE "setTimeout|new Promise.*setTimeout|sleep\(" "$TEST_FILE"; then
    echo "AVISO [I2]: sleep/setTimeout detectado em $TEST_FILE — use await diretamente"
  fi
done
```

**Opção 2 — Step de lint no CI (GitHub Actions / Azure DevOps):**

```yaml
# .github/workflows/test-lint.yml
- name: Lint de anti-padrões em testes
  run: |
    for TEST_FILE in $(find tests/ -name "*.test.ts"); do
      # C4
      if grep -qE "fetch\(|axios\.|http\.get|http\.post" "$TEST_FILE"; then
        echo "::error file=$TEST_FILE::C4 — Chamada HTTP sem MSW"
        exit 1
      fi
      # C5
      grep -nE "\.toBeDefined\(\)|\.toBeTruthy\(\)" "$TEST_FILE" \
        && echo "::warning file=$TEST_FILE::C5 — Assertion vaga detectada"
      # I2
      grep -nE "setTimeout|sleep\(" "$TEST_FILE" \
        && echo "::warning file=$TEST_FILE::I2 — sleep/setTimeout detectado"
    done
```

---

## Feedback Sugerido

Para cada item C1–C8 e I1–I4: comentário construtivo + exemplo de código correto.

---

**Se falha C1:**
O nome do `describe` não identifica o componente testado. Nomes genéricos como `"query"`, `"test"` ou `"spec"` impossibilitam filtrar a suite por componente e dificultam a leitura do relatório.

```typescript
// Errado
describe('query', () => { ... })

// Correto
describe('QueryEndpoint — SLA fractioned cargo', () => { ... })
```

---

**Se falha C2:**
O nome do `it()` não segue o padrão "should [comportamento] when [condição]". Esse padrão documenta o comportamento esperado e a condição de ativação, tornando o relatório de falha autoexplicativo.

```typescript
// Errado
it('test endpoint', async () => { ... })
it('returns answer', async () => { ... })

// Correto
it('should return SLA deadline when asked about SP to Fortaleza fractioned cargo', async () => { ... })
it('should return 400 when query body is missing', async () => { ... })
```

---

**Se falha C3:**
As seções `// ARRANGE`, `// ACT`, `// ASSERT` estão ausentes ou incompletas. Sem esses comentários, a separação entre preparação, ação e verificação fica implícita e dificulta a leitura e manutenção.

```typescript
// Errado
it('should return deadline', async () => {
  server.use(http.post('...', () => HttpResponse.json({ chunks: [...] })))
  const result = await queryHandler(query)
  expect(result.answer).toContain('dias úteis')
})

// Correto
it('should return deadline when fractioned cargo chunk matches', async () => {
  // ARRANGE
  server.use(
    http.post('http://retrieval-service/search', () =>
      HttpResponse.json({ chunks: [freightChunks.spToFortaleza] })
    )
  )
  const query = slaQuestions.spToFortaleza

  // ACT
  const result = await queryHandler(query)

  // ASSERT
  expect(result.answer).toContain('5 a 7 dias úteis')
  expect(result.sources[0].document).toBe('POL-SLA-001')
})
```

---

**Se falha C4:**
Existe uma chamada HTTP real (`fetch`, `axios`, `http.get`, `http.post`) sem interceptação MSW. Testes com chamadas reais são lentos, instáveis em CI e geram custos de API.

```typescript
// Errado
const res = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  body: JSON.stringify({ model: 'gpt-4o', messages: [...] }),
})

// Correto
server.use(
  http.post('https://api.openai.com/v1/chat/completions', () =>
    HttpResponse.json({ choices: [{ message: { content: '5 a 7 dias úteis' } }] })
  )
)
```

Confirme também que o `setupServer` foi inicializado com `onUnhandledRequest: 'error'`:

```typescript
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
```

---

**Se falha C5:**
Há assertions vagas (`toBeDefined()`, `toBeTruthy()`) como único check do comportamento. Essas assertions passam para qualquer valor não-nulo, incluindo respostas de erro disfarçadas de objetos.

```typescript
// Errado
expect(result).toBeDefined()
expect(result.answer).toBeTruthy()

// Correto
expect(result.answer).toContain('5 a 7 dias úteis')
expect(result.sources[0].document).toBe('POL-SLA-001')
expect(result.confidence).toBeGreaterThan(0.7)
```

> `toBeDefined()` é aceitável como assertion adicional (não como única), por exemplo para verificar que um campo opcional existe antes de acessar suas propriedades.

---

**Se falha C6:**
Os dados de teste são genéricos ("test", "foo", "hello", "doc1"). Dados sem contexto de domínio mascaram erros semânticos de negócio e passam por validações que deveriam falhar para entradas inválidas.

```typescript
// Errado
const query = { query: 'test' }
const chunk = { document_id: 'doc1', content: 'foo bar', score: 0.9 }

// Correto
const query = { query: 'Qual o prazo para entrega de SP para Fortaleza de carga fracionada?' }
const chunk = {
  document_id: 'POL-SLA-001',
  content: 'Carga fracionada SP→CE: prazo de 5 a 7 dias úteis conforme tabela regional.',
  score: 0.91,
}
```

---

**Se falha C7:**
`sources` não está sendo validado em nenhum assertion. O contrato do endpoint é `{ answer, sources, confidence }` — validar apenas `answer` deixa sem cobertura a lógica de seleção do documento fonte.

```typescript
// Errado
expect(result.answer).toContain('dias úteis')
// source_document não verificado

// Correto
expect(result.answer).toContain('dias úteis')
expect(result.sources[0].document).toBe('POL-SLA-001')
```

---

**Se falha C8:**
`afterEach(() => server.resetHandlers())` está ausente. Sem reset, handlers adicionados com `server.use()` dentro de um teste persistem para os seguintes, causando falhas cruzadas difíceis de reproduzir.

```typescript
// Errado
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
// afterEach ausente

// Correto
const server = setupServer()
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

**Se falha I1:**
Os dados do MSW handler ou as queries estão definidos inline no corpo do teste em vez de serem derivados dos anexos do projeto ou de um helper de fixtures criado para a suite. Dados duplicados em múltiplos arquivos criam inconsistências quando o documento de origem muda.

```typescript
// Errado
server.use(
  http.post('http://retrieval-service/search', () =>
    HttpResponse.json({
      chunks: [{ document_id: 'POL-SLA-001', content: 'Prazo 5 dias.', score: 0.88 }],
    })
  )
)

// Correto
// Derive os dados dos anexos A/B ou de um helper local de fixtures do projeto

server.use(
  http.post('http://retrieval-service/search', () =>
    HttpResponse.json({ chunks: [{ document_id: 'POL-SLA-001', content: 'Prazo 5 dias.', score: 0.88 }] })
  )
)
const query = { question: 'Qual o prazo de entrega de SP para Fortaleza?' }
```

---

**Se falha I2:**
Há uso de `sleep()`, `setTimeout()` ou `await new Promise(r => setTimeout(r, n))` para aguardar operações assíncronas. Esperas arbitrárias tornam a suite lenta e mascaram race conditions.

```typescript
// Errado
queryHandler({ question: 'prazo Manaus' })
await new Promise(r => setTimeout(r, 1000))
expect(cache.has('prazo Manaus')).toBe(true)

// Correto
await queryHandler({ question: 'prazo Manaus' })
expect(cache.has('prazo Manaus')).toBe(true)
```

---

**Se falha I3:**
O MSW handler não retorna a estrutura completa `{ answer, sources, confidence }`. Handlers incompletos fazem o endpoint retornar `undefined` em campos não mockados, mascarando erros de integração.

```typescript
// Errado
http.post('http://retrieval-service/search', () =>
  HttpResponse.json({ answer: '5 a 7 dias úteis' }) // falta sources e confidence
)

// Correto
http.post('http://retrieval-service/search', () =>
  HttpResponse.json({
    chunks: [{ document_id: 'POL-SLA-001', content: '5 a 7 dias úteis', score: 0.91 }],
  })
)
// o handler de retrieval retorna chunks; answer/sources/confidence são gerados pelo queryHandler
```

---

**Se falha I4:**
O happy path não valida `confidence` com `toBeGreaterThan(0.7)`. Sem esse assertion, falhas na lógica de cálculo de confidence passam despercebidas quando o retrieval retorna score alto.

```typescript
// Errado
expect(result.answer).toContain('dias úteis')
expect(result.sources[0].document).toBe('POL-SLA-001')
// confidence não verificado

// Correto
expect(result.answer).toContain('dias úteis')
expect(result.sources[0].document).toBe('POL-SLA-001')
expect(result.confidence).toBeGreaterThan(0.7)
expect(result.confidence).toBeLessThanOrEqual(1.0)
```

---

## Scorecard de Revisão

| Teste | Data | Revisor | Críticos (/8) | Importantes (/4) | Status | Notas |
|-------|------|---------|---------------|------------------|--------|-------|
| TC-01-1 | | | | | | |
| TC-01-2 | | | | | | |
| TC-02-1 | | | | | | |
| TC-03-1 | | | | | | |
| TR-01-1 | | | | | | |

**Legenda:**
- ✓ Aprovado: todos os 8 críticos passaram
- ✗ Rejeitado: algum crítico falhou — deve ser corrigido antes do merge
- ⚠ Aprovado com ressalvas: todos os críticos passaram, mas há itens Importantes em aberto

---

## FAQ

**1. Quantos assertions um teste deve ter?**

Entre 2 e 5 assertions por `it()`. Testes com mais de 5 assertions geralmente estão verificando múltiplos comportamentos ao mesmo tempo — separe em `it()` distintos, um por comportamento. Testes com apenas 1 assertion do tipo `toBeDefined()` são insuficientes e falham no item C5.

---

**2. Posso usar `Math.random()` ou `Date.now()` para gerar dados de fixture?**

Não. Fixtures com valores aleatórios produzem testes não-determinísticos: o mesmo código pode passar em uma execução e falhar em outra. Use sempre valores fixos e representativos do domínio NovaTech. Se precisar de variações, derive novas entradas a partir dos anexos A/B ou centralize os dados em um helper do projeto.

---

**3. `toBeDefined()` é sempre proibido ou há casos em que é aceitável?**

`toBeDefined()` é aceitável como assertion adicional, não como único check. Por exemplo, é válido usar `expect(result.metadata).toBeDefined()` antes de acessar `result.metadata.timestamp` — isso evita erros de leitura de `undefined`. O que é proibido (item C5) é ter apenas `toBeDefined()` ou `toBeTruthy()` sem nenhum assertion que valide o conteúdo real.

---

**4. Testes de robustez (TR-*) também precisam de MSW?**

Sim. Mesmo testes de robustez que simulam falhas (503, timeout, payload inválido) devem usar MSW para interceptar as chamadas HTTP e retornar o cenário de erro controlado. Nunca force uma falha dependendo de uma URL inexistente ou de uma chamada real com rede desligada.

```typescript
// TR-01-1: retrieval retorna 503
server.use(
  http.post('http://retrieval-service/search', () =>
    HttpResponse.json({ error: 'Service Unavailable' }, { status: 503 })
  )
)
await expect(queryEndpoint(query)).rejects.toThrow('Retrieval service unavailable')
```

---

**5. O que fazer se a fixture necessária ainda não existe?**

Derive a fixture a partir dos anexos A/B ou centralize-a em um helper do projeto. Adicione um comentário indicando a origem do dado (ex: `// de POL-SLA-001 seção 3.2`). Não defina a fixture inline no arquivo de teste — isso viola o item I1 e cria duplicação.

---

**6. Posso ter múltiplos `it()` dentro de um `describe` para o mesmo endpoint?**

Sim, e é recomendado. Cada `it()` deve cobrir exatamente um comportamento ou condição distinta: happy path, low-confidence, serviço indisponível, payload inválido. O `describe` agrupa todos os cenários relacionados ao mesmo componente ou contexto de negócio. Certifique-se de que o `afterEach(() => server.resetHandlers())` está presente para isolar os handlers entre os `it()`.
