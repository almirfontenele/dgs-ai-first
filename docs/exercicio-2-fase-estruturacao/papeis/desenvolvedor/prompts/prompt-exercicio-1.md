

**Inputs fornecidos:**
- O cenário completo docs/fonte-da-verdade.
- A estrutura do repositório e o exemplo mínimo de configuração MCP (ver **Anexo C** docs/anexos/anexo-c-estrutura-repositorio.md, seção "Exemplo mínimo de configuração MCP").
- A lista de ferramentas e serviços que o time usa:
  - GitHub (`db1/novatech-assistant`) — repositório do projeto.
  - Azure AI Search — base vetorial de documentos.
  - Azure OpenAI — modelo de geração.
  - Azure DevOps — boards e tracking.
  - Confluence da NovaTech — documentação de negócio (read-only).
- Conceito de MCP: *"MCP (Model Context Protocol) é o protocolo que padroniza como modelos de IA se conectam a ferramentas externas. Um MCP server expõe Tools (ações que o modelo pode executar), Resources (dados read-only que o modelo pode consultar), e Prompts (templates reutilizáveis)."*


1. mapeie quais MCP servers o projeto precisa. Para cada server, defina: o que expõe (tools, resources, prompts), quem consome (quais papéis/ferramentas), e se já existe como server público ou precisaria ser construído.

2. Para cada MCP server, defina as permissões mínimas necessárias (princípio de least privilege).

3. Usando o **GitHub Copilot**, crie o arquivo de configuração MCP (`.mcp.json` ou equivalente) para o projeto, listando os servers mapeados com suas configurações.

4. Identifique ao menos 2 riscos de segurança no uso de MCP servers neste projeto e proponha mitigações.

**Entregável:** O mapeamento de MCP servers, o arquivo de configuração gerado com o Copilot, e a análise de riscos de segurança. Gere arquivos separados para cada tarefa