# Matriz de Criação × Consumo de Skills — NovaTech Logistics Assistant

**Desenvolvedor:** Almir Oliveira  
**Data:** 2026-06-09  
**Projeto:** NovaTech — Assistente de Suporte Logístico

---

## Overview por Papel

| Papel | # Skills Cria | # Skills Consome | Carga de Criação Estimada |
|-------|:---:|:---:|---|
| Tech Lead | 10 | 17 (todas) | Alta — dono de Foundation + Domain backend + Artifacts críticos |
| Developer | 2 | 12 | Média — consome a maioria; cria artifacts de segunda camada |
| QA | 1 | 9 | Média-baixa — consome specs, ADRs e testes; cria artifact de teste |
| Product Specialist | 1 | 3 | Baixa — criador de specs; consumidor de ADRs e Foundation |
| Frontend Developer | 2 | 5 | Baixa — dono do domínio React; sem dependência de backend |
| Delivery Manager | 0 | 2 | Muito baixa — apenas leitura de specs e ADRs |

---

## Matriz Detalhada

**Legenda:** **Cria** = owner e responsável pela manutenção | Consome = usa para guiar seu trabalho | — = não aplicável

### Foundation Skills

| Skill | Tech Lead | Developer | QA | Product | Frontend | Delivery Mgr |
|-------|:---------:|:---------:|:--:|:-------:|:--------:|:------------:|
| F1 — Error Handling | **Cria** | Consome | Consome | — | Consome | — |
| F2 — Logging | **Cria** | Consome | Consome | — | Consome | — |
| F3 — Env Config | **Cria** | Consome | Consome | — | — | — |

**Notas:**
- Foundation é criada pelo Tech Lead e é obrigatória para todos os consumidores
- Mudança em F1 ou F2 impacta diretamente todo o time; requer notificação formal + sprint de adaptação
- F3 impacta Developer e QA; Frontend tem sua própria gestão de env vars no build React

---

### Domain Skills

| Skill | Tech Lead | Developer | QA | Product | Frontend | Delivery Mgr |
|-------|:---------:|:---------:|:--:|:-------:|:--------:|:------------:|
| D1 — Azure Functions | **Cria** | Consome | Consome | — | — | — |
| D2 — Integration Tests | **Cria** | Consome | Consome | — | — | — |
| D3 — React Components | — | — | — | — | **Cria** | — |
| D4 — ADRs | **Cria** | Consome | — | Consome | — | Consome |
| D5 — Product Specs SDD | — | — | — | **Cria** | — | — |

**Notas:**
- Tech Lead é dono de D1 e D2 (backend); Frontend Developer é dono de D3 (React)
- Product Specialist é a origem da cadeia: cria D5, que alimenta Tech Lead e Developer
- Delivery Manager consome D4 (ADRs) para entender decisões técnicas de alto nível
- QA consome D2 como guia para escrever testes, não como criador

---

### Artifact Skills

| Skill | Tech Lead | Developer | QA | Product | Frontend | Delivery Mgr |
|-------|:---------:|:---------:|:--:|:-------:|:--------:|:------------:|
| A1 — Query Endpoint RAG | **Cria** | Consome | Consome | — | — | — |
| A2 — Feedback Endpoint | — | **Cria** | Consome | — | — | — |
| A3 — Integration Test RAG | — | Consome | **Cria** | — | — | — |
| A4 — React Query Card | — | — | — | — | **Cria** | — |
| A5 — React Feedback Form | — | — | — | — | **Cria** | — |
| A6 — ADR Context Budget | **Cria** | Consome | — | — | — | — |
| A7 — ADR Document Versioning | **Cria** | Consome | — | — | — | — |
| A8 — Logging Middleware | **Cria** | Consome | Consome | — | Consome | — |
| A9 — Spec SDD Query Endpoint | — | — | — | **Cria** | — | — |

**Notas:**
- Artifact skills seguem o padrão "criador = quem domina o domain skill correspondente"
- Developer cria A2 (Feedback Endpoint) após dominar o padrão A1 da Tech Lead
- QA cria A3 (Integration Test) porque é o papel mais qualificado para definir o padrão de testes
- Product Specialist cria A9 (Spec SDD) como output principal de seu papel

---

## Responsabilidades por Papel

### Tech Lead

**Cria (10 skills):**
- Foundation: F1, F2, F3
- Domain: D1, D2, D4
- Artifact: A1, A6, A7, A8

**Consome:** todas as 17 skills (faz code review e valida que todos seguem os padrões)

**Dependências upstream:**
- Product Specialist deve fornecer A9 (Spec SDD) antes que Tech Lead crie o plan e as tasks
- Developers devem seguir D1, F1, F2 — Tech Lead valida no code review

