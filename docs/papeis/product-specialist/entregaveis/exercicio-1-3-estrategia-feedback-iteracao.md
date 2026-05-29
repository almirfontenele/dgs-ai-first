# Exercício 1.3 — Estratégia de Feedback e Iteração Rápida do Produto

**Projeto:** Assistente de IA para Atendimento — NovaTech  
**Elaborado por:** Product Specialist (DB1)  
**Data:** 2026-05-29  
**Versão:** 1.0

---

## 1. Contexto

LLMs não funcionam como software tradicional: não há um "deploy, monitor, tudo pronto". A qualidade das respostas é dinâmica — muda conforme os prompts são ajustados, conforme a base documental é atualizada, conforme o volume de queries revela padrões que testes não capturam.

Este exercício estrutura um ciclo de feedback rápido e iteração contínua que permite ao Assistente NovaTech **melhorar continuamente sem paralisações, mantendo a confiança dos usuários**.

---

## 2. Tipos de Feedback

Antes de coletar feedback, é preciso saber **qual feedback importa** para cada tipo de decisão de produto.

### 2.1 Feedback Operacional (Dia-a-Dia)

**O que é:** Dados sobre como os usuários estão usando o produto em tempo real.

| Tipo | Método | Frequência | Ação Imediata |
|------|--------|-----------|---------------|
| **Thumbs up/down** | Botões 👍/👎 em cada resposta (in-product) | Sempre | Agregar em dashboard; alertar se > 20% 👎 em uma categoria |
| **Categorização de erro** | Pop-up ao clicar 👎: qual tipo de erro? | Sempre que 👎 | Classificar por padrão (ex: 60% "resposta errada", 30% "não encontrou") |
| **Tickets de suporte** | E-mail/Teams para canal #assistente-ia-suporte | Conforme surge | Responder < 2 horas; documentar em FAQ se padrão |
| **Escaladas por qualidade** | Supervisor marca resposta como "questionável" | Conforme surge | QA + prompt refinement; teste antes de redeploy |

**Dashboard Operacional (atualizado 4x/dia):**
```
Total de Queries Hoje:        145
Taxa Thumbs Up:               78%
Taxa Thumbs Down:             22%
  ├─ Resposta errada:         8%
  ├─ Não encontrou:           10%
  └─ Difícil de entender:     4%

Tickets de Suporte (Hoje):     3 abertos
Escaladas QA (Hoje):           1

Top Categories com Erro:
  1. Frete (12% error rate) — Need investigation
  2. SLA (6% error rate)
  3. Devolução (5% error rate)
```

**Quando escalar para investigação:** Se uma categoria (ex: "Frete") tem > 10% error rate para 50+ queries em uma semana.

---

### 2.2 Feedback Estruturado (Semanal)

**O que é:** Coleta planejada via surveys e focus groups para entender barreiras e oportunidades.

| Tipo | Método | Frequência | Responsável |
|------|--------|-----------|------------|
| **NPS / Confiança** | Survey autoadministrado no Teams | Semanal (sempre segunda) | Product Specialist |
| **Uso / Abandono** | "Por que não usa o assistente?" (para users com < 2 queries/semana) | Semanal | Supervisor (via 1:1) |
| **Casos de uso não suportados** | "Qual pergunta o assistente não conseguiu responder que deveria?" | Semanal | Product Specialist (survey) |
| **Focus Group** | Reunião de 5-7 power users ou early adopters | Bi-semanal | Product Specialist + Tech Lead |
| **Entrevista com Supervisor** | Conversa 1:1 sobre qualidade observada | Semanal | Product Specialist |

**Survey Semanal (2 min, Monday mornings):**
```
1. Usou o Assistente de IA na última semana?
   [ ] Sim, múltiplas vezes
   [ ] Sim, 1-2 vezes
   [ ] Não

2. Qual sua confiança nas respostas dele? (1-10)
   [Slider]

3. Qual é a pergunta que ele mais frequentemente NÃO consegue responder?
   [Texto livre]

4. Em uma palavra, como você se sente usando o Assistente?
   [ ] Confiante [ ] Curioso [ ] Desconfiado [ ] Frustrado
```

