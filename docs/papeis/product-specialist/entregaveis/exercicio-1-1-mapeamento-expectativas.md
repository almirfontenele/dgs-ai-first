# Exercício 1.1 — Mapeamento de Expectativas vs. Realidade do Produto

**Projeto:** Assistente de IA para Atendimento — NovaTech  
**Elaborado por:** Product Specialist (DB1)  
**Data:** 2026-05-29  
**Versão:** 1.0

---

## 1. Contexto da Análise

O risco mais crítico em um projeto de IA é o **gap de expectativas**. A diretoria da NovaTech espera um assistente que "saiba tudo" e permita aos atendentes "não procurar mais nada manualmente". LLMs com RAG são sistemas probabilísticos: respondem com base no que foi indexado, com qualidade dependente dos dados, com respostas que podem ser incorretas, e com comportamentos que nem sempre são previsíveis.

Este exercício mapeia as expectativas documentadas contra o que é tecnicamente realizável e propõe uma **narrativa clara de valor e limitações** que alinhe a diretoria, o time de engenharia e os atendentes.

---

## 2. Expectativas Documentadas vs. Realidade

### 2.1 Expectativa: "O Assistente Saiba Tudo"

**Expectativa Original:**  
A diretoria da NovaTech expressou que o assistente deveria ser uma "enciclopédia viva" da empresa, capaz de responder qualquer pergunta que um atendente fizesse sobre procedimentos, SLA, políticas de frete e devolução.

| Aspecto | Expectativa | Realidade Técnica | Risco |
|---------|-------------|-------------------|-------|
| **Cobertura** | "Qualquer pergunta sobre a empresa" | Apenas informações indexadas na base | O assistente responde "não encontrei" para fatos fora da base documentada |
| **Precisão** | "100% de acurácia" | ~85-90% em contexto bem definido | 1 em 10-15 respostas pode estar imprecisa |
| **Velocidade** | "Instantâneo" | 2-5 segundos por query (latência de rede + LLM) | Integração Teams esperará notavelmente mais que pesquisa Google |
| **Atualização** | "Reflete documentação vigente em tempo real" | Re-indexação manual ou agendada em ciclos (< 24h) | Atendentes podem usar informação até 24h defasada |

**Mitigação:**  
Conversa de alinhamento de expectativas: "O assistente não inventa respostas — ele busca e sintetiza o que está documentado. Se algo não está na base, ele dirá explicitamente. Isso é uma força, não uma limitação: significa que você pode confiar nas respostas que ele dá."

**Critério de Sucesso:**  
Apresentar na sessão de expectativas: 70% das perguntas respondidas com citação de fonte verificável em até 30 segundos. Documentar formalmente no termo de abertura.

---

### 2.2 Expectativa: "Os Atendentes Não Precisam Mais Procurar Nada"

**Expectativa Original:**  
A redução do tempo de busca de 12 minutos para < 2 minutos foi prometida como resultado direto da adoção do assistente.

| Aspecto | Expectativa | Realidade Técnica | Risco |
|---------|-------------|-------------------|-------|
| **Tempo de Resposta** | "< 2 min sem exceção" | 2-5 segundos de latência; busca manual ainda será necessária em ~15-20% das queries | Nem todas as perguntas serão respondidas rapidamente |
| **Cobertura de Uso** | "100% dos chamados usarão o assistente" | Assistente útil em 70-80% dos casos; 20-30% requerem julgamento humano ou informação fora da base | Atendentes continuarão pesquisando manualmente em cenários específicos |
| **Eliminação de Pesquisa Manual** | "Nenhuma necessidade de abrir documentos" | Atendentes ainda precisarão consultar documentos originais em 10-15% dos casos | Pesquisa manual não será eliminada, apenas reduzida |

**Mitigação:**  
Reframing: O objetivo é **reduzir o tempo total de busca e aumentar a confiabilidade das respostas**, não eliminar completamente a pesquisa manual. Comunicar: "O assistente é um primeiro filtro que resolve 70-80% das consultas rapidamente. Para os 20-30% restantes, você terá clareza sobre qual documento específico consultar — em vez de procurar em 1.250 fontes."

**Critério de Sucesso:**  
Tempo médio de busca reduzido de 12 minutos para < 3 minutos (redução de 75%, não 83%). Percentual de casos onde o assistente responde completamente (sem pesquisa adicional): 70-80%.

---

### 2.3 Expectativa: "Respostas Sempre Baseadas em Documentos Vigentes"

**Expectativa Original:**  
A diretoria espera que o assistente nunca responda com informação desatualizada ou contradita por versões mais novas de documentos.

