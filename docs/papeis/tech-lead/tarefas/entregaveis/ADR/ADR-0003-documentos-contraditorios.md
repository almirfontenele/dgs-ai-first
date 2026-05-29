# ADR-0003: Tratamento de Documentos Contraditórios no Pipeline RAG

## Status: Aceito

## Contexto

A base documental da NovaTech contém contradições identificadas e documentadas. O caso mais crítico é a coexistência de **PROC-042 v1** (março/2023) e **PROC-042 v2** (novembro/2023), com diferenças materiais em multiplicadores regionais, fatores de peso e prazo adicional de entrega. Nenhum dos dois documentos está formalmente marcado como obsoleto no SharePoint — ambos coexistem com status ambíguo.

**Contradições concretas identificadas na base:**

| Parâmetro | PROC-042 v1 | PROC-042 v2 |
|---|---|---|
| Multiplicador Sul | 1.2 | 1.3 |
| Multiplicador Norte | 1.6 | 1.8 |
| Fator peso 1.001–3.000kg | 1.2 | 1.15 |
| Fator peso acima de 3.000kg | 1.5 | 1.4 |
| Prazo adicional | +2 dias úteis | +3 dias úteis |

**Por que isso é um problema de dados, não de modelo:**

Um LLM não tem como resolver essa contradição por raciocínio interno — ele não sabe qual versão a NovaTech considera vigente. Se ambos os documentos entrarem no contexto sem tratamento, o modelo pode:
- Escolher arbitrariamente um dos valores (alucinação por omissão).
- Calcular uma média implícita entre os valores (comportamento não determinístico).
- Citar a versão mais recente por heurística de data, ignorando a regra de vigência da seção 5 do PROC-042-v2.

O requisito do Product Specialist é explícito: **"Documentos contraditórios devem mostrar ambas as versões com indicação de data."** Isso resolve o problema na camada de UX, mas a decisão arquitetural é como o pipeline detecta e sinaliza contradições para que o LLM possa cumprir esse requisito.

**Forças que atuam:**

- O time de Operações não quer (e provavelmente não consegue) resolver a contradição no SharePoint antes do go-live. A solução de pipeline precisa ser robusta à presença de documentos conflitantes.
- A seção 5 do PROC-042-v2 tem regra de vigência com data (01/12/2023), mas a data já passou e o PROC-042 v1 não foi arquivado. A regra de vigência é conhecível pelo sistema, mas não resolve automaticamente todos os casos futuros.
- O FAQ informal (não validado por Compliance) pode conter informações contraditórias com os documentos normativos — esse é um tipo diferente de contradição (formal vs informal) que precisa de tratamento separado.

## Decisão

**Adotar estratégia de detecção explícita + sinalização no contexto**, com duas camadas:

### Camada 1 — Metadados de vigência no índice vetorial

Cada documento indexado recebe metadados estruturados obrigatórios:

```json
{
  "doc_id": "PROC-042-v2",
  "doc_family": "PROC-042",
  "version": "2.0",
  "emission_date": "2023-11-10",
  "status": "active|superseded|informal|unknown",
  "supersedes": "PROC-042-v1",
  "effective_date": "2023-12-01",
  "classification": "normative|informal"
}
```

O campo `doc_family` agrupa documentos da mesma família (PROC-042 v1 e v2 têm o mesmo `doc_family`). O campo `status` é preenchido manualmente na ingestão pela equipe responsável. Onde o status não puder ser determinado, o valor é `"unknown"` — não assume-se nada.

**Regra de ingestão para casos `unknown`**: Documentos da mesma família com status `unknown` são ambos marcados como `active` para fins de recuperação — o pipeline não decide qual é o vigente.

### Camada 2 — Lógica de contradição no retriever

Após o retrieval, antes de montar o contexto, o pipeline executa verificação de contradição:

1. Para cada conjunto de chunks retornados, agrupa por `doc_family`.
2. Se dois ou mais chunks do mesmo `doc_family` com `status != superseded` forem recuperados, ativa o **modo de contradição**.
3. Em modo de contradição:
   - Ambos os chunks entram no contexto com marcação explícita de versão e data.
   - O prompt de sistema recebe instrução adicional dinâmica: *"Os documentos [PROC-042-v1, emitido 03/03/2023] e [PROC-042-v2, emitido 10/11/2023] contêm informações conflitantes sobre o mesmo procedimento. Apresente ambas as versões ao usuário com as respectivas datas e informe que a versão aplicável deve ser confirmada com o Comercial ou Operações antes de qualquer cálculo."*
4. A resposta gerada pelo LLM é automaticamente prefixada com banner visual: `⚠️ Documentação conflitante identificada`.

### Camada 3 — Tratamento de documentos informais (FAQ)

