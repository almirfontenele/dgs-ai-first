# Tarefa 2.3.1 — Criar SKILL.md para `create-integration-test`

## Objetivo
Criar um documento SKILL.md que encapsule como gerar testes de integração de alta qualidade para o projeto NovaTech, de forma que Copilot, Claude, ou outros LLMs gerem testes que passem em review na primeira tentativa.

## O Que É um SKILL.md?
Um bom SKILL.md tem:
- **Activation phrase**: Como você convoca esta skill (ex: "crie um teste de integração para")
- **Contextual clarity**: Quando aplicar esta skill vs. outras (unit test vs. integration test vs. e2e)
- **Prescriptive rules**: Regras obrigatórias + anti-padrões explícitos
- **Template with placeholders**: Um teste "em branco" que mostra a estrutura
- **2 complete examples**: Um ✓ bem escrito, um ✗ com problemas comuns
- **Anti-patterns gallery**: 5-10 erros que LLMs realmente fazem ao gerar testes
- **Dependencies**: Qual skill ou documento devem ser lidos antes? (ex: Testing Standards)

## Tarefa

### Passo 1: Definir Ativação da Skill
Especifique como a skill será acionada. Exemplos:

```markdown
## Activation Phrase

Use esta skill quando precisar:
- Gerar um teste de integração para um endpoint do query RAG
- Validar comportamento de múltiplos componentes juntos
- Testar integração com o LLM + documento retrieval

Não use esta skill para:
- Testes unitários de funções isoladas (use unit-test skill)
- Testes end-to-end que atravessam múltiplos serviços (use e2e-test skill)
- Testes de performance/carga (use load-test skill)
```

### Passo 2: Escrever Regras Prescritivas
Extraia do Testing Standards e organize em duas seções:

```markdown
## DO (Obrigatório)

- [ ] Nome descritivo: `describe('QueryEndpoint', () => { it('should...') })`
- [ ] Arrange/Act/Assert explícito com comentários
- [ ] Dados realistas do domínio (perguntas/chunks de NovaTech)
- [ ] Assertions específicas (nunca só toBeDefined())
- [ ] [...]

## DON'T (Proibido)

- [ ] Acesso a serviços reais (sempre mockear com MSW)
- [ ] Dependência de ordem entre testes
- [ ] Data/hora hardcoded ou flutuante (use fixtures)
- [ ] Assertions vagas como toBeTruthy() ou expect(result)
- [ ] [...]
```

### Passo 3: Criar Template com Placeholders
Crie um template em branco que mostre a estrutura esperada:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { queryHandler } from '@/endpoints/query';
import { FIXTURES } from '@/tests/fixtures';

// [PLACEHOLDER: Setup MSW mock]
const server = setupServer(
  rest.post('http://api.example.com/search', (req, res, ctx) => {
    // [PLACEHOLDER: Mock response for retrieval]
  })
);

describe('QueryEndpoint', () => {
  beforeEach(() => server.listen());
  afterEach(() => server.resetHandlers());

  it('should [behavior] when [condition]', async () => {
    // ARRANGE: [Setup inputs and mocks]
    const question = '[PLACEHOLDER: Realistic question from domain]';
    const expectedChunks = FIXTURES.chunks.[PLACEHOLDER: context];

    // ACT: [Invoke the endpoint]
    const result = await queryHandler({
      question,
      // [PLACEHOLDER: Other required inputs]
    });

    // ASSERT: [Validate all aspects of the response]
    expect(result.answer).toBeDefined();
    expect(result.source_document).toBe('[PLACEHOLDER: Expected source]');
    expect(result.confidence).toBeGreaterThan(0.7);
  });
});
```

### Passo 4: Incluir 2 Exemplos Completos
Crie:

**Exemplo ✓ (Bem escrito)**: Um teste que segue todos os padrões
```typescript
// Exemplo de teste correto do QueryEndpoint
[Código completo de um bom teste]
```

**Exemplo ✗ (Com problemas comuns)**: Um teste com anti-padrões
```typescript
// Exemplo de teste com problemas que LLMs geram frequentemente
[Código com problemas anotados]
```

### Passo 5: Documentar Anti-Padrões
Crie uma galeria de 5-10 anti-padrões que LLMs realmente geram:

```markdown
## Anti-Pattern 1: Assertions Vagas

**Problem:**
\`\`\`typescript
expect(result).toBeDefined(); // Não valida comportamento
\`\`\`

**Why it's dangerous:** Passa mesmo se a resposta for { error: "not implemented" }

**Correct approach:**
\`\`\`typescript
expect(result.answer).toContain('importante');
expect(result.source_document).toMatch(/POL-\d+/);
\`\`\`

## Anti-Pattern 2: Dados Hardcoded

[Idem para 4-8 anti-padrões mais]
```

### Passo 6: Listar Dependências
Especifique quais skills ou documentos devem ser lidos antes:

```markdown
## Dependencies

Read these first:
1. **Testing Standards** (Exercício 2.1) — padrões obrigatórios para todo teste
2. **AGENTS.md - Testing Standards section** — contexto do projeto
3. **NovaTech Domain Glossary** — glossário de termos de logística
4. (Opcional) **RAG Pipeline Architecture** — para entender fluxo de dados
```

## Entregável
Um documento `SKILL.md` para `create-integration-test` contendo:
- Activation phrase clara
- Regras prescritivas (DO / DON'T)
- Template com placeholders
- 2 exemplos completos (✓ correto / ✗ com problemas)
- Galeria de 5-10 anti-padrões específicos de testes gerados por IA
- Dependências listadas

## Critério de Sucesso
Copilot (ou um LLM) consegue ler sua skill e gerar testes que:
1. Passam na primeira revisão (estrutura correta)
2. Usam dados realistas do domínio (não genéricos)
3. Evitam os 5+ anti-padrões mais comuns documentados
4. Validam comportamento específico (não assertions vagas)