**Dependências downstream:**
- Developer depende de F1, F2, F3, D1, A1 estarem prontas antes de implementar
- QA depende de D2 estar definido para criar A3
- Mudanças em Foundation/Domain devem ser comunicadas com 1 sprint de lead time

---

### Developer

**Cria (2 skills):**
- Artifact: A2 (Feedback Endpoint — padrão derivado de A1)

**Consome (12 skills):** F1, F2, F3, D1, D2, D4, A1, A2, A3, A6, A7, A8

**Dependências upstream:**
- Precisa que Tech Lead tenha criado e publicado F1, F2, F3, D1, A1 antes de começar
- Precisa que QA tenha criado A3 para executar testes de integração

**Dependências downstream:**
- QA depende de Developer ter implementado o endpoint para testar
- Frontend Developer depende de endpoints estáveis para integrar componentes React

---

### QA

**Cria (1 skill):**
- Artifact: A3 (Integration Test para Endpoint RAG)

**Consome (9 skills):** F1, F2, D2, D4, D5, A1, A3, A6, A9

**Dependências upstream:**
- Precisa de D2 (Integration Tests domain) da Tech Lead para criar A3
- Precisa de D5 (Specs SDD) para entender critérios de aceite
- Precisa de código implementado pelo Developer para testar

**Dependências downstream:**
- Developer precisa da skill A3 para saber como escrever os testes do próprio endpoint

---

### Product Specialist

**Cria (2 skills):**
- Domain: D5 (Product Specs SDD)
- Artifact: A9 (Spec SDD Query Endpoint)

**Consome (3 skills):** D4, D5, A9

**Dependências upstream:** Nenhuma — é a origem da cadeia de valor

**Dependências downstream:**
- Tech Lead consome A9 para criar `plan.md` e `tasks.md`
- Developer consome A9 como referência de requisitos durante implementação
- QA consome A9 para derivar casos de teste

---

### Frontend Developer

**Cria (2 skills):**
- Domain: D3 (React Components)
- Artifact: A4 (React Query Card), A5 (React Feedback Form)

**Nota:** Frontend Developer cria tanto D3 quanto A4 e A5; listado como criador das duas Artifact.

**Consome (5 skills):** F1, F2, D3, A4, A5

**Dependências upstream:**
- Precisa de F1 e F2 da Tech Lead (error handling e logging client-side)
- Precisa de endpoints de backend estáveis para integrar
- Precisa de wireframes ou mockups de Product Specialist (fora do escopo de skills)

**Dependências downstream:**
- Nenhuma — Frontend é consumidor final das skills de produto

---

### Delivery Manager

**Cria (0 skills)**

**Consome (2 skills):** D4, A9

**Dependências upstream:** depende de todo o time ter deliverables  
**Dependências downstream:** Nenhuma

---

## Fluxo de Criação de uma Feature (Exemplo: Query Endpoint)

```
1. Product Specialist
   └─ cria A9 (Spec SDD Query Endpoint) usando D5

2. Tech Lead
   └─ lê A9 → cria plan.md e tasks.md
   └─ garante F1, F2, F3, D1, A1 disponíveis

3. Developer
   └─ implementa seguindo D1, F1, F2, A1
   └─ cria A2 se necessário (feedback endpoint)

4. QA
   └─ escreve testes usando D2 e A3
   └─ valida contra critérios de A9

5. Tech Lead
   └─ code review validando conformidade com skills
   └─ aprova merge se 100% dos checks passam

6. Delivery Manager
   └─ acompanha progresso via D4 (ADRs) e A9 (spec)
```

---

## Processo com Copilot

**Prompt inicial:** "Dada a árvore de skills F1-F3, D1-D5 e A1-A9 de um projeto NovaTech, crie uma matriz de criação e consumo por papel (Tech Lead, Developer, QA, Product Specialist, Frontend Developer, Delivery Manager). Indique quem cria e quem consome cada skill."

**Output gerado:** O Copilot gerou a matriz, mas com duas distorções: (1) Tech Lead marcado como criador de todas as 17 skills; (2) Delivery Manager marcado como consumidor de 8 skills incluindo D1 e D2 (técnicas demais para o papel).

**O que foi corrigido:**
- Criação redistribuída: Product Specialist cria D5/A9, Frontend Developer cria D3/A4/A5, QA cria A3, Developer cria A2 — o Copilot centralizou indevidamente no Tech Lead
- Delivery Manager reduzido a D4 e A9 (decisões técnicas de alto nível e spec de produto) — descartados D1-D3 que não fazem parte do dia-a-dia do papel

**O que foi adicionado manualmente:** Toda a seção de Governança de Skills (quem aprova, como criar, como deprecar, como tornar mandatório, processo de update) — o Copilot não considerou o ciclo de vida das skills, apenas o estado estático.

