# PRD: Assistente de IA para Atendimento NovaTech (V1/MVP)

**Data:** 2026-05-28
**Autor:** Almir Oliveira — DB1
**Status:** Draft

---

## Problema

Os 45 atendentes da NovaTech gastam em média **12 minutos por chamado** buscando informações em ~1.200 documentos distribuídos entre SharePoint, Confluence e planilhas mensais. Com 192 consultas/dia que exigem busca documental, isso representa cerca de **38 horas/dia de trabalho improdutivo** — tempo que poderia ser revertido em atendimento ao cliente.

O problema se agrava porque a base documental tem inconsistências ativas (documentos conflitantes sem hierarquia formal, FAQ não validado) que levam atendentes a aplicar políticas incorretas, gerando retrabalho, cobranças erradas e risco jurídico.

---

## Usuários-Alvo

**Primário — Atendente de Suporte NovaTech**
- 45 pessoas, rotina de ~320 chamados/dia no total
- Usa Microsoft Teams como ferramenta central de trabalho
- Precisa de respostas rápidas, precisas e com rastreabilidade (fonte citada) para transmitir confiança ao cliente
- Não tem tempo para navegar por múltiplos sistemas durante um chamado ativo

**Secundário — Supervisor de Atendimento**
- Precisa garantir que respostas fornecidas estejam alinhadas com políticas vigentes
- Quer visibilidade sobre a qualidade das respostas do assistente para intervir quando necessário

---

## User Stories

- Como atendente, quero perguntar sobre políticas de frete, devolução e SLA em linguagem natural pelo Teams, para que eu não precise sair do fluxo do chamado para buscar documentos.
- Como atendente, quero que cada resposta cite o documento-fonte e o trecho original, para que eu possa validar a informação antes de repassar ao cliente.
- Como atendente, quero receber aviso explícito quando a resposta vier de um documento não-normativo (FAQ, wiki), para que eu saiba o nível de confiabilidade da resposta.
- Como supervisor, quero que o assistente se recuse a responder quando não encontrar informação confiável na base, para que os atendentes não repassem respostas inventadas.
- Como supervisor, quero que valores financeiros e prazos contratuais sejam apresentados com o trecho original do documento, para minimizar o risco de erros de interpretação.

---

## Requisitos

### Must Have — P0

- [ ] Interface conversacional via bot no Microsoft Teams (sem necessidade de nova ferramenta)
- [ ] Busca em documentos do SharePoint (PDFs, Word) e Confluence via RAG com Azure AI Search
- [ ] Cada resposta inclui: nome do documento, versão e trecho original citado
- [ ] Filtro por metadata `status: vigente` — documentos sem status explícito são excluídos do retrieval
- [ ] Aviso visível ao atendente quando a fonte for do corpus informal (FAQ, wikis não validados)
- [ ] Temperatura do LLM próxima a 0 para respostas factuais; instrução de não interpolar valores
- [ ] Recusa de resposta com mensagem explicativa quando não há fonte confiável na base
- [ ] Pipeline de ingestão que suporte re-indexação incremental agendada (< 24h após atualização documental)
- [ ] Suporte a extração de tabelas em PDFs (SLA, multiplicadores de frete) via Azure Document Intelligence
- [ ] Parser dedicado para planilhas Excel (tabelas de referência mensais)

### Should Have — P1

- [ ] Busca híbrida (vetorial + palavra-chave) com re-ranker no Azure AI Search
- [ ] Segregação de corpus: `normativo` (POL, PROC, SLA) vs. `informal` (FAQ, wikis) com prioridade ao normativo
- [ ] Alerta para documentos sem atualização há mais de 60 dias
- [ ] Logs de uso por atendente (perguntas realizadas, documentos recuperados, feedbacks)
- [ ] Mecanismo de feedback inline no Teams (👍/👎 por resposta)

### Could Have — P2

- [ ] Dashboard de métricas de qualidade para o supervisor
- [ ] Integração com planilhas de referência mensais via blob storage automatizado
- [ ] Sugestão proativa de documentos relacionados ao tema do chamado

---

## Out of Scope (V1)

- Criação ou edição de documentos pelo assistente
- Integração com sistema de tickets (abertura automática de chamados)
- Atendimento direto ao cliente final (apenas uso interno pelos atendentes)
- Documentos marcados como confidenciais (contratos individuais, dados pessoais)
- Suporte a idiomas além do português
- Treinamento fine-tuning do modelo — V1 usa apenas RAG sobre o modelo base

---

## Métricas de Sucesso

| Métrica | Atual | Meta V1 | Como medir |
|---------|-------|---------|------------|
| Tempo médio de busca por chamado | 12 min | < 2 min | Timestamps de abertura/fechamento de chamados |
| Taxa de respostas com fonte citada | 0% | > 95% | Log do sistema |
| Taxa de escaladas por resposta incorreta | — | < 5% dos chamados | Feedback dos atendentes |
| Precisão das respostas (avaliação humana) | — | > 85% | Sample de 50 perguntas/semana avaliadas pelo supervisor |
| Atualização da base após mudança documental | manual (dias) | < 24h | Pipeline de re-ingestão agendado |

---

## Pré-condições (Responsabilidade NovaTech)

O V1 só entra em produção se as seguintes condições forem atendidas. Sem elas, o risco de respostas incorretas inviabiliza o go-live:

- [ ] Conflito PROC-042 v1/v2 resolvido: uma versão marcada como `vigente`, outra como `obsoleto`
- [ ] FAQ-Atendimento auditado: itens conflitantes com normativos corrigidos ou sinalizados como não-oficiais
- [ ] Schema de metadata aplicado a todos os documentos: `versao`, `data_vigencia`, `status`, `responsavel`
- [ ] Owner de conhecimento nomeado na NovaTech (responsável por aprovar atualizações da base)
- [ ] Lista de documentos confidenciais entregue à DB1 (não serão indexados)
- [ ] Credenciais de acesso provisionadas: SharePoint, Confluence API, Azure AI Services

---

## Questões em Aberto

- Quem na NovaTech tem autoridade para resolver o conflito PROC-042 v1/v2? (Diretoria Comercial?)
- Qual o SLA contratual de atualização da base após mudança documental aceito pelo cliente?
- O supervisor precisa de acesso direto aos logs de uso antes do go-live ou isso pode ser fase 2?
- Há documentos em Confluence que exigem autenticação por usuário (não por token de serviço)?

---

## Apêndice

- [Estudo de Viabilidade](../estudo_de_viabilidade.md) — análise completa de riscos e arquitetura
- [ADR-001 Regras de Negócio NovaTech](../ADR-001-regras-negocio-novatech.md)
- [ADR-002 Validação de Arquitetura](../ADR-002-validacao-arquitetura.md)
- Documentos fonte analisados: `PROC-042 v1`, `PROC-042 v2`, `POL-001`, `SLA-2024`, `FAQ-atendimento`
