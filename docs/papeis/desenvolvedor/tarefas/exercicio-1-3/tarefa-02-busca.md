# Tarefa 1.3.2 — Função de Busca Semântica com Score de Similaridade

## O que fazer

Implemente uma função Python que receba uma pergunta em linguagem natural, gere seu embedding, busque os N chunks mais similares no ChromaDB e retorne os resultados com score de similaridade.

## Pré-requisito

A tarefa anterior ([tarefa-01-ingestao.md](tarefa-01-ingestao.md)) deve estar concluída: ChromaDB populado com os documentos da NovaTech.

## Implementação

### Assinatura da Função

```python
def buscar_chunks(pergunta: str, n_resultados: int = 3) -> list[dict]:
    """
    Busca os chunks mais relevantes para a pergunta.
    
    Retorna lista de dicts com:
    - texto: conteúdo do chunk
    - fonte: arquivo de origem
    - score: distância/similaridade (quanto menor a distância, mais similar)
    """
```

### Lógica Interna

```python
# 1. Gerar embedding da pergunta
embedding_pergunta = modelo.encode(pergunta)

# 2. Buscar no ChromaDB
resultados = colecao.query(
    query_embeddings=[embedding_pergunta],
    n_results=n_resultados,
    include=["documents", "metadatas", "distances"]
)

# 3. Formatar retorno
chunks = []
for texto, meta, distancia in zip(...):
    chunks.append({
        "texto": texto,
        "fonte": meta["fonte"],
        "score": 1 - distancia  # converter distância para similaridade (0-1)
    })

return chunks
```

> **Nota sobre score:** ChromaDB retorna distância (menor = mais similar). Converter para similaridade (`1 - distância`) facilita a interpretação: score 0.9 significa 90% de similaridade.

## Parâmetros a Definir

Documente suas escolhas:

```
# N de chunks recuperados: [valor escolhido]
# Motivo: [por que N=3 ou N=5 — trade-off entre contexto e ruído]
# Threshold de score mínimo: [valor ou "não aplicado"]
# Motivo: [por que filtrar ou não filtrar por score]
```

## Teste Manual da Função

Após implementar, teste com esta pergunta simples para confirmar que a função funciona antes de usá-la nos testes formais:

```python
chunks = buscar_chunks("Qual o prazo de entrega padrão para cargas normais?")
for c in chunks:
    print(f"Score: {c['score']:.3f} | Fonte: {c['fonte']}")
    print(c['texto'][:200])
    print("---")
```

## Verificação

- [ ] Função executa sem erros
- [ ] Retorna exatamente N chunks
- [ ] Score de similaridade é um número entre 0 e 1
- [ ] Campo `fonte` está presente em todos os resultados
- [ ] O chunk com maior score é visualmente relacionado à pergunta
