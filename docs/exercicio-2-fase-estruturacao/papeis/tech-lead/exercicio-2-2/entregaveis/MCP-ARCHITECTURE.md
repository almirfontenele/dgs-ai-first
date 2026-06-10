# MCP-ARCHITECTURE.md — Arquitetura de MCP Servers

**Versão:** 1.0  
**Data:** 2026-06-10  
**Responsável:** Tech Lead  
**Projeto:** NovaTech — Assistente de Suporte Logístico  
**Referências:** `docs/anexos/anexo-c-estrutura-repositorio.md`, `mcp-permissions-matrix.md`, `AGENTS.md`

---

## 1. Visão Geral

Os MCP servers são tratados como **infraestrutura gerenciada**, não como configuração ad-hoc. Cada server adicionado passa por processo de aprovação, tem monitoramento definido, versioning controlado e plano de contingência documentado em `MCP-CONTINGENCY.md`.

### Diagrama de servers e conexões

```
                        ┌─────────────────────────────┐
                        │     Agentes e Consumidores   │
                        └──────────────┬──────────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          │                            │                            │
    ┌─────▼─────┐               ┌──────▼──────┐            ┌───────▼──────┐
    │ Developer  │               │  Tech Lead  │            │  Agente IA   │
    │  (humano) │               │  (humano)   │            │  (runtime)   │
    └─────┬─────┘               └──────┬──────┘            └───────┬──────┘
          │                            │                            │
          └────────────────────────────┼────────────────────────────┘
                                       │
                         ┌─────────────▼─────────────┐
                         │      MCP Client Layer       │
                         │  (Claude Code / Copilot)    │
                         └─────────────┬───────────────┘
                                       │
     ┌───────────┬───────────┬─────────┼──────────┬───────────────┐
     │           │           │         │          │               │
┌────▼────┐ ┌───▼────┐ ┌────▼────┐ ┌──▼───────┐ ┌▼──────────┐ ┌─▼──────────┐
│ github  │ │  file  │ │ azure   │ │  azure   │ │  azure    │ │ confluence │
│  MCP   │ │ system │ │AiSearch │ │ OpenAI   │ │ DevOps    │ │   MCP      │
│(público)│ │  MCP   │ │(custom) │ │ (custom) │ │ (custom)  │ │ (custom)   │
└─────────┘ └────────┘ └─────────┘ └──────────┘ └───────────┘ └────────────┘
     │           │           │           │              │              │
  GitHub      Local       Azure AI    Azure OpenAI  Azure DevOps  Confluence
  API         FS          Search API   API          REST API      REST API
```

---

## 2. Inventário de MCP Servers

| Server | Criticidade | Quem consome | Tools principais | Público/Custom |
|--------|-----------|--------------|-----------------|----------------|
| `github` | Essential | Developer, Tech Lead, Agente CI | `read_file`, `list_branches`, `create_pull_request`, `create_issue` | Público (server existente) |
| `filesystem` | Essential | Developer, Tech Lead, Agente docs | `read_file`, `list_directory` (caminhos do projeto) | Público (server existente) |
| `azureAiSearch` | Important | Agente IA (runtime), Developer, QA | `search_semantic`, `get_document`, `read_index_schema` | Custom (específico do projeto) |
| `azureOpenAI` | Essential | Agente IA (runtime), Developer | `generate_completion`, `generate_embedding` | Custom (específico do projeto) |
| `azureDevOps` | Important | Tech Lead, Product Specialist, Developer | `read_work_items`, `read_board`, `create_work_item` | Custom (específico do projeto) |
| `confluence` | Nice-to-have | Product Specialist, Developer, Agente IA | `search_pages`, `read_page` | Custom (específico do projeto) |

### Matriz de permissões resumida

| Server | Developer | Tech Lead | QA | Product Specialist | Agente IA |
|--------|-----------|-----------|----|--------------------|-----------|
| github | read + PR + branch | read + approve PR | read + issue | read | read only |
| filesystem | ./src, ./docs, ./skills | ./src, ./docs, ./skills | ./docs, ./tests | ./docs, ./specs | ./docs, ./prompts, ./skills |
| azureAiSearch | search + read schema | search + list indexes | search | — | search + get doc |
| azureOpenAI | completion + embedding | completion + embedding + list deployments | completion | — | completion + embedding |
| azureDevOps | read + update status | read + create + update | read + create issue | read + create + update | read only |
| confluence | read | read | read | read | read (max 10 results, rate limit 5/min) |

