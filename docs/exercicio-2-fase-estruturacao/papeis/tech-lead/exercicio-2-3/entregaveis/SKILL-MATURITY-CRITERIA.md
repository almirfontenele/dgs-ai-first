# Skill Maturity Criteria — NovaTech Logistics Assistant

**Versão:** 1.0  
**Data:** 2026-06-10  
**Responsável:** Tech Lead  
**Projeto:** NovaTech — Assistente de Suporte Logístico

---

## Visão Geral

Este documento define critérios práticos e mensuráveis para quando uma skill está "madura" e pronta para uso pela equipe. Uma skill madura é aquela que um agente de IA (Copilot, Claude Code) consegue seguir sem iteração constante, gerando artefatos consistentes e corretos.

> **Princípio:** Não esperamos 100% de aderência. Esperamos aderência **suficiente** para que o output do agente seja utilizável sem correções manuais extensas.

---

## 1. Maturidade por Nível de Skill

### Foundation Skills
**Exemplos:** `typescript-conventions`, `error-handling`, `project-structure`

Foundation skills codificam as decisões duráveis que aparecem em AGENTS.md. São a base que todas as outras skills assumem.

**Critério de maturidade:**
- 100% das regras do AGENTS.md relevantes ao domínio estão documentadas na skill
- Linguagem completamente prescritiva ("VOCÊ DEVE", "NUNCA", "SEMPRE") — zero linguagem sugestiva ("considere", "você poderia")
- Exemplos cobrem o caso principal e os 3 anti-padrões mais comuns
- Qualquer dev novo no projeto consegue entender e aplicar em < 10 minutos

**Tempo estimado até v2.0:** 2–3 semanas (1 sprint de escrita + 1 sprint de testes com time)

**O que NÃO torna uma Foundation skill imatura:**
- Não precisar de muitos exemplos de código (algumas regras são descrição de estrutura)
- Ter poucas seções (Foundation pode ser simples e direta)

---

### Domain Skills
**Exemplos:** `azure-functions-endpoint`, `testing-patterns`, `rag-query-pipeline`

Domain skills definem padrões de um domínio técnico específico. São usadas diariamente pelos devs para geração de código.

**Critério de maturidade:**
- Agente consegue seguir 80%+ das regras em geração real (testado com Copilot)
- SKILL.md foi iterado pelo menos uma vez com base em teste real
- Exemplos de código são copy-paste-ready (executáveis sem modificações)
- Limitações conhecidas estão documentadas (o que o agente ainda não faz bem)

**Tempo estimado até v2.0:** 3–4 semanas (escrita + 2 rodadas de teste + iteração)

---

### Artifact Skills
**Exemplos:** `create-rag-endpoint`, `create-integration-test`, `create-azure-function-crud`

Artifact skills geram artefatos completos — um endpoint inteiro, um conjunto de testes, uma feature. São a composição de múltiplas Domain skills.

**Critério de maturidade:**
- Agente gera artefato completo e executável (não apenas código parcial)
- Artefato gerado passa em testes automatizados (`npm test` verde)
- Artefato segue todas as regras das Domain skills que compõe
- Testado com pelo menos 3 casos diferentes (tipos diferentes de input, edge cases)

**Tempo estimado até v2.0:** 4–6 semanas (requer Domain skills estáveis como pré-requisito)

---

## 2. Checklist de Maturidade

Uma skill pode ser declarada madura (v1.5+) quando todos os itens obrigatórios estão marcados:

### Obrigatórios (todos devem estar ✓ para v1.5)

