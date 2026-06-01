# Exercício 1.3 — Construção de Pipeline RAG com Ferramentas Open-Source

## Objetivo

Construir uma prova de conceito funcional de pipeline RAG usando ferramentas gratuitas/open-source, demonstrando que o ciclo completo de ingestão → busca → montagem de prompt → geração funciona antes de investir em licenças Azure.

## Contexto

O Tech Lead quer validar a viabilidade técnica do pipeline RAG com a stack open-source antes do investimento em infraestrutura Azure. Você vai construir o protótipo usando os documentos reais da NovaTech e testar com perguntas do domínio.

## Stack Utilizada

| Componente | Ferramenta | Instalação |
|---|---|---|
| Embeddings | sentence-transformers (`all-MiniLM-L6-v2`) | `pip install sentence-transformers` |
| Vector Store | ChromaDB | `pip install chromadb` |
| Orquestração | LangChain ou manual | `pip install langchain` |
| Geração | Claude (chat manual) ou Ollama local | — |

> Alternativas aceitas: FAISS no lugar de ChromaDB, Ollama para embeddings locais. O que importa é que seja gratuito e funcione.

## Tarefas

| # | Arquivo | O que fazer |
|---|---|---|
| 1 | [tarefa-01-ingestao.md](tarefa-01-ingestao.md) | Script de ingestão: leitura, chunking, embeddings e armazenamento no ChromaDB |
| 2 | [tarefa-02-busca.md](tarefa-02-busca.md) | Função de busca semântica com score de similaridade |
| 3 | [tarefa-03-montagem-prompt.md](tarefa-03-montagem-prompt.md) | Função de montagem do prompt completo (system + chunks + pergunta) |
| 4 | [tarefa-04-testes.md](tarefa-04-testes.md) | Teste com 5 perguntas do Anexo B e avaliação das respostas via Claude |
| 5 | [tarefa-05-analise-correcoes.md](tarefa-05-analise-correcoes.md) | Identificação de problemas reais e propostas de correção |

## Critérios de Avaliação

- Pipeline funcional: ingere, busca e retorna chunks relevantes (não precisa ser perfeito, mas precisa rodar)
- Estratégia de chunking justificada — não apenas "512 tokens fixos" sem motivo
- Testes usam perguntas realistas comparadas com o gabarito do Anexo B
- Problemas identificados são reais e as propostas de correção são concretas
- Demonstração de que RAG é um sistema de engenharia de dados, não apenas chamada de API

## Entregável Final

Ao concluir todas as tarefas, você terá:
1. Código do pipeline completo (com evidência de uso do GitHub Copilot)
2. Resultados dos 5 testes com análise de precisão
3. Relatório de problemas encontrados e propostas de correção documentadas
