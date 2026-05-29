# Estratégia de Prompt Engineering — Assistente NovaTech

**Versão:** 1.0  
**Data:** 2026-05-29  
**Autor:** Tech Lead  
**Papel:** Artefato de arquitetura — versionado e revisado como código

---

## 1. Prompts como Código: Governança e Versionamento

### 1.1. Onde ficam os prompts no repositório

```
/prompts/
  system/
    system-prompt-v1.0.md          ← prompt atual em produção
    system-prompt-v1.1-draft.md    ← candidato em staging
  partials/
    cliente-metadata.md            ← template para injeção de metadados dinâmicos
    instrucoes-contradicao.md      ← bloco reutilizável para documentos conflitantes
  tests/
    test_suite_v1.json             ← casos de teste vinculados ao prompt v1.x
    test_prompts.py                ← script de execução automatizada
  CHANGELOG.md                     ← histórico de mudanças e rationale
```

### 1.2. Convenção de nomenclatura

| Arquivo | Significado |
|---------|-------------|
| `system-prompt-v{MAJOR}.{MINOR}.md` | MAJOR: mudança de contrato de comportamento. MINOR: ajuste de wording sem impacto em casos de teste. |
| `test_suite_v{MAJOR}.json` | Vinculado ao MAJOR do prompt — uma suite por versão de contrato. |

### 1.3. Como são testados

Toda alteração de prompt segue o ciclo:

```
1. Editar arquivo em branch feature/prompt-vX.Y
2. Executar: python prompts/tests/test_prompts.py --suite v1
3. Todos os casos da suite devem passar (critérios verificáveis automaticamente)
4. Para casos de avaliação subjetiva: revisão manual por pelo menos 1 SME (subject matter expert)
5. PR com diff do prompt + resultados do test run no corpo do PR
6. Aprovação obrigatória de: Tech Lead + 1 stakeholder de negócio (Product Specialist ou Atendimento)
```

### 1.4. Quem pode alterar

| Tipo de mudança | Quem aprova |
|-----------------|-------------|
| Wording (sem impacto em comportamento) | Tech Lead sozinho |
| Adição/remoção de regras de comportamento | Tech Lead + Product Specialist |
| Mudança de hierarquia de documentos ou confiança de fonte | Tech Lead + Compliance |
| Qualquer mudança com impacto nos guardrails | Tech Lead + Product Specialist + revisão de segurança |

**CODEOWNERS** (`.github/CODEOWNERS`):
```
/prompts/system/   @tech-lead @product-specialist
/prompts/tests/    @tech-lead
```

---

## 2. Anatomia Completa do Contexto de uma Query

O modelo **não recebe apenas o system prompt** — recebe um contexto composto, montado pelo pipeline a cada chamada. Cada parte tem tamanho, variabilidade e criticidade distintos.

### 2.1. Diagrama da anatomia

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTEXTO COMPLETO ENVIADO AO MODELO (por chamada)              │
│                                                                   │
│  [1] SYSTEM PROMPT (ESTÁTICO)                    ~700 tokens     │
│      Role, regras de comportamento,                               │
│      hierarquia de fontes, guardrails,                            │
│      template de resposta                                         │
│                                                                   │
│  [2] METADADOS DO CLIENTE (DINÂMICO)              ~80 tokens     │
│      Tier, data do contrato, região, flags                        │
│      especiais (ex: contrato com tabela PROC-042 v1)              │
│                                                                   │
│  [3] CHUNKS RECUPERADOS DO RAG (DINÂMICO)        ~600 tokens     │
│      3-5 chunks × ~120-150 tokens cada                            │
│      Inclui: fonte, versão, classificação do doc                  │
│                                                                   │
│  [4] HISTÓRICO DE CONVERSA (DINÂMICO, CRESCENTE) ~800 tokens     │
│      Últimas N trocas (janela deslizante)                         │
│      Comprimido após limite                                       │
│                                                                   │
│  [5] PERGUNTA ATUAL (DINÂMICO)                   ~60 tokens      │
│                                                                   │
│  ─────────────────────────────────────────────────────────────   │
│  SUBTOTAL INPUT                               ~2.240 tokens       │
│  BUFFER DE RESPOSTA                             ~500 tokens       │
│  ─────────────────────────────────────────────────────────────   │
│  TOTAL ESTIMADO POR CHAMADA                   ~2.740 tokens       │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2. Orçamento de contexto e configuração

**Modelo alvo:** Azure OpenAI GPT-4o (contexto de 128k tokens)  
**Orçamento operacional por chamada:** 4.000 tokens (entrada + saída)

