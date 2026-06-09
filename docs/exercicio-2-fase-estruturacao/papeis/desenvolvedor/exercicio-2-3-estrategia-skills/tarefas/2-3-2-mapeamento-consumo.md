# Tarefa 2.3.2 — Mapeamento de Criação/Consumo por Papel

## Objetivo

Criar uma matriz clara de qual papel cria cada skill, qual papel consome, com que frequência, e quais são as dependências interpapéis.

## Contexto

Uma skill não é útil se ninguém a usa. E uma skill não é mantida se ninguém a cria. Esta tarefa documenta:
- Quem é responsável por manter cada skill (criar, atualizar, deprecate)
- Quem consome cada skill (devs, agentes, QA)
- Dependências entre papéis (ex: Dev depende de Tech Lead manter a skill de error handling)

Isto ajuda a planejar carga de trabalho e governança.

## Inputs

- Árvore de skills da Tarefa 2.3.1 (`skills-tree.md`)
- Papéis do projeto (Developer, Tech Lead, QA, Product Specialist, Delivery Manager)
- Conhecimento de quem está responsável por quê

## Entregáveis

Um arquivo `creation-consumption-matrix.md` com:

```markdown
# Matriz de Criação × Consumo de Skills

## Overview

| Papel | # Skills Cria | # Skills Consome | Carga Estimada |
|-------|--------------|------------------|----------------|
| Tech Lead | 8 | 15 (todas) | Alta |
| Developer | 3 | 14 | Alta |
| QA | 1 | 10 | Média |
| Product Specialist | 2 | 5 | Média |
| Frontend Dev | 1 | 4 | Baixa |
| Delivery Manager | 0 | 3 | Muito Baixa |

---

## Matriz Detalhada

### Foundation Skills

| Skill | Tech Lead (C) | Dev (C) | QA (C) | Produto (C) | Frontend (C) | Delivery Mgr (C) |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| Error Handling | **Cria** | Consome | Consome | — | Consome | — |
| Logging | **Cria** | Consome | Consome | — | Consome | — |
| Env Config | **Cria** | Consome | Consome | — | — | — |

**Notas:**
- Tech Lead cria e mantém Foundation (responsável por convencer que todos seguem)
- Todos consumem (Foundation é obrigatório)
- Se Error Handling muda, todos devem ser notificados

---

### Domain Skills

| Skill | Tech Lead | Dev | QA | Produto | Frontend | Delivery |
|-------|:---------:|:---:|:---:|:---:|:---:|:---:|
| Azure Functions | **Cria** | Consome | Consome | — | — | — |
| Integration Tests | **Cria** | Consome | Consome | — | — | — |
| React Components | Frontend | — | — | — | **Cria** | — |
| ADRs | **Cria** | Consome | — | — | — | — |
| Product Specs | — | — | — | **Cria** | — | — |

**Notas:**
- Tech Lead é dono de Domain skills de backend
- Frontend Dev é dono de frontend domain skills
- Product Specialist cria specs (requisitos)
- Developers consomem todas as Domain skills de backend

---

### Artifact Skills

| Skill | Tech Lead | Dev | QA | Produto | Frontend | Delivery |
|-------|:---------:|:---:|:---:|:---:|:---:|:---:|
| Query Endpoint | **Cria** | Consome | Consome | — | — | — |
| Feedback Endpoint | — | **Cria** | Consome | — | — | — |
| Integration Test | — | Consome | **Cria** | — | — | — |
| React Query Card | — | — | — | — | **Cria** | — |
| ADR—Context Budget | **Cria** | Consome | — | — | — | — |
| Spec—Query | — | — | — | **Cria** | — | — |
| Spec—Feedback | — | — | — | **Cria** | — | — |
| Logging Middleware | **Cria** | Consome | Consome | — | Consome | — |

**Notas:**
- Artifact skills herdam de Domain/Foundation
- Criador de uma artifact skill geralmente é o mesmo que criou a Domain skill correspondente
- Consumidores são aqueles que implementam artefatos seguindo a skill

---

## Dependências Interpapéis

### Tech Lead (Central)

**Cria:**
- Foundation: Error Handling, Logging, Env Config
- Domain: Azure Functions, Integration Tests, ADRs
- Artifact: Query Endpoint, ADR—Context Budget, Logging Middleware

**Consome:**
- Tudo (faz code review de tudo)

**Dependências:**
- Product Specialist deve fornecer specs antes que Tech Lead crie plan
- Developers devem seguir as skills que Tech Lead criou
- QA deve implementar testes seguindo o padrão de Integration Tests

---

### Developer

**Cria:**
- Artifact: Feedback Endpoint (exemplo de endpoint similar a Query)
- Implementações específicas que seguem a skill

**Consome:**
- Foundation: Error Handling, Logging, Env Config
- Domain: Azure Functions, Integration Tests
- Artifact: Query Endpoint (como template)

**Dependências:**
- Precisa de Tech Lead manter Foundation/Domain skills
- Precisa de QA implementar testes para cada endpoint

---

### QA

**Cria:**
- Artifact: Integration Test (receita de como testar um endpoint)

**Consome:**
- Foundation: Error Handling, Logging
- Domain: Integration Tests, ADRs, Specs
- Artifact: Integration Test template

**Dependências:**
- Precisa de Developers ter implementado a funcionalidade
- Precisa de specs claras de Product Specialist
- Precisa de padrão de testes definido por Tech Lead

---

### Product Specialist

**Cria:**
- Artifact: Spec—Query Endpoint, Spec—Feedback (SDD format)

**Consome:**
- Nada (é origem da cadeia)

**Dependências:**
- Nenhuma upstream
- Downstream: Tech Lead consome specs e cria planos

---

### Frontend Developer

**Cria:**
- Domain: React Components (padrão)
- Artifact: React Query Card (exemplo específico)

**Consome:**
- Foundation: Error Handling, Logging
- Artifact: Logging Middleware (client-side variant)

**Dependências:**
- Precisa de Backend ter endpoints disponíveis
- Precisa de Design/Product ter wireframes

---

### Delivery Manager

**Cria:**
- Nenhuma skill

**Consome:**
- Artifact: Specs (para entender requisitos)
- Artifact: ADRs (para entender decisões técnicas)

**Dependências:**
- Tudo (depende de todo time ter deliverables)

---

## Fluxo de Criação de uma Feature

Exemplo: "Implementar query endpoint"

1. **Product Specialist** cria `Spec—Query Endpoint` (usando Artifact skill de spec SDD)
2. **Tech Lead** lê spec, cria `plan.md` e `tasks.md` (usando sua experiência + Foundation skills)
3. **Developer** implementa seguindo:
   - Domain skill: Azure Functions (estrutura)
   - Domain skill: Error Handling (tratamento de erros)
   - Domain skill: Logging (logs estruturados)
   - Artifact skill: Query Endpoint (padrão específico de RAG)
4. **QA** testa seguindo:
   - Domain skill: Integration Tests (estrutura de testes)
   - Artifact skill: Integration Test (como testar este endpoint)
5. **Tech Lead** faz code review validando que tudo segue as skills
6. **Delivery Manager** rastreia progresso no board

---

## Carga de Trabalho Estimada

### Tech Lead
- **Criação inicial:** 40h (criar todas as Foundation/Domain skills)
- **Manutenção:** 2h/semana (atualizar conforme aprende padrões melhores)
- **Overhead:** Code review, alinhar devs que não seguem skills
- **Total Y1:** ~140h

### Developer
- **Consumo:** Cada task leva ~2h a mais por causa da ramp-up de skills (primeiros 3 meses)
- **Criação de artifact:** Quando inicia um novo tipo de artefato
- **Total Y1:** ~5% overhead inicial, depois ~2%

### QA
- **Consumo:** Cada teste leva ~2h mais porque precisam aprender o padrão
- **Criação:** Integration Test skill (16h inicial)
- **Total Y1:** ~120h

### Product Specialist
- **Criação:** Cada spec leva ~3h a mais (aprendendo SDD format)
- **Total Y1:** ~30h (10 specs × 3h)

---

## Governança de Skills

### Quem aprova uma skill nova?
- Tech Lead aprova se é technical skill
- Product Specialist aprova se é product skill
- Ambos aprovam interdisciplinar

### Como deprecate uma skill?
- Skill é marcada "Deprecated" (com timestamp)
- Mensagem clara de qual skill usar em vez
- Migration path documentado (ex: "Use Foundation v2 em vez de v1")

### Como uma skill vira mandatória?
- Tech Lead ou Product (dependendo do tipo) declara "mandatory"
- Todos os novas implementações devem seguir
- Código antigo vai em "tech debt" para refactoring depois

### Processo de update
- Skill muda → Tech Lead notifica todos que consomem
- Developers têm 1 sprint para adotar a nova versão
- Code review rejeita código que segue versão antiga (após período de transição)

---

## Matriz de Adoção

| Skill | Status | Adoção | Próx Review |
|-------|--------|--------|-------------|
| Error Handling (F) | Mandatory | 100% | 1 mês |
| Logging (F) | Mandatory | 100% | 1 mês |
| Env Config (F) | Mandatory | 100% | 1 mês |
| Azure Functions (D) | Mandatory | 100% | 2 meses |
| Integration Tests (D) | Mandatory | 80% | 2 meses |
| React Components (D) | Proposed | 50% | 1 mês |
| Query Endpoint (A) | Mandatory | 100% | 3 meses |
| Feedback Endpoint (A) | Draft | 0% | 2 semanas |
| React Query Card (A) | Draft | 0% | 2 semanas |

---

## Checklist de Implementação

- [ ] Matriz criação × consumo para todas as skills
- [ ] Dependências interpapéis documentadas
- [ ] Carga de trabalho estimada por papel
- [ ] Governança de skills (approval, deprecation, mandatory)
- [ ] Status e adoção de cada skill
```