| Aspecto | Expectativa | Realidade Técnica | Risco |
|---------|-------------|-------------------|-------|
| **Versioning** | "O assistente sempre usa a versão vigente de um documento" | Pipeline de RAG recupera baseado em similaridade semântica, não em metadata de data | Se PROC-042 v1 e v2 estiverem ambas indexadas, o sistema pode recuperar a errada |
| **Contradições Documentais** | "Não há contradições na base" | NovaTech possui PROC-042/PROC-042-v2 com multiplicadores diferentes | Assistente pode gerar resposta híbrida ou escolher arbitrariamente |
| **Tempo de Atualização** | "Mudanças refletem instantaneamente" | Re-indexação leva 2-24 horas | Novo documento está in-service mas não indexado — assistente ainda responde com versão antiga |

**Mitigação:**  
Como pré-condição para go-live: (1) Resolver formalmente todas as contradições documentadas na NovaTech antes da ingestão; (2) Implementar metadados de vigência no pipeline (data de vigência obrigatória para novos documentos); (3) Comunicar aos atendentes: "Se você vê um documento com data de vigência mais recente que a citada na resposta do assistente, use o documento mais novo."

**Critério de Sucesso:**  
100% de documentos-fonte com metadata de vigência explícita antes de go-live. Taxa de escaladas por "resposta desatualizada" < 2%.

---

### 2.4 Expectativa: "Sem Esforço Adicional de Documentação"

**Expectativa Original:**  
A diretoria assumiu que o sistema funcionaria com a documentação existente, sem necessidade de curadores ou processos de limpeza.

| Aspecto | Expectativa | Realidade Técnica | Risco |
|---------|-------------|-------------------|-------|
| **Qualidade da Base** | "PDFs, Confluence, planilhas funcionam como-estão" | Extração de tabelas em PDFs, OCR em scans, parsing de fórmulas em XLSX requerem pipelines especializados | Documentação mal extraída contamina as respostas |
| **Manutenção Contínua** | "Nenhuma curadoria necessária após go-live" | Base documental envelhece (documentos desatualizado) e sofre drift | Qualidade degrada sem ciclo formal de revisão documental |
| **Responsabilidade** | "DB1 mantém o sistema funcionando" | Qualidade da base é responsabilidade do cliente | Sem proprietário dentro da NovaTech, documentação fica obsoleta rapidamente |

**Mitigação:**  
Sessão de kickoff com sponsor da NovaTech: propor modelo de "curador de documentação" (responsável dentro da NovaTech de manter a base atualizada, sinalizando documentos obsoletos, resolvendo contradições). Incluir nos entregáveis V1: guia de proprietário de documentação com processo de atualização.

**Critério de Sucesso:**  
Nomeação de curador responsável antes de go-live. Processo documentado de re-indexação de novos documentos (ciclo: submissão → validação → indexação).

---

## 3. Matriz de Conversação: Como Alinhar Cada Stakeholder

### 3.1 Conversa com a Diretoria (Sponsor)

**Contexto:** Diretoria espera "tudo resolvido" e avaliará sucesso por adoção imediata.

**Pontos-Chave:**
1. **O que o assistente faz bem:** Busca e sintetiza informação documentada em segundos; aumenta confiabilidade das respostas (todas citam fonte).
2. **O que o assistente não faz:** Não inventa respostas; não julga casos que requerem contexto; não atualiza documentação automaticamente.
3. **Valor mensurado:** Redução de 75% no tempo de busca (de 12 para < 3 minutos) + 70-80% de respostas completas sem pesquisa adicional.

**Proposta de Comunicação:**
> "O Assistente de IA NovaTech é um 'mecanismo de busca inteligente' para a empresa — como Google, mas treinado apenas em sua documentação oficial. Ele responde em segundos o que levaria minutos de busca manual. Não inventa: se algo não está documentado, ele diz 'não encontrei'. Isso garante que você confia nas respostas que recebe.
>
> Nossa métrica de sucesso é clara: 70-80% dos chamados resolvidos mais rápido com o assistente. Os 20-30% restantes são casos que ainda exigem julgamento humano — normal em atendimento de clientes.
>
> Para manter isso funcionando bem, a NovaTech nomeará um curador de documentação responsável de manter a base atualizada. Essa é a chave para que o assistente continue confiável ao longo do tempo."

**Próximo Passo:** Formal agreement assinado antes do kickoff, mencionando: métricas de sucesso, responsabilidades (DB1: técnica; NovaTech: curadoria documental), pré-condições (resolução de contradições).

---

### 3.2 Conversa com Atendentes (Usuários Finais)

**Contexto:** Atendentes têm medo de mudança ("vai tirar meu trabalho?") e desconfiança de IA ("vai me dar resposta errada?").