| Parte | Tokens | % do orçamento | Variabilidade |
|-------|--------|----------------|---------------|
| System prompt | 700 | 17,5% | Estático — muda só em releases |
| Metadados do cliente | 80 | 2,0% | Por sessão |
| Chunks RAG | 600 | 15,0% | Por query — top-3 a top-5 chunks |
| Histórico de conversa | 800 | 20,0% | Crescente — janela deslizante de 5 turnos |
| Pergunta atual | 60 | 1,5% | Por query |
| **Buffer de resposta** | **500** | **12,5%** | Reserva mínima |
| **Headroom** | **1.260** | **31,5%** | Para queries longas / histórico extenso |

**Política de truncamento:**
- Se `histórico > 1.200 tokens`: remover turnos mais antigos (manter os últimos 3)
- Se `chunks RAG > 800 tokens`: manter top-3 por score de relevância, descartar o restante
- O system prompt e os metadados do cliente são **invioláveis** — nunca truncados

### 2.3. Partes estáticas vs. dinâmicas

**Estáticas (raramente mudam — gerenciadas como código):**
- Definição do role e tom de voz
- Regras de citação de fonte
- Hierarquia de confiança de documentos (normativo > FAQ informal)
- Regras para documentos contraditórios (PROC-042 v1 vs v2)
- Template de estrutura de resposta
- Termos e comportamentos proibidos

**Dinâmicas (injetadas a cada chamada pelo pipeline):**
- Tier do cliente e data do contrato (determina qual tabela de frete aplicar)
- Chunks recuperados pelo RAG (contexto factual da resposta)
- Histórico de conversa (coerência multi-turno)
- Pergunta do atendente (input)

---

## 3. System Prompt Aprimorado (v1.0)

> **Nota de versionamento:** Este prompt é o artefato de produção. Alterações seguem o processo da seção 1.

```
### ROLE ###
Você é o assistente interno de atendimento da NovaTech, empresa de logística.
Seu papel é apoiar os atendentes humanos respondendo dúvidas sobre procedimentos,
SLAs e regras de frete. Você NÃO interage diretamente com o cliente final.

### CONTEXTO DO ATENDIMENTO ###
Cliente em atendimento:
- Tier: {{CLIENTE_TIER}}
- Data de início do contrato: {{CLIENTE_DATA_CONTRATO}}
- Região de operação principal: {{CLIENTE_REGIAO}}
- Flag de tabela de frete: {{CLIENTE_TABELA_FRETE}}  ← "v1" ou "v2" ou "padrao"

### FONTES DISPONÍVEIS ###
Os documentos a seguir foram recuperados pelo pipeline de busca para esta consulta.
Cada chunk é precedido por sua fonte e classificação de confiabilidade:

{{CHUNKS_RAG}}

### HIERARQUIA DE CONFIANÇA DAS FONTES ###
1. POL-xxx (políticas normativas) — ALTA CONFIANÇA. Use como fonte primária.
2. PROC-xxx (procedimentos) — ALTA CONFIANÇA. Quando duas versões existirem,
   use a v2 EXCETO se a flag {{CLIENTE_TABELA_FRETE}} indicar "v1".
3. SLA-xxx (documentos contratuais) — ALTA CONFIANÇA. São compromissos formais.
4. FAQ-Atendimento — BAIXA CONFIANÇA. Conhecimento prático, não validado por
   Compliance. Use apenas quando não houver fonte normativa. Sinalize ao atendente.

### REGRAS DE COMPORTAMENTO ###
1. CITAR FONTE: Toda informação factual deve citar o documento de origem.
   Formato: "(Fonte: DOCUMENTO-ID, Seção X.X)"
2. NÃO INVENTAR: Nunca mencione prazos, valores, multiplicadores ou regras que
   não estejam nos chunks fornecidos.
3. AUSÊNCIA DE INFORMAÇÃO: Se a informação não estiver nos chunks, responda
   exatamente: "Não encontrei essa informação na base de documentos disponíveis.
   Recomendo consultar [área responsável] ou abrir chamado interno."
4. DOCUMENTOS CONTRADITÓRIOS: Se dois chunks fornecerem informações conflitantes,
   sinalize explicitamente: "⚠️ Atenção: existem duas versões deste procedimento
   com valores diferentes. [Explique a diferença]. Aplique conforme a flag do
   contrato do cliente."
5. FONTES INFORMAIS: Quando a resposta vier apenas do FAQ (sem documento formal),
   sinalize: "⚠️ Esta informação vem do FAQ informal da equipe de atendimento e
   não foi validada pelo Compliance. Confirme com a área responsável antes de
   comunicar ao cliente."
6. IDIOMA E TOM: Responda sempre em português formal e conciso.
7. ESCOPO: Responda apenas perguntas sobre os domínios: devolução de mercadorias,
   cálculo de frete, SLAs de atendimento, e procedimentos operacionais da NovaTech.
   Para temas fora do escopo, oriente o atendente a buscar a área responsável.

### FORMATO DE RESPOSTA ###
**Resposta:** [resposta objetiva]
**Fonte:** [documento(s) citados]
**Atenção:** [se houver contradição, lacuna ou fonte informal — opcional]
```

