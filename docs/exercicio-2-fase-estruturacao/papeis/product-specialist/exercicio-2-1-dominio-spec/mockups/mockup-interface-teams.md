# Mockups — Interface do Assistente NovaTech no Teams

> Esboços de layout em texto/ASCII para os três cenários principais de resposta.
> Estes mockups devem ser reproduzidos em Claude Design para visualização final.

---

## Notas de Design

**Paleta de cores:**
- Azul NovaTech (primário): `#0057B8`
- Verde confiança: `#2E7D32`
- Amarelo alerta: `#F57F17`
- Vermelho escalação: `#C62828`
- Fundo card: `#F5F7FA`
- Texto: `#1A1A2E`

**Tipografia:** Segoe UI (padrão Teams), 14px corpo, 12px metadados

**Princípios:**
1. Resposta → Fonte → Confiança: essa ordem, sempre
2. Status visual por ícone+cor (não só texto)
3. Fonte destacada — nunca em rodapé invisível
4. Avisos em destaque amarelo/vermelho antes da resposta
5. Cabe em tela mobile (max 320px largura útil)

---

## Cenário 1 — Resposta Simples com Confiança Alta

**Pergunta simulada:** "Qual o SLA de primeira resposta para cliente Gold?"

```
╔══════════════════════════════════════════════╗
║  🤖 Assistente NovaTech                      ║
╠══════════════════════════════════════════════╣
║                                              ║
║  📨 Sua pergunta:                            ║
║  "Qual o SLA de primeira resposta para       ║
║   cliente Gold?"                             ║
║                                              ║
╠══════════════════════════════════════════════╣
║                                              ║
║  ✅  Resposta                                ║
║                                              ║
║  Clientes Gold têm SLA de primeira           ║
║  resposta de:                                ║
║                                              ║
║    • Chamados gerais: até 2 horas úteis      ║
║    • Incidentes críticos: até 30 minutos     ║
║      (relógio não pausa fora do horário      ║
║       comercial para incidentes críticos)    ║
║                                              ║
╠══════════════════════════════════════════════╣
║  📎 Fonte: SLA-2024, seção 2                 ║
║     Última atualização: 02/01/2024           ║
║  🟢 Confiança: Alta                          ║
╚══════════════════════════════════════════════╝
```

**Anotações de design:**
- ✅ verde indica confiança alta sem precisar ler rótulo
- Fonte em destaque na parte inferior do card (não oculta)
- Bullet points para comparação rápida (chamado geral vs crítico)
- Nota sobre incidentes críticos Gold é informação diferencial que o atendente precisa

**Requirement refletido:** VC-F01, C2 (português formal), C5 (source_document)

---

## Cenário 2 — Resposta com Fontes Contraditórias

**Pergunta simulada:** "Qual o multiplicador de frete para carga de 2.000kg para o Nordeste?"

```
╔══════════════════════════════════════════════╗
║  🤖 Assistente NovaTech                      ║
╠══════════════════════════════════════════════╣
║                                              ║
║  📨 Sua pergunta:                            ║
║  "Qual o multiplicador de frete para carga   ║
║   de 2.000kg para o Nordeste?"               ║
║                                              ║
╠══════════════════════════════════════════════╣
║                                              ║
║  ⚠️  ATENÇÃO: Conflito entre documentos      ║
║  ─────────────────────────────────────────  ║
║  Existem duas versões do PROC-042 ativas     ║
║  simultaneamente. Confirme com o Comercial   ║
║  qual versão se aplica ao contrato do        ║
║  cliente antes de informar o valor.          ║
║                                              ║
╠══════════════════════════════════════════════╣
║                                              ║
║  📄 PROC-042 v1 (Mar/2023)                   ║
║  Multiplicador Nordeste: 1.4                 ║
║  Fator de peso (1.001–3.000kg): 1.2          ║
║  ► Prazo adicional: +2 dias úteis            ║
║                                              ║
║  📄 PROC-042 v2 (Nov/2023)                   ║
║  Multiplicador Nordeste: 1.5                 ║
║  Fator de peso (1.001–3.000kg): 1.15         ║
║  ► Prazo adicional: +3 dias úteis            ║
║                                              ║
║  Fórmula: Valor base × Mult. regional        ║
║           × Fator de peso                    ║
║                                              ║
╠══════════════════════════════════════════════╣
║  📎 Fontes:                                  ║
║     PROC-042 v1, seção 2.1 (03/03/2023)      ║
║     PROC-042 v2, seção 2.1 (10/11/2023)      ║
║  🟡 Confiança: Média — verificar versão      ║
╚══════════════════════════════════════════════╝
```