**Permissões globalmente negadas:**
- `delete_repository`, `force_push`, `manage_webhooks`, `read_secrets` (GitHub)
- `create_index`, `delete_index`, `upsert_document`, `delete_document` (Azure AI Search)
- `fine_tune`, `create_deployment`, `delete_deployment` (Azure OpenAI)
- `delete_work_item`, `manage_area_path`, `access_org_settings` (Azure DevOps)
- `create_page`, `edit_page`, `delete_page`, `manage_space` (Confluence)

---

## 3. Política de Aprovação

### Como um novo MCP server é adicionado ao projeto?

#### Processo de aprovação

```
Developer/QA identifica necessidade
         │
         ▼
1. Abre issue "MCP Server Proposal: [nome]"
   com template preenchido (ver abaixo)
         │
         ▼
2. Tech Lead avalia em até 3 dias úteis
   ├── Aprova → Server adicionado ao mcp.json + permissões definidas
   └── Rejeita → Justificativa documentada na issue
         │
         ▼
3. Se aprovado: Developer implementa configuração
   + Tech Lead faz code review da configuração MCP
         │
         ▼
4. Deploy em staging primeiro (mínimo 1 sprint)
   antes de produção
```

#### Template de proposta (issue)

```markdown
## MCP Server Proposal

**Server proposto:** [nome]
**Requestante:** [nome]
**Justificativa:** Por que precisamos desse server?
**Alternativas consideradas:** Por que não usar algo já existente?

**Segurança:**
- Quais dados esse server acessa?
- Quais permissões mínimas necessárias?
- Tem algum dado sensível (PII, financeiro, secrets)?

**Monitoramento:**
- Como saberemos se o server parou de funcionar?
- Quais métricas rastrear?

**Versioning:**
- Esse server tem versionamento semântico?
- Como atualizações serão testadas antes do deploy?
```

#### Critérios de aprovação (Tech Lead avalia todos)

- [ ] Necessidade genuína: não existe server público ou capacidade existente que atenda?
- [ ] Least privilege: permissões mínimas definidas, sem escopos excessivos?
- [ ] Sem secrets em configuração: credenciais via Key Vault ou variáveis de ambiente?
- [ ] Monitoramento definido: tem health check e alertas planejados?
- [ ] Versioning controlado: tem política de backward compatibility?
- [ ] Plano de contingência: o que acontece se esse server ficar indisponível?

**SLA de aprovação:** 3 dias úteis para decisão inicial. Em caso de urgência documentada, 1 dia útil.

---

## 4. Monitoramento

### Métricas rastreadas por server

| Server | Métrica | Threshold de alerta | Severidade |
|--------|---------|--------------------|-----------:|
| github | Latência P95 | > 2s | Warning |
| github | Taxa de erro HTTP | > 5% em 5min | Critical |
| azureAiSearch | Latência P95 de query semântica | > 500ms | Warning |
| azureAiSearch | Taxa de erro | > 2% em 5min | Critical |
| azureOpenAI | Latência P95 de completion | > 8s | Warning |
| azureOpenAI | Taxa de erro / throttling | > 1% em 5min | Critical |
| azureDevOps | Latência P95 | > 3s | Warning |
| confluence | Latência P95 | > 2s | Info |

### Ferramenta de monitoramento

- **Azure Monitor + Application Insights:** métricas de latência, taxa de erro, uptime
- **Script de health check:** `scripts/health-check.js` — executa verificação ativa a cada 5 minutos em produção

### Alertas e responsabilidades

| Severidade | Canal | Responsável | SLA de resposta |
|-----------|-------|-------------|----------------|
| Critical | PagerDuty + Slack #incidents | Tech Lead (on-call) | 15 minutos |
| Warning | Slack #tech-alerts | Developer de plantão | 2 horas |
| Info | Dashboard Azure Monitor | Qualquer membro | Próximo dia útil |

### O que monitorar além de latência

- **Dados incorretos:** QA executa smoke tests semanais com queries de referência cujo resultado esperado é conhecido. Divergência → alerta manual.
- **Rate limits atingidos:** Confluence tem rate limit de 5 req/min por agente. Azure Monitor alarme quando taxa de 429 > 0 por 5min consecutivos.
- **Tokens consumidos (Azure OpenAI):** alerta quando consumo mensal > 80% do limite contratado.

---

## 5. Versionamento

### Estratégia geral

**Semantic versioning** para todos os MCP servers customizados do projeto:
- `MAJOR.MINOR.PATCH` (ex: `1.2.3`)
- MAJOR: breaking change (tool removida, parâmetro obrigatório adicionado, auth alterada)
- MINOR: adição de nova tool ou resource sem quebrar existentes
- PATCH: correção de bug, melhoria de performance sem mudança de interface

### Backward compatibility