---

### 2.3 Feedback Diagnóstico (Mensal)

**O que é:** Análise profunda de padrões para informar decisões de produto maiores.

| Tipo | Método | Frequência | Output |
|------|--------|-----------|--------|
| **Análise de Queries Erradas** | Deep dive em top 20 queries com error rate > 15% | Mensal | Relatório com causas raízes e fixes propostos |
| **Análise de Abandono** | Por que atendentes pararam de usar? (entrevistas estruturadas) | Mensal | Recomendações de UX ou funcionalidade |
| **Auditoria de Base Documental** | Quais documentos geram mais erros? | Mensal | Lista de documentos a revisar / re-formatar |
| **Análise de Cobertura** | Quais temas têm mais "não encontrou"? | Mensal | Oportunidades de documentação ou treinamento |

---

## 3. Ciclo de Feedback → Iteração → Validação

### 3.1 Ciclo de 1 Semana (Rapid Iteration)

```
SEGUNDA (Manhã):
├─ Revisão de dashboard operacional (D-7 a hoje)
├─ Análise de thumbs down (categorias com > 10% erro)
├─ Review de tickets de suporte (padrões emergentes?)
└─ Decisão: o que mexer essa semana?

SEGUNDA-TERÇA (Tarde):
├─ Tech Lead + Prompt Engineer prototipam fix(es)
│  └─ Exemplo: Frete com erro de 12%?
│     → Adicionar exemplo no system prompt
│     → Ou re-indexar PROC-042 com metadata
│     → Ou ambos
└─ Testes de validação (10 perguntas de frete)

QUARTA:
├─ Se testes passam (error rate < 5% em amostra)
│  └─ Deploy em produção
└─ Se falham
   └─ Volta ao drawing board

QUINTA-SEXTA:
├─ Monitoring intenso do fix
│  └─ Dashboard atualizado a cada 2h
├─ Se tudo bem
│  └─ Comunicar aos atendentes: "Melhoramos as respostas sobre frete!"
└─ Se regressão
   └─ Revert + volta ao drawing board

SEGUNDA (Próxima):
└─ Avaliar resultado; mover para próximo problema
```

**Decisão: Fix agora vs. Documenta para depois?**

| Fix em < 24h (Hoje) | Documenta para Review Mensal |
|-------------------|------------------------------|
| Erro claro em prompt (ex: instruir modelo a citar fonte) | Requer mudança arquitetural (ex: novo campo de metadata) |
| Documento disponível mas retrieval ruim (re-indexar) | Requer decisão de produto (ex: incluir FAQ no corpus?) |
| Exemplo missing no system prompt | Política de NovaTech (ex: como classificar frete?) |
| Parse simples de resposta | Mudança no pipeline de RAG |

---

### 3.2 Ciclo de 1 Mês (Strategic Review)

```
PRIMEIRA SEGUNDA (Fim de Sprint):
├─ Coleta de dados mensais (análise diagnóstica)
├─ Revisão com sponsor + stakeholders
│  ├─ Métrica: Redução de tempo de busca (meta < 3 min)
│  ├─ Métrica: Taxa de erro (meta < 5%)
│  ├─ Métrica: Taxa de adoção (meta > 90%)
│  └─ NPS (qual é o score?)
└─ Decisões para próximo mês:
   ├─ Continuar as melhorias atuais?
   ├─ Pivotar (novo prompt, nova arquitetura)?
   └─ Scale (V1.1: novas features)?

MID-MONTH:
├─ Prototipagem de mudanças maiores
└─ Planejamento de backlog para próximo mês

END-MONTH:
└─ Alinhamento com NovaTech sobre saúde do produto
   └─ "Está no caminho certo? Faltam mudanças?"
```

---

