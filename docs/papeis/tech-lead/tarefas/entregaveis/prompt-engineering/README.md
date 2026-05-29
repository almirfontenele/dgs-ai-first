# Entregáveis — Exercício 1.2: Prompt Engineering

**Exercício:** 1.2 — Design de prompt engineering como artefato de arquitetura  
**Papel:** Tech Lead  
**Data:** 2026-05-29

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| [estrategia-prompt-engineering.md](./estrategia-prompt-engineering.md) | Documento principal: governança de prompts, anatomia de contexto, orçamento de tokens, system prompt v1.0, e matriz de enforcement probabilístico vs determinístico |
| [test_prompts.py](./test_prompts.py) | Script de teste automatizado: 6 casos de teste baseados nos chunks reais do Anexo B, harness de verificações determinísticas, suporte a dry-run e chamada real ao Azure OpenAI |

## Como executar os testes

```bash
# Dry-run (sem chamar o LLM — usa respostas simuladas)
python test_prompts.py --dry-run --verbose

# Filtrar por categoria
python test_prompts.py --dry-run --tags guardrail

# Modo real (requer variáveis de ambiente)
export AZURE_OPENAI_ENDPOINT=https://...
export AZURE_OPENAI_API_KEY=...
python test_prompts.py --prompt system-prompt-v1.0.md
```

## Decisões de arquitetura relacionadas

- [ADR-0001](../ADR/ADR-0001-escolha-llm.md) — Azure OpenAI GPT-4o como LLM
- [ADR-0003](../ADR/ADR-0003-documentos-contraditorios.md) — Tratamento de documentos contraditórios
