
### DELIVERY MANAGER

#### Exercício 1.1 — Avaliação de viabilidade com fundamentos de IA

**Contexto:** Você recebeu o briefing acima e precisa preparar uma análise inicial para o kickoff interno do projeto. A diretoria da DB1 quer entender se o projeto é viável com IA e quais são os riscos técnicos que podem impactar prazo e custo.

**Ferramentas a utilizar:** Claude (chat)

**Inputs fornecidos:**
- O cenário completo acima.
- Uma tabela resumo dos tipos de documento da NovaTech:

| Fonte | Qtde docs | Formato | Atualização | Responsável |
|-------|-----------|---------|-------------|-------------|
| SharePoint | ~800 | PDF, DOCX | Mensal | Operações, Compliance |
| Confluence | ~400 páginas | HTML/Wiki | Semanal | TI, Comercial |
| Pasta de rede | ~50 planilhas | XLSX | Mensal | Comercial |

**Tarefa:**
1. Usando o **Claude**, elabore um documento de 1-2 páginas contendo uma avaliação dos riscos do projeto relacionados às características da IA generativa. Forneça ao Claude o cenário completo e peça ajuda para identificar riscos. Considere ao menos: o risco de alucinação (o assistente inventar procedimentos que não existem), o impacto de documentação contraditória nas respostas, a dependência da qualidade dos documentos-fonte, a expectativa da diretoria versus o que a tecnologia realmente entrega hoje, e o risco de degradação de qualidade quando o contexto do modelo fica muito grande (*context rot*).

2. Para cada risco, refine com o Claude: probabilidade (alta/média/baixa), impacto no projeto (prazo, custo, qualidade), e uma ação de mitigação concreta.

3. Formule três perguntas que você faria ao Tech Lead antes de confirmar o cronograma de 3 meses.

**Entregável:** O documento final E o histórico da conversa com o Claude (prints ou export), demonstrando como você usou a ferramenta e como refinou o output.

**Critérios de avaliação:**
- Os riscos demonstram compreensão real das limitações de LLMs (não são genéricos como "a IA pode errar"). Exemplo de risco bem formulado: "documentos contraditórios entre PROC-042 e PROC-042-v2 podem gerar respostas que misturam regras de versões diferentes sem que o atendente perceba".
- Ao menos um risco aborda contexto: o impacto do volume de documentação (~1.250 fontes) na qualidade das respostas (context rot, orçamento de atenção limitado do modelo).
- As mitigações são acionáveis, não apenas "monitorar" ou "ficar atento". Exemplo: "implementar versionamento explícito com data de vigência no pipeline de ingestão e instruir o modelo a priorizar a versão mais recente".
- As perguntas ao Tech Lead revelam entendimento de que a qualidade do RAG depende do pipeline de dados, não só do modelo.
- O uso do Claude demonstra capacidade de refinar outputs (não é um prompt único com aceitação acrítica do resultado).

---

#### Exercício 1.2 — Comunicação de expectativas com o cliente

**Contexto:** A diretoria da NovaTech espera que o assistente "responda tudo certo, como o ChatGPT mas com nossos dados". Você precisa preparar uma comunicação que ajuste expectativas sem matar o entusiasmo.

**Ferramentas a utilizar:** Claude (chat) + Claude Cowork

**Inputs fornecidos:**
- O cenário completo.
- Um e-mail fictício do diretor de operações da NovaTech: *"Estamos animados com o projeto. Nosso CEO viu uma demo do Copilot e quer algo parecido. A expectativa é que em 3 meses nosso time de atendimento não precise mais procurar nada manualmente. O assistente vai saber tudo."*

**Tarefa:**
1. Usando o **Claude**, elabore o rascunho de um e-mail de resposta ao diretor que: valide o entusiasmo, explique em linguagem não-técnica por que um assistente de IA não "sabe tudo" (usando o conceito de respostas probabilísticas), explique o que é RAG e por que a qualidade depende da documentação-fonte, e proponha 2-3 critérios de sucesso mensuráveis.

2. Usando o **Claude Cowork**, crie um one-pager visual (documento de 1 página) que possa ser anexado ao e-mail, mostrando: como o assistente funciona (fluxo simplificado pergunta → busca → resposta com fonte), o que ele faz bem, o que ele não faz, e os critérios de sucesso propostos.

**Entregável:** O e-mail redigido, o one-pager gerado pelo Cowork, e evidência do uso das ferramentas.

**Critérios de avaliação:**
- O e-mail usa analogias ou linguagem acessível, não jargão técnico.
- A explicação de RAG é precisa sem ser acadêmica.
- Os critérios de sucesso são mensuráveis e derivam de entendimento real da tecnologia (ex: "% de respostas com citação de fonte verificável" é bom; "o assistente funcionar bem" é ruim).
- O one-pager é claro o suficiente para um executivo entender em 2 minutos.

---

#### Exercício 1.3 — Planejamento de discovery com IA

**Contexto:** O projeto foi aprovado. Você precisa planejar a fase de discovery considerando que no modelo AI First, agentes de IA pré-analisam documentação antes do discovery humano (fase de Intent).

**Ferramentas a utilizar:** Claude (chat) + Claude Cowork

**Inputs fornecidos:**
- O cenário completo.
- Uma descrição resumida da fase de Intent do AI First SDLC: *"Antes de entrevistas com stakeholders, agentes especializados analisam documentação existente, contexto de negócio e restrições para gerar um mapa priorizado de fontes, dependências e gaps."*

**Tarefa:**
1. Usando o **Claude**, elabore um plano de discovery que defina: quais atividades serão feitas por agentes de IA na fase de Intent (ex: catalogar os 800 documentos do SharePoint, identificar documentos duplicados ou contraditórios, mapear temas mais frequentes), quais atividades serão feitas por humanos no discovery (entrevistas, validação, priorização), e a sequência (o que precisa acontecer antes do quê).

2. Usando o **Claude Cowork**, transforme o plano em um cronograma visual de 2 semanas de discovery, com atividades, responsáveis e dependências.

3. Identifique o que a NovaTech precisa fornecer (acessos, pessoas, tempo) e quando.

**Entregável:** O plano textual, o cronograma visual gerado pelo Cowork, e evidência do uso das ferramentas.

**Critérios de avaliação:**
- O plano demonstra entendimento de que Intent antecede e alimenta o discovery humano.
- As atividades atribuídas a agentes são realistas (coisas que IA faz bem: catalogar, comparar, resumir).
- As atividades humanas focam no que IA não faz bem (validar, priorizar, decidir).
- O cronograma é realista para 2 semanas.