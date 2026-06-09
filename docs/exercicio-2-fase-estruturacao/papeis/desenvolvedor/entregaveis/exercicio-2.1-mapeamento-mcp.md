# Entregável — Exercício 2.1: Mapeamento de MCP Servers

**Desenvolvedor:** Almir Oliveira  
**Data:** 2026-06-09  
**Projeto:** NovaTech — Assistente de Suporte Logístico  
**LLM de apoio:** GitHub Copilot

## 1. Objetivo

Mapear os MCP servers necessários para o projeto, indicando o que cada um expõe, quem consome, se já existe como server público ou se precisa ser construído, e quais permissões mínimas devem ser aplicadas.

## 2. Inventário de MCP Servers

| Server | O que expõe | Quem consome | Público ou custom? | Permissões mínimas |
|---|---|---|---|---|
| `github` | Tools para consultar repositório, branches, issues e pull requests; resources com metadados do projeto; prompts de apoio para revisão e triagem | Devs, Tech Lead, agentes de code review e automação de CI | Público, via server MCP existente | PAT com escopo mínimo de leitura no repositório; sem acesso administrativo, sem secret scanning, sem permissão de escrita por padrão |
| `filesystem` | Resources com arquivos locais do workspace; tools para listar e ler arquivos permitidos no projeto | Devs, Tech Lead, agentes de documentação e geração de prompts | Público, via server MCP existente | Acesso somente aos diretórios do projeto; sem home do usuário, sem diretórios de sistema, sem arquivos de segredo |
| `azureAiSearch` | Tools para busca semântica e leitura de chunks indexados; resources com metadados de índice e documentos recuperados; prompts para consulta guiada | Assistente de suporte, pipeline de RAG, QA e validação de respostas | Custom, server específico do projeto | Query key ou credencial equivalente com acesso somente leitura ao índice; sem permissão de criação, exclusão ou administração de índices |
| `azureOpenAI` | Tools para geração de texto e embeddings; resources com metadados de deployment; prompts para completions e embeddings controladas | Pipeline de ingestão, endpoint de query, agentes de avaliação | Custom, server específico do projeto | Chave restrita ao recurso e aos deployments necessários; apenas chat/completions e embeddings; sem fine-tuning, sem acesso a outros recursos Azure |
| `azureDevOps` | Tools para ler boards, work items e status; resources com backlog e estado dos itens; prompts para triagem e acompanhamento | Product Specialist, Tech Lead, Devs e automações de tracking | Custom, server específico do projeto | PAT com escopo mínimo para leitura de work items e boards; escrita apenas se houver fluxo explícito de atualização; sem acesso a org inteira |
| `confluence` | Tools para buscar e ler páginas; resources com documentação de negócio; prompts para sumarização e consulta | Product Specialist, Devs, Tech Lead, atendimento assistido | Custom, server específico do projeto | Acesso read-only ao espaço da NovaTech; allowlist de espaços/páginas; sem criação, edição ou exclusão |

## 3. Justificativa Arquitetural

1. Reutilizar servers públicos onde eles já cobrem bem o caso de uso reduz custo e reduz manutenção. GitHub e filesystem entram nessa categoria.
2. Criar servers customizados apenas para integrações do ecossistema NovaTech que não têm cobertura genérica suficiente, como Azure AI Search, Azure OpenAI, Azure DevOps e Confluence.
3. Separar leitura, busca e geração evita permissões amplas demais e permite aplicar least privilege por capacidade, não apenas por ferramenta.
4. Manter Confluence como read-only é obrigatório porque a documentação pode conter informação de negócio sensível e não deve ser alterada por agentes.

## 4. Permissões Mínimas por Server

### 4.1 GitHub
- Escopo de leitura no repositório `db1/novatech-assistant`.
- Acesso apenas ao que for necessário para consultar código, issues e pull requests.
- Escrita desativada por padrão.

### 4.2 Filesystem
- Allowlist de diretórios do projeto.
- Acesso apenas aos caminhos necessários para o exercício e para o desenvolvimento do projeto.
- Exclusão explícita de diretórios pessoais, caches e segredos.

### 4.3 Azure AI Search
- Query-only.
- Leitura de documentos e chunks indexados.
- Sem permissão para manipular o índice.

### 4.4 Azure OpenAI
- Somente os deployments necessários para chat e embeddings.
- Sem acesso a features adicionais não usadas pelo projeto.

### 4.5 Azure DevOps
- Leitura de boards, work items e status como padrão.
- Escrita apenas se houver automação formalizada para atualização de itens.

### 4.6 Confluence
- Somente leitura.
- Espaços e páginas restritos ao conteúdo da NovaTech relevante para o projeto.

## 5. Resultado Esperado

Esse mapeamento permite implementar o projeto com uma arquitetura MCP pragmática: servidores públicos onde possível, servidores customizados onde necessário, e permissões mínimas em todos os pontos de acesso.