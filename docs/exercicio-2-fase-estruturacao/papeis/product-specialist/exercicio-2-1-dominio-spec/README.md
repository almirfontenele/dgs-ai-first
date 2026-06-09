# Exercício 2.1 — Recorte de Domínio e Spec de Produto no Formato SDD

## Contexto
Antes de escrever a spec, você precisa recortar o domínio: quais são os bounded contexts do projeto, qual a linguagem ubíqua do domínio de logística que o time (e os agentes) devem usar, e quais são as fronteiras do que o assistente faz e não faz. Depois, você escreve a spec de requisitos do módulo principal usando SDD.

## Ferramentas a Utilizar
- Claude (chat)
- Claude Design

## Inputs Fornecidos

### Contexto Base
- O cenário completo (docs/fonte-da-verdade)
- A documentação da NovaTech (ver **Anexo A** docs/anexos/anexo-a-documentacao-simulada-novatech.md)
- Spec de requisitos de RAG da fase anterior: *"O assistente responde perguntas sobre SLAs, frete e devoluções. Fontes contraditórias devem mostrar ambas as versões. O assistente nunca inventa informações. Toda resposta cita fonte. Atualização em até 24h."*

### Fluxo SDD
O arquivo `requirements.md` deve conter:
- Outcomes
- Scope boundaries
- Constraints
- Prior decisions
- Verification criteria

### Dados de Discovery
- Perguntas mais frequentes: 4 categorias (prazos de entrega, regras de frete, política de devolução, SLAs)
- 15% das perguntas cruzam duas categorias
- Atendentes precisam de resposta em menos de 30 segundos

## Tarefas

Cada tarefa está documentada em sua pasta correspondente:

1. **[Tarefa 2.1.1](tarefas/2-1-1-identificar-bounded-contexts.md)** — Identificar bounded contexts do assistente NovaTech
2. **[Tarefa 2.1.2](tarefas/2-1-2-extrair-linguagem-ubiqua.md)** — Extrair linguagem ubíqua do domínio do Anexo A
3. **[Tarefa 2.1.3](tarefas/2-1-3-escrever-requirements-sdd.md)** — Escrever `requirements.md` em SDD
4. **[Tarefa 2.1.4](tarefas/2-1-4-criar-mockup-interface.md)** — Criar mockup da interface no Teams
5. **[Tarefa 2.1.5](tarefas/2-1-5-iteracao-tech-lead.md)** — Iteração: aponte ambiguidades e ajuste

## Entregáveis

Ao final do exercício, você terá:
- [ ] Mapa de bounded contexts com descrição do que está dentro/fora
- [ ] Lista de linguagem ubíqua com definições
- [ ] `requirements.md` completo (outcomes, scope, constraints, decisions, criteria)
- [ ] Mockup da interface de resposta no Teams
- [ ] Histórico de iteração (feedbacks e ajustes)

## Critérios de Avaliação

- ✓ Os bounded contexts são coerentes com o domínio de logística (não divisões técnicas como frontend/backend)
- ✓ A linguagem ubíqua contém termos que um LLM confundiria sem definição explícita
- ✓ Os outcomes no requirements.md são orientados a resultado do usuário, não a features técnicas
- ✓ Os scope boundaries derivam dos bounded contexts
- ✓ Os verification criteria são testáveis pelo QA
