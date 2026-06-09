# Tarefa 2.1.4 — Identificar Riscos de Segurança e Mitigações

## Objetivo

Identificar ao menos 2 riscos de segurança *específicos ao contexto* do projeto NovaTech (não genéricos como "credential theft"), documentar como cada risco pode ocorrer, e propor mitigações concretas.

## Contexto

Usar MCP servers introduz superfície de ataque nova:
- Agentes de IA podem acessar sistemas externos via MCP
- MCP servers precisam de credenciais (tokens, API keys)
- Dados podem vazar entre sistemas (ex: confidential docs do Confluence indo para modelo cloud)
- Servidores públicos podem ter vulnerabilidades

A tarefa é pensar *criticamente* sobre os riscos *específicos* do seu projeto, não apenas listar riscos genéricos.

Exemplo BOM:
> "Risco: O agente dev local conecta ao MCP Confluence (read-only) e busca documentação. Se ele está rodando em máquina do dev com VPN, pode expor network seguro. Además, se o agente estiver comprometido, ele pode fazer 100 requisições/segundo ao Confluence, causando DoS. Mitigation: Rate limit a 10 req/min no MCP server. Proxy via endpoint dedicado em vez de conectar direto."

Exemplo RUIM:
> "Risco: Alguém rouba o token. Mitigation: Use variável de ambiente."

## Inputs

- Mapeamento de MCP servers (Tarefa 2.1.1)
- Matriz de permissões (Tarefa 2.1.2)
- Arquivo de configuração (Tarefa 2.1.3)
- Conhecimento do contexto: NovaTech (logística), papéis (Dev, Tech Lead, QA), sistemas (GitHub, Azure, Confluence)

## Entregáveis

Um arquivo `mcp-security-analysis.md` com:

```markdown
# Análise de Riscos de Segurança — MCP Configuration

## Risco 1: Vazamento de Dados Sensíveis via Confluence

### Descrição
O MCP Confluence é configurado como read-only para acessar documentação de políticas de devolução, SLAs, etc. Porém, documentação do Confluence contém:
- Detalhes de SLA por cliente (informação competitiva)
- Políticas internas (ex: "se o cliente pagar propina, a gente não devolve")
- Dados de contato de stakeholders

Se um agente de IA (rodando localmente no dev, ou em cloud) buscar documentação via MCP e depois enviar para um modelo cloud (ex: Claude API), esses dados podem ficar em logs de modelo cloud ou serem usados para treinar o modelo.

### Por Que É Crítico Para Este Projeto
NovaTech está em compliance talk com cliente → exposição de "dados competitivos" pode violar NDA.

### Mitigação Proposta
1. **MCP Confluence lista apenas docs públicas:** Revise cada documento; se tiver "confidencial" ou PII, exclua do índice.
2. **Rate limit agressivo:** 5 requisições por minuto máximo. Isso detecta loops de agente.
3. **Audit log completo:** Todo acesso via MCP Confluence é registrado (timestamp, user, query, results).
4. **Máximo 10 documentos retornados:** Se agente faz query genérica, não retorna tudo.

### Checklist de Implementação
- [ ] Confluence docs auditados; sensíveis movidas ou marcadas "MCP-exclude"
- [ ] `.mcp.json` tem `"maxResultsPerQuery": 10`
- [ ] `.mcp.json` tem `"rateLimit": { "requestsPerMinute": 5 }`
- [ ] Logs estão centralizados (Azure Monitor ou similar)

---

## Risco 2: Roubo de Azure API Key via MCP GitHub

### Descrição
O MCP GitHub é configurado para dev create_pr (para automação de tasks). O MCP precisa de um GitHub token (`GITHUB_TOKEN` env var). Se um dev clona o repositório e roda um script malicioso (ex: um npm package comprometido), ele pode extrair `GITHUB_TOKEN` e usá-lo para criar PRs no repositório de produção, fazer push direto, etc.

O token é armazenado em `.env` ou em memory do agente. Se a máquina do dev for comprometida (vírus, rootkit), o token vaza.

### Por Que É Crítico Para Este Projeto
NovaTech usa GitOps (ou planeja usar): código em main é deployado automaticamente. Um token roubado permite injetar código malicioso direto em main.

### Mitigação Proposta
1. **Use GitHub deploy keys em vez de personal token:** Deploy keys têm escopo a um repositório e podem ser read-only.
2. **Rotate tokens frequentemente:** Cada dev recebe um token que expira em 30 dias.
3. **Restrict PR permissions:** Mesmo que o token tenha acesso a criar PR, não deve ter permissão para merge em main ou delete branches.
4. **Audit GitHub access:** Azure DevOps ou GitHub Enterprise pode registrar quem fez merge.

### Checklist de Implementação
- [ ] GitHub token trocado por deploy key (ou restrito a read_file + create_pr)
- [ ] Token rotated a cada 30 dias
- [ ] GitHub webhook ou audit log ativado
- [ ] `.mcp.json` tem `"permissions": { "delete_branch": false, "merge_pr": false }`

---

## Risco 3: [Seu terceiro risco — identificar e documentar similar aos acima]

[...]

---

## Resumo

| Risco | Severidade | Probabilidade | Impacto | Mitigação Principal |
|-------|------------|---------------|--------|-------------------|
| Vazamento Confluence | Alta | Média | Violação de NDA | Audit log + rate limit + lista branca de docs |
| GitHub token roubo | Alta | Baixa | Injeção de código | Deploy key + rotação 30d + audit |
| [Risco 3] | [X] | [X] | [X] | [X] |

---

## Próximos Passos

1. Documentar cada risco no seu repositório (ex: `docs/security/mcp-risks.md`)
2. Criar issues no GitHub/Azure DevOps para implementar mitigações
3. Revisar com Tech Lead antes de ativar MCP servers em produção
```

