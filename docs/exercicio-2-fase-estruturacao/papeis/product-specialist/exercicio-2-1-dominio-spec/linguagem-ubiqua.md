# Linguagem Ubíqua — Assistente NovaTech

> Termos usados consistentemente por Product Managers, Desenvolvedores, QAs e pelos prompts dos agentes de IA.

---

## Bounded Context: Atendimento ao Cliente

### CT-e (Conhecimento de Transporte Eletrônico)

**Definição:** Documento fiscal eletrônico obrigatório emitido pela NovaTech que comprova o transporte de mercadoria. É o identificador primário de qualquer operação de frete.

**Exemplo de uso:** "Para abrir um chamado de devolução, o cliente precisa informar o número do CT-e."

**Está documentado em:** POL-001, seção 3.3

**Conflitos conhecidos:** Nenhum.

**Relacionado a:** chamado, devolução, frete especial

---

### Chamado

**Definição:** Registro formal de uma solicitação ou incidente aberto pelo cliente no Portal do Cliente ou pelo atendente no sistema de atendimento (Azure DevOps). Cada chamado tem um timestamp de abertura que inicia o contador de SLA.

**Exemplo de uso:** "O relógio de SLA começa no timestamp de abertura do chamado."

**Está documentado em:** SLA-2024, seção 5

**Conflitos conhecidos:** Nenhum.

**Relacionado a:** SLA de resposta, SLA de resolução, incidente crítico

---

### Escalação

**Definição:** Transferência de um chamado ou pergunta para um setor especializado (Gestão de Riscos, Comercial, Jurídico) quando o assistente ou atendente de primeiro nível não tem autonomia para resolvê-lo.

**Exemplo de uso:** "Cargas perigosas que não podem ser devolvidas pelo processo padrão requerem escalação para Gestão de Riscos (ramal 4500)."

**Está documentado em:** POL-001, seção 3.2

**Conflitos conhecidos:** O FAQ-Atendimento descreve escalação informal para sinistros (sinistros@novatech.com.br), mas não há PROC ou POL formal sobre isso.

**⚠️ Confusão para LLM:** Escalação não significa rejeição do pedido; significa encaminhamento para decisão especializada.

**Relacionado a:** Gestão de Riscos, incidente crítico, carga perigosa

---

### Coleta Reversa

**Definição:** Serviço da NovaTech de buscar a mercadoria devolvida na localização do cliente. Agendada após aprovação da devolução, em até 2 dias úteis.

**Exemplo de uso:** "Após aprovação da devolução, a coleta reversa é agendada em até 2 dias úteis."

**Está documentado em:** POL-001, seção 3.3

**Conflitos conhecidos:** Nenhum.

**Relacionado a:** devolução, frete reverso

---

### Frete Reverso

**Definição:** Frete cobrado pela coleta reversa quando a devolução é por desistência do cliente (não por erro da NovaTech). Calculado com os mesmos multiplicadores do frete original.

**Exemplo de uso:** "Se o cliente desistiu da compra sem defeito da carga, o custo do frete reverso é dele."

**Está documentado em:** POL-001, seção 3.5

**Conflitos conhecidos:** O multiplicador do frete reverso depende de qual versão da PROC-042 está vigente (v1 ou v2).

**Relacionado a:** devolução, coleta reversa, multiplicador regional

---

## Bounded Context: Regras de Frete e Logística

### Frete Especial

**Definição:** Modalidade de frete aplicável a cargas com peso acima de 500kg, com cálculo específico usando fórmula: `Valor base × Multiplicador regional × Fator de peso`. Distinto do frete padrão (até 500kg).

**Exemplo de uso:** "Uma carga de 800kg para o Nordeste usa frete especial com fator de peso 1.0 e multiplicador regional 1.4 (v1) ou 1.5 (v2)."

**Está documentado em:** PROC-042 v1 e PROC-042 v2

**Conflitos conhecidos:** PROC-042 v1 e v2 têm multiplicadores regionais e fatores de peso diferentes. Nenhuma versão foi formalmente arquivada.

**⚠️ Confusão para LLM:** "Frete especial" não é sinônimo de frete expresso ou prioritário — refere-se exclusivamente à modalidade de peso acima de 500kg.

**Relacionado a:** multiplicador regional, fator de peso, PROC-042

---

### Multiplicador Regional

**Definição:** Fator numérico aplicado ao valor base do frete conforme a região de destino da carga. Existem duas tabelas vigentes (PROC-042 v1 e v2).

**Exemplo de uso:** "Frete para o Norte tem multiplicador 1.6 (v1) ou 1.8 (v2), o maior entre todas as regiões."

**Está documentado em:** PROC-042 v1 seção 2.1; PROC-042 v2 seção 2.1

**Conflitos conhecidos:**

