# Exercício 1.3 — Planejamento de Discovery com IA

**Projeto:** Assistente de IA para Atendimento — NovaTech  
**Elaborado por:** Delivery Manager (DB1)  
**Data:** 2026-05-29  
**Versão:** 1.0

---

## Parte A — Plano Textual de Discovery

### Premissa: Intent Antecede o Discovery Humano

No modelo AI First da DB1, a fase de Intent ocorre **antes** das entrevistas com stakeholders. Agentes especializados analisam toda a documentação disponível e geram um mapa priorizado de fontes, contradições e gaps. Esse mapa é o que alimenta o discovery humano — as entrevistas se tornam conversas cirúrgicas para validar e priorizar hipóteses, não sessões exploratórias partindo do zero.

Isso significa que os humanos chegam às entrevistas **sabendo o que existe**, o que está inconsistente, e o que provavelmente falta — e precisam apenas confirmar, corrigir e priorizar.

---

### Fase 1 — Intent (Semana 1, Dias 1–5): Análise Automática por Agentes de IA

**O que os agentes de IA fazem nesta fase:**

| Atividade | Agente | Input | Output |
|-----------|--------|-------|--------|
| Catalogação completa | Agente Catalogador | ~1.250 documentos das 3 fontes | Índice estruturado: ID, título, fonte, formato, data de última atualização, responsável, temas cobertos |
| Detecção de duplicatas e versões conflitantes | Agente de Inconsistências | Índice + conteúdo dos documentos | Lista de pares conflitantes com excerto comparativo (ex: PROC-042 vs PROC-042-v2: multiplicadores divergentes) |
| Mapeamento temático | Agente de Temas | Conteúdo indexado | Mapa de temas: frequência por assunto (frete, SLA, devolução, segurança), identificação de temas sem cobertura documental |
| Avaliação de qualidade de extração | Agente de Qualidade | Documentos por formato | Lista de documentos com baixa qualidade de extração (PDFs escaneados, tabelas como imagem, macros Confluence) — candidatos a tratamento especial |
| Geração de hipóteses de gaps | Agente Sintetizador | Outputs dos agentes anteriores | Relatório de hipóteses: "O tema X aparece em 35% das perguntas do FAQ-Atendimento mas tem cobertura documental de apenas 10%" |

**Pré-requisitos que a NovaTech precisa fornecer até o Dia 0:**
- Acesso de leitura ao SharePoint corporativo (credenciais de serviço)
- Acesso de leitura ao Confluence (token de API)
- Acesso à pasta de rede com as planilhas (compartilhamento ou exportação)
- Indicação de 1 pessoa de referência em cada área (Operações, Compliance, Comercial) para contato durante o discovery

---

### Fase 2 — Discovery Humano (Semana 1, Dias 4–5 + Semana 2): Validação e Priorização

**O que os humanos fazem nesta fase (e por que só humanos):**

| Atividade | Responsável | Por que é humano |
|-----------|-------------|-----------------|
| Entrevista com atendentes (amostra de 6–8 pessoas) | Product Specialist + DM | IA não captura contexto implícito, frustrações, e workarounds informais que não estão documentados em lugar algum |
| Validação do mapa de temas com supervisores | Product Specialist | Priorização é uma decisão de negócio, não de análise de frequência — "o que é mais urgente" não é o mesmo que "o que aparece mais nos documentos" |
| Resolução de contradições documentais | DM + Compliance NovaTech | Definir qual versão de um documento é a vigente é uma decisão legal/operacional que não pode ser delegada a um agente |
| Validação do índice gerado pelos agentes | Tech Lead + Responsável TI NovaTech | Confirmar que o catálogo está correto e que os metadados de vigência foram capturados |
| Priorização da base para ingestão | DM + Product Specialist | Decidir quais documentos entram na v1 (escopo do MVP) e quais ficam para versões futuras |
| Definição dos critérios de sucesso | DM + Diretor NovaTech | Acordo formal sobre métricas de aceitação — não pode ser derivado automaticamente da documentação |

---

### Sequência: O Que Precisa Acontecer Antes do Quê

