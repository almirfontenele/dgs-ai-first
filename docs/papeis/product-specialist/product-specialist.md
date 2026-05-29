# Papel: Product Specialist

**Projeto:** Assistente de IA para Atendimento — NovaTech  
**Data:** 2026-05-29  
**Versão:** 1.0

---

## Responsabilidades Principais

O **Product Specialist** atua como intermediário entre o cliente (NovaTech), o usuário final (atendentes), e a engenharia (Tech Lead, Prompt Engineer). Sua missão é garantir que o produto **entrega valor real** e que **os usuários confiam nele**.

### 1. Alinhamento de Expectativas
- Traduzir o que a diretoria espera em métricas mensuráveis e viáveis
- Comunicar limitações técnicas (LLMs não são determinísticos, RAG depende da qualidade da base)
- Documentar formalmente o que é escopo V1 vs. V1.1

### 2. Habilitação de Usuários
- Desenhar plano de treinamento (vídeos, guias, sessões ao vivo)
- Criar materiais de documentação (FAQ, guias rápidos, troubleshooting)
- Monitorar adoção; intervir se usuários não estão usando

### 3. Feedback e Iteração Contínua
- Coletar feedback em múltiplos níveis (inline, surveys, focus groups)
- Investigar rapidamente problemas emergentes
- Priorizar melhorias baseado em dados (thumbs down rate, NPS, escaladas)

### 4. Comunicação Cross-Functional
- Manter sponsor (diretoria) informado do progresso e riscos
- Traduzir feedback dos usuários para o tech team em termos acionáveis
- Documentar decisões para rastreabilidade

---

## Três Pilares de Trabalho

### Pilar 1: **Viabilidade & Expectativas** (Semana 1, antes de kickoff)
Garantir que todos estão no mesmo filme sobre o que o produto faz e não faz.

**Artefatos Esperados:**
- Documento de alinhamento de expectativas
- Matriz de stakeholders (sponsor, tech, usuários) com mensagem customizada
- Checklist de pré-kickoff (pré-condições a serem atendidas)

**Métrica de Sucesso:**
Sponsor assina termo de abertura sem pedidos de escopo adicional. Tech Lead inicia com cronograma confiante.

---

### Pilar 2: **Habilitação & Adoção** (Semana 2-4, durante e após go-live)
Garantir que os usuários entendem como usar e confiam no produto.

**Artefatos Esperados:**
- Plano de habilitação em fases (pré-lançamento, lançamento, pós-lançamento)
- Materiais de treinamento (vídeos, guias, slides)
- Dashboard de adoção (atualizado diariamente)
- Protocolo de suporte reativo (SLA < 2h)

**Métrica de Sucesso:**
80%+ de atendentes completaram treinamento. Nenhum atendente relata "não sabia como usar". Dashboard mostra crescimento de adoção dia-a-dia.

---

### Pilar 3: **Feedback & Iteração Rápida** (Contínuo, a partir de D+0)
Garantir que o produto melhora continuamente baseado em dados reais de uso.

**Artefatos Esperados:**
- Framework de coleta de feedback (operacional, estruturado, diagnóstico)
- Ciclos de iteração definidos (1 semana para fixes, 1 mês para decisões estratégicas)
- Dashboard de saúde do produto (atualizado 4x/dia)
- Relatórios semanais de feedback para stakeholders

**Métrica de Sucesso:**
Em D+7, conseguir demonstrar ao sponsor: "Aqui está o que aprendemos, aqui está o que mudamos baseado em feedback." Produto melhora visivelmente a cada semana.

---

## Relação com Outros Papéis

| Papel | Interação | Frequência |
|-------|-----------|-----------|
| **Sponsor (Diretoria NovaTech)** | Alinhamento de expectativas; status mensal | Semanal (status), Mensal (review) |
| **Tech Lead (DB1)** | Traduzir feedback em ações técnicas; priorizar backlog | Diária (during fixes), Semanal (planning) |
| **Atendentes (Usuários Finais)** | Treinamento; coleta de feedback | Contínuo (feedback), Semanal (surveys), Mensal (focus groups) |
| **Supervisor (NovaTech)** | Qualidade observada; escalações | Semanal (feedback), Diária (se há problema agudo) |
| **Delivery Manager (DB1)** | Alinhamento de cronograma; riscos de escopo | Semanal |

---

## Como Começar: Sequência Recomendada

