# Exercício 2.3 — Criação e teste de skills técnicas

## Contexto
Você precisa criar as skills técnicas do projeto que vão garantir que o Copilot gere código consistente com os padrões definidos.

## Ferramentas a utilizar
- Claude (chat)
- GitHub Copilot

## Inputs fornecidos
- O cenário completo
- A estrutura do repositório (ver **Anexo C**) — as skills devem seguir a hierarquia de diretórios definida em `/skills/`
- A árvore de skills proposta pelo desenvolvedor (simulada):

```
Foundation:
├── typescript-conventions (strict mode, imports, naming)
├── error-handling (custom errors, logging, retry)
└── project-structure (folders, modules, exports)

Domain:
├── azure-functions-endpoint (HTTP trigger pattern)
├── azure-ai-search-integration (query, index management)
├── react-components (painel web patterns)
└── testing-patterns (Vitest, mocks, fixtures)

Artifact:
├── create-rag-endpoint (receita completa)
├── create-integration-test (receita completa)
└── create-react-card (receita completa)
```

## Entregável
- SKILL.md para a skill `azure-functions-endpoint` (Domain level)
- Outputs do Copilot antes e depois (com análise)
- Critérios de maturidade da skill
- (Opcional) SKILL.md iterado v2 se houver necessidade

## Critérios de avaliação
- O SKILL.md é prescritivo e concreto (exemplos de código reais)
- A iteração mostra que skills precisam de refinamento baseado em teste real
- Os critérios de maturidade são práticos e mensuráveis
- O participante demonstra que skills são artefatos vivos

## Tarefas

1. [Escrever SKILL.md para azure-functions-endpoint](tarefas/tarefa-2-3-1-skill-md.md)
2. [Testar skill com GitHub Copilot](tarefas/tarefa-2-3-2-testar-skill.md)
3. [Iterar e refinar SKILL.md](tarefas/tarefa-2-3-3-iterar-skill.md)
4. [Definir critérios de maturidade](tarefas/tarefa-2-3-4-criterios-maturidade.md)
