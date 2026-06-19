# Plano de Observabilidade — Assistente NovaTech

**Objetivo:** Monitorar saúde e qualidade do assistente pós go-live, identificando problemas rapidamente e habilitando melhoria contínua.

**Período:** Semanal (relatório) + Real-time (alertas)

---

## 1. Métricas a Coletar

### 📊 Dimensão de Uso

| Métrica | Frequência | Target/Normal | Método |
|---------|-----------|---|---------|
| Perguntas/dia | Diário | 200–400 | Logs do endpoint |
| Tempo médio de resposta | Diário | < 3s (p95) | Telemetria da API |
| Taxa de abandono (timeout) | Diário | < 2% | Contagem de timeouts |
| Horários de pico | Semanal | Identificar padrão | Análise de distribuição |

### ⭐ Dimensão de Qualidade

| Métrica | Frequência | Target/Normal | Método |
|---------|-----------|---|---------|
| % Feedback negativo | Diário | < 10% | Reações dos usuários |
| % Escalações (humano chamado) | Diário | < 5% | Logs de escalação |
| Taxa de rejeição (usuário não aceita resposta) | Diário | < 8% | Explicit feedback |
| Confiança média das respostas | Semanal | > 0.75 (RAG score) | Metadata da resposta |

### ⚡ Dimensão Técnica

| Métrica | Frequência | Target/Normal | Método |
|---------|-----------|---|---------|
| Latência p50/p95/p99 | Diário | p50:<1s, p95:<2s, p99:<5s | APM (Application Performance) |
| Taxa de erro (5xx) | Diário | < 0.5% | HTTP status codes |
| Taxa de timeout | Diário | < 1% | Request timeout logs |
| Disponibilidade (uptime) | Diário | > 99.5% | Health check endpoint |

### 📝 Dimensão de Conteúdo

| Métrica | Frequência | Target/Normal | Método |
|---------|-----------|---|---------|
| Documentos mais consultados | Semanal | Top 10 lista | RAG retrieval logs |
| Perguntas sem resposta | Semanal | < 5% das perguntas | Feedback "não ajudou" |
| Gaps de documentação identificados | Semanal | Agregar por tópico | Análise de falhas |
| Taxa de resposta com múltiplas fontes | Semanal | > 60% | Count de docs citados |

---

## 2. Alertas com Thresholds Concretos

### 🔴 Alerta 1: Qualidade degradada
**Trigger:** Feedback negativo **> 15% em 24h**  
**Severidade:** Alta  
**Responsável:** Tech Lead + Product Specialist  
**Ação:** Investigar últimas 100 respostas, identificar padrão, corrigir prompt/conteúdo em 24h  
**Escalation:** Se > 20% em 48h → pausar algumas features, revisar corpus

### 🟠 Alerta 2: Performance degradada
**Trigger:** Latência p95 **> 4s OU taxa de erro > 1%** em 1h  
**Severidade:** Média  
**Responsável:** DevOps + Tech Lead  
**Ação:** Verificar logs, escalar recursos se necessário, investigar query lenta  
**Escalation:** Se > 2h → pode impactar UX, notificar cliente

### 🟡 Alerta 3: Conteúdo insuficiente
**Trigger:** Perguntas sem resposta **> 8% em 24h**  
**Severidade:** Média  
**Responsável:** Product Specialist + Content Team  
**Ação:** Revisar perguntas não respondidas, atualizar documentação  
**Escalation:** Se continua 7 dias → roadmap adicional de docs

---

## 3. Feedback Loop: Do Atendente à Correção

```
┌─────────────────────────────────────────────────────────────┐
│ 1. COLETA (Atendente/Usuário)                              │
├─────────────────────────────────────────────────────────────┤
│ • Usuário clica "não foi útil" ou "precisa humano"         │
│ • Atendente (se escalado) documenta problema               │
│ → Armazenar em base "Feedback" com metadata                │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│ 2. TRIAGEM (Daily, 10min)                                  │
├─────────────────────────────────────────────────────────────┤
│ • Product Specialist agrupa feedback por tipo              │
│ • Identifica padrões (ex: 3+ mesma pergunta em 24h)        │
│ • Classifica: (A) Conteúdo, (B) Prompt, (C) Técnico        │
│ → Criar "Issue" para cada padrão                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│ 3. INVESTIGAÇÃO (24-48h)                                   │
├─────────────────────────────────────────────────────────────┤
│ • Tech Lead reproduz o problema com dados reais            │
│ • Analisa: qual doc foi usado? qual foi o score?           │
│ • Propõe: atualizar doc / refinar prompt / fix técnico      │
│ → Descrever a raiz em ADR ou comment                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│ 4. CORREÇÃO (1–3 dias)                                     │
├─────────────────────────────────────────────────────────────┤
│ • Atualizar documentação OU refinar prompt OU fix código    │
│ • Testar com as perguntas que falharam                      │
│ • Deploy em staging para validação                          │
│ → Marcar Issue como "Ready for QA"                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│ 5. VALIDAÇÃO (1 semana)                                    │
├─────────────────────────────────────────────────────────────┤
│ • QA testa a correção em cenários variados                 │
│ • Monitora métrica de feedback para aquele tópico          │
│ • Valida: feedback negativo volta a <10% para esse tipo    │
│ → Fechar Issue, registrar em "Release Notes"              │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│ 6. APRENDIZADO (Weekly)                                    │
├─────────────────────────────────────────────────────────────┤
│ • Delivery Manager report: quantas issues fechadas?         │
│ • Qual foi o tempo médio de correção?                       │
│ • O padrão de feedback está melhorando?                     │
│ → Input para próxima semana de priorização                 │
└─────────────────────────────────────────────────────────────┘
```

### Responsabilidades no Loop
- **Usuário/Atendente:** Reportar problema via feedback
- **Product Specialist:** Triagem diária, agregar padrões
- **Tech Lead:** Investigação técnica, propor solução
- **Developer:** Implementar correção
- **QA:** Validar fix, monitorar métrica
- **Delivery Manager:** Acompanhar ciclo, garantir SLA

---

## 4. Dashboard de Status (Visão semanal)

Métricas a exibir no relatório semanal:

| Métrica | Status | Semana Anterior | Variação | Ação |
|---------|--------|-----------------|----------|------|
| Feedback negativo | 🟢 8% | 12% | ↓ 4% | — |
| Taxa de erro | 🟢 0.3% | 0.8% | ↓ 0.5% | — |
| Latência p95 | 🟡 3.8s | 2.1s | ↑ 1.7s | Investigar |
| Issues fechadas | 🟢 7 | 4 | ↑ 3 | Manter ritmo |
| Docs sem resposta | 🟠 7% | 5% | ↑ 2% | Atualizar conteúdo |

---

## 5. Frequência de Revisão

- **Diário:** Alertas (automático) + revisar se algum threshold foi acionado
- **Semanal:** Relatório consolidado para cliente
- **Mensal:** Retrospectiva — o que aprendemos? Como melhorar observabilidade?
