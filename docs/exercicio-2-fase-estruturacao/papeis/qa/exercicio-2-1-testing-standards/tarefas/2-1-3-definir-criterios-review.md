# Tarefa 2.1.3 — Definir Critérios Objetivos de Review para Testes

## Objetivo
Criar um conjunto de critérios de review que dois QAs aplicariam da mesma forma, permitindo avaliar rapidamente se um teste gerado por IA segue os padrões do projeto.

## O Que É um Critério de Review Objetivo?
Um bom critério de review:
- ✓ É verificável (passa/não passa, sem interpretação)
- ✓ É independente (um critério não depende de outro)
- ✓ É específico ao projeto (não genérico demais)
- ✓ Pode ser checado em < 2 minutos por teste
- ✗ Não é vago ("o teste está bom" ← ruim)

## Tarefa

### Passo 1: Extrair Critérios do Testing Standards
Usando o Claude, analise o documento `testing-standards.md` criado na tarefa 2.1.1 e identifique:

1. **Regras obrigatórias** que podem se tornar critérios (ex: "todo teste deve ter describe com frase descritiva")
2. **Anti-padrões** que precisam ser verificados (ex: "não deve ter toBeDefined() sozinho")
3. **Estrutura mínima** esperada (ex: "arrange, act, assert explícitos com comentários")

### Passo 2: Formular Critérios Verificáveis
Para cada regra, crie um critério no formato:

```markdown
## Critério [N]: [Título Descritivo]

**Descrição:** [Uma frase clara do que está sendo validado]

**Passa se:** [Condição objetiva - deve ser verificável visualmente ou via ferramenta]

**Falha se:** [Contra-exemplo específico]

**Verificação rápida:** [Dica para checar em < 30 segundos]

**Exemplos:**
- ✓ [Exemplo de código que passa]
- ✗ [Exemplo de código que falha]
```

### Passo 3: Validar a Cobertura
Verifique que seus critérios cobrem:
- [ ] Nomenclatura (describe e it patterns)
- [ ] Estrutura (arrange/act/assert)
- [ ] Assertions (específicas, não vagas)
- [ ] Mocking (msw usado apropriadamente)
- [ ] Dados (realistas, não hardcoded)
- [ ] Fixtures (reutilizáveis, não duplicadas)
- [ ] Erros comuns de IA (assertions fracas, acesso a serviços reais, etc.)

## Entregável
Um documento `review-criteria.md` contendo:
- Ao menos 6-8 critérios de review
- Cada critério com: título, descrição, condição de passa/falha, dica rápida, exemplos
- Um resumo executivo (checklist rápido para usar durante review)
- Uma seção de "Prioridades" (qual critério é mais importante se tempo for curto)

## Critério de Sucesso
Você consegue dar este documento para um QA novo que nunca revisou testes de IA e ele consegue revisar 3 testes em menos de 5 minutos, chegando às mesmas conclusões que você chegaria.
