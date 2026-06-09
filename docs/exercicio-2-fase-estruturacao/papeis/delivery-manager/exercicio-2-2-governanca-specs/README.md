# Exercício 2.2 — Governança de Specs no Modelo SDD

## Contexto

Specs em SDD (Spec Driven Development) não são documentos passivos — são contratos executáveis que evoluem durante o projeto. Você precisa definir:

1. **Como specs são criadas** (quem escreve requirements, quem escreve plan, etc)
2. **Como são aprovadas** (gates de revisão, quem aprova)
3. **Como são versionadas e rastreadas** (organização no repositório, histórico de mudanças)
4. **O que fazer quando specs mudam** (change management)

## Ferramentas a Utilizar

- Claude (chat)
- Claude Cowork (para templates colaborativos e boards)

## Inputs Fornecidos

### Contexto Base
- O cenário completo
- A estrutura do repositório do projeto (ver **Anexo C** — ou use a estrutura padrão)
- O fluxo SDD simplificado:
  - `requirements.md` define o que precisa ser feito
  - `plan.md` define como será feito
  - `tasks.md` decompõe em unidades atômicas executáveis por agentes
  - Cada transição (requirements → plan → tasks) é um checkpoint humano

### Lista de Módulos que Precisam de Specs
1. Pipeline de ingestão de documentos
2. API de busca (query endpoint)
3. API de feedback (atendente reporta resposta incorreta)
4. Bot do Teams (interface conversacional)
5. Painel web (dashboard de métricas e histórico)

## Tarefas

Cada tarefa está documentada em sua pasta correspondente:

1. **[Tarefa 2.2.1](tarefas/2-2-1-processo-governanca-specs.md)** — Definir processo de governança de specs
2. **[Tarefa 2.2.2](tarefas/2-2-2-board-tracking-specs.md)** — Criar board de tracking com Cowork
3. **[Tarefa 2.2.3](tarefas/2-2-3-change-management.md)** — Definir processo de change management

## Entregáveis

Ao final do exercício, você terá:
- [ ] Documento de governança (quem cria, aprova, onde fica, como rastreia)
- [ ] Board de tracking (Rascunho → Em Revisão → Aprovada → Em Implementação → Validada)
- [ ] Processo de change management (quando spec muda, o que fazer)

## Critérios de Avaliação

- ✓ O processo reconhece que specs são artefatos vivos (evoluem, não são estáticas)
- ✓ O board é prático e permite qualquer membro ver status de cada spec
- ✓ O processo de change management é explícito: quem pode alterar, quem aprova, como afeta tasks
- ✓ A atribuição de responsabilidades por papel é coerente com competências
- ✓ A estrutura de repositório reflete o fluxo de aprovação (não coloca tudo em um lugar)
