# Tarefa 2.1.3 — Escrever `requirements.md` em SDD

## Objetivo
Usar o padrão SDD (Specification by Example / Structured Design Document) para escrever os requisitos do query endpoint do assistente NovaTech de forma **orientada a outcomes**, não a features técnicas.

## O Que É SDD?
Um SDD estrutura requisitos em 5 seções:
1. **Outcomes** — O que o usuário ganha ao final (não o que o sistema faz)
2. **Scope Boundaries** — O que está dentro e fora do escopo
3. **Constraints** — Limitações e restrições
4. **Prior Decisions** — Decisões já tomadas (ADRs da fase anterior)
5. **Verification Criteria** — Como saber se foi bem-sucedido (testável)

**Diferença:**
- ❌ Feature (errado): "O sistema deve buscar documentos no banco de dados RAG"
- ✓ Outcome (correto): "Um atendente consegue responder uma pergunta sobre SLA em menos de 30 segundos com confiança, citando fonte"

## Tarefa

### Passo 1: Estruturar Outcomes
A partir dos dados de discovery fornecidos e do bounded context "Atendimento ao Cliente":

1. **Outcome Primário:** O que o atendente/usuário ganha?
   - Exemplo: "Acesso rápido a informações sobre prazos, regras de frete, devoluções e SLAs"

2. **Outcomes Secundários:** Benefícios derivados
   - Exemplos: Redução de escalação, resposta consistente, conformidade com documentos oficiais

### Passo 2: Definir Scope Boundaries
Usando os bounded contexts da tarefa 2.1.1:

```markdown
## Scope Boundaries

### Está dentro do escopo:
- Responder perguntas sobre: [listar categorias]
- Cruzar informações entre: [contextos que se relacionam]
- Validar respostas contra: [documentos autoritários]

### Está fora do escopo:
- Tomar ações (ex: processar devolução)
- Modificar dados
- Atender a domínios não cobertos (ex: financeiro)
```

### Passo 3: Listar Constraints
A partir da spec da fase anterior e dos dados de discovery:

- **Tempo:** Resposta em < 30 segundos
- **Linguagem:** Português formal
- **Confiabilidade:** Nunca inventar valores numéricos
- **Fontes contraditórias:** Mostrar ambas as versões
- **Documentação:** Sempre citar source_document

### Passo 4: Referenciar Prior Decisions
Usando as ADRs da fase anterior (simuladas):

```markdown
## Prior Decisions

- **ADR-0001:** Azure OpenAI GPT-4o selecionado como LLM
- **ADR-0003:** Documentos contraditórios exibem ambas as versões
- **ADR-0004:** RAG pipeline (não custom search)
```

### Passo 5: Escrever Verification Criteria
Critérios testáveis pelo QA (não "funcionará bem"):

```markdown
## Verification Criteria

### Funcionalidade
- [ ] Responde pergunta sobre SLA Gold em < 30s com source_document
- [ ] Responde pergunta sobre frete especial citando versão de PROC-042
- [ ] Quando duas versões de documento existem, mostra ambas

### Confiabilidade
- [ ] Nunca inventa prazos ou multiplicadores
- [ ] Nunca afirma que carga perigosa pode ser devolvida
- [ ] Escalação é sugerida quando confiança < threshold

### Conformidade
- [ ] Toda resposta em português formal
- [ ] Toda resposta inclui campo source_document no JSON
```

## Entregável
Um arquivo `requirements.md` com formato SDD completo:
- [ ] Outcomes claros e orientados a usuário
- [ ] Scope boundaries que derivam dos bounded contexts
- [ ] Constraints específicos (tempo, linguagem, precisão)
- [ ] Prior decisions referenciando ADRs
- [ ] Verification criteria testáveis

## Critério de Sucesso
Um QA lendo este documento consegue:
1. Entender o que o assistente deveria fazer
2. Saber como testar se está fazendo
3. Identificar quando não atende aos requisitos