## Critérios de Aceite

- [ ] Matriz com todas as skills × papéis (mínimo 15 skills, 6 papéis)
- [ ] Cada célula é clara (Cria / Consome / —)
- [ ] Pelo menos 1 dependência interpapéis documentada
- [ ] Carga de trabalho estimada por papel
- [ ] Governança de skills clara (quem aprova, como deprecate)

## Passo a Passo

### Passo 1: Listar papéis e skills
Linhas: todas as skills da Tarefa 2.3.1  
Colunas: todos os papéis do projeto

### Passo 2: Preencher matriz básica
Para cada skill × papel, marque:
- **Cria:** Este papel é dono/mantém desta skill
- **Consome:** Este papel usa esta skill
- **—:** Não aplicável

Regra de ouro: uma skill deve ter exatamente 1 criador, 1+ consumidores.

### Passo 3: Usar Claude para validar
Cole sua matriz:

> "Tenho esta matriz de skills × papéis. Há algo fora do lugar?
> [Sua matriz]
>
> Por exemplo:
> - Uma skill sem criador (ninguém mantém)
> - Uma skill sem consumidor (ninguém usa)
> - Um papel criando demais (não tem tempo)
> - Dependências que não fazem sentido"

Claude deve apontar anomalias.

### Passo 4: Documentar dependências
Para cada skill que um papel cria, liste quem consome e o que acontece se muda.

