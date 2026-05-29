# Exercício 1.1 — Mapeamento de intent com engenharia de contexto

## Contexto

Você é o Product Specialist do projeto e vai conduzir a fase de Intent + Discovery. Antes de entrevistar qualquer stakeholder, você precisa usar IA para pré-analisar a documentação disponível e gerar hipóteses. Mas não basta jogar tudo no prompt: a forma como você organiza e sequencia a informação para o modelo determina a qualidade do resultado.

## Ferramentas a utilizar

- Claude (chat)

## Inputs fornecidos

- O cenário completo.
- Os 5 documentos-chave da NovaTech com conteúdo completo (ver **Anexo A** — para a etapa 2, os documentos individuais estão disponíveis na pasta `anexo-a-documentos-individuais/`):
  1. *"POL-001: Política de Devolução de Mercadorias"* — Define regras para devolução em até 7 dias, com exceções para carga perigosa.
  2. *"PROC-042: Procedimento de Cálculo de Frete Especial"* — Fórmula para fretes acima de 500kg com tabela de multiplicadores por região.
  3. *"SLA-2024: Tabela de SLA por Tipo de Cliente"* — Prazos de resposta diferenciados para clientes Gold, Silver e Standard.
  4. *"PROC-042-v2: Procedimento de Cálculo de Frete (Revisado)"* — Mesma numeração do item 2, mas com multiplicadores diferentes. Sem indicação de qual é o vigente.
  5. *"FAQ-Atendimento: Perguntas Frequentes do Time de Suporte"* — Documento informal com 47 perguntas e respostas escritas por atendentes experientes, sem validação formal.
- Conceito de engenharia de contexto: *"Prompt engineering é como pedir. Context engineering é decidir o que o modelo vê antes de responder. Inclui: orçamento de atenção (modelos têm capacidade limitada — informação em excesso degrada a qualidade), progressive disclosure (alimentar o modelo em etapas, não tudo de uma vez), e priorização (colocar a informação mais relevante no início do contexto)."*

## Tarefa

1. No **Claude**, projete e execute uma estratégia de análise em 3 etapas, usando engenharia de contexto:
   - **Etapa 1 — Visão geral:** Forneça ao Claude apenas os títulos, metadados e resumos dos 5 documentos (não o conteúdo completo). Peça um mapa de temas cobertos e hipóteses de gaps.
   - **Etapa 2 — Análise profunda:** Com base no mapa da etapa 1, selecione os 2 documentos que mais precisam de análise (ex: os dois PROC-042 contraditórios). Forneça o conteúdo completo apenas desses 2 e peça análise de inconsistências.
   - **Etapa 3 — Cruzamento:** Forneça ao Claude o output das etapas 1 e 2 junto com o FAQ-Atendimento completo. Peça que cruze as inconsistências encontradas com as práticas informais do FAQ.

2. Para cada etapa, documente: por que escolheu fornecer essa informação nessa ordem (decisão de contexto), o que obteve como output, e como a qualidade variou entre as etapas.

3. Identifique ao menos 2 riscos que encontrou e descreva como levaria isso para o discovery humano.

4. Reflexão: o que teria acontecido se você tivesse colado os 5 documentos completos de uma vez no primeiro prompt? Compare com o resultado da abordagem progressiva.

## Entregável

A estratégia de contexto documentada, os 3 prompts com outputs, a análise crítica de cada etapa, a reflexão sobre progressive disclosure, e o mapa de riscos.

## Critérios de avaliação

- A estratégia de 3 etapas demonstra progressive disclosure (não joga tudo de uma vez).
- A escolha de quais documentos analisar em profundidade na etapa 2 é justificada.
- A reflexão sobre "tudo de uma vez vs. progressivo" demonstra compreensão de orçamento de atenção e context rot.
- Os riscos identificados são reais e a proposta de tratamento no discovery é concreta.
