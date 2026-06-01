# Tarefa 1.2.4 — Análise Crítica das Respostas

## O que fazer

Analise cada uma das 3 respostas obtidas na Tarefa 1.2.3 criticamente. Identifique acertos, erros e por que aconteceram.

## Template de Análise por Pergunta

Para cada uma das 3 perguntas, crie uma seção assim:

```markdown
## Pergunta X: [Título da Pergunta]

### Resposta Obtida
[Copie a resposta do Claude]

### Análise: Acertos
- ✅ [Acerto 1]: [Por quê isso é correto?]
- ✅ [Acerto 2]: ...

### Análise: Erros/Pontos Fracos
- ❌ [Erro 1]: O que deveria ser? Por quê errou?
- ⚠️ [Ponto Fraco 1]: O que funcionou parcialmente?

### Root Cause (Por quê errou)
Analize **por que o assistente** cometeu esse erro:
- É ambigüidade no system prompt?
- É falta de clareza nas instruções?
- É ordem das informações (lost in the middle)?
- É incompletude dos chunks?
- É falha do LLM (alucinação)?

### Nota para Iteração
Como você corrigiria no prompt v2?
```

## Exemplo Concreto

Vamos usar a **Pergunta 1** como exemplo:

```markdown
## Pergunta 1: Devoluções de Carga Perigosa

### Resposta Obtida
[Suponha que o Claude respondeu: "Mercadorias podem ser devolvidas em até 7 dias úteis."]

### Análise: Acertos
- ✅ Citou o prazo (7 dias úteis)
- ✅ Usou informação do chunk A

### Análise: Erros/Pontos Fracos
- ❌ ERRO CRÍTICO: Não mencionou a exceção de cargas perigosas
- ❌ A resposta está INCORRETA porque cargas perigosas NÃO podem ser devolvidas
- ⚠️ Não esclareceu que essa política tem restrições

### Root Cause
O sistema prompt mencionou guardrails mas NÃO deu instrução explícita:
"Se a documentação menciona exceções, SEMPRE destaque-as na resposta"
O chunk A contém a palavra "exceto" mas o assistente ignorou

### Nota para Iteração v2
Adicionar ao prompt: "Sempre identifique e destaque exceções e restrições. 
Se a política tem 'exceto', a resposta DEVE mencionar o 'exceto'."
```

## Análise Consolidada

Após analisar as 3 perguntas, crie uma seção de síntese:

```markdown
# Análise Consolidada - v1

## Padrão de Erros
[Quais erros se repetem? Ex: "O assistente tende a ignorar exceções"]

## Padrão de Acertos
[Quais comportamentos funcionaram bem? Ex: "Citations foram consistentes"]

## Avaliação vs Guardrails

### Guardrail 1: Sempre citar fonte
- Status: ✅ Funcionou / ⚠️ Parcial / ❌ Falhou
- Evidência: [Qual pergunta quebrou? Qual não quebrou?]

### Guardrail 2: Nunca inventar dados
- Status: ✅ / ⚠️ / ❌
- Evidência: [O assistente inventou algo? Onde?]

### Guardrail 3: Escalação clara
- Status: ✅ / ⚠️ / ❌
- Evidência: [Ofereceu escalação quando não sabia?]

### Guardrail 4: Tom formal mas acessível
- Status: ✅ / ⚠️ / ❌
- Evidência: [Exemplos do tom usado]

## Score de Acerto (v1)
```
Pergunta 1 (Carga Perigosa):  [X]/10  - [Explicação]
Pergunta 2 (SLA Gold):        [X]/10  - [Explicação]
Pergunta 3 (Frete Manaus):    [X]/10  - [Explicação]
___________________________________________________________
MÉDIA v1:                     [X]/10
```

## Hipóteses de Melhoria
Liste 3 mudanças que você acha que vão melhorar o prompt:
1. [Mudança 1 proposta]: Por que vai funcionar?
2. [Mudança 2 proposta]: Por que vai funcionar?
3. [Mudança 3 proposta]: Por que vai funcionar?
```

## Critérios de Aceitação

- ✅ Análise linha-a-linha de cada resposta
- ✅ Identifica acertos E erros (não só aponta erros)
- ✅ Root cause analysis (por quê, não só o quê)
- ✅ Cada guardrail avaliado explicitamente
- ✅ Hipóteses de melhoria são concretas e testáveis
- ✅ Score numérico justificado

## Dicas

- **Seja rigoroso:** Uma resposta que está "quase certa" é errada
- **Contexto é informação:** Se o chunk mencionou algo e o assistente ignorou, isso é erro do prompt
- **Root cause é tudo:** "Errou porque" é mais valioso que "errou em"
- **Guardrails são metricas:** Use-os para avaliar, não só opinião pessoal

## Próximas Tarefas

Quando terminar, passe para [Tarefa 1.2.5 — Iteração v2](./tarefa-05-iteracao-v2.md)
