# Exercício 2.2 — Definição de Guardrails como Artefato de Produto

## Contexto
Na fase anterior, você identificou guardrails informais. Agora você precisa formalizá-los como um artefato estruturado consumível por humanos e agentes.

## Ferramentas a Utilizar
- Claude (chat)

## Inputs Fornecidos

### Guardrails Informais do Cenário 1
- (1) Sempre citar fonte
- (2) Nunca inventar prazos ou valores
- (3) Quando não encontrar resposta, dizer explicitamente
- (4) Responder em português formal

### Incidentes Simulados de Teste
Cenários onde o assistente falhou:

1. **Incidente 1:** O assistente respondeu que o prazo de devolução para carga perigosa é 7 dias, quando na verdade cargas perigosas NÃO podem ser devolvidas.

2. **Incidente 2:** O assistente citou "PROC-042, seção 2" mas os multiplicadores informados eram da versão 1 (desatualizada), não da v2 (vigente).

3. **Incidente 3:** O assistente disse "Não encontrei informação sobre isso" para uma pergunta sobre SLA Gold, mas o documento SLA-2024 estava indexado e continha a resposta.

## Tarefas

Cada tarefa está documentada em sua pasta correspondente:

1. **[Tarefa 2.2.1](tarefas/2-2-1-elaborar-guardrails.md)** — Elaborar documento de guardrails estruturado
2. **[Tarefa 2.2.2](tarefas/2-2-2-classificar-enforcement.md)** — Classificar enforcement (prompt vs código)
3. **[Tarefa 2.2.3](tarefas/2-2-3-conectar-aos-incidentes.md)** — Conectar cada guardrail aos incidentes que previne

## Entregáveis

Ao final do exercício, você terá:
- [ ] Documento de guardrails com seções DEVE, NÃO DEVE, QUANDO EM DÚVIDA
- [ ] Classificação enforcement: prompt (probabilístico) vs código (determinístico)
- [ ] Matriz de rastreabilidade guardrail → incidentes prevenidos
- [ ] Justificativas para cada decisão de enforcement

## Critérios de Avaliação

- ✓ Os guardrails são específicos ao domínio da NovaTech (não genéricos)
- ✓ A classificação prompt vs código demonstra compreensão de que prompts são probabilísticos e código é determinístico
- ✓ Cada guardrail é rastreável a um risco concreto (incidente)
