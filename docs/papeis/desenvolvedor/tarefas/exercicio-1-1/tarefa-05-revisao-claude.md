# Tarefa 1.1.5 — Síntese e Revisão com Claude

## O que fazer

Consolide sua análise das tarefas anteriores e submeta-a ao Claude para revisão crítica.

## Passo 1: Síntese do Seu Trabalho

Crie um documento `analise-tecnica-draft.md` que integre:

```
# Análise Técnica: Viabilidade do Assistente NovaTech RAG

## 1. Desafios por Tipo de Fonte
[Consolidar saída da Tarefa 1.1.1]

## 2. Estimativa de Tamanho da Base
[Consolidar saída da Tarefa 1.1.2]

## 3. Orçamento de Contexto
[Consolidar saída da Tarefa 1.1.3]

## 4. Estratégia de Chunking
[Consolidar saída da Tarefa 1.1.4]

## 5. Conclusões e Recomendações
[Seu resumo final: é viável? Que riscos? Que trade-offs?]
```

## Passo 2: Submeta ao Claude para Revisão

Use o prompt abaixo ao conversar com Claude:

```
Você é um arquiteto de RAG sênior. Recebeu a análise técnica abaixo 
de um desenvolvedor junior sobre a viabilidade de um assistente RAG 
para a NovaTech.

[COLE SEU DOCUMENTO]

Sua tarefa: faça uma revisão crítica e HONESTA. Identifique:

1. **Pontos fracos na análise:**
   - Estimativas que parecem otimistas demais
   - Suposições não justificadas
   - Riscos não considerados

2. **Lacunas técnicas:**
   - Conceitos mal entendidos ou faltantes
   - Decisões de design que não consideram casos extremos
   - Impactos não calculados

3. **Questões para aprofundamento:**
   - O que você não explorou o suficiente?
   - Quais cenários você testaria antes de produção?

Forneça feedback construtivo, não apenas crítica.
```

## Passo 3: Incorpore o Feedback

Com base na revisão do Claude:

1. **Identifique os 3 pontos de melhoria mais importantes**
2. **Revise sua análise** incorporando essas melhorias
3. **Documente as mudanças** (o que mudou e por quê)

## Passo 4: Documenta o Histórico de Iteração

Crie `historico-iteracoes.md`:

```markdown
# Histórico de Iteração com Claude

## Iteração 1 → 2

**Feedback recebido:**
- [Ponto 1]
- [Ponto 2]
- [Ponto 3]

**Mudanças aplicadas:**
- [Mudança 1]: Antes... Depois...
- [Mudança 2]: Antes... Depois...

**Impacto:**
[Como isso afetou a análise? Ficou melhor? Por quê?]
```

## Critérios de Aceitação

- ✅ Documento de síntese bem estruturado e legível
- ✅ Feedback do Claude capturado com especificidade (não genérico)
- ✅ Pelo menos 3 mudanças de melhoria documentadas
- ✅ Análise final incorpora o feedback e é justificada
- ✅ Histórico de iteração demonstra evolução concreta do documento

## Entregáveis Finais

Quando terminar, você deve ter:

1. **analise-tecnica-draft.md** (versão inicial)
2. **analise-tecnica-final.md** (versão após feedback)
3. **historico-iteracoes.md** (documentar o processo)
4. **conversas-com-claude.txt** ou semelhante (evidência do feedback)

## Dicas

- **Honestidade com Claude:** Peça crítica honesta, não validação. Claude vai entender que é para melhorar
- **Especificidade:** Não aceite feedback genérico ("isso está vago"). Peça exemplos concretos
- **Iteração iterativa:** Se Claude apontar algo, faça a mudança E submeta de novo para validação
- **Documentação:** A iteração é tão importante quanto o resultado. Mostre seu processo de melhoria

## Próximas Tarefas

Parabéns! Você completou o exercício 1.1. 

Verifique o [README.md](./README.md) para próximas etapas do exercício.
