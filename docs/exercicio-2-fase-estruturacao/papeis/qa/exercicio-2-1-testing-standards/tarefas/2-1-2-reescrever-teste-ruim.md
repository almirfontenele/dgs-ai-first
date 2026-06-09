# Tarefa 2.1.2 — Reescrever o Teste Ruim Seguindo os Padrões

## Objetivo
Demonstrar na prática como os padrões de Testing Standards transformam um teste mal escrito em um teste de qualidade, documentando cada melhoria.

## O Teste Ruim (Baseline)
```typescript
// Teste gerado pelo Copilot sem guidance
test('query endpoint works', async () => {
  const result = await handler({ body: '{"question": "test"}' });
  expect(result).toBeDefined();
});
```

### Problemas Identificados Neste Teste
- ❌ Descrição vaga ("works" não descreve comportamento específico)
- ❌ Dado de teste irrealista ("test" não é uma pergunta real do domínio)
- ❌ Assertion fraca (toBeDefined() não valida comportamento)
- ❌ Sem estrutura arrange/act/assert explícita
- ❌ Sem setup de mocks (pode acessar serviços reais)
- ❌ Sem validação de campo obrigatório (source_document)

## Tarefa

### Passo 1: Reescrever com Padrões Básicos
Crie uma versão melhorada que:
1. Usa descritores específicos (describe/it com frase clara)
2. Inclui arrange/act/assert explícito com comentários
3. Usa dados realistas do domínio NovaTech
4. Valida comportamento real (presença de source, resposta em tempo esperado)

### Passo 2: Adicionar Mocking e Fixtures
Evolua o teste anterior para:
1. Usar msw para mockear chamadas HTTP (se houver integração com APIs externas)
2. Usar fixtures do NovaTech (perguntas reais, chunks esperados)
3. Validar múltiplas assertions (response body, status, campos obrigatórios)

### Passo 3: Documentar Melhorias
Para cada versão (básica → com mocking → completa), crie uma seção:

```markdown
## Versão [X]: [Descrição da Melhoria]

**Código:**
[código do teste]

**Melhorias em relação à versão anterior:**
- [ ] [Melhoria 1]
- [ ] [Melhoria 2]
- [ ] [...]

**Padrões aplicados:**
- [Padrão 1 do Testing Standards]
- [Padrão 2 do Testing Standards]
```

## Entregável
Um documento `test-refactoring.md` contendo:
- Versão 1: Teste reescrito com padrões básicos (describe/it, arrange/act/assert, dados realistas)
- Versão 2: Teste com mocking MSW e fixtures
- Versão 3 (opcional): Teste com edge cases ou robustez
- Para cada versão: código + explicação de melhorias + referência aos padrões aplicados

## Critério de Sucesso
Alguém lendo seu documento consegue:
1. Entender exatamente por que o teste original era ruim
2. Ver como cada padrão do Testing Standards melhora o teste progressivamente
3. Usar essas versões como exemplos ao revisar testes gerados por IA
