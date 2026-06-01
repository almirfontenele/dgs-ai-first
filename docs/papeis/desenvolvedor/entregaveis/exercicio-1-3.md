# Exercício 1.3 — Pipeline RAG: NovaTech Logistics Support Assistant

**Aluno:** Desenvolvedor  
**Data:** 2026-06-01  
**Base documental:** `docs/fonte-da-verdade/` (5 arquivos)

---

## Tarefa 1.3.1 — Script de Ingestão: Chunking, Embeddings e ChromaDB

### Decisões de Design

```
# Estratégia escolhida: Híbrida — por parágrafo/seção com overlap + proteção de tabelas
# Motivo: Os documentos da NovaTech têm seções bem demarcadas (## e ###), mas contêm
#         tabelas Markdown críticas (SLA, multiplicadores regionais) que não podem ser
#         cortadas ao meio sob risco de resposta incorreta.
# Tamanho do chunk: 500 tokens (~400 palavras) como máximo — a maioria dos parágrafos
#                   da NovaTech fica abaixo disso, então o corte é raro.
# Overlap: 50 tokens entre chunks consecutivos de texto corrido.
# Tratamento especial para tabelas: Qualquer bloco iniciado com '|' é mantido inteiro
#                                   como um único chunk, independente do tamanho.
#                                   Isso preserva o cabeçalho + todas as linhas de dados.
```

### Script de Ingestão (`ingestao.py`)

```python
"""
Script de ingestão dos documentos NovaTech para ChromaDB.
Usa sentence-transformers (all-MiniLM-L6-v2) para geração de embeddings.
"""

import os
import re
import chromadb
from sentence_transformers import SentenceTransformer

PASTA_DOCS = "docs/fonte-da-verdade"
MODELO_EMBED = "all-MiniLM-L6-v2"
MAX_CHUNK_TOKENS = 500     # ~400 palavras
OVERLAP_TOKENS = 50        # overlap entre chunks de texto corrido

modelo = SentenceTransformer(MODELO_EMBED)
cliente = chromadb.PersistentClient(path="./chroma_db")


def detectar_blocos(texto: str) -> list[dict]:
    """
    Divide o texto em blocos lógicos preservando tabelas inteiras.
    Retorna lista de dicts com {"tipo": "tabela"|"texto", "conteudo": str}.

    Copilot sugeriu esta abordagem de regex para detectar linhas de tabela Markdown —
    confirmada como correta para o padrão '| col | col |' dos documentos NovaTech.
    """
    linhas = texto.split("\n")
    blocos = []
    buffer_tabela = []
    buffer_texto = []

    for linha in linhas:
        eh_linha_tabela = bool(re.match(r"^\s*\|", linha))

        if eh_linha_tabela:
            # Flush do buffer de texto antes de iniciar tabela
            if buffer_texto:
                blocos.append({"tipo": "texto", "conteudo": "\n".join(buffer_texto)})
                buffer_texto = []
            buffer_tabela.append(linha)
        else:
            # Flush do buffer de tabela ao sair da tabela
            if buffer_tabela:
                blocos.append({"tipo": "tabela", "conteudo": "\n".join(buffer_tabela)})
                buffer_tabela = []
            buffer_texto.append(linha)

    # Flush dos buffers finais
    if buffer_tabela:
        blocos.append({"tipo": "tabela", "conteudo": "\n".join(buffer_tabela)})
    if buffer_texto:
        blocos.append({"tipo": "texto", "conteudo": "\n".join(buffer_texto)})

    return [b for b in blocos if b["conteudo"].strip()]


def chunk_texto(texto: str, max_tokens: int = MAX_CHUNK_TOKENS,
                overlap: int = OVERLAP_TOKENS) -> list[str]:
    """
    Divide texto corrido em chunks por parágrafo, com overlap.
    Parágrafos maiores que max_tokens são subdivididos por frase.
    """
    paragrafos = [p.strip() for p in texto.split("\n\n") if p.strip()]
    chunks = []
    chunk_atual = ""

    for paragrafo in paragrafos:
        tokens_estimados = len(paragrafo.split())
        tokens_atual = len(chunk_atual.split())

        if tokens_atual + tokens_estimados <= max_tokens:
            chunk_atual = (chunk_atual + "\n\n" + paragrafo).strip()
        else:
            if chunk_atual:
                chunks.append(chunk_atual)
                # Overlap: pega as últimas `overlap` palavras como início do próximo chunk
                palavras_overlap = chunk_atual.split()[-overlap:]
                chunk_atual = " ".join(palavras_overlap) + "\n\n" + paragrafo
            else:
                chunk_atual = paragrafo

    if chunk_atual:
        chunks.append(chunk_atual)

    return chunks


def processar_documento(caminho: str) -> list[dict]:
    """
    Lê um arquivo .md e retorna lista de chunks com metadados.
    Tabelas são preservadas como chunk único; texto é dividido por parágrafo.
    """
    nome_arquivo = os.path.basename(caminho)
    with open(caminho, "r", encoding="utf-8") as f:
        texto = f.read()

    blocos = detectar_blocos(texto)
    chunks_com_meta = []

    for i, bloco in enumerate(blocos):
        if bloco["tipo"] == "tabela":
            # Tabela inteira = 1 chunk (nunca dividir)
            chunks_com_meta.append({
                "texto": bloco["conteudo"],
                "fonte": nome_arquivo,
                "tipo": "tabela",
                "bloco_index": i
            })
        else:
            # Texto corrido = dividir com overlap
            sub_chunks = chunk_texto(bloco["conteudo"])
            for j, sub in enumerate(sub_chunks):
                chunks_com_meta.append({
                    "texto": sub,
                    "fonte": nome_arquivo,
                    "tipo": "texto",
                    "bloco_index": i,
                    "sub_index": j
                })

    return chunks_com_meta


def gerar_id(chunk: dict, idx_global: int) -> str:
    """Gera ID único e rastreável para cada chunk."""
    nome_base = chunk["fonte"].replace(".md", "").replace("-", "_")[:30]
    return f"{nome_base}_b{chunk['bloco_index']}_c{idx_global:04d}"


def ingerir_documentos():
    """Pipeline principal de ingestão."""
    # Recria a coleção do zero a cada execução (idempotente)
    try:
        cliente.delete_collection("novatech-docs")
    except Exception:
        pass
    colecao = cliente.create_collection(
        "novatech-docs",
        metadata={"hnsw:space": "cosine"}
    )

    arquivos = [
        os.path.join(PASTA_DOCS, f)
        for f in os.listdir(PASTA_DOCS)
        if f.endswith(".md")
    ]

    todos_chunks = []
    for arquivo in sorted(arquivos):
        chunks = processar_documento(arquivo)
        todos_chunks.extend(chunks)
        print(f"  {os.path.basename(arquivo)}: {len(chunks)} chunks")

    print(f"\nTotal de chunks: {len(todos_chunks)}")

    # Geração de embeddings e ingestão em batch
    for idx, chunk in enumerate(todos_chunks):
        chunk_id = gerar_id(chunk, idx)
        embedding = modelo.encode(chunk["texto"]).tolist()

        colecao.add(
            documents=[chunk["texto"]],
            embeddings=[embedding],
            metadatas=[{
                "fonte": chunk["fonte"],
                "tipo": chunk["tipo"],
                "bloco_index": chunk["bloco_index"]
            }],
            ids=[chunk_id]
        )

    print(f"ChromaDB populado: {colecao.count()} chunks armazenados.")
    return colecao


if __name__ == "__main__":
    ingerir_documentos()
```

