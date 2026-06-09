# Tarefa 2.3.4 — Definir critérios de maturidade da skill

## Objetivo
Estabelecer critérios práticos e mensuráveis para quando uma skill está "madura" e pronta para uso pela equipe.

## Descrição
Define o que significa "skill madura" e como você sabe que uma skill evoluiu de draft para production.

## Requisitos

### Conteúdo obrigatório

#### 1. Definição de maturidade por nível
Cada nível tem critérios diferentes:

**Foundation skills** (typescript-conventions, error-handling, project-structure):
- Critério: Todas as decisões técnicas do AGENTS.md estão codificadas
- Exemplo: "typescript-conventions é madura quando cobre: imports, naming, strict mode, generics"

**Domain skills** (azure-functions-endpoint, testing-patterns, etc):
- Critério: Agente segue 80%+ das regras sem iteração
- Exemplo: "azure-functions-endpoint é madura quando Copilot gera endpoints com Zod + pino sem ser corrigido"

**Artifact skills** (create-rag-endpoint, create-integration-test):
- Critério: Agente consegue gerar artefato completo, executável, com testes passando
- Exemplo: "create-rag-endpoint é madura quando Copilot gera pipeline que passa em todos os testes"

#### 2. Checklist de maturidade
Uma skill é madura quando:

- [ ] **Documentação**: SKILL.md cobre 100% do padrão (contexto, decisões, DO/DON'T, anti-padrões, checklist)
- [ ] **Clareza**: Uma pessoa nova consegue ler e entender em 10 minutos
- [ ] **Prescritivo**: Linguagem usa "você DEVE", "nunca", "sempre" — não "considere", "você poderia"
- [ ] **Exemplos reais**: Código é copypaste-ready ou muito perto
- [ ] **Testes Copilot**: 80%+ das regras são seguidas em geração real
- [ ] **Iteração**: SKILL.md foi testado e refinado pelo menos uma vez
- [ ] **Limitações conhecidas**: Documenta o que NÃO é possível (ex: "Copilot não consegue criar error classes abstratas")
- [ ] **Handover**: Alguém que não a escreveu consegue usar com sucesso

#### 3. Versioning de skill
- **v0.1** (Draft): Primeira versão, não testada com Copilot
- **v1.0** (Alpha): Testada, mas com ajustes frequentes esperados
- **v1.5** (Beta): 80%+ de aderência, pronta para uso sob supervisão
- **v2.0** (Stable): Pronta para produção, feedback de uso real incorporado

#### 4. Responsabilidades
- **Author**: Cria v0.1 e v1.0
- **Tech Lead**: Aprova transição para v1.5 (testado, aderência 80%+)
- **Team**: Usa v1.5+, fornece feedback
- **Maintainer** (designado): Incorpora feedback → v2.0

## Saída esperada
Documento `SKILL-MATURITY-CRITERIA.md` contendo:
1. Definição de maturidade por nível (Foundation/Domain/Artifact)
2. Checklist de maturidade (pode ser table ou markdown)
3. Versioning scheme (v0.1, v1.0, v1.5, v2.0)
4. Responsabilidades por fase

### Exemplo de documento
```markdown
# Skill Maturity Criteria

## Maturidade por nível

### Foundation Skills
Fundação da arquitetura. Devem ser 100% claras.
- Critério: Todas as regras do AGENTS.md codificadas
- Exemplos: typescript-conventions, error-handling, project-structure
- Time até v2.0: 2-3 semanas

### Domain Skills
Padrões de domínio. Agente deve seguir ~80%.
- Critério: Copilot gera código consistente
- Exemplos: azure-functions-endpoint, testing-patterns
- Time até v2.0: 4 semanas

## Maturity Checklist

- [ ] Documentação 100% completa (SKILL.md)
- [ ] Exemplos reais, copypaste-ready
- [ ] Testado com Copilot, 80%+ aderência
- [ ] Iterado baseado em feedback real
- [ ] Limitações conhecidas documentadas
- [ ] Handover bem-sucedido (outro dev conseguiu usar)

## Versions

- v0.1 (Draft): Escrito, não testado
- v1.0 (Alpha): Testado, ajustes frequentes OK
- v1.5 (Beta): 80%+ aderência, pronto para uso
- v2.0 (Stable): Produção, feedback incorporado

## Responsabilidades

| Fase | Owner | Ação |
|------|-------|------|
| v0.1 | Author | Escrever SKILL.md |
| v1.0 | Author | Testar com Copilot, iterar |
| v1.5 | Tech Lead | Review, aprovar, publicar |
| v2.0 | Maintainer | Incorporar feedback do time |
```

## Critério de sucesso
- Critérios são práticos (não teóricos)
- Mensuráveis (pode-se objetivamente dizer "madura" ou "não")
- Realistas (não espera 100% de perfeição)
- Aplicáveis a diferentes níveis de skills

## Notas
- Estes critérios serão aplicados a todas as skills do projeto
- Feedback do time alimenta evolução para v2.0
- Skills degradam em maturidade se dependências mudarem (ex: Azure Functions v5 sai, skill v2.0 em azure-functions-endpoint fica "v1.5" até atualizar)
