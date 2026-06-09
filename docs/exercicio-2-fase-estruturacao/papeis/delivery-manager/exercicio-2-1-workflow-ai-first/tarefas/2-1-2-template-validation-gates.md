# Tarefa 2.1.2 — Criar Template de Validation Gates com Cowork

## Objetivo

Criar um template de checklist de validation gates — pontos obrigatórios onde um humano revisa e aprova antes de avançar. O template deve ser interativo (usando Cowork) para que o time possa preenchê-lo colaborativamente.

## Contexto

Validation gates são os checkpoints críticos onde controle humano substitui confiança cega em IA. O exercício 2.1.1 identificou o workflow; agora você formaliza os gates em um template que pode ser usado em projeto real.

**Gates principais:**
1. Spec → Plan: Quem aprova a spec antes de gerar o plano?
2. Tasks → Implement: Quem valida que as tasks fazem sentido?
3. Code → Merge: Quem faz code review?
4. Tests → Deploy: Quem valida que os testes são suficientes?

## Ferramentas a Utilizar

- **Claude Cowork:** Para criar template colaborativo
- **Claude:** Para refinar e documentar

## Inputs

1. O arquivo `workflow.md` da tarefa anterior
2. Os 4 gates principais listados acima
3. A necessidade de que o template seja preenchível por alguém do time

## Entregável

Um template de checklist que:

1. **É visual e preenchível** — Use Cowork para criar um template que o time consiga preencher
2. **Cobre 4+ gates:**
   - Gate 1: Spec → Plan (quem aprova requirements antes de gerar plan?)
   - Gate 2: Plan → Tasks (quem aprova plan antes de gerar tasks?)
   - Gate 3: Tasks → Implement (quem aprova tasks antes de começar implementação?)
   - Gate 4: Code → Merge (quem faz code review antes de merge?)
   - Gate 5: Tests → Deploy (quem valida testes antes de deploy?)

3. **Para cada gate, inclua campos:**
   - Quem aprova
   - O que verifica (checklist de critérios)
   - Tempo máximo para aprovação
   - O que acontece se reprovar (retry, escalation, etc)

4. **Seja específico ao projeto** — Use NovaTech como exemplo

## Critérios de Aceite

- [ ] Template criado em Cowork (ou estruturado para ser preenchido colaborativamente)
- [ ] Pelo menos 4 gates documentados
- [ ] Cada gate tem: quem aprova, critérios, tempo, consequência de rejeição
- [ ] Critérios são específicos (não "revisar bem", mas "validar que requirements têm acceptance criteria")
- [ ] Template é executável por alguém do time (não precisa de especialista para entender)

## Dicas

- Use Claude para brainstorm sobre quais gates são críticos
- Use Cowork para criar um template que o time consegue preencher
- Pense em "o que dá errado" em cada transição (spec ambígua, tasks mal definidas, etc)
- Valide que cada gate faz sentido para o fluxo (não adicione gates "para ter gates")

## Como Começar

1. Use Claude para listar os 4-5 gates principais
2. Use Claude para definir critérios concretos para cada gate
3. Use Cowork para estruturar como um template colaborativo
4. Documente em prosa clara

## Entrega

Coloque os arquivos em: `docs/exercicio-2-fase-estruturacao/papeis/delivery-manager/exercicio-2-1-workflow-ai-first/`

- `validation-gates-template.md` — Documento com template
- Captura/screenshot do Cowork se usado para colaboração visual

**Próxima tarefa:** [2.1.3 — Definir Detalhes de Cada Gate](2-1-3-definir-detalhes-gates.md)
