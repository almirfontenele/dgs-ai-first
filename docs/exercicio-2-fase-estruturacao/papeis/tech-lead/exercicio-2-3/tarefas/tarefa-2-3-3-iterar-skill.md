# Tarefa 2.3.3 — Iterar e refinar SKILL.md

## Objetivo
Refinar o SKILL.md baseado nas observações do teste com Copilot, tornando-o mais claro e prescritivo.

## Descrição
Com base na análise da Tarefa 2.3.2, reescreva as seções do SKILL.md que foram ignoradas pelo Copilot. O objetivo é aumentar a taxa de aderência.

## Procedimento

### Passo 1: Compilar feedback
Organize os pontos não-seguidos:
- Qual seção do SKILL.md deveria ter coberto?
- Por que foi ignorado? (exemplo ausente, regra ambígua, conflito com AGENTS.md)

### Passo 2: Reescrever seções
Para cada item ignorado, escolha uma estratégia:

#### Estratégia A: Tornar mais prescritivo
```markdown
# ANTES (ambíguo)
"Use logging para operações importantes"

# DEPOIS (prescritivo)
"VOCÊ DEVE usar pino.info() para logar CADA mudança de estado.
❌ NUNCA use console.log.
Exemplo obrigatório:
const pino = require('pino');
const logger = pino();
logger.info({ userId }, 'User created');
```

#### Estratégia B: Adicionar exemplo em contexto real
```markdown
# ANTES
"Valide input com Zod"

# DEPOIS
"SEMPRE valide input com Zod ANTES de usar.
Padrão:
const inputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1)
});
const data = inputSchema.parse(req.body);
// Agora data é type-safe e validado
```

#### Estratégia C: Adicionar anti-padrão claro
```markdown
# ✗ DON'T (Common mistake)
function handle(req, res) {
  // Sem validação — perigoso!
  const email = req.body.email;
  console.log('Received:', email); // ❌ console.log
  return res.json({ ok: true });
}

# ✓ DO
function handle(req, res) {
  const schema = z.object({ email: z.string().email() });
  const data = schema.parse(req.body); // ✓ Throws if invalid
  logger.info({ email: data.email }, 'Email received'); // ✓ pino
  return res.json({ ok: true });
}
```

### Passo 3: Testar iteração
1. Atualizar SKILL.md v2 com as melhorias
2. Executar mesmo teste da Tarefa 2.3.2
3. Comparar: quantos pontos foram corrigidos?
4. Se ainda faltam, listar como "conhecidas limitações"

## Saída esperada
- **SKILL.md v2**: arquivo atualizado com seções melhoradas
- **Relatório de iteração**:
  ```
  Pontos ignorados na v1: 5
  - [ ] pino logging (reescrito com exemplo claro)
  - [ ] error handling (adicionado anti-padrão)
  - ...
  
  Resultado da v2: 4/5 agora seguidos
  
  Limitação conhecida: Copilot ainda não estrutura erros
  Razão: Requer conhecimento de custom error classes
  ```
- **Evidência**: screenshot do Copilot usando v2

## Critério de sucesso
- Pelo menos 80% das regras são agora seguidas (melhoria significativa)
- A análise reconhece limitações (nem tudo será 100% perfeito)
- Documento é demonstradamente mais prescritivo e claro

## Notas
- Skills são "artefatos vivos" — melhoram com o tempo
- Não é necessário atingir 100% de aderência
- Documentar limitações é tão importante quanto documentar successo
