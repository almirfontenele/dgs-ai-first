# Tarefa 2.3.2 — Criar Checklist de Revisão com Cowork

## Objetivo
Usar Claude Cowork para criar um checklist de revisão de testes que:
1. É rápido de aplicar (< 2 minutos por teste)
2. É objetivo (passa/não passa, sem interpretação)
3. Pode ser usado por QAs novos sem treinamento extenso
4. Rastreia conformidade com a skill `create-integration-test`

## O Que É um Checklist de Revisão Efetivo?
Um bom checklist:
- **É específico** (não "o teste está bom")
- **É verificável visualmente** (não requer ferramentas extras)
- **Tem prioridades** (crítico vs. importante vs. nice-to-have)
- **Pode ser automatizado parcialmente** (regex para detectar bad patterns)
- **Fornece feedback** (se falha, diz por quê e como consertar)
- **É rastreável** (qual critério falhou? qual anti-padrão foi detectado?)

## Tarefa

### Passo 1: Extrair Critérios da Skill
Partindo do SKILL.md criado na tarefa anterior, converta cada regra e anti-padrão em um item verificável:

**Exemplo:**
- **Skill rule**: "Assertions específicas (nunca só toBeDefined())"
- **Checklist item**: "[ ] Cada expect() valida comportamento específico, não apenas existência"

### Passo 2: Estruturar o Checklist
Organize em categorias com prioridades:

```markdown
# Test Review Checklist: create-integration-test

## Crítico (Falha na revisão se algum passar)

- [ ] **C1**: Teste tem `describe` com nome claro do que está testando
- [ ] **C2**: Teste tem `it` com frase descritiva "should [behavior] when [condition]"
- [ ] **C3**: Teste tem seções ARRANGE/ACT/ASSERT explícitas
- [ ] **C4**: Nenhuma chamada a serviços reais (tudo é mockeado com MSW)
- [ ] **C5**: Nenhum assertion vago como `toBeDefined()`, `toBeTruthy()` sozinhos
- [ ] **C6**: Dados de teste são realistas (exemplos do domínio NovaTech, não "test"/"hello")

## Importante (Recomendado)

- [ ] **I1**: Usa fixtures de `/tests/fixtures/` para dados reutilizáveis
- [ ] **I2**: Não tem sleep() ou setTimeout()
- [ ] **I3**: MSW handler mockeia resposta com estrutura realista
- [ ] **I4**: Fixtures ou dados incluem comentário explicando a origem

## Nice-to-Have (Melhorias futuras)

- [ ] **N1**: Teste valida também comportamento de erro (sad path)
- [ ] **N2**: Coverage >80% para o código sob teste
```

### Passo 3: Adicionar Guia de Automação
Especifique quais itens podem ser verificados automaticamente:

```markdown
## Automatable Checks

```bash
# Verificar ausência de padrões ruins
grep -n "\.toBeDefined()" test-file.ts  # ← Se achár, falha C5
grep -n "await new Promise" test-file.ts # ← Se achar, falha I2
grep -n "fetch(" test-file.ts           # ← Se achar, falha C4
```

Outros itens (C1, C2, C3, I1, etc.) requerem revisão manual.
```

### Passo 4: Criar Guia de Feedback
Para cada item, defina uma sugestão de melhoria se falhar:

```markdown
## Feedback Sugerido

**Se falha C1:** Exemplo de `describe` correto:
\`\`\`typescript
describe('QueryEndpoint', () => {
  // não: describe('query', () => {
\`\`\`

**Se falha C3:** Adicione comentários explícitos:
\`\`\`typescript
it('should...', async () => {
  // ARRANGE
  const question = '...';
  
  // ACT
  const result = await queryHandler(...);
  
  // ASSERT
  expect(result).toBe(...);
});
\`\`\`

[Idem para outros itens]
```

### Passo 5: Criar Scorecard
Adicione uma seção para rastrear resultado da revisão:

```markdown
## Review Scorecard

| Teste | Data | Revisor | Críticos | Importantes | Status | Notas |
|-------|------|---------|----------|-------------|--------|-------|
| TC-01-1 | 2024-06-09 | Alice | 6/6 ✓ | 3/4 | Aprovado | Falta fixture origem |
| TC-01-2 | 2024-06-09 | Bob | 5/6 ✗ | 2/4 | Rejeitado | Tem sleep() e toBeDefined() |
| | | | | | | |

**Legenda:**
- ✓ Passou em todos os críticos
- ✗ Falhou em alguns críticos
```

### Passo 6: Adicionar FAQ
Inclua seção com perguntas/respostas comuns durante revisão:

```markdown
## FAQ

**P: "Quantos assertions um teste deve ter?"**
A: Mínimo 2-3, máximo 5-7. Menos é risco (não valida o suficiente), mais é risco (teste testa muita coisa).

**P: "É OK usar Math.random() para dados de teste?"**
A: Não. Use fixtures estáticas ou factories determinísticas para reproduzibilidade.

**P: "Este teste valida também prompts de erro?"**
A: Sim, é ideal. Happy path + sad path = cobertura melhor. Mas não é crítico, vai para "Important".
```

## Entregável
Um documento Cowork `test-review-checklist.md` contendo:
- Checklist estruturado com 3 níveis (Crítico, Importante, Nice-to-Have)
- Ao menos 6 itens Críticos derivados da skill
- Ao menos 4 itens Importantes
- Guia de automação (quais checks podem rodar em CI)
- Feedback sugerido para cada item
- Scorecard para rastrear resultados de revisão
- FAQ com perguntas comuns

## Critério de Sucesso
Um QA novo consegue:
1. Revisar um teste em < 2 minutos usando sua checklist
2. Decidir com confiança se passa ou falha (sem dúvida)
3. Fornecer feedback construtivo se falhar (sabe exatamente por quê)
4. Rastrear resultado numa tabela (scorecard)
5. Automatizar parte da revisão rodando os checks no CI
