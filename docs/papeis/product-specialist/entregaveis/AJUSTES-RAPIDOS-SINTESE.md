# Ajustes Rápidos — Síntese das Melhorias
**Data:** 2026-06-01  
**Versão:** 1.1 (após feedback de Product Specialist)

---

## Resumo dos Três Ajustes

### 1️⃣ Exercício 1.3 — Smoke Test com Golden Dataset (LLM-as-a-Judge)

**Problema Identificado:**  
Testes manuais de "5 perguntas de frete" não são confiáveis em LLMs/RAG porque:
- Comportamento é não-determinístico
- Um fix em "frete" pode quebrar "devolução" sem ser óbvio
- Não há forma automatizada de validar antes de deploy

**Solução Implementada:**  
Adicionado à seção **5.4 do Exercício 1.3** um framework completo para:

1. **Golden Dataset** (criado em D-5):
   - Conjunto fixo de **15-20 perguntas críticas** (gabaritadas)
   - Distribuído por categoria (frete, devolução, SLA, geral)
   - Cada pergunta tem **resposta esperada** com citação de fonte

2. **Script de Avaliação Automatizado:**
   - Tech Lead roda antes de cada deploy (2-3 min)
   - Usa **LLM-as-a-Judge** (outro modelo ou Claude) para avaliar cada resposta
   - Compara contra resposta gabaritada nos critérios: acurácia, citação, clareza
   - Threshold: 95%+ pass rate; < 95% = BLOQUEIA deploy

3. **Exemplo Prático:**
   - Mostra como um fix em "devolução" pode falhar (87.5% pass rate, abaixo do 95%)
   - Como revert e retest acontecem

**Responsável:** Tech Lead  
**Timing:** Roda a cada deploy  
**Artefato:** Script reutilizável + Golden Dataset versionado em git

**Benefício:** Reduz risco de regressão silenciosa; dá confiança de que mudanças não quebram outras categorias.

---

### 2️⃣ Exercício 1.1 — Fallback Refinado para Curadoria Temporária

**Problema Identificado:**  
Opção A ("DB1 assume curadoria") era vaga e trazia risco de escopo aberto:
- Quando termina?
- O que está incluído / excluído?
- Qual é a tarifa?

**Solução Implementada:**  
Adicionado à seção **2.4 do Exercício 1.1** um **Plano de Contingência detalhado** com:

1. **Tabela de 4 Cenários:**
   - Cenário OK: Cliente nomeia curador no prazo
   - Cenário Opção A: DB1 assume **temporariamente** (15 dias máx)
   - Cenário Opção B: Atrasar go-live 2 semanas
   - Cenário Opção C: Não recomendado (qualidade degrada)

2. **Opção A Escopo Detalhado:**
   - **Objetivo claro:** Manutenção (não curadoria ativa), destravar go-live + primeiras 2 semanas
   - **Incluso (15 dias):**
     - Revisar contradições residuais
     - Re-indexar quando cliente submete nova versão
     - Monitorar qualidade; alertar se error rate > 10%
     - Documentar playbook para transferência
   - **Excluído (responsabilidade de NovaTech):**
     - Rewriting/reformatting de documentos
     - Decisões de policy
     - Suporte reativo contínuo (SLA apenas 15 dias)

3. **Transferência (D+15):**
   - NovaTech assume com novo curador
   - DB1 faz 2 horas de treinamento
   - Zero perda de qualidade esperada

**Responsável:** Sponsor (decisão) + Product Specialist (acionamento)  
**Timing:** Acionado se cliente não nomear curador antes de D-5  
**Custo:** +15 dias Product Specialist / Tech Specialist (tarifa de consultoria)

**Benefício:** Desrisca go-live; protege escopo de DB1; clareza para cliente sobre custo real.

---

### 3️⃣ Novo Artefato — Matriz RACI de Papéis e Responsabilidades

**Problema Identificado:**  
Três exercícios deixam papéis implícitos. Principal gap: quem **realmente é dono** do feedback loop?

**Solução Implementada:**  
Criado novo documento: **RACI-matriz-papeis-responsabilidades.md** com:

1. **Matriz RACI por Fase:**
   - Pré-Kickoff (D-21 a D-0)
   - Lançamento (D-7 a D+1)
   - Pós-Lançamento (D+7 a D+30)
   - Contingência (se Opção A acionada)
   - Mostra quem é R/A/C/I em cada atividade

