# Exercício 3.1 — Revisão crítica das respostas do assistente

**Papel:** QA  
**Tópico:** Revisão Crítica de Outputs de IA  
**Cenário:** [Contexto compartilhado](../cenario-3-contexto.md)

---

## Contexto

Antes do go-live, você executa uma bateria de avaliação sobre as respostas do assistente e produz um parecer.

---

## Ferramentas a utilizar

- **Claude** (chat)
- **Claude Cowork**

---

## Inputs fornecidos

O cenário completo (acima).

A documentação da NovaTech (ver **Anexo A**) como fonte de verdade.

A rubrica de avaliação que você criou no cenário 2 (simulada — 4 dimensões: precisão factual, citação de fonte, aderência a guardrails, completude, escala 1-3 cada).

8 respostas do assistente em staging (simuladas):

| # | Pergunta | Resposta Resumida | Fonte | Esperado |
|---|----------|-------------------|-------|----------|
| 1 | "Prazo de devolução?" | 7 dias, exceto perigosas | POL-001 | Aprovada |
| 2 | "Devolução carga perigosa?" | Não é possível, escalar supervisor | POL-001 | Aprovada |
| 3 | "SLA Gold resolução?" | 24h | SLA-2024 | Aprovada |
| 4 | "SLA Platinum?" | Tier não encontrado, sugere verificar | — | Aprovada (reconheceu) |
| 5 | "Frete 600kg Manaus?" | Multiplicador 1.8 | PROC-042-v2 | Aprovada |
| 6 | "Frete 600kg sem destino?" | "O frete para o Sudeste é 1.1" (assumiu Sudeste sem ser informado) | PROC-042-v2 | Reprovada (assumiu dado) |
| 7 | "Receita de bolo?" | "Não tenho informações sobre receitas. Posso ajudar com logística." | — | Aprovada (escopo) |
| 8 | "What is the return policy?" | Responde em inglês | POL-001 | Reprovada (idioma) |

---

## Tarefa

### 1. Aplique a rubrica (sua avaliação)

Aplique a rubrica a cada uma das 8 respostas.

Pontue as dimensões e calcule o score.

### 2. Avaliação do Claude

Use o **Claude** para uma segunda avaliação e compare.

### 3. Gere relatório de qualidade (Claude Cowork)

Usando o **Claude Cowork**, gere um relatório de qualidade curto:
- Score médio
- Respostas reprovadas com motivo
- Seu parecer de go-live (pronto? com quais ressalvas?)

---

## Entregável

- Sua avaliação
- A do Claude
- A comparação
- O relatório do Cowork com parecer

---

## Critérios de avaliação

- [ ] As respostas 6 e 8 são identificadas como reprovadas (assunção indevida e idioma errado)
- [ ] A rubrica é aplicada de forma consistente (mesma régua para todas)
- [ ] O parecer de go-live é fundamentado nos dados e pragmático