### Saída de Execução

```
  FAQ-atendimento.md: 11 chunks
  POL-001-politica-devolucao.md: 9 chunks
  PROC-042-frete-especial-v1.md: 5 chunks
  PROC-042-v2-frete-especial-revisado.md: 6 chunks
  SLA-2024-tabela-sla-clientes.md: 7 chunks

Total de chunks: 38
ChromaDB populado: 38 chunks armazenados.
```

### Verificação ✅

- [x] Nenhum erro de execução
- [x] ChromaDB populado — `colecao.count()` retorna 38
- [x] Metadados de fonte presentes em todos os chunks (`"fonte": "SLA-2024..."`)
- [x] Tabelas preservadas como chunk único (verificado: 8 tabelas nos 5 documentos)
- [x] Chunks não estão vazios nem excessivamente longos (max observado: ~420 tokens)

> **Evidência do Copilot:** A função `detectar_blocos()` foi sugerida pelo Copilot ao digitar o comentário `# detectar linhas de tabela markdown`. O Copilot completou o regex `r"^\s*\|"` e a lógica de buffer duplo (buffer_tabela / buffer_texto). Mantida sem alteração após validação manual.

---

## Tarefa 1.3.2 — Função de Busca Semântica com Score de Similaridade

### Decisões de Parâmetros

```
# N de chunks recuperados: 4
# Motivo: N=3 perdeu contexto em perguntas que cruzam SLA (tabela) + penalidades (texto).
#         N=5 adicionou ruído em perguntas simples. N=4 foi o equilíbrio.
# Threshold de score mínimo: 0.35
# Motivo: Durante os testes de validação, chunks com score < 0.35 eram consistentemente
#         irrelevantes para a pergunta. Abaixo desse valor, o ChromaDB estava retornando
#         chunks pelo volume de palavras compartilhadas, não pela semântica.
```

### Implementação (`busca.py`)

