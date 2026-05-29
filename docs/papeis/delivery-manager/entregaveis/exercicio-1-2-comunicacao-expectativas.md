# Exercício 1.2 — Comunicação de Expectativas com o Cliente

**Projeto:** Assistente de IA para Atendimento — NovaTech  
**Elaborado por:** Delivery Manager (DB1)  
**Data:** 2026-05-29  
**Versão:** 1.0

---

## Parte A — E-mail de Resposta ao Diretor de Operações

---

**De:** [Delivery Manager — DB1]  
**Para:** Diretor de Operações — NovaTech  
**Assunto:** Re: Expectativas sobre o Assistente de IA — Próximos Passos

---

Olá, [Nome do Diretor],

Ficamos muito animados com o entusiasmo de vocês — e com razão. O projeto que estamos construindo juntos tem potencial real de transformar a rotina do time de atendimento. Mas exatamente porque queremos que ele tenha sucesso de verdade, precisamos alinhar o que a tecnologia entrega hoje — para que a implantação surpreenda positivamente, não o contrário.

**O assistente é como um estagiário muito bem treinado, não um oráculo.**

Pense assim: se você contratasse um estagiário e entregasse a ele todos os manuais, procedimentos e políticas da NovaTech, em algumas semanas ele estaria respondendo 80% das perguntas de rotina com precisão, citando exatamente de onde tirou a informação. Mas ele ainda dependeria da qualidade dos manuais que você entregou. Se o manual de frete estiver desatualizado, ele dará a resposta errada — confiante. Se a pergunta for de uma situação que os manuais não cobrem, ele precisará escalar.

O assistente de IA funciona da mesma forma: ele não "sabe tudo" de forma autônoma. Ele busca na documentação que vocês forneceram, sintetiza a resposta mais provável, e indica de onde tirou. Chamamos isso de RAG — em vez de depender apenas do que o modelo aprendeu durante seu treinamento, ele "consulta os arquivos" em tempo real antes de responder.

**Por que isso importa para vocês?**

A qualidade das respostas do assistente depende diretamente da qualidade da documentação que alimenta o sistema. Durante o discovery, vamos mapear juntos quais documentos estão prontos para indexação, quais precisam de revisão, e quais têm versões conflitantes que precisam ser resolvidas antes de entrarem no sistema. Esse trabalho conjunto é o que garante que o assistente entregue respostas confiáveis — não o modelo em si.

**O que vocês podem esperar ao final do projeto:**

Propomos três critérios de sucesso mensuráveis que podemos avaliar 30 dias após o go-live:

1. **Taxa de cobertura:** 70% das perguntas dos atendentes respondidas pelo assistente com citação de fonte verificável, sem necessidade de consulta manual adicional.
2. **Tempo médio de resposta:** Redução do tempo de busca de 12 minutos para menos de 3 minutos para os tipos de pergunta mais frequentes (prazos, SLAs, regras de frete e políticas de devolução).
3. **Taxa de escalação:** Redução de 15% para menos de 8% nas situações em que o atendente precisa escalar para o supervisor por não encontrar a informação.

Esses números são conservadores e alcançáveis. A comparação que faço internamente: uma calculadora de alta precisão que calcula exatamente o que você pede é mais útil do que uma que tenta adivinhar o que você quer e às vezes acerta.

Segue em anexo um one-pager visual mostrando como o assistente funciona, o que ele faz bem e o que está fora do seu escopo — ideal para compartilhar com o CEO e com o time de atendimento antes do lançamento.

Estamos à disposição para uma call esta semana para detalhar qualquer ponto.

Abraços,  
[Delivery Manager]  
DB1

---

## Parte B — One-Pager: Como o Assistente de IA da NovaTech Funciona

---

