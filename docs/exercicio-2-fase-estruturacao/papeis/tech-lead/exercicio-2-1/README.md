# Exercício 2.1 — Construção e teste do AGENTS.md do projeto

## Contexto
Você é responsável por montar o AGENTS.md do repositório — o documento que todo agente de IA (Copilot, Claude Code) lê antes de gerar qualquer artefato no projeto. As decisões técnicas vêm das ADRs produzidas na fase anterior.

## Ferramentas a utilizar
- Claude (chat)
- GitHub Copilot

## Inputs fornecidos
- O cenário completo
- A estrutura do repositório (ver **Anexo C**)
- As decisões técnicas das ADRs da fase anterior (simuladas):
  - TypeScript com strict mode
  - Azure Functions v4 com HTTP triggers
  - Zod para validação de input/output
  - Vitest para testes
  - pino para logging (nunca console.log)
  - Conventional Commits para mensagens de commit
  - Branch strategy: feature branches com PR obrigatório para main
  - Context budget: ~4K tokens system prompt + ~8K chunks por query (ADR-0002)
  - Documentos contraditórios: metadado de vigência, priorizar mais recente (ADR-0003)

- A especificação do AGENTS.md: *"O AGENTS.md é a constitution do projeto: contém decisões duráveis que todo agente e toda spec devem respeitar. Funciona como contrato entre humanos e agentes."*

## Entregável
- O AGENTS.md v1
- Outputs do Copilot (primeira rodada)
- Análise do que foi seguido/ignorado
- AGENTS.md v2 (iterado)
- Outputs da segunda rodada de testes

## Critérios de avaliação
- O AGENTS.md é prescritivo (instruções que um agente consegue seguir, não descrição do projeto)
- As regras de gerenciamento de contexto da ADR-0002 estão incorporadas (context budget, limites por query)
- O teste com Copilot é real (evidência de outputs)
- A iteração v1 → v2 mostra melhoria concreta
- A análise reconhece limitações (nem tudo será seguido — e isso é esperado)

## Tarefas

1. [Escrever AGENTS.md v1 com Claude](tarefas/tarefa-2-1-1-escrever-agents-md.md)
2. [Testar AGENTS.md com GitHub Copilot](tarefas/tarefa-2-1-2-testar-com-copilot.md)
3. [Analisar e iterar para AGENTS.md v2](tarefas/tarefa-2-1-3-analisar-iterar.md)
