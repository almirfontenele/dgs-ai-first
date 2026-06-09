# Tarefa 2.2.3 — Organizar em Formato Rastreável com Cowork

## Objetivo
Usar Claude Cowork para transformar o test plan em um artefato rastreável, onde cada teste tem: ID único, status, links para VCs e critérios de aprovação. Isso permite que a equipe de testes saiba exatamente qual VC está coberto, qual teste é prioridade e qual já passou.

## O Que É um Artefato Rastreável em Cowork?
Um bom artefato rastreável:
- **Tem IDs únicos** (VC-01, TC-01-1, TC-01-2, etc.)
- **Mapeia testes a VCs** (cada teste vinculado a seu VC)
- **Tem status** (não implementado, implementado, passou, falhou, etc.)
- **Tem prioridade** (crítico, importante, nice-to-have)
- **É organizável** (tabela ou documento estruturado que pode ser usado em dashboards)
- **Permite rastreamento** (você consegue saber: "VC-01 tem quantos testes? Quantos passaram?")

## Tarefa

### Passo 1: Estruturar os Testes em IDs
Partindo do `test-plan.md` e `robustness-tests.md`, organize todos os testes em IDs hierárquicos:

```
VC-01: Resposta em < 30s para 95% das queries
  ├─ TC-01-1: Happy Path — Query típica de SLA
  ├─ TC-01-2: Edge Case — Query com múltiplos chunks
  └─ TC-01-3: Robustez — Query ambígua de desempenho

VC-02: 100% das respostas incluem campo source_document
  ├─ TC-02-1: Happy Path — Resposta com fonte
  ├─ TC-02-2: Edge Case — Múltiplas fontes
  └─ TC-02-3: Robustez — Resposta com confiança baixa

[...]
```

### Passo 2: Criar Tabela Rastreável
Usando Claude Cowork, crie uma tabela com as seguintes colunas:

| ID | Descrição | VC Associado | Tipo | Prioridade | Status | Critério Aprovação | Notas |
|----|-----------|--------------|------|------------|--------|-------------------|-------|
| TC-01-1 | Query típica SLA < 30s | VC-01 | Happy Path | Crítica | Não Impl. | Resp. em < 30s + contém resposta | |
| TC-01-2 | Query multi-chunk | VC-01 | Edge Case | Importante | Não Impl. | Resp. em < 30s + todas chunks relevantes | |
| [...] | | | | | | | |

### Passo 3: Adicionar Links e Dependências
Documente:
- **Link para test-plan.md**: Qual seção de test-plan descreve este teste?
- **Link para robustness-tests.md**: Este teste valida algum risco de IA?
- **Dependências**: Este teste depende de outro? (Ex: TC-02-1 não pode passar se TC-01-1 falhar)

### Passo 4: Validar Cobertura Completa
Verifique que:
- [ ] Todo VC tem pelo menos 2 testes (happy path + edge case)
- [ ] Toda categoria de robustez tem pelo menos 1 teste
- [ ] Não há teste órfão (todo teste está vinculado a um VC ou categoria de risco)
- [ ] As prioridades fazem sentido (críticos mais altos)
- [ ] A tabela pode ser usada como dashboard (fácil de atualizar status)

## Entregável
Um artefato Cowork (documento estruturado) contendo:
- Tabela rastreável de testes com ID, VC, tipo, prioridade, status, critério aprovação
- Seção de "Sumário por VC" (VC-01 tem 3 testes, 0 passaram, 3 em andamento)
- Seção de "Sumário por Risco" (Prompt Injection tem 2 testes, Security tem 1, etc.)
- Links explícitos para test-plan.md e robustness-tests.md
- Um "Roadmap de Testes" mostrando ordem recomendada de execução (críticos primeiro)

## Critério de Sucesso
A equipe de testes consegue:
1. Olhar a tabela e saber: "VC-03 está com cobertura incompleta, precisa de 1 mais teste"
2. Filtrar por prioridade e executar testes em ordem sensata
3. Rastrear progresso (quantos testes passaram? qual VC tem mais risco?)
4. Atualizar o status sem quebrar referências cruzadas