## 4. Framework: Por Que o Feedback Falha

Feedback sem ação = ruído. Antes de implementar um mecanismo de feedback, entenda **por que** ele é coletado:

| Feedback | Motivo de Coletar | Risco de Falha | Mitigação |
|----------|-------------------|----------------|-----------| 
| Thumbs up/down | Detectar erros emergentes rapidamente | Usuários não usam (5% taxa de clique é comum) | Incentivo explícito: "Seu feedback melhora o produto" |
| NPS Semanal | Entender se confiança está crescendo ou caindo | Fadiga de survey; taxa de resposta cai de 60% (semana 1) para 20% (semana 4) | Rotativo (5 atendentes/semana ao invés de todos) |
| Focus Group | Entender barreiras qualitativas | "Power users" podem não representar maioria; viés de seleção | Incluir 1-2 users que usam pouco ou abandonaram |
| Entrevista Supervisor | Validar qualidade observada | Supervisor pode ter medo de "criticar o novo sistema" | Framing: "Feedback nos ajuda a melhorar; não é avaliação" |

---

## 5. Guia de Ação por Tipo de Feedback

### 5.1 Se Thumbs Down > 10% em uma Categoria (Problema Agudo)

**Exemplo:** 15% das queries sobre "frete" recebem 👎

**Investigação (< 2 horas):**
1. Puxar top 10 queries sobre frete com 👎
2. Analisar: resposta errada, não encontrou, ou confusa?
3. Se 70%+ é "resposta errada" → likely RAG ou prompt issue
4. Se 70%+ é "não encontrou" → documento não está indexado / retrieval falhou

**Ação Rápida (< 24h):**
- **Resposta errada (ex: assistente mistura PROC-042 v1 e v2):**
  - Opção A: Remover documento obsoleto (PROC-042 v1) da indexação
  - Opção B: Adicionar ao system prompt: "Se há versões de PROC, use a versão com data de vigência mais recente"
  - Opção C: Ambas
  - Teste em 5 perguntas de frete → se error rate cai < 5%, deploy

- **Não encontrou (ex: atendente pergunta sobre "frete zona 5", doc diz "zona 5" mas retriever não traz):**
  - Opção A: Verificar se documento está realmente indexado (check em Azure AI Search)
  - Opção B: Re-indexar com metadados de zona explícitos
  - Opção C: Ajustar parâmetro de similaridade no retriever
  - Teste em 5 perguntas → deploy se funciona

**Comunicação (D+1):**
> "Melhoramos as respostas sobre frete com base em feedback de vocês. Se antes tinha dúvida, teste de novo — deve funcionar melhor agora. Continua tendo problema? Avisa no #assistente-ia-suporte."

**Monitoramento (D+2 a D+7):**
- Coletar novo feedback sobre frete
- Meta: Error rate cai para < 5% em 50+ queries

---

### 5.2 Se Adoção < 50% em D+7 (Problema Crítico)

**Investigação (imediato):**
1. Quem não está usando? (listar 10-15 atendentes)
2. Entrevistar 3-5 deles rapidamente (conversa informal, 5 min cada)
3. Patterns:
   - "Não confio nas respostas" → Qualidade issue
   - "Não sabia como usar" → Comunicação/UX issue
   - "Prefiro meu jeito" → Mudança de hábito natural (esperado)
   - "Assistente não responde meu tipo de pergunta" → Scope issue

**Ação (< 48h):**
- **Confiança baixa:** Mostrar exemplos de respostas corretas ao grupo; reforçar: "Só responde se tiver fonte; valida antes de repassar"
- **Não sabia usar:** Re-fazer demo em grupo (turma inteira); treinar 1:1 para quien não pegou
- **Scope limitation:** Documentar; comunicar para próxima sprint

**Comunicação (D+3):**
- Sessão de "bootcamp" com os usuários que não estão usando
- Demonstração ao vivo com perguntas deles próprios
- Objetivo: Reset a confiança

---

