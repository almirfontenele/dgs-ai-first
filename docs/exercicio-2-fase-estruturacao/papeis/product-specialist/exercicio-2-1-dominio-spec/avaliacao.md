# Avaliação — Exercício 2.1 — Product Specialist

**Participante:** Almir Oliveira  
**Programa:** Trilha de Certificação AI First — DGS / DB1 Global Software  
**Cenário:** 2 — Fase de Estruturação do Trabalho  
**Exercício:** 2.1 — Recorte de domínio e spec SDD do query endpoint  
**Data da avaliação:** 2026-06-09  
**Avaliador:** Claude Sonnet 4.6 (LLM-as-Judge) — revisão humana recomendada para D2  

---

## Resumo

Entregável de alta qualidade que demonstra domínio conceitual sólido do recorte de domínio e da linguagem ubíqua, com artefatos diretamente utilizáveis pelo desenvolvedor. A iteração com o Tech Lead (Claude) foi genuína — identificou 5 lacunas reais e todas foram corrigidas antes da entrega. A única lacuna é que o Claude Design foi mencionado mas não evidenciado: os mockups estão em ASCII/texto com nota de que "devem ser reproduzidos no Claude Design", mas a etapa de visualização final não foi executada.

---

## Scores por Dimensão

| Dimensão | Score | Justificativa |
|----------|-------|---------------|
| D1 — Domínio Conceitual | **3** | Quatro bounded contexts por domínio de negócio (não por camada técnica). Glossário com 15+ termos específicos ao NovaTech, cada um com definição precisa, exemplo de uso, fonte no Anexo A, conflitos conhecidos e aviso de confusão para LLM. A distinção entre "Coexistência de Versões" (nenhuma foi arquivada) vs. "versão desatualizada" demonstra nuance real de domínio. |
| D2 — Uso de Ferramentas | **2** | Iteração com Claude (como Tech Lead) bem documentada: prompt estruturado, 5 achados reais com tipo/localização/descrição/correção, checklist pós-iteração, resultado marcado. Porém, Claude Design não foi evidenciado — o arquivo de mockup contém ASCII art com nota explícita de que "devem ser reproduzidos no Claude Design para visualização final", indicando que essa etapa não foi concluída. |
| D3 — Qualidade do Entregável | **3** | `requirements.md` com 5 seções completas; outcomes orientados a resultado ("atendente responde em < 30s", não "endpoint retorna JSON"); 17 verification criteria específicos e testáveis; scope boundaries diretamente derivados dos bounded contexts. Qualquer membro do time usaria este documento sem pedir esclarecimentos. |
| D4 — Pensamento Crítico | **3** | Identificação proativa de 5 limitações reais: responsável pela atualização da base não especificado, threshold RAG sem valor concreto, termo "Valor Base" ausente do glossário, PROC-043 não disponível na base, regra de uso do FAQ ambígua. Os avisos "⚠️ Confusão para LLM" no glossário demonstram análise honesta dos riscos de interpretação do agente. |
| D5 — Aplicabilidade ao Projeto | **3** | Tabela de Prior Decisions referencia 6 ADRs do cenário 1 com impacto explícito em cada constraint. O ADR-0006 (threshold 0.75) foi criado durante a iteração como decisão derivada da spec — mostra que a conexão vai além de citação passiva. Termos do glossário referenciam seções específicas de POL-001, SLA-2024 e PROC-042. |

**Score do exercício: 2.8**

---

## Verificação de Artefatos Machine-Readable

Não aplicável como critério primário neste exercício (PS 2.1 não exige AGENTS.md ou skill). O `requirements.md` adota formato SDD estruturado que agentes conseguem processar: constraints em tabela indexada (C1–C9), verification criteria com IDs únicos (VC-F01, VC-R04), prior decisions com referências a ADRs. O glossário tem campos consistentes (`Definição`, `Documentado em`, `Conflitos conhecidos`) que permitem parsing.

---

## Pontos Fortes

1. **Glossário como ferramenta de engenharia de prompt** — Os avisos "⚠️ Confusão para LLM" em 7 termos mostram que o participante pensou no glossário não apenas como documentação, mas como instrução direta para o comportamento do agente. Isso é raro e valioso.

2. **Iteração genuína com evidência de mudança** — A iteração com o Tech Lead produziu mudanças estruturais (novo ADR-0006, novo constraint C9, novo VC-F07, nova entrada no glossário), não ajustes cosméticos. O documento `iteracao-tech-lead.md` serve como rastreabilidade completa da evolução da spec.

3. **Scope boundaries coerentes com bounded contexts** — O "Está fora do escopo" do `requirements.md` deriva diretamente do "Está fora" de cada bounded context. Há consistência end-to-end: context → scope → verification criteria.

---

## Pontos de Melhoria

1. **Claude Design não foi executado** — Os mockups em ASCII são funcionalmente ricos (3 cenários, princípios de design, mapeamento a requirements), mas faltou a etapa de visualização no Claude Design. Para completar: abrir o Claude Design, importar os cenários ASCII como referência, e gerar versão visual. O arquivo já tem paleta de cores e tipografia definidas — é uma questão de executar.

2. **ADR-0002 (context budget) ausente nos mockups** — O `requirements.md` cita ADR-0002, mas o impacto do context budget (~8K chunks por query) não está refletido como constraint explícita no layout. O constraint C1 faz referência indireta via "resposta < 30s", mas poderia ser mais explícito na decisão de design ("cabe em tela sem scroll").

3. **Verification criteria de confiabilidade carecem de mecanismo de execução** — VC-R01 ("em 20 perguntas aleatórias, nunca inventa valor") é testável em conceito, mas não especifica como o QA obtém as 20 perguntas nem qual é a fonte de verdade para verificação. Uma referência ao corpus de testes ou mecanismo de amostragem tornaria o critério diretamente executável.

---

## Classificação

> **✅ Aprovado com distinção — Score 2.8**

A lacuna do Claude Design impede o 3.0, mas não compromete a usabilidade dos artefatos. O entregável está pronto para uso pelo desenvolvedor e QA sem necessidade de iteração adicional.

---

## Tópicos da Trilha para Reforço

Score > 2.5 — nenhum tópico de revisão obrigatório.

**Recomendação opcional:** executar a etapa do Claude Design para completar o exercício conforme enunciado, usando os mockups ASCII já produzidos como referência fiel.
