# Tarefa 1.1.3 — Análise de Orçamento de Contexto

## O que fazer

Analise como a context window do GPT-4o é alocada em cada query e quanto espaço sobra para chunks recuperados.

## Dados Fornecidos

- **Context window do GPT-4o:** 128.000 tokens
- **System prompt + instruções:** ~2.000 tokens
- **Tamanho típico de um chunk:** ~500 tokens

## Cálculo de Orçamento

### 1. Disponível para Chunks

```
Context window total:        128.000 tokens
- System prompt/instruções:    -2.000 tokens
- User query:                    -500 tokens (estimativa)
- Response buffer:              -2.000 tokens (espaço para o LLM responder)
___________________________________________________________
= Espaço disponível para chunks: ? tokens
```

### 2. Capacidade de Chunks

```
Espaço disponível ÷ Tamanho por chunk (500) = Quantos chunks cabem?
```

### 3. Análise de Impacto

Responda:
- **Número máximo de chunks:** [Resultado]
- **Cobertura de conhecimento:** Esse número de chunks cobre que % da base total?
- **Lost in the Middle:** Se um chunk relevante está na posição 10 de 20, qual a probabilidade dele ser "esquecido" pelo LLM?
- **Trade-offs:**
  - Se aumentar tamanho do chunk, cabe menos contexto (menos diversidade)
  - Se diminuir tamanho do chunk, cabe mais contexto (melhor cobertura) mas fragmenta o conhecimento

## Critérios de Aceitação

- ✅ Cálculo claro de espaço disponível
- ✅ Número de chunks justificado
- ✅ Análise de cobertura (que % da base cabe em uma query?)
- ✅ Discussão sobre trade-offs (chunk size vs quantidade)
- ✅ Referência ao efeito "lost in the middle"

## Dicas

- **Lost in the Middle:** LLMs tendem a esquecer informação no meio de contextos longos. Primeira e última posição são mais "lembradas"
- **Response buffer:** GPT-4o tipicamente gera respostas de 500-2000 tokens. Reserve espaço para isso
- **Query size:** Varia muito (10 tokens para "quem é o gerente?" até 500+ para queries complexas)
- **Priorização:** Se cabem 100 chunks, a ordem importa. Ranking do retriever deve colocar mais relevante na primeira posição

## Próximas Tarefas

Quando terminar, passe para [Tarefa 1.1.4 — Estratégia de Chunking](./tarefa-04-estrategia-chunking.md)
