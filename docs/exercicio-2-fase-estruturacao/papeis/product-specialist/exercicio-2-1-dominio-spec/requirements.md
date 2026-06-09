# Requirements — Assistente NovaTech (Query Endpoint)

**Versão:** 1.1  
**Data:** 2026-06-09  
**Responsável:** Product Specialist  
**Status:** Revisado pelo Tech Lead — Pronto para desenvolvedor

---

## 1. Outcomes

### Outcome Primário

> Um atendente da NovaTech consegue responder a uma pergunta operacional de cliente sobre SLAs, prazos de frete, regras de devolução ou frete especial **em menos de 30 segundos**, com confiança suficiente para não precisar buscar o documento original, sabendo exatamente de qual fonte a informação veio.

### Outcomes Secundários

- **Redução de escalação desnecessária:** atendente sabe quando pode responder diretamente vs. quando deve escalar, sem precisar de supervisão.
- **Consistência de resposta:** todos os atendentes dão a mesma resposta para a mesma pergunta, eliminando variações baseadas em memória individual.
- **Transparência sobre incerteza:** quando a informação é contraditória ou indisponível, o atendente é alertado antes de repassar ao cliente, evitando informações erradas.
- **Conformidade documental:** respostas sempre referenciiam o documento autoritativo, facilitando auditoria e treinamento.

---

## 2. Scope Boundaries

### Está dentro do escopo

- Responder perguntas sobre:
  - Política de devolução de mercadorias (prazos, elegibilidade, procedimento, custos)
  - Cálculo de frete especial (fórmula, multiplicadores regionais, fatores de peso)
  - Prazos de entrega para frete especial por região
  - SLAs de atendimento por tier (Gold, Silver, Standard) — resposta e resolução
  - Critérios de incidente crítico e penalidades por descumprimento de SLA
  - Restrições para categorias especiais de carga (perigosa, refrigerada, lacre violado)
- Cruzar informações entre dois bounded contexts (ex: devolução + frete reverso + SLA)
- Apresentar ambas as versões de documentos contraditórios (PROC-042 v1 vs v2)
- Indicar quando o atendente deve escalar para setor especializado
- Citar source_document em toda resposta

### Está fora do escopo

- Processar devoluções, abrir chamados ou alterar dados em qualquer sistema
- Verificar o tier contratual de um cliente específico (requer acesso ao sistema de contratos)
- Negociar descontos ou condições contratuais
- Responder sobre frete padrão (abaixo de 500kg — sem documento formal na base)
- Responder sobre seguro de carga (sem documento formal na base)
- Resolver contradições entre documentos (requer decisão humana)
- Rastrear ou localizar cargas em tempo real
- Autorizar exceções (ex: devolução de carga perigosa)

---

## 3. Constraints

| # | Constraint | Valor / Regra |
|---|-----------|--------------|
| C1 | Tempo de resposta | < 30 segundos do recebimento da pergunta até resposta completa exibida |
| C2 | Idioma | Português formal — sem gírias, siglas não definidas ou anglicismos desnecessários |
| C3 | Invenção de dados numéricos | Proibido — assistente nunca inventa prazos, multiplicadores, percentuais ou valores |
| C4 | Fontes contraditórias | Sempre apresentar ambas as versões com identificação explícita (PROC-042 v1 / v2) |
| C5 | Citação de fonte | Toda resposta deve incluir `source_document` com código do documento, seção e data de última atualização |
| C6 | Confiança < threshold | Quando confiança da recuperação RAG estiver abaixo do threshold configurado, sugerir escalação em vez de especular |
| C7 | Documentos informais | FAQ-Atendimento só pode ser citado com aviso explícito de que é documento informal não validado |
| C8 | Atualização da base | Base documental deve refletir novos documentos em até 24 horas após publicação. Responsabilidade de Tech Lead/DevOps via reprocessamento do pipeline RAG — não automático sem aprovação. |
| C9 | Uso do FAQ-Atendimento | Pode ser citado apenas quando: (a) não há documento normativo sobre o assunto, (b) a resposta inclui aviso "documento informal não validado", e (c) escalação é recomendada na mesma resposta |