| Região | PROC-042 v1 | PROC-042 v2 |
|--------|-------------|-------------|
| Sul | 1.2 | 1.3 |
| Sudeste | 1.0 | 1.1 |
| Centro-Oeste | 1.3 | 1.4 |
| Nordeste | 1.4 | 1.5 |
| Norte | 1.6 | 1.8 |

**⚠️ Confusão para LLM:** O assistente NUNCA deve escolher uma versão arbitrariamente — deve apresentar ambas e alertar o atendente.

**Relacionado a:** frete especial, PROC-042, fator de peso

---

### Fator de Peso

**Definição:** Multiplicador aplicado ao frete especial conforme a faixa de peso da carga. Duas versões vigentes.

**Exemplo de uso:** "Carga de 2.000kg tem fator de peso 1.2 (v1) ou 1.15 (v2)."

**Está documentado em:** PROC-042 v1 e v2, seção 2

**Conflitos conhecidos:**

| Faixa | PROC-042 v1 | PROC-042 v2 |
|-------|-------------|-------------|
| 500kg–1.000kg | 1.0 | 1.0 |
| 1.001kg–3.000kg | 1.2 | 1.15 |
| Acima de 3.000kg | 1.5 | 1.4 |

**Relacionado a:** frete especial, multiplicador regional

---

### Carga Perigosa

**Definição:** Mercadoria classificada nas classes 1 a 6 da ANTT (Agência Nacional de Transportes Terrestres), conforme Resolução ANTT nº 5.947/2021. Inclui explosivos (1), gases (2), líquidos inflamáveis (3), sólidos inflamáveis (4), oxidantes/peróxidos (5), tóxicos/infectantes (6). Não pode ser devolvida pelo processo padrão de devolução.

**Exemplo de uso:** "Carga classificada como ANTT classe 3 é carga perigosa e não é elegível para devolução padrão."

**Está documentado em:** POL-001, seção 3.2

**Conflitos conhecidos:** O FAQ-Atendimento (item 32) menciona envio de carga perigosa com frete expresso "com autorização do Compliance", mas não existe PROC formal que defina esse processo.

**⚠️ Confusão para LLM:** "Perigoso" no domínio tem definição técnica ANTT específica — não é qualquer carga de risco genérico.

**Relacionado a:** escalação, PROC-042, Gestão de Riscos, PROC-043

---

### Prazo de Entrega para Frete Especial

**Definição:** O prazo padrão da rota acrescido de dias úteis adicionais para manuseio de carga pesada. A quantidade de dias adicionais diverge entre versões da PROC-042.

**Está documentado em:** PROC-042 v1 seção 3 (+2 dias); PROC-042 v2 seção 3 (+3 dias)

**Conflitos conhecidos:** v1 diz +2 dias úteis; v2 diz +3 dias úteis.

**Relacionado a:** frete especial, PROC-042

---

## Bounded Context: Contratos e SLA

### Tier de Cliente (Gold / Silver / Standard)

**Definição:** Classificação contratual dos clientes da NovaTech em três níveis com base em volume mensal de operações e valor anual do contrato:
- **Gold:** Contrato > R$500k/ano OU > 200 operações/mês
- **Silver:** Contrato R$100k–500k/ano OU 50–200 operações/mês
- **Standard:** Todos os demais

**Exemplo de uso:** "Cliente Gold tem SLA de primeira resposta de 2 horas úteis."

**Está documentado em:** SLA-2024, seção 1

**Conflitos conhecidos:** Nenhum. Não existe tier Platinum — qualquer cliente que afirme ser Platinum está confundindo com programa de fidelidade descontinuado em 2022.

**⚠️ Confusão para LLM:** "Gold" não é o metal, é o tier mais alto de cliente. "Standard" não é genérico — é o tier mais básico com SLAs específicos.

**Relacionado a:** SLA de resposta, SLA de resolução, incidente crítico

---

### SLA de Resposta

**Definição:** Tempo máximo para o time de atendimento dar o primeiro retorno ao cliente após abertura do chamado (mesmo que seja "estamos verificando"). Medido em horas úteis para chamados gerais.

| Tier | Chamado Geral | Incidente Crítico |
|------|--------------|-------------------|
| Gold | 2h úteis | 30 min |
| Silver | 4h úteis | 1h |
| Standard | 8h úteis | 2h |

**Está documentado em:** SLA-2024, seção 2

**Conflitos conhecidos:** Para incidentes críticos de clientes Gold, o relógio não pausa fora do horário comercial.

**Relacionado a:** SLA de resolução, incidente crítico, chamado

---

### SLA de Resolução

**Definição:** Tempo máximo para o problema do cliente ser efetivamente resolvido (não apenas respondido). Medido em horas úteis para chamados gerais.

