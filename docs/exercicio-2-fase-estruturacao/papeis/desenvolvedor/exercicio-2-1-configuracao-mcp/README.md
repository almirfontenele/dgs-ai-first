# Exercício 2.1 — Configuração de MCP Servers para o Projeto

## Contexto

Antes de começar a codar, você precisa configurar os MCP servers que vão permitir aos agentes de IA acessar o repositório, a documentação do Azure e as APIs do projeto.

## Ferramentas a Utilizar

- Claude (chat)
- GitHub Copilot

## Inputs Fornecidos

### Contexto Base
- O cenário completo
- A estrutura do repositório e o exemplo mínimo de configuração MCP (ver **Anexo C**, seção "Exemplo mínimo de configuração MCP")
- A lista de ferramentas e serviços que o time usa:
  - GitHub (`db1/novatech-assistant`) — repositório do projeto
  - Azure AI Search — base vetorial de documentos
  - Azure OpenAI — modelo de geração
  - Azure DevOps — boards e tracking
  - Confluence da NovaTech — documentação de negócio (read-only)

### Conceito de MCP
*"MCP (Model Context Protocol) é o protocolo que padroniza como modelos de IA se conectam a ferramentas externas. Um MCP server expõe Tools (ações que o modelo pode executar), Resources (dados read-only que o modelo pode consultar), e Prompts (templates reutilizáveis)."*

## Tarefas

Cada tarefa está documentada em sua pasta correspondente:

1. **[Tarefa 2.1.1](tarefas/2-1-1-mapear-mcp-servers.md)** — Mapear MCP servers do projeto com Claude
2. **[Tarefa 2.1.2](tarefas/2-1-2-definir-permissoes.md)** — Definir permissões mínimas (least privilege)
3. **[Tarefa 2.1.3](tarefas/2-1-3-criar-configuracao-mcp.md)** — Criar arquivo de configuração MCP com Copilot
4. **[Tarefa 2.1.4](tarefas/2-1-4-analise-riscos-seguranca.md)** — Identificar riscos de segurança e mitigações

## Entregáveis

Ao final do exercício, você terá:
- [ ] Mapeamento de MCP servers com descrição de o que cada um expõe
- [ ] Matriz de permissões (least privilege) para cada server
- [ ] Arquivo de configuração `.mcp.json` ou equivalente sintaticamente válido
- [ ] Análise de riscos de segurança com mitigações específicas do contexto

## Critérios de Avaliação

- ✓ A arquitetura MCP é pragmática (usa servers existentes onde possível, customiza só onde necessário)
- ✓ As permissões seguem princípio de least privilege
- ✓ Os riscos de segurança são específicos ao contexto (ex: "o MCP server do Confluence expõe documentação do cliente — se um agente local do dev acessar via MCP e enviar a um modelo cloud, dados sensíveis podem vazar")
- ✓ O arquivo de configuração é sintaticamente válido e demonstra uso correto do Copilot