## Critérios de Aceite

- [ ] Mínimo 2 riscos identificados (aceitável até 3-4)
- [ ] Cada risco é **específico ao contexto** (ex: não é genérico "tokens podem ser roubados", é "se um npm package for comprometido, ele extrai GITHUB_TOKEN e compromete main porque usamos GitOps")
- [ ] Cada risco documenta como ele pode ocorrer (attack path)
- [ ] Cada risco tem impacto claro (ex: "violar NDA", "injetar código em produção")
- [ ] Cada risco tem mitigação concreta e testável (não é vago como "use firewall")
- [ ] Mitigações são *proporcionais* ao risco (não é overkill como "desativar internet" para evitar vazamento)

## Passo a Passo

### Passo 1: Brainstorm riscos com Claude
Abra um chat e descreva:

> "Estou configurando MCP servers para um projeto de assistente de logística (NovaTech). Os servers são:
> - GitHub (token-based)
> - Azure AI Search (api-key)
> - Confluence (read-only)
> - Azure OpenAI (api-key)
> - Azure DevOps (pat-token)
>
> A arquitetura é:
> - Agentes rodam localmente em máquinas dos devs
> - Eventualmente agentes podem ser deployados em cloud (Azure Container Apps)
> - O repositório usa GitOps (código em main é deployado automaticamente)
>
> Quais são os 3-5 riscos de segurança mais críticos desta configuração?"

Claude deve sugerir coisas como:
- Vazamento de credenciais
- Agente local comprometido extraindo tokens
- Dados sensíveis do Confluence indo para cloud
- Falta de auditoria
- Rate limiting para DoS

### Passo 2: Aprofundar cada risco
Para cada risco sugerido, peça:

> "Detalhe o risco de [vazamento de credenciais]. Como especificamente isso aconteceria neste projeto? Qual é a sequência de eventos?"

Claude deve descrever:
- Como um atacante extrai o token (npm compromise, malware, etc)
- O que ele consegue fazer com o token (criar PR, push a main, deletar branches)
- Qual é o impacto (código malicioso em produção)

### Passo 3: Propor mitigações específicas
Para cada risco, peça:

> "Quais mitigações específicas reduzem o risco de [risco]? Prefira mitigações que são práticas (não overkill) e integráveis com nossa stack (GitHub, Azure)."

Claude deve sugerir:
- Usar GitHub deploy keys em vez de personal token
- Rotate tokens a cada 30 dias
- Audit logging
- Rate limits
- Secrets management (Azure Key Vault)

### Passo 4: Documentar como `.md`
Estruture como:

```
## Risco X: [Título]

### Descrição
[Como e por que ocorre]

### Por Que É Crítico Para Este Projeto
[Impacto específico — NDA violation? Code injection? Data loss?]

### Mitigação Proposta
[Passos concretos]

### Checklist de Implementação
[Como validar que está feito]
```

### Passo 5: Validar com Tech Lead
Antes de finalizar, revise com mentalidade de Tech Lead:
- "Esta mitigação é prática?" (não é overkill?)
- "Cobre o ataque principal?"
- "Há edge cases que esta mitigação não cobre?"
- "Quanto tempo leva para implementar?"

## Dicas

- **Pense em "supply chain attacks":** Se um npm package que você depende é comprometido, ele pode roubar env vars. Rate limit no MCP + deploy key (não personal token) reduz impacto.

- **Audit logging é essencial:** Se você detectar um risco depois, logs ajudam a determinar o que foi acessado e por quanto tempo.

- **Não confunda risco com mitigação:** "Tokens podem ser roubados" é verdade, mas não é um risco específico. "Um npm package pode extrair GITHUB_TOKEN do env e usar para injetar código em main porque temos GitOps" é um risco específico.

- **Proporção importa:** Se a probabilidade de um risco é 1%, não invista 100 horas em mitigação. Mas se é 30%, vale investir.

## Referências

- [OWASP: Credential Management](https://owasp.org/www-community/attacks/Credential_stuffing)
- [GitHub: Securing your personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [Azure: Key Vault best practices](https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices)
- Mapeamento de MCP servers (Tarefa 2.1.1)
- Matriz de permissões (Tarefa 2.1.2)