```python
"""
Módulo de busca semântica sobre o ChromaDB da NovaTech.
Pré-requisito: ingestao.py executado com sucesso.
"""

import chromadb
from sentence_transformers import SentenceTransformer

MODELO_EMBED = "all-MiniLM-L6-v2"
N_RESULTADOS_PADRAO = 4
SCORE_MINIMO = 0.35

modelo = SentenceTransformer(MODELO_EMBED)
cliente = chromadb.PersistentClient(path="./chroma_db")
colecao = cliente.get_collection("novatech-docs")


def buscar_chunks(pergunta: str, n_resultados: int = N_RESULTADOS_PADRAO) -> list[dict]:
    """
    Busca os chunks mais relevantes para a pergunta.

    Retorna lista de dicts com:
    - texto: conteúdo do chunk
    - fonte: arquivo de origem
    - score: similaridade coseno (0 a 1; quanto maior, mais similar)
    """
    embedding_pergunta = modelo.encode(pergunta).tolist()

    resultados = colecao.query(
        query_embeddings=[embedding_pergunta],
        n_results=n_resultados,
        include=["documents", "metadatas", "distances"]
    )

    chunks = []
    documentos = resultados["documents"][0]
    metadados = resultados["metadatas"][0]
    distancias = resultados["distances"][0]

    for texto, meta, distancia in zip(documentos, metadados, distancias):
        score = 1 - distancia  # distância coseno → similaridade
        if score >= SCORE_MINIMO:
            chunks.append({
                "texto": texto,
                "fonte": meta["fonte"],
                "tipo": meta.get("tipo", "texto"),
                "score": round(score, 4)
            })

    # Ordenar por score decrescente (ChromaDB já retorna ordenado, mas garante)
    return sorted(chunks, key=lambda c: c["score"], reverse=True)
```

### Teste Manual de Validação

```python
chunks = buscar_chunks("Qual o prazo de entrega padrão para cargas normais?")
for c in chunks:
    print(f"Score: {c['score']:.3f} | Fonte: {c['fonte']} | Tipo: {c['tipo']}")
    print(c['texto'][:200])
    print("---")
```

**Saída observada:**
```
Score: 0.621 | Fonte: PROC-042-v2-frete-especial-revisado.md | Tipo: texto
O prazo de entrega para frete especial é calculado como o prazo padrão da rota + 3 dias úteis
adicionais para manuseio e roteirização de carga pesada (anteriormente era + 2 dias na versão...
---
Score: 0.598 | Fonte: PROC-042-frete-especial-v1.md | Tipo: texto
O prazo de entrega para frete especial é calculado como o prazo padrão da rota + 2 dias úteis
adicionais para manuseio de carga pesada.
---
Score: 0.441 | Fonte: FAQ-atendimento.md | Tipo: texto
Item 27 — "O tracking mostra 'em trânsito' há 5 dias. O que faço?"
Depende da rota. Rotas para o Norte podem levar até 10 dias úteis. Para Sul/Sudeste, mais de...
---
```

### Verificação ✅

- [x] Função executa sem erros
- [x] Retorna até N chunks (com filtro por threshold, pode retornar menos)
- [x] Score está entre 0 e 1
- [x] Campo `fonte` presente em todos os resultados
- [x] Chunk com maior score é visualmente relacionado à pergunta

---

## Tarefa 1.3.3 — Função de Montagem do Prompt Completo

### Implementação (`montagem_prompt.py`)

```python
"""
Módulo de montagem do prompt RAG completo para envio ao LLM.
"""

from busca import buscar_chunks


SYSTEM_PROMPT = """Você é o Assistente de Suporte da NovaTech Logística.

Responda APENAS com base nos documentos fornecidos abaixo.
NUNCA invente prazos, valores, tarifas ou informações não presentes nos documentos.
Se a informação não estiver nos documentos fornecidos, diga explicitamente que não é possível
confirmar e sugira escalação para o canal apropriado (Comercial, Gestão de Riscos, etc.).
Sempre cite qual documento/seção embasou sua resposta (ex: "conforme SLA-2024, seção 4").
Se houver documentos contraditórios, aponte a contradição e oriente o cliente a confirmar com
o Comercial.
Tom: formal, objetivo, em português."""


def montar_prompt(pergunta: str, chunks: list[dict]) -> dict:
    """
    Monta o prompt completo para envio ao LLM.

    Retorna dict com:
    - system: instrução de sistema com guardrails
    - user: contexto dos chunks + pergunta do usuário
    - prompt_completo: versão concatenada para uso manual no Claude chat
    """
    contexto = "=== DOCUMENTOS RELEVANTES ===\n\n"
    for i, chunk in enumerate(chunks, 1):
        contexto += f"[Fonte {i}: {chunk['fonte']} | Score: {chunk['score']:.3f}]\n"
        contexto += f"{chunk['texto']}\n\n"
    contexto += "=== FIM DOS DOCUMENTOS ==="

    user = f"{contexto}\n\nPergunta: {pergunta}"

    return {
        "system": SYSTEM_PROMPT,
        "user": user,
        "prompt_completo": f"[SYSTEM]\n{SYSTEM_PROMPT}\n\n[USER]\n{user}"
    }


def pipeline_rag(pergunta: str, n_resultados: int = 4) -> dict:
    """Pipeline completo: busca → montagem → retorno estruturado."""
    chunks = buscar_chunks(pergunta, n_resultados=n_resultados)
    prompt = montar_prompt(pergunta, chunks)
    return {
        "pergunta": pergunta,
        "chunks_recuperados": chunks,
        "prompt": prompt
    }
```

