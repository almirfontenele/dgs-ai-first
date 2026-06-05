### PRODUCT SPECIALIST

#### Exercício 2.1 — Recorte de domínio e spec de produto no formato SDD

**Contexto:** Antes de escrever a spec, você precisa recortar o domínio: quais são os bounded contexts do projeto, qual a linguagem ubíqua do domínio de logística que o time (e os agentes) devem usar, e quais são as fronteiras do que o assistente faz e não faz. Depois, você escreve a spec de requisitos do módulo principal usando SDD.

**Ferramentas a utilizar:** Claude (chat) + Claude Design

**Inputs fornecidos:**
- O cenário completo.
- A documentação da NovaTech (ver **Anexo A**) — use para extrair os termos do domínio e identificar os bounded contexts.
- A spec de requisitos de RAG escrita na fase anterior (simulada): *"O assistente responde perguntas sobre SLAs, frete e devoluções. Fontes contraditórias devem mostrar ambas as versões. O assistente nunca inventa informações. Toda resposta cita fonte. Atualização em até 24h."*
- O fluxo SDD: *"requirements.md contém: outcomes, scope boundaries, constraints, prior decisions, verification criteria."*
- Dados do discovery: *"As perguntas mais frequentes caem em 4 categorias: prazos de entrega, regras de frete, política de devolução e SLAs. Em 15% dos casos, a pergunta cruza duas categorias. Os atendentes precisam da resposta em menos de 30 segundos."*
- Conceito de recorte de domínio: *"Bounded contexts definem fronteiras claras entre subdomínios. Linguagem ubíqua é o vocabulário compartilhado que todo membro do time (e todo agente) usa da mesma forma. Para IA, recorte de domínio é especialmente importante porque agentes sem domínio claro geram outputs genéricos."*

**Tarefa:**
1. Usando o **Claude**, faça o recorte de domínio do projeto:
   - Identifique os bounded contexts do assistente NovaTech (ex: "Atendimento ao Cliente", "Gestão Documental", "SLAs e Contratos", "Logística de Frete"). Para cada contexto, defina: o que está dentro, o que está fora, e como se relaciona com os outros.
   - Extraia a linguagem ubíqua do domínio a partir do Anexo A: termos que precisam ser usados de forma consistente por humanos e agentes (ex: "carga perigosa" sempre significa "classes 1-6 da ANTT", "frete especial" sempre significa "acima de 500kg").

2. Usando o **Claude**, escreva o `requirements.md` do query endpoint seguindo a estrutura SDD. As prior decisions devem referenciar as ADRs da fase anterior (simuladas no contexto). Os scope boundaries devem derivar dos bounded contexts definidos acima.

3. Usando o **Claude Design**, crie um mockup da interface de resposta no Teams, coerente com os requirements.

4. Itere: peça ao Claude que atue como Tech Lead e aponte ambiguidades. Ajuste.

**Entregável:** O mapa de bounded contexts com linguagem ubíqua, o requirements.md, o mockup, e o histórico de iteração.

**Critérios de avaliação:**
- Os bounded contexts são coerentes com o domínio de logística (não são divisões técnicas como "frontend/backend").
- A linguagem ubíqua contém termos que um LLM confundiria sem definição explícita (ex: "Gold" é um tier de cliente, não o metal).
- Os outcomes no requirements.md são orientados a resultado do usuário, não a features técnicas.
- Os scope boundaries derivam dos bounded contexts (ex: "este módulo cobre o contexto 'Atendimento ao Cliente' — não cobre 'Gestão Documental' diretamente").
- Os verification criteria são testáveis pelo QA.

---

#### Exercício 2.2 — Definição de guardrails como artefato de produto

**Contexto:** Na fase anterior, você identificou guardrails informais. Agora você precisa formalizá-los como um artefato estruturado consumível por humanos e agentes.

**Ferramentas a utilizar:** Claude (chat)