Exemplo:
- **Tech Lead cria:** Error Handling skill
- **Consome:** Todos (Developer, QA, Frontend)
- **Se muda:** Todos devem ser notificados e refactorarem code em 1 sprint
- **Impacto:** Alta (Critical path)

### Passo 5: Estimar carga de trabalho
Para cada papel, estime:
- Criação inicial (quantas horas para criar as skills que ele cria)
- Manutenção (quantas horas/semana para manter atualizado)
- Consumo (quanto extra leva fazer tarefas seguindo as skills)

Exemplo:
- **Tech Lead criação:** 40h (criar Foundation + Domain)
- **Tech Lead manutenção:** 2h/semana
- **Developer consumo:** +2h por task (aprendendo padrão)

### Passo 6: Documentar governança
Como skills são:
- **Criadas:** Qual papel, em qual contexto
- **Aprovadas:** Quem decide se é boa o suficiente
- **Atualizadas:** Como mudanças são comunicadas
- **Deprecadas:** Qual é o caminho de migração

### Passo 7: Estruturar como documento
Crie `creation-consumption-matrix.md` com seções:
- Overview table (papel × # skills criadas/consumidas)
- Matriz detalhada (skill × papel, Foundation/Domain/Artifact)
- Fluxo de criação de uma feature (como skills fluem de papel a papel)
- Carga de trabalho estimada
- Governança

## Dicas

- **Uma skill deve ter 1 criador:** Se 2 papéis criam, há conflito. Quem é owner?

- **Uma skill deve ter consumidores:** Se ninguém consome, ela não deveria existir.

- **Carga de Tech Lead é pesada:** Tech Lead é o centro (cria Foundation e parte de Domain). Considere delegar mais Artifact para devs/QA.

- **Dependências importam:** Se Dev depende de Tech Lead manter Error Handling, e Tech Lead sai de férias, devs ficam bloqueados. Considerar redundância.

## Referências

- Árvore de skills (Tarefa 2.3.1)
- Papéis do projeto (Anexo ou contexto)