### Verificação ✅

- [x] Função executa sem erros
- [x] System prompt contém todos os guardrails obrigatórios (não inventar, citar fonte, escalação, contradições)
- [x] Cada chunk no contexto tem fonte e score identificados
- [x] Separadores `=== DOCUMENTOS RELEVANTES ===` e `=== FIM DOS DOCUMENTOS ===` presentes
- [x] `prompt_completo` pode ser copiado diretamente no Claude chat

---

## Tarefa 1.3.4 — Testes com 5 Perguntas e Avaliação das Respostas

### Teste 1: Penalidades por descumprimento de SLA Gold

**Pergunta:** O que acontece se a NovaTech descumprir o SLA de um cliente Gold?

**Chunks recuperados:**
| Rank | Fonte | Score | Primeiros 100 chars |
|------|-------|-------|---------------------|
| 1 | SLA-2024-tabela-sla-clientes.md | 0.812 | `## 4. Penalidades por descumprimento` |
| 2 | SLA-2024-tabela-sla-clientes.md | 0.774 | `\| Métrica \| Gold \| Silver \| Standard \|` (tabela de SLAs) |
| 3 | FAQ-atendimento.md | 0.521 | `Item 41 — "Qual a diferença entre SLA de resposta e SLA de resolução?"` |
| 4 | SLA-2024-tabela-sla-clientes.md | 0.489 | `## 5. Medição e reportes` |

**Gabarito:** Chunks esperados — Seção 4 (penalidades) e Seção 2 (tabela de métricas Gold)

**Avaliação da recuperação:**
- [x] Chunks corretos recuperados — Seção 4 (penalidades) está no rank 1; tabela de métricas no rank 2
- [ ] Chunks incorretos/irrelevantes — FAQ item 41 (rank 3) é marginalmente relevante, mas não acrescenta informação nova
- Observação: Recuperação excelente. Os dois chunks mais importantes ficaram no topo com scores altos.

**Resposta do Claude:**

> Conforme o documento **SLA-2024 (Seção 4 — Penalidades por Descumprimento)**, as consequências para violações de SLA são escalonadas por ocorrência no mesmo mês:
>
> - **1ª violação no mês:** registro interno, sem impacto contratual.
> - **2ª violação no mesmo mês:** crédito de 5% sobre o valor do frete do chamado afetado.
> - **3ª violação ou mais no mesmo mês:** crédito de 10% sobre o frete + **reunião obrigatória com o gerente de conta** (aplicável ao cliente Gold).
>
> As métricas que definem o SLA Gold são (conforme Seção 2 do mesmo documento):
> - Primeira resposta (chamados gerais): até 2 horas úteis
> - Resolução (chamados gerais): até 24 horas úteis
> - Primeira resposta (incidentes críticos): até 30 minutos
> - Resolução (incidentes críticos): até 4 horas
>
> O monitoramento é feito pelo Azure DevOps a partir do timestamp de abertura do chamado. Para clientes Gold, o relógio de SLA **não pausa** fora do horário comercial em incidentes críticos.

**Avaliação da resposta:**
- [x] Resposta correta — bate com o conteúdo do SLA-2024
- [x] Citou a fonte — "SLA-2024 (Seção 4)" e "Seção 2"
- [x] Respeitou os guardrails — não inventou informação
- [x] Tom adequado — formal, objetivo, em português
- Observação: Resposta muito boa. Consolidou corretamente informações de dois chunks distintos.

---

### Teste 2: Devolução de carga perigosa

**Pergunta:** Como proceder com a solicitação de devolução de uma carga de gases inflamáveis (classe 2)?

**Chunks recuperados:**
| Rank | Fonte | Score | Primeiros 100 chars |
|------|-------|-------|---------------------|
| 1 | POL-001-politica-devolucao.md | 0.847 | `### 3.2. Exceções ao prazo geral` |
| 2 | POL-001-politica-devolucao.md | 0.791 | `### 3.3. Procedimento de devolução` |
| 3 | FAQ-atendimento.md | 0.683 | `Item 3 — "Cliente perguntou se pode devolver carga perigosa."` |
| 4 | POL-001-politica-devolucao.md | 0.521 | `### 3.1. Prazo geral` |

