# Exercício 1.1 — Avaliação de Viabilidade com Fundamentos de IA

**Projeto:** Assistente de IA para Atendimento — NovaTech  
**Elaborado por:** Delivery Manager (DB1)  
**Data:** 2026-05-29  
**Versão:** 1.0

---

## 1. Contexto da Análise

A NovaTech contratou a DB1 para construir um assistente de IA que permita aos 45 atendentes consultar ~1.250 fontes de documentação (SharePoint, Confluence, planilhas) em linguagem natural. O objetivo é reduzir o tempo médio de busca de 12 minutos para menos de 2 minutos por chamado.

Esta análise foi elaborada com auxílio do Claude para identificar e refinar os riscos técnicos relacionados às características da IA generativa, antes do kickoff interno.

---

## 2. Matriz de Riscos

### RISCO 1 — Alucinação em Procedimentos Operacionais

**Descrição:**  
O assistente pode gerar procedimentos, prazos ou valores que não existem na documentação, com tom confiante e aparentemente fundamentado. No contexto da NovaTech, isso pode se manifestar como: inventar um multiplicador de frete para uma região não documentada, criar um prazo de devolução para uma categoria de carga não contemplada na POL-001, ou sintetizar um procedimento a partir de partes de documentos distintos criando uma regra que nunca existiu.

| Atributo | Avaliação |
|----------|-----------|
| Probabilidade | **Alta** — A base possui lacunas reconhecidas ("atendentes resolvem perguntando para quem sabe"), criando exatamente o cenário onde o modelo tende a "completar" com inferências. |
| Impacto no Prazo | **Médio** — Requer ciclos de avaliação e ajuste de prompts adicionais. |
| Impacto no Custo | **Médio** — Mais horas de QA e possível necessidade de guardrails determinísticos. |
| Impacto na Qualidade | **Alto** — Uma resposta errada dita com confiança é mais prejudicial que nenhuma resposta. |

**Mitigação acionável:**  
Implementar um guardrail de "âncora de fonte obrigatória": o system prompt deve instruir o modelo a incluir o identificador do documento e a seção exata em toda resposta que contenha prazo, valor ou procedimento. Adicionar uma camada determinística (pós-processamento) que rejeite respostas sem citação de fonte válida antes de exibir ao atendente. Incluir nos testes de aceitação casos onde a resposta correta é "não encontrei na documentação".

---

### RISCO 2 — Respostas Contraditórias por Documentação com Versões Conflitantes

**Descrição:**  
A NovaTech possui ao menos o par PROC-042 / PROC-042-v2 com multiplicadores de frete diferentes e sem indicação de qual versão é a vigente. Quando ambas as versões são recuperadas pelo pipeline de RAG e enviadas ao modelo como contexto, o LLM pode: escolher uma versão arbitrariamente, mesclar os valores das duas versões criando uma regra híbrida que nunca existiu, ou apresentar os dois valores sem deixar claro qual o correto — transferindo ao atendente uma decisão que ele não tem como tomar.

| Atributo | Avaliação |
|----------|-----------|
| Probabilidade | **Alta** — A NovaTech explicitamente confirma que documentos se contradizem e que a resolução hoje é informal. |
| Impacto no Prazo | **Alto** — Exige criação de processo de curadoria antes da ingestão, ampliando o escopo do discovery. |
| Impacto no Custo | **Alto** — Curadoria e versionamento não estavam no escopo original e podem exigir envolvimento de Compliance e Comercial. |
| Impacto na Qualidade | **Alto** — Respostas baseadas em versão errada geram erros operacionais com impacto direto em clientes. |

**Mitigação acionável:**  
Implementar versionamento explícito com data de vigência como metadado obrigatório no pipeline de ingestão. Criar uma regra de filtragem que, diante de documentos com mesmo identificador base (ex: PROC-042), recupere apenas o chunk da versão com maior data de vigência. Incluir no system prompt a instrução: "Quando existirem versões de um mesmo procedimento, utilize exclusivamente a versão com data de vigência mais recente e informe o número da versão na resposta". Como pré-requisito do go-live, exigir que a NovaTech resolva todas as contradições documentadas com definição formal de vigência.

---

### RISCO 3 — Degradação de Qualidade por Volume de Contexto (Context Rot)

**Descrição:**  
A base da NovaTech possui aproximadamente 1.250 fontes documentais. O pipeline de RAG seleciona subconjuntos (chunks) para compor o contexto de cada pergunta. Dois problemas distintos emergem: (a) **orçamento de atenção limitado** — modelos como GPT-4o têm janela de contexto finita; quanto mais chunks são incluídos, menos "atenção" o modelo dedica a cada um, degradando a precisão da síntese; (b) **lost in the middle** — chunks posicionados no meio de um contexto extenso são sistematicamente subprocessados pelo modelo em relação aos que estão no início ou fim. Para uma base de ~12M tokens estimados, a estratégia de retrieval determina diretamente a qualidade das respostas.

