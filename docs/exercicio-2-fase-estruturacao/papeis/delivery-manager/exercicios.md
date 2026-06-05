### DELIVERY MANAGER

#### Exercício 2.1 — Definição do workflow de desenvolvimento AI First

**Contexto:** Você precisa definir como o time vai trabalhar no modelo AI First: quais ferramentas cada papel usa, qual o fluxo de trabalho, e quais são os checkpoints humanos (validation gates).

**Ferramentas a utilizar:** Claude (chat) + Claude Cowork

**Inputs fornecidos:**
- O cenário completo acima.
- Uma lista das ferramentas disponíveis no projeto:
  - GitHub Copilot (ativo para todos os devs e Tech Lead)
  - Claude (disponível para todo o time)
  - Claude Cowork (disponível para papéis não-dev)
  - Claude Design (disponível para Product Specialist)
  - Azure DevOps para boards e tracking
  - GitHub para repositório e CI/CD

**Tarefa:**
1. Usando o **Claude**, elabore um fluxo de trabalho que mapeie, para cada papel do time, quais ferramentas de IA usa e em qual etapa do ciclo (Spec → Plan → Tasks → Implement → Review → Deploy).

2. Usando o **Claude Cowork**, crie um template de checklist de validation gates — pontos onde um humano obrigatoriamente revisa e aprova antes de avançar. O checklist deve incluir ao menos:
   - Gate entre Spec e Plan (quem aprova a spec antes de gerar o plano?)
   - Gate entre Tasks geradas por IA e início de implementação (quem valida que as tasks fazem sentido?)
   - Gate entre código gerado por agente e merge (quem faz code review?)
   - Gate entre testes gerados por IA e deploy (quem valida que os testes são suficientes?)

3. Para cada gate, defina: quem aprova, o que verifica, quanto tempo tem, e o que acontece se reprovar.

**Entregável:** O fluxo de trabalho, o checklist de validation gates gerado pelo Cowork, e evidência do uso das ferramentas.

**Critérios de avaliação:**
- O fluxo reconhece que diferentes papéis usam diferentes ferramentas (Copilot para devs, Cowork para gestão, Design para produto).
- Os validation gates são específicos o suficiente para serem executáveis (não são genéricos como "revisar antes de continuar").
- O checklist inclui critérios concretos de aprovação para cada gate (ex: "a spec deve ter critérios de aceite verificáveis para cada requisito").
- O fluxo equilibra velocidade (IA gera) com segurança (humano valida).

---

#### Exercício 2.2 — Governança de specs no modelo SDD

**Contexto:** O time vai usar Spec Driven Development. Specs não são documentos passivos — são contratos executáveis. Você precisa definir como specs são criadas, aprovadas, versionadas e rastreadas.

**Ferramentas a utilizar:** Claude (chat) + Claude Cowork

**Inputs fornecidos:**
- O cenário completo.
- A estrutura do repositório do projeto (ver **Anexo C**) — as specs devem seguir a organização de diretórios definida.
- O fluxo SDD simplificado: *"requirements.md define o que precisa ser feito. plan.md define como será feito. tasks.md decompõe em unidades atômicas executáveis por agentes. Cada transição (requirements → plan → tasks) é um checkpoint humano."*
- Uma lista dos módulos do projeto que precisarão de specs:
  1. Pipeline de ingestão de documentos
  2. API de busca (query endpoint)
  3. API de feedback (atendente reporta resposta incorreta)
  4. Bot do Teams (interface conversacional)
  5. Painel web (dashboard de métricas e histórico)

**Tarefa:**
1. Usando o **Claude**, defina um processo de governança de specs que cubra: quem cria cada tipo de spec (requirements pelo Product Specialist, plan pelo Tech Lead, tasks pelo Dev com apoio do Copilot), como as specs são nomeadas e versionadas, onde ficam no repositório, e como mudanças são rastreadas.

2. Usando o **Claude Cowork**, crie um board de tracking (template de kanban ou tabela) que permita acompanhar o status de cada spec: Rascunho → Em Revisão → Aprovada → Em Implementação → Validada. Inclua os 5 módulos como itens iniciais.

3. Defina o que acontece quando uma spec precisa mudar depois de já estar em implementação (change management).

**Entregável:** O documento de governança, o board de tracking gerado pelo Cowork, e o processo de change management.

**Critérios de avaliação:**
- O processo reconhece que specs são artefatos vivos que evoluem (não são documentos estáticos escritos uma vez).
- O board é prático e permite que qualquer membro do time veja o status atual de cada spec.
- O processo de change management é explícito sobre quem pode alterar, quem precisa aprovar, e como isso afeta tasks já em andamento.
- A atribuição de responsabilidades por papel é coerente com as competências de cada um.

---

#### Exercício 2.3 — Participação na construção do AGENTS.md do projeto

**Contexto:** O Tech Lead está montando o AGENTS.md do repositório e pediu que cada papel contribua com a seção que lhe diz respeito.

**Ferramentas a utilizar:** Claude (chat)

**Inputs fornecidos:**
- O cenário completo.
- A estrutura do repositório (ver **Anexo C**).
- A estrutura do AGENTS.md proposta pelo Tech Lead:
  ```
  # AGENTS.md — NovaTech Assistant
  ## Project Overview
  ## Tech Stack & Architecture
  ## Coding Standards (Tech Lead)
  ## Product Rules & Guardrails (Product Specialist)
  ## Testing Standards (QA)
  ## Project Management Rules (Delivery Manager)
  ## Build & Deploy
  ```
- Validation gates simulados (output do exercício 2.1 — fornecidos para que este exercício seja autossuficiente):
  ```
  Gate 1 — Spec → Plan: PS aprova requirements.md antes do TL gerar o plan.
  Gate 2 — Tasks → Implement: TL aprova tasks.md antes do Dev iniciar.
  Gate 3 — Code → Merge: TL faz code review; PR precisa de 1 approval.
  Gate 4 — Tests → Deploy: QA valida cobertura e cenários; TL aprova deploy.
  ```

**Tarefa:**
Usando o **Claude** e referenciando o **Anexo C** para caminhos corretos, escreva a seção **"Project Management Rules"** do AGENTS.md. Esta seção será lida por agentes de IA quando gerarem artefatos de gestão, tasks, ou documentação. Ela deve conter:

1. Regras de nomenclatura de tasks e issues (ex: formato do título, labels obrigatórias).
2. Regras de documentação de decisões (ex: toda decisão técnica ou de escopo deve ser registrada como ADR em `/docs/adr/`).
3. Definição dos validation gates em formato consumível por agentes.
4. Restrições de comunicação que afetam geração de artefatos (ex: "documentos de status devem ser em português, código e comments em inglês").

**Entregável:** A seção do AGENTS.md pronta para ser adicionada ao repositório, com evidência do uso do Claude.

**Critérios de avaliação:**
- A seção é machine-readable (um agente de IA consegue parseá-la e seguir as instruções).
- As regras são prescritivas, não descritivas (dizem o que fazer, não o que é).
- As regras são consistentes com os validation gates fornecidos.
- A seção não é genérica — contém referências específicas ao projeto NovaTech.
