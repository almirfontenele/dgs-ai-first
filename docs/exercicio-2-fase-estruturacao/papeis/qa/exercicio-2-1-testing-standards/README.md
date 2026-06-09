# Exercício 2.1 — Contribuição para o AGENTS.md: Seção de Testing Standards

## Contexto
O Tech Lead pediu que você escreva a seção de padrões de teste do AGENTS.md que todo agente de IA deve seguir ao gerar código de teste. Você precisa estabelecer padrões prescritivos o suficiente para que ferramentas como Copilot gerem testes melhores, e criar critérios objetivos de review que dois QAs aplicariam da mesma forma.

## Ferramentas a Utilizar
- Claude (chat)

## Inputs Fornecidos

### Decisões Técnicas do Tech Lead
- Vitest para testes unitários e de integração
- Mocks com msw (Mock Service Worker) para APIs externas
- Testes rodam no CI via GitHub Actions
- Coverage mínimo: 80% de linhas

### Exemplo de Teste Ruim
```typescript
// Teste gerado pelo Copilot sem guidance
test('query endpoint works', async () => {
  const result = await handler({ body: '{"question": "test"}' });
  expect(result).toBeDefined();
});
```

## Tarefas

Cada tarefa está documentada em sua pasta correspondente:

1. **[Tarefa 2.1.1](tarefas/2-1-1-escrever-testing-standards.md)** — Escrever a seção "Testing Standards" do AGENTS.md
2. **[Tarefa 2.1.2](tarefas/2-1-2-reescrever-teste-ruim.md)** — Reescrever o teste ruim seguindo os padrões
3. **[Tarefa 2.1.3](tarefas/2-1-3-definir-criterios-review.md)** — Definir critérios de review para testes gerados por IA

## Entregáveis

Ao final do exercício, você terá:
- [ ] Seção "Testing Standards" do AGENTS.md com padrões de nomenclatura, estrutura (arrange/act/assert), assertions, mocking e fixtures
- [ ] Teste reescrito com explicações de cada melhoria implementada
- [ ] Ao menos 3 critérios objetivos e verificáveis de review para código de teste

## Critérios de Avaliação

- ✓ A seção é prescritiva o suficiente para que o Copilot gere testes melhores
- ✓ O teste reescrito demonstra os padrões na prática
- ✓ Os critérios de review são objetivos (dois QAs chegariam à mesma conclusão)
