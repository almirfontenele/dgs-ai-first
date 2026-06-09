# Exercício 2.3 — Contribuição ao AGENTS.md: Project Management Rules

## Contexto

O Tech Lead está montando o `AGENTS.md` do repositório — um documento que agentes de IA (e desenvolvedores) consultam para entender regras do projeto. Cada papel contribui com a seção que lhe diz respeito.

Sua contribuição como Delivery Manager é a seção **"Project Management Rules"** — regras que definem:
1. Como tasks e issues são nomeadas e organizadas
2. Como decisões são documentadas (ADRs)
3. Como validation gates funcionam (referência aos gates de 2.1)
4. Restrições de comunicação que afetam artefatos (idiomas, formatos, etc)

## Ferramentas a Utilizar

- Claude (chat)

## Inputs Fornecidos

### Contexto Base
- O cenário completo
- A estrutura do repositório do projeto (ver **Anexo C**)

### Seção Proposta do AGENTS.md

```
# AGENTS.md — NovaTech Assistant

## Project Overview
## Tech Stack & Architecture
## Coding Standards (Tech Lead)
## Product Rules & Guardrails (Product Specialist)
## Testing Standards (QA)
## Project Management Rules (← SEU CONTEÚDO)
## Build & Deploy
```

### Validation Gates Simulados (do Exercício 2.1)

```
Gate 1 — Spec → Plan: PS aprova requirements.md antes do TL gerar o plan.
Gate 2 — Tasks → Implement: TL aprova tasks.md antes do Dev iniciar.
Gate 3 — Code → Merge: TL faz code review; PR precisa de 1 approval.
Gate 4 — Tests → Deploy: QA valida cobertura e cenários; TL aprova deploy.
```

## Tarefas

Apenas 1 tarefa neste exercício:

1. **[Tarefa 2.3.1](tarefas/2-3-1-escrever-project-management-rules.md)** — Escrever a seção "Project Management Rules" do AGENTS.md

## Entregável

Ao final do exercício, você terá:
- [ ] Seção completa e pronta para adicionar ao AGENTS.md
- [ ] Regras de nomenclatura de tasks e issues (formato de títulos, labels obrigatórias)
- [ ] Regras de documentação de decisões (ADR, formato, localização)
- [ ] Definição de validation gates em formato machine-readable (um agente consegue parsear)
- [ ] Restrições de comunicação (português para docs, inglês para código, etc)

## Critérios de Avaliação

- ✓ A seção é machine-readable (agente de IA consegue parseá-la)
- ✓ Regras são prescritivas (dizem o que fazer, não só o que é)
- ✓ Regras são específicas ao projeto NovaTech (não genéricas)
- ✓ Validation gates são claros e executáveis por agentes
- ✓ Idiomas, formatos e convenções de nomes são explícitos
