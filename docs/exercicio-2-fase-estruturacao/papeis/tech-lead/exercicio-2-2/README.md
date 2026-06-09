# Exercício 2.2 — Arquitetura de MCP para o projeto

## Contexto
Você precisa definir a arquitetura de MCP do projeto: quais servers, quais permissões, como monitorar, e como o time é notificado de mudanças.

## Ferramentas a utilizar
- Claude (chat)
- GitHub Copilot

## Inputs fornecidos
- O cenário completo
- O mapeamento de MCP do desenvolvedor (simulado):
  - GitHub — read code, create PR
  - Azure AI Search — read index, query
  - Azure OpenAI — completion API
  - Confluence NovaTech — read pages
  - Azure DevOps — read/write work items
  
- Conceito de MCP architecture:
  *"MCP servers devem ser gerenciados como infraestrutura: versionados, monitorados, com permissões mínimas. O Tech Lead decide quais servers são autorizados e quais tools cada server expõe."*

## Entregável
- Documento de arquitetura de MCP
- Script de health check gerado com Copilot (funcional)
- Plano de contingência para indisponibilidade de MCP servers

## Critérios de avaliação
- A arquitetura trata MCP servers como infraestrutura gerenciada (não como configuração ad-hoc)
- A política de aprovação equilibra agilidade com segurança
- O script de health check é funcional e demonstra uso efetivo do Copilot
- O plano de contingência é realista (agente degradado é melhor que agente quebrado)

## Tarefas

1. [Produzir documento de arquitetura de MCP](tarefas/tarefa-2-2-1-arquitetura-mcp.md)
2. [Criar script de health check com Copilot](tarefas/tarefa-2-2-2-health-check.md)
3. [Definir plano de contingência](tarefas/tarefa-2-2-3-contingencia.md)
