# Tarefa 2.1.2 — Extrair Linguagem Ubíqua do Domínio

## Objetivo
Extrair da documentação da NovaTech os termos e conceitos que precisam ser usados **consistentemente** por humanos e agentes, e definir o que cada termo significa de forma inequívoca.

## O Que É Linguagem Ubíqua?
Linguagem ubíqua (ubiquitous language) é o vocabulário compartilhado que:
- Está **no código**, **na documentação**, **nos prompts** e **nas conversas**
- É entendido da **mesma forma** por Product Manager, Desenvolvedor e Agentes de IA
- Evita ambiguidades que confundem LLMs

**Exemplo:** "Carga perigosa"
- ❌ Errado (genérico): "Algo perigoso"
- ✓ Correto (específico): "Classes 1-6 da ANTT, conforme PROC-042, que não podem ser devolvidas pelo processo padrão"

## Tarefa

### Passo 1: Leitura da Documentação
Leia o Anexo A (documentação da NovaTech) e identifique:

1. **Termos explícitos** — palavras que aparecem repetidas na documentação
   - Ex: "SLA", "multiplicador", "frete especial", "cliente Gold"

2. **Conceitos implícitos** — ideias que não têm nome formal mas precisam de definição
   - Ex: "região com restrição", "ordem com precedência", "cliente estratégico"

3. **Termos que um LLM confundiria** — conceitos que têm significados diferentes fora do domínio
   - Ex: "Gold" = tier de cliente (não o metal)
   - Ex: "Standard" = nível de serviço (não algo genérico)

### Passo 2: Estruturar o Glossário
Para cada termo, crie uma entrada com:

```markdown
## [Termo]

**Definição:** Uma frase clara e inequívoca

**Exemplo de uso:** Uma frase mostrando como o termo é usado no contexto

**Está documentado em:** Referência ao Anexo A (ex: "PROC-042, seção 2")

**Conflitos conhecidos:** Se houver ambiguidade ou versionamento (ex: PROC-042 v1 vs v2)

**Relacionado a:** Outros termos que dependem desta definição
```

### Passo 3: Organizar por Bounded Context
Agrupe os termos por bounded context (resultado da tarefa 2.1.1):
- Quais termos pertencem a "Atendimento ao Cliente"?
- Quais a "Logística de Frete"?
- Etc.

### Passo 4: Validação
Para cada termo, valide:
- [ ] A definição é específica o suficiente para um LLM não confundir?
- [ ] Está documentado em ao menos uma fonte (Anexo A)?
- [ ] Está relacionado a um bounded context específico?
- [ ] Possui exemplos de uso claros?

## Entregável
Um documento `linguagem-ubiqua.md` com:
- Glossário completo de termos por bounded context
- Termos que um LLM confundiria (com avisos)
- Exemplos de uso correto/incorreto
- Referências cruzadas aos documentos de origem

## Critério de Sucesso
Ao ler o glossário, um developer pode escrever um prompt sem errar terminologia, e um QA pode validar se o assistente está usando os termos corretamente.
