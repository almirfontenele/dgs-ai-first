# Tarefa 1.1.1 — Análise de Desafios por Tipo de Fonte

## O que fazer

Analise cada tipo de fonte de dados da NovaTech e identifique os desafios específicos para o pipeline de RAG:

### Tipos de Fonte a Analisar

1. **PDFs com Tabelas Complexas** (SharePoint)
   - Características: tabelas de frete com 15+ colunas, fluxogramas embutidos como imagens
   - Desafios: extração de layout, preservação de relacionamentos, OCR de imagens

2. **PDFs Escaneados** (SharePoint)
   - Características: documentos digitalizados que precisam de OCR
   - Desafios: qualidade de reconhecimento, caracteres distorcidos, layouts variáveis

3. **Wiki com Links Internos** (Confluence)
   - Características: links entre páginas, macros customizadas
   - Desafios: contexto fragmentado, dependências entre documentos, macros não interpretadas

4. **Planilhas com Fórmulas Interdependentes**
   - Características: ~50 planilhas, fórmulas que dependem umas das outras
   - Desafios: valores calculados vs fórmulas, contexto de negócio implícito

## Para cada tipo, produza

### Estrutura da Análise

```
## [Tipo de Fonte]

**Desafio Principal:**
[Descrição do que torna essa fonte difícil para RAG]

**Impacto na Qualidade das Respostas:**
[Como esse desafio degrada a qualidade das respostas do LLM]

**Estratégia de Tratamento:**
[Abordagem técnica para mitigar o desafio]
```

## Critérios de Aceitação

- ✅ Identificar pelo menos 2 desafios por tipo de fonte
- ✅ Conectar cada desafio ao impacto na qualidade de resposta do LLM
- ✅ Propor uma estratégia de tratamento concreta (não genérica)
- ✅ Demonstrar compreensão de RAG pipeline (extração → chunking → retrieval → prompting)

## Dicas

- **PDFs com tabelas:** Considere se a tabela deve ser preservada em estrutura tabular ou convertida em prosa
- **PDFs escaneados:** Pense na taxa de erro do OCR e como isso afeta a confiabilidade do retrieval
- **Wiki:** Pense em como manter o contexto de links sem incluir a página inteira
- **Planilhas:** Distinga entre o que é valor calculado (dinâmico) vs valor que muda raramente

## Próximas Tarefas

Quando terminar, passe para [Tarefa 1.1.2 — Estimativa de Tamanho da Base em Tokens](./tarefa-02-estimativa-tokens.md)