**Pontos-Chave:**
1. **Para você muda o quê?** Tempo de busca cai de 12 para < 3 minutos; maior confiança nas respostas (sempre citadas).
2. **Qual é o risco para você?** Você é responsável de validar a resposta antes de passar ao cliente — o assistente te ajuda a procurar, não decide por você.
3. **Como você usa?** Pergunta ao bot no Teams em linguagem natural; se ele não encontrar, ele diz; você consulta documentos ou pede orientação ao supervisor.

**Proposta de Comunicação:**
> "O novo assistente é seu colega de busca. Quando você tem uma dúvida, você pergunta a ele em linguagem natural (ex: 'qual é o prazo de devolução para eletrônicos?'). Ele busca na documentação oficial e te dá a resposta com a fonte — tudo em alguns segundos.
>
> Você continua sendo responsável de validar: se a resposta fizer sentido, você passa ao cliente. Se não fizer, você avisa o supervisor ou consulta o documento original.
>
> Não vai dar resposta errada com confiança — quando ele não tem certeza, ele diz 'não encontrei essa informação'.
>
> Resultado: você gasta < 3 minutos procurando em vez de 12, e dorme mais tranquilo sabendo que a resposta está fundamentada em um documento oficial."

**Próximo Passo:** Sessão de treinamento prático (30 min) com cada turno de atendimento; demo ao vivo; exercício de feedback inline (👍/👎) dentro do Teams.

---

### 3.3 Conversa com Tech Lead / Engineering

**Contexto:** Tech Lead precisa entender o que é esperado e o que é aceitável para iniciar o desenvolvimento confiante.

**Pontos-Chave:**
1. **Definição de pronto (Definition of Done):** 70-80% das queries respondidas com fonte citada em < 5 segundos; < 5% de escaladas por resposta incorreta em amostragem de 50 casos/semana.
2. **O que não é escopo V1:** Fine-tuning, treinamento customizado, atendimento direto ao cliente, documentos confidenciais.
3. **O que é crítico:** Versionamento de documentos (pré-condição), tratamento de formatos especiais (tabelas, scans, Excel), gerenciamento de contexto em sessões longas.

**Proposta de Comunicação (Briefing Técnico):**
> "V1 é um MVP com focos claros: busca documentada + síntese confiável + rastreabilidade. Não é generalist chatbot.
>
> Escopo técnico não-negociável:
> - RAG com Azure AI Search (vetorial + palavra-chave)
> - Integration Teams (bot)
> - Suporte a PDF (tabelas), Excel (referências), Confluence
> - Temperatura ~0 (determinístico, não criativo)
> - Metadata de vigência obrigatória
>
> Pré-condição NovaTech: conflitos documentados resolvidos (PROC-042/v2) antes da ingestão.
>
> Sucesso medido por: 70-80% queries com fonte, < 5% escaladas por incorreção, < 5s latência. Não é 100% acurácia — é suficiência confiável."

**Próximo Passo:** Checkpoint de design do pipeline (data D+5 do kickoff); prototipagem de tratamento de formatos especiais (D+10).

---

## 4. Checklist de Alinhamento Pré-Kickoff

- [ ] **Sessão de Expectativas com Diretoria:** Data agendada; participantes confirmados (sponsor, CTO, Compliance se houver).
- [ ] **Documento Formal de Acordo:** Assinado pelo sponsor, listando: objetivos, métricas de sucesso, responsabilidades, pré-condições.
- [ ] **Mapeamento de Contradições Documentais:** Lista de documentos conflitantes para a NovaTech resolver antes ou durante discovery.
- [ ] **Definição de Proprietário de Documentação:** Nomeado dentro da NovaTech; responsável por manter a base.
- [ ] **Plano de Habilitação de Atendentes:** Data e formato da sessão de treinamento (presencial, remoto, assíncrono?).
- [ ] **Critérios de Aceitação Formais:** Aprovados pelo sponsor; documentados no PRD e no term de abertura.

---

## 5. Outcome Esperado

Ao final deste exercício, você terá:

1. **Documento de Alinhamento de Expectativas:** 2-3 páginas descrevendo o que o produto faz, não faz, e por quê.
2. **Matriz de Comunicação:** Um template por tipo de stakeholder (sponsor, engenharia, atendentes) pronto para adaptar.
3. **Checklist de Pré-Kickoff:** Artefatos formais a serem coletados antes de iniciar o desenvolvimento.
4. **Documento de Acordo:** Pronto para assinatura, mencionando métricas, pré-condições e responsabilidades.

**Validação:** Sponsor assina o acordo sem solicitações de escopo adicional. Atendentes entendem o que esperar sem desconfiança. Tech Lead inicia com cronograma confiante.
