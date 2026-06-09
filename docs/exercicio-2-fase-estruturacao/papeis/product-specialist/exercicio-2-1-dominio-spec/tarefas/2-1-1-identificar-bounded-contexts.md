# Tarefa 2.1.1 — Identificar Bounded Contexts

## Objetivo
Identificar e mapear os bounded contexts do assistente NovaTech, definindo claramente o que está dentro e fora de cada contexto e como eles se relacionam.

## O Que É um Bounded Context?
Um bounded context é uma fronteira clara que delimita um subdomínio. Para um assistente de logística:
- **Exemplo CORRETO:** "Atendimento ao Cliente" é um contexto (linguagem, regras, responsabilidades do assistente)
- **Exemplo ERRADO:** "Frontend/Backend" é uma divisão técnica, não um bounded context de domínio

## Tarefa

### Passo 1: Análise Inicial
Usando o Claude, analise a documentação da NovaTech (Anexo A) e identifique:

1. Quais são os **tipos de perguntas** que o assistente precisa responder?
   - Ex: perguntas sobre prazos, perguntas sobre regras de frete, etc.

2. Quais são os **domínios de conhecimento** implícitos nesses tipos?
   - Ex: "Logística de Frete", "Atendimento ao Cliente", etc.

3. Para **cada domínio**, defina:
   - **O que está dentro** (escopo, responsabilidades, regras)
   - **O que está fora** (o que o assistente não resolve)
   - **Como se relaciona com outros contextos** (dependências, handoffs)

### Passo 2: Estruturar o Mapa
Crie um documento estruturado com formato:

```markdown
## Bounded Context: [Nome]

**Definição:** [Uma frase clara do que é este contexto]

**Está dentro:**
- Responsabilidade 1
- Responsabilidade 2
- [...]

**Está fora:**
- O que o assistente não faz neste contexto
- [...]

**Relacionamento com outros contextos:**
- Recebe inputs de: [Contexto X]
- Fornece outputs para: [Contexto Y]
- Conflitos/handoffs: [...]
```

### Passo 3: Validação
Para cada bounded context, valide:
- [ ] Não é uma divisão técnica (Frontend/Backend, Banco de Dados, etc.)
- [ ] É coerente com o domínio de logística
- [ ] As responsabilidades estão bem definidas
- [ ] As fronteiras com outros contextos são claras

## Entregável
Um documento `bounded-contexts.md` com:
- Mapa visual (texto ou ASCII) mostrando a relação entre contextos
- Descrição estruturada de cada bounded context
- Lista de termos ubíquos preliminares para cada contexto

## Critério de Sucesso
Alguém familiarizado com a NovaTech, lendo seu mapa, consegue dizer: "Sim, nosso assistente precisa cobrir exatamente esses domínios dessa forma."
