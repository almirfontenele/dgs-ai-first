# Tarefa 1.2.2 — Mapeamento de Contexto Estático/Dinâmico

## O que fazer

Analise o system prompt criado na Tarefa 1.2.1 e mapeie:
1. Quais partes são **estáticas** (iguais em toda query)
2. Quais partes são **dinâmicas** (mudam por query)
3. Tamanho estimado de cada parte em tokens

## Entender Contexto Estático vs Dinâmico

### Estático
Informações que aparecem em **toda query** e raramente mudam:
- System prompt (identidade, guardrails, formato)
- Instruções sobre como usar chunks
- Configuração do assistente

### Dinâmico
Informações que mudam a cada query:
- Chunks recuperados (diferentes para cada pergunta)
- Dados do cliente (SLA, histórico, contexto específico)
- Histórico da conversa
- Pergunta do usuário

## Mapeamento Estruturado

Crie um documento `mapeamento-contexto.md` com esta estrutura:

```markdown
# Mapeamento de Contexto - Assistente NovaTech

## Contexto Estático

### 1. System Prompt - Identidade
Conteúdo: [Copie a seção do prompt]
Tamanho estimado: [X tokens]
Frequência: Presente em 100% das queries
Mudança: Raramente (atualizações de versão do assistente)

### 2. System Prompt - Guardrails
Conteúdo: [Copie a seção do prompt]
Tamanho estimado: [X tokens]
Frequência: Presente em 100% das queries
Mudança: Muito raramente (quando guardrails mudam)

### 3. Instruções para Chunks
Conteúdo: [Copie a seção do prompt]
Tamanho estimado: [X tokens]
Frequência: Presente em 100% das queries
Mudança: Raramente

**Total Contexto Estático: [X tokens]**

## Contexto Dinâmico

### 1. Chunks Recuperados
Tamanho: 500 tokens × N chunks
Varia por: Relevância da query
Exemplo: Para pergunta "Qual o SLA?", recupera chunk B (SLA-2024)
Impacto no orçamento: Crítico — compete diretamente com espaço para resposta

### 2. Dados do Cliente
Tamanho: 50-200 tokens (depende do cliente)
Varia por: ID do cliente, tipo de conta
Exemplo: "Cliente Gold, contato João Silva, últimos 3 tickets..."
Impacto: Pode ser resumido se espaço curto

### 3. Histórico da Conversa
Tamanho: 100-500 tokens (depende da extensão)
Varia por: Número de mensagens anteriores
Impacto: Pode ser truncado (manter últimas N mensagens)

### 4. Query do Usuário
Tamanho: 50-200 tokens
Varia por: Comprimento e complexidade da pergunta
Impacto: Obrigatório (não pode reduzir)

**Tamanho Dinâmico Total (caso típico): [X tokens]**

## Análise de Orçamento

```
Context Window GPT-4o:        128.000 tokens
- Estático (sempre):           -? tokens
- Dinâmico (típico):           -? tokens
- Margem para resposta:        -2.000 tokens
___________________________________________________________
= Espaço restante: ? tokens
```

## Implicações

1. **Prioridade de redução:** Se precisar economizar tokens, em que ordem reduz?
   - Exemplo: chunks > histórico > dados do cliente

2. **Limites de escalabilidade:** Qual é o máximo de chunks que cabe?
   - Cálculo: espaço restante ÷ 500 tokens/chunk = X chunks máximo

3. **Estratégia de truncamento:** Se conversa fica muito longa, o que você faz?
   - Mantém últimas N mensagens?
   - Resume histórico?
   - Sinaliza ao usuário?

## Critérios de Aceitação

- ✅ Identificou claramente o que é estático e o que é dinâmico
- ✅ Estimativas de tokens são razoáveis e justificadas
- ✅ Cálculo de orçamento está claro
- ✅ Discussão sobre priorização e trade-offs está presente
- ✅ Implicações práticas para execução identificadas

## Dicas

- **Para contar tokens:** Use a estimativa de 0.75 palavras/token (tarefa 1.1.2)
- **Chunks:** Em produção, chunks variam bastante em tamanho. Use uma estimativa média (500 é razoável)
- **Histórico:** Mesmo em conversa de 10 mensagens, o histórico pode ser 200+ tokens
- **Margem:** Sempre reserve espaço para a resposta (não sabemos quanto será longa)

## Próximas Tarefas

Quando terminar, passe para [Tarefa 1.2.3 — Teste com Perguntas Reais](./tarefa-03-teste-perguntas.md)
