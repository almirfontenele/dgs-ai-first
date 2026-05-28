# ADR-001 — Regras de Negócio, Requisitos Funcionais e Não Funcionais
## Sistema de Atendimento ao Cliente — NovaTech Transportes

**Status:** Proposto  
**Data:** 2026-05-28  
**Autor:** Product Manager  
**Contexto:** Baseado na documentação operacional da NovaTech (POL-001, PROC-042, PROC-042-v2, SLA-2024, FAQ-Atendimento)

---

## 1. Contexto

A NovaTech opera um sistema de atendimento ao cliente que envolve devolução de mercadorias, cálculo de frete especial e cumprimento de SLAs por tier de cliente. A documentação atual apresenta contradições entre versões de procedimentos e gaps de cobertura. Este ADR consolida as regras vigentes e define os requisitos do sistema de atendimento.

---

## 2. Regras de Negócio

### 2.1. Devolução de Mercadorias (POL-001 v3.1)

| ID | Regra |
|----|-------|
| RN-001 | Cliente pode solicitar devolução em até **7 dias úteis** após confirmação de recebimento no sistema de tracking. Sábados, domingos e feriados nacionais não contam. |
| RN-002 | **Não são elegíveis** para devolução padrão: cargas perigosas (classes 1–6 ANTT/Resolução 5.947/2021), cargas refrigeradas com ruptura de cadeia fria (>30 min contínuos fora da faixa, conforme sensor IoT), cargas com lacre violado (salvo violação documentada no ato de entrega com assinatura do motorista e recebedor). |
| RN-003 | Casos inelegíveis devem ser encaminhados ao setor de **Gestão de Riscos** (ramal 4500) para tratamento individual. |
| RN-004 | O chamado de devolução deve conter: número do CT-e, mínimo 3 fotos (embalagem externa, etiqueta, conteúdo) e motivo da devolução. |
| RN-005 | O time de atendimento tem **4 horas úteis** para triagem do chamado após abertura. |
| RN-006 | Se aprovada, a coleta reversa é agendada em até **2 dias úteis** após aprovação. |
| RN-007 | Reembolso ou crédito é processado em até **5 dias úteis** após recebimento da mercadoria no centro de distribuição. |
| RN-008 | Devoluções parciais são permitidas por volume individual, com reembolso proporcional ao peso/valor do volume conforme CT-e. |
| RN-009 | **Custo do frete reverso:** sem custo ao cliente em caso de erro/avaria da NovaTech; por conta do cliente em caso de desistência; prazo expirado (>7 dias úteis) não é elegível — encaminhar ao Comercial. |

### 2.2. Frete Especial (PROC-042-v2, vigente a partir de 01/12/2023)

> ⚠️ **Decisão de versionamento:** A PROC-042-v2 (nov/2023) substitui a PROC-042-v1 (mar/2023) para chamados abertos a partir de 01/12/2023. Chamados abertos antes dessa data e ainda em processamento usam os multiplicadores da v1.

| ID | Regra |
|----|-------|
| RN-010 | Frete especial aplica-se a cargas com **peso acima de 500 kg**. |
| RN-011 | Fórmula: `Valor do frete = Valor base × Multiplicador regional × Fator de peso`. |
| RN-012 | **Fatores de peso (v2 vigente):** 1,0 para 500–1.000 kg; 1,15 para 1.001–3.000 kg; 1,4 para acima de 3.000 kg. |
| RN-013 | **Multiplicadores regionais (v2 vigente):** Sul 1,3 / Sudeste 1,1 / Centro-Oeste 1,4 / Nordeste 1,5 / Norte 1,8. |
| RN-014 | Prazo de entrega para frete especial = prazo padrão da rota **+ 3 dias úteis** (para manuseio e roteirização de carga pesada). |
| RN-015 | Cargas acima de **5.000 kg** requerem aprovação prévia do gerente de operações regional. |
| RN-016 | Cargas perigosas acima de 500 kg seguem PROC-043 (Frete de Cargas Perigosas). ⚠️ PROC-043 está em revisão pelo Compliance. |
| RN-017 | **Desconto por volume:** a partir de 8 fretes especiais/mês para o mesmo cliente, desconto de 5% sobre o multiplicador regional; acima de 15/mês, desconto de 10%. Descontos maiores requerem aprovação da Diretoria Comercial. |
| RN-018 | Atendente **não tem autonomia** para conceder descontos fora da tabela — encaminhar ao Comercial com justificativa. |

### 2.3. SLA por Tier de Cliente (SLA-2024.1)

#### Classificação de tiers

| Tier | Critério |
|------|----------|
| **Gold** | Contrato anual > R$ 500.000 OU > 200 operações/mês |
| **Silver** | Contrato anual R$ 100.000–500.000 OU 50–200 operações/mês |
| **Standard** | Todos os demais |

