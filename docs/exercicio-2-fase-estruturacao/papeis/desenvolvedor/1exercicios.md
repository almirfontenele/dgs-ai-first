### DESENVOLVEDOR

#### Exercício 2.1 — Configuração de MCP servers para o projeto

**Contexto:** Antes de começar a codar, você precisa configurar os MCP servers que vão permitir aos agentes de IA acessar o repositório, a documentação do Azure e as APIs do projeto.

**Ferramentas a utilizar:** Claude (chat) + GitHub Copilot

**Inputs fornecidos:**
- O cenário completo.
- A estrutura do repositório e o exemplo mínimo de configuração MCP (ver **Anexo C**, seção "Exemplo mínimo de configuração MCP").
- A lista de ferramentas e serviços que o time usa:
  - GitHub (`db1/novatech-assistant`) — repositório do projeto.
  - Azure AI Search — base vetorial de documentos.
  - Azure OpenAI — modelo de geração.
  - Azure DevOps — boards e tracking.
  - Confluence da NovaTech — documentação de negócio (read-only).
- Conceito de MCP: *"MCP (Model Context Protocol) é o protocolo que padroniza como modelos de IA se conectam a ferramentas externas. Um MCP server expõe Tools (ações que o modelo pode executar), Resources (dados read-only que o modelo pode consultar), e Prompts (templates reutilizáveis)."*

**Tarefa:**
1. Usando o **Claude**, mapeie quais MCP servers o projeto precisa. Para cada server, defina: o que expõe (tools, resources, prompts), quem consome (quais papéis/ferramentas), e se já existe como server público ou precisaria ser construído.

2. Para cada MCP server, defina as permissões mínimas necessárias (princípio de least privilege).

3. Usando o **GitHub Copilot**, crie o arquivo de configuração MCP (`.mcp.json` ou equivalente) para o projeto, listando os servers mapeados com suas configurações.

4. Identifique ao menos 2 riscos de segurança no uso de MCP servers neste projeto e proponha mitigações.

**Entregável:** O mapeamento de MCP servers, o arquivo de configuração gerado com o Copilot, e a análise de riscos de segurança.

**Critérios de avaliação:**
- A arquitetura MCP é pragmática (usa servers existentes onde possível, customiza só onde necessário).
- As permissões seguem princípio de least privilege.
- Os riscos de segurança são específicos ao contexto (ex: "o MCP server do Confluence expõe documentação do cliente — se um agente local do dev acessar via MCP e enviar a um modelo cloud, dados sensíveis podem vazar").
- O arquivo de configuração é sintaticamente válido e demonstra uso correto do Copilot.
