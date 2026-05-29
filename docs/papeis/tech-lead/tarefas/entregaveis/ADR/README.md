# ADRs — Assistente de Atendimento NovaTech (RAG)

Architecture Decision Records para o pipeline de RAG do assistente de atendimento da NovaTech. Cada ADR é independente e autossuficiente.

## Índice

| ADR | Título | Status |
|-----|--------|--------|
| [ADR-0001](ADR-0001-escolha-llm.md) | Escolha do Modelo de LLM — Azure OpenAI (GPT-4o) | Aceito |
| [ADR-0002](ADR-0002-gerenciamento-contexto.md) | Estratégia de Gerenciamento de Contexto no Pipeline RAG | Aceito |
| [ADR-0003](ADR-0003-documentos-contraditorios.md) | Tratamento de Documentos Contraditórios | Aceito |
| [ADR-0004](ADR-0004-build-vs-buy-pipeline-rag.md) | Build vs Buy para o Pipeline de RAG | Aceito |

## Dependências entre ADRs

```
ADR-0001 (LLM) ←── ADR-0002 (Contexto)   [orçamento de tokens depende da janela do modelo]
ADR-0004 (Stack) ←── ADR-0002 (Contexto)  [abstração de interface do retriever definida em ADR-0004]
ADR-0003 (Contradições) ←── ADR-0002     [modo de contradição injeta instrução dinâmica no contexto]
```

## Fonte da verdade

Documentação base: `docs/anexo-a-documentacao-simulada-novatech.md`