> ⚠️ Não existe tier "Platinum". Clientes que alegarem esse tier devem ser orientados e ter o contrato verificado.

#### Tabela de SLAs

| Métrica | Gold | Silver | Standard |
|---------|------|--------|----------|
| 1ª resposta — chamados gerais | 2h úteis | 4h úteis | 8h úteis |
| Resolução — chamados gerais | 24h úteis | 48h úteis | 72h úteis |
| 1ª resposta — incidentes críticos | 30 min | 1h | 2h |
| Resolução — incidentes críticos | 4h | 8h | 24h |
| Disponibilidade do portal de tracking | 99,5% | 99,0% | 98,0% |
| Gerente de conta dedicado | Sim | Não | Não |
| Relatório mensal de performance | Detalhado | Resumido | Sob demanda |

| ID | Regra |
|----|-------|
| RN-019 | Incidente é **crítico** se: carga > R$ 100.000 com status desconhecido há >6h; carga perigosa com irregularidade de documentação ou rastreamento; >5 chamados do mesmo cliente nas últimas 24h sobre o mesmo problema; risco à segurança de pessoas. |
| RN-020 | Penalidades por descumprimento de SLA: 1ª violação no mês = registro interno; 2ª = crédito de 5% sobre o frete do chamado afetado; 3ª ou mais = crédito de 10% + reunião obrigatória com gerente. |
| RN-021 | Medição de SLA começa no timestamp de abertura do chamado (Azure DevOps). |
| RN-022 | O relógio de SLA **pausa** fora do horário comercial (08h–18h, dias úteis) para chamados gerais, mas **não pausa** para incidentes críticos de clientes Gold. |

---

## 3. Requisitos Funcionais

| ID | Requisito | Origem |
|----|-----------|--------|
| RF-001 | O sistema deve permitir abertura de chamados de devolução via Portal do Cliente com campos obrigatórios: CT-e, fotos (mín. 3) e motivo. | POL-001 §3.3 |
| RF-002 | O sistema deve validar automaticamente a elegibilidade da devolução: prazo (7 dias úteis desde o recebimento confirmado no tracking), categoria de carga e integridade do lacre. | POL-001 §3.1, §3.2 |
| RF-003 | Chamados de cargas inelegíveis devem ser roteados automaticamente para a fila de Gestão de Riscos (ramal 4500). | POL-001 §3.2 |
| RF-004 | O sistema deve calcular o valor do frete especial aplicando a fórmula `Valor base × Multiplicador regional × Fator de peso`, usando os parâmetros da PROC-042-v2 para chamados a partir de 01/12/2023. | PROC-042-v2 §2 |
| RF-005 | O sistema deve identificar chamados abertos antes de 01/12/2023 ainda em processamento e aplicar os multiplicadores da PROC-042-v1. | PROC-042-v2 §5 |
| RF-006 | O sistema deve exigir aprovação do gerente de operações regional para cargas acima de 5.000 kg antes de prosseguir com o cálculo de frete. | PROC-042-v2 §4 |
| RF-007 | O sistema deve aplicar automaticamente o desconto de volume no multiplicador regional (5% a partir de 8 fretes/mês; 10% acima de 15/mês) por cliente. | PROC-042-v2 §4 |
| RF-008 | O sistema deve classificar clientes nos tiers Gold, Silver ou Standard com base em volume de operações e valor de contrato, exibindo o tier no painel do atendente. | SLA-2024 §1 |
| RF-009 | O sistema deve iniciar o contador de SLA no timestamp de abertura do chamado e alertar o atendente quando o prazo estiver próximo do vencimento (sugestão: alerta a 80% do prazo). | SLA-2024 §5 |
| RF-010 | O sistema deve pausar o relógio de SLA fora do horário comercial (08h–18h, dias úteis) para chamados gerais, exceto incidentes críticos de clientes Gold. | SLA-2024 §5 |
| RF-011 | O sistema deve detectar e classificar automaticamente incidentes críticos com base nos critérios da RN-019. | SLA-2024 §3 |
| RF-012 | O sistema deve registrar violações de SLA e calcular automaticamente créditos devidos ao cliente conforme RN-020. | SLA-2024 §4 |
| RF-013 | O sistema deve bloquear a concessão de descontos pelo atendente e redirecionar para aprovação do Comercial quando fora da tabela de volume. | FAQ Item 45 |
| RF-014 | O sistema deve disponibilizar relatório mensal de performance: detalhado para Gold, resumido para Silver, sob demanda para Standard. | SLA-2024 §2 |

---

## 4. Requisitos Não Funcionais