- [ ] **Documentação 100% completa:** SKILL.md tem todas as seções (Contexto, Decisões técnicas, DO/DON'T, Anti-padrões, Dependências, Checklist)
- [ ] **Linguagem prescritiva:** SKILL.md usa "VOCÊ DEVE", "NUNCA", "SEMPRE" — não "considere", "você poderia", "é recomendado"
- [ ] **Exemplos reais:** Todo exemplo de código é copy-paste-ready ou muito próximo (não pseudocódigo)
- [ ] **Testado com Copilot:** SKILL.md foi usado em pelo menos 1 sessão de geração real com Copilot e o resultado foi documentado
- [ ] **80%+ aderência:** Copilot segue 8 em 10 regras sem correção manual (medido na análise de aderência)
- [ ] **Iterado ao menos uma vez:** SKILL.md passou por pelo menos 1 ciclo de escrita → teste → refinamento
- [ ] **Limitações documentadas:** O que o agente NÃO faz bem está explicitamente listado com mitigação

### Recomendados (para v2.0)

- [ ] **Handover bem-sucedido:** Outro membro do time (não o autor) usou a skill com sucesso sem orientação
- [ ] **Feedback do time incorporado:** Pelo menos 1 sprint de feedback real de uso do time foi incorporado
- [ ] **Dependências verificadas:** Versões de dependências (Azure Functions, Zod, pino) foram validadas contra package.json do projeto

---

## 3. Versioning de Skills

### Esquema de versões

| Versão | Nome | Critério para chegar aqui | Quem pode declarar |
|--------|------|--------------------------|-------------------|
| **v0.1** | Draft | SKILL.md escrito, não testado com agente | Author |
| **v1.0** | Alpha | Testado com Copilot, análise de aderência documentada | Author |
| **v1.5** | Beta | 80%+ aderência, todos os obrigatórios do checklist ✓ | Tech Lead (após review) |
| **v2.0** | Stable | Feedback do time incorporado, handover bem-sucedido | Tech Lead (após 1 sprint de uso) |

### Regras de transição

**v0.1 → v1.0:** Author executa teste com Copilot e documenta análise de aderência. Não precisa de aprovação.

**v1.0 → v1.5:** Tech Lead faz review do SKILL.md e da análise de aderência. Verifica se 80%+ foi atingido. Aprova ou lista o que falta.

**v1.5 → v2.0:** Após pelo menos 1 sprint de uso pelo time. Maintainer designado incorpora feedback, Tech Lead aprova.

### Skills podem regredir de versão?

Sim. Uma skill v2.0 pode regredir para v1.5 quando uma dependência crítica muda (ex: Azure Functions v5 lançado com breaking changes na API). A skill fica em v1.5 até ser atualizada e re-testada.

```
Exemplo:
  azure-functions-endpoint v2.0 (Stable)
    ↓ Azure Functions v5 lançado com nova API
  azure-functions-endpoint v1.5 (Beta — precisa atualização)
    ↓ Tech Lead atualiza exemplos para v5 API
    ↓ Teste com Copilot confirma 80%+ aderência
  azure-functions-endpoint v2.1 (Stable — versão atualizada)
```

---

## 4. Responsabilidades por Fase

| Fase | Owner | Ação | Critério de conclusão |
|------|-------|------|-----------------------|
| **v0.1** | Author (Developer ou Tech Lead) | Escrever SKILL.md completo | Todas as seções preenchidas |
| **v1.0** | Author | Testar com Copilot + documentar análise de aderência | Análise entregue com checklist preenchido |
| **v1.5** | Tech Lead | Review da skill e análise; decidir aprovação | 80%+ aderência confirmada; checklist completo |
| **v2.0** | Maintainer (designado pelo Tech Lead) | Incorporar feedback do time após 1 sprint de uso | Feedback incorporado; handover bem-sucedido |

### Quem é o Maintainer?

- Para Foundation skills: Tech Lead
- Para Domain skills: Developer sênior designado (pode ser o Author)
- Para Artifact skills: Developer que mais usa a skill no dia a dia

---

## 5. Aplicação ao Projeto NovaTech

### Inventário atual de skills

| Skill | Nível | Versão atual | Próxima ação |
|-------|-------|-------------|-------------|
| `azure-functions-endpoint` | Domain | v2.0 (Beta→Stable após 1 sprint) | 1 sprint de uso → v2.0 |
| `typescript-conventions` | Foundation | v0.1 (a criar) | Author escreve SKILL.md |
| `error-handling` | Foundation | v0.1 (a criar) | Author escreve SKILL.md |
| `testing-patterns-vitest` | Domain | v0.1 (a criar) | Author escreve SKILL.md |
| `rag-query-pipeline` | Artifact | Não iniciado | Aguarda Domain skills estáveis |

### Processo de onboarding de nova skill

```
1. Developer identifica padrão repetido que vale documentar
2. Abre issue "New Skill Proposal: [nome]"
3. Tech Lead aprova ou redireciona
4. Developer escreve v0.1 → testa → documenta → v1.0
5. Tech Lead faz review → aprova v1.5
6. Time usa por 1 sprint → feedback → v2.0
```

---

## 6. Processo com Copilot

**Prompt inicial:** "Crie um documento de critérios de maturidade para skills de AI-first development, cobrindo: definição por nível (Foundation/Domain/Artifact), checklist de maturidade, versioning (v0.1 a v2.0) e responsabilidades."

**Output gerado:** O Copilot gerou estrutura básica com 3 níveis e checklist de 5 itens. Versioning sugerido foi v1, v2, v3 sem distinção Alpha/Beta/Stable.

**O que foi mantido:** Estrutura de 3 níveis e ideia de checklist como critério objetivo.

**O que foi adicionado manualmente:**
- Critério de 80% aderência como threshold mensurável (não "suficientemente bom")
- Versioning com nomes semânticos (Draft/Alpha/Beta/Stable) e critérios de transição explícitos
- Regra de regressão de versão quando dependência muda
- Responsabilidades diferenciadas por fase com critério de conclusão por fase
- Inventário atual do projeto e processo de onboarding de nova skill
- Princípio fundamental ("não esperamos 100%")
