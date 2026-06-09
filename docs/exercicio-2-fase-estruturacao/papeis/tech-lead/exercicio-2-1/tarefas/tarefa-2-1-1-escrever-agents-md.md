# Tarefa 2.1.1 — Escrever AGENTS.md v1 com Claude

## Objetivo
Escrever o AGENTS.md completo do projeto, incluindo as seções principais: Project Overview, Tech Stack & Architecture, Coding Standards, Build & Deploy.

## Descrição
Usando Claude (chat), produza o AGENTS.md completo que servirá como constitution do projeto. Este documento deve conter decisões duráveis que todo agente de IA (Copilot, Claude Code) e toda specification devem respeitar.

## Requisitos

### Conteúdo obrigatório
1. **Project Overview** — descrição clara do projeto e seus objetivos
2. **Tech Stack & Architecture** — stack tecnológico com Azure Functions, Zod, Vitest, pino
3. **Coding Standards** — padrões TypeScript strict, naming conventions, estrutura de pastas
4. **Build & Deploy** — processo de build, deployment em Azure Functions, CI/CD
5. **Context Management Rules** (derivado de ADR-0002) — context budget (~4K tokens sistema + ~8K chunks por query), limites de contexto por operação

### Decisões técnicas a incorporar
- TypeScript com strict mode obrigatório
- Azure Functions v4 com HTTP triggers como padrão
- Zod para validação de input/output
- Vitest para todos os testes
- pino para logging (proibido console.log)
- Conventional Commits para mensagens de commit
- Branch strategy: feature branches com PR obrigatório para main

### Característica crítica
O documento deve ser **prescritivo**, não descritivo. Deve conter instruções que um agente consegue seguir, não apenas uma descrição do projeto.

## Saída esperada
- Arquivo `AGENTS.md` (v1) pronto para ser colocado no repositório
- Estruturado em seções markdown claras
- Com exemplos concretos de padrões esperados
- Com regras de context management explícitas

## Notas
- As seções de Product Rules, Testing Standards e Project Management serão escritas pelos outros papéis
- Este é um documento vivo que será iterado na tarefa seguinte
