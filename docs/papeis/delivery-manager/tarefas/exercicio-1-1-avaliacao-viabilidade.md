### Exercício 1.1 — Avaliação de viabilidade com fundamentos de IA

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