Adicionalmente, o assistente será integrado ao Teams, onde uma mesma sessão de chat pode acumular múltiplas perguntas e respostas. À medida que o histórico de conversa cresce dentro da sessão, ele compete por espaço no contexto com os chunks relevantes para a pergunta atual — fenômeno conhecido como **context rot em sessões longas**.

| Atributo | Avaliação |
|----------|-----------|
| Probabilidade | **Alta** — Inevitável dada a escala da base e o canal de integração (Teams com sessões persistentes). |
| Impacto no Prazo | **Médio** — Estratégia de chunking e gerenciamento de janela precisam ser prototipadas e testadas. |
| Impacto no Custo | **Médio** — Testes adicionais de degradação por volume e ajustes de arquitetura. |
| Impacto na Qualidade | **Alto** — Respostas da 5ª pergunta numa sessão longa podem ser piores que as da 1ª sem causa aparente. |

**Mitigação acionável:**  
Definir um teto explícito para o contexto por query (ex: máximo de 5 chunks de 500 tokens cada, mais system prompt fixo de ~2K tokens, mais histórico limitado às últimas 2 trocas). Implementar "janela deslizante" no histórico de conversa: descartar automaticamente turnos mais antigos quando o limite for atingido, priorizando os chunks mais recentes. Posicionar os chunks mais relevantes (maior score de similaridade) no início do contexto, não no meio. Incluir nos testes de regressão um conjunto de perguntas em sessão sequencial longa para detectar degradação.

---

### RISCO 4 — Lacuna entre Expectativa da Diretoria e Capacidade Real da Tecnologia

**Descrição:**  
A diretoria da NovaTech espera que o assistente "saiba tudo" e que os atendentes "não precisem mais procurar nada manualmente". LLMs com RAG são sistemas probabilísticos: respondem com base no que foi indexado, na qualidade dos chunks recuperados, e na instrução do prompt — não com certeza determinística. Para documentação fora da base, o assistente não tem resposta. Para perguntas ambíguas, pode recuperar chunks incorretos. Para situações que exigem julgamento contextual (ex: "esse caso específico se enquadra como carga perigosa?"), a resposta pode ser tecnicamente correta mas insuficiente para a decisão.

| Atributo | Avaliação |
|----------|-----------|
| Probabilidade | **Alta** — O gap de expectativa é explícito no briefing. |
| Impacto no Prazo | **Baixo** — Não impacta diretamente o desenvolvimento, mas pode gerar retrabalho de escopo. |
| Impacto no Custo | **Alto** — Expectativas não gerenciadas levam a solicitações de funcionalidades fora do escopo original. |
| Impacto na Qualidade | **Médio** — Um assistente percebido como "decepcionante" pode ser abandonado mesmo que tecnicamente funcional. |

**Mitigação acionável:**  
Conduzir uma sessão de alinhamento de expectativas antes do kickoff com os stakeholders da NovaTech, apresentando: o que o assistente faz (busca e sintetiza informação documentada), o que não faz (julgar casos, inventar regras, atualizar em tempo real), e os critérios de sucesso mensuráveis acordados (ex: 70% das perguntas respondidas com citação de fonte verificável em até 30 segundos). Documentar formalmente esses limites no termo de abertura do projeto.

---

### RISCO 5 — Dependência da Qualidade dos Documentos-Fonte

**Descrição:**  
A qualidade das respostas do assistente é limitada pela qualidade do que foi indexado. A base da NovaTech inclui: PDFs com tabelas complexas e fluxogramas embutidos como imagens (não processáveis por extração de texto simples), documentos escaneados que requerem OCR (com taxa de erro), planilhas com fórmulas interdependentes (que perdem significado quando convertidas para texto plano), e páginas de Confluence com macros customizadas. Um pipeline de ingestão que não trate cada formato adequadamente indexará lixo — e o assistente sintetizará respostas baseadas em lixo com aparência de informação.

| Atributo | Avaliação |
|----------|-----------|
| Probabilidade | **Alta** — Os formatos problemáticos são confirmados no briefing técnico. |
| Impacto no Prazo | **Alto** — Tratamento de formatos especiais requer desenvolvimento adicional no pipeline. |
| Impacto no Custo | **Alto** — OCR, parsing de tabelas e extração de planilhas elevam o esforço de engenharia de dados. |
| Impacto na Qualidade | **Alto** — Documentos mal extraídos contaminam o índice inteiro. |

**Mitigação acionável:**  
Realizar auditoria de formatos antes de iniciar a ingestão, categorizar cada fonte pelo tipo de tratamento necessário, e estimar o esforço por categoria. Implementar parsers específicos por formato (ex: Camelot ou pdfplumber para tabelas em PDF, Azure Document Intelligence para PDFs escaneados, openpyxl com avaliação de fórmulas para XLSX). Definir um critério de exclusão: documentos que não puderem ser extraídos com qualidade mínima serão marcados como "não indexáveis" e o assistente responderá "consulte o documento original" para queries que os envolvam.

