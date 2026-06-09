# Tarefa 2.2.1 — Escrever test-plan.md Derivado dos Verification Criteria

## Objetivo
Criar um plano de testes detalhado que derive diretamente dos verification criteria (VC), especificando cenários de teste, dados realistas e critérios de aprovação para cada VC.

## O Que É um Test Plan em Formato SDD?
Um bom test plan em SDD:
- **Rastreia cada VC** (cada critério de verificação tem testes associados)
- **Define cenários** (happy path + edge cases para cada VC)
- **Especifica dados** (exemplos concretos de inputs esperados)
- **Define critério de aprovação** (como saber se o teste passou)
- **Usa linguagem de negócio** (orientado a outcomes do usuário, não técnico)

## Tarefa

### Passo 1: Mapear VCs para Cenários
Analise os verification criteria fornecidos:

```
VC-01: Resposta em < 30s para 95% das queries
VC-02: 100% das respostas incluem campo source_document
VC-03: Queries sobre carga perigosa + devolução retornam negativa explícita
VC-04: Queries sem match retornam mensagem padrão de "não encontrado"
```

Para cada VC, identifique:
1. **Happy path**: O caso esperado que demonstra o VC funcionando
2. **Edge cases**: Condições de limite ou inesperadas que ainda devem passar
3. **Dados de teste**: Exemplos reais do domínio NovaTech

### Passo 2: Estruturar o Test Plan
Crie um documento com a seguinte estrutura para cada VC:

```markdown
## VC-[N]: [Descrição do Critério]

**O que está sendo testado:** [Uma frase clara]

### Cenário VC-[N]-1: [Happy Path]

**Descrição:** [Descrição do caso de uso]

**Dados de teste:**
- Input: [Pergunta realista do domínio]
- Chunks esperados: [Documentação relevante]
- Output esperado: [Resposta esperada com estrutura]

**Critério de aprovação:**
- [ ] [Validação 1]
- [ ] [Validação 2]
- [ ] [...]

### Cenário VC-[N]-2: [Edge Case]

[Mesmo formato acima]
```

### Passo 3: Validar Dados Realistas
Para cada cenário, valide que:
- [ ] A pergunta é algo que um atendente NovaTech realmente faria
- [ ] Os chunks vêm da documentação real (Anexo A ou B)
- [ ] A resposta esperada é algo que o sistema realmente deveria responder
- [ ] Os dados são específicos ao domínio, não genéricos

### Passo 4: Incluir Testes de Desempenho
Para VC-01 (resposta em < 30s):
- Define como medir tempo (início/fim, includes latência de rede?)
- Define o que "95% das queries" significa (em quantas amostras, qual distribuição?)
- Define o que fazer se falhar (timeout, retry, fallback?)

## Entregável
Um documento `test-plan.md` contendo:
- Mapeamento claro: VC → Cenários
- Para cada VC: ao menos 2 cenários (happy path + edge case)
- Para cada cenário: dados de teste realistas, critério de aprovação
- Uma seção de "Dados de Teste Realistas" explicando a origem de cada exemplo
- Uma seção de "Desempenho e Limites" para VCs que envolvem tempo/volume

## Critério de Sucesso
Um QA pode pegar seu test plan e, sem contactar você, criar um conjunto de testes que valide todos os VCs sem deixar lacunas.
