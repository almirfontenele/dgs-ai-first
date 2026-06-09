# Exercício 2.3 — Definição de Skill de Geração de Testes

## Contexto
Você precisa criar a skill que define como testes devem ser gerados para este projeto. Skills encapsulam como gerar tipos específicos de outputs (um teste, um documento, uma interface). Uma boa skill tem: contexto claro de quando usar, regras prescritivas, exemplos concretos (DO/DON'T), e anti-padrões específicos que LLMs realmente geram de errado.

## Ferramentas a Utilizar
- Claude (chat)
- Claude Cowork

## Inputs Fornecidos

### Artefatos das Tarefas Anteriores
- O teste ruim e o teste reescrito do Exercício 2.1
- Testing Standards do Exercício 2.1 (referência de padrão desejado)
- Test Plan e Robustness Tests do Exercício 2.2

### Conceito de Skills
Skills encapsulam como gerar tipos específicos de outputs:
- **Contexto**: Quando esta skill se aplica (frase-ativação)
- **Regras prescritivas**: O que DEVE fazer / o que NÃO DEVE fazer
- **Exemplos concretos**: DO (teste bem escrito) / DON'T (anti-padrão comum)
- **Anti-padrões**: Coisas que LLMs realmente geram de errado em testes
- **Dependências**: Quais outras skills devem ser lidas antes desta

## Tarefas

Cada tarefa está documentada em sua pasta correspondente:

1. **[Tarefa 2.3.1](tarefas/2-3-1-criar-skill-md.md)** — Criar SKILL.md para `create-integration-test`
2. **[Tarefa 2.3.2](tarefas/2-3-2-criar-checklist-cowork.md)** — Criar checklist de revisão com Cowork

## Entregáveis

Ao final do exercício, você terá:
- [ ] SKILL.md completo para `create-integration-test` (nível Artifact)
- [ ] Template de teste com placeholders
- [ ] 2 exemplos completos (DO: teste bem escrito; DON'T: teste com problemas comuns)
- [ ] Anti-padrões específicos de testes gerados por IA documentados
- [ ] Dependências listadas (quais skills Foundation/Domain devem ser lidas antes)
- [ ] Checklist de revisão de testes verificável em < 2 minutos por teste

## Critérios de Avaliação

- ✓ A skill é concreta o suficiente para melhorar o output do Copilot
- ✓ Os anti-padrões são reais (coisas que LLMs realmente geram de errado)
- ✓ O checklist é rápido e objetivo (< 2 minutos por teste)
- ✓ A skill é consistente com os Testing Standards do Exercício 2.1