**Anotações de design:**
- ⚠️ amarelo é visível antes da resposta — atendente vê o alerta antes de ler qualquer valor
- Dois cards distintos para cada versão — comparação lado a lado
- Confiança "Média" com instrução de ação (não apenas status)
- Fórmula incluída para contexto completo

**Requirement refletido:** ADR-0003, C4 (fontes contraditórias), VC-F02, C5

---

## Cenário 3 — Resposta com Baixa Confiança / Escalação

**Pergunta simulada:** "Como funciona o seguro de carga para contratos antigos?"

```
╔══════════════════════════════════════════════╗
║  🤖 Assistente NovaTech                      ║
╠══════════════════════════════════════════════╣
║                                              ║
║  📨 Sua pergunta:                            ║
║  "Como funciona o seguro de carga para       ║
║   contratos antigos?"                        ║
║                                              ║
╠══════════════════════════════════════════════╣
║                                              ║
║  🔴  Informação indisponível na base         ║
║  ─────────────────────────────────────────  ║
║  Não há documento normativo sobre seguro     ║
║  de carga na base de conhecimento atual.     ║
║                                              ║
║  ⚠️  Há menção no FAQ informal (item 22),    ║
║  mas este documento NÃO foi validado por     ║
║  Compliance ou Operações.                    ║
║                                              ║
║  FAQ diz (não validado):                     ║
║  "0,3% para cargas padrão; 0,8% para        ║
║   perigosas. Contratos pré-2023 podem        ║
║   ter percentuais diferentes."               ║
║                                              ║
╠══════════════════════════════════════════════╣
║  ↗️  Escalação recomendada                   ║
║  Encaminhe para o Comercial para             ║
║  confirmação nos termos do contrato.         ║
║                                              ║
╠══════════════════════════════════════════════╣
║  📎 Referência parcial:                      ║
║     FAQ-Atendimento (documento informal),    ║
║     item 22                                  ║
║  🔴 Confiança: Baixa — escalação sugerida    ║
╚══════════════════════════════════════════════╝
```

**Anotações de design:**
- 🔴 vermelho imediato — atendente sabe antes de ler que não pode usar esta informação com o cliente
- FAQ é apresentado com aviso claro de "não validado" (C7 do requirements)
- Ação de escalação explícita com destaque (não apenas mencionada)
- Confiança 🔴 com instrução de ação no rótulo

**Requirement refletido:** C6, C7, VC-R03, VC-R04, C5

---

## Resumo de Mapeamento Requirements → Design

| Requirement | Elemento de Design |
|-------------|-------------------|
| C1 — resposta < 30s | Layout minimalista sem scroll; resposta no topo |
| C2 — português formal | Texto nos mockups validado (sem gírias) |
| C3 — nunca inventar dados | Valores sempre citados com fonte |
| C4 — fontes contraditórias | Cenário 2: dois cards distintos + aviso ⚠️ |
| C5 — source_document | Rodapé de fonte em destaque em todos os cenários |
| C6 — baixa confiança → escalação | Cenário 3: bloco escalação explícito |
| C7 — FAQ com aviso | Cenário 3: "documento NÃO validado" em destaque |
| Outcome primário | Estrutura pergunta→resposta→fonte permite resposta em < 30s |
