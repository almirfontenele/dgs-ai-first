# Exercício 2.3 — Definição de Estratégia de Skills do Projeto

## Contexto

Você precisa definir quais skills o projeto precisa, quem as cria, quem as consome, e como são mantidas. Skills são artefatos estruturados (tipicamente arquivos .md) que encapsulam como gerar tipos específicos de outputs.

## Ferramentas a Utilizar

- Claude (chat)
- GitHub Copilot

## Inputs Fornecidos

### Contexto Base
- O cenário completo (NovaTech Logistics Assistant)
- A estrutura do repositório (ver **Anexo C**) — as skills devem seguir a organização em `/skills/foundation/`, `/skills/domain/`, `/skills/artifact/`
- A lista de artefatos que serão produzidos repetidamente:
  - Endpoints Azure Functions com padrão RAG
  - Testes de integração para endpoints
  - Componentes React para o painel web
  - Documentação técnica de endpoints (ADRs, README)
  - Specs de produto (seguindo template SDD)

### Concept: Skills Hierarchy
*"Skills são artefatos estruturados que encapsulam como gerar tipos específicos de outputs. A hierarquia é:*
- *Foundation: convenções globais (error handling, logging, env config)*
- *Domain: padrões por camada (como endpoints estruturados, como testes escritos)*
- *Artifact: receitas de geração específicas (skill para criar endpoint RAG, skill para teste)"*

## Tarefas

Cada tarefa está documentada em sua pasta correspondente:

1. **[Tarefa 2.3.1](tarefas/2-3-1-definir-arvore-skills.md)** — Definir árvore de skills com Claude
2. **[Tarefa 2.3.2](tarefas/2-3-2-mapeamento-consumo.md)** — Mapear criação/consumo por papel
3. **[Tarefa 2.3.3](tarefas/2-3-3-skill-foundation.md)** — Criar SKILL.md Foundation com Copilot

## Entregáveis

Ao final do exercício, você terá:
- [ ] Árvore de skills (Foundation → Domain → Artifact) com 3+ skills de cada nível
- [ ] Matriz de criação/consumo (qual papel cria, quem consome)
- [ ] SKILL.md Foundation (contexto, regras prescritivas, exemplos DO/DON'T, anti-padrões)

## Critérios de Avaliação

- ✓ A árvore de skills é coerente com o projeto (não tem skills que ninguém usaria)
- ✓ A atribuição de criação/consumo por papel demonstra visão de time (não é só para devs)
- ✓ O SKILL.md Foundation é concreto e prescritivo (contém exemplos de código reais, não abstrações)
- ✓ Os anti-padrões são úteis (coisas que Copilot/devs realmente fariam errado sem guidance)
