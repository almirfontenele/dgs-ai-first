# Estudo de Viabilidade — Assistente de IA para Atendimento NovaTech

**Elaborado por:** DB1 — Arquitetura de Sistemas  
**Data:** 2026-05-27  
**Versão:** 1.0  
**Baseado em:** viabilidade.md + análise dos documentos em `docs/fonte-da-verdade/`

---

## 1. Resumo Executivo

O projeto é **tecnicamente viável**, com arquitetura RAG (Retrieval-Augmented Generation) sobre Azure AI Services. A expectativa de reduzir o tempo de busca de 12 para menos de 2 minutos por chamado é atingível — o ganho de produtividade está dentro do alcance demonstrado por projetos similares de assistentes de atendimento com RAG.

**Porém, o maior risco do projeto não é a IA: é a qualidade e governança da documentação de entrada.** A análise dos documentos reais da NovaTech revelou três problemas estruturais que, se não tratados antes do desenvolvimento, comprometem diretamente a precisão do assistente e podem gerar passivos jurídicos e financeiros.

**Veredicto:** Viável com condições. As condições estão detalhadas na seção de riscos e no plano de mitigação.

---

## 2. Contexto e Escopo

| Item | Detalhe |
|------|---------|
| Cliente | NovaTech — logística, 1.200 funcionários |
| Usuários finais | 45 atendentes |
| Volume | ~320 chamados/dia, ~192 envolvem consulta a docs (60%) |
| Fontes de dados | SharePoint (~800 docs PDF/Word) + Confluence (~400 páginas) + pasta de rede (planilhas mensais) |
| Integração alvo | Microsoft Teams + SharePoint |
| Infraestrutura | Microsoft 365 E3 já licenciado + Azure AI Services a provisionar |
| Prazo contratado | 3 meses (discovery + desenvolvimento + go-live) |
| Meta | Tempo médio de busca: de 12 min → < 2 min por chamado |

---

## 3. Arquitetura Proposta

```
Atendente (Teams)
      │
      ▼
Azure Bot Service  ──▶  Azure OpenAI (GPT-4o / turbo)
                               │
                         Orquestrador RAG
                         (LangChain / Semantic Kernel)
                               │
                  ┌────────────┼────────────┐
                  ▼            ▼            ▼
          Azure AI Search   Confluence   Planilhas
          (SharePoint index)  connector   (blob storage)
```

**Componentes principais:**

- **Ingestão**: pipeline de extração de PDF/Word (Document Intelligence), chunking semântico e geração de embeddings
- **Recuperação**: Azure AI Search com busca híbrida (vetorial + palavra-chave) + re-ranker
- **Geração**: Azure OpenAI com prompt de sistema restritivo (responde só com base em fontes recuperadas)
- **Citação de fonte**: cada resposta inclui nome do documento, versão e trecho original
- **Interface**: bot no Teams via Azure Bot Service

**Stack recomendado** (alinhado ao ecossistema Microsoft já existente):

