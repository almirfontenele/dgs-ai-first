# Tarefa 1.1.4 — Estratégia de Chunking Justificada

## O que fazer

Defina uma estratégia de chunking que considere:
1. Os tipos de pergunta que usuários fazem (baseado no cenário da NovaTech)
2. O efeito "lost in the middle"
3. Os desafios identificados nas tarefas anteriores

## Contexto: Tipos de Pergunta do Usuário

Baseado no cenário da NovaTech, usuários podem fazer:

### Categoria A: Lookup Simples
```
"Qual é a taxa de frete para São Paulo?"
"Qual o prazo de entrega padrão?"
```

### Categoria B: Procedimento/Processo
```
"Quais são os passos para processar uma devolução?"
"Como funciona a aprovação de crédito?"
```

### Categoria C: Análise Comparativa
```
"Compare taxas de frete entre transportadoras."
"Qual a diferença entre os planos padrão e premium?"
```

### Categoria D: Contexto Agregado
```
"Qual é a situação geral de atrasos no nosso pipeline?"
"Resumo dos SLAs críticos"
```

## Estratégia de Chunking: Defina para Cada Categoria

### Estrutura da Resposta

```
## Categoria [Nome]

**Tamanho do Chunk:**
- [X tokens / Y palavras]

**Unidade Semântica:**
[O que define o limite do chunk: parágrafo? seção? tabela inteira?]

**Justificativa:**
- Tipo de pergunta exige: [contexto compacto / contexto rico / múltiplas perspectivas]
- Efeito lost in the middle: [Como o tamanho escolhido reduz o risco?]
- Exemplos de chunking bem-sucedido: [cenários concretos]

**Riscos:**
[O que pode dar errado com essa estratégia?]
```

## Critérios de Aceitação

- ✅ Estratégia diferenciada por tipo de pergunta (não "one-size-fits-all")
- ✅ Cada decisão justificada por: semântica da pergunta + lost in the middle
- ✅ Tamanhos de chunk concretos (não abstratos)
- ✅ Trade-offs explícitos (cobertura vs profundidade)
- ✅ Referência às dificuldades de cada tipo de fonte (tarefa 1.1.1)

## Dicas

- **Lookup Simples:** Chunks pequenos (150-300 tokens) cabem mais, menos chance de "ruído"
- **Procedimento:** Chunks médios (300-500 tokens) preservam sequência lógica
- **Comparativa:** Chunks que isolam cada opção (para ranking/comparação)
- **Agregado:** Chunks maiores (600-1000 tokens) com resumos/destaques
- **Lost in the Middle:** Se usa chunks de 500 tokens e cabem 100 no contexto, coloque os 2-3 mais relevantes NO INÍCIO e FIM, não no meio

## Próximas Tarefas

Quando terminar, passe para [Tarefa 1.1.5 — Síntese e Revisão com Claude](./tarefa-05-revisao-claude.md)
