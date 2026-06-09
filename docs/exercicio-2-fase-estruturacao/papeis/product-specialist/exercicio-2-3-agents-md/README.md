# Exercício 2.3 — Participação na Construção do AGENTS.md do Projeto

## Contexto
O Tech Lead está montando o `AGENTS.md` e pediu que cada papel contribua com sua seção. O seu papel (Product Specialist) é escrever a seção **"Product Rules & Guardrails"** que será consumida por desenvolvedores e agentes de IA.

## Ferramentas a Utilizar
- Claude (chat)

## Inputs Fornecidos

### Documentação de Referência
- Documentação da NovaTech (ver **Anexo A**)
- Estrutura do repositório (ver **Anexo C**)
- Guardrails formalizados simulados (saída do exercício 2.2)

### Guardrails Simulados
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

## Tarefas

Cada tarefa está documentada em sua pasta correspondente:

1. **[Tarefa 2.3.1](tarefas/2-3-1-escrever-product-rules.md)** — Escrever seção "Product Rules & Guardrails"
2. **[Tarefa 2.3.2](tarefas/2-3-2-criar-glossario.md)** — Criar glossário de linguagem ubíqua
3. **[Tarefa 2.3.3](tarefas/2-3-3-definir-restricoes-codigo.md)** — Definir restrições que impactam código
4. **[Tarefa 2.3.4](tarefas/2-3-4-adicionar-referencias.md)** — Adicionar referências a documentos de spec

## Entregáveis

Ao final do exercício, você terá:
- [ ] Seção "Product Rules & Guardrails" formatada para AGENTS.md
- [ ] Glossário de linguagem ubíqua (machine-readable)
- [ ] Restrições de código com exemplos de implementação
- [ ] Referências cruzadas a arquivos de spec no repositório

## Critérios de Avaliação

- ✓ A seção é machine-readable (estrutura clara, fácil de parsear)
- ✓ As regras são prescritivas (DEVE/NÃO DEVE com exemplos)
- ✓ O glossário contém termos que um LLM confundiria sem contexto
- ✓ As restrições de código são concretas o suficiente para influenciar outputs do Copilot
