# Tarefa 1.1.2 — Estimativa de Tamanho da Base em Tokens

## O que fazer

Calcule o tamanho aproximado da base de dados da NovaTech em tokens, considerando todos os tipos de fonte.

## Dados Fornecidos

- **PDFs:** ~800 documentos, média de 10 páginas cada
- **Wiki Confluence:** ~400 páginas, média de 1.500 palavras cada
- **Planilhas:** ~50 planilhas
- **Regra prática:** ~0.75 palavras por token

## Cálculo Passo a Passo

### 1. Estimativa de Palavras

#### PDFs
```
800 documentos × 10 páginas × [páginas por palavra] = ? palavras
Dica: Uma página de texto = ~250 palavras (regra comum)
```

#### Wiki
```
400 páginas × 1.500 palavras = ? palavras
```

#### Planilhas
```
~50 planilhas
Estimativa: quantas células com dados? Quantas palavras por célula?
Considere que nem toda célula tem conteúdo relevante para RAG
```

### 2. Conversão para Tokens

```
Total palavras ÷ 0.75 = Total tokens
```

### 3. Análise

Responda:
- **Tamanho total em tokens:** [Resultado]
- **Distribuição por tipo de fonte:** (PDFs: X%, Wiki: Y%, Planilhas: Z%)
- **Implicações:** Qual é o tamanho em relação à context window do GPT-4o (128K tokens)?
- **Compressão necessária:** Precisa indexar tudo ou pode fazer sampling?

## Critérios de Aceitação

- ✅ Cálculo de palavras por tipo de fonte justificado
- ✅ Conversão para tokens usando a regra de 0.75 palavras/token
- ✅ Distribuição percentual clara
- ✅ Análise de implicações para o pipeline de retrieval

## Dicas

- **Páginas PDF:** Nem toda página tem 250 palavras (tabelas ocupam espaço mas menos palavras)
- **Wiki:** 1.500 palavras é baseline; algumas páginas podem ter links, que ocupam espaço mas poucas palavras
- **Planilhas:** Nem toda célula é relevante; considere apenas colunas/linhas com dados semânticos
- **Compressão:** Se o total > 5M tokens, indexar tudo em um único índice fica caro

## Próximas Tarefas

Quando terminar, passe para [Tarefa 1.1.3 — Análise de Orçamento de Contexto](./tarefa-03-orcamento-contexto.md)