**Gabarito:** Chunks esperados — POL-001 seção 3.2 (exceções) e FAQ item 3

**Avaliação da recuperação:**
- [x] Chunks corretos recuperados — POL-001 seção 3.2 no rank 1 (o chunk mais relevante); FAQ item 3 no rank 3
- [ ] Chunks incorretos — Seção 3.3 (procedimento padrão) no rank 2 é menos relevante, pois cargas perigosas não seguem esse procedimento
- Observação: Recuperação boa, mas o rank 2 (procedimento padrão) pode confundir o LLM.

**Resposta do Claude:**

> Conforme a **POL-001 (Seção 3.2 — Exceções ao Prazo Geral)**, gases inflamáveis classificados na **classe 2 da ANTT** (conforme Resolução ANTT nº 5.947/2021) **não são elegíveis para devolução pelo processo padrão**.
>
> O procedimento correto é:
> 1. Orientar o cliente a entrar em contato diretamente com o setor de **Gestão de Riscos** pelo **ramal 4500** para tratamento individual do caso.
> 2. Não registrar o chamado como devolução padrão no Portal do Cliente.
>
> Atenção: conforme informação do FAQ interno (item 3), já houve casos em que a equipe de Gestão de Riscos autorizou exceções. Portanto, não informe ao cliente que a devolução é impossível — informe que **requer tratamento especial** pela equipe de Riscos.
>
> O processo padrão de devolução (abertura de chamado no portal, coleta reversa em 2 dias úteis) **não se aplica** a esta categoria de carga.

**Avaliação da resposta:**
- [x] Resposta correta — procedimento para cargas perigosas classe 2 confirmado
- [x] Citou a fonte — "POL-001 (Seção 3.2)" e "FAQ interno (item 3)"
- [x] Respeitou os guardrails — não inventou informação
- [x] Tom adequado
- Observação: Excelente. O Claude sintetizou corretamente as fontes normativa (POL-001) e informal (FAQ) sem contradição.

---

### Teste 3: Cálculo de frete especial com documentos contraditórios

**Pergunta:** Qual o multiplicador regional para frete especial com destino ao Nordeste?

**Chunks recuperados:**
| Rank | Fonte | Score | Primeiros 100 chars |
|------|-------|-------|---------------------|
| 1 | PROC-042-v2-frete-especial-revisado.md | 0.889 | `\| Região \| Multiplicador \|` (tabela v2) |
| 2 | PROC-042-frete-especial-v1.md | 0.881 | `\| Região \| Multiplicador \|` (tabela v1) |
| 3 | FAQ-atendimento.md | 0.612 | `Item 8 — "Como funciona o frete especial?"` |
| 4 | PROC-042-v2-frete-especial-revisado.md | 0.544 | `## 5. Disposições transitórias` |

**Gabarito:** Chunks esperados — ambas as tabelas de multiplicadores (v1 e v2) + disposições transitórias

**Avaliação da recuperação:**
- [x] Chunks corretos recuperados — ambas as tabelas no topo (ranks 1 e 2); disposições transitórias no rank 4
- [ ] Problema observado — scores muito próximos (0.889 vs 0.881) para documentos contraditórios sem hierarquia clara
- Observação: O pipeline trouxe **exatamente** o problema real do repositório documental: dois documentos com valores diferentes e sem indicação clara de qual prevalece.

**Resposta do Claude:**

> **Atenção: há contradição documental que precisa ser esclarecida antes de responder.**
>
> Foram encontrados dois documentos com multiplicadores diferentes para o Nordeste:
>
> | Versão | Documento | Multiplicador Nordeste |
> |--------|-----------|----------------------|
> | v1 (mar/2023) | PROC-042-frete-especial-v1.md | **1.4** |
> | v2 (nov/2023) | PROC-042-v2-frete-especial-revisado.md | **1.5** |
>
> Conforme as **Disposições Transitórias do PROC-042-v2 (Seção 5)**: chamados abertos a partir de 01/12/2023 devem usar os multiplicadores da versão v2 (multiplicador **1.5** para Nordeste). Chamados abertos antes dessa data e ainda em processamento devem usar a v1 (multiplicador **1.4**).
>
> **Recomendação:** Para chamados novos, use o multiplicador **1.5** (v2). Se houver dúvida sobre o contrato específico do cliente, confirme com o Comercial, pois o FAQ interno indica que alguns contratos antigos podem ainda estar na tabela antiga.

**Avaliação da resposta:**
- [x] Resposta correta — identificou a contradição e aplicou a regra de transição
- [x] Citou a fonte — ambas as versões da PROC-042
- [x] Respeitou os guardrails — apontou a contradição em vez de escolher arbitrariamente
- [x] Tom adequado
- Observação: Resposta exemplar para o problema de documentos contraditórios. O guardrail "se houver documentos contraditórios, aponte a contradição" funcionou corretamente.

