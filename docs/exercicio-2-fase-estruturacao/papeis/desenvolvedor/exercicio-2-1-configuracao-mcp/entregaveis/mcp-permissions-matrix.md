# Matriz de Permissões MCP — NovaTech Logistics Assistant

**Desenvolvedor:** Almir Oliveira  
**Data:** 2026-06-09  
**Projeto:** NovaTech — Assistente de Suporte Logístico

---

## Visão Geral

| Papel | # Servers que acessa | Permissões concedidas | Nível de acesso |
|-------|---------------------|----------------------|----------------|
| Developer | 4 (GitHub, Filesystem, Azure AI Search, Azure OpenAI) | Leitura, busca, geração | Médio |
| Tech Lead | 5 (todos exceto Confluence diretamente) | Leitura, validação, admin limitado | Médio-alto |
| QA | 3 (GitHub, Azure AI Search, Confluence) | Somente leitura e busca | Baixo |
| Product Specialist | 3 (Confluence, Azure DevOps, GitHub read) | Leitura de documentação e boards | Baixo |
| Delivery Manager | 2 (Azure DevOps, GitHub read) | Somente leitura | Muito baixo |
| Agente de IA (Runtime) | 3 (Azure AI Search, Azure OpenAI, Confluence) | Busca, geração, leitura doc | Restrito |

---

## MCP Server: GitHub Repository

| Papel | Permissões Necessárias | Justificativa |
|-------|------------------------|---------------|
| Developer | `read_file`, `list_branches`, `create_branch`, `create_pull_request`, `create_issue` | Precisa ler código, criar branches para features, abrir PRs e reportar bugs |
| Tech Lead | `read_file`, `list_branches`, `approve_pull_request`, `delete_branch`, `create_issue` | Code review, aprovação de PRs, limpeza de branches obsoletas |
| QA | `read_file`, `create_issue` | Leitura de código para entender comportamento; criar issues para bugs encontrados |
| Product Specialist | `read_file` | Consultar documentação técnica no repositório |
| Delivery Manager | `read_file` | Visualizar status de PRs e histórico de entregas |
| Agente de IA | `read_file`, `list_branches` | Agente de análise de código deve apenas ler; nunca escrever |

**Permissões explicitamente negadas a todos:** `delete_repository`, `force_push`, `manage_webhooks`, `read_secrets`

---

## MCP Server: Filesystem (Workspace Local)

| Papel | Diretórios Permitidos | Permissões | Justificativa |
|-------|----------------------|-----------|---------------|
| Developer | `./docs`, `./specs`, `./prompts`, `./skills`, `./src`, `./tests`, `./infra`, `./.mcp` | Read | Precisa de acesso ao projeto para implementação e referência |
| Tech Lead | `./docs`, `./specs`, `./prompts`, `./skills`, `./src`, `./tests`, `./infra`, `./.mcp` | Read | Revisão de código e documentação |
| QA | `./docs`, `./specs`, `./tests` | Read | Apenas documentação e testes; sem acesso a código fonte e infraestrutura |
| Product Specialist | `./docs`, `./specs` | Read | Apenas documentação e especificações de produto |
| Delivery Manager | `./docs` | Read | Apenas documentação geral do projeto |
| Agente de IA | `./docs`, `./prompts`, `./skills` | Read | Agente não deve ler código fonte nem infraestrutura |

**Exclusões globais (nenhum papel acessa via MCP):** `~`, `~/.ssh`, `~/.aws`, `~/.azure`, `.env`, `.env.*`, `*.key`, `*.pem`, `/etc`, `/var`

---

## MCP Server: Azure AI Search

| Papel | Permissões Necessárias | Justificativa |
|-------|------------------------|---------------|
| Developer | `search_semantic`, `read_index_schema`, `get_document` | Implementar e debugar pipeline de RAG |
| Tech Lead | `search_semantic`, `read_index_schema`, `get_document`, `list_indexes` | Validar pipeline e diagnosticar problemas de relevância |
| QA | `search_semantic`, `get_document` | Testar relevância de resultados e casos de borda |
| Product Specialist | — | Não acessa diretamente; usa interface do assistente |
| Delivery Manager | — | Não aplicável |
| Agente de IA (Runtime) | `search_semantic`, `get_document` | Busca de chunks relevantes no pipeline de query |

**Permissões explicitamente negadas:** `create_index`, `delete_index`, `upsert_document`, `delete_document`, `manage_synonyms`

---

## MCP Server: Azure OpenAI

| Papel | Permissões Necessárias | Justificativa |
|-------|------------------------|---------------|
| Developer | `generate_completion`, `generate_embedding` | Testar chamadas ao modelo durante desenvolvimento |
| Tech Lead | `generate_completion`, `generate_embedding`, `list_deployments` | Validar comportamento do modelo e gerenciar deployments |
| QA | `generate_completion` | Testes de comportamento do assistente (sem gerar embeddings) |
| Product Specialist | — | Acessa o assistente via interface, não via MCP direto |
| Delivery Manager | — | Não aplicável |
| Agente de IA (Runtime) | `generate_completion`, `generate_embedding` | Geração de embeddings e respostas no pipeline |

