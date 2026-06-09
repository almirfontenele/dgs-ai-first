# Iteração Tech Lead — Exercício 2.1

## Versão Inicial → Iteração 1

---

## Prompt Enviado ao Tech Lead (Claude)

```
Atue como Tech Lead revisando a spec de produto do assistente NovaTech.

ARTEFATOS FORNECIDOS:
1. Mapa de bounded contexts (bounded-contexts.md)
2. Glossário de linguagem ubíqua (linguagem-ubiqua.md)
3. requirements.md em SDD
4. Mockups de interface (mockups/mockup-interface-teams.md)

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

---

## Achados do Tech Lead — Rodada 1

**Tipo:** Lacuna  
**Localização:** requirements.md — Seção 3 (Constraints)  
**Descrição:** O constraint C8 define "base documental atualizada em até 24h" mas não especifica quem é o responsável por iniciar esse processo. O desenvolvedor não sabe se deve ser um processo automatizado (CI/CD) ou manual com aprovação humana.  
**Correção aplicada:** Adicionada nota ao C8 explicitando que a atualização é de responsabilidade do Tech Lead/DevOps e requer reprocessamento do pipeline RAG. Verification Criteria VC-P02 foi reforçado.

---

**Tipo:** Ambiguidade  
**Localização:** requirements.md — Seção 5.2 (VC-R04)  
**Descrição:** "Quando confiança de recuperação está abaixo do threshold" — o threshold não está definido em lugar algum. O developer não tem como implementar sem um valor concreto.  
**Correção aplicada:** Adicionada nota em Prior Decisions: "ADR-0006: Threshold de confiança RAG definido como 0.75 (score de similaridade coseno). Valores abaixo disso ativam modo de baixa confiança." Verification Criteria VC-R04 atualizado para referenciar ADR-0006.

---

**Tipo:** Vazio no Glossário  
**Localização:** linguagem-ubiqua.md — ausência do termo "Valor Base"  
**Descrição:** O requirements.md e os bounded contexts citam a fórmula de frete especial que usa "Valor base", mas o glossário não define este termo. Um LLM pode confundir com qualquer valor de referência.  
**Correção aplicada:** Adicionada entrada "Valor Base" ao glossário: "Tarifa publicada mensalmente na tabela de fretes da NovaTech (`\\novatech-fs\comercial\tabelas\frete-base-AAAAMM.xlsx`). Não é acessível pelo assistente — serve como referência para explicar a fórmula."

---

**Tipo:** Lacuna  
**Localização:** bounded-contexts.md — Bounded Context "Regras de Frete e Logística"  
**Descrição:** O context menciona "PROC-043: Frete de Cargas Perigosas" como referência, mas o documento não existe na base de conhecimento (Anexo A). Não está documentado o que o assistente faz quando perguntado sobre isso.  
**Correção aplicada:** Adicionado ao "Está fora do escopo" do context: "Informar valores de PROC-043 (Frete de Cargas Perigosas — documento não disponível na base atual)." Adicionado VC-F07 no requirements: "Dado pergunta sobre frete de carga perigosa acima de 500kg, a resposta informa que PROC-043 não está disponível na base e sugere contato com Gestão de Riscos."

---

**Tipo:** Ambiguidade  
**Localização:** mockups/mockup-interface-teams.md — Cenário 3  
**Descrição:** O mockup do cenário 3 apresenta o conteúdo do FAQ mesmo com baixa confiança e aviso de "não validado". Não está claro no requirements.md se isso é o comportamento desejado (mostrar com aviso) ou se o FAQ nunca deve ser citado sem documento normativo de suporte.  
**Correção aplicada:** Adicionado constraint C9 ao requirements: "FAQ-Atendimento pode ser citado como informação complementar apenas quando: (a) não há documento normativo sobre o assunto, (b) a resposta inclui aviso obrigatório de 'documento informal não validado', e (c) a escalação é recomendada na mesma resposta." Mockup Cenário 3 já reflete esse comportamento.

---

## Checklist Pós-Correção

- [x] Cada bounded context tem "está dentro", "está fora", "relacionamentos"?
- [x] Cada termo no glossário está documentado em Anexo A?
- [x] requirements.md tem todas 5 seções?
- [x] Verification criteria são realmente testáveis?
- [x] Mockups refletem os outcomes do requirements.md?
- [x] Threshold de confiança está definido (ADR-0006)?
- [x] Responsável pela atualização da base documental está documentado?
- [x] Comportamento para PROC-043 ausente está especificado?
- [x] Uso do FAQ tem regra clara e testável?

---

## Resultado Final

**✅ Pronto para desenvolvedor**

Após a iteração 1, todos os achados foram endereçados:
- Nenhuma ambiguidade técnica resta para o desenvolvedor
- Todo termo usado nos requirements está definido no glossário
- Todos os verification criteria têm valores concretos e são testáveis pelo QA
- Os mockups são congruentes com os requirements (cenário 2 reflete ADR-0003, cenário 3 reflete C7+C9)
- Bounded contexts cobrem todos os domínios identificados no Anexo A

**Próximo passo:** Desenvolvedores podem iniciar com o `requirements.md` como input para o pipeline RAG, usando `linguagem-ubiqua.md` para escrever prompts e `bounded-contexts.md` para definir os filtros de scope do assistente.
