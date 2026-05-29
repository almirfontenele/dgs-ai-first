# Exercício 1.2 — Plano de Habilitação e Documentação de Usuários

**Projeto:** Assistente de IA para Atendimento — NovaTech  
**Elaborado por:** Product Specialist (DB1)  
**Data:** 2026-05-29  
**Versão:** 1.0

---

## 1. Contexto

Um produto excelente pode falhar se os usuários não entendem como usá-lo. O Assistente de IA da NovaTech será integrado ao Microsoft Teams — ferramenta que os 45 atendentes já usam diariamente. A habilitação (training, documentação, suporte) determina se o assistente é **adotado rapidamente** (dias) ou **abandonado silenciosamente** (semanas).

Este exercício estrutura um plano de habilitação que minimiza fricção e maximiza confiança dos atendentes.

---

## 2. Análise de Audiência

### 2.1 Perfil dos Usuários Finais (Atendentes)

| Atributo | Descrição |
|----------|-----------|
| **Número** | 45 pessoas |
| **Rotina** | ~7 chamados/pessoa/dia (~320 chamados/dia total) |
| **Ferramenta Principal** | Microsoft Teams (integrado ao workflow de atendimento) |
| **Nível de Tech Literacy** | Intermediário (Teams, Excel, SharePoint navegam com conforto) |
| **Atitude para IA** | Desconfiança inicial ("vai tirar meu trabalho?") → curiosidade → adoção (se bem comunicado) |
| **Motivação** | Reduzir tempo de busca, aumentar confiança nas respostas |
| **Medo Principal** | Dar resposta errada ao cliente com base em informação do assistente |

### 2.2 Audiências Secundárias

| Papel | Necessidade | Artefato |
|-------|------------|----------|
| **Supervisor de Atendimento** | Validar qualidade de respostas; intervir quando necessário | Dashboard de métricas + guia de escalação |
| **Gerente de Documentação** | Manter base atualizada; sinalizando versões obsoletas | Guia de proprietário de documentação |
| **Suporte Técnico (DB1)** | Diagnosticar problemas; coletar feedback | Guia de troubleshooting + template de bug report |

---

## 3. Plano de Habilitação: Fases

### Fase 1: Pré-Lançamento (D-7 a D-0, onde D = go-live)

#### 3.1.1 Preparação Técnica

**Objetivo:** Garantir que o assistente está funcionando em staging com confiabilidade > 95% em amostra de 50 queries.

**Artefatos a Produzir:**
1. **Documento: "Guia de Validação do Assistente"**
   - 10-15 perguntas de teste (exemplos: "qual é o prazo de devolução para eletrônicos?", "qual o multiplicador de frete para zona 3?")
   - Respostas esperadas (com documentos-fonte)
   - Procedimento de feedback (como reportar erro)

2. **Checklist de Qualidade Pré-Launch**
   - [ ] 50 queries de teste respondidas com > 85% acurácia
   - [ ] Todas as respostas incluem citação de fonte
   - [ ] Latência média < 5 segundos
   - [ ] Mensagens de erro são claras ("Não encontrei essa informação na documentação oficial")
   - [ ] Integração Teams testada em múltiplos navegadores/dispositivos

**Responsável:** Tech Lead + QA  
**Critério de Conclusão:** Checklist assinado antes de D-5.

---

#### 3.1.2 Materiais de Treinamento Pré-Lançamento

**Objetivo:** Atendentes entendem como usar e confiam no assistente antes do go-live.

**Artefato 1: Vídeo de Demo (3-5 min, assíncrono)**
- **Cenas:**
  1. Atendente no Teams, recebe pergunta do cliente sobre frete
  2. Abre o assistente, pergunta em linguagem natural
  3. Assistente responde em < 5 segundos com fonte citada
  4. Atendente valida e repassa ao cliente
  5. Supervisor monitorando respostas no dashboard

- **Componentes:**
  - Transcrição em português
  - Legendas para acessibilidade
  - Link para documentação completa
  - Call-to-action: "Tire suas dúvidas na sessão de treinamento ao vivo"

**Artefato 2: Guia Rápido de Referência (1 página, laminar)**
- Título: "5 Passos para Usar o Assistente de IA NovaTech"
- Ilustração em 5 etapas (diagrama visual)
- Exemplos de perguntas boas: "Qual é o SLA para devolução de eletrônicos?"
- Exemplos de perguntas difíceis: "Este cliente pode devolver?"  → Assistente não responde (requer julgamento)
- Botão de contato para dúvidas
- QR code apontando para help.novatech.com/assistente

**Artefato 3: FAQ Interno (1 página, publicado em Teams e página do projeto)**
- "O que o assistente faz?" / "O que ele não faz?"
- "E se a resposta estiver errada?"
- "Como reportar um erro?"
- "Posso fazer perguntas sobre clientes específicos?" → Resposta: Não, documentação é genérica.
- "Por que a resposta mudou entre ontem e hoje?" → Resposta: Base foi re-indexada.

---

#### 3.1.3 Sessão de Treinamento Ao Vivo (Obrigatória)

