### QA

#### Exercício 2.1 — Contribuição para o AGENTS.md: seção de Testing Standards

**Contexto:** O Tech Lead pediu que você escreva a seção de padrões de teste do AGENTS.md que todo agente de IA deve seguir ao gerar código de teste.

**Ferramentas a utilizar:** Claude (chat)

**Inputs fornecidos:**
- O cenário completo.
- As decisões técnicas do Tech Lead: *"Vitest para testes unitários e de integração. Mocks com msw (Mock Service Worker) para APIs externas. Testes rodam no CI via GitHub Actions. Coverage mínimo: 80% de linhas."*
- Um exemplo de teste ruim gerado por IA (simulado):
  ```typescript
  // Teste gerado pelo Copilot sem guidance
  test('query endpoint works', async () => {
    const result = await handler({ body: '{"question": "test"}' });
    expect(result).toBeDefined();
  });
  ```

**Tarefa:**
1. Usando o **Claude**, escreva a seção **"Testing Standards"** do AGENTS.md. Inclua:
   - Padrão de nomenclatura de testes (describe/it com frases descritivas em inglês).
   - O que todo teste DEVE ter (arrange/act/assert, assertions específicas).
   - O que todo teste NÃO DEVE ter (acesso a serviços reais, dependência de ordem, assertions vagas).
   - Padrão de mocking (msw para HTTP, factories para dados).
   - Padrão de fixtures (dados reutilizáveis para testes de RAG — perguntas, chunks, respostas esperadas).

2. Reescreva o teste ruim seguindo seus padrões. Mostre antes/depois, explicando cada melhoria.

3. Defina ao menos 3 critérios que um código de teste gerado por IA deve atender para passar no code review de QA.

**Entregável:** A seção Testing Standards do AGENTS.md, o teste reescrito com explicações, e os critérios de review.

**Critérios de avaliação:**
- A seção é prescritiva o suficiente para que o Copilot gere testes melhores.
- O teste reescrito demonstra os padrões na prática.
- Os critérios de review são objetivos (dois QAs chegariam à mesma conclusão).

---

#### Exercício 2.2 — Criação de spec de testes no formato SDD

**Contexto:** No modelo SDD, até o plano de testes deve ser especificado antes de ser implementado. Você precisa escrever a spec de testes para o query endpoint.

**Ferramentas a utilizar:** Claude (chat) + Claude Cowork

**Inputs fornecidos:**
- O cenário completo.
- A documentação da NovaTech (ver **Anexo A**) e os chunks de referência (ver **Anexo B**) — use para criar dados de teste realistas.
- Os requirements.md do query endpoint (simulado):
  ```
  Outcomes:
  - Atendente recebe resposta relevante em < 30s
  - Toda resposta cita ao menos uma fonte
  - Quando confiança é baixa, resposta inclui aviso
  - Cargas perigosas nunca recebem informação de devolução
  
  Verification Criteria:
  - VC-01: Resposta em < 30s para 95% das queries
  - VC-02: 100% das respostas incluem campo source_document
  - VC-03: Queries sobre carga perigosa + devolução retornam negativa explícita
  - VC-04: Queries sem match retornam mensagem padrão de "não encontrado"
  ```

**Tarefa:**
1. Usando o **Claude**, escreva um `test-plan.md` que derive dos verification criteria. Para cada VC: cenários de teste (happy path + edge cases), dados de teste (perguntas + chunks esperados), e critério de aprovação.

2. Inclua testes de robustez da IA: perguntas ambíguas, prompt injection básico, perguntas em idiomas diferentes.

3. Usando o **Claude Cowork**, organize num formato rastreável: ID único por cenário, status, link para VC.

**Entregável:** O test-plan.md, os cenários de robustez, e o artefato organizado pelo Cowork.

**Critérios de avaliação:**
- Cada VC tem ao menos 2 cenários (happy path + edge case).
- Os dados de teste são realistas e do domínio de logística (não são "test" e "hello").
- Os testes de robustez demonstram compreensão de riscos de IA (prompt injection, language confusion).
- O artefato do Cowork é rastreável (teste → VC).

---

#### Exercício 2.3 — Definição de skill de geração de testes

**Contexto:** Você precisa criar a skill que define como testes devem ser gerados para este projeto.

**Ferramentas a utilizar:** Claude (chat) + Claude Cowork

**Inputs fornecidos:**
- O cenário completo.
- O teste ruim e o teste reescrito do exercício 2.1 (referência de anti-padrão e padrão desejado).
- Testing Standards simulados (output do exercício 2.1 — fornecidos para que este exercício seja autossuficiente):
  ```
  Testing Standards (resumo):
  - Nomenclatura: describe('ModuleName', () => { it('should [behavior] when [condition]') })
  - Estrutura: arrange/act/assert explícitos em todo teste.
  - Assertions: específicas ao comportamento, nunca toBeDefined() ou toBeTruthy() sozinhos.
  - Mocking: msw para HTTP externo, factories para dados de teste.
  - Fixtures: /tests/fixtures/ com chunks, queries e expected responses reutilizáveis.
  - Proibido: acesso a serviços reais, dependência de ordem, dados hardcoded.
  ```
- Conceito de skills: *"Skills encapsulam como gerar tipos específicos de outputs. Uma boa skill tem: contexto (quando usar), regras prescritivas, exemplos concretos (DO/DON'T), e anti-padrões."*

**Tarefa:**
1. Usando o **Claude**, crie o SKILL.md para `create-integration-test` (nível Artifact). Inclua:
   - Quando esta skill se aplica (frase-ativação).
   - Template de teste com placeholders.
   - 2 exemplos completos (DO: teste bem escrito; DON'T: teste com problemas comuns de IA).
   - Anti-padrões específicos de testes gerados por IA.
   - Dependências: quais skills Foundation e Domain devem ser lidas antes.

2. Usando o **Claude Cowork**, crie um checklist de revisão de testes verificável em menos de 2 minutos por teste.

**Entregável:** O SKILL.md completo e o checklist de revisão gerado pelo Cowork.

**Critérios de avaliação:**
- A skill é concreta o suficiente para melhorar o output do Copilot.
- Os anti-padrões são reais (coisas que LLMs realmente geram de errado em testes).
- O checklist é rápido e objetivo.
- A skill é consistente com os Testing Standards fornecidos.