---

## 3. Resumo Executivo da Viabilidade

O projeto é **tecnicamente viável**, mas com ressalvas importantes:

- A viabilidade depende da resolução das contradições documentais antes ou durante o discovery, não depois.
- O prazo de 3 meses é **apertado mas possível** se o pipeline de ingestão não encontrar bloqueadores de formato maiores que o previsto.
- O maior risco ao prazo é a descoberta tardia de documentos que requerem tratamento especial (OCR, tabelas complexas).
- O maior risco à qualidade é a documentação contraditória sem metadados de vigência.

---

## 4. Perguntas ao Tech Lead Antes de Confirmar o Cronograma de 3 Meses

**Pergunta 1 — Sobre qualidade do pipeline de ingestão:**  
"Você já fez uma amostragem dos PDFs do SharePoint para entender qual percentual tem tabelas como imagens embedadas ou é resultado de scan? Porque a estratégia de extração para cada caso é diferente, e se 30% da base precisar de OCR, isso afeta tanto o prazo quanto a precisão dos chunks — e não dá para descobrir isso na sprint 3."

*Rationale: A qualidade do RAG começa no pipeline de dados, não no modelo. O Tech Lead precisa ter clareza do esforço de engenharia de dados antes de comprometer o cronograma.*

**Pergunta 2 — Sobre tratamento de versões e metadados:**  
"Qual é nossa estratégia para documentos com versões conflitantes, como o PROC-042 e PROC-042-v2? Vamos exigir que a NovaTech resolva isso antes da ingestão, ou vamos implementar lógica de versionamento no pipeline? Porque se for no pipeline, precisamos de tempo para desenvolvimento e validação dessa lógica — e se for dependência da NovaTech, precisamos travar isso como pré-requisito formal no cronograma."

*Rationale: Documentos contraditórios sem metadado de vigência tornam impossível garantir que o assistente responda com a versão correta — isso não é um risco aceitável para go-live.*

**Pergunta 3 — Sobre orçamento de contexto e arquitetura de sessão:**  
"Como você está pensando o gerenciamento do contexto por sessão no Teams? Especificamente: qual o teto de tokens por query, quantos chunks serão recuperados, e como o histórico de conversa será truncado? Porque se deixarmos crescer sem limite, a qualidade das respostas vai degradar ao longo de uma sessão e o cliente vai perceber — mas o problema vai parecer aleatório e será muito difícil de diagnosticar em produção."

*Rationale: Context rot em sessões longas é invisível durante testes unitários e só aparece em uso real — a estratégia precisa ser definida na arquitetura, não corrigida depois.*

---

## 5. Histórico de Refinamento com o Claude

**Iteração 1 — Prompt inicial:**
> "Dado o cenário do projeto NovaTech (assistente de IA com RAG para 45 atendentes, base de ~1.250 documentos em múltiplos formatos com versões contraditórias), quais são os principais riscos relacionados às limitações de LLMs que impactariam prazo, custo e qualidade?"

*Output inicial do Claude:* Lista genérica com 5 riscos, incluindo "alucinação", "bias", "privacidade", "custo de API" e "adoção dos usuários". Útil como ponto de partida, mas riscos não eram específicos ao contexto NovaTech.

**Iteração 2 — Refinamento para especificidade:**
> "Os riscos estão muito genéricos. Me ajude a reformular o risco de alucinação de forma específica para o contexto da NovaTech: uma empresa com PROC-042 e PROC-042-v2 contraditórios, documentação em PDF com tabelas como imagens, e integração via Teams com sessões longas."

*Melhoria obtida:* O Claude reformulou o risco com exemplos concretos (mistura de multiplicadores das duas versões do PROC-042) e conectou o risco de alucinação ao de documentação contraditória como fator agravante.

**Iteração 3 — Adição do risco de contexto:**
> "Você não mencionou o risco de context rot. Para um assistente no Teams onde uma sessão pode ter 10 perguntas seguidas, e para uma base de ~1.250 fontes com chunks sendo recuperados dinamicamente, como esse risco se manifesta especificamente neste projeto?"

*Melhoria obtida:* O Claude adicionou a análise de context rot em sessões longas e o efeito "lost in the middle", conectando ao volume da base (~12M tokens estimados) e ao canal de integração (Teams).

**Iteração 4 — Validação das mitigações:**
> "Para cada mitigação proposta, me diga se ela é acionável (algo que o time pode implementar) ou apenas gestão de risco genérica (monitorar, ficar atento). Substitua as genéricas por ações concretas."

*Melhoria obtida:* O Claude identificou que "monitorar a qualidade das respostas" era genérico e o substituiu pela proposta de critério de exclusão de documentos não indexáveis e pelo guardrail determinístico de validação de citação de fonte.
