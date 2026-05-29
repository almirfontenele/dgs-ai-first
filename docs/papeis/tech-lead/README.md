# Tech Lead - Documentação

Guia completo das responsabilidades, exercícios e entregáveis do papel de **Tech Lead** no projeto DGS AI First.

---

## 📋 Visão Geral

Este diretório contém toda a documentação e exercícios que o Tech Lead precisa executar para garantir que as decisões arquiteturais sejam tomadas de forma fundamentada e documentadas adequadamente.

**Objetivo principal:** Definir e documentar decisões técnicas sobre:
- Escolha de modelos de IA
- Gerenciamento de contexto
- Tratamento de dados contraditórios
- Arquitetura de RAG

---

## 🎯 Exercícios Principais

### 1️⃣ Exercício 1.1 - ADRs (Architecture Decision Records)

**Arquivo:** [exercicio-1.1-adrs.md](tarefas/exercicio-1.1-adrs.md)

Documentar 4 decisões arquiteturais críticas:

| ADR | Tema | Entregável |
|-----|------|-----------|
| **ADR-0001** | Escolha do modelo LLM | [Arquivo](tarefas/entregaveis/ADR/ADR-0001-escolha-llm.md) |
| **ADR-0002** | Gerenciamento de contexto | [Arquivo](tarefas/entregaveis/ADR/ADR-0002-gerenciamento-contexto.md) |
| **ADR-0003** | Documentos contraditórios | [Arquivo](tarefas/entregaveis/ADR/ADR-0003-documentos-contraditorios.md) |
| **ADR-0004** | Build vs Buy (RAG pipeline) | [Arquivo](tarefas/entregaveis/ADR/ADR-0004-build-vs-buy-pipeline-rag.md) |

**Como fazer:**
1. Leia o cenário completo no arquivo do exercício
2. Use Claude com abordagem "devil's advocate" (apresente a decisão, peça contra-argumentos)
3. Documente usando o formato padrão de ADR
4. Revise e fortaleça com base nos contra-argumentos

---

### 2️⃣ Exercício 1.2 - Estratégia de Prompt Engineering

**Arquivo:** [exercicio-1.2-prompt-engineering.md](tarefas/exercicio-1.2-prompt-engineering.md)

Definir e documentar a estratégia completa de prompts como artefato de código.

**Entregáveis:**
- 📄 [Estratégia de Prompt Engineering](tarefas/entregaveis/prompt-engineering/estrategia-prompt-engineering.md)
- 📝 Script de teste automatizado de prompts
- 🔒 Análise enforcement (probabilístico vs determinístico)

**Como fazer:**
1. Defina onde os prompts ficam versionados
2. Mapeie a "anatomia do contexto" (estático + dinâmico)
3. Crie script de teste com GitHub Copilot
4. Documente guardrails e sua aplicação

---

### 3️⃣ Exercício 1.3 - Revisão Crítica de RAG

**Arquivo:** [exercicio-1.3-revisao-rag.md](tarefas/exercicio-1.3-revisao-rag.md)

Revisar uma proposta de arquitetura RAG identificando problemas e melhorias.

**Entregáveis:**
- ✅ Sua revisão técnica (problemas identificados)
- 🤖 Revisão feita com Claude
- 📊 Comparação humano vs IA
- 🔄 Proposta reescrita com melhorias

**Como fazer:**
1. Revise a proposta por conta própria (identifique 4+ problemas)
2. Use Claude para segunda opinião
3. Compare os resultados
4. Reescreva incorporando as melhorias

---

## 📁 Estrutura de Diretórios

```
tech-lead/
├── README.md                          ← Você está aqui
├── tech-lead.md                       ← Descrição completa dos 3 exercícios
├── tarefas/
│   ├── exercicio-1.1-adrs.md
│   ├── exercicio-1.2-prompt-engineering.md
│   ├── exercicio-1.3-revisao-rag.md
│   └── entregaveis/
│       ├── ADR/
│       │   ├── README.md
│       │   ├── ADR-0001-escolha-llm.md
│       │   ├── ADR-0002-gerenciamento-contexto.md
│       │   ├── ADR-0003-documentos-contraditorios.md
│       │   └── ADR-0004-build-vs-buy-pipeline-rag.md
│       ├── prompt-engineering/
│       │   ├── README.md
│       │   └── estrategia-prompt-engineering.md
│       └── revisao-rag/
│           └── revisao-rag.md
└── entregaveis/                       ← (legado)
```

---

## ✅ Checklist de Execução

- [ ] **Exercício 1.1:** Leia a descrição completa em [tech-lead.md](tech-lead.md)
  - [ ] Crie os 4 ADRs usando Claude (com devil's advocate)
  - [ ] Salve em `entregaveis/ADR/`

- [ ] **Exercício 1.2:** Leia a descrição completa em [tech-lead.md](tech-lead.md)
  - [ ] Defina a estratégia de prompts
  - [ ] Crie script de teste
  - [ ] Salve em `entregaveis/prompt-engineering/`

- [ ] **Exercício 1.3:** Leia a descrição completa em [tech-lead.md](tech-lead.md)
  - [ ] Faça sua revisão técnica
  - [ ] Use Claude para segunda opinião
  - [ ] Salve em `entregaveis/revisao-rag/`

---

## 🔗 Próximos Passos

1. **Comece pelo** [tech-lead.md](tech-lead.md) para entender o contexto completo
2. **Escolha um exercício** e siga as tarefas passo a passo
3. **Salve os entregáveis** na pasta correspondente
4. **Revise e documente** suas decisões com clareza

---

## 📖 Referências Rápidas

- **Formato ADR:** [Exemplo de ADR-0001](tarefas/entregaveis/ADR/ADR-0001-escolha-llm.md)
- **Contexto do Projeto:** Consulte o cenário completo em [tech-lead.md](tech-lead.md)
- **Critérios de Avaliação:** Veja cada exercício em [tech-lead.md](tech-lead.md)