**Regra:** Mudanças MAJOR em servers customizados requerem:
1. Versão anterior mantida por **1 sprint (2 semanas)** após nova versão em produção
2. Migration guide documentado na PR de mudança
3. Todos os consumidores atualizados antes do deprecation da versão anterior

### Como testar mudanças antes do deploy

```
Staging environment
  ├── Mesmo mcp.json que produção
  ├── Apontando para endpoints de staging dos serviços Azure
  └── Health check executado em cada deploy de staging
```

**Processo obrigatório:**
1. Server novo/alterado vai para staging
2. Developer executa `node scripts/health-check.js --env=staging`
3. QA executa smoke tests em staging
4. Após 1 sprint em staging sem incidentes → promoção para produção

### Arquivo de configuração

Configuração MCP vive em `.mcp/mcp.json` (referência: `docs/anexos/anexo-c-estrutura-repositorio.md`).

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "./docs", "./specs", "./prompts", "./skills", "./src", "./tests"],
      "env": {}
    },
    "azureAiSearch": {
      "command": "node",
      "args": ["./mcp-servers/azure-ai-search/dist/index.js"],
      "env": {
        "AZURE_SEARCH_ENDPOINT": "${AZURE_SEARCH_ENDPOINT}",
        "AZURE_SEARCH_KEY": "${AZURE_SEARCH_QUERY_KEY}"
      }
    },
    "azureOpenAI": {
      "command": "node",
      "args": ["./mcp-servers/azure-openai/dist/index.js"],
      "env": {
        "AZURE_OPENAI_ENDPOINT": "${AZURE_OPENAI_ENDPOINT}",
        "AZURE_OPENAI_API_KEY": "${AZURE_OPENAI_KEY}"
      }
    },
    "azureDevOps": {
      "command": "node",
      "args": ["./mcp-servers/azure-devops/dist/index.js"],
      "env": {
        "AZURE_DEVOPS_ORG_URL": "${AZURE_DEVOPS_ORG_URL}",
        "AZURE_DEVOPS_PAT": "${AZURE_DEVOPS_PAT}"
      }
    },
    "confluence": {
      "command": "node",
      "args": ["./mcp-servers/confluence/dist/index.js"],
      "env": {
        "CONFLUENCE_BASE_URL": "${CONFLUENCE_BASE_URL}",
        "CONFLUENCE_TOKEN": "${CONFLUENCE_TOKEN}",
        "CONFLUENCE_ALLOWED_SPACES": "NOVATECH-DOC"
      }
    }
  }
}
```

> **Nunca commite credentials no `.mcp/mcp.json`.** Use sempre `${VAR}` referenciando variáveis de ambiente. Secrets ficam no Azure Key Vault ou no `.env.local` (que está no `.gitignore`).

---

## 6. Gaps Conhecidos e Roadmap

| Gap | Status | Responsável | Sprint |
|-----|--------|-------------|--------|
| Monitoring automático de dados incorretos (além de latência) | Planejado | QA + Tech Lead | Sprint 3 |
| Dashboard unificado de saúde de todos os servers | Planejado | DevOps | Sprint 3 |
| Testes automatizados de contrato (contract testing) para servers custom | Futuro | Developer | Sprint 4 |
| Multi-region fallback para azureOpenAI | Futuro | Tech Lead | Sprint 5 |

---

## Processo com Copilot

**Prompt inicial:** "Crie um documento de arquitetura MCP com diagrama ASCII, política de aprovação, monitoramento e versionamento para um projeto de assistente logístico com 6 MCP servers: github, filesystem, azureAiSearch, azureOpenAI, azureDevOps, confluence."

**Output gerado:** O Copilot gerou estrutura básica com diagrama de conexões e tabela de servers. A política de aprovação foi tratada como "owner decide" sem processo formal. Monitoramento apenas listou métricas sem thresholds ou responsáveis.

**O que foi mantido:** Estrutura de seções (diagrama, inventário, política, monitoramento, versionamento), tabela de servers com criticidade.

**O que foi adicionado manualmente:**
- Template de proposta de novo server com critérios objetivos de aprovação
- Thresholds de alerta com severidades diferenciadas por server
- SLA de aprovação (3 dias úteis) e SLA de resposta a alertas (15min/2h/próximo dia)
- Estratégia de backward compatibility com janela de 1 sprint para migração
- Exemplo completo do mcp.json com variáveis de ambiente
- Seção de gaps conhecidos e roadmap

**Iteração:** Segundo prompt refinando a política de aprovação para incluir critérios mensuráveis (checklist de aprovação). O Copilot sugeriu 3 critérios genéricos; expandido para 6 critérios com perguntas específicas de segurança, monitoramento e versioning.