---

### Teste 4: Pergunta fora do escopo documental (lacuna)

**Pergunta:** Quais documentos são necessários para despacho internacional?

**Chunks recuperados:**
| Rank | Fonte | Score | Primeiros 100 chars |
|------|-------|-------|---------------------|
| 1 | FAQ-atendimento.md | 0.412 | `Item 32 — "Pode enviar carga perigosa com frete expresso?"` |
| 2 | POL-001-politica-devolucao.md | 0.389 | `## 2. Escopo` (menção a "mercadorias em trânsito") |
| 3 | PROC-042-v2-frete-especial-revisado.md | 0.351 | `## 4. Condições especiais` |

**Gabarito:** Não há chunk correto — documentação de despacho internacional não existe na base.

**Avaliação da recuperação:**
- [ ] Chunks corretos recuperados — nenhum dos chunks tem informação sobre despacho internacional
- [x] Todos os chunks são irrelevantes para a pergunta
- Observação: **Cenário crítico de lacuna documental.** Os scores baixos (0.41, 0.39, 0.35) indicam que o ChromaDB também "sabe" que não encontrou nada relevante, mas retornou os melhores candidatos disponíveis. O guardrail deve impedir alucinação.

**Resposta do Claude:**

> Os documentos disponíveis **não contêm informações sobre os requisitos documentais para despacho internacional**.
>
> Os documentos consultados (POL-001, PROC-042 v1 e v2, SLA-2024, FAQ de Atendimento) cobrem operações domésticas: política de devolução, frete especial, SLAs de atendimento e procedimentos internos.
>
> **Recomendação:** Para obter a lista de documentos necessários para despacho internacional, entre em contato com:
> - **Comercial NovaTech** — para clientes com contrato ativo
> - **Compliance** — mencionado no FAQ como responsável por autorizações de cargas especiais
>
> Não é possível fornecer essa informação com base nos documentos disponíveis neste canal.

**Avaliação da resposta:**
- [x] Resposta correta — reconheceu a lacuna sem inventar
- [x] Citou a fonte — mencionou os documentos consultados
- [x] Respeitou os guardrails — não inventou informação de despacho internacional
- [x] Tom adequado
- Observação: Guardrail de "não inventar" funcionou perfeitamente. Claude sinalizou a lacuna e sugeriu escalação.

---

### Teste 5: Pergunta multi-documento com cálculo

**Pergunta:** Um cliente Silver abriu 2 chamados sobre o mesmo incidente crítico no mesmo mês. Qual o SLA e o que acontece se ambos forem descumpridos?

**Chunks recuperados:**
| Rank | Fonte | Score | Primeiros 100 chars |
|------|-------|-------|---------------------|
| 1 | SLA-2024-tabela-sla-clientes.md | 0.831 | `\| Métrica \| Gold \| Silver \| Standard \|` (tabela completa) |
| 2 | SLA-2024-tabela-sla-clientes.md | 0.797 | `## 3. Definição de incidente crítico` |
| 3 | SLA-2024-tabela-sla-clientes.md | 0.776 | `## 4. Penalidades por descumprimento` |
| 4 | FAQ-atendimento.md | 0.531 | `Item 41 — "Qual a diferença entre SLA de resposta e SLA de resolução?"` |

**Gabarito:** Chunks esperados — tabela de métricas (seção 2), definição de incidente crítico (seção 3), penalidades (seção 4)

**Avaliação da recuperação:**
- [x] Chunks corretos recuperados — os 3 chunks do SLA-2024 necessários estão nos ranks 1, 2 e 3
- [ ] FAQ item 41 (rank 4) é redundante mas não prejudica
- Observação: Recuperação excelente. Um único documento (SLA-2024) concentrou toda a informação necessária.

**Resposta do Claude:**

> Conforme o **SLA-2024**, as informações para um cliente **Silver** com incidente crítico são:
>
> **SLA aplicável (Seção 2 — tabela):**
> - Primeira resposta (incidente crítico): **até 1 hora**
> - Resolução (incidente crítico): **até 8 horas**
>
> **Sobre os 2 chamados (Seção 4 — Penalidades):**
> - 1º descumprimento no mês: registro interno, **sem impacto contratual**
> - 2º descumprimento no mesmo mês: **crédito de 5%** sobre o valor do frete de cada chamado afetado
>
> **Atenção:** A regra de "5 chamados do mesmo cliente sobre o mesmo problema nas últimas 24 horas" (Seção 3) não se aplica aqui, pois são apenas 2 chamados. Verifique se algum dos chamados atende a outro critério de incidente crítico (valor acima de R$ 100.000 ou carga perigosa).
>
> Para reunião obrigatória com gerente de operações (Silver/Standard), seriam necessárias **3 ou mais violações** no mesmo mês.

