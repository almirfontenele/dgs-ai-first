# Tarefa 2.2.2 — Criar Board de Tracking de Specs com Cowork

## Objetivo

Criar um board (ou tabela visual) que permite acompanhar o status de cada spec: Rascunho → Em Revisão → Aprovada → Em Implementação → Validada.

Use **Claude Cowork** para criar um template colaborativo que o time consegue preencher e atualizar em tempo real.

## Contexto

Specs são artefatos que evoluem. Um board visual ajuda:
- Todos verem o status atual de cada spec
- Não esquecer de validar quando implementação termina
- Evitar que Dev inicie com spec ainda em revisão
- Comunicar bloqueios (spec presa em aprovação)

## Ferramentas a Utilizar

- **Claude Cowork:** Para criar board colaborativo
- **Claude:** Para refinar critérios de status

## Inputs

1. O documento `governanca.md` da tarefa anterior
2. Os 5 módulos que precisam de specs:
   1. Pipeline de ingestão de documentos
   2. API de busca (query endpoint)
   3. API de feedback (atendente reporta resposta incorreta)
   4. Bot do Teams (interface conversacional)
   5. Painel web (dashboard de métricas e histórico)
3. Os status: Rascunho, Em Revisão, Aprovada, Em Implementação, Validada

## Entregável

Um **board de tracking** (em Cowork ou estruturado para Cowork) com:

### Estrutura

```
| Módulo | Requirements | Plan | Tasks | Status | Última Atualização | Responsável |
|--------|--------------|------|-------|--------|-------------------|-------------|
| Ingestão | - | - | - | Rascunho | [data] | [pessoa] |
| Busca | - | - | - | Em Revisão | [data] | [pessoa] |
| Feedback | - | - | - | Aprovada | [data] | [pessoa] |
| Teams | - | - | - | Em Implementação | [data] | [pessoa] |
| Web | - | - | - | Validada | [data] | [pessoa] |
```

Ou em formato mais visual (kanban):

```
Rascunho | Em Revisão | Aprovada | Em Implementação | Validada
---------|-----------|----------|------------------|----------
Ingestão | Busca     | Feedback | Teams            | Web
```

### Para Cada Status, Defina:

**Rascunho**
- Quem pode estar aqui: Product Specialist / Tech Lead (inicialmente)
- O que significa: Primeiro draft, não pronto para revisão
- Quem pode fazer: Author apenas (não público)
- Próximo passo: Mover para "Em Revisão"

**Em Revisão**
- Quem pode estar aqui: Qualquer spec que alguém revisou
- O que significa: Esperando aprovação de quem?
- Quem pode fazer: Author + Reviewer
- Próximo passo: Aprovado (move para "Aprovada") ou Rejected (volta para "Rascunho")

**Aprovada**
- Quem pode estar aqui: Specs que passaram em gate de aprovação
- O que significa: Dev pode começar a implementar
- Quem pode fazer: Todos (leitura) + TL/PM (para mover)
- Próximo passo: Move para "Em Implementação" quando Dev começa

**Em Implementação**
- Quem pode estar aqui: Specs que estão sendo codificadas
- O que significa: Dev está trabalhando nisso agora
- Quem pode fazer: Dev + TL
- Próximo passo: Move para "Validada" quando testes confirmam

**Validada**
- Quem pode estar aqui: Specs completamente implementadas e testadas
- O que significa: Feito, pronto para deploy
- Quem pode fazer: QA + TL (para marcar como validada)
- Próximo passo: Deploy / Encerramento

### Campos Adicionais

- **Link para requisitos** (para clicar e ir direto ao arquivo)
- **Bloqueadores** (se spec tá travada em algum status, por quê?)
- **Próxima revisão** (quando essa spec pode mudar?)
- **Versão** (v1.0, v1.1, etc)

## Critérios de Aceite

- [ ] Board criado em Cowork (ou estruturado para ser preenchido em Cowork)
- [ ] Todos os 5 módulos estão como itens iniciais
- [ ] 5 status bem definidos (Rascunho → Validada)
- [ ] Para cada status: o que significa, quem pode estar aí, qual é o próximo passo
- [ ] Pelo menos 1 campo adicional útil (links, bloqueadores, versão)
- [ ] Board é navegável e visual (não é só tabela de texto)

## Dicas

- Use Cowork para tornar o board interativo (pessoas conseguem clicar, expandir, atualizar)
- Pense em quem será o owner de cada spec (quem move entre status)
- Inclua campo de "bloqueadores" para quando spec fica travada
- Valide que cada transição entre status faz sentido (ex: "Rascunho" → "Em Implementação" pulando "Aprovada" = problema)

## Como Começar

1. Use Claude para definir os 5 status claramente
2. Para cada status, defina o que significa e o que pode fazer
3. Use Cowork para estruturar como um board visual
4. Adicione os 5 módulos como items iniciais
5. Teste completar o board com dados de exemplo

## Entrega

Coloque os arquivos em: `docs/exercicio-2-fase-estruturacao/papeis/delivery-manager/exercicio-2-2-governanca-specs/`

- `board-tracking.md` — Documento com estrutura do board
- Captura/screenshot do Cowork se usado para colaboração visual
- Arquivo exportado do Cowork (se houver export disponível)

**Próxima tarefa:** [2.2.3 — Change Management](2-2-3-change-management.md)