| Camada | Tecnologia |
|--------|-----------|
| LLM | Azure OpenAI (GPT-4o) |
| Embeddings | text-embedding-3-large |
| Search | Azure AI Search (tier Standard S1) |
| Ingestão | Azure Document Intelligence + Python pipeline |
| Orquestração | Semantic Kernel (C#) ou LangChain (Python) |
| Bot | Azure Bot Service + Teams channel |
| Infra | Azure App Service ou Container Apps |

---

## 4. Análise de Viabilidade por Dimensão

### 4.1 Viabilidade Técnica — VIÁVEL COM RESSALVAS

A arquitetura RAG em Azure é madura, bem documentada e o ecossistema Microsoft já existente reduz atrito de integração.

**Pontos positivos:**
- M365 E3 inclui conectores nativos para SharePoint → simplifica ingestão
- Azure AI Search suporta crawl incremental do SharePoint
- Volume de 192 consultas/dia é baixo — sem pressão de escala
- Documentos estruturados (PDFs, Word, Markdown) têm boa taxa de extração

**Pontos de atenção técnicos:**
- Planilhas Excel mensais exigem parser específico (dados tabulares não extraem bem com OCR genérico)
- PDFs com tabelas complexas (ex.: tabelas de SLA, multiplicadores de frete) podem ter extração degradada dependendo do software de origem
- Integração com Confluence via API requer token de serviço com permissões adequadas

### 4.2 Viabilidade Operacional — VIÁVEL COM CONDIÇÕES

A operação requer um processo de atualização mensal da base de conhecimento sincronizado com os ciclos de atualização documental das 3 áreas (Operações, Compliance, Comercial).

### 4.3 Viabilidade de Prazo — ALTO RISCO

3 meses é **apertado**, não impossível. O cronograma só fecha se o problema de governança documental for tratado em paralelo ao desenvolvimento (não sequencialmente).

### 4.4 Viabilidade de ROI — POSITIVO

Com 192 consultas/dia × 10 minutos economizados × 45 atendentes × custo/hora estimado, o retorno operacional é expressivo e justifica o investimento técnico.

---

## 5. Riscos Técnicos Identificados

Os riscos abaixo foram identificados pela análise direta dos documentos reais da NovaTech.

---

### RISCO 1 — Documentos conflitantes sem hierarquia formal
**Severidade: CRÍTICA | Probabilidade: CONFIRMADA**

**Evidência direta:** `PROC-042-frete-especial-v1.md` e `PROC-042-v2-frete-especial-revisado.md` coexistem no SharePoint com multiplicadores diferentes e sem indicação formal de qual está vigente.

| Região | v1 (multiplicador) | v2 (multiplicador) |
|--------|-------------------|-------------------|
| Sul | 1.2 | 1.3 |
| Nordeste | 1.4 | 1.5 |
| Norte | 1.6 | 1.8 |

O fator de peso também diverge:
- v1: fator 1.2 para 1.001–3.000kg; 1.5 acima de 3.000kg
- v2: fator 1.15 para 1.001–3.000kg; 1.4 acima de 3.000kg

**Impacto:** Se o RAG recuperar ambos os documentos para uma mesma pergunta sobre frete especial, o LLM pode: (a) citar valores incorretos, (b) misturar as versões, ou (c) responder com incerteza inutilizável. Em qualquer caso, o atendente recebe uma resposta que pode gerar cobrança errada com passivo financeiro e contratual.

**Mitigação necessária antes do desenvolvimento:**
- Definir e registrar formalmente qual documento está vigente (metadata `status: obsoleto` ou `status: vigente`)
- Implementar filtro por campo de metadata no retrieval para excluir documentos obsoletos
- Criar regra de negócio no pipeline de ingestão: documentos sem `status` explícito entram em quarentena

---

### RISCO 2 — Documento informal sem governança misturado à base oficial
**Severidade: ALTA | Probabilidade: CONFIRMADA**

**Evidência direta:** `FAQ-atendimento.md` tem cabeçalho explícito: *"Versão: Não controlada. Responsável: Nenhum. NÃO validado por Compliance ou Operações."*

O documento contém informações potencialmente incorretas ou desatualizadas que contradizem a documentação oficial:
- Item 45 do FAQ cita "mais de 10 fretes especiais/mês" para desconto automático, mas a PROC-042-v2 define o limiar como 8 fretes/mês
- Item 27 usa threshold de R$ 50.000 para prioridade alta, enquanto SLA-2024 define incidente crítico a partir de R$ 100.000

**Impacto:** Se ingerido sem segregação, o RAG pode apresentar respostas do FAQ informal como se fossem política oficial, gerando orientações erradas aos clientes com risco jurídico e de reputação.

**Mitigação:**
- Segregar documentos em dois corpora: `normativo` (POL, PROC, SLA, tabelas oficiais) e `informal` (FAQ, wikis de atendimento)
- Configurar o sistema para responder preferencialmente pelo corpus normativo
- Exibir aviso explícito ao atendente quando a fonte for do corpus informal
- Idealmente: auditar o FAQ antes do go-live e remover ou atualizar itens conflitantes

---

### RISCO 3 — Ausência de processo unificado de atualização documental
**Severidade: ALTA | Probabilidade: CONFIRMADA**

**Evidência:** 3 áreas (Operações, Compliance, Comercial) atualizam documentos mensalmente sem processo unificado de revisão. A própria PROC-042-v2 menciona que a PROC-043 *"está em processo de revisão pelo Compliance e pode sofrer alterações"* — sem data ou responsável.

**Impacto no sistema de IA:**
- A base de conhecimento ficará desatualizada se não houver pipeline de re-ingestão automática
- Documentos em revisão podem ser ingeridos em estado incompleto
- Sem controle de versão, o sistema não saberá qual chunk foi alterado

**Mitigação:**
- Implementar pipeline de re-ingestão incremental agendado (ex.: diário via Azure Data Factory ou Function App)
- Exigir que cada documento tenha campos obrigatórios de metadata: `versao`, `data_vigencia`, `status`, `responsavel`
- Criar alerta para documentos sem atualização há mais de 60 dias (possível desatualização)
- Definir SLA de atualização da base com o cliente como parte do contrato de operação

---

### RISCO 4 — Alucinação em respostas com implicação financeira ou contratual
**Severidade: ALTA | Probabilidade: MODERADA**

Os documentos contêm cálculos precisos (multiplicadores, prazos contratuais, percentuais de penalidade) que são compromissos formais com clientes. Um LLM pode interpolar valores incorretamente, especialmente quando os documentos são conflitantes (ver Risco 1).

**Exemplos de campos de alto risco:**
- Multiplicadores regionais de frete (impacto financeiro direto)
- Prazos de SLA por tier (impacto contratual)
- Percentuais de penalidade por descumprimento de SLA
- Prazos de devolução (7 dias úteis — prazo legal)

**Mitigação:**
- Configurar temperatura do LLM próxima a 0 para respostas factuais
- Implementar prompt de sistema com instrução explícita: *"Cite o valor exato do documento. Nunca calcule ou interpole valores não presentes na fonte."*
- Para campos críticos (valores monetários, prazos contratuais), exibir o trecho original junto à resposta
- Avaliar guardrails específicos para detectar respostas com números sem citação de fonte

---

### RISCO 5 — Prazo de 3 meses com dependência de pré-requisitos externos
**Severidade: ALTA | Probabilidade: ALTA**

O cronograma de 3 meses pressupõe que os pré-requisitos de dados e governança estarão disponíveis. Na prática, a NovaTech precisará executar ações de preparação documental que dependem de aprovação interna, alinhamento entre 3 áreas e possivelmente mudança de processo.

**Dependências críticas externas (fora do controle da DB1):**
- Resolução do conflito PROC-042 v1/v2 (quem decide? Diretoria Comercial?)
- Auditoria e limpeza do FAQ informal
- Provisionamento das credenciais Azure AI Services e permissões de leitura no SharePoint e Confluence
- Definição de quais documentos são confidenciais e não devem ser indexados

**Mitigação:**
- Incluir no contrato um "sprint 0" de discovery e preparação de dados (2 semanas) como pré-condição para início do desenvolvimento
- Definir data limite para entrega dos pré-requisitos pelo cliente, com impacto explícito no prazo caso não cumprido
- Iniciar desenvolvimento com corpus controlado (apenas documentos sem conflito identificado) e expandir progressivamente

---

### RISCO 6 — Extração de dados tabulares e planilhas
**Severidade: MÉDIA | Probabilidade: ALTA**

As tabelas de SLA, multiplicadores de frete e planilhas de referência mensais contêm dados tabulares críticos. Extração de tabelas em PDFs e Excel por OCR/parser genérico tem taxa de erro relevante, especialmente em documentos com formatação complexa.

**Mitigação:**
- Usar Azure Document Intelligence (modelo `prebuilt-layout`) para PDFs com tabelas — suporte nativo a extração estruturada
- Para planilhas Excel, implementar parser dedicado (openpyxl / pandas) em vez de conversão para texto
- Validar manualmente a extração das tabelas críticas (SLA, multiplicadores) antes do go-live

---

## 6. Cronograma Recomendado (3 meses)

```
Semana 1-2  │ Sprint 0 — Discovery e preparação
            │ • Mapeamento completo das fontes e volumes
            │ • Resolução dos conflitos documentais (com NovaTech)
            │ • Provisionamento Azure e permissões
            │ • Definição do schema de metadata obrigatório
            │
Semana 3-6  │ Fase 1 — Infraestrutura RAG
            │ • Pipeline de ingestão (SharePoint + Confluence + planilhas)
            │ • Indexação Azure AI Search com metadata
            │ • Chunking e embeddings do corpus normativo
            │ • Testes de recuperação (precision@k, recall)
            │
Semana 7-9  │ Fase 2 — Interface e integração
            │ • Bot no Teams (Azure Bot Service)
            │ • Prompt engineering e testes de qualidade de resposta
            │ • Casos de teste com perguntas reais do time de atendimento
            │ • Guardrails para campos financeiros e contratuais
            │
Semana 10-11│ Fase 3 — Piloto e ajustes
            │ • Piloto com 5-10 atendentes voluntários
            │ • Coleta de feedback e ajuste de retrieval/prompt
            │ • Validação da meta (tempo de busca < 2 min)
            │
Semana 12   │ Go-live e estabilização
            │ • Rollout para os 45 atendentes
            │ • Monitoramento de métricas de uso e qualidade
            │ • Handoff do pipeline de re-ingestão para a operação
```

**Atenção:** O cronograma é sequencialmente dependente do Sprint 0. Atrasos na preparação documental comprimem as fases subsequentes.

---

## 7. Métricas de Sucesso

| Métrica | Meta | Como medir |
|---------|------|-----------|
| Tempo médio de busca | < 2 minutos | Comparar timestamps de abertura e fechamento de chamados |
| Taxa de respostas com fonte citada | > 95% | Log do sistema |
| Taxa de escaladas por resposta incorreta | < 5% dos chamados | Feedback dos atendentes |
| Precisão das respostas (avaliação humana) | > 85% | Sample de 50 perguntas/semana avaliadas pelo supervisor |
| Tempo de atualização da base após mudança documental | < 24h | Pipeline de re-ingestão agendado |

---

## 8. Condições para Viabilidade (Pré-requisitos do Cliente)

As seguintes ações são responsabilidade da NovaTech e devem ser concluídas antes ou durante o Sprint 0:

- [ ] **Resolver o conflito PROC-042 v1/v2**: definir formalmente qual versão está vigente, marcar a obsoleta no SharePoint
- [ ] **Auditar o FAQ-Atendimento**: identificar itens que contradizem documentos normativos, corrigir ou sinalizar explicitamente como "não oficial"
- [ ] **Definir schema de metadata**: todos os documentos devem ter `versao`, `data_vigencia`, `status` (vigente/obsoleto/em-revisão), `responsavel`
- [ ] **Provisionar acesso**: credenciais de leitura no SharePoint, token de API do Confluence, acesso ao Azure para a DB1
- [ ] **Mapear documentos confidenciais**: identificar quais documentos NÃO devem ser indexados (contratos individuais, dados pessoais, etc.)
- [ ] **Nomear um owner de conhecimento**: ponto focal na NovaTech responsável por validar e aprovar atualizações da base de conhecimento do assistente

---

## 9. Conclusão

| Dimensão | Avaliação |
|----------|-----------|
| Viabilidade técnica | VIÁVEL |
| Viabilidade de prazo (3 meses) | VIÁVEL COM RISCO — depende de Sprint 0 sem atrasos |
| Viabilidade de custo | VIÁVEL — stack Azure alinhado à infraestrutura existente |
| Viabilidade operacional | VIÁVEL COM CONDIÇÕES — requer processo de atualização documental |
| Risco principal | Qualidade e consistência da documentação de entrada |

O projeto deve ser iniciado com um contrato que explicite os pré-requisitos acima como condição para o prazo de 3 meses. O risco mais crítico — documentos conflitantes — é resolvível, mas requer decisão e ação da NovaTech na primeira semana do projeto.

A meta de reduzir o tempo de busca de 12 para menos de 2 minutos é atingível com a arquitetura proposta, desde que a base de conhecimento seja consistente. Com documentação conflitante e sem governança, o assistente entregaria respostas que gerariam mais retrabalho do que a busca manual atual.

---

*Documento gerado com base na análise de: `viabilidade.md`, `PROC-042 v1`, `PROC-042 v2`, `POL-001`, `SLA-2024`, `FAQ-atendimento`*
