# Tarefa 2.1.4 — Criar Mockup da Interface de Resposta no Teams

## Objetivo
Usar Claude Design para prototipar como as respostas do assistente NovaTech aparecem no Teams, garantindo que o layout comunica confiança, fonte e clareza conforme os requirements.

## Contexto
O mockup deve:
- Refletir os **Outcomes** (atendente consegue responder em < 30s com confiança)
- Demonstrar **como são citadas as fontes** (source_document sempre visível)
- Mostrar **como avisos aparecem** (quando houver fontes contraditórias, baixa confiança, etc.)

## Tarefa

### Passo 1: Definir Cenários de Resposta
Identifique pelo menos **3 cenários de resposta** que devem ser mockados:

1. **Resposta simples com confiança alta**
   - Exemplo: "Qual é o SLA de entrega para região Sul?"
   
2. **Resposta com fontes contraditórias**
   - Exemplo: "Qual é a política de devolução para carga perigosa?"
   - Deve mostrar: PROC-042 v1 vs v2, avisos de conflito
   
3. **Resposta com baixa confiança**
   - Exemplo: Pergunta fora do domínio ou sem informação no índice
   - Deve sugerir escalação

### Passo 2: Esboço de Layout (Texto)
Antes de usar Claude Design, desenhe em ASCII ou markdown como deveria parecer:

```
┌─────────────────────────────────────────┐
│ 🤖 NovaTech Assistant                   │
│                                         │
│ Sua pergunta: Qual é o SLA Gold?       │
│                                         │
│ ✓ Resposta                              │
│ SLA Gold garante resolução em 4 horas.│
│                                         │
│ 📎 Fonte: SLA-2024, seção 3.1          │
│ Confiança: Alta                         │
│ Última atualização: 2026-06-01         │
└─────────────────────────────────────────┘
```

### Passo 3: Usar Claude Design
Usando Claude Design, crie mockups visuais para cada cenário:
- Paleta de cores da NovaTech (se disponível, ou usar professional defaults)
- Tipografia legível em mobile (Teams é acessado em mobile)
- Ícones/badges para status (✓ confiança alta, ⚠ conflito, ❌ escalação)
- Organização clara: pergunta → resposta → fonte

### Passo 4: Iterar para Clareza
Valide que cada mockup demonstra:
- [ ] A resposta é clara e em português formal
- [ ] A fonte é **visível e destacada** (não escondida em rodapé)
- [ ] Avisos (contraditório, baixa confiança) são evidentes
- [ ] Cabe na tela sem scroll excessivo
- [ ] Ícones/cores comunicam status (não precisa ler, consegue entender visualmente)

## Entregável
Uma pasta com:
- [ ] 3+ mockups em PNG/PDF (um por cenário)
- [ ] Notas de design explicando escolhas (cores, ícones, layout)
- [ ] Annotações mostrando que cada requirement foi refletido no design

## Critério de Sucesso
Um atendente olhando para o mockup consegue:
1. Entender a resposta imediatamente
2. Ver de onde veio a informação
3. Saber o nível de confiança sem ler rótulos
4. Saber quando escalavar para supervisor
