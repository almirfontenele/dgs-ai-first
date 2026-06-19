# Processo de Geração — Exercício 3.2

## Tarefa 1: Plano de Observabilidade (Claude Chat)

### Processo com Claude

**Prompt enviado:**

```
Contexto: NovaTech está após go-live de um assistente de IA.
Necessidade: Criar plano de observabilidade com métricas, alertas e feedback loop.

Estruture o plano cobrindo:

1. MÉTRICAS (4 dimensões):
   - Uso (perguntas/dia, latência)
   - Qualidade (feedback negativo, escalações)
   - Técnicas (latência, taxa de erro)
   - Conteúdo (documentos, gaps de knowledge)

2. ALERTAS (3 com thresholds concretos):
   - Exemplo: "se feedback negativo > 15% em 24h → notificar time"
   - Include: trigger, severidade, responsável, ação

3. FEEDBACK LOOP (do atendente à correção):
   - Como o problema é reportado?
   - Como vira investigação?
   - Como vira melhoria no assistente?
   - Quanto tempo leva?

Use tabelas e estrutura clara.
```

### Iterações & Refinamentos

**V1 → V2:**
- Adicionado "Método" na coluna de métricas (como coletar)
- Incluído SLAs específicos (target values)
- Expandido feedback loop com diagrama de fluxo
- Incluído responsabilidades para cada etapa

**V2 → V3 (Final):**
- Formatado com markdown sections para legibilidade
- Adicionado dashboard exemplo (visão semanal)
- Incluído frequência de revisão (diário/semanal/mensal)

### Output Final
📄 `plano-observabilidade.md` — Estrutura completa com:
- 4 tabelas de métricas (Uso, Qualidade, Técnica, Conteúdo)
- 3 alertas com thresholds e responsáveis
- Feedback loop visual + responsabilidades
- Dashboard exemplo + frequência

---

## Tarefa 2: Template de Relatório (Claude Cowork)

### Processo com Claude Cowork

**Prompt enviado:**

```
Tool: Claude Cowork

Crie um TEMPLATE de relatório semanal para NovaTech.
Requerimentos:
- 1 página (executivo entende em 2 min)
- KPIs principais com status visual (🟢🟡🔴)
- Mostra tendência (melhorou/piorou/igual)
- Inclui alertas acionados
- Ações para próxima semana

Formato: Markdown, pronto para ser preenchido toda semana.
```

### Iterações & Refinamentos

**V1 → V2:**
- Reduzido verbosidade para caber em 1 página
- Adicionado emojis para status rápido (🟢🟡🔴)
- Incluído "Feedback do Time" para qualitative input
- Adicionado checklist de go-live (relevância futura)

**V2 → V3 (Final):**
- Condensado seção de KPIs em 3 grupos (Qualidade, Uso, Performance)
- Incluído placeholders [DATA_INICIO], [DATA_FIM] para preenchimento
- Adicionado tabelas visuais (Trend = ↑↓—)

### Output Final
📄 `template-relatorio-semanal.md` — Template de 1 página com:
- Status geral (4 KPIs resumidos)
- 3 seções de KPI (Qualidade, Uso, Performance)
- Alertas acionados (com data/raiz/status)
- Melhorias implementadas (3 linhas max)
- Ações próxima semana (3 itens concretos)
- Feedback qualitativo
- Checklist go-live

---

## Validação contra Critérios de Avaliação

| Critério | Status | Evidência |
|----------|--------|-----------|
| **4 dimensões de métricas** | ✅ | Tabelas: Uso, Qualidade, Técnica, Conteúdo em plano-observabilidade.md |
| **Alertas com thresholds** | ✅ | "Feedback negativo > 15% em 24h", "Latência p95 > 4s", "Perguntas sem resposta > 8%" |
| **Feedback loop completo** | ✅ | 6 etapas: Coleta → Triagem → Investigação → Correção → Validação → Aprendizado |
| **Template executivo** | ✅ | Relatório semanal cabe em 1 página, emojis status, 2 min de leitura |
| **Mostra tendência** | ✅ | Coluna "Trend" com ↑↓— e comparação "Semana Anterior" |

---

## Como Usar os Templates

### Plano de Observabilidade
1. Copie `plano-observabilidade.md`
2. Customizar para seu assistente (adaptar métricas, thresholds)
3. Compartilhar com Tech Lead, Product Specialist, DevOps
4. Usar como baseline para alertas automáticos (integrar com Datadog, NewRelic, etc)

### Template de Relatório
1. Copie `template-relatorio-semanal.md`
2. Preencha placeholders: [DATA_INICIO], [DATA_FIM], etc
3. Extraia dados das métricas (plano-observabilidade.md como base)
4. Envie toda segunda-feira para stakeholders
5. Use para alinhar ações da semana seguinte

---

## Próximos Passos (Roadmap)

- [ ] Integrar alertas com Slack/Email automático
- [ ] Criar dashboard visual (Grafana/Looker) para métricas
- [ ] Automatizar coleta de dados (scripts/APIs)
- [ ] Monthly retrospectiva: está observabilidade ajudando?
