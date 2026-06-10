# MCP-CONTINGENCY.md — Plano de Contingência de MCP Servers

**Versão:** 1.0  
**Data:** 2026-06-10  
**Responsável:** Tech Lead  
**Projeto:** NovaTech — Assistente de Suporte Logístico  
**Referências:** `MCP-ARCHITECTURE.md`, `scripts/health-check.js`

---

## Princípio fundamental

> **Agente degradado é sempre melhor que agente completamente quebrado.**

Quando um MCP server fica indisponível, o objetivo é manter o máximo de funcionalidade possível com recursos disponíveis, nunca parar completamente por causa de um servidor não-essencial.

---

## 1. Matriz de Criticidade e Ação

| Server | Criticidade | Timeout | Impacto se down | Ação imediata | Fallback disponível |
|--------|-----------|---------|----------------|--------------|---------------------|
| GitHub | Essential | 5s | Bloqueia criação de PRs, push de código | Para operações de escrita; modo read-only se possível | Lê últimos arquivos do cache de sessão |
| Azure OpenAI | Essential | 10s | Assistente não gera respostas; pipeline RAG para completamente | Notifica usuário; aguarda recovery | Nenhum (sem LLM não há assistente) |
| Azure AI Search | Important | 3s | Consultas sem RAG; respostas sem contexto documental | Modo sem RAG; avisa usuário de limitação | Resposta com base apenas no system prompt |
| Azure DevOps | Important | 5s | Sem acesso a work items; tracking manual | Continua sem tracking; work items via interface web | Log manual de itens |
| Confluence | Nice-to-have | 2s | Sem documentação adicional de negócio | Continua sem documentação extra | Cache da última sessão ou "documentação não disponível" |

---

## 2. Diagrama de Decisão — O que acontece quando um server falha?

```
health-check.js detecta server DOWN
         │
         ▼
  É Essential?
  ├── SIM (GitHub, Azure OpenAI)
  │         │
  │         ▼
  │   Notificar usuário imediatamente
  │   Parar operações dependentes desse server
  │   Aguardar recovery (health-check a cada 30s)
  │   Se > 5min → notificar Tech Lead via Slack #incidents
  │   Se > 30min → pagar DevOps on-call
  │
  └── NÃO
            │
            ▼
      É Important? (Azure AI Search, Azure DevOps)
      ├── SIM
      │         │
      │         ▼
      │   Entrar em modo degradado
      │   Avisar usuário de funcionalidade limitada
      │   Continuar com fallback (ver seção 3)
      │   Se > 2h → notificar Tech Lead via Slack #tech-alerts
      │
      └── NÃO (Nice-to-have: Confluence)
                │
                ▼
          Continuar normalmente
          Log de aviso no Azure Monitor
          Notificação próximo dia útil
```

---

## 3. Plano por Servidor

### 3.1 GitHub Server Down

**Criticidade:** Essential

**Detecção:** `health-check.js` timeout ou HTTP 5xx em `https://api.github.com/rate_limit`

**Ação imediata:**
1. Agente detecta falha → para operações de escrita (criação de branch, PR, push)
2. Exibe aviso ao desenvolvedor: `"GitHub unreachable. Read operations may work; write operations paused."`
3. Continua operações de leitura se a API ainda responde parcialmente

**Fallback:**
- Geração de código: continua normalmente (código gerado vai para arquivo local)
- Code review via Copilot: continua (Copilot lê arquivos locais via `filesystem` MCP)
- Push / PR: pausado — desenvolvedor faz push manual quando GitHub voltar
- Issues / PR lookup: usa cache de sessão do Copilot se disponível

**Recuperação:**
- `health-check.js` detecta GitHub online novamente
- Próxima operação de escrita tenta automaticamente
- Developer pode forçar retry com novo prompt ou restart do Copilot

**Escalação:**
- 5min offline → notificar Tech Lead: Slack `@tech-lead` em `#incidents`
- 30min offline → acionar DevOps on-call via PagerDuty

