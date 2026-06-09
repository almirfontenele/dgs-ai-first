# Tarefa 2.3.2 — Criar Glossário de Linguagem Ubíqua

## Objetivo
Compilar um glossário **machine-readable** de termos do domínio NovaTech que agentes de IA e desenvolvedores precisam conhecer. O glossário deve destacar termos que um LLM confundiria sem contexto explícito.

## O Que Vai no Glossário?
- Termos de domínio (logística, SLAs, etc.)
- Termos que têm significado diferente fora do domínio (ex: "Gold" = tier)
- Abreviações (ANTT, PROC, POL, SLA)
- Conceitos implícitos (ex: "carga perigosa" = classes 1-6)

## Tarefa

### Passo 1: Compilar Termos da Tarefa 2.1.2
A partir do exercício 2.1 (Tarefa 2.1.2), você já tem um glossário de linguagem ubíqua. Nesta tarefa, você **reformata** esse glossário para ser machine-readable e adicionável ao `AGENTS.md`.

### Passo 2: Estruturar para Machine-Readability
Use um formato estruturado (ex: JSON ou YAML) que possa ser:
- Parseado por código
- Usado em prompts
- Consultado por buscadores

Opção A — JSON:
```json
{
  "glossary": [
    {
      "term": "SLA Gold",
      "definition": "Serviço Level Agreement para clientes tier Gold, com resolução garantida em 4 horas",
      "source": "SLA-2024, seção 3.1",
      "aliases": ["SLA-Gold", "Gold SLA"],
      "opposite_term": "SLA Silver, SLA Standard",
      "llm_confusion_risk": "HIGH",
      "confusion_example": "LLM pode confundir com 'Gold' (metal) ou com 'ouro' (cor)"
    }
  ]
}
```

Opção B — Markdown (mais legível):
```markdown
## Glossário

### SLA Gold
- **Definição:** Serviço Level Agreement para clientes tier Gold, com resolução garantida em 4 horas
- **Fonte:** SLA-2024, seção 3.1
- **Aliases:** SLA-Gold, Gold SLA
- **Contrário:** SLA Silver, SLA Standard
- **Risco de Confusão:** ALTO
- **Exemplo de Confusão:** "Gold" pode ser confundido com o metal ou a cor, não um tier de cliente
```

### Passo 3: Marcar Risco de Confusão para LLM
Para cada termo, classifique o risco:
- **ALTO:** LLM frequentemente erra (ex: "Gold" = metal? cor? tier?)
- **MÉDIO:** LLM ocasionalmente erra (ex: "multiplicador" = o quê exatamente?)
- **BAIXO:** LLM raramente erra (ex: "ANTT" = não tem significado fora do domínio)

Termos com ALTO risco devem ir para o system prompt.

### Passo 4: Criar Estrutura Completa
```markdown
## Glossário: Linguagem Ubíqua NovaTech

### Seção 1: Clientes & Tiers

#### Termo: Cliente Gold
- **Definição:** Cliente categorizado como tier Gold na base, com SLA de 4 horas
- **Uso Correto:** "Este cliente é Gold, então o SLA é 4 horas"
- **Uso Incorreto:** "Este cliente é o ouro, tipo valioso" (confusão com metal)
- **Fonte:** SLA-2024
- **Risco de Confusão:** ALTO

#### Termo: Cliente Silver
- **Definição:** Cliente categorizado como tier Silver, com SLA de 8 horas
- **Fonte:** SLA-2024
- **Risco de Confusão:** MÉDIO (confusão com cor/metal)

#### Termo: Cliente Standard
- **Definição:** Cliente padrão, com SLA de 24 horas
- **Fonte:** SLA-2024
- **Risco de Confusão:** BAIXO (termo genérico)

---

### Seção 2: Logística & Frete

#### Termo: Carga Perigosa
- **Definição:** Produtos das classes 1-6 ANTT (explosivos, gases, líquidos, sólidos, comburentes, tóxicos)
- **Restrição:** Não pode ser devolvida pelo processo padrão
- **Fonte:** POL-001, PROC-042
- **Risco de Confusão:** ALTO (conceito técnico, não coloquial)

#### Termo: Frete Especial
- **Definição:** Fretes acima de 500kg com multiplicador regional aplicado
- **Multiplicador:** Varia por região (ex: Sul = 1.2, Norte = 1.5)
- **Fonte:** PROC-042 v2
- **Risco de Confusão:** MÉDIO (palavra "especial" pode ser genérica)

#### Termo: Multiplicador Regional
- **Definição:** Fator aplicado ao frete base conforme região de destino
- **Exemplo:** Região Sul multiplicador = 1.2 (frete base × 1.2)
- **Fonte:** PROC-042 v2
- **Risco de Confusão:** ALTO (conceito matemático, requer valor exato)

---

### Seção 3: Políticas & Procedimentos

#### Termo: POL-001
- **Nome Completo:** Política de Devolução NovaTech
- **Escopo:** Regras para aceitação e processamento de devoluções
- **Versão Atual:** 2 (vigente 2026-06-01)
- **Versão Anterior:** 1 (desatualizada)
- **Nota:** Cargas perigosas têm restrições especiais nesta política
- **Fonte:** [Arquivo POL-001-politica-devolucao.md](./anexos/POL-001-politica-devolucao.md)

#### Termo: PROC-042
- **Nome Completo:** Procedimento de Frete
- **Versão Atual:** 2 (vigente 2026-06-01)
- **Versão Anterior:** 1 (com multiplicadores diferentes)
- **Mudanças v1→v2:** Multiplicadores atualizados (ex: Sul: 1.1 → 1.2)
- **Fonte:** [Arquivo PROC-042-v2-frete-especial-revisado.md](./anexos/PROC-042-v2-frete-especial-revisado.md)

---

### Seção 4: Abreviações

| Sigla | Significado | Contexto |
|-------|-------------|----------|
| ANTT | Agência Nacional de Transportes Terrestres | Classes de carga perigosa |
| SLA | Service Level Agreement | Prazos de resposta |
| POL | Política | Documentos de política |
| PROC | Procedimento | Documentos de procedimento |

---

### Alto Risco — Termos Críticos para System Prompt

Os seguintes termos devem estar EXPLÍCITOS no system prompt do LLM:
- [ ] Cliente Gold ≠ ouro, é tier de cliente
- [ ] Cliente Silver ≠ prata, é tier de cliente
- [ ] Carga Perigosa = classes 1-6 ANTT, NÃO pode ser devolvida
- [ ] Multiplicador = valor exato, não aproximação
- [ ] PROC-042 v2, não v1
```

### Passo 5: Validação
Para cada termo, valide:
- [ ] Tem definição específica (não vaga)?
- [ ] Está documentado em Anexo A?
- [ ] Risco de confusão está correto?
- [ ] Termos críticos estão marcados para system prompt?

## Entregável
Um arquivo `glossario.md` formatado para `AGENTS.md`:
- Termos organizados por seção (Clientes, Logística, Políticas, Abreviações)
- Definições específicas para cada termo
- Risco de confusão (ALTO/MÉDIO/BAIXO)
- Fontes (referências ao Anexo A)
- Lista de termos críticos para system prompt

## Critério de Sucesso
Um desenvolvedor consultando este glossário consegue:
1. Entender que "Gold" é um tier, não um metal
2. Saber o que é "carga perigosa" e suas restrições
3. Conhecer versões vigentes vs desatualizadas
4. Saber quais termos colocar no system prompt do LLM
5. Evitar alucinações e confusões conceituais
