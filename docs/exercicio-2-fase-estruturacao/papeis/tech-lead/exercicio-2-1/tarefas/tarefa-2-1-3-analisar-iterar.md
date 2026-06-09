# Tarefa 2.1.3 — Analisar e Iterar para AGENTS.md v2

## Objetivo
Refinar o AGENTS.md baseado nas observações do teste com Copilot, tornando-o mais prescritivo onde necessário.

## Descrição
Com base na análise da Tarefa 2.1.2, reescreva as seções do AGENTS.md que foram ignoradas pelo Copilot, tornando-as mais claras e prescritivas.

## Procedimento

### Passo 1: Compilar feedback
Organize os pontos não-seguidos pelo Copilot:
- Que seção do AGENTS.md deveria ter evitado isso?
- Por que o agente não seguiu? (seção pouco clara, exemplo ausente, regra em local errado)

### Passo 2: Reescrever seções problemáticas
Para cada item ignorado:
1. Reescreva a seção correspondente no AGENTS.md
2. Adicione exemplos concretos de código (DO e DON'T)
3. Torne a regra mais prescritiva (comando direto: "sempre...", "nunca...", "use...") vs descritiva ("consider...", "you might...")
4. Teste mentalmente: um agente IA conseguiria seguir a nova versão?

### Passo 3: Testar novamente
1. Atualizar AGENTS.md v2 no repositório
2. Executar o mesmo teste da Tarefa 2.1.2 (solicitar novo endpoint ao Copilot)
3. Comparar: quantos pontos foram corrigidos?

## Saída esperada
- **AGENTS.md v2**: arquivo atualizado com seções melhoradas
- **Análise de iteração**: documento mostrando:
  - Mudanças feitas (lado a lado v1 vs v2)
  - Resultado do teste v2 (outputs do Copilot)
  - Quantos pontos foram corrigidos (métrica de sucesso)
- **Limitações reconhecidas**: lista honesta do que Copilot AINDA não segue, com explicação

## Critério de sucesso
- Pelo menos 70% das regras ignoradas na v1 são agora seguidas na v2
- A análise reconhece que nem tudo será 100% seguido (isso é esperado e normal)
- O documento é demonstradamente mais prescritivo

## Notas
- Nem tudo precisa ser 100% perfeito — agentes não seguem 100% das regras
- O objetivo é reduzir ambiguidade, não eliminar toda variação
- Documentar as limitações é tão valioso quanto documentar o sucesso
