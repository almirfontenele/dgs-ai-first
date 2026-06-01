# Tarefa 1.3.3 — Função de Montagem do Prompt Completo

## O que fazer

Implemente uma função Python que receba os chunks recuperados e a pergunta do usuário, e monte o prompt completo (system prompt + chunks + pergunta) pronto para enviar ao LLM.

## Pré-requisito

As tarefas [01](tarefa-01-ingestao.md) e [02](tarefa-02-busca.md) devem estar concluídas.

## Implementação

### Assinatura da Função

```python
def montar_prompt(pergunta: str, chunks: list[dict]) -> dict:
    """
    Monta o prompt completo para envio ao LLM.
    
    Retorna dict com:
    - system: instrução de sistema com guardrails
    - user: contexto dos chunks + pergunta do usuário
    - prompt_completo: versão concatenada para uso manual no chat
    """
```

### Estrutura do Prompt

O prompt deve ter três partes obrigatórias:

#### Parte 1 — System Prompt (guardrails)

```
Você é o Assistente de Suporte da NovaTech Logística.
Responda APENAS com base nos documentos fornecidos abaixo.
NUNCA invente prazos, valores ou informações não presentes nos documentos.
Se a informação não estiver nos documentos, diga explicitamente e sugira escalação.
Sempre cite qual documento/seção usou para responder.
Tom: formal, objetivo, em português.
```

#### Parte 2 — Contexto Recuperado (chunks)

```
=== DOCUMENTOS RELEVANTES ===

[Fonte: {fonte_do_chunk_1}]
{texto_do_chunk_1}

[Fonte: {fonte_do_chunk_2}]
{texto_do_chunk_2}

...

=== FIM DOS DOCUMENTOS ===
```

#### Parte 3 — Pergunta do Usuário

```
Pergunta: {pergunta}
```

### Implementação de Referência

```python
def montar_prompt(pergunta: str, chunks: list[dict]) -> dict:
    system = """Você é o Assistente de Suporte da NovaTech Logística.
Responda APENAS com base nos documentos fornecidos abaixo.
NUNCA invente prazos, valores ou informações não presentes nos documentos.
Se a informação não estiver nos documentos, diga explicitamente e sugira escalação para um supervisor.
Sempre cite qual documento/seção embasou sua resposta.
Tom: formal, objetivo, em português."""

    contexto = "=== DOCUMENTOS RELEVANTES ===\n\n"
    for chunk in chunks:
        contexto += f"[Fonte: {chunk['fonte']}]\n{chunk['texto']}\n\n"
    contexto += "=== FIM DOS DOCUMENTOS ==="

    user = f"{contexto}\n\nPergunta: {pergunta}"

    return {
        "system": system,
        "user": user,
        "prompt_completo": f"[SYSTEM]\n{system}\n\n[USER]\n{user}"
    }
```

## Pipeline Completo

Integre as três funções num fluxo único para uso nos testes:

```python
def pipeline_rag(pergunta: str) -> dict:
    chunks = buscar_chunks(pergunta, n_resultados=3)
    prompt = montar_prompt(pergunta, chunks)
    return {
        "pergunta": pergunta,
        "chunks_recuperados": chunks,
        "prompt": prompt
    }
```

## Verificação

- [ ] Função executa sem erros
- [ ] System prompt contém os guardrails obrigatórios
- [ ] Cada chunk no contexto tem sua fonte identificada
- [ ] Separadores entre chunks são claros
- [ ] `prompt_completo` pode ser copiado e colado diretamente no Claude chat