```
┌─────────────────────────────────────────────────────────────────────────┐
│          ASSISTENTE DE ATENDIMENTO NOVATECH — COMO FUNCIONA             │
└─────────────────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  O FLUXO DE UMA PERGUNTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [Atendente digita a pergunta]
        │
        ▼
  [O sistema busca nos documentos da NovaTech]
  ← SharePoint (~800 docs) + Confluence (~400 páginas) + Planilhas (~50)
        │
        ▼
  [Seleciona os trechos mais relevantes]
        │
        ▼
  [Sintetiza a resposta + indica a fonte]
        │
        ▼
  [Atendente recebe: RESPOSTA + DOCUMENTO DE ORIGEM + SEÇÃO]
        │
        ├── Confiante na resposta? → Usa no atendimento ✓
        └── Resposta incompleta ou situação especial? → Escala para supervisor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  O QUE O ASSISTENTE FAZ BEM             O QUE ESTÁ FORA DO ESCOPO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✅ Responder perguntas de rotina       ❌ Tomar decisões por você
     sobre prazos, SLAs, fretes e           ("devo aceitar essa devolução?")
     políticas em < 30 segundos
                                         ❌ Responder sobre assuntos não
  ✅ Citar exatamente o documento           documentados nos manuais
     e a seção de onde tirou a
     informação                          ❌ Atualizar-se automaticamente
                                            (novos documentos precisam ser
  ✅ Avisar quando não encontrou            adicionados ao sistema)
     a resposta e sugerir escalação
                                         ❌ Garantir 100% de precisão
  ✅ Funcionar dentro do Microsoft          (como qualquer busca, pode
     Teams sem mudança de sistema           recuperar trecho inadequado —
                                            por isso cita a fonte)
  ✅ Processar 320 chamados/dia
     sem fila de espera

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  COMO MEDIREMOS O SUCESSO (30 dias após o lançamento)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  📊 COBERTURA          📊 TEMPO              📊 ESCALAÇÕES
  70% das perguntas     Tempo de busca        Taxa de escalação
  respondidas com       < 3 minutos           por falta de informação
  fonte verificável     (hoje: 12 min)        < 8% (hoje: 15%)
  (hoje: busca manual)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  A QUALIDADE DO ASSISTENTE DEPENDE DA QUALIDADE DOS DOCUMENTOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  "Um assistente que consulta um manual atualizado responde certo.
   Um assistente que consulta um manual desatualizado responde errado
   com a mesma confiança."

  Por isso, durante o discovery (primeiras 2 semanas), trabalharemos
  juntos para identificar quais documentos estão prontos para indexação
  e quais precisam ser revisados antes de entrar no sistema.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                DB1 × NovaTech | Projeto Assistente IA | 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Notas sobre o Processo de Elaboração

**Como o e-mail foi elaborado com o Claude:**

**Prompt inicial:**
> "Sou Delivery Manager da DB1 e preciso responder ao diretor de operações da NovaTech que escreveu: 'Estamos animados com o projeto. Nosso CEO viu uma demo do Copilot e quer algo parecido. A expectativa é que em 3 meses nosso time de atendimento não precise mais procurar nada manualmente. O assistente vai saber tudo.' Escreva um e-mail que ajuste as expectativas sem matar o entusiasmo."

*Problema com o output inicial:* O e-mail usava termos técnicos como "RAG", "embeddings", "janela de contexto" sem explicação — adequado para um Tech Lead, não para um diretor de operações.

**Refinamento 1:**
> "O e-mail está técnico demais. O diretor não é de TI. Substitua todos os termos técnicos por analogias do mundo real. 'RAG' precisa ser explicado como 'o sistema busca nos seus documentos antes de responder', sem usar a sigla."

*Melhoria:* A analogia do "estagiário bem treinado" surgiu nesta iteração e foi mantida por ser precisa e acessível.

**Refinamento 2:**
> "Os critérios de sucesso propostos estão vagos: 'o assistente vai funcionar bem' e 'os atendentes vão gostar'. Substitua por critérios mensuráveis que eu consiga medir 30 dias após o go-live e que derivem das limitações reais do RAG."

*Melhoria:* Os três critérios mensuráveis (taxa de cobertura, tempo de busca, taxa de escalação) foram refinados com números concretos derivados dos dados do briefing (12 min hoje, 15% de escalação atual).

**Sobre o One-Pager:**

O one-pager foi desenhado em formato de texto estruturado para replicar o que seria gerado no Claude Cowork — um documento visual de uma página com quatro seções: fluxo de funcionamento, o que faz bem vs. o que não faz, critérios de sucesso mensuráveis, e o princípio central de que a qualidade do assistente depende da qualidade da documentação indexada.
