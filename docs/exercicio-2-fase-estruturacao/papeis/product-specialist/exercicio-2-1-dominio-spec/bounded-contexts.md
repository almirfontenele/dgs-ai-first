# Mapa de Bounded Contexts — Assistente NovaTech

## Visão Geral

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Assistente NovaTech (Boundary)                    │
│                                                                        │
│  ┌───────────────────┐   handoff   ┌───────────────────────────────┐  │
│  │  Atendimento ao   │────────────▶│  Regras de Frete e Logística  │  │
│  │     Cliente       │◀────────────│                               │  │
│  └────────┬──────────┘             └─────────────┬─────────────────┘  │
│           │                                      │                    │
│           │ lookup SLA              referencia   │                    │
│           ▼                                      ▼                    │
│  ┌────────────────────┐            ┌─────────────────────────────┐    │
│  │  Contratos e SLA   │            │  Gestão de Documentação     │    │
│  │                    │            │  (Fonte da Verdade)         │    │
│  └────────────────────┘            └─────────────────────────────┘    │
│                                                                        │
│   FORA DO ESCOPO (sistemas externos):                                  │
│   Portal do Cliente · Gestão de Riscos · Comercial · Jurídico          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Bounded Context: Atendimento ao Cliente

**Definição:** Domínio que governa a interação entre atendentes e o assistente para resolver dúvidas operacionais de clientes da NovaTech em tempo real.

**Está dentro:**
- Responder perguntas sobre política de devolução (prazos, elegibilidade, procedimento)
- Responder perguntas sobre SLA de atendimento por tier de cliente (Gold, Silver, Standard)
- Indicar quando escalar para supervisor ou setor especializado
- Orientar sobre documentação necessária para abertura de chamado
- Responder perguntas sobre carga danificada (com ressalva de que é informação informal do FAQ)

**Está fora:**
- Processar ou abrir chamados de devolução
- Alterar dados do cliente ou do pedido
- Aplicar descontos ou negociar condições contratuais
- Decidir elegibilidade de exceções (ex: devolução de carga perigosa via Gestão de Riscos)
- Responder sobre seguro de carga sem documento formal de referência

**Relacionamento com outros contextos:**
- Recebe inputs de: Contratos e SLA (para verificar tier do cliente)
- Fornece outputs para: Atendente humano (resposta final ao cliente)
- Conflitos/handoffs: Quando a pergunta envolve carga perigosa, devolução fora de prazo ou incidente crítico → handoff para Gestão de Riscos, Comercial ou Jurídico

**Termos ubíquos preliminares:** cliente Gold/Silver/Standard, SLA de resposta, SLA de resolução, incidente crítico, escalação, chamado, CT-e

---

## Bounded Context: Regras de Frete e Logística

**Definição:** Domínio que governa as regras de precificação, prazos e restrições operacionais do transporte de mercadorias da NovaTech.

**Está dentro:**
- Calcular ou explicar frete especial (cargas acima de 500kg) com multiplicadores regionais
- Informar prazos de entrega para frete especial por região
- Explicar restrições para carga perigosa (ANTT classes 1-6)
- Informar quais categorias de carga seguem procedimentos especiais (PROC-043)
- Alertar sobre documentos contraditórios (PROC-042 v1 vs v2)

**Está fora:**
- Calcular frete padrão (abaixo de 500kg — sem documento formal disponível)
- Negociar descontos de volume (responsabilidade do Comercial)
- Autorizar aprovação de cargas acima de 5.000kg (responsabilidade do gerente regional)
- Processar ou rastrear entregas em andamento

**Relacionamento com outros contextos:**
- Recebe inputs de: Gestão de Documentação (versões dos documentos PROC-042)
- Fornece outputs para: Atendimento ao Cliente (informações de frete para responder ao cliente)
- Conflitos/handoffs: Ao identificar documentos contraditórios → apresentar ambas as versões + indicar que cliente deve confirmar com Comercial

**Termos ubíquos preliminares:** frete especial, multiplicador regional, fator de peso, carga perigosa, frete reverso, rota, CT-e, ANTT

---

## Bounded Context: Contratos e SLA

**Definição:** Domínio que governa as obrigações contratuais da NovaTech com seus clientes, incluindo níveis de serviço, penalidades e classificação de clientes.

**Está dentro:**
- Informar SLAs por tier (Gold, Silver, Standard) para chamados gerais e incidentes críticos
- Explicar critérios de elegibilidade de cada tier
- Descrever o que constitui um incidente crítico
- Informar penalidades por descumprimento de SLA
- Esclarecer que não existe tier Platinum ou outros além dos três oficiais

**Está fora:**
- Verificar em qual tier um cliente específico se enquadra (requer acesso ao sistema de contratos)
- Aplicar créditos por violação de SLA
- Negociar SLAs diferenciados (responsabilidade do Comercial)
- Confirmar valores de contrato de clientes individuais

**Relacionamento com outros contextos:**
- Recebe inputs de: Gestão de Documentação (SLA-2024)
- Fornece outputs para: Atendimento ao Cliente (contexto do nível de serviço do cliente)
- Conflitos/handoffs: Quando cliente alega tier não confirmado → handoff para atendente verificar no sistema de contratos

**Termos ubíquos preliminares:** tier Gold/Silver/Standard, SLA de resposta, SLA de resolução, incidente crítico, penalidade contratual, gerente de conta

---

## Bounded Context: Gestão de Documentação (Fonte da Verdade)

**Definição:** Domínio que governa quais documentos são autoritativos, suas versões e o tratamento de contradições entre fontes.

**Está dentro:**
- Identificar o documento autoritativo para cada tipo de informação
- Sinalizar quando duas versões de um documento coexistem sem hierarquia clara
- Indicar data de vigência e responsável de cada documento
- Distinguir documentos normativos (POL, PROC, SLA) de informais (FAQ)

**Está fora:**
- Atualizar ou arquivar documentos (responsabilidade das Diretorias)
- Resolver contradições entre documentos (requer decisão humana)
- Criar novos documentos de política

**Relacionamento com outros contextos:**
- Recebe inputs de: Bases documentais da NovaTech (SharePoint, portal interno)
- Fornece outputs para: Todos os outros bounded contexts (como fonte de verdade)
- Conflitos/handoffs: Contradição detectada → assistente apresenta ambas as versões + alerta o atendente

**Termos ubíquos preliminares:** documento normativo, versão vigente, source_document, coexistência de versões, PROC-042 v1, PROC-042 v2, POL-001, SLA-2024, FAQ-Atendimento

---

## Checklist de Validação

- [x] Nenhum contexto é divisão técnica (Frontend/Backend, Banco de Dados)
- [x] Todos são coerentes com o domínio de logística
- [x] Responsabilidades estão definidas em "está dentro" / "está fora"
- [x] Relacionamentos e handoffs estão documentados
