# Tarefa 2.2.3 — Definir plano de contingência

## Objetivo
Estabelecer o que acontece quando um MCP server fica indisponível durante o desenvolvimento, garantindo degradação graciosa.

## Descrição
Defina e documente um plano realista que equilibra confiabilidade com pragmatismo: agente degradado (com menos funcionalidades) é sempre melhor que agente completamente quebrado.

## Requisitos

### Conteúdo obrigatório

#### 1. Matriz de criticidade vs. ação
Para cada MCP server, defina:

| Server | Criticidade | Timeout | Ação se down | Fallback |
|--------|-----------|---------|--------------|----------|
| GitHub | Essential | 5s | Bloqueia PR creation, usa cache | Ler último PR da sessão |
| Azure AI Search | Important | 3s | Consulta falham, sem RAG | Busca em memory ou none |
| Azure OpenAI | Essential | 10s | Agente não consegue gerar, falha | Manual intervention |
| Confluence | Nice | 2s | Sem docs adicionais | Use cache ou skip |
| Azure DevOps | Important | 5s | Sem acesso a work items | Ler do git tags |

#### 2. Estratégias de fallback
- **Cache**: dados do último sucesso podem ser reutilizados?
- **Reduced mode**: agente continua com funcionalidade limitada?
- **User notification**: como o usuário sabe que algo está degradado?
- **Manual override**: humano consegue force-push mesmo se server está down?

#### 3. Recuperação
- Como o agente volta ao modo normal quando server volta?
- Precisa de reinicialização ou auto-recovery?
- Há dados para sincronizar/catching up?

#### 4. Alertas e escalação
- Tech Lead é notificado de outage?
- SLA: quanto tempo aguarda antes de escalar?
- Quem é responsável por restaurar?

## Saída esperada
- Arquivo `MCP-CONTINGENCY.md` com:
  - Matriz de criticidade vs ação (tabela acima)
  - Para cada server: ações específicas se down
  - Procedimento de recuperação
  - Responsabilidades (quem faz o quê)
- Diagrama de decisão (flowchart) do que acontece quando server falha

## Exemplo de seção para um server

```markdown
### GitHub Server Down

**Criticidade:** Essential

**Detecção:** health-check.js falha em conectar

**Ação imediata:**
1. Copilot detecta timeout
2. Para todas as operações que precisam GitHub (PR creation, code push)
3. User é notificado: "GitHub is unreachable. Waiting for recovery..."

**Fallback:**
- Posso gerar código, mas não consigo fazer push
- Gero código em arquivo local
- User pode fazer push manual após GitHub voltar

**Recuperação:**
- health-check detecta GitHub online
- Próximo agente request tenta novamente
- User pode forçar retry com comando

**Escalação:**
- Após 5min offline → notificar Tech Lead
- Após 30min offline → página DevOps on-call
```

## Critério de sucesso
- Plano é realista e pragmático (aceita degradação, não quer perfection)
- Cada scenario tem ação clara
- Responsabilidades são definidas
- User experience é considerada (como notificar usuário?)

## Notas
- Este plano será incorporado no AGENTS.md e código do agente
- Teste durante exercício é manual (configurar mock server down)