**Permissões explicitamente negadas:** `fine_tune`, `create_deployment`, `delete_deployment`, `access_other_resources`

---

## MCP Server: Azure DevOps

| Papel | Permissões Necessárias | Justificativa |
|-------|------------------------|---------------|
| Developer | `read_work_items`, `read_board`, `update_work_item_status` | Acompanhar e atualizar status de tasks em andamento |
| Tech Lead | `read_work_items`, `read_board`, `create_work_item`, `update_work_item_status` | Criar e gerenciar work items, planejar sprints |
| QA | `read_work_items`, `create_work_item` | Leitura do board e criação de bugs/defeitos |
| Product Specialist | `read_work_items`, `read_board`, `create_work_item`, `update_work_item_status` | Gerenciar backlog e prioridades |
| Delivery Manager | `read_work_items`, `read_board` | Acompanhar progresso sem modificar |
| Agente de IA | `read_work_items` | Agente de tracking pode apenas consultar, nunca criar ou modificar |

**Permissões explicitamente negadas a agentes:** `delete_work_item`, `manage_area_path`, `manage_iteration`, `access_org_settings`

---

## MCP Server: Confluence

| Papel | Permissões Necessárias | Justificativa |
|-------|------------------------|---------------|
| Developer | `search_pages`, `read_page` | Consultar documentação de negócio durante implementação |
| Tech Lead | `search_pages`, `read_page` | Consultar regras de negócio e políticas para validação técnica |
| QA | `search_pages`, `read_page` | Entender regras de negócio para definir cenários de teste |
| Product Specialist | `search_pages`, `read_page` | Principal consumidor da documentação de negócio |
| Delivery Manager | `search_pages`, `read_page` | Consultar documentação de contexto |
| Agente de IA (Runtime) | `search_pages`, `read_page` | Recuperar documentação de políticas para contexto do prompt |

**Permissões explicitamente negadas a todos os papéis e agentes:** `create_page`, `edit_page`, `delete_page`, `manage_space`, `access_user_data`

**Restrições adicionais para agentes:**
- `maxResultsPerQuery: 10` — impede coleta massiva de documentação
- `allowedSpaces: ["NOVATECH-DOC"]` — apenas espaço do projeto
- Rate limit: 5 req/min por agente

---

## Processo com Copilot

**Prompt inicial:** "Crie uma matriz de permissões MCP por papel (Developer, Tech Lead, QA, Product Specialist, Delivery Manager, Agente de IA) para os servers GitHub, Filesystem, Azure AI Search, Azure OpenAI, Azure DevOps e Confluence. Para cada célula indique as permissões necessárias e a justificativa."

**Output gerado:** O Copilot gerou uma tabela com os papéis e servers, mas com permissões binárias ("acesso" / "sem acesso") e sem distinção entre tools individuais. O Agente de IA foi tratado como Developer, recebendo as mesmas permissões.

**O que foi descartado:** Permissões binárias — substituídas por tools individuais (ex: `search_semantic`, `read_index_schema`, `get_document`) derivadas da análise do que cada papel realmente precisa fazer.

**O que foi adicionado manualmente:**
- Coluna separada para Agente de IA (runtime) com escopo mais restrito que qualquer papel humano
- Permissões explicitamente negadas por server (seções `Permissões explicitamente negadas`)
- Restrições adicionais para agentes no Confluence (`maxResultsPerQuery: 10`, rate limit, `allowedSpaces`)
- Tabela de Permissões Globais Cross-Server (secrets, PII, logs)

**Iteração:** Após a versão inicial, um prompt pediu ao Copilot para revisar o Agente de IA no Azure DevOps e justificar por que não deveria criar work items. O output destacou o risco de agentes criarem itens maliciosos ou errados automaticamente — argumento incorporado na justificativa da linha correspondente.

## Permissões Globais (Cross-Server)

| Recurso | Quem Pode Acessar | Política | Razão |
|---------|------------------|---------|-------|
| API Keys / Tokens | Nenhum papel via MCP | Env vars ou Key Vault | Secrets nunca transitam pelo MCP |
| Dados PII de usuários | Nenhum papel via MCP | Bloqueado na camada de servidor | Compliance e privacidade |
| Logs de acesso | Tech Lead (via Azure Monitor) | Read-only, auditoria | Rastreabilidade |
| Configuração de servidores MCP | Tech Lead, DevOps | Fora do escopo MCP | Gerenciado via IaC |

---

## Riscos Mitigados pela Matriz

| Risco | Mitigação via Permissões |
|-------|--------------------------|
| Dev apaga índice do Azure Search | Developer não tem `delete_index`; apenas Tech Lead tem `list_indexes` |
| Agente extrai toda a documentação do Confluence | `maxResultsPerQuery: 10` + rate limit 5 req/min |
| QA edita código via GitHub MCP | QA tem apenas `read_file` e `create_issue`; sem `write_file` |
| Delivery Manager acessa código fonte | Filesystem: apenas `./docs`; sem acesso a `./src` |
| Agente cria work items maliciosos | Agente de IA tem `read_work_items` somente no Azure DevOps |
| Vazamento de secrets via filesystem | Diretórios `.env`, `~/.ssh`, `*.key` explicitamente excluídos |
