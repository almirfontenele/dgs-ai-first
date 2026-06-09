# Entregável — Exercício 2.1: Riscos de Segurança no Uso de MCP

**Desenvolvedor:** Almir Oliveira  
**Data:** 2026-06-09  
**Projeto:** NovaTech — Assistente de Suporte Logístico  
**LLM de apoio:** GitHub Copilot

## 1. Objetivo

Identificar riscos específicos do uso de MCP servers no contexto da NovaTech e propor mitigações práticas que reduzam exposição de dados, abuso de credenciais e ampliação indevida de acesso.

## 2. Riscos Identificados

### Risco 1 — Vazamento de documentação sensível via Confluence

O servidor MCP de Confluence dá acesso a documentação de negócio que pode conter informações sensíveis, como regras operacionais internas, detalhes de clientes e exceções de processo. Se um agente local do time consultar essas páginas e repassar o conteúdo para um modelo em nuvem sem controle, há risco de vazamento de dados.

**Mitigações**
- Limitar o servidor a leitura apenas do espaço da NovaTech necessário ao projeto.
- Aplicar allowlist de páginas e tópicos autorizados.
- Bloquear escrita no Confluence para impedir alterações acidentais ou maliciosas.
- Reduzir logs com conteúdo bruto de páginas consultadas.
- Reforçar revisão humana antes de qualquer compartilhamento externo de trechos sensíveis.

### Risco 2 — Exposição excessiva do filesystem local

Um servidor MCP de filesystem com escopo amplo pode expor arquivos fora do projeto, como `.env`, chaves locais, caches de build, arquivos de configuração pessoal ou dados temporários de outros trabalhos. Isso amplia o impacto de qualquer agente comprometido ou instruído de forma incorreta.

**Mitigações**
- Restringir o filesystem a diretórios explicitamente permitidos do projeto.
- Excluir diretórios pessoais, segredos e arquivos ocultos não necessários.
- Tratar o filesystem como read-only sempre que possível.
- Validar a configuração antes de subir o servidor.
- Usar scanning de segredos no repositório e no workspace.

### Risco 3 — Credenciais superprivilegiadas em Azure

Se Azure AI Search, Azure OpenAI ou Azure DevOps forem configurados com credenciais amplas demais, um agente pode consultar dados além do necessário, enviar prompts com informação sensível ou alterar work items sem autorização. O problema não é apenas acesso indevido, mas também rastreabilidade insuficiente sobre o que foi executado.

**Mitigações**
- Separar credenciais por serviço e por ambiente.
- Usar escopos de leitura por padrão e habilitar escrita somente quando necessário.
- Rotacionar chaves com regularidade.
- Centralizar segredos em um cofre de segredos, nunca em texto plano.
- Registrar auditoria mínima de uso sem expor payload completo.

## 3. Conclusão

Os principais riscos de MCP neste projeto vêm de acesso excessivo a conteúdo sensível e de credenciais com escopo maior do que o necessário. O desenho recomendado é manter cada servidor no menor raio de ação possível, com leitura por padrão, allowlists explícitas e auditoria compatível com o uso do ambiente de desenvolvimento.