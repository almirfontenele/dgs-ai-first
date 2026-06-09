# Tarefa 2.1.2 — Definir Permissões Mínimas (Least Privilege)

## Objetivo

Para cada MCP server mapeado, definir explicitamente quais permissões (actions, data access, rate limits) são necessárias e qual é o mínimo que cada papel precisa para funcionar.

## Contexto

O princípio de **least privilege** diz que cada entidade (pessoa, agente, programa) deve ter acesso ao mínimo necessário para fazer seu trabalho. Isso reduz o impacto se um MCP server for comprometido ou usar permissões incorretamente.

Exemplos:
- Um agente que só precisa *ler* documentos não deve poder *deletar* nem *modificar*.
- Um MCP server do Confluence não precisa de permissão para acessar dados de usuários; só acesso a documentos públicos do projeto.

## Inputs

- Mapeamento de MCP servers da Tarefa 2.1.1 (`mcp-servers-mapping.md`)
- Lista de papéis e suas responsabilidades (Developer, Tech Lead, QA, Delivery Manager)
- Contexto do projeto (NovaTech Logistics)

## Entregáveis

Um arquivo `mcp-permissions-matrix.md` com uma matriz de permissões:

```markdown
# Matriz de Permissões MCP — NovaTech Logistics

## MCP Server: GitHub Repository

| Papel | Permissões Necessárias | Justificativa |
|-------|------------------------|---------------|
| Developer | read_file, create_branch, create_pull_request | Precisa ler código, criar branches para features |
| Tech Lead | read_file, approve_pull_request, delete_branch | Code review e limpeza de branches obsoletas |
| QA | read_file, create_issue | Reportar bugs sem poder editar código |
| Delivery Manager | read_file | Apenas visualizar status de PRs |

## MCP Server: Azure AI Search

| Papel | Permissões Necessárias | Justificativa |
|-------|------------------------|---------------|
| Developer | search_semantic, read_index_schema | RAG pipeline precisa buscar e entender índice |
| Tech Lead | search_semantic, upsert_document, manage_index | Validar pipeline e fazer updates de emergência |
| QA | search_semantic | Testar relevância de resultados |
| Delivery Manager | search_semantic | Visualizar documentação indexada |

[... mais servers ...]

## Permissões Globais (cross-MCP)

| Recurso | Quem Pode Acessar | Rate Limit | TTL |
|---------|------------------|-----------|-----|
| API Keys | Tech Lead only | 100 req/min | 90 dias |
| Sensitive Docs (PII) | Developer, Tech Lead | 10 req/min | Read-only |
| Production Index | Tech Lead, Ops | 1000 req/min | N/A |

## Riscos Mitigados

- **Risco:** Dev pode deletar índice de produção
- **Mitigation:** Developer role tem só read + search, não manage_index

- **Risco:** Agente cloud pode acessar dados sensíveis do Confluence
- **Mitigation:** MCP Confluence expõe só documentação pública, não dados de usuários

[... mais riscos ...]
```

## Critérios de Aceite

- [ ] Matriz com todos os MCP servers × papéis (mínimo 5 servers, 4 papéis = 20+ linhas)
- [ ] Cada permissão tem justificativa clara (não só "porque sim")
- [ ] Há evidência de pensamento sobre least privilege (ex: "QA tem read mas não write")
- [ ] Identificados 3+ riscos de segurança e como a matriz os mitiga
- [ ] Considerado rate limits, TTL, e acesso a dados sensíveis

## Passo a Passo

### Passo 1: Mapear permissões para cada server
Para cada MCP server do arquivo anterior, liste:
- Todas as permissões que o server *poderia* oferecer
- Qual é a permissão *mínima* que cada papel precisa

Exemplo (GitHub):
```
Permissões possíveis: read_file, write_file, create_branch, delete_branch, create_pr, approve_pr, delete_repo
Developer precisa: read_file, create_branch, create_pr
Tech Lead precisa: read_file, approve_pr, delete_branch
QA precisa: read_file, create_issue
```

### Passo 2: Usar Claude para validar
Abra um chat e descreva:
> "Estou definindo permissões MCP para este projeto. Para o GitHub server, mapeei:
> - Developer: read_file, create_branch, create_pr
> - Tech Lead: read_file, approve_pr, delete_branch
> - QA: read_file, create_issue
>
> Há alguma permissão que falta? Alguma que deveria ser removida?"

### Passo 3: Pensar em dados sensíveis
Para cada server, pergunte:
- "Quais dados neste sistema são sensíveis?" (PSNL, business logic, API keys, etc)
- "Quem deveria ter acesso?" (Tech Lead only? Devs sim, QA não?)
- "Como garanto que o MCP server não vaza esses dados?" (Rate limit? Read-only? Audit log?)

### Passo 4: Estruturar como matriz
Converta em tabela: Servidor × Papel × Permissões × Justificativa

Inclua também:
- **Permissões globais** (API keys, rate limits, TTL)
- **Riscos mitigados** (para cada restrição, qual risco ela previne)

## Dicas

- **Read-only é seu amigo:** Se um papel só precisa *ler*, não dê permissão de *write*. Isso vale especialmente para agentes cloud.
- **Rate limits protegem de abuso:** Mesmo que um papel tenha permissão, um rate limit impede DoS acidental.
- **TTL reduz janela de risco:** Se uma API key expira em 90 dias, um vazamento é limitado a 3 meses.
- **Audit logs são essenciais:** Registre quem acessou o quê, para detectar abuso.

## Referências

- [OWASP: Least Privilege](https://owasp.org/www-community/Least_Privilege)
- Mapeamento de MCP servers (Tarefa 2.1.1)