Chunks provenientes de documentos com `classification: informal` (como FAQ-Atendimento) recebem peso de recuperação reduzido via re-ranking. Se recuperados, são incluídos no contexto com marcação de classificação:

> *[Fonte: FAQ-Atendimento — documento informal, não validado por Compliance. Confirme com documentação normativa antes de aplicar.]*

A instrução no prompt de sistema proíbe o LLM de usar fontes informais para cálculos ou compromissos contratuais.

## Consequências

**Positivas:**
- O LLM nunca resolve ambiguidade de vigência por conta própria — isso é responsabilidade do negócio, não da IA.
- Usuário é informado proativamente sobre contradições, não descobre depois de aplicar o valor errado.
- Auditabilidade total: cada resposta em modo de contradição é rastreável nos logs com os chunks usados.
- Informação informal (FAQ) é acessível mas claramente sinalizada como não-normativa.

**Negativas:**
- **Qualidade dos metadados depende do processo de ingestão**: Se o time não preencher `status` corretamente, o sistema pode tratar um documento obsoleto como ativo. Mitigação: validação obrigatória de metadados no pipeline de ingestão — documentos sem `doc_family` e `status` são rejeitados.
- **UX pode ser percebida como inconclusiva**: Mostrar "duas versões conflitantes" sem resolução pode frustrar atendentes que querem uma resposta direta. Mitigação: o banner de contradição inclui sempre a ação concreta ("confirme com o Comercial").
- **Custo adicional de contexto**: Modo de contradição inclui chunks de duas versões, aumentando o contexto. Aceitável dado que é um caso minoritário (identificados 3 procedimentos contraditórios na base atual).

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **Manter apenas a versão mais recente** | Viola o requisito do Product Specialist. Além disso, a versão mais recente pode não ser a vigente para contratos antigos (PROC-042-v2, seção 5, diz explicitamente que chamados abertos antes de dez/2023 usam multiplicadores da v1). Decidir automaticamente pela mais recente é uma alucinação arquitetural. |
| **Delegar a decisão ao LLM com instrução no prompt** | O LLM não tem acesso ao sistema de contratos para saber qual versão se aplica a qual cliente. A instrução "use o documento mais recente" produz erro determinístico para clientes em período de transição. |
| **Resolver contradição antes da ingestão (curadoria manual)** | Seria o ideal, mas o time de Operações não tem capacidade de revisar todos os documentos antes do go-live. A solução de pipeline precisa ser resiliente à realidade da base atual. A curadoria manual é um objetivo futuro (backlog), não pré-requisito do go-live. |
| **Sinalizar contradição mas ainda assim escolher a mais recente** | Resolve a comunicação ao usuário, mas ainda comete o erro de vigência para contratos antigos. Descartada pelos mesmos motivos da opção "manter apenas a mais recente". |

---

## Devil's Advocate — Registro da sessão de revisão

**Argumento contra apresentado ao Claude:**
> "Sua solução é overcomplicated. Se o PROC-042-v2 tem uma seção 5 com data de vigência (01/12/2023), basta o pipeline ler essa seção e aplicar a regra automaticamente. Você não precisa de modo de contradição — precisa de um parser de vigência."

**Resposta e revisão:**

O contra-argumento é tecnicamente elegante mas operacionalmente frágil por três razões:

1. **Generalização impossível**: A regra de vigência do PROC-042-v2 é específica desse documento. Não há garantia de que futuros documentos contraditórios terão seção de disposições transitórias — e se não tiverem, o parser falhará silenciosamente.

2. **Extração de regras de vigência de linguagem natural é não-determinística**: Implementar um parser que entende "chamados abertos antes de 01/12/2023 usam multiplicadores da v1" via NLP é um problema de extração de informação estruturada de texto legal. Erros nesse parser resultam em valores financeiros incorretos sendo calculados pelo atendimento — risco inaceitável.

3. **O problema real não é técnico, é de governança**: A contradição existe porque o processo de publicação de documentos da NovaTech não exige revogação formal. A solução correta é pressionar por processo de gestão documental, não construir um parser de vigência que perpetua o problema.

**Impacto na decisão**: O argumento do devil's advocate foi parcialmente incorporado — foi adicionada a Camada 1 com metadado `effective_date` que permite ao pipeline usar a data de vigência *quando explicitamente fornecida e validada na ingestão*. Mas o modo de contradição é mantido como fallback para quando esse metadado não resolve o caso (contratos antigos, documentos sem seção de vigência, status `unknown`).

**Decisão adicional gerada pelo debate**: A equipe de Operações será acionada para preencher `status: superseded` no PROC-042-v1 antes do go-live — isso elimina o modo de contradição para o caso mais crítico sem depender de parser automático.