### 5.3 Se Focus Group Revela "Caso de Uso Não Suportado" (Oportunidade)

**Exemplo:** 4 de 7 power users dizem: "O assistente não responde perguntas sobre SLA por cliente específico — sempre responde genérico, mas o cliente tem contrato especial"

**Análise:**
1. É escopo V1? → Não (out of scope: documentos confidenciais, casos específicos)
2. É demanda real? → Sim (4 de 7 poder users mencionaram)
3. É viável? → Não, sem mudança de arquitetura (precisaria acessar base de contratos, não documentação pública)

**Decisão:**
- Documentar como "V1.1 opportunity: integrate with contracts database"
- Comunicar aos users: "Entendemos a necessidade; planejando para V1.1"
- Procurar workaround: "Por enquanto, procure o contrato específico no SharePoint, e o Assistente pode te ajudar com a política genérica"

**Comunicação aos Users:**
> "Vocês pediram para o Assistente responder sobre SLA customizado por contrato. Legal — anotamos. V1 trabalha com documentação pública, mas V1.1 vai integrar com a base de contratos. Enquanto isso, aqui está o workaround..."

---

## 6. Métricas de Sucesso do Feedback Loop

| Métrica | Target | Medição | Ação se Falhar |
|---------|--------|---------|----------------|
| **Tempo de resposta a ticket** | < 2h durante comercial | Log timestamps em Teams | Adicionar resource de suporte |
| **Taxa de feedback thumbs** | > 20% de queries têm feedback | Contar eventos em log | Incentivar mais explicitamente |
| **Taxa de survey response** | > 50% na primeira semana; > 30% em steady state | Survey analytics | Mudar para optin (rotating) |
| **Time-to-fix para issues categoricamente erradas** | < 48h | Rastrear desde report até deploy | Priorizar debugging |
| **Regressão após fix** | < 5% (fix não piora outra coisa) | Comparar error rate antes/depois | Aumentar rigor de teste antes de deploy |
| **User satisfaction (NPS)** | > 6/10 (stable/growing) | NPS survey mensal | Investigar causas de insatisfação |

---

## 7. Template: Relatório Semanal de Feedback

**Enviado toda segunda-feira para: Sponsor + Tech Lead + Supervisor**

```
FEEDBACK REPORT — Semana de 2026-05-27 a 2026-05-31
================================================

📊 OPERACIONAL (Dados de Real-Time)
─────────────────────────────────
Total de Queries:           425
Thumbs Up:                  321 (76%)
Thumbs Down:                104 (24%)
  ├─ Resposta errada:       44 (10%)
  ├─ Não encontrou:         48 (11%)
  └─ Confusa:               12 (3%)

🚨 ALERTS
─────────────────────────────────
⚠️  FRETE: Error Rate 14% (acima do target 5%)
    → Ação: Investigando segunda-feira
    
✅ DEVOLUÇÃO: Error Rate 3% (em target)

📞 SUPORTE
─────────────────────────────────
Tickets Abertos:            5
Tempo Médio de Resposta:    1.5h ✅
Problema Mais Comum:        "Por que o assistente não respondeu?"
                            → Provavelmente "não encontrou"

📈 ADOÇÃO
─────────────────────────────────
Usuários Ativos (semana):   38 / 45 (84%)
Queries/Usuário/Dia:        2.0
Crescimento vs Semana Anterior: +12% ✅

🎯 SATISFACTION
─────────────────────────────────
NPS (survey de 12 respondentes): 6.8/10 (aceitável)
Confiança Média (escala 1-10):   7.1/10 (crescendo 📈)

📋 PRÓXIMAS AÇÕES
─────────────────────────────────
[ ] Investigar FRETE error rate (Monday morning)
[ ] Deploy fix para FRETE (se validado Tuesday)
[ ] Focus group com 5 power users (Thursday)
[ ] Comunicar melhorias aos atendentes (Friday)

FIM DE RELATÓRIO
```

---