| Tier | Chamado Geral | Incidente Crítico |
|------|--------------|-------------------|
| Gold | 24h úteis | 4h |
| Silver | 48h úteis | 8h |
| Standard | 72h úteis | 24h |

**Está documentado em:** SLA-2024, seção 2

**Relacionado a:** SLA de resposta, incidente crítico

---

### Incidente Crítico

**Definição:** Chamado classificado como crítico quando atende a pelo menos um critério: (a) carga com valor declarado > R$100k sem localização há mais de 6h; (b) carga perigosa com irregularidade documental ou de rastreamento; (c) mais de 5 chamados do mesmo cliente em 24h sobre o mesmo problema; (d) risco à segurança de pessoas.

**Exemplo de uso:** "Uma carga de R$150k sem tracking por 7 horas é incidente crítico."

**Está documentado em:** SLA-2024, seção 3

**⚠️ Confusão para LLM:** Incidente crítico tem critérios objetivos — não é qualquer situação urgente subjetiva.

**Relacionado a:** SLA de resposta, SLA de resolução, escalação

---

## Bounded Context: Gestão de Documentação

### Source Document

**Definição:** Identificador do documento de origem de uma informação citada pelo assistente. Deve estar presente em toda resposta. Formato: `[CÓDIGO]-[VERSÃO], seção [X]` (ex: `PROC-042-v2, seção 2.1`).

**Exemplo de uso:** `"Fonte: SLA-2024, seção 2 — última atualização: 02/01/2024"`

**⚠️ Confusão para LLM:** O assistente NUNCA deve omitir o source_document, mesmo quando a informação parece óbvia.

**Relacionado a:** documento normativo, coexistência de versões

---

### Documento Normativo

**Definição:** Documento oficial da NovaTech com código formal (POL-XXX, PROC-XXX, SLA-XXXX), responsável definido e classificação. Tem precedência sobre o FAQ-Atendimento.

**Exemplo de uso:** "POL-001 é documento normativo; FAQ-Atendimento é documento informal e não validado."

**Está documentado em:** Cabeçalho de cada documento do Anexo A

**Conflitos conhecidos:** PROC-042 v1 e v2 são ambos normativos mas se contradizem.

**Relacionado a:** source_document, FAQ-Atendimento, coexistência de versões

---

### Coexistência de Versões

**Definição:** Situação em que dois documentos normativos sobre o mesmo assunto existem simultaneamente sem hierarquia clara ou obsolescência formal, tornando impossível determinar qual é a versão vigente sem decisão humana.

**Exemplo de uso:** "PROC-042 v1 e v2 estão em coexistência de versões — o assistente deve apresentar ambas."

**Está documentado em:** Notas do Anexo A, seção "Contradições identificadas"

**⚠️ Confusão para LLM:** Coexistência de versões é diferente de versão desatualizada — nenhuma das versões foi formalmente arquivada.

**Relacionado a:** PROC-042, multiplicador regional, fator de peso

---

### Valor Base

**Definição:** Tarifa publicada mensalmente pela NovaTech na tabela de fretes (`\\novatech-fs\comercial\tabelas\frete-base-AAAAMM.xlsx`). É o primeiro fator da fórmula de frete especial. O assistente não tem acesso direto a esse valor — pode explicar a fórmula mas não calcular o valor final sem a tarifa do mês.

**Exemplo de uso:** "Para calcular o frete especial, multiplique o valor base pela tabela mensal pelo multiplicador regional e pelo fator de peso."

**Está documentado em:** PROC-042 v1 e v2, seção 2

**Conflitos conhecidos:** Nenhum — o conceito é consistente entre as duas versões; apenas os multiplicadores diferem.

**⚠️ Confusão para LLM:** O assistente não deve inventar ou estimar o valor base — deve informar que o valor depende da tabela mensal e orientar o atendente a consultá-la.

**Relacionado a:** frete especial, multiplicador regional, fator de peso

---

## Termos com Risco de Confusão para LLMs

| Termo | Como LLM confundiria | Definição correta no domínio |
|-------|---------------------|------------------------------|
| Gold | Metal precioso | Tier mais alto de cliente NovaTech |
| Standard | Genérico / padrão geral | Tier básico de cliente com SLAs específicos |
| Frete especial | Frete prioritário ou expresso | Frete para cargas acima de 500kg |
| Carga perigosa | Qualquer carga de risco | Classes 1-6 ANTT conforme Resolução 5.947/2021 |
| Prazo | Qualquer prazo genérico | Prazo contratual contado em dias úteis com regras específicas |
| Incidente crítico | Qualquer urgência | Situação que atende critérios objetivos do SLA-2024 seção 3 |
| Escalação | Rejeição | Encaminhamento para setor especializado |
| Platinum | Tier superior ao Gold | Não existe na NovaTech |
