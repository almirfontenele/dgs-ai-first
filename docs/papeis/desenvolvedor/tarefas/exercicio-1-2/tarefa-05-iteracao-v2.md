# Tarefa 1.2.5 — Iteração e System Prompt v2

## O que fazer

Com base na análise crítica da Tarefa 1.2.4, reescreva o system prompt (v2) corrigindo os problemas identificados. Depois teste novamente.

## Passo 1: Reescrever o System Prompt

Baseado nas hipóteses de melhoria que você listou na Tarefa 1.2.4, reescreva as seções problemáticas do prompt.

### Exemplo: Se o Erro foi "Ignorar Exceções"

**v1 (problema):**
```
Sempre use a documentação fornecida para responder.
Cite a fonte de cada informação.
```

**v2 (corrigido):**
```
Sempre use a documentação fornecida para responder.
IMPORTANTE: Se a documentação menciona uma exceção, restrição ou "EXCETO", 
VOCÊ DEVE destacá-la na resposta como a parte mais importante.
Exemplo: se "7 dias exceto cargas perigosas", a resposta deve começar com 
"Cargas perigosas NÃO podem ser devolvidas. As outras podem em 7 dias."
Cite a fonte (documento, seção) de cada informação.
```

### Estratégia de Iteração

Para cada erro encontrado:
1. Identifique qual seção do prompt falhou
2. Reescreva aquela seção com instrução mais explícita
3. Se possível, adicione exemplo na seção melhorada

## Passo 2: Teste Novamente

Abra uma **nova conversa** no Claude (importante: conversa diferente).

Cole o system prompt v2 e os mesmos chunks da Tarefa 1.2.3.

Faça as **mesmas 3 perguntas**:
1. Qual o prazo de devolução para carga perigosa?
2. Meu cliente é Gold, qual o SLA de resolução?
3. Quanto custa o frete para 600kg para Manaus?

Capture as respostas em `teste-v2-respostas.md` (mesmo formato da Tarefa 1.2.3).

## Passo 3: Comparar v1 vs v2

Crie um documento `comparacao-v1-v2.md`:

```markdown
# Comparação v1 vs v2

## Pergunta 1: Devoluções de Carga Perigosa

### Resposta v1
[Copie]

### Resposta v2
[Copie]

### Comparação
| Critério | v1 | v2 | Melhoria |
|----------|----|----|----------|
| Menciona restrição? | ❌ | ✅ | SIM |
| Cita fonte? | ✅ | ✅ | Mantém |
| Tom apropriado? | ✅ | ✅ | Mantém |
| Score (0-10) | 6 | 9 | +3 |

**Análise:** O prompt v2 agora...

---

## Pergunta 2: SLA de Cliente Gold

### Resposta v1
[Copie]

### Resposta v2
[Copie]

### Comparação
| Critério | v1 | v2 | Melhoria |
|----------|----|----|----------|
| ... | ... | ... | ... |

---

## Pergunta 3: Frete para Manaus

### Resposta v1
[Copie]

### Resposta v2
[Copie]

### Comparação
| Critério | v1 | v2 | Melhoria |
|----------|----|----|----------|
| ... | ... | ... | ... |

---

## Score de Acerto

```
                v1   v2   Delta
Pergunta 1:     6   9     +3
Pergunta 2:     8   9     +1
Pergunta 3:     5   7     +2
_____________________________
MÉDIA v1:      6.3
MÉDIA v2:      8.3  (+2.0 pontos)
```

## Conclusão sobre Iteração
A iteração melhorou o prompt porque [principais mudanças que funcionaram]:
1. ...
2. ...
3. ...

Problemas residuais para próxima iteração:
- [Problema que ainda persiste]
- [Problema que ainda persiste]
```

## Passo 4: Documentar Mudanças

Crie um arquivo `changelog-v1-v2.md`:

```markdown
# Changelog: v1 → v2

## Mudanças Aplicadas

### Seção: [Nome da Seção]
**Antes:**
[Texto da v1]

**Depois:**
[Texto da v2]

**Razão:** [Por que mudou? Baseado em qual erro?]
**Teste relacionado:** Pergunta X

---

### Seção: [Nome da Seção]
[Repetir formato acima]

---

## Mudanças Não Aplicadas

[Se havia hipóteses que não testou, explique por quê]

## Lições Aprendidas

Do processo de iteração, você descobriu:
1. ...
2. ...
3. ...
```

## Critérios de Aceitação

- ✅ System prompt v2 está reescrito com mudanças concretas
- ✅ Teste v2 foi realizado em conversa nova
- ✅ Comparação v1 vs v2 é clara (tabelas com scores)
- ✅ Mudanças são justificadas (não arbitrárias)
- ✅ Score melhorou (não precisa ser perfeito, mas mostrar melhoria)
- ✅ Changelog documenta exatamente o que mudou e por quê

## Dicas

- **Conversa nova:** Cada versão em conversa diferente (sem história contaminada)
- **Mesmas perguntas:** Use exatamente as mesmas 3 perguntas para comparar
- **Itere até 3x:** Se ainda houver erros, considere uma v3
- **Documentação:** A documentação de como iterou é tão importante quanto o prompt final

## Entregáveis Finais

Quando terminar, você terá:

1. **system-prompt-v1.md** — Versão inicial
2. **system-prompt-v2.md** — Versão após iteração
3. **teste-v1-respostas.md** — Respostas obtidas com v1
4. **teste-v2-respostas.md** — Respostas obtidas com v2
5. **analise-critica-v1.md** — Análise detalhada de v1
6. **comparacao-v1-v2.md** — Comparação lado a lado
7. **changelog-v1-v2.md** — Documentação de mudanças
8. **mapeamento-contexto.md** — Estático vs dinâmico (tarefa 2)

Parabéns! Você completou o exercício 1.2.