**Iteração:** Um segundo prompt pediu ao Copilot para estimar a carga de trabalho de criação e manutenção de skills para cada papel no primeiro ano. O output com estimativas de horas foi incorporado à seção "Carga de Trabalho Estimada" com ajustes nos valores para refletir a realidade do projeto (ex: Tech Lead com 60–80h, não os 20h sugeridos).

## Carga de Trabalho Estimada

### Tech Lead
- **Criação inicial (10 skills):** ~60–80h (Foundation + Domain + 4 Artifacts críticos)
- **Manutenção:** ~2h/semana (atualizar skills conforme padrões evoluem)
- **Overhead de code review:** ~1h/PR para validar conformidade com skills
- **Estimativa Y1:** ~180h de overhead de skills

### Developer
- **Ramp-up (consumir skills):** +2h/task nas primeiras 4 semanas (~16h no total)
- **Criação de A2:** ~8h (primeira vez que cria artifact de endpoint)
- **Estimativa Y1:** ~24h de overhead de skills; depois ~5% por task

### QA
- **Criação de A3:** ~12h (primeira vez que define padrão de teste de integração)
- **Ramp-up:** +1.5h/teste nas primeiras 4 semanas
- **Estimativa Y1:** ~40h de overhead de skills

### Product Specialist
- **Criação de D5 + A9:** ~10h (aprender formato SDD + escrever spec do endpoint)
- **Cada spec adicional:** ~4h (após dominar o padrão)
- **Estimativa Y1:** ~30h para 5 specs

---

## Governança de Skills

### Quem aprova uma skill nova?
- Skills técnicas (F, D1/D2, Artifacts de backend): Tech Lead
- Skills de produto (D5, Artifact de specs): Product Specialist + Tech Lead
- Skills interdisciplinares (F1, F2): Tech Lead com validação de QA

### Como criar uma skill?
1. Developer ou QA identifica padrão repetido (≥ 3 ocorrências)
2. Propõe SKILL.md draft com estrutura: TL;DR, Context, Rules, Anti-Patterns, Checklist
3. Tech Lead ou Product Specialist (dependendo do domínio) aprova
4. Skill é publicada em `/skills/` e adicionada a esta matriz

### Como deprecar uma skill?
1. Skill marcada como `[DEPRECATED]` no título
2. Campo `Substituída por:` aponta para nova skill
3. Migration path documentado: "altere X para Y em todos os arquivos que usam esta skill"
4. Período de transição: 1 sprint (2 semanas)
5. Após transição: skill arquivada em `/skills/deprecated/`

### Como uma skill vira mandatória?
- Tech Lead ou Product Specialist declara `Status: Mandatory` na skill
- Code review rejeita código que não segue a skill (após período de adoção)
- Código antigo entra em lista de tech debt para refactoring

### Processo de update
- Skill atualizada → Tech Lead notifica todos consumidores via PR/issue
- Consumidores têm 1 sprint para adotar a nova versão
- Versão anterior documentada como `[DEPRECATED - use v2]` por 1 sprint extra

---

## Matriz de Adoção (Status Atual)

| Skill | Status | Adoção Atual | Próx Revisão |
|-------|--------|:---:|---|
| F1 — Error Handling | Mandatory | 0% (a criar) | Ao finalizar Fase 2 |
| F2 — Logging | Mandatory | 0% (a criar) | Ao finalizar Fase 2 |
| F3 — Env Config | Mandatory | 0% (a criar) | Ao finalizar Fase 2 |
| D1 — Azure Functions | Mandatory | 0% (a criar) | Sprint 1 de impl. |
| D2 — Integration Tests | Mandatory | 0% (a criar) | Sprint 2 |
| D3 — React Components | Proposed | 0% (a criar) | Sprint 3 |
| D4 — ADRs | Mandatory | 100% (ADRs já existem) | 2 meses |
| D5 — Product Specs SDD | Mandatory | 100% (spec do exercício 2.1 concluída) | 2 meses |
| A1 — Query Endpoint | Mandatory | 0% (a criar) | Sprint 1 |
| A2 — Feedback Endpoint | Draft | 0% | Sprint 2 |
| A3 — Integration Test | Draft | 0% | Sprint 2 |
| A4 — React Query Card | Draft | 0% | Sprint 3 |
| A5 — React Feedback Form | Draft | 0% | Sprint 3 |
| A6/A7 — ADRs específicos | Accepted | 100% (ADRs documentados) | 3 meses |
| A8 — Logging Middleware | Proposed | 0% | Sprint 1 |
| A9 — Spec SDD Query | Accepted | 100% (spec concluída) | 3 meses |
