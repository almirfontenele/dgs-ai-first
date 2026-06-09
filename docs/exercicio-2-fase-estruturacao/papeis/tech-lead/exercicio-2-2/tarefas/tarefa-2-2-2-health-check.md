# Tarefa 2.2.2 — Criar script de health check com GitHub Copilot

## Objetivo
Implementar um script de health check funcional que verifica se todos os MCP servers configurados estão respondendo.

## Descrição
Usando GitHub Copilot, crie um script que:
1. Se conecta a cada MCP server listado na arquitetura
2. Executa uma operação simples (ex: health endpoint, query básica)
3. Reporta status de cada servidor
4. Falha com exit code diferente de 0 se algum server está down

## Requisitos

### Funcionalidade obrigatória
- Suporte aos 5 servers da arquitetura (GitHub, Azure AI Search, Azure OpenAI, Confluence, Azure DevOps)
- Timeouts: máximo 5s por server (não bloquear se um falhar)
- Saída clara: ✓/✗ para cada server
- Exit code: 0 se todos OK, 1+ se algum falhar
- Logging: registra timestamp, server name, status, latência

### Critérios técnicos
- Linguagem: Node.js ou Python (escolha sua preferência)
- Configuração: ambiente variables ou JSON config file
- Tratamento de erro: não lance exceção não-tratada
- Idempotente: pode rodar múltiplas vezes sem efeito colateral

### Exemplo de saída esperada
```
[13:45:00] Health Check Started
[13:45:01] ✓ GitHub (142ms)
[13:45:02] ✓ Azure AI Search (287ms)
[13:45:03] ✗ Azure OpenAI (timeout)
[13:45:04] ✓ Confluence (91ms)
[13:45:05] ✓ Azure DevOps (156ms)
[13:45:05] Status: 4/5 OK. FAILED
```

## Procedimento

### Passo 1: Preparar prompt para Copilot
Crie um prompt detalhado que inclua:
- Descrição da tarefa
- Exemplo de saída esperada
- Requisitos técnicos

### Passo 2: Usar Copilot para gerar script
1. Abra GitHub Copilot no VS Code
2. Crie arquivo `health-check.js` (ou `.py`)
3. Digite comentário com requisitos
4. Use Copilot para completar a implementação
5. Refine e teste

### Passo 3: Testar o script
1. Configure variáveis de ambiente com URLs reais (ou mocks)
2. Execute: `node health-check.js` (ou `python health-check.py`)
3. Valide saída e exit codes

## Saída esperada
- Script `health-check.js` ou `health-check.py` funcional
- Arquivo `health-check.config.json` (ou arquivo de config)
- Instruções de uso (README ou comentários no código)
- Evidence: screenshot mostrando Copilot sugerindo o código e resultado de uma execução

## Critério de sucesso
- Script é executável e produz saída clara
- Trata timeouts sem bloquear
- Pode ser integrado em CI/CD ou cron job
- Demonstra uso efetivo de Copilot (não é código 100% gerado por humano)
