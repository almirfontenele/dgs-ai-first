# Exercício 1.2 — Design de jornada com componente de IA

## Contexto

Com base no discovery, você precisa mapear a jornada do atendente usando o assistente de IA.

## Ferramentas a utilizar

- Claude (chat)
- Claude Design

## Inputs fornecidos

- O cenário completo.
- Dados do discovery (simulados): *"Os atendentes hoje abrem em média 4 fontes diferentes por chamado. As dúvidas mais comuns são sobre prazos de entrega (35%), regras de frete (25%), política de devolução (20%) e outros (20%). Em 15% dos casos, o atendente não encontra resposta e escala para o supervisor."*

## Tarefa

1. Usando o **Claude**, elabore a jornada do atendente em formato de texto estruturado, incluindo:
   - O fluxo principal: atendente recebe dúvida → consulta o assistente → recebe resposta com fonte → usa no atendimento.
   - O fluxo de fallback: o que acontece quando o assistente não tem confiança na resposta ou quando o atendente discorda.
   - O fluxo de feedback: como o atendente sinaliza que uma resposta estava errada, desatualizada ou incompleta.
   - Ao menos 2 guardrails de comportamento do assistente (ex: "nunca inventar um prazo que não esteja documentado").

2. Usando o **Claude Design**, transforme a jornada textual em um diagrama visual de fluxo que mostre os 3 caminhos (principal, fallback, feedback) de forma clara para apresentar ao time e ao cliente.

## Entregável

A jornada textual, o diagrama visual gerado pelo Claude Design, e evidência do uso das ferramentas.

## Critérios de avaliação

- A jornada inclui o caminho feliz E os caminhos de exceção.
- Os guardrails são específicos ao domínio (logística/atendimento), não genéricos.
- O fluxo de feedback mostra entendimento de que RAG precisa de manutenção contínua (feedback loop).
- O diagrama visual é coerente com o texto e legível para não-técnicos.