## 8. Cadência Recomendada de Comunicação com Usuários

| Frequência | Tipo | Mensagem | Canal |
|-----------|------|----------|-------|
| **Diária (quando há fix)** | "Melhoria" | "Melhoramos respostas sobre X. Teste agora" | Teams pinned |
| **Semanal (segunda)** | "Pulse" | "Esse mês: 85% de satisfação, 425 queries" | E-mail summary |
| **Bi-semanal** | "Feedback request" | Survey + focus group | Teams |
| **Mensal** | "Retrospective" | "Reduzimos tempo de busca de 12 para 2.5 min 🎉" | E-mail + all-hands |
| **Quando problema emerge** | "Alert" | "Estamos ciente do problema de frete; corrigindo" | Tickets/suporte |

---

## 9. Outcome Esperado

Ao final deste exercício, você terá:

1. **Framework de Feedback Completo:** Tipos de feedback (operacional, estruturado, diagnóstico) com método, frequência, responsável.
2. **Ciclos de Iteração Definidos:** Cadências de 1 semana (rapid fix) e 1 mês (strategic review).
3. **Guias de Ação:** "Se X acontecer, faça Y" para os cenários mais prováveis (erro agudo, adoção baixa, novo caso de uso).
4. **Dashboard e Relatórios:** Templates prontos para monitorar saúde do produto.
5. **Comunicação com Usuários:** Cadência e tipo de mensagem por situação.

**Validação:** Em D+7, você consegue mostrar ao sponsor: "Aqui está o que aprendemos, aqui está o que mudamos baseado em feedback." Produto melhora visivelmente a cada semana, usuários sentem que feedback deles importa.

---

## 10. Exemplo: Semanas 1-4 de Feedback em Ação

```
SEMANA 1 (Go-Live + 7 dias)
├─ Dashboard: 76% thumbs up, 24% thumbs down
├─ Problema detectado: FRETE 14% error (vs. 5% em outras categorias)
├─ Investigation: Assistente mistura PROC-042 v1 (obsoleto) com v2 (vigente)
├─ Fix: Remover PROC-042 v1 da indexação, test, deploy (Tuesday)
├─ Resultado (Friday): FRETE error cai para 6% (melhorando)
├─ Comunicação: "Melhoramos respostas sobre frete!"
└─ Próxima semana: Monitor se stabiliza em < 5%

SEMANA 2 (D+14)
├─ Dashboard: 78% thumbs up (crescendo), 22% thumbs down (diminuindo)
├─ Focus Group (Thursday): "Que tal adicionar mais exemplos de SLA?"
├─ Decision: V1.1 backlog (não afeta V1)
├─ Adoção: 38/45 users (84%), ainda crescendo
├─ Problem: 7 users ainda não estão usando; supervisor identifica "desconfiança"
├─ Action: Bootcamp sessions com esses 7 users (show success stories)
└─ Comunicação: "4 power users" estão pedindo feature X para V1.1

SEMANA 3 (D+21)
├─ Dashboard: Bootcamp working: 5 of 7 non-users now trying
├─ Adoção: 40/45 (89%)
├─ FRETE error rate: Estabilizado em 4% ✅
├─ New problem: DEVOLUÇÃO 8% error (crescendo)
├─ Investigation: FAQ-Atendimento não deixa claro quais categorias podem devolver
├─ Fix: Update system prompt com critérios de ineligibilidade
└─ Deploy: Tuesday; validar Friday

SEMANA 4 (D+28)
├─ Dashboard: Overall 79% thumbs up, error rate < 5% em todas categorias
├─ Adoção: 42/45 (93%) — só 3 abstainers (esperado)
├─ NPS: 7.0/10 (aceitável → bom)
├─ Confiança: 7.3/10 (crescendo)
├─ Review com Sponsor: "Alcançamos targets de V1. Próximo mês: V1.1?"
└─ Comunicação: "Mês 1 recap: 75% reduction in search time, 79% user satisfaction"
```