---

### 3.2 Azure OpenAI Server Down

**Criticidade:** Essential

**Detecção:** `health-check.js` timeout ou HTTP 429/5xx no endpoint de completions

**Ação imediata:**
1. Pipeline RAG não pode gerar resposta → assistente de atendimento fica indisponível
2. Exibe mensagem ao atendente: `"Assistente temporariamente indisponível. Por favor, consulte a documentação manual ou entre em contato com o suporte técnico."`
3. Registra evento no Azure Monitor com timestamp de início do outage

**Fallback:**
- Não há fallback funcional para Azure OpenAI — o assistente requer LLM
- Atendentes usam documentação manual (POL-001, PROC-042 em PDF/Confluence)
- Casos críticos são escalados diretamente ao supervisor

**Recuperação:**
- `health-check.js` detecta endpoint respondendo
- Próxima query do assistente tenta automaticamente
- Não é necessário reinicialização manual

**Escalação:**
- 5min offline → notificar Tech Lead: Slack `@tech-lead` em `#incidents`
- 15min offline → verificar Azure Status (status.azure.com) para outage regional
- 30min offline → acionar DevOps on-call + notificar gestores das equipes de atendimento

---

### 3.3 Azure AI Search Server Down

**Criticidade:** Important

**Detecção:** `health-check.js` timeout ou erro em `GET /indexes?api-version=2023-11-01`

**Ação imediata:**
1. Pipeline RAG não tem recuperação de contexto documental
2. Assistente entra em **modo degradado**: responde apenas com base no system prompt
3. Exibe aviso ao atendente: `"[MODO DEGRADADO] Busca em documentação indisponível. Respostas baseadas apenas em conhecimento geral — verifique documentação oficial para decisões críticas."`

**Fallback:**
- Assistente continua respondendo, mas sem chunks de POL-001, PROC-042, SLA-2024
- Respostas terão menor precisão para casos específicos
- Atendente é sempre avisado do modo degradado via prefixo na resposta

**Recuperação:**
- `health-check.js` detecta índice respondendo
- Pipeline RAG volta ao modo normal automaticamente na próxima query
- Nenhuma sincronização necessária (índice é read-only no runtime)

**Escalação:**
- 2h offline → notificar Tech Lead via Slack `#tech-alerts`
- 4h offline → verificar Azure AI Search service health + acionar suporte Azure se necessário

---

### 3.4 Azure DevOps Server Down

**Criticidade:** Important

**Detecção:** `health-check.js` timeout em API de work items

**Ação imediata:**
1. Tracking de work items via MCP indisponível
2. Desenvolvedores e Tech Lead sem acesso a boards via agente
3. Aviso no ambiente de desenvolvimento: `"Azure DevOps MCP unavailable. Use Azure DevOps web interface directly."`

**Fallback:**
- Equipe acessa Azure DevOps diretamente via browser (não via MCP)
- Work item updates são feitos manualmente na interface web
- Nenhum bloqueio de desenvolvimento — apenas inconveniência de workflow

**Recuperação:**
- `health-check.js` detecta API respondendo
- MCP server retoma operações normalmente na próxima chamada
- Nenhuma sincronização necessária

**Escalação:**
- 2h offline → notificar Tech Lead via Slack `#tech-alerts`
- Não paginar DevOps on-call (não é bloqueante para produção)

---

### 3.5 Confluence Server Down

**Criticidade:** Nice-to-have

**Detecção:** `health-check.js` timeout em `GET /rest/api/space`

**Ação imediata:**
1. Documentação de negócio adicional não disponível via MCP
2. Nenhum aviso ao usuário (nice-to-have)
3. Log de aviso no Azure Monitor

**Fallback:**
- Agentes usam apenas o contexto já disponível no Azure AI Search (documentação indexada)
- Equipe acessa Confluence diretamente via browser se necessário
- Cache de páginas lidas na sessão ainda disponível

