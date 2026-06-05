### TECH LEAD

#### Exercício 2.1 — Construção e teste do AGENTS.md do projeto

**Contexto:** Você é responsável por montar o AGENTS.md do repositório — o documento que todo agente de IA (Copilot, Claude Code) lê antes de gerar qualquer artefato no projeto. As decisões técnicas vêm das ADRs produzidas na fase anterior.

**Ferramentas a utilizar:** Claude (chat) + GitHub Copilot

**Inputs fornecidos:**
- O cenário completo.
- A estrutura do repositório (ver **Anexo C**).
- As decisões técnicas das ADRs da fase anterior (simuladas):
  - TypeScript com strict mode.
  - Azure Functions v4 com HTTP triggers.
  - Zod para validação de input/output.
  - Vitest para testes.
  - pino para logging (nunca console.log).
  - Conventional Commits para mensagens de commit.
  - Branch strategy: feature branches com PR obrigatório para main.
  - Context budget: ~4K tokens system prompt + ~8K chunks por query (ADR-0002).
  - Documentos contraditórios: metadado de vigência, priorizar mais recente (ADR-0003).
- A especificação do AGENTS.md: *"O AGENTS.md é a constitution do projeto: contém decisões duráveis que todo agente e toda spec devem respeitar. Funciona como contrato entre humanos e agentes."*

**Tarefa:**
1. Usando o **Claude**, escreva o AGENTS.md completo do projeto, incluindo as seções: Project Overview, Tech Stack & Architecture, Coding Standards, Build & Deploy. Inclua na seção de Architecture as regras de gerenciamento de contexto derivadas da ADR-0002. (As seções de Product Rules, Testing Standards e Project Management serão escritas pelos outros papéis.)

2. Usando o **GitHub Copilot**, teste o AGENTS.md: com o arquivo presente no repositório, peça ao Copilot que gere (a) uma Azure Function endpoint, (b) um teste para esse endpoint. Observe se o Copilot segue as convenções definidas.

3. Documente o que o Copilot seguiu e o que ignorou. Para cada item ignorado, reescreva a seção relevante para ser mais prescritiva e teste novamente.

**Entregável:** O AGENTS.md v1, os outputs do Copilot, a análise do que foi seguido/ignorado, o AGENTS.md v2 (iterado), e os outputs da segunda rodada.

**Critérios de avaliação:**
- O AGENTS.md é prescritivo (instruções que um agente consegue seguir, não descrição do projeto).
- As regras de gerenciamento de contexto da ADR-0002 estão incorporadas (context budget, limites por query).
- O teste com Copilot é real (evidência de outputs).
- A iteração v1 → v2 mostra melhoria concreta.
- A análise reconhece limitações (nem tudo será seguido — e isso é esperado).

---

#### Exercício 2.2 — Arquitetura de MCP para o projeto

**Contexto:** Você precisa definir a arquitetura de MCP do projeto: quais servers, quais permissões, como monitorar, e como o time é notificado de mudanças.

**Ferramentas a utilizar:** Claude (chat) + GitHub Copilot

**Inputs fornecidos:**
- O cenário completo.
- O mapeamento de MCP do desenvolvedor (simulado): *"Servers identificados: (1) GitHub — read code, create PR. (2) Azure AI Search — read index, query. (3) Azure OpenAI — completion API. (4) Confluence NovaTech — read pages. (5) Azure DevOps — read/write work items."*
- Conceito de MCP architecture: *"MCP servers devem ser gerenciados como infraestrutura: versionados, monitorados, com permissões mínimas. O Tech Lead decide quais servers são autorizados e quais tools cada server expõe."*

**Tarefa:**
1. Usando o **Claude**, produza um documento de arquitetura de MCP que cubra:
   - Diagrama dos servers e suas conexões com os agentes (quem consome o quê).
   - Política de aprovação: como um novo MCP server é adicionado ao projeto.
   - Monitoramento: como saber se um MCP server parou de funcionar ou retorna dados incorretos.
   - Versionamento: como garantir que uma mudança no MCP server não quebre agentes existentes.

2. Usando o **GitHub Copilot**, crie um script de health check que verifica se todos os MCP servers configurados estão respondendo.

3. Defina o que acontece quando um MCP server fica indisponível durante o desenvolvimento.

**Entregável:** O documento de arquitetura, o script de health check gerado com o Copilot, e o plano de contingência.

**Critérios de avaliação:**
- A arquitetura trata MCP servers como infraestrutura gerenciada (não como configuração ad-hoc).
- A política de aprovação equilibra agilidade com segurança.
- O script de health check é funcional e demonstra uso efetivo do Copilot.
- O plano de contingência é realista (agente degradado é melhor que agente quebrado).

---

#### Exercício 2.3 — Criação e teste de skills técnicas

**Contexto:** Você precisa criar as skills técnicas do projeto que vão garantir que o Copilot gere código consistente com os padrões definidos.

**Ferramentas a utilizar:** Claude (chat) + GitHub Copilot

**Inputs fornecidos:**
- O cenário completo.
- A estrutura do repositório (ver **Anexo C**) — as skills devem seguir a hierarquia de diretórios definida em `/skills/`.
- A árvore de skills proposta pelo desenvolvedor (simulada):
  ```
  Foundation:
  ├── typescript-conventions (strict mode, imports, naming)
  ├── error-handling (custom errors, logging, retry)
  └── project-structure (folders, modules, exports)
  
  Domain:
  ├── azure-functions-endpoint (HTTP trigger pattern)
  ├── azure-ai-search-integration (query, index management)
  ├── react-components (painel web patterns)
  └── testing-patterns (Vitest, mocks, fixtures)
  
  Artifact:
  ├── create-rag-endpoint (receita completa)
  ├── create-integration-test (receita completa)
  └── create-react-card (receita completa)
  ```

**Tarefa:**
1. Usando o **Claude**, escreva o SKILL.md completo para a skill `azure-functions-endpoint` (Domain level). Inclua: contexto, regras prescritivas, exemplos de código (DO/DON'T), anti-padrões comuns, e dependências.

2. Usando o **GitHub Copilot**, teste a skill: com o SKILL.md no repositório, peça ao Copilot que gere um endpoint. Avalie se seguiu as regras.

3. Itere: reescreva seções que o Copilot não seguiu. Teste novamente.

4. Defina critérios para "skill madura": quando está pronta para uso pelo time.

**Entregável:** O SKILL.md, os outputs do Copilot (antes e depois), e os critérios de maturidade.

**Critérios de avaliação:**
- O SKILL.md é prescritivo e concreto (exemplos de código reais).
- A iteração mostra que skills precisam de refinamento baseado em teste real.
- Os critérios de maturidade são práticos e mensuráveis.
- O participante demonstra que skills são artefatos vivos.
