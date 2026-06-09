# Tarefa 2.1.5 — Iteração: Aponte Ambiguidades e Ajuste

## Objetivo
Usar Claude como Tech Lead para revisar seu trabalho (tarefas 2.1.1 a 2.1.4), apontar ambiguidades, e iterativamente melhorar até que não haja lacunas ou contradições.

## Contexto
Após escrever mapa de bounded contexts, glossário, requirements e mockups, é comum haver:
- **Lacunas:** Algo que se assumiu mas não está definido
- **Contradições:** Uma tarefa diz X, outra diz Y
- **Ambiguidades:** Um termo poderia significar mais de uma coisa

Um "Tech Lead review" estruturado encontra e corrige essas issues antes de passar para o próximo papel (desenvolvedor).

## Tarefa

### Passo 1: Preparar Seu Trabalho para Review
Compile em um único documento:
- bounded-contexts.md
- linguagem-ubiqua.md
- requirements.md
- Notas dos mockups

### Passo 2: Checklist de Review Automático
Antes de pedir ao Claude, valide:
- [ ] Cada bounded context tem "está dentro", "está fora", "relacionamentos"?
- [ ] Cada termo no glossário está documentado em Anexo A?
- [ ] requirements.md tem todas 5 seções (Outcomes, Scope, Constraints, Prior Decisions, Criteria)?
- [ ] Verification criteria são realmente testáveis (não vagas como "funcionará bem")?
- [ ] Mockups refletem os outcomes do requirements.md?

### Passo 3: Pedir Review ao Claude com Prompt Estruturado
Use o Claude com um prompt como:

```
Atue como Tech Lead revisando a spec de produto do assistente NovaTech.

ARTEFATOS FORNECIDOS:
1. Mapa de bounded contexts
2. Glossário de linguagem ubíqua
3. requirements.md em SDD
4. Mockups de interface

SUA TAREFA:
1. Aponte ambiguidades: termos que ainda estão vagos, decisões não documentadas
2. Aponte lacunas: algo que assumimos mas não documentamos explicitamente
3. Aponte contradições: requisitos que se conflitam, ou inconsistência entre artefatos
4. Aponte vazios no glossário: termos usados nos requirements mas não definidos
5. Valide coerência: requirements e mockups são congruentes?

FORMATO DE RESPOSTA:
Para cada achado, estruture como:
- Tipo: [Ambiguidade | Lacuna | Contradição | Vazio no Glossário]
- Localização: [Qual arquivo/seção]
- Descrição: [O quê está errado]
- Sugestão de correção: [Como consertar]

Termine com recomendação: "Pronto para desenvolvedor" ou "Requer iteração adicional".
```

### Passo 4: Iterar com Base no Feedback
Para cada achado do Tech Lead:
1. Entenda por que é um problema
2. Atualize o artefato relevante
3. Valide que a correção não criou nova contradição
4. Execute review novamente até receber "Pronto para desenvolvedor"

### Passo 5: Documentar Histórico de Iteração
Crie um arquivo `iteracao-tech-lead.md` com:
- Versão inicial e achados do Tech Lead
- Iteração 1: Problemas identificados + correções aplicadas
- Iteração 2: Novos achados + correções
- ...até aprovação final

## Entregável
- [ ] Arquivo `iteracao-tech-lead.md` com histórico completo
- [ ] Versão final de bounded-contexts.md
- [ ] Versão final de linguagem-ubiqua.md
- [ ] Versão final de requirements.md
- [ ] Aprovação do Tech Lead ("Pronto para desenvolvedor")

## Critério de Sucesso
Ao final da iteração:
- Nenhuma ambiguidade resta
- Todo termo usado está definido no glossário
- requirements.md é testável por QA
- Desenvolvedor consegue escrever prompts sem dúvidas sobre domínio
- Mockups refletem fidedignamente os requirements