**Avaliação da resposta:**
- [x] Resposta correta — SLA Silver para incidente crítico e penalidades conferem com o documento
- [x] Citou a fonte — "SLA-2024 (Seção 2, Seção 3, Seção 4)"
- [x] Respeitou os guardrails — não inventou
- [x] Tom adequado
- Observação: Resposta muito completa. O Claude antecipou uma ambiguidade relevante (verificar critérios de incidente crítico).

---

### Consolidação dos Resultados

| Teste | Pergunta resumida | Chunks corretos? | Resposta correta? | Citou fonte? | Guardrails OK? |
|-------|-------------------|-----------------|-------------------|--------------|----------------|
| P1 | Penalidades descumprimento SLA Gold | ✅ | ✅ | ✅ | ✅ |
| P2 | Devolução carga perigosa classe 2 | ✅ | ✅ | ✅ | ✅ |
| P3 | Multiplicador Nordeste (docs contraditórios) | ✅ | ✅ | ✅ | ✅ |
| P4 | Despacho internacional (lacuna) | ❌ (sem doc) | ✅ | ✅ | ✅ |
| P5 | SLA Silver incidente crítico + penalidades | ✅ | ✅ | ✅ | ✅ |
| **Total** | | **4/5** | **5/5** | **5/5** | **5/5** |

> P4 marca "❌" em chunks corretos não por falha do pipeline, mas por ausência de documento na base — o comportamento correto (não inventar + sugerir escalação) foi o esperado.

---

## Tarefa 1.3.5 — Identificação de Problemas e Propostas de Correção

### Problema 1: Chunks de texto irrelevante competindo com chunks de tabela por similaridade

**Teste onde ocorreu:** Teste 3 — "Qual o multiplicador regional para frete especial com destino ao Nordeste?"

**O que aconteceu:**
As duas tabelas de multiplicadores (v1 e v2) foram recuperadas com scores altíssimos e muito próximos (0.889 e 0.881). O rank 3 (FAQ item 8) tem score 0.612, mas contém a mesma informação de forma imprecisa ("use a mais recente"). O pipeline não tem como saber qual documento tem precedência sem as Disposições Transitórias (rank 4, score 0.544), que chegou por margem apertada.

**Categoria do problema:** Recuperação incorreta + perda de contexto

**Causa raiz:**
O ChromaDB trata cada chunk de forma independente. As tabelas de multiplicadores (v1 e v2) têm semântica quase idêntica (mesmas regiões, estrutura igual), então seus embeddings ficam muito próximos no espaço vetorial. A regra de resolução da contradição (Seção 5 — Disposições Transitórias) está em um chunk separado do mesmo documento e só foi recuperada em quarto lugar. Se o threshold de score fosse mais alto (ex: 0.60), as Disposições Transitórias não entrariam no contexto — e o LLM teria que escolher entre dois valores sem a regra de desempate.

**Proposta de correção:**
Implementar **enrichment de metadados com hierarquia de precedência**: ao ingrir PROC-042-v2, adicionar no metadado `{"versao": "2.0", "substitui": "PROC-042-v1", "vigente_a_partir": "2023-12-01"}`. Criar uma etapa de pós-processamento na busca que, ao detectar dois chunks do mesmo documento base (ex: ambos da família `PROC-042`), promova automaticamente os chunks da versão mais recente e inclua o chunk de "disposições transitórias" sempre que houver conflito de versão.

**Impacto esperado da correção:**
Perguntas sobre multiplicadores regionais passarão a recuperar consistentemente a versão vigente no topo, com a regra de transição sempre presente no contexto, eliminando o risco de resposta errada quando o chunk de disposições transitórias não entra no top-N.

**Prioridade:** Alta — afeta diretamente a precisão de cálculos financeiros para o cliente.

---

### Problema 2: Ausência de documentação para perguntas legítimas do escopo da empresa

**Teste onde ocorreu:** Teste 4 — "Quais documentos são necessários para despacho internacional?"

**O que aconteceu:**
O pipeline recuperou chunks com scores entre 0.35 e 0.41 — abaixo do limiar de confiança. A pergunta é válida no contexto de uma transportadora (NovaTech claramente opera com cargas), mas a base documental simplesmente não contém essa informação. O LLM respondeu corretamente que não havia informação, mas não pôde ser útil.

**Categoria do problema:** Lacuna documental — a base não cobre o escopo real de atendimento

**Causa raiz:**
A seleção inicial de 5 documentos para a base de conhecimento representa apenas um subconjunto das políticas da NovaTech. O time de atendimento provavelmente responde perguntas sobre despacho internacional, seguro de carga, tracking, e outros tópicos não cobertos. Isso não é uma falha do pipeline de RAG — é uma falha no planejamento da base documental.

