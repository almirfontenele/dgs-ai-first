# Tarefa 1.2.3 — Teste com Perguntas Reais

## O que fazer

Teste o system prompt criado na Tarefa 1.2.1 usando Claude como ambiente de teste. Você simulará ser um usuário fazendo perguntas ao assistente.

## Passo 1: Preparar o Teste

Abra uma **conversa nova** no Claude (chat.anthropic.com) para evitar contaminação com conversas anteriores.

Copie e cole este prompt como mensagem inicial:

```
[COLE AQUI SEU SYSTEM PROMPT V1 COMPLETO]

CHUNKS FORNECIDOS:

Chunk A - POL-001 Devolução:
"Política de Devolução POL-001, seção 3.2: Mercadorias podem ser devolvidas em até 7 dias úteis após o recebimento, exceto cargas classificadas como perigosas (classes 1 a 6 da ANTT). O cliente deve abrir chamado no portal e anexar fotos da mercadoria."

Chunk B - SLA-2024:
"Tabela SLA-2024: Cliente Gold — resposta em até 2h, resolução em até 24h. Cliente Silver — resposta em até 4h, resolução em até 48h. Cliente Standard — resposta em até 8h, resolução em até 72h."

Chunk C - PROC-042 Frete Especial:
"PROC-042-v2, seção 2: Frete especial para cargas acima de 500kg: valor base × multiplicador regional. Região Sul: 1.3. Região Sudeste: 1.1. Região Norte: 1.8. Região Nordeste: 1.5. Região Centro-Oeste: 1.4."
```

## Passo 2: Faça as 3 Perguntas de Teste

Em sequência, faça exatamente estas perguntas (como se fosse um cliente/usuário):

### Pergunta 1: Devoluções de Carga Perigosa
```
Qual o prazo de devolução para carga perigosa?
```

**Resposta esperada:**
- ✅ Citar que cargas perigosas (classes 1-6 ANTT) **NÃO podem ser devolvidas**
- ✅ Citar fonte: POL-001, seção 3.2
- ✅ Oferecer escalação ou próximos passos

**Resposta ERRADA seria:**
- ❌ Dizer "7 dias úteis" (ignorar exceção)
- ❌ Não citar fonte
- ❌ Inventar alternativas não documentadas

### Pergunta 2: SLA de Cliente Gold
```
Meu cliente é Gold, qual o SLA de resolução?
```

**Resposta esperada:**
- ✅ Especificar: "resolução em até 24 horas"
- ✅ Diferenciar resposta (2h) de resolução (24h) se possível
- ✅ Citar fonte: SLA-2024

### Pergunta 3: Frete para Manaus
```
Quanto custa o frete para 600kg para Manaus?
```

**Resposta esperada:**
- ✅ Reconhecer que Manaus está na Região Norte
- ✅ Citar o multiplicador: 1.8
- ✅ Indicar que não tem o "valor base" para calcular o total
- ✅ Citar fonte: PROC-042-v2
- ✅ **Importante:** Não inventar um valor final (erro típico!)

## Passo 3: Capturar as Respostas

Para cada pergunta, salve:
1. A pergunta exata que fez
2. A resposta completa do Claude
3. A fonte (URL da conversa ou screenshot)

Crie um arquivo `teste-v1-respostas.md`:

```markdown
# Teste v1 - Respostas do Claude

## Pergunta 1: Devoluções de Carga Perigosa
**Input:** [Copie a pergunta]
**Output:** [Copie a resposta do Claude]
**Fonte:** [Link da conversa ou timestamp]

## Pergunta 2: SLA de Cliente Gold
**Input:** [Copie a pergunta]
**Output:** [Copie a resposta do Claude]
**Fonte:** [Link da conversa ou timestamp]

## Pergunta 3: Frete para Manaus
**Input:** [Copie a pergunta]
**Output:** [Copie a resposta do Claude]
**Fonte:** [Link da conversa ou timestamp]
```

## Passo 4: Documentar o Experimento

Crie um arquivo `teste-v1-setup.md` descrevendo:

```markdown
# Setup do Teste v1

**Data do teste:** [2026-06-01]
**LLM usado:** Claude (versão: ?)
**Ambiente:** Chat.anthropic.com ou IDE?

**System Prompt usado:** [Referência ao arquivo]
**Chunks fornecidos:** 3 chunks conforme tarefa 1.2.3

**Metodologia:**
1. Conversa nova (sem histórico prévio)
2. System prompt colado na primeira mensagem
3. Chunks fornecidos logo após
4. Perguntas feitas em sequência
5. Respostas capturadas integralmente
```

## Critérios de Aceitação

- ✅ Teste realizado com Claude real (não simulado)
- ✅ Todas as 3 perguntas foram feitas e respondidas
- ✅ Respostas capturadas integralmente (não resumidas)
- ✅ Setup documentado (data, ambiente, versão do LLM)
- ✅ Fonte das respostas rastreável

## Dicas

- **Uma conversa por teste:** Cada versão do prompt em uma conversa nova
- **Copie integralmente:** Não resuma nem reformule a resposta do Claude. Quer ver o comportamento real
- **Screenshot é válido:** Se não conseguir copiar, tire screenshot e salve como imagem
- **Preservar histórico:** Guarde o link da conversa ou exporte o histórico

## Próximas Tarefas

Quando terminar, passe para [Tarefa 1.2.4 — Análise Crítica](./tarefa-04-analise-critica.md)