**Inputs fornecidos:**
- O cenário completo.
- A documentação da NovaTech (ver **Anexo A**) como fonte de verdade para os guardrails.
- Os guardrails informais do cenário 1: *"(1) Sempre citar fonte. (2) Nunca inventar prazos ou valores. (3) Quando não encontrar resposta, dizer explicitamente. (4) Responder em português formal."*
- 3 incidentes simulados onde o assistente falhou durante testes internos:
  1. *"O assistente respondeu que o prazo de devolução para carga perigosa é 7 dias, quando na verdade cargas perigosas NÃO podem ser devolvidas."*
  2. *"O assistente citou 'PROC-042, seção 2' mas os multiplicadores informados eram da versão 1 (desatualizada), não da v2 (vigente)."*
  3. *"O assistente disse 'Não encontrei informação sobre isso' para uma pergunta sobre SLA Gold, mas o documento SLA-2024 estava indexado e continha a resposta."*

**Tarefa:**
1. Usando o **Claude**, elabore um documento de guardrails organizado em:
   - **DEVE** (comportamentos obrigatórios).
   - **NÃO DEVE** (comportamentos proibidos).
   - **QUANDO EM DÚVIDA** (comportamentos de fallback).

2. Para cada guardrail, classifique como: enforcement via prompt (probabilístico) ou enforcement via código (determinístico). Justifique.

3. Conecte cada guardrail a ao menos um dos 3 incidentes (qual incidente esse guardrail previne?).

**Entregável:** O documento de guardrails completo, com classificação de enforcement e rastreabilidade aos incidentes.

**Critérios de avaliação:**
- Os guardrails são específicos ao domínio da NovaTech, não genéricos.
- A classificação prompt vs código demonstra compreensão de que prompts são probabilísticos e código é determinístico.
- Cada guardrail é rastreável a um risco concreto (incidente).

---

#### Exercício 2.3 — Participação na construção do AGENTS.md do projeto

**Contexto:** O Tech Lead está montando o AGENTS.md e pediu que cada papel contribua com sua seção.

**Ferramentas a utilizar:** Claude (chat)

**Inputs fornecidos:**
- O cenário completo.
- A documentação da NovaTech (ver **Anexo A**) e a estrutura do repositório (ver **Anexo C**).
- A estrutura do AGENTS.md (mesma do DM 2.3).
- Guardrails formalizados simulados (output do exercício 2.2 — fornecidos para que este exercício seja autossuficiente):
  ```
  DEVE:
  - Citar fonte com identificador do documento e seção em toda resposta.
  - Incluir campo source_document no JSON de retorno, mesmo com confiança baixa.
  - Responder em português formal.
  
  NÃO DEVE:
  - Gerar valores numéricos (prazos, multiplicadores, SLAs) que não estejam
    literalmente na documentação indexada.
  - Afirmar que carga perigosa (classes 1-6 ANTT) pode ser devolvida
    pelo processo padrão.
  - Inventar tiers de cliente (só existem Gold, Silver, Standard).
  
  QUANDO EM DÚVIDA:
  - Prefixar resposta com aviso de baixa confiança.
  - Sugerir escalação ao supervisor.
  - Se duas versões de um documento existirem, priorizar a mais recente
    e informar que existe versão anterior.
  ```

**Tarefa:**
Usando o **Claude** e referenciando os Anexos A e C, escreva a seção **"Product Rules & Guardrails"** do AGENTS.md. Ela deve conter:

1. Regras de comportamento do assistente (derivadas dos guardrails simulados acima).
2. Glossário de linguagem ubíqua do domínio que os agentes precisam conhecer (ex: "cliente Gold", "carga perigosa", "SLA de resolução", "multiplicador regional", "frete especial").
3. Restrições que impactam geração de código (ex: "toda resposta DEVE incluir o campo `source_document` no JSON de retorno").
4. Referências a documentos de spec no repositório.

**Entregável:** A seção do AGENTS.md pronta para ser adicionada ao repositório.

**Critérios de avaliação:**
- A seção é machine-readable.
- As regras são prescritivas (DEVE/NÃO DEVE).
- O glossário é útil (termos que um LLM confundiria sem contexto de domínio).
- As restrições de código são concretas o suficiente para influenciar o output do Copilot.
