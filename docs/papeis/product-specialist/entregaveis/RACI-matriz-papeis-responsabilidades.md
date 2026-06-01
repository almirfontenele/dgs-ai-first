# Matriz RACI — Papéis e Responsabilidades
**Projeto:** Assistente de IA para Atendimento — NovaTech  
**Versão:** 1.0  
**Data:** 2026-05-29

---

## Legenda
- **R (Responsible):** Executa o trabalho
- **A (Accountable):** Toma a decisão final; responde pelo resultado
- **C (Consulted):** Fornece input/expertise antes da decisão
- **I (Informed):** Recebe notificação após a decisão

---

## Matriz RACI por Fase

### Fase 1: Pré-Kickoff (D-21 a D-0)

| Atividade | Sponsor (NovaTech) | Product Specialist (DB1) | Tech Lead (DB1) | Curador Designado (NovaTech) |
|-----------|-------------------|--------------------------|-----------------|------------------------------|
| **Mapear expectativas vs. realidade** | C | R/A | C | — |
| **Resolver contradições documentais** | A | C | I | R |
| **Nomear curador de documentação** | A | R | I | — |
| **Sessão de alinhamento com diretoria** | A | R | C | — |
| **Aprovar acordo formal** | A | C | I | I |
| **Preparar materiais de treinamento** | C | R/A | C | — |

### Fase 2: Lançamento (D-7 a D+1)

| Atividade | Sponsor | Product Specialist | Tech Lead | Supervisor Atendimento | Curador |
|-----------|---------|-------------------|-----------|------------------------|---------|
| **Validação pré-launch (50 queries)** | I | C | R/A | — | C |
| **Sessão de treinamento ao vivo (D-2)** | I | R/A | R | I | — |
| **Comunicação de lançamento** | C | R | I | I | I |
| **Go-live** | A | I | R/A | I | I |
| **Suporte reativo (primeira semana)** | I | R/A | R | C | C |
| **Monitoramento de adoção (D+1 a D+7)** | C | R/A | C | R | I |

### Fase 3: Pós-Lançamento (D+7 a D+30)

| Atividade | Sponsor | Product Specialist | Tech Lead | Supervisor | Curador |
|-----------|---------|-------------------|-----------|------------|---------|
| **Coleta de feedback (thumbs, survey)** | I | C | I | R | I |
| **Análise de dashboard de adoção (diário)** | C | R/A | C | R | I |
| **Investigação de erros agudos (>10% taxa)** | I | R | R | C | C |
| **Prototipagem e teste de fixes** | I | C | R/A | C | C |
| **Deploy de melhorias** | A | C | R | I | C |
| **Smoke test com Golden Dataset (pré-deploy)** | I | I | R/A | I | I |
| **Focus group semanal (feedback qualitativo)** | I | R/A | I | C | I |
| **Revisão mensal com sponsor** | A | R | R | C | I |
| **Comunicação de melhorias aos atendentes** | C | R | I | R | I |

### Contingência: Se NovaTech Não Nomear Curador (Opção A)

| Atividade | Sponsor | DB1 Product Specialist | DB1 Tech Specialist | NovaTech (novo curador em paralelo) |
|-----------|---------|------------------------|---------------------|--------------------------------------|
| **Asumir curadoria temporária (D+0 a D+15)** | A | R | C | C |
| **Re-indexar documentos com versioning** | I | R | R | C |
| **Documentar playbook de curadoria** | C | R | C | R |
| **Treinar novo curador (D+15)** | I | R | I | R |
| **Transferência de propriedade** | A | C | I | R |

---

## Responsabilidades Detalhadas por Papel

### Sponsor (NovaTech)
- ✅ Tomar decisões finais sobre escopo, prazos, conflitos
- ✅ Nomear curador de documentação antes de D-5
- ✅ Participar de review mensal de saúde do produto
- ✅ Aprovar mudanças maiores (V1 → V1.1)
- ❌ Executar trabalho técnico ou de treinamento (delegue para especialistas)

### Product Specialist (DB1)
- ✅ Facilitar alinhamento de expectativas (D-21 a D-0)
- ✅ Desenhar plano de habilitação e feedback loops
- ✅ Ler feedback estruturado e identificar padrões
- ✅ Orquestrar comunicação com stakeholders
- ✅ Tomar decisões tácticas sobre "fix agora vs. V1.1"
- ❌ Executar code ou arquitetura técnica (delegue ao Tech Lead)

### Tech Lead (DB1)
- ✅ Executar testes pré-launch e validação de qualidade
- ✅ Implementar prompts refinements e ajustes de RAG
- ✅ Rodar smoke test com Golden Dataset antes de cada deploy
- ✅ Diagnosticar falhas técnicas (retrieval, indexação, latência)
- ✅ Documentar pipeline e procedimentos
- ❌ Tomar decisões de produto (escopo, métricas, mensagens)

### Supervisor de Atendimento (NovaTech)
- ✅ Monitorar qualidade de respostas do assistente
- ✅ Validar feedback dos atendentes (escaladas por erro)
- ✅ Participar de focus group
- ✅ Comunicar barreiras de adoção ao Product Specialist
- ❌ Fazer suporte técnico em profundidade (escalade para DB1)

### Curador de Documentação (NovaTech)
- ✅ Manter base documental atualizada (versioning, obsolescência)
- ✅ Submeter novos documentos com metadata de vigência
- ✅ Resolver contradições documentais com stakeholders
- ✅ Participar de refinements de retrieval (quais docs precisam re-indexar?)
- ❌ Editar prompts ou ajustar comportamento do LLM (escalade ao Tech Lead)

---

## SLAs por Função

| Responsabilidade | SLA | Proprietário |
|-----------------|-----|--------------|
| **Ticket de suporte** | < 2h resposta (comercial) | Product Specialist + Tech Lead |
| **Feedback operacional (thumbs down)** | < 48h investigação + ação | Product Specialist |
| **Smoke test antes de deploy** | 100% antes de qualquer release | Tech Lead |
| **Relatório semanal de feedback** | Segunda-feira 10:00 | Product Specialist |
| **Escalada por erro > 15%** | < 2h notificação ao sponsor | Product Specialist |
| **Entrevista de follow-up (D+14 focus group)** | Agendar em D+7 | Product Specialist |
| **Comunicação de melhoria ao time** | < 24h após deploy | Product Specialist |

---

## Checklist de Clareza de Papéis

Antes de go-live, valide que **cada pessoa entende seu papel**:

- [ ] **Sponsor:** Sabe que será chamado para decisões, review mensal, aprovação de Opção A se curador não for nomeado
- [ ] **Product Specialist:** Entende que é o "dono de feedback loop" — se não coleta/analisa/age, ninguém faz
- [ ] **Tech Lead:** Sabe que é "dono de qualidade técnica" — smoke test, golden dataset, deploy gates
- [ ] **Supervisor:** Entende que é o "olho no produto" — feedback real dos atendentes
- [ ] **Curador:** Sabe que **a qualidade do assistente depende de 50% documentação** — responsabilidade dele é crítica

---

## Escalação de Conflitos

| Conflito | Decisor | Processo |
|----------|---------|----------|
| "Precisamos de recurso extra (Opção A)" | Sponsor | Product Specialist escala em 24h; Sponsor decide em 48h |
| "Error rate não cai com o fix" | Tech Lead + Product Specialist | Reverter deploy; prototipagem nova; retest |
| "Atendentes não estão adotando" | Product Specialist | Root-cause (confiança? Usabilidade?); ação táctica em 48h |
| "Base documentada tem contradições" | Sponsor + Curador | Mapeado em D-10; resolvido antes de go-live ou documentado como risco |
| "Mudança escopo (V1.1 request)" | Sponsor + Product Specialist | Documentar como V1.1 opportunity; NOT go-live blocker |

