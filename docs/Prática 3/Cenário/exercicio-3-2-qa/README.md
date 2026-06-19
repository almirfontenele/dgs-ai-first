# Exercício 3.2 — Revisão crítica dos testes gerados por IA

**Papel:** QA  
**Tópico:** Revisão Crítica de Outputs de IA  
**Cenário:** [Contexto compartilhado](../cenario-3-contexto.md)

---

## Contexto

Alguns testes de integração foram gerados pelo Copilot. Você revisa se realmente testam o que deveriam.

---

## Ferramentas a utilizar

- **Claude** (chat)

---

## Inputs fornecidos

O cenário completo (acima).

A estrutura do repositório (ver **Anexo C**) — o projeto usa **Vitest** como framework de teste (não jest).

3 testes simulados:

```typescript
// Teste 1 — assertions vagas
describe('query endpoint', () => {
  it('should return a response', async () => {
    const res = await request(app).post('/api/query').send({ question: 'prazo devolução' });
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });
});

// Teste 2 — dados irreais (não exercitam o domínio)
describe('query endpoint edge cases', () => {
  it('should handle empty question', async () => {
    const res = await request(app).post('/api/query').send({ question: '' });
    expect(res.status).toBe(400);
  });
});

// Teste 3 — mock que mascara bug
describe('feedback endpoint', () => {
  it('should save feedback', async () => {
    const mockCreate = jest.fn().mockResolvedValue({ id: '123' });
    const res = await request(app).post('/api/feedback').send({
      queryId: 'q1', rating: 5, comment: 'great'
    });
    expect(res.status).toBe(200);
    expect(mockCreate).toHaveBeenCalled();
  });
});
```

---

## Tarefa

### 1. Sua própria avaliação dos testes

Avalie cada teste por conta própria:
- O que testa?
- O que falha em testar?
- Qual o risco se o teste "passar" mas o código estiver errado?

### 2. Avaliação do Claude

Use o **Claude** para uma segunda revisão e compare.

### 3. Reescreva o Teste 1

Reescreva o Teste 1 numa versão melhor:
- Assertion que verifica o conteúdo da resposta, não só que existe

---

## Entregável

- Sua revisão dos 3 testes
- A revisão do Claude
- A comparação
- O Teste 1 reescrito

---

## Critérios de avaliação

- [ ] Teste 1: identificado como insuficiente (verifica que retorna algo, não que retorna a resposta CERTA)
- [ ] Teste 2: identificado como incompleto (edge case de input válido, mas não exercita o domínio — nenhuma pergunta real de logística)
- [ ] Teste 3: identificado como perigoso (o mock é tão permissivo que o teste passaria mesmo sem validação de input)
- [ ] Ponto de atenção: os testes usam `jest`, mas o projeto usa Vitest (inconsistência com o AGENTS.md) — identificar isso demonstra atenção ao contexto
- [ ] O Teste 1 reescrito verifica conteúdo (ex: que a resposta contém o prazo correto e cita a fonte)
