# Tarefa 2.1.3 — Definir Detalhes Executáveis de Cada Gate

## Objetivo

Expandir o template de validation gates (tarefa 2.1.2) com detalhes suficientes para que qualquer membro do time saiba exatamente o que fazer quando chega em um gate. Não pode ser vago — tem que ser executável.

## Contexto

Um validation gate genérico ("revisar antes de continuar") é inútil. Gates executáveis têm:
- Quem exatamente aprova
- Quais critérios verificar (checklist)
- Quanto tempo tem para decidir
- O que acontece se der "não" (rejeição)
- O que acontece se der "sim" (próximo passo)

## Ferramentas a Utilizar

- **Claude:** Para refinar critérios e estrutura

## Inputs

1. O arquivo `validation-gates-template.md` da tarefa anterior
2. O arquivo `workflow.md` da tarefa 2.1.1
3. Os validation gates simulados fornecidos no exercício:
   ```
   Gate 1 — Spec → Plan: PS aprova requirements.md antes do TL gerar o plan.
   Gate 2 — Tasks → Implement: TL aprova tasks.md antes do Dev iniciar.
   Gate 3 — Code → Merge: TL faz code review; PR precisa de 1 approval.
   Gate 4 — Tests → Deploy: QA valida cobertura e cenários; TL aprova deploy.
   ```

## Entregável

Um documento `gates-detalhado.md` que, para **cada gate**, especifica:

### Template para cada gate:

```
## Gate [N]: [Nome]

**Transição:** [De estado] → [Para estado]  
**Quem aprova:** [Papel específico, ex: "Tech Lead"]  
**Documento/Artefato:** [Arquivo que é revisado, ex: "requirements.md"]

### Critérios de Aprovação

- [ ] [Critério 1 - testável e específico]
- [ ] [Critério 2]
- [ ] [Critério n]

### Tempo Máximo

[X] horas / dias para decisão

### Se Aprovar ✅

1. [Próximo passo automático]
2. [Quem notificar]
3. [Qual ferramenta usar para documentar]

### Se Reprovar ❌

1. [Quem notificar]
2. [O que fazer com o trabalho já feito]
3. [Processo para resubmeter]

### Exemplo (do projeto NovaTech)

[Um exemplo real ou simulado]
```

## Exemplos de Critérios Específicos vs Vagos

### ❌ Vago:
- "Revisar o código"
- "Validar a spec"
- "Verificar os testes"

### ✅ Específico:
- "Code review: verificar (1) sem dead code, (2) nomes descritivos, (3) sem logs de debug, (4) funções < 15 linhas"
- "Spec review: verificar (1) cada requisito tem acceptance criteria, (2) nenhuma contradição com documentação existente, (3) estimativa de esforço"
- "Test review: verificar (1) cobertura > 80%, (2) pelo menos 1 teste por cenário crítico, (3) testes têm nomes descritivos"

## Critérios de Aceite

- [ ] Pelo menos 4 gates detalhados
- [ ] Cada gate tem seções: transição, quem aprova, critérios, tempo, se sim, se não
- [ ] Critérios são **testáveis** (não subjective como "bom" ou "claro")
- [ ] Tempo para aprovação é realista (não "1 minuto" ou "nunca")
- [ ] Processo de rejeição é claro (não deixa ambiguidade)
- [ ] Inclui pelo menos 1 exemplo real ou simulado por gate

## Dicas

- Pense em "como um bot checaria isso?" — se um bot pudesse fazer, é objetivo demais?
- Converse com Tech Lead sobre quanto tempo realista leva para code review
- Inclua critérios que você aprendeu com incidentes passados (ex: "sempre validar que spec menciona dados sensíveis")
- Use linguagem do projeto (ex: "requirements.md em SDD", "não "spec"")

## Como Começar

1. Use Claude para expandir cada gate do template anterior
2. Para cada gate, liste 3-5 critérios específicos e testáveis
3. Valide contra a realidade do projeto (essas pessoas existem? esse tempo é realista?)
4. Estruture em prosa clara

## Entrega

Coloque o arquivo em: `docs/exercicio-2-fase-estruturacao/papeis/delivery-manager/exercicio-2-1-workflow-ai-first/gates-detalhado.md`

**Próximo exercício:** [Exercício 2.2 — Governança de Specs](../exercicio-2-2-governanca-specs/README.md)