**Quando:** D-2 (2 dias antes do go-live)  
**Duração:** 30 minutos por turno (até 3 sessões para cobrir os 45 atendentes)  
**Formato:** Teams meeting ao vivo com gravação para quem não puder comparecer  
**Facilitador:** Product Specialist + Tech Lead  

**Agenda:**
1. **Abertura (5 min):** Por que estamos fazendo isso (reduzir busca de 12 para < 3 min)
2. **Demo ao Vivo (10 min):** 5-7 exemplos de perguntas reais, mostrando fluxo completo
3. **Hands-On (10 min):** Atendentes fazem 2-3 perguntas de teste no assistente ao vivo
4. **Q&A (5 min):** Dúvidas levantadas imediatamente, documentadas para FAQ

**Materiais de Apoio:**
- Slide deck (4-5 slides)
- Documento com exemplos de perguntas/respostas esperadas
- Número de telefone / email para suporte pós-treinamento

**Critério de Conclusão:** 80%+ de atendentes presentes ou assistindo gravação.

---

### Fase 2: Lançamento (D = go-live)

#### 3.2.1 Comunicação de Lançamento

**E-mail de Anúncio (enviado D-0 ao fim do dia)**

> **Subject:** 🚀 Assistente de IA NovaTech — Ao Vivo Agora no Teams!
>
> Pessoal,
>
> O Assistente de IA que vocês conheceram no treinamento está ao vivo agora no Teams.
>
> **Como usar:** Abra uma conversa privada com o bot "NovaTech Assistente IA" ou mencione @assistente em um canal.
>
> **Exemplo de pergunta:** "Qual é o prazo de devolução para eletrônicos?"
>
> **Importante:** O assistente busca apenas na documentação oficial. Se algo não está documentado, ele te avisa. Você continua responsável de validar a resposta antes de repassar ao cliente.
>
> **Dúvidas?** Responda a este e-mail ou procure seu supervisor.
>
> Vamos reduzir o tempo de busca de 12 para < 3 minutos. 🎯

**Anúncio no Teams (canal geral)**

Mensagem pinada com video link + FAQ + número de contato de suporte.

---

#### 3.2.2 Suporte Reativo (Primeira Semana)

**Objetivo:** Responder rápido a problemas/dúvidas para evitar abandono.

**Setup:**
- Canal dedicado no Teams: #assistente-ia-suporte (monitored por Tech Lead + Product Specialist)
- Response SLA: < 2 horas durante horário comercial
- Escalonamento: Problemas técnicos (Tech Lead) vs. Dúvidas de uso (Product Specialist)

**Template de Resposta Padrão:**
> "Obrigado por reportar. Este é [tipo de problema: bug/dúvida de uso]. [Solução breve ou 'deixa comigo e volto em 2 horas']. Se precisar de mais ajuda, avisa."

---

### Fase 3: Pós-Lançamento (D+1 a D+30)

#### 3.3.1 Coleta de Feedback Estruturada

**Objetivo:** Entender o que funciona bem e o que precisa de iteração.

**Mecanismo 1: Feedback Inline (in-product)**
- Cada resposta do assistente tem dois botões: 👍 (útil) e 👎 (não foi útil)
- Ao clicar 👎, abre popup: "O que não foi útil? [ ] Resposta errada [ ] Não encontrou [ ] Difícil de entender [ ] Outro"
- Dados coletados em log centralizado

**Mecanismo 2: Pesquisa Semanal (opt-in)**
- Mensagem automática no Teams em D+7, D+14, D+21: "Como está sendo sua experiência com o Assistente? [Link para survey 2 min]"
- Pergunta-chave: "Em uma escala de 1-10, qual é sua confiança nas respostas?"
- Net Promoter Score (NPS) simples: "Recomendaria este assistente para seu colega?"

**Mecanismo 3: Focus Group (D+14)**
- Reunião de 1 hora com 5-7 atendentes que mais usaram o assistente
- Objetivo: Entender barreiras (por que alguém parou de usar) e oportunidades (qual pergunta o assistente não conseguiu responder que deveria?)

---

#### 3.3.2 Métricas de Adoção

**Dashboard de Adoção (atualizado diariamente, visível ao supervisor)**

| Métrica | Dia 1 | Dia 7 | Dia 30 | Meta |
|---------|-------|-------|--------|------|
| Usuários ativos | 12 | 30 | 40 | 45 (100%) |
| Queries por dia | 25 | 150 | 250 | 300+ |
| Taxa de resposta útil (thumbs up) | — | 72% | 78% | 80%+ |
| Taxa de escaladas por erro | — | 8% | 4% | < 5% |
| Tempo médio de busca (estimado) | 11 min | 5 min | 2.5 min | < 3 min |

**Ação Automática se Métrica Falhar:**
- Adoção < 50% no D+7 → Sessão de re-engajamento + análise de barreiras
- Taxa de erro > 10% → Revisar top 20 queries com erro e corrigir

---

#### 3.3.3 Iterações Rápidas (D+7 a D+30)

