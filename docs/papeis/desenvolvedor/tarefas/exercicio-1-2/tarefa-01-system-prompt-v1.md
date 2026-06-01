# Tarefa 1.2.1 — Escrita do System Prompt v1

## O que fazer

Escreva um system prompt completo para o assistente de suporte da NovaTech. O prompt deve incorporar os guardrails definidos e o contexto do projeto, organizado em seções claras.

## Guardrails Obrigatórios

Seu prompt DEVE incluir estas restrições:

1. **Sempre cite a fonte** — Se responde baseado em um chunk, citar qual documento/seção
2. **Nunca invente dados** — Não criar prazos, valores ou informações fora da documentação
3. **Escalação clara** — Quando não encontrar resposta, dizer explicitamente e sugerir escalação para supervisor
4. **Tom formal mas acessível** — Português formal, mas fácil de entender

## Estrutura do Prompt

Seu system prompt deve ter estas seções em ordem:

### 1. Identidade
```
Quem você é? 
Qual seu propósito no contexto da NovaTech?
Exemplo: "Você é o Assistente de Suporte da NovaTech..."
```

### 2. Comportamento e Guardrails
```
Como você se comporta?
O que você NUNCA faz?
Qual o tom esperado?
```

### 3. Instruções para Contexto Recuperado (Chunks)
```
Como você usa a documentação fornecida?
O que fazer se a documentação não cobre a pergunta?
Prioridade entre diferentes tipos de documento?
```

### 4. Formato de Resposta
```
Como estruturar respostas?
Incluir citação de fonte em toda resposta?
Como sinalizar incerteza ou desconhecimento?
```

### 5. Exemplos (Opcional mas Recomendado)
```
Exemplos de respostas boas para diferentes cenários
```

## Template Sugerido

```markdown
# System Prompt - Assistente de Suporte NovaTech v1

## 1. Identidade e Propósito
[Sua descrição]

## 2. Guardrails
### 2.1 Citação de Fontes
[Como você cita fontes]

### 2.2 Integridade de Dados
[Como você lida com dados não documentados]

### 2.3 Escalação
[Como você sinaliza quando não sabe]

### 2.4 Tom e Linguagem
[Seu estilo de comunicação]

## 3. Instrções para Uso de Chunks
[Como processar a documentação fornecida]

## 4. Formato de Resposta
[Estrutura esperada das respostas]

## 5. Casos Especiais
[Situações que requerem comportamento especial]
```

## Critérios de Aceitação

- ✅ Prompt é específico, não genérico ("você é um assistente útil" NÃO é suficiente)
- ✅ Todos os 4 guardrails estão incorporados explicitamente
- ✅ Seções estão em ordem clara (identidade → regras → contexto → formato)
- ✅ Instruções sobre chunks são claras (como usar, como priorizar, quando escalar)
- ✅ Tom e linguagem esperados estão definidos
- ✅ Prompt é pronto para ser testado (legível, executável)

## Dicas

- **Seja específico:** "Cite sempre a fonte do chunk" é melhor que "mencione onde você achou a informação"
- **Use exemplos:** Até prompts devem ter exemplos de saída esperada
- **Ordem importa:** Os primeiros elementos do prompt têm mais peso na atenção do LLM. Coloque restrições críticas primeiro
- **Chunks:** Deixe claro como os chunks serão fornecidos (formato, estrutura)
- **Limites:** Defina explicitamente o que fazer nos limites (contexto cheio, pergunta fora do escopo, etc)

## Próximas Tarefas

Quando terminar, passe para [Tarefa 1.2.2 — Mapeamento de Contexto Estático/Dinâmico](./tarefa-02-mapeamento-contexto.md)
