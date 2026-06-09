# Tarefa 2.3.1 — Escrever SKILL.md para azure-functions-endpoint

## Objetivo
Criar a documentação da skill `azure-functions-endpoint` que define o padrão para criar Azure Functions endpoints no projeto.

## Descrição
Usando Claude, escreva o SKILL.md completo para a skill `azure-functions-endpoint` (nível Domain). Este documento deve ser tão claro e prescritivo que o Copilot consegue seguir as regras sem ambiguidade.

## Requisitos

### Estrutura obrigatória do SKILL.md

```markdown
# SKILL: azure-functions-endpoint

## Contexto
[O que é uma Azure Function endpoint, por que existe, quando usar]

## Decisões técnicas incorporadas
[Quais decisões do AGENTS.md se aplicam aqui? Ex: TypeScript strict, pino logging, Zod validation]

## Padrão prescritivo

### ✓ DO
[Exemplos de código correto]

### ✗ DON'T
[Exemplos de código incorreto]

### Anti-padrões comuns
[Erros que agentes cometem]

## Dependências
[Imports necessários, pacotes, bibliotecas]

## Checklist de implementação
[Passos para garantir que endpoint está correto]
```

### Conteúdo específico obrigatório

#### Contexto
- Explicar o que é uma Azure Function HTTP trigger
- Quando usar este padrão
- Quando NÃO usar

#### Decisões técnicas
- TypeScript strict mode obrigatório
- Zod para validação de request/response
- pino para logging (nunca console.log)
- Error handling com custom errors
- Input validation com Zod
- Resposta estruturada em JSON

#### Exemplos de código (DO/DON'T)
- **DO**: Endpoint com Zod validation + pino logging + error handling
- **DON'T**: console.log, dynamic typing, unvalidated input, generic error responses
- Mostrar diferença clara

#### Anti-padrões comuns
- Colocar lógica de negócio inside Azure Function (deve chamar service)
- Não validar input
- Usar any type
- Não logar erros
- Retornar erros sem estrutura

#### Dependências
```json
{
  "dependencies": {
    "@azure/functions": "^4.x",
    "zod": "^3.x",
    "pino": "^8.x",
    "pino-pretty": "^10.x"
  }
}
```

#### Checklist
- [ ] Função tem type de input/output com Zod
- [ ] Input é validado com Zod antes de usar
- [ ] Errors são logados com pino
- [ ] Response status está correto (200, 400, 500)
- [ ] Nenhum console.log
- [ ] Nenhum any type
- [ ] Function é testável (pode ser testada sem Azure)

## Saída esperada
- Arquivo `skills/domain/azure-functions-endpoint.md` (ou local similar)
- Exemplos de código reais (não pseudocódigo)
- Claro o suficiente para Copilot seguir

## Notas
- Escreva para que um agente IA leia, não apenas humanos
- Use linguagem prescritiva: "você DEVE", "sempre use", "nunca faça"
- Exemplos devem ser copypaste-ready ou próximo disso