---

## 4. Prior Decisions

| ADR | Decisão | Impacto neste spec |
|-----|---------|-------------------|
| ADR-0001 | Azure OpenAI GPT-4o selecionado como LLM | Limites de contexto e latência da Azure OpenAI se aplicam ao C1 |
| ADR-0002 | Embeddings via Azure OpenAI text-embedding-ada-002 | Qualidade da recuperação RAG afeta C3 e C6 |
| ADR-0003 | Documentos contraditórios exibem ambas as versões com aviso de conflito | Define comportamento obrigatório descrito em C4 |
| ADR-0004 | RAG pipeline (não custom search) | Assistente opera sobre chunks de documentos, não sobre banco de dados estruturado |
| ADR-0005 | Histórico de conversa limitado a 1 turno | Perguntas de follow-up sem contexto anterior devem ser tratadas como perguntas independentes |
| ADR-0006 | Threshold de confiança RAG = 0.75 | Score de similaridade coseno abaixo de 0.75 ativa modo de baixa confiança (C6, VC-R04) |

---

## 5. Verification Criteria

### 5.1 Funcionalidade

- [ ] **VC-F01:** Dado "Qual é o SLA de resolução para cliente Gold?", a resposta inclui "24 horas úteis" e cita `SLA-2024, seção 2` em menos de 30s
- [ ] **VC-F02:** Dado "Como calcular frete especial para carga de 2.000kg para o Nordeste?", a resposta apresenta os multiplicadores de AMBAS as versões da PROC-042 com aviso de conflito
- [ ] **VC-F03:** Dado "Posso devolver uma carga perigosa?", a resposta informa que não é elegível pelo processo padrão, cita `POL-001, seção 3.2` e indica escalação para Gestão de Riscos (ramal 4500)
- [ ] **VC-F04:** Dado "Qual é o prazo para solicitar devolução?", a resposta informa "7 dias úteis após confirmação de recebimento" e cita `POL-001, seção 3.1`
- [ ] **VC-F05:** Dado uma pergunta sobre frete padrão (carga abaixo de 500kg), a resposta informa que não há documento formal disponível e sugere contato com o Comercial
- [ ] **VC-F06:** Dado "O cliente é Platinum. Qual o SLA?", a resposta informa que tier Platinum não existe na NovaTech e lista os tiers válidos (Gold, Silver, Standard)

### 5.2 Confiabilidade

- [ ] **VC-R01:** Em 20 perguntas aleatórias sobre multiplicadores de frete, o assistente nunca inventa um valor — ou cita documento ou apresenta ambas as versões
- [ ] **VC-R02:** O assistente nunca afirma categoricamente que carga perigosa pode ser devolvida pelo processo padrão
- [ ] **VC-R03:** Quando a pergunta está completamente fora do escopo (ex: "Qual é a taxa de câmbio hoje?"), a resposta informa que está fora do escopo e sugere escalação
- [ ] **VC-R04:** Quando score RAG < 0.75 (ADR-0006), a resposta inclui aviso explícito de baixa confiança e sugere confirmação com documentação original
- [ ] **VC-F07:** Dado pergunta sobre frete de carga perigosa acima de 500kg, a resposta informa que PROC-043 não está disponível na base e sugere contato com Gestão de Riscos (ramal 4500)

### 5.3 Conformidade

- [ ] **VC-C01:** 100% das respostas contêm campo `source_document` com código e seção do documento
- [ ] **VC-C02:** 100% das respostas estão em português formal (auditável por amostragem)
- [ ] **VC-C03:** Toda resposta baseada no FAQ-Atendimento inclui aviso: "Informação do FAQ informal — confirme com documentação oficial"
- [ ] **VC-C04:** Respostas sobre documentos com coexistência de versões incluem aviso explícito de conflito em 100% dos casos

### 5.4 Performance

- [ ] **VC-P01:** p95 de latência fim-a-fim (pergunta → resposta exibida) < 30 segundos em condições normais de carga
- [ ] **VC-P02:** Disponibilidade do endpoint de query ≥ 99% durante horário comercial (08h–18h, dias úteis)