---

## 4. Enforcement: Probabilístico vs. Determinístico

### 4.1. Conceito

O prompt é um mecanismo **probabilístico**: instrui o modelo a se comportar de determinada forma, mas não há garantia absoluta de conformidade. Para regras críticas, é necessário adicionar verificações **determinísticas** fora do modelo — no Harness (camada de pós-processamento).

### 4.2. Matriz de enforcement

| Guardrail | Onde enforçar | Mecanismo | Justificativa |
|-----------|--------------|-----------|---------------|
| Responder em português formal | **Prompt** (probabilístico) | Instrução no system prompt | Falha ocasional é tolerável; detecção automática de idioma é frágil |
| Citar fonte na resposta | **Harness** (determinístico) | Regex: verificar se resposta contém padrão `(Fonte: [A-Z]{2,}-[0-9]{3}` | Regra crítica — sem fonte, o atendente não pode validar a informação |
| Não inventar valores numéricos | **Prompt** (probabilístico) + **Harness** (parcial) | Prompt instrui; Harness valida se valores mencionados existem nos chunks | Verificação exata no harness é difícil, mas detectar ausência de chunks numéricos no contexto é viável |
| Sinalizar documentos contraditórios | **Prompt** (probabilístico) | Instrução explícita no system prompt | Harness não consegue avaliar contradição semântica facilmente |
| Sinalizar FAQ como fonte informal | **Harness** (determinístico) | Se qualquer chunk da resposta vier de FAQ-*, verificar se o prefixo `⚠️ Esta informação vem do FAQ` está presente | FAQ é estruturalmente identificável — não depende da IA |
| Resposta fora do escopo | **Prompt** (probabilístico) + **Harness** (leve) | Prompt define escopo; Harness detecta se resposta não cita nenhum chunk (possível out-of-scope ou alucinação) | Complementar |
| Nunca mencionar tier Platinum | **Prompt** (probabilístico) + **Harness** (determinístico) | Harness: bloquear respostas que contenham "Platinum" sem ser uma correção explícita | Tier inexistente é binário — fácil de verificar |
| Não revelar dados de outros clientes | **Arquitetura** (isolamento) | Filtro de metadados no pipeline — cliente só recebe seus próprios metadados | Não é um problema de prompt — é de isolamento de dados |

### 4.3. Diagrama do Harness

```
Pergunta do atendente
        │
        ▼
  [Pipeline RAG]
  Recupera chunks + metadados do cliente
        │
        ▼
  [Montagem do contexto]
  Injeta: system prompt + metadados + chunks + histórico + pergunta
        │
        ▼
  [Chamada ao LLM — Azure OpenAI GPT-4o]
  Gera resposta (processo probabilístico)
        │
        ▼
  ┌─────────────────────────────────────┐
  │  HARNESS — Verificações determinísticas │
  │                                         │
  │  ✓ Contém citação de fonte?             │  → Se não: bloquear + log
  │  ✓ Se usou FAQ: contém aviso ⚠️?       │  → Se não: injetar aviso padrão
  │  ✓ Menciona "Platinum" indevidamente?   │  → Se sim: bloquear + log
  │  ✓ Resposta vazia ou muito curta?       │  → Se sim: fallback + log
  └─────────────────────────────────────────┘
        │
        ▼
  Resposta exibida ao atendente
        │
        ▼
  [Log estruturado para auditoria]
  prompt_version, chunks_used, guardrails_triggered, response_hash
```

### 4.4. Regra de ouro

> **"Se o guardrail falhar uma vez e o custo for alto → determinístico no Harness.**  
> Se o guardrail falhar e o custo for baixo → probabilístico no prompt."**

Exemplos:
- Inventar um prazo de devolução → custo alto (impacto contratual) → Harness verifica se valores numéricos mencionados existem nos chunks
- Usar tom informal ocasionalmente → custo baixo → apenas instrução no prompt

---

## 5. Referências

- Exercício 1.2 — [exercicio-1.2-prompt-engineering.md](../../exercicio-1.2-prompt-engineering.md)
- ADR-0001 — Escolha do LLM (Azure OpenAI GPT-4o)
- ADR-0003 — Tratamento de documentos contraditórios no RAG
- Guardrails do Product Specialist — Exercício 1.2, seção de Inputs
- Script de testes — [test_prompts.py](./test_prompts.py)
