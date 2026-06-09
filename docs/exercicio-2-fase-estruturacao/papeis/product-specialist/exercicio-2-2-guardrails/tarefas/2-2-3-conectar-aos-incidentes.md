# Tarefa 2.2.3 — Conectar Cada Guardrail aos Incidentes que Previne

## Objetivo
Criar uma rastreabilidade explícita entre guardrails e os incidentes de teste que os motivaram, demonstrando que cada guardrail resolve um problema real.

## Contexto
Guardrails sem conexão a riscos reais são **tech debt**, não **proteção**. Esta tarefa garante que:
- Cada guardrail previne ao menos um incidente conhecido
- A causa-raiz do incidente está claramente documentada
- A solução (guardrail) realmente previne a recorrência

## Tarefa

### Passo 1: Revisar Incidentes
Os 3 incidentes fornecidos:

**Incidente 1:** Carga perigosa + devolução
```
O assistente respondeu: "O prazo de devolução para carga perigosa é 7 dias"
Realidade: Cargas perigosas NÃO podem ser devolvidas pelo processo padrão
Impacto: Operacional (cliente rejeitado, escalação desnecessária)
```

**Incidente 2:** Versão desatualizada
```
O assistente citou: "PROC-042, seção 2" com multiplicadores da v1
Realidade: v2 vigente desde 2026-06-01 tem multiplicadores diferentes
Impacto: Operacional + Conformidade (cliente cobra valor errado)
```

**Incidente 3:** Busca falhou, mas assistente não escalou
```
O assistente disse: "Não encontrei informação sobre SLA Gold"
Realidade: SLA-2024 estava no índice e continha a resposta
Impacto: Atendimento (cliente insatisfeito, escalação desnecessária)
```

### Passo 2: Analisar Causa-Raiz de Cada Incidente

| Incidente | Comportamento Errado | Causa-Raiz | Guardrail Necessário |
|-----------|-------------------|-----------|----------------------|
| 1 | Afirmou devolução de carga perigosa | LLM confundiu contextos / não conhecia restrição | NÃO DEVE afirmar que carga perigosa pode ser devolvida |
| 2 | Usou versão desatualizada | RAG retornou múltiplas versões, LLM pegou versão errada | DEVE usar versão mais recente |
| 3 | Disse "não encontrei" quando estava no índice | Confiança da busca baixa, ou validação falha | DEVE validar realmente não encontrou antes de responder |

### Passo 3: Criar Matriz de Rastreabilidade
Arquivo `rastreabilidade-incidentes.md`:

```markdown
# Rastreabilidade: Guardrails → Incidentes Prevenidos

## Guardrail: NÃO DEVE afirmar que carga perigosa pode ser devolvida

**Incidentes Prevenidos:**
- ✓ Incidente 1: Assistente respondeu "carga perigosa pode ser devolvida em 7 dias"

**Causa-Raiz:**
- LLM não conhecia restrição específica de cargas perigosas
- Confundiu com processo padrão de devolução

**Como Este Guardrail Previne:**
1. **Prompt:** System message inclui lista explícita: "Cargas perigosas (classes 1-6 ANTT) NÃO podem ser devolvidas"
2. **Código:** Se entrada contém termos ["carga perigosa", "classes ANTT"], bloqueia respostas contendo "devolução" ou "devolvidas"

**Teste de Validação:**
- [ ] Input: "Posso devolver carga perigosa?" → Output: "Não, cargas perigosas..." com escalação
- [ ] Input: "Qual prazo de devolução para classe 3 ANTT?" → Output: "Escalação necessária"

---

## Guardrail: DEVE priorizar versão mais recente de documentos

**Incidentes Prevenidos:**
- ✓ Incidente 2: Assistente citou PROC-042 v1 quando v2 era vigente

**Causa-Raiz:**
- RAG retornou múltiplas versões
- LLM não tinha instrução clara sobre priorização
- Metadados de versão não estavam disponíveis

**Como Este Guardrail Previne:**
1. **Código:** RAG adiciona metadados a cada documento:
   ```json
   {
     "document": "PROC-042",
     "version": "2",
     "effective_date": "2026-06-01",
     "supersedes": ["PROC-042-v1"]
   }
   ```
2. **Código:** Query RAG ordena resultados por effective_date DESC
3. **Prompt:** "Se existem múltiplas versões, sempre cite a mais recente e indique se há versão anterior"

**Teste de Validação:**
- [ ] Query: "Qual é o multiplicador para região Sul?" 
  - Output deve citar PROC-042 v2, não v1
  - Se v1 e v2 têm valores diferentes, Output mostra ambas: "v2 (vigente): 1.3; v1 (desatualizada): 1.1"

---

## Guardrail: DEVE validar que realmente não encontrou (vs falha de busca)

**Incidentes Prevenidos:**
- ✓ Incidente 3: Assistente disse "não encontrei SLA Gold" quando estava indexado

**Causa-Raiz:**
- Query RAG com confiança baixa (< threshold automático)
- LLM respondeu "não encontrei" ao invés de escalar

**Como Este Guardrail Previne:**
1. **Código:** RAG retorna `confidence_score` (0-1)
2. **Código:** Se confidence < 0.7, não passa resultado para LLM; força escalation branch
3. **Prompt:** "Se a resposta tem confiança baixa, sempre sugira escalação"

**Teste de Validação:**
- [ ] Query: "Qual é o SLA Gold?" 
  - Se confiança > 0.7: responde com SLA-2024 como fonte
  - Se confiança < 0.7: responde "Confiança baixa, escalação sugerida"
- [ ] Query: "Qual é o SLA para classe 3 ANTT?" 
  - Se não há documento específico: escalação automática
  - Nunca responde "não encontrei" quando deveria escalar

---
```

### Passo 4: Validar Completude da Cobertura
Verifique que:
- [ ] Cada um dos 3 incidentes é prevenido por pelo menos 1 guardrail
- [ ] Cada guardrail tem causa-raiz documentada
- [ ] Cada guardrail tem estratégia clara de prevenção (prompt + código)
- [ ] Cada guardrail tem teste de validação

### Passo 5: Identificar Guardrails Adicionais
Pergunte-se:
- Existem cenários de falha além dos 3 incidentes?
- Existem riscos de compliance não cobertos?
- Existem riscos operacionais não documentados?

Se sim, adicione guardrails adicionais com incidentes potenciais (não apenas reais).

## Entregável
Um arquivo `rastreabilidade-incidentes.md` com:
- Matriz de rastreabilidade completa
- Descrição detalhada: Para cada guardrail: incidentes prevenidos, causa-raiz, estratégia de prevenção, testes
- Indicação clara de: Incidentes reais (os 3 fornecidos) vs incidentes potenciais (prevenção proativa)

## Critério de Sucesso
Um stakeholder lendo este documento consegue:
1. Ver que cada guardrail foi motivado por um incidente real
2. Entender como o guardrail previne a recorrência
3. Confiar que o sistema está protegido contra esses riscos
4. Identificar novos riscos não cobertos (se existirem)
