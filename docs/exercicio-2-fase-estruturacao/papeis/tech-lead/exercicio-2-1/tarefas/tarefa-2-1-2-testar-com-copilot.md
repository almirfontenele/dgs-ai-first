# Tarefa 2.1.2 — Testar AGENTS.md com GitHub Copilot

## Objetivo
Validar o AGENTS.md v1 através de teste prático com GitHub Copilot, verificando se o documento é suficientemente prescritivo.

## Descrição
Com o AGENTS.md v1 presente no repositório, solicite ao GitHub Copilot que gere:
1. Uma Azure Function endpoint completa
2. Um teste para esse endpoint

Observe se o Copilot segue as convenções definidas no AGENTS.md.

## Procedimento

### Teste 1: Geração de Endpoint
1. Coloque o AGENTS.md v1 no repositório raiz
2. Abra o GitHub Copilot no VS Code
3. Solicite: "Crie uma Azure Function HTTP trigger que retorna um JSON com dados de exemplo, seguindo os padrões do AGENTS.md"
4. Observe e documente:
   - Qual linguagem foi usada?
   - As imports estão corretas?
   - O padrão de erro handling foi seguido?
   - O logging usa pino ou console.log?
   - A validação usa Zod?

### Teste 2: Geração de Teste
1. Solicite ao Copilot: "Crie um teste Vitest para o endpoint acima, incluindo casos de sucesso e erro"
2. Observe e documente:
   - Framework de teste é Vitest?
   - Estrutura de arquivos segue o padrão?
   - Fixtures e mocks estão bem organizados?

## Saída esperada
- Screenshot ou cópia dos outputs do Copilot
- Checklist do que foi seguido vs ignorado:
  ```
  ✓ TypeScript
  ✓ Azure Functions
  ✗ Zod validation
  ✗ pino logging
  ...
  ```
- Análise qualitativa de cada ponto ignorado

## Critério de sucesso
Documentar fielmente o que Copilot seguiu e o que não seguiu, sem viés. Esta informação alimentará a iteração v1 → v2.