**Recuperação:**
- Automático quando Confluence voltar
- Nenhuma ação necessária

**Escalação:**
- Log informativo no Azure Monitor
- Verificação no próximo dia útil se persistir

---

## 4. Procedimentos de Recuperação Gerais

### Restart manual do MCP server (servidores customizados)

```bash
# Verificar status atual
node scripts/health-check.js

# Para servidores node.js locais, verificar processo
ps aux | grep mcp-server

# Restart (se processo morreu)
node ./mcp-servers/azure-ai-search/dist/index.js &

# Verificar novamente
node scripts/health-check.js --server=azureAiSearch
```

### Forçar re-teste de servidor específico

```bash
node scripts/health-check.js --server=github
node scripts/health-check.js --server=azureOpenAI
node scripts/health-check.js --json  # Output JSON para CI
```

### Verificar logs no Azure Monitor

```
Azure Portal → Monitor → Logs → Query:
  AppRequests
  | where Name contains "mcp-health"
  | where TimeGenerated > ago(1h)
  | order by TimeGenerated desc
```

---

## 5. Responsabilidades

| Papel | Responsabilidade | Quando age |
|-------|-----------------|-----------|
| Tech Lead | Recebe alertas Critical/Warning; decide escalação | Dentro de 15min (Critical), 2h (Warning) |
| Developer (plantão) | Monitora `#tech-alerts`; faz restart de servidores customizados | Dentro de 2h (Warning) |
| DevOps on-call | Resolve outages de infraestrutura Azure; aciona suporte Azure | Quando acionado pelo Tech Lead |
| Gestores de atendimento | Informam equipes de atendimento sobre modo degradado | Quando notificados pelo Tech Lead |

---

## 6. Testes do Plano de Contingência

### Como simular outage (ambiente de desenvolvimento)

```bash
# Simular GitHub down: usar token inválido temporariamente
GITHUB_PAT=invalid node scripts/health-check.js --server=github

# Simular timeout: usar endpoint inexistente
AZURE_SEARCH_ENDPOINT=https://fake.search.example.com node scripts/health-check.js --server=azureAiSearch

# Verificar que exit code é correto
echo "Exit code: $?"  # Deve ser 1 para essential/important, 0 para nice-to-have
```

### Frequência recomendada de testes

| Teste | Frequência | Responsável |
|-------|-----------|-------------|
| health-check.js completo | A cada 5min em produção (cron job) | DevOps |
| Simulação de outage de servidor essential | 1x por mês | Tech Lead |
| Revisão do plano de contingência | A cada sprint | Tech Lead |
| Drill completo (simular outage + recovery) | 1x por trimestre | Tech Lead + DevOps |

---

## 7. Processo com Copilot

**Prompt inicial:** "Crie um plano de contingência MCP com matriz de criticidade vs. ação para 5 servers: GitHub, Azure AI Search, Azure OpenAI, Azure DevOps, Confluence. Inclua fallbacks, recuperação e escalação."

**Output gerado:** O Copilot gerou uma tabela de criticidade básica com ações como "use cache" e "notify admin" sem detalhar o que "cache" significa ou quem é "admin". O diagrama de decisão não foi sugerido.

**O que foi mantido:** Estrutura de tabela de criticidade com colunas (server, criticidade, timeout, ação, fallback) e a ideia de escalação por tempo offline.

**O que foi adicionado manualmente:**
- Princípio fundamental ("agente degradado > agente quebrado")
- Diagrama de decisão em ASCII com fluxo completo
- Plano detalhado por servidor com mensagens exatas para o usuário (o que exibir quando degradado)
- Diferenciação entre modo degradado com aviso vs parada completa
- Seção de testes do plano com comandos shell concretos
- Responsabilidades com SLA de resposta por papel

**Iteração:** Segundo prompt pedindo ao Copilot para detalhar o fallback do Azure OpenAI. Output confirmou que sem LLM não há fallback funcional — decisão de documentar explicitamente "não há fallback" para esse server foi incorporada.