| ID | Requisito | Critério de Aceite |
|----|-----------|-------------------|
| RNF-001 | **Disponibilidade do portal de tracking:** 99,5% para Gold, 99,0% para Silver, 98,0% para Standard. | Medido mensalmente; downtime planejado deve ser comunicado com 48h de antecedência. |
| RNF-002 | **Desempenho:** A validação de elegibilidade de devolução deve retornar em até 3 segundos após submissão do chamado. | Teste de carga com 100 chamados simultâneos. |
| RNF-003 | **Integridade dos dados de versionamento:** O sistema deve garantir que chamados anteriores a 01/12/2023 em processamento usem os parâmetros da PROC-042-v1, sem possibilidade de edição retroativa dos multiplicadores. | Auditoria de chamados históricos. |
| RNF-004 | **Rastreabilidade:** Todas as ações sobre chamados (abertura, triagem, aprovação, roteamento, desconto) devem ser logadas com timestamp, usuário e justificativa. | Log deve ser imutável e retido por no mínimo 5 anos. |
| RNF-005 | **Segurança:** Somente usuários com perfil "Gerente de Operações Regional" podem aprovar chamados de cargas acima de 5.000 kg. | Controle de acesso baseado em papel (RBAC). |
| RNF-006 | **Conformidade regulatória:** O sistema deve validar a documentação ANTT para cargas perigosas antes de permitir processamento do chamado. | Integração com base ANTT ou checklist obrigatório validado por Compliance. |
| RNF-007 | **Auditabilidade de SLA:** O sistema deve expor relatório de SLA com granularidade de chamado individual, permitindo contestação pelo cliente. | Relatório exportável em PDF e CSV. |
| RNF-008 | **Escalabilidade:** O sistema deve suportar picos de 500 chamados simultâneos sem degradação de desempenho. | Teste de stress semestral. |
| RNF-009 | **Usabilidade:** O painel do atendente deve exibir, em tela única, o tier do cliente, o SLA vigente e o tempo restante para vencimento do chamado atual. | Validação com time de atendimento em sessão de UX. |

---

## 5. Gaps e Riscos Identificados

| ID | Tipo | Descrição | Ação Recomendada |
|----|------|-----------|-----------------|
| GAP-001 | Documentação ausente | Não existe PROC ou POL formal sobre tratamento de carga danificada em trânsito. O FAQ (Item 38) menciona e-mail `sinistros@novatech.com.br`, mas sem SLA ou processo definido. | Criar POL-002 — Tratamento de Carga Danificada em Trânsito. |
| GAP-002 | Documentação ausente | Seguro de carga mencionado no FAQ (Item 22) sem documento formal com percentuais, escopo e condições. | Criar documento formal de Apólice de Seguro de Carga. |
| GAP-003 | Documentação ausente | Não há documento cobrindo frete padrão (cargas abaixo de 500 kg). | Criar ou referenciar tabela de frete padrão. |
| GAP-004 | Documentação ausente | Processo da Gestão de Riscos para cargas perigosas devolvidas não está documentado. | Criar PROC-044 — Gestão de Riscos para Cargas Perigosas Devolvidas. |
| GAP-005 | Contradição | PROC-043 (Frete de Cargas Perigosas) está em revisão pelo Compliance. Enquanto não publicada, há risco de inconsistência. | Monitorar publicação da PROC-043 e bloquear chamados de cargas perigosas acima de 500 kg até definição. |
| GAP-006 | Contradição | PROC-042-v1 não foi arquivada. Risco de atendentes usarem tabela desatualizada. | Arquivar formalmente a PROC-042-v1 no SharePoint e adicionar banner de obsolescência. |
| GAP-007 | Processo informal | FAQ não é validado por Compliance/Operações. Item 32 (carga perigosa com frete expresso) não tem procedimento formal. | Formalizar ou invalidar itens do FAQ via processo de validação periódica. |

---

## 6. Decisão

Adotar as regras consolidadas neste ADR como fonte de verdade para o desenvolvimento e configuração do sistema de atendimento. As contradições entre PROC-042-v1 e v2 são resolvidas pela regra de data de abertura do chamado (01/12/2023). Os gaps listados devem ser tratados como backlog de documentação com prioridade alta antes do go-live do sistema.

---

## 7. Consequências

- **Positivas:** Clareza para o time de desenvolvimento, redução de erros de atendimento, base auditável para SLA e penalidades.
- **Negativas / Riscos:** Gaps de documentação (GAP-001 a GAP-007) representam risco operacional até formalização. A PROC-043 em revisão pode gerar retrabalho no módulo de cargas perigosas.
- **Revisão:** Este ADR deve ser revisado sempre que um dos documentos fonte (POL-001, PROC-042-v2, SLA-2024) for atualizado.
