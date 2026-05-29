# Exercício 1.3 — Especificação de requisitos de RAG do ponto de vista do produto

## Contexto

Você precisa especificar os requisitos que o pipeline de RAG deve atender para que o assistente entregue valor real para os atendentes.

## Ferramentas a utilizar

- Claude (chat)

## Inputs fornecidos

- O cenário completo.
- Dados do discovery.
- A documentação da NovaTech (ver **Anexo A**) como exemplo concreto das contradições e gaps que a spec precisa endereçar.
- Uma explicação simplificada do pipeline de RAG: *"Documentos são divididos em pedaços (chunks), transformados em representações numéricas (embeddings), armazenados num banco vetorial, e recuperados por similaridade quando o usuário faz uma pergunta. O LLM então gera uma resposta usando os chunks recuperados como contexto."*

## Tarefa

Usando o **Claude**, escreva uma especificação de requisitos do produto (não técnica, mas precisa) que cubra:

1. Quais fontes de dados devem ser indexadas (e quais não — ex: documentos obsoletos devem ser excluídos ou marcados?).
2. Como o assistente deve lidar com documentos contraditórios (ex: duas versões do mesmo procedimento).
3. Qual o comportamento esperado quando a pergunta do atendente não tem resposta na base (o assistente deve dizer "não encontrei" ou tentar responder com conhecimento geral?).
4. Requisitos de atualização: quando novos documentos são publicados, em quanto tempo devem estar disponíveis no assistente?
5. Requisitos de rastreabilidade: toda resposta deve citar a fonte? Deve mostrar o trecho relevante?

Itere com o Claude: apresente a primeira versão e peça ao Claude que identifique gaps ou ambiguidades na sua especificação. Refine com base no feedback.

## Entregável

A especificação final e o histórico de iteração com o Claude mostrando a versão inicial, o feedback do Claude e a versão refinada.

## Critérios de avaliação

- Os requisitos demonstram entendimento de que a qualidade do RAG depende da curadoria dos dados, não só da tecnologia.
- O tratamento de contradições e ausência de resposta mostra maturidade de produto.
- Os requisitos são testáveis (o QA conseguiria verificar cada um).
- A iteração com o Claude demonstra capacidade de usar IA como revisor, não apenas gerador.
