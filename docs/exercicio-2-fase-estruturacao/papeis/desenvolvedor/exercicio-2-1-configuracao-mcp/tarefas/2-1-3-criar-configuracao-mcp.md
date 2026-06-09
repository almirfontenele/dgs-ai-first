# Tarefa 2.1.3 — Criar Arquivo de Configuração MCP com GitHub Copilot

## Objetivo

Usar GitHub Copilot para gerar o arquivo de configuração MCP (`.mcp.json` ou equivalente) baseado no mapeamento e na matriz de permissões criados nas tarefas anteriores.

## Contexto

Um arquivo de configuração MCP define:
- Quais servers são ativados
- Como conectar a cada server (credenciais, endpoints)
- Quais permissões cada role tem
- Timeouts, rate limits, retry policies

Exemplo mínimo de estrutura:
```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["github-mcp.js"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "GITHUB_REPO": "db1/novatech-assistant"
      },
      "permissions": {
        "read_file": true,
        "create_pr": true,
        "delete_branch": false
      }
    }
  }
}
```

## Inputs

- Mapeamento de MCP servers (Tarefa 2.1.1 — `mcp-servers-mapping.md`)
- Matriz de permissões (Tarefa 2.1.2 — `mcp-permissions-matrix.md`)
- Anexo C — Exemplo mínimo de configuração MCP do projeto
- Estrutura do repositório (onde `.mcp.json` deve ficar)

## Entregáveis

Um arquivo `.mcp.json` (ou `.mcp.config.json` se o projeto já usa outra convenção) com:

1. **Configuração de cada MCP server:**
   - Nome do server
   - Como acioná-lo (command, args)
   - Variáveis de ambiente necessárias
   - Permissões mapeadas para cada papel

2. **Validação sintática:**
   - JSON válido (sem typos)
   - Todas as permissões referem-se a servers existentes
   - Não há keys duplicadas

3. **Exemplo de uso (comentado):**
   ```json
   {
     "mcpServers": { ... },
     "_comment": "Para usar: configure env vars abaixo, depois crie agents com 'role=developer' etc"
   }
   ```

## Critérios de Aceite

- [ ] Arquivo `.mcp.json` é syntactically valid JSON
- [ ] Contém todos os 5+ servers do mapeamento anterior
- [ ] Cada server tem `command`, `args`, e `env` definidos
- [ ] Permissões refletem a matriz da Tarefa 2.1.2
- [ ] Há comentários explicando estrutura e como usar
- [ ] Arquivo pode ser parseado por um JSON parser (testado)

## Passo a Passo

### Passo 1: Preparar inputs para Copilot
Abra um novo arquivo `.mcp.json` no seu editor (VSCode com Copilot ativo).

Comece com um esqueleto:
```json
{
  "mcpServers": {
    // Servers irão aqui
  }
}
```

### Passo 2: Usar Copilot para gerar cada server
Para o primeiro server (GitHub), digite um comentário descritivo:

```
// MCP Server: GitHub Repository
// - Acesso: read_file, create_pr, create_branch
// - Consome: Developer, Tech Lead
// - Rate limit: 100 req/min (GitHub API standard)
```

Depois, posicione o cursor e peça a Copilot (Ctrl+Enter) para:
> "Complete this GitHub MCP server configuration based on the comment above. Use environment variables for secrets."

Copilot deve gerar algo como:
```json
"github": {
  "command": "node",
  "args": ["./node_modules/.bin/github-mcp"],
  "env": {
    "GITHUB_TOKEN": "${GITHUB_TOKEN}",
    "GITHUB_REPO": "db1/novatech-assistant",
    "GITHUB_BASE_URL": "https://api.github.com"
  },
  "permissions": {
    "read_file": true,
    "create_pr": true,
    "create_branch": true
  },
  "rateLimit": {
    "requestsPerMinute": 100
  }
}
```

### Passo 3: Repetir para cada server
Faça o mesmo para Azure AI Search, Azure DevOps, Confluence, etc.

Use o comentário descritivo para guiar Copilot:
```
// MCP Server: Azure AI Search
// - Acesso: search_semantic, upsert_document (tech lead only)
// - Consome: Developer, Tech Lead
// - Read-only for QA and Delivery Manager
// - Endpoint: https://${AZURE_SEARCH_SERVICE}.search.windows.net
```

### Passo 4: Validar o arquivo
Após gerar, valide:

1. **JSON syntax:** Cole o arquivo em um JSON validator online (ex: jsonlint.com)
2. **Referential integrity:** Todas as permissões referem-se a métodos que o server expõe
3. **Environment variables:** Todas as `${VAR}` têm sentido para seu projeto

### Passo 5: Adicionar documentação
Copilot pode não adicionar comentários úteis. Revise e adicione:

```json
{
  "_schemaVersion": "1.0",
  "_description": "MCP Configuration for NovaTech Logistics Assistant. Each server maps to external systems. Permissions are enforced at the MCP layer.",
  "mcpServers": { ... }
}
```

### Passo 6: Teste com um linter
Se o projeto tem eslint ou similar:
```bash
npm run lint -- .mcp.json
```

Ou manualmente com jq (se tiver):
```bash
jq . .mcp.json  # Pretty-print and validate
```

## Dicas para Trabalhar com Copilot

- **Seja específico nos comentários:** Copilot aprende com o contexto acima. Um comentário como `"// GitHub server"` não gera nada bom. Use `"// MCP Server: GitHub with read_file and create_pr permissions for Developer role"`

- **Use patterns que Copilot conhece:** Se você começar com a estrutura correta do primeiro server, Copilot costuma replicar o padrão nos próximos. Então faça o primeiro manualmente ou com ajuda.

- **Revise antes de aceitar:** Copilot pode gerar `command: "github-mcp"` quando deveria ser `"node"` + `"args": ["github-mcp.js"]`. Valide cada geração.

- **Use Copilot para iteração, não para substituição:** Se Copilot gerar `"authToken"` em vez de `"GITHUB_TOKEN"`, mude e deixe o padrão claro. Copilot vai aprender nos próximos servers.

## Validação Final

Antes de enviar, checklist:

```bash
# 1. JSON válido
jq . .mcp.json > /dev/null && echo "✓ JSON valid"

# 2. Todos os servers do mapeamento estão presentes
grep -c '"github"' .mcp.json  # Deve ser 1
grep -c '"azureSearch"' .mcp.json  # Deve ser 1
# ... etc

# 3. Nenhuma permissão inválida ou typo
# (revise manualmente a matriz vs arquivo)

# 4. Arquivo é legível e bem estruturado
cat .mcp.json | head -20  # Review primeiro trecho
```

## Referências

- Anexo C — Exemplo mínimo de configuração MCP
- [MCP Specification — Server Configuration](https://modelcontextprotocol.io/)
- GitHub Copilot: [Using GitHub Copilot in VS Code](https://docs.github.com/en/copilot/using-github-copilot/getting-started-with-github-copilot)
