# Tarefa 1.3.1 — Script de Ingestão: Chunking, Embeddings e ChromaDB

## O que fazer

Usando o **GitHub Copilot**, implemente um script Python que leia os documentos da NovaTech do Anexo A, divida em chunks, gere embeddings e armazene no ChromaDB.

## Inputs

- Documentos da NovaTech: pasta `anexo-a-documentos-individuais/` (5 arquivos `.md`)
- Modelo de embeddings: `all-MiniLM-L6-v2` (via `sentence-transformers`)
- Vector store: ChromaDB local

## Etapas do Script

### 1. Leitura dos Documentos

```python
# Estrutura esperada
for arquivo in pasta_documentos:
    texto = ler_arquivo(arquivo)
    metadados = { "fonte": nome_arquivo, "tipo": tipo_documento }
```

Salve o nome do arquivo original nos metadados de cada chunk — isso será necessário para citação de fonte nas respostas.

### 2. Estratégia de Chunking

Defina sua estratégia e **justifique no código** (comentário ou docstring). Considere:

| Estratégia | Quando usar |
|---|---|
| Tamanho fixo (ex: 512 tokens) | Textos homogêneos sem estrutura especial |
| Por parágrafo/seção | Documentos com seções bem delimitadas |
| Semântico (via LangChain) | Quando quebrar no meio de uma ideia é problemático |
| Híbrido com overlap | Para não perder contexto nas bordas |

**Atenção especial:** Os documentos da NovaTech contêm tabelas (SLA, tarifas). Defina o que acontece quando um chunk corta uma tabela no meio.

Documente sua escolha:
```
# Estratégia escolhida: [descreva aqui]
# Motivo: [por que essa estratégia para esses documentos]
# Tamanho do chunk: [X tokens/caracteres]
# Overlap: [Y tokens/caracteres — se aplicável]
# Tratamento especial para tabelas: [descreva]
```

### 3. Geração de Embeddings

```python
from sentence_transformers import SentenceTransformer

modelo = SentenceTransformer('all-MiniLM-L6-v2')
embedding = modelo.encode(texto_do_chunk)
```

### 4. Armazenamento no ChromaDB

```python
import chromadb

cliente = chromadb.Client()
colecao = cliente.create_collection("novatech-docs")

colecao.add(
    documents=[texto_chunk],
    embeddings=[embedding],
    metadatas=[metadados],
    ids=[id_unico_do_chunk]
)
```

Garanta que o `id` de cada chunk seja único e rastreável (ex: `"politica-sla-chunk-03"`).

## Evidência do GitHub Copilot

Salve ao menos **um screenshot** ou **comentário no código** mostrando onde o Copilot sugeriu código (ex: a função de chunking, o loop de ingestão). Isso faz parte da avaliação.

## Verificação

Ao final, rode o script e confirme:

- [ ] Nenhum erro de execução
- [ ] ChromaDB foi populado (verifique com `colecao.count()`)
- [ ] Metadados de fonte estão presentes em todos os chunks
- [ ] Chunks não estão vazios nem excessivamente longos

## Dúvida frequente

> *"Qual o tamanho ideal de chunk?"*

Não existe resposta única. Chunks menores aumentam precisão na busca mas perdem contexto. Chunks maiores preservam contexto mas trazem ruído. Para os documentos da NovaTech (tabelas de SLA, regras de negócio), um ponto de partida razoável é 300–500 tokens com overlap de 50–100 tokens — mas justifique sua escolha com base nos documentos reais.
