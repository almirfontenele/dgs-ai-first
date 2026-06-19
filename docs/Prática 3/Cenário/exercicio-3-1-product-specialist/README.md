# Exercício 3.1 — Revisão crítica das respostas do assistente

**Papel:** Product Specialist  
**Tópico:** Revisão Crítica de Outputs de IA  
**Cenário:** [Contexto compartilhado](../cenario-3-contexto.md)

---

## Contexto

Antes do go-live, você valida uma amostra de respostas do assistente para garantir que atendem aos requisitos de produto.

---

## Ferramentas a utilizar

- **Claude** (chat)

---

## Inputs fornecidos

O cenário completo (acima).

A documentação da NovaTech (ver **Anexo A**) como fonte de verdade.

6 pares de pergunta/resposta do assistente em staging (simulados):

| # | Pergunta | Resposta | Fonte Citada | Confiança |
|---|----------|---------|--------------|-----------|
| 1 | "Qual o prazo de devolução para produtos standard?" | "O prazo é de 7 dias úteis após o recebimento. O cliente deve abrir chamado no portal e anexar fotos." | POL-001, seção 3.2 | Alta |
| 2 | "Meu cliente é Silver. Qual o prazo de resolução?" | "O cliente Silver tem resolução em até 48h." | SLA-2024 | Alta |
| 3 | "Posso devolver carga perigosa classe 3?" | "Não. Cargas perigosas (classes 1 a 6 da ANTT) não podem ser devolvidas pelo processo padrão. Recomendo escalar para o supervisor." | POL-001, seção 3.2 | Alta |
| 4 | "Qual a política para carga danificada durante transporte?" | "A política de danos prevê reembolso integral quando comprovada negligência da transportadora, mediante laudo técnico e fotos." | Nenhuma | Alta |
| 5 | "Qual o SLA do cliente Enterprise?" | "O tier Enterprise não foi encontrado na documentação. Os tiers documentados são Gold, Silver e Standard. Sugiro confirmar a classificação ou escalar ao supervisor." | — | Baixa |
| 6 | "Posso enviar carga perigosa com frete expresso?" | "Sim, cargas perigosas podem ser enviadas via frete expresso mediante autorização prévia do compliance e documentação ANTT atualizada." | FAQ-Atendimento, item 32 | Alta |

---

## Tarefa

### 1. Sua própria avaliação

Avalie cada resposta por conta própria:
- Correta, parcialmente correta, ou incorreta?
- Justifique com base no Anexo A

### 2. Avaliação do Claude

Depois, use o **Claude** como segundo avaliador e compare com a sua avaliação.

### 3. Identificar tipos de erro

Para as respostas com problema, classifique o tipo de erro:
- Alucinação
- Fonte não confiável
- Informação incompleta

Proponha um ajuste de produto (prompt, interface, ou pipeline) para preveni-lo.

---

## Entregável

- Sua avaliação
- A avaliação do Claude
- A comparação
- As propostas de ajuste

---

## Critérios de avaliação

- [ ] A resposta 4 é identificada como alucinação (não há documento sobre política de danos na base)
- [ ] A resposta 6 é identificada como problemática (fonte é FAQ informal — informação sobre carga perigosa deveria vir de documento formal)
- [ ] As respostas 1, 2, 3 e 5 são corretamente avaliadas como adequadas
- [ ] A comparação com o Claude é honesta sobre concordâncias e divergências
