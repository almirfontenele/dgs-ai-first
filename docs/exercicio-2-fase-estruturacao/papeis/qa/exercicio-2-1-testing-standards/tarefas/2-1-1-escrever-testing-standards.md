# Tarefa 2.1.1 — Escrever a Seção "Testing Standards" do AGENTS.md

## Objetivo
Criar uma seção prescritiva do AGENTS.md que estabeleça os padrões obrigatórios para testes gerados por IA, de forma que ferramentas como Copilot gerem testes de qualidade consistente.

## O Que É uma Seção de Testing Standards?
Uma boa seção de Testing Standards:
- Define **nomenclatura clara** (como nomear testes, descrever comportamentos)
- Especifica **estrutura obrigatória** (arrange/act/assert, setup/teardown)
- Lista **o que TODO teste DEVE ter** (assertions específicas, dados realistas)
- Lista **o que TODO teste NÃO DEVE ter** (acesso a serviços reais, dados hardcoded, dependência de ordem)
- Documenta **padrões de mocking** (qual ferramenta, quando usar, exemplos)
- Define **padrões de fixtures** (onde armazenar, como reutilizar dados de teste)

## Tarefa

### Passo 1: Analisar o Contexto de Testes
Usando o Claude, analise:

1. **O framework Vitest**: Qual é a sintaxe esperada, como ele organiza testes (describe/it), como roda fixtures e hooks?

2. **O padrão msw (Mock Service Worker)**: Como mockear chamadas HTTP, qual é a diferença entre mocks de API e factories de dados, quando cada um é apropriado?

3. **Os dados de teste do contexto NovaTech**:
   - Tipos de perguntas frequentes (4 categorias)
   - Chunks esperados no RAG
   - Responses esperadas
   - Como esses dados deveriam ser estruturados em fixtures reutilizáveis?

### Passo 2: Escrever a Seção
Crie um documento `testing-standards.md` com a seguinte estrutura:

```markdown
# Testing Standards for AGENTS.md

## Nomenclatura de Testes
[Padrão esperado com exemplos corretos e incorretos]

## Estrutura Obrigatória: Arrange/Act/Assert
[Explicação com exemplo de teste bem estruturado]

## O Que Todo Teste DEVE Ter
[Lista de requisitos obrigatórios - 5-7 itens com exemplos]

## O Que TODO Teste NÃO DEVE Ter
[Anti-padrões explícitos - 5-7 itens com exemplos de código ruim]

## Padrões de Mocking com MSW
[Quando usar, como estruturar, exemplo de setup e uso]

## Padrões de Fixtures
[Onde armazenar, como estruturar, exemplos de fixtures para RAG]

## Coverage Mínimo
[Claramente documentado: 80% de linhas, como verificar no CI]
```

### Passo 3: Validação da Prescrição
Para cada seção, valide:
- [ ] Um desenvolvedor novo conseguiria seguir sem ambiguidade
- [ ] Os exemplos são reais (código que realmente apareceria em testes de RAG)
- [ ] Os padrões são mensuráveis (uma ferramenta de linting poderia verificar?)
- [ ] O padrão de fixtures é prático (dados vivos vs. factories vs. fixtures estáticas)

## Entregável
Um documento `testing-standards.md` completo que:
- Define nomenclatura com exemplos (✓ correto / ✗ incorreto)
- Explica arrange/act/assert com código funcional
- Lista 5+ deve-ter e 5+ não-deve-ter
- Documenta mocking com msw com exemplo end-to-end
- Define padrão de fixtures para dados de teste RAG
- Especifica coverage mínimo

## Critério de Sucesso
Um desenvolvedor novo, lendo sua seção, consegue escrever um teste para o query endpoint que passa em code review na primeira tentativa (estrutura, assertions específicas, mocking correto).