**Ciclo de Melhoria:**
1. **Coleta (Dia 1-7):** Feedback inline + suporte tickets
2. **Análise (Dia 8):** Identificar padrões (ex: "20% das queries sobre frete recebem resposta imprecisa")
3. **Fix (Dia 9-10):** Ajustar prompts, adicionar exemplos ao sistema, re-indexar documentos se necessário
4. **Deploy (Dia 11):** Mudanças ativas
5. **Comunicação (Dia 12):** E-mail aos atendentes: "Melhoramos as respostas sobre frete — teste agora"

**Exemplo de Iteração D+7:**
- **Feedback:** 15% das queries sobre "multiplicador de frete" retornam respostas confusas (assistente traz valores de PROC-042 v1 e v2)
- **Causa Raiz:** PROC-042 e PROC-042-v2 ainda ambas indexadas sem metadata de vigência clara
- **Fix:** (1) Marcar PROC-042-v2 como `vigente`, PROC-042 como `obsoleto` na base NovaTech; (2) Re-indexar; (3) Testar 10 queries sobre frete
- **Deploy:** Re-indexação aplicada; atendentes notificados
- **Validação (D+8):** Coleta de feedback nova — taxa de erro deve cair para < 5%

---

## 4. Documentação Entregue em Cada Fase

### Fase 1: Pré-Lançamento
```
📄 guia-validacao-assistente.pdf
📄 checklist-qualidade-pre-launch.pdf
📹 video-demo-3min.mp4
📄 guia-rapido-referencia.pdf (laminar)
📄 faq-interno.pdf
📊 slide-deck-treinamento.pptx
```

### Fase 2: Lançamento
```
📧 email-anuncio-lancamento.txt
📢 mensagem-teams-pinada.txt
💬 canal-suporte-criado (#assistente-ia-suporte)
```

### Fase 3: Pós-Lançamento
```
📊 dashboard-adocao.xlsx (atualizado diariamente)
📋 log-feedback-inline.xlsx
📊 nps-semanal.csv
📄 relatorio-focus-group.pdf (D+14)
📈 relatorio-metricas-d30.pdf
```

---

## 5. Checklist de Execução do Plano

### Pré-Lançamento (D-7 a D-0)
- [ ] Materiais de treinamento aprovados pelo sponsor
- [ ] Vídeo de demo gravado e publicado
- [ ] Sessão ao vivo agendada; calendários enviados
- [ ] Guia rápido impresso (45 cópias) ou publicado digitalmente
- [ ] Canal de suporte Teams criado
- [ ] SLA de resposta definido (< 2 horas)

### Lançamento (D-0)
- [ ] E-mail de anúncio agendado
- [ ] Mensagem pinada no Teams pronta
- [ ] Assistente testado em produção (5 queries spot-check)
- [ ] Alguém de plantão no suporte durante go-live

### Pós-Lançamento (D+1 a D+30)
- [ ] Dashboard de adoção visible ao supervisor
- [ ] Pesquisa de feedback agendada (D+7, D+14, D+21)
- [ ] Focus group agendado para D+14
- [ ] Ciclo de fix-test-deploy operacional (cadência: a cada 3-5 dias)
- [ ] Comunicações de melhoria enviadas conforme mudanças (ex: "Melhoramos respostas sobre frete")

---

## 6. Outcome Esperado

Ao final deste exercício, você terá:

1. **Plano de Habilitação Completo:** Documento de 3-5 páginas detalhando todas as fases, artefatos e datas.
2. **Artefatos de Treinamento Prontos:** Vídeo (3-5 min), guia rápido (1 pág), FAQ (1 pág), slide deck (5 slides).
3. **Framework de Feedback:** Mecanismos definidos (inline, survey, focus group) e dashboard de adoção pronto.
4. **Calendário de Eventos:** Datas de treinamento, lançamento, reviews de feedback, todas com responsáveis.

**Validação:** 80%+ de atendentes completaram treinamento. Dashboard de adoção mostra crescimento dia-a-dia. Nenhum atendente reporta "não sabia como usar".

---

## 7. Exemplo: Roteiro de Um Atendente (Dia 1)

```
08:30 — Assiste vídeo de demo gravado (3 min, no próprio ritmo)
09:00 — Ler guia rápido de referência (impressão laminada na mesa)
10:00 — Sessão de treinamento ao vivo (30 min, turma)
10:35 — Experimenta 2 perguntas de teste no assistente (com Tech Lead observando ao vivo)
10:45 — Técnico valida que tudo está funcionando
11:00 — Atendente volta para fila de chamados, confiante de usar o assistente quando precisar

16:00 (mesma tarde) — Primeiro chamado onde poderia usar assistente
        Atendente: "Qual é o prazo de devolução para eletrônicos?"
        Assistente: "Conforme POL-001 seção 3.2, prazo de devolução de eletrônicos é 30 dias da compra. [Fonte: POL-001-v1 de 2026-01-15]"
        Atendente: "Valida com supervisor (apenas olha) → Confiado, repassa ao cliente"
        Atendente clica 👍 no assistente (feedback registrado)

16:05 — Feedback registrado. Produto está 1 usuário mais adotado.
```