```
DIA 0 (pré-discovery)
└── NovaTech fornece acessos às 3 fontes documentais
└── NovaTech indica responsáveis por área (Operações, Compliance, Comercial)

SEMANA 1 — INTENT (Agentes de IA rodando em paralelo)
├── Dias 1–2: Agentes catalogam e indexam toda a base
├── Dias 2–3: Agente de inconsistências processa o catálogo gerado
├── Dias 3–4: Agente de temas e agente de qualidade processam em paralelo
└── Dia 5: Agente sintetizador gera relatório de hipóteses consolidado
        │
        ▼ [Relatório de hipóteses é entregue ao time humano]

SEMANA 1, DIAS 4–5 — Início do Discovery Humano (em paralelo com fim do Intent)
└── Product Specialist analisa o relatório de hipóteses e prepara roteiros de entrevista
    (as entrevistas são desenhadas para validar as hipóteses dos agentes, não partir do zero)

SEMANA 2 — DISCOVERY HUMANO
├── Dias 1–2: Entrevistas com atendentes (6–8 pessoas, 45 min cada)
├── Dias 2–3: Entrevistas com supervisores para validação de prioridades
├── Dias 3–4: Workshop de resolução de contradições documentais com Compliance
├── Dia 4: Validação do índice com TI NovaTech
└── Dia 5: Sessão de priorização e definição de critérios de sucesso com diretoria
            │
            ▼ [Entregável: Discovery Report com escopo priorizado para MVP]
```

---

### O Que a NovaTech Precisa Fornecer e Quando

| Item | Responsável NovaTech | Prazo | Impacto se Atrasado |
|------|---------------------|-------|---------------------|
| Credenciais de acesso ao SharePoint (conta de serviço) | TI | Dia 0 (antes do início) | Bloqueia toda a fase de Intent |
| Token de API do Confluence | TI | Dia 0 | Bloqueia indexação do Confluence |
| Acesso à pasta de rede (exportação ou compartilhamento) | Comercial | Dia 0 | Bloqueia indexação das planilhas |
| Indicação de responsável Operações | Operações | Dia 0 | Bloqueia agendamento de entrevistas |
| Indicação de responsável Compliance | Compliance | Dia 0 | Bloqueia resolução de contradições |
| Indicação de responsável Comercial | Comercial | Dia 0 | Bloqueia validação de planilhas |
| Disponibilidade de 6–8 atendentes para entrevista (45 min) | RH / Operações | Semana 2, Dias 1–2 | Bloqueia entrevistas de usuário |
| Disponibilidade de 2 supervisores para entrevista | Operações | Semana 2, Dias 2–3 | Bloqueia validação de prioridades |
| Disponibilidade do time de Compliance para workshop | Compliance | Semana 2, Dias 3–4 | Bloqueia resolução formal de contradições |
| Disponibilidade de diretoria para sessão de priorização | Diretoria | Semana 2, Dia 5 | Bloqueia definição de critérios de sucesso |

---

