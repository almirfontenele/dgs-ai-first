# Exercício 2.2 — Criação de Spec de Testes no Formato SDD

## Contexto
No modelo SDD (Specification-Driven Development), até o plano de testes deve ser especificado antes de ser implementado. Você precisa escrever a spec de testes para o query endpoint, derivando cenários de teste a partir dos verification criteria e incluindo testes de robustez específicos para IA. Os testes devem usar dados realistas do domínio NovaTech.

## Ferramentas a Utilizar
- Claude (chat)
- Claude Cowork

## Inputs Fornecidos

### Documentação e Requisitos
- O cenário completo
- A documentação da NovaTech (ver **Anexo A**)
- Os chunks de referência (ver **Anexo B**) — use para criar dados de teste realistas
- Os requirements.md do query endpoint com outcomes e verification criteria

### Verification Criteria Exemplo
```
VC-01: Resposta em < 30s para 95% das queries
VC-02: 100% das respostas incluem campo source_document
VC-03: Queries sobre carga perigosa + devolução retornam negativa explícita
VC-04: Queries sem match retornam mensagem padrão de "não encontrado"
```

## Tarefas

Cada tarefa está documentada em sua pasta correspondente:

1. **[Tarefa 2.2.1](tarefas/2-2-1-escrever-test-plan.md)** — Escrever `test-plan.md` derivado dos verification criteria
2. **[Tarefa 2.2.2](tarefas/2-2-2-testes-robustez-ia.md)** — Incluir testes de robustez da IA
3. **[Tarefa 2.2.3](tarefas/2-2-3-organizar-com-cowork.md)** — Organizar em formato rastreável com Cowork

## Entregáveis

Ao final do exercício, você terá:
- [ ] `test-plan.md` com derivação clara de cada VC → cenários de teste
- [ ] Para cada VC: ao menos 2 cenários (happy path + edge case)
- [ ] Dados de teste realistas do domínio de logística (não "test" e "hello")
- [ ] Testes de robustez incluindo prompt injection, ambiguidade, idiomas diferentes
- [ ] Artefato rastreável do Cowork (teste → VC → critério de aprovação)

## Critérios de Avaliação

- ✓ Cada VC tem ao menos 2 cenários (happy path + edge case)
- ✓ Os dados de teste são realistas e do domínio de logística
- ✓ Os testes de robustez demonstram compreensão de riscos de IA (prompt injection, language confusion)
- ✓ O artefato do Cowork é rastreável (teste → VC) e organizável
