# Tarefa 2.1.1 — Mapear MCP Servers do Projeto com Claude

## Objetivo

Mapear quais MCP servers o projeto precisa e definir claramente o que cada um expõe (tools, resources, prompts), quem os consome, e se já existe como server público ou precisa ser customizado.

## Contexto

Antes de criar uma configuração MCP, você precisa entender:
- Quais sistemas externos os agentes de IA vão acessar?
- Para cada sistema, o que é necessário expor (leitura de documentos, criação de issues, consulta de índices)?
- Existem servers públicos que você pode reusar, ou precisa construir customizados?

## Inputs

- Cenário completo (NovaTech Logistics Assistant)
- Lista de ferramentas/serviços que o time usa (GitHub, Azure AI Search, Azure OpenAI, Azure DevOps, Confluence)
- Papéis que vão consumir MCP servers (Developer, Tech Lead, QA, Delivery Manager)

## Entregáveis

Um arquivo `mcp-servers-mapping.md` com a seguinte estrutura:

```markdown
# Mapeamento de MCP Servers — NovaTech Logistics Assistant

## 1. MCP Server: GitHub Repository
- **Sistema:** GitHub (db1/novatech-assistant)
- **O que expõe:**
  - Tool: create_issue
  - Tool: read_file
  - Resource: repository_structure
- **Quem consome:** Developer, Tech Lead, QA
- **Status:** ❌ Precisa custom (GitHub MCP público não suporta X)
- **Razão:** [...]

## 2. MCP Server: Azure AI Search
- **Sistema:** Azure AI Search (índice de documentos)
- **O que expõe:**
  - Tool: search_semantic
  - Tool: upsert_document
  - Resource: index_schema
- **Quem consome:** Developer (durante RAG), Agentes (durante execução)
- **Status:** ✅ Server público disponível
- **Razão:** [...]

[... mais servers ...]

## Dependências entre servers
[Diagrama ou lista de quais servers dependem de quais]

## Decisões de design
- Por que expor X via MCP e não via API direto?
- Por que customizar Y em vez de usar o server público?
```

## Critérios de Aceite

- [ ] Mínimo 5 MCP servers mapeados (um para cada serviço da lista)
- [ ] Para cada server: está claro o que ele expõe (tools/resources/prompts)
- [ ] Para cada server: está claro quem o consome (papéis ou agentes específicos)
- [ ] Para cada server: documentado se é público, custom, ou hybrid
- [ ] Há evidência de pensamento crítico (ex: "GitHub MCP público não expõe branch protection rules, então precisaríamos customizar")

## Passo a Passo

### Passo 1: Brainstorm com Claude
Abra um chat com Claude e descreva:
- O projeto NovaTech Logistics Assistant
- Os sistemas que o time usa (GitHub, Azure, Confluence)
- Os papéis (Dev, Tech Lead, QA, Delivery Manager)

Peça a Claude para:
> "Mapeie quais MCP servers este projeto precisaria. Para cada um, defina:
> 1. Que ferramentas (Tools) e dados (Resources) precisa expor
> 2. Quem vai consumir (quais papéis/agentes)
> 3. Se já existe como servidor público ou precisaria ser customizado
> 
> Use este formato:
> 
> | Server | Tools | Resources | Quem Consome | Público? |
> |--------|-------|-----------|-------------|----------|
> | [...] | [...] | [...] | [...] | [...] |"

### Passo 2: Iterar e validar
Peça a Claude para:
- "Por que não usar a API do GitHub diretamente em vez de MCP?"
- "Qual é o risco de expor o MCP server do Confluence? (dados sensíveis, rate limits, etc)"
- "Se a documentação da NovaTech mudar, como o MCP server fica atualizado?"

### Passo 3: Estruturar o documento
Converta a tabela em um documento markdown com uma seção para cada server. Inclua:
- Nome do server
- Que sistemas externos conecta
- Tools que expõe (com breve descrição)
- Resources que expõe (com breve descrição)
- Quem consome (papéis/agentes específicos)
- Status (público, custom, hybrid)
- Justificativa

### Passo 4: Validar com Tech Lead
Revise com a perspectiva de um Tech Lead:
- "Esta arquitetura MCP é pragmática? Não tem unnecessary complexity?"
- "Faltou algum server? (ex: Azure DevOps para tracking de tasks)"
- "Os boundaries entre servers fazem sentido? (ex: GitHub handles code, Azure Search handles docs)"

## Dicas

- **Não confunda MCP com APIs diretas:** MCP é útil quando o agente precisa de acesso granular e contextual (ex: "buscar no índice de docs e extrair seção 3.2"). APIs diretas são melhores quando a integração é simples (ex: "chamar endpoint, retornar JSON").
- **Least privilege desde o início:** Se um server expõe demais, restrinja. Ex: "GitHub MCP expõe only repository_structure (read-only), não permite deletar ou fazer force push".
- **Customização vs. Reuso:** Prefira servidores públicos. Customize só quando o público não suporta um caso de uso crítico.

## Referências

- [MCP Specification](https://modelcontextprotocol.io/) — Documentação oficial
- Anexo C — Exemplo mínimo de configuração MCP do projeto