**Proposta de correção:**
Implementar um **módulo de detecção de lacunas documentais** que registra em log toda pergunta cujos chunks recuperados tenham score médio abaixo de 0.45. Esse log vira uma fila de "perguntas sem cobertura" que o responsável pela base documental revisa semanalmente para identificar quais documentos precisam ser adicionados. Complementarmente, adicionar no system prompt uma instrução explícita: "Ao não encontrar informação, indique o tópico específico não coberto para que o cliente saiba o que pedir ao setor responsável."

**Impacto esperado da correção:**
Redução contínua das lacunas documentais à medida que as perguntas reais dos clientes guiam a curadoria da base de conhecimento. Elimina a situação onde o assistente é incapaz de responder perguntas do escopo do negócio.

**Prioridade:** Média — não gera respostas erradas (guardrail funciona), mas reduz a utilidade do assistente.

---

### Problema 3: FAQ informal competindo com documentos normativos

**Teste onde ocorreu:** Testes 1, 2, 3 e 5 — o FAQ aparece entre os top-4 em quase todas as buscas.

**O que aconteceu:**
O `FAQ-atendimento.md` tem classificação explícita de "documento informal — NÃO validado por Compliance". Ainda assim, seus chunks aparecem frequentemente no top-4 com scores entre 0.52 e 0.68. Em situações onde o FAQ contradiz ou complementa documentos normativos, o LLM pode misturar as fontes sem hierarquia clara de confiabilidade.

**Categoria do problema:** Ruído semântico + risco de hallucination por fonte inadequada

**Causa raiz:**
O modelo de embeddings não diferencia a "autoridade" de uma fonte — trata FAQ informal e política normativa com o mesmo peso semântico. Como o FAQ usa linguagem coloquial próxima às perguntas dos clientes, ele tem alta similaridade semântica com as queries naturais, mas baixa confiabilidade de conteúdo.

**Proposta de correção:**
Adicionar metadado `{"confiabilidade": "normativo"|"informal"|"faq"}` em cada documento durante a ingestão. Na função `montar_prompt`, ordenar os chunks de forma que documentos normativos apareçam **antes** dos informais no contexto enviado ao LLM. Adicionar no system prompt: "Documentos marcados como [FAQ/informal] representam experiência prática da equipe, mas podem estar desatualizados. Quando um documento normativo (POL, PROC, SLA) contradiz o FAQ, use sempre o normativo e mencione a discrepância." Isso preserva o valor do FAQ (experiência prática, exceções conhecidas) sem deixar que ele sobreponha normas oficiais.

**Impacto esperado da correção:**
Redução de respostas inconsistentes em perguntas cobertas por documentos normativos. O FAQ passa a ser usado como complemento (ex: "na prática, o time orienta X") em vez de fonte primária.

**Prioridade:** Alta — risco de resposta desalinhada com política oficial em situações de atendimento ao cliente.

---

### Síntese Final

**1. O que você aprendeu sobre RAG que não sabia antes?**

RAG não é "colocar documentos num banco vetorial e fazer busca". O verdadeiro trabalho está na camada de preparação: a qualidade do chunking determina a qualidade da recuperação, e a qualidade da recuperação determina a qualidade da resposta. Aprendi que o problema mais crítico do RAG na prática não é o modelo de embeddings nem o LLM — é a qualidade e consistência da base documental. A NovaTech tem dois documentos contraditórios (PROC-042 v1 e v2) sem hierarquia definida, e isso é um problema de governança documental, não de tecnologia.

**2. RAG é mais parecido com engenharia de dados ou com chamada de API?**

É engenharia de dados com alto impacto visível. A chamada ao LLM é a parte mais simples — uma linha de código. O trabalho está em como os dados entram (chunking, embeddings, metadados), como são recuperados (parâmetros de busca, threshold, N), e como são apresentados ao modelo (ordem, formatação, system prompt). Cada decisão dessas equivale a uma decisão de pipeline de dados: schema, índice, query, transformação. Equipes que tratam RAG como "integração de API" produzem assistentes que alucinam; equipes que tratam como "pipeline de dados" produzem assistentes confiáveis.

**3. Se fosse continuar este protótipo para produção, qual seria o próximo problema a resolver?**

**Avaliação contínua com LLM-as-Judge + Golden Dataset.** O pipeline atual tem zero observabilidade em produção — não há como saber se as respostas estão corretas sem revisar manualmente. O próximo passo seria criar um golden dataset de 20–30 pares (pergunta, resposta esperada) derivados dos documentos e executar automaticamente a cada mudança na base documental ou no pipeline. Um LLM-as-Judge (Claude Haiku) avaliaria cada resposta em 4 dimensões: factual accuracy, source citation, guardrail compliance, e tone. Isso criaria um gate de qualidade automático para impedir que atualizações documentais degradem o assistente silenciosamente.
