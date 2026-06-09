# Tarefa 2.3.2 — Testar skill com GitHub Copilot

## Objetivo
Validar o SKILL.md `azure-functions-endpoint` através de teste prático com Copilot, verificando se as regras são suficientemente claras.

## Descrição
Com o SKILL.md presente no repositório (em `/skills/domain/`), solicite ao GitHub Copilot que gere um endpoint. Observe se Copilot segue as regras definidas.

## Procedimento

### Passo 1: Preparar ambiente
1. Coloque o SKILL.md em `/skills/domain/azure-functions-endpoint.md`
2. Certifique-se que AGENTS.md também está no repo (contextua Copilot)
3. Abra VS Code com GitHub Copilot ativo

### Passo 2: Solicitar geração
Com uma nova função TypeScript vazia, solicite:

```
"Crie uma Azure Function HTTP trigger que:
- Receba um JSON com 'email' e 'name'
- Valide o input com Zod
- Log cada operação com pino
- Retorne um JSON com id, email, name, timestamp
- Siga o padrão definido em /skills/domain/azure-functions-endpoint.md"
```

### Passo 3: Documentar saída
Capturar e documentar:

#### Checklist de aderência
- [ ] TypeScript strict mode
- [ ] Zod validation presente
- [ ] pino logging (não console.log)
- [ ] Error handling estruturado
- [ ] Response JSON com status correto
- [ ] Nenhum any type
- [ ] Imports corretos

#### Análise qualitativa
Para cada item não-seguido:
- Qual era a regra no SKILL.md?
- Por que Copilot ignorou? (ambígua, omitida, conflitante?)
- Como reescrever para deixar mais claro?

#### Exemplo de registro
```
❌ pino logging ignorado
- Regra: "Use pino.info() para logar operações, nunca console.log"
- O que Copilot fez: console.log("Email validated")
- Hipótese: Exemplo DO não deixou claro que pino.info é OBRIGATÓRIO
- Ação: Adicionar exemplo explicit mostrando pino.info em uso

✓ Zod validation presente
- Copilot criou: const schema = z.object({ ... })
- Input foi validado: const data = schema.parse(req.body)
```

## Saída esperada
- Screenshot ou cópia do endpoint gerado por Copilot
- Checklist preenchido (✓/❌ para cada requisito)
- Tabela de análise: regra → seguida/ignorada → por quê → ação

## Critério de sucesso
Documentar fielmente o que Copilot seguiu e ignorou, sem bias. Esta análise alimentará a iteração na Tarefa 2.3.3.