## Parte B — Cronograma Visual de 2 Semanas de Discovery

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CRONOGRAMA DE DISCOVERY — PROJETO ASSISTENTE IA NOVATECH (2 SEMANAS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                    SEG      TER      QUA      QUI      SEX
                   ─────    ─────    ─────    ─────    ─────
SEMANA 1

🤖 FASE INTENT
   Catalogação     [████████████]
   (Agente IA)      D1        D2

   Inconsistências           [████████]
   (Agente IA)                D2      D3

   Temas + Qual.                      [████████]
   (Agente IA)                         D3      D4

   Relatório                                   [████]
   Hipóteses                                    D4   D5
   (Agente Sintet.)
   ────────────────────────────────────────────────────────
👤 DISCOVERY HUMANO (início)
   Análise do                                   [████]
   Relatório                                    D4   D5
   (Product Spec.)

   Prep. Roteiros                                    [████]
   de Entrevista                                      D5
   (Product Spec.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEMANA 2

👤 DISCOVERY HUMANO (continuação)
   Entrevistas       [████████]
   Atendentes         D1      D2
   (PS + DM)          ← depende: roteiros prontos (D5 S1)
                      ← depende: atendentes disponíveis (NovaTech)

   Entrevistas                [████████]
   Supervisores                D2      D3
   (Product Spec.)             ← depende: entrevistas atendentes iniciadas

   Workshop                            [████████]
   Contradições                         D3      D4
   (DM + Compliance)                   ← depende: catálogo validado (D2 S2)

   Validação                                   [████]
   Índice (TL + TI)                             D4
                                               ← depende: catálogo completo (S1)

   Sessão                                           [████]
   Priorização                                       D5
   (DM + Diretoria)                                ← depende: todos os anteriores

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENTREGÁVEL FINAL: Discovery Report + Escopo MVP Priorizado (Sexta S2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEGENDA:
  🤖 = Atividade executada por agentes de IA (automática)
  👤 = Atividade executada por humanos
  [████] = Duração da atividade
  ← depende: = dependência que precisa estar concluída antes

RESPONSÁVEIS:
  DM = Delivery Manager (DB1)
  PS = Product Specialist (DB1)
  TL = Tech Lead (DB1)
  TI = Time de TI NovaTech
  Comp. = Time de Compliance NovaTech
  Dir. = Diretoria NovaTech
```

---

## Parte C — Síntese das Dependências Críticas

**Bloqueador 1 — Acessos no Dia 0:**  
Sem as credenciais das 3 fontes documentais antes do início da Semana 1, a fase de Intent não começa. Isso comprime todo o cronograma. Formalizar como pré-requisito no contrato.

**Bloqueador 2 — Resolução de Contradições:**  
O workshop de contradições na Semana 2 só pode acontecer depois que o agente de inconsistências mapeou os pares conflitantes (Semana 1). O time de Compliance da NovaTech precisa ter autoridade para definir qual versão é vigente — não pode ser uma decisão delegada ao assistente.

**Bloqueador 3 — Disponibilidade de Atendentes:**  
Entrevistar 6–8 atendentes requer liberação de agenda com antecedência. Como o volume é de 320 chamados/dia, a operação não pode parar. Planejar entrevistas em blocos de 45 minutos distribuídos ao longo dos dois dias, com substituição de cobertura.

---

## Notas sobre o Processo de Elaboração

**Como o plano foi elaborado com o Claude:**

**Prompt inicial:**
> "Preciso planejar uma fase de discovery de 2 semanas para um projeto de assistente de IA com RAG. A base documental tem ~1.250 documentos em 3 fontes. No modelo AI First, agentes de IA analisam a documentação antes das entrevistas humanas (fase de Intent). Quais atividades devem ser feitas por agentes, quais por humanos, e em que sequência?"

*Problema com o output inicial:* O Claude misturou atividades humanas e de IA sem deixar clara a dependência sequencial — o plano parecia sugerir que entrevistas e análise de IA poderiam ser feitas em paralelo desde o início, ignorando que o output dos agentes alimenta os roteiros das entrevistas.

**Refinamento:**
> "O plano não está deixando claro que o Intent precisa anteceder o discovery humano. O Product Specialist não pode preparar roteiros de entrevista sem antes ter o relatório de hipóteses dos agentes. Reorganize mostrando a sequência com dependências explícitas."

*Melhoria:* O Claude reorganizou o plano com a estrutura de dependências sequenciais, tornando visível que os roteiros de entrevista são derivados do relatório de hipóteses — não preparados de forma independente.

**Refinamento 2:**
> "As atividades atribuídas a humanos precisam ser justificadas — por que um humano precisa fazer isso e não um agente? Adicione uma coluna 'por que é humano' para cada atividade de discovery."

*Melhoria:* A justificativa de "por que é humano" foi adicionada, tornando explícito que validação, priorização e decisões de vigência exigem julgamento contextual e autoridade organizacional que agentes não possuem.

**Sobre o Cronograma Visual:**  
O cronograma foi estruturado em formato de texto para representar o que seria gerado no Claude Cowork, com indicação visual de paralelismo (Intent rodando em paralelo enquanto humanos começam preparação), dependências marcadas, e papéis definidos por atividade.
