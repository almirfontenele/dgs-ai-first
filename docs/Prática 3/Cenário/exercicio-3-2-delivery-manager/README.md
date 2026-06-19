# Exercício 3.2 — Plano de observabilidade e melhoria contínua

**Papel:** Delivery Manager  
**Tópico:** Revisão Crítica de Outputs de IA (aplicada a monitoramento)  
**Cenário:** [Contexto compartilhado](../cenario-3-contexto.md)

---

## Contexto

Após o go-live, o assistente precisa ser monitorado. Você garante que o time saiba quando algo dá errado e tenha processo para corrigir.

---

## Ferramentas a utilizar

- **Claude** (chat)
- **Claude Cowork**

---

## Inputs fornecidos

O cenário completo (acima).

As dimensões de observabilidade:
- Métricas de uso (perguntas/dia, tempo de resposta)
- Métricas de qualidade (% de feedback negativo, % de escalações)
- Métricas técnicas (latência, taxa de erro)
- Métricas de conteúdo (documentos mais consultados, perguntas sem resposta)

A expectativa da NovaTech: *"Queremos um relatório semanal que mostre se o assistente está melhorando ou piorando."*

---

## Tarefa

### 1. Defina plano de observabilidade (Claude)

Usando o **Claude**, defina um plano de observabilidade que cubra:

- **Quais métricas coletar** (cobrindo as 4 dimensões)
- **2-3 alertas com thresholds concretos**  
  Exemplo: *"se feedback negativo > 15% em 24h, notificar o time"*
- **Como o feedback dos atendentes vira melhoria do assistente**  
  (feedback loop simples)

### 2. Crie template de relatório semanal (Claude Cowork)

Usando o **Claude Cowork**, crie o template do relatório semanal para a NovaTech:
- 1 página com KPIs principais
- Tendência (melhorou/piorou)
- Ações planejadas

---

## Entregável

- O plano de observabilidade
- O template de relatório gerado pelo Cowork

---

## Critérios de avaliação

- [ ] As métricas cobrem as 4 dimensões
- [ ] Os alertas têm thresholds concretos (não "monitorar se piora")
- [ ] O feedback loop conecta o atendente à correção no assistente
- [ ] O template é claro para um executivo entender em 2 minutos
