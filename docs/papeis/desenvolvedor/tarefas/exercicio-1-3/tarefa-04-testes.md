# Tarefa 1.3.4 — Testes com 5 Perguntas e Avaliação das Respostas

## O que fazer

Teste o pipeline RAG completo com ao menos 5 perguntas do mapa de cobertura do Anexo B. Para cada pergunta, documente os chunks recuperados, compare com o gabarito, e avalie a resposta obtida via Claude chat.

## Pré-requisito

Pipeline completo funcionando ([tarefas 01–03](README.md)).

## Perguntas de Teste

Use perguntas do Anexo B. As perguntas abaixo são sugeridas por cobrirem casos distintos:

| # | Pergunta | Tipo de desafio |
|---|---|---|
| P1 | Qual o prazo de entrega para cargas normais na rota SP–RJ? | Busca em tabela de SLA |
| P2 | Como proceder com a devolução de carga perigosa? | Exceção / regra específica |
| P3 | Qual o valor da tarifa para 500 kg de carga fracionada? | Cálculo com tabela de preços |
| P4 | O que acontece se a entrega atrasar além do SLA Gold? | Combinação de regras |
| P5 | Quais documentos são necessários para despacho internacional? | Multi-documento |

> Adapte as perguntas conforme os documentos reais do Anexo A. O importante é cobrir ao menos: busca em tabela, exceção/regra de negócio, e um caso multi-documento.

## Template de Documentação por Pergunta

Para **cada pergunta**, preencha:

```
### Teste [N]: [Pergunta]

**Pergunta:** [texto completo]

**Chunks recuperados:**
| Rank | Fonte | Score | Primeiros 100 chars do chunk |
|------|-------|-------|------------------------------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

**Gabarito (Anexo B):** Chunks esperados: [liste os IDs/seções esperadas]

**Avaliação da recuperação:**
- [ ] Chunks corretos recuperados
- [ ] Chunks incorretos/irrelevantes no resultado
- Observação: [o que estava certo/errado na recuperação]

**Resposta do Claude:**
[Cole aqui a resposta obtida ao enviar o prompt_completo no Claude chat]

**Avaliação da resposta:**
- [ ] Resposta correta (bate com o gabarito)
- [ ] Citou a fonte do documento
- [ ] Respeitou os guardrails (não inventou informação)
- [ ] Tom adequado (formal, em português)
- Observação: [o que estava certo/errado na resposta]
```

## Consolidação dos Resultados

Ao final dos 5 testes, preencha a tabela de resumo:

| Teste | Chunks corretos? | Resposta correta? | Citou fonte? | Guardrails OK? |
|---|---|---|---|---|
| P1 | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| P2 | | | | |
| P3 | | | | |
| P4 | | | | |
| P5 | | | | |
| **Total** | /5 | /5 | /5 | /5 |

## Dica de Eficiência

Execute todos os testes de uma vez com o pipeline:

```python
perguntas = [
    "Qual o prazo de entrega para cargas normais na rota SP–RJ?",
    "Como proceder com a devolução de carga perigosa?",
    # ... demais perguntas
]

for i, pergunta in enumerate(perguntas, 1):
    resultado = pipeline_rag(pergunta)
    print(f"\n=== TESTE {i} ===")
    print(f"Pergunta: {pergunta}")
    for j, chunk in enumerate(resultado["chunks_recuperados"], 1):
        print(f"  Chunk {j}: score={chunk['score']:.3f} | fonte={chunk['fonte']}")
    print("\n--- PROMPT COMPLETO (cole no Claude) ---")
    print(resultado["prompt"]["prompt_completo"])
```

## Verificação

- [ ] 5 perguntas testadas e documentadas
- [ ] Comparação com gabarito do Anexo B realizada para cada teste
- [ ] Respostas do Claude obtidas e avaliadas
- [ ] Tabela de resumo preenchida
