# Tarefa 1.3.5 — Identificação de Problemas e Propostas de Correção

## O que fazer

Com base nos resultados dos testes da tarefa anterior, identifique ao menos **2 problemas reais** encontrados no pipeline e proponha correções concretas com raciocínio técnico.

## Pré-requisito

[Tarefa 04](tarefa-04-testes.md) concluída com os 5 testes documentados.

## Categorias de Problemas Comuns em RAG

Use como guia para identificar o que deu errado nos seus testes:

| Categoria | Exemplo de Sintoma |
|---|---|
| **Chunking inadequado** | Tabela de SLA cortada ao meio; chunk começa no meio de uma frase; contexto importante separado em dois chunks |
| **Recuperação incorreta** | Documento irrelevante no topo; chunk correto fora do top-3; score alto mas conteúdo errado |
| **Ruído semântico** | Pergunta sobre prazo recupera chunks de preço porque ambos têm números |
| **Perda de contexto** | Resposta correta mas incompleta porque a regra estava dividida em 2 chunks separados |
| **Hallucination por lacuna** | Claude inventou informação porque o chunk recuperado era parcial ou ambíguo |
| **Metadado ausente** | Resposta não citou fonte porque o campo `fonte` estava vazio ou incorreto |

## Template de Análise por Problema

Para **cada problema** identificado:

```
### Problema [N]: [Título descritivo]

**Teste onde ocorreu:** Teste [número] — "[pergunta]"

**O que aconteceu:**
[Descreva concretamente o que foi observado: qual chunk foi recuperado, qual era o correto, 
qual foi a resposta errada, etc.]

**Categoria do problema:** [da tabela acima]

**Causa raiz:**
[Por que isso aconteceu? Ex: "A estratégia de chunking por parágrafo dividiu a tabela de SLA 
em dois chunks — a linha de cabeçalho ficou em um chunk e os valores em outro, 
fazendo a busca retornar apenas o cabeçalho sem os valores."]

**Proposta de correção:**
[Descrição técnica concreta do que mudar. Ex: "Usar chunking híbrido: detectar linhas de tabela 
(iniciadas com '|') e manter o bloco de tabela inteiro como um único chunk, 
independente do tamanho máximo definido."]

**Impacto esperado da correção:**
[O que melhora com a correção? Ex: "Perguntas sobre SLA passarão a recuperar o chunk completo 
da tabela, eliminando respostas incompletas."]

**Prioridade:** Alta / Média / Baixa
```

## Síntese Final

Ao analisar os problemas, responda:

```
## Lição Principal do Exercício

1. O que você aprendeu sobre RAG que não sabia antes?
   [Resposta livre]

2. RAG é mais parecido com engenharia de dados ou com chamada de API? Por quê?
   [Reflexão sobre o exercício]

3. Se você fosse continuar este protótipo para produção, qual seria o próximo problema
   a resolver?
   [Proposta técnica]
```

## Verificação

- [ ] Ao menos 2 problemas documentados com causa raiz identificada
- [ ] Propostas de correção são específicas (não genéricas como "melhorar o chunking")
- [ ] Síntese final respondida
- [ ] Conexão clara entre problema observado nos testes e a proposta de correção