### Semana 1: Alinhamento (Antes do Kickoff)
1. Ler o PRD e a análise de viabilidade (delivery manager)
2. **Fazer Exercício 1.1:** Mapear expectativas vs. realidade
3. Conduza a sessão de expectativas com sponsor (use matriz do exercício 1.1)
4. Obtenha alinhamento formal (assinatura de termo de abertura)

### Semana 2-4: Habilitação (Durante Desenvolvimento + Go-Live)
1. Preparar materiais de treinamento (video, guia, FAQ)
2. **Fazer Exercício 1.2:** Estruturar plano de habilitação
3. Conduzir sessões de treinamento ao vivo (D-2)
4. Monitorar adoção pós-go-live (dashboard diário)

### Semana 4+: Feedback & Iteração (Contínuo)
1. Implementar mecanismos de feedback (thumbs up/down, surveys, focus groups)
2. **Fazer Exercício 1.3:** Estruturar ciclo de feedback e iteração
3. Publicar relatórios semanais de feedback
4. Priorizar e coordenar melhorias rápidas com tech team

---

## Ferramentas & Templates

### Essencial
- **Dashboard de Adoção:** Excel ou Power BI atualizado diariamente
- **Relatório Semanal de Feedback:** Template markdown/e-mail
- **Matriz de Stakeholders:** Word/Google Docs com mensagens customizadas
- **Cronograma de Eventos:** Google Calendar com todas as datas

### Desejável
- **Pesquisa de NPS:** SurveySparrow ou Google Forms
- **Log de Feedback:** Azure Table Storage ou Airtable
- **Canal de Suporte:** Teams channel #assistente-ia-suporte
- **Wiki de FAQ:** Notion ou Confluence

---

## Indicadores de Saúde

### ✅ Tudo Certo
- Sponsor alinhado com expectativas (nenhum pedido de scope surpresa)
- > 80% de atendentes completaram treinamento
- Dashboard de adoção mostra crescimento dia-a-dia
- Error rate < 5% em todas as categorias
- NPS > 6/10
- Feedback coletado e acionado dentro de 48h

### ⚠️ Cuidado
- Sponsor pede features não planejadas (risco de escopo)
- < 60% de atendentes completaram treinamento (D+3)
- Adoção estagnada em 30% (não crescendo)
- Error rate > 10% em qualquer categoria
- NPS < 5/10
- Tickets de suporte acumulando (> 5 abertos)

### 🚨 Crítico
- Sponsor desconfiado de viabilidade (não assinou termo)
- < 40% de atendentes completaram treinamento (D+5)
- Adoção caindo (usuários abandonando)
- Error rate > 20% em qualquer categoria
- NPS < 3/10
- Usuários reportando "respostas perigosamente erradas"

---

## Próxima Leitura

Para aprofundar em cada pilar:
1. **Exercício 1.1:** [[exercicio-1-1-mapeamento-expectativas.md]] — Como mapear expectativas
2. **Exercício 1.2:** [[exercicio-1-2-plano-habilitacao.md]] — Como habilitar usuários
3. **Exercício 1.3:** [[exercicio-1-3-estrategia-feedback-iteracao.md]] — Como iterar rapidamente

Cada exercício é auto-contido mas complementar.

---

## FAQ do Papel

**P: Por que precisamos de um Product Specialist se temos um Delivery Manager?**  
R: Delivery Manager foca em cronograma e risco técnico. Product Specialist foca em valor entregue e confiança do usuário. São preocupações complementares.

**P: Por quanto tempo o Product Specialist precisa estar envolvido?**  
R: V1 inteiro (go-live + 30 dias). Depois, pode ser escalonado (feedback coletado por Supervisor, relatórios produzidos 1x/semana ao invés de diário). Para V1.1+, retoma full-time durante planning.

**P: E se não há Product Specialist? Quem faz esse trabalho?**  
R: Delivery Manager + Tech Lead + Sponsor do cliente repartem: DM foca em planejamento (exercício 1.1), Tech Lead + customer sponsor implementam treinamento (exercício 1.2), customer sponsor coleta feedback (exercício 1.3). Menos eficiente, mas possível.

**P: Qual é a diferença entre este papel e o que o Delivery Manager fez?**  
R: DM focou em "é viável?" (risco técnico + prazo). PS foca em "vai ser adotado e será percebido como sucesso?" (valor + confiança). DM trabalhou antes do kickoff; PS trabalha durante kickoff + depois.