2. **Responsabilidades Detalhadas por Papel:**
   - **Sponsor:** Decisões finais, nomear curador, review mensal
   - **Product Specialist:** Dono de feedback loop; análise semanal; comunicação
   - **Tech Lead:** Dono de qualidade técnica; smoke test; deploys
   - **Supervisor:** Olho no produto; feedback dos atendentes
   - **Curador:** 50% da qualidade do produto = criticidade alta

3. **SLAs por Função:**
   - Ticket de suporte: < 2h
   - Feedback operacional: < 48h investigação
   - Smoke test: 100% antes de qualquer deploy
   - Relatório semanal: Segunda 10:00

4. **Escalação de Conflitos:**
   - Clareza sobre quem decide em 9 cenários comuns
   - Timing esperado para cada decisão

5. **Checklist de Clareza:**
   - Antes de go-live, cada pessoa testa se entende seu papel
   - Evita surpresas: "Quem era responsável disso?"

**Responsável:** Product Specialist (orquestra); todos (validam antes de D-0)  
**Timing:** Apresentar em reunião de kickoff  
**Artefato:** Documento único de referência rápida

**Benefício:** Elimina ambiguidade; previne "ninguém sabia que era responsável"; facilita escalação.

---

## Como Usar Esses Ajustes

### Para Product Specialist (você mesmo)
```
1. Leia os 3 exercícios originais (1.1, 1.2, 1.3)
2. Veja onde foram inseridas as melhorias:
   - Ex 1.3, seção 5.4: Golden Dataset + script
   - Ex 1.1, seção 2.4: Plano de Contingência
   - Novo: RACI-matriz-papeis-responsabilidades.md
3. Na próxima apresentação ao cliente:
   - Fale sobre smoke test com confiança (há processo)
   - Ofereça Opção A com escopo claro (não é vago)
   - Distribua RACI na reunião de kickoff (deixa claro quem faz o quê)
```

### Para Tech Lead
```
1. Veja seção 5.4 do Ex 1.3
2. Identifique: você precisa criar Golden Dataset em D-5
3. Identifique: você roda smoke test antes de cada deploy (2-3 min)
4. Valide na RACI: você é "R" (executante) para qualidade técnica
```

### Para Cliente (Sponsor + Atendentes)
```
1. Receba a RACI em D-5 (kickoff)
2. Identifique seu papel:
   - Sponsor: Nomeie curador; participe de review mensal
   - Atendentes: Recebam treinamento; usem feedback (👍/👎)
   - Curador: Mantenha documentação atualizada
3. Escalem problemas usando matriz de conflitos
```

---

## Checklist de Integração

Antes de entregar versão 1.1 ao cliente:

- [x] **Ex 1.3, seção 5.4:** Golden Dataset + script detalhado ✅
- [x] **Ex 1.1, seção 2.4:** Plano de Contingência com escopo claro
- [x] **Novo arquivo:** RACI-matriz-papeis-responsabilidades.md criado
- [ ] **Validação:** Product Specialist leu os 3 e validou consistência
- [ ] **Apresentação:** Incluir RACI na reunião de kickoff (30 min de discussão)
- [ ] **Assinatura:** Cliente assina RACI como "acordo de papéis"

---

## Impacto Esperado

| Métrica | Antes | Depois |
|---------|-------|--------|
| **Risco de regressão silenciosa** | Alto | Baixo (smoke test 95%+ gate) |
| **Clareza sobre curadoria temporária** | Vago ("DB1 assume") | Claro (15 dias, escopo definido, tarifa) |
| **Ambiguidade de papéis** | Alta ("Quem é dono de feedback?") | Zero (RACI explícita) |
| **Tempo de resolução de conflitos** | 2-3 dias (ad hoc) | < 48h (escalation clear) |
| **Confiança do sponsor em pré-condições** | Média | Alta (documento assinado) |

---

## Próximos Passos

1. **Product Specialist:**
   - Leia os 3 arquivos; valide consistência
   - Prepare apresentação de RACI (30 min) para kickoff
   - Prepare scripts de smoke test com Tech Lead (D-5)

2. **Tech Lead:**
   - Crie Golden Dataset (D-5): 15-20 perguntas críticas com gabarito
   - Crie script de avaliação automática (usar LLM-as-a-judge)
   - Roda teste em staging (valida que threshold 95% é realista)

3. **Sponsor:**
   - Nomeie curador antes de D-5
   - Se não conseguir: ativa Opção A (DB1 temporário) e assina termo

4. **Todos:**
   - Na reunião de kickoff: cada um valida seu papel na RACI
   - Assina RACI como "acordo de entendimento"

---

**Versão 1.1 pronta para apresentação ao cliente.**

