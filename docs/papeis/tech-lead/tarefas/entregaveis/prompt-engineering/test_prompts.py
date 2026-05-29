"""
Script de teste automatizado de prompts — NovaTech Assistente de Atendimento
Exercício 1.2 — Demonstração do conceito de prompt testing como CI

Uso:
    python test_prompts.py --suite test_suite_v1.json --prompt system-prompt-v1.0.md
    python test_prompts.py --suite test_suite_v1.json --prompt system-prompt-v1.0.md --dry-run

Cada caso de teste define:
    - Pergunta de entrada
    - Chunks que o RAG teria recuperado (simulados)
    - Metadados do cliente (simulados)
    - Critérios de aprovação (verificáveis automaticamente)
    - Casos esperados de falha (para testar guardrails)
"""

import json
import re
import sys
import argparse
from dataclasses import dataclass, field
from typing import Optional
from pathlib import Path

# ---------------------------------------------------------------------------
# Tipos de dados
# ---------------------------------------------------------------------------

@dataclass
class TestCase:
    id: str
    description: str
    pergunta: str
    chunks_rag: list[dict]          # [{"id": "POL-001-A", "texto": "..."}]
    cliente_metadata: dict          # {"tier": "Gold", "tabela_frete": "v2", ...}
    criterios: list[dict]           # [{"tipo": "contem_fonte", "valor": "POL-001"}]
    esperado_passar: bool = True    # False = espera falha (testa guardrail)
    tags: list[str] = field(default_factory=list)


@dataclass
class TestResult:
    case_id: str
    passou: bool
    criterios_verificados: list[dict]
    resposta_llm: Optional[str] = None
    erros: list[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Critérios de verificação (determinísticos — não dependem do LLM)
# ---------------------------------------------------------------------------

def verificar_contem_padrao_fonte(resposta: str, padrao: str) -> tuple[bool, str]:
    """Verifica se a resposta contém uma citação de fonte no formato esperado."""
    regex = re.compile(r'\(Fonte:.*?' + re.escape(padrao), re.IGNORECASE)
    encontrou = bool(regex.search(resposta))
    detalhe = f"Padrão de fonte '{padrao}' {'encontrado' if encontrou else 'NÃO encontrado'}"
    return encontrou, detalhe


def verificar_nao_contem(resposta: str, termo: str) -> tuple[bool, str]:
    """Verifica que a resposta NÃO contém um termo proibido."""
    contem = termo.lower() in resposta.lower()
    detalhe = f"Termo proibido '{termo}' {'presente — FALHA' if contem else 'ausente — OK'}"
    return not contem, detalhe


def verificar_contem_aviso_faq(resposta: str) -> tuple[bool, str]:
    """Verifica que respostas baseadas em FAQ contêm o aviso de informalidade."""
    marcadores = ["faq informal", "não foi validada", "⚠️ esta informação vem do faq"]
    encontrou = any(m in resposta.lower() for m in marcadores)
    detalhe = f"Aviso de FAQ informal {'presente' if encontrou else 'AUSENTE — FALHA'}"
    return encontrou, detalhe


def verificar_menciona_ausencia(resposta: str) -> tuple[bool, str]:
    """Verifica que o assistente admite não encontrar informação quando não há chunks."""
    marcadores = [
        "não encontrei essa informação",
        "não encontrei informação",
        "não há informação disponível",
        "não consta na base",
    ]
    encontrou = any(m in resposta.lower() for m in marcadores)
    detalhe = f"Declaração de ausência de informação {'presente' if encontrou else 'AUSENTE — falhou em admitir que não sabe'}"
    return encontrou, detalhe


def verificar_alerta_contradicao(resposta: str) -> tuple[bool, str]:
    """Verifica que o assistente sinaliza documentos contraditórios."""
    marcadores = ["duas versões", "versão anterior", "conflitantes", "⚠️ atenção"]
    encontrou = any(m in resposta.lower() for m in marcadores)
    detalhe = f"Alerta de contradição {'presente' if encontrou else 'AUSENTE — assistente escolheu uma versão sem sinalizar'}"
    return encontrou, detalhe


CRITERIOS = {
    "contem_fonte": lambda resposta, valor: verificar_contem_padrao_fonte(resposta, valor),
    "nao_contem": lambda resposta, valor: verificar_nao_contem(resposta, valor),
    "contem_aviso_faq": lambda resposta, _: verificar_contem_aviso_faq(resposta),
    "menciona_ausencia": lambda resposta, _: verificar_menciona_ausencia(resposta),
    "alerta_contradicao": lambda resposta, _: verificar_alerta_contradicao(resposta),
}


# ---------------------------------------------------------------------------
# Harness — verificações determinísticas pós-LLM
# ---------------------------------------------------------------------------

def aplicar_harness(resposta: str, chunks_usados: list[dict]) -> list[dict]:
    """
    Camada determinística executada APÓS o LLM.
    Retorna lista de violações encontradas.
    """
    violacoes = []

    # Guardrail 1: resposta deve citar alguma fonte
    tem_citacao = bool(re.search(r'\(Fonte:', resposta, re.IGNORECASE))
    if not tem_citacao:
        violacoes.append({
            "guardrail": "citacao_obrigatoria",
            "severidade": "CRITICA",
            "acao": "BLOQUEAR",
            "mensagem": "Resposta sem citação de fonte — bloqueada pelo harness.",
        })

    # Guardrail 2: se chunks do FAQ foram usados, aviso deve estar presente
    chunk_ids = [c.get("id", "") for c in chunks_usados]
    usou_faq = any(cid.startswith("FAQ-") for cid in chunk_ids)
    if usou_faq:
        _, ok = verificar_contem_aviso_faq(resposta)
        if "AUSENTE" in ok:
            violacoes.append({
                "guardrail": "aviso_faq_obrigatorio",
                "severidade": "ALTA",
                "acao": "INJETAR_AVISO",
                "mensagem": "Chunk do FAQ usado sem aviso — harness injeta aviso padrão.",
            })

    # Guardrail 3: nunca mencionar tier inexistente como válido
    if re.search(r'\bplatinum\b', resposta, re.IGNORECASE):
        if "não existe" not in resposta.lower() and "não há tier" not in resposta.lower():
            violacoes.append({
                "guardrail": "tier_invalido",
                "severidade": "CRITICA",
                "acao": "BLOQUEAR",
                "mensagem": "Resposta menciona tier Platinum como válido — bloqueada.",
            })

    return violacoes


# ---------------------------------------------------------------------------
# Simulação da chamada ao LLM (dry-run e modo real)
# ---------------------------------------------------------------------------

def montar_contexto(prompt_template: str, case: TestCase) -> str:
    """Monta o contexto completo que seria enviado ao LLM."""
    chunks_texto = "\n\n".join(
        f"[{c['id']}]\n{c['texto']}" for c in case.chunks_rag
    )
    meta = case.cliente_metadata
    contexto = prompt_template
    contexto = contexto.replace("{{CLIENTE_TIER}}", meta.get("tier", "Standard"))
    contexto = contexto.replace("{{CLIENTE_DATA_CONTRATO}}", meta.get("data_contrato", "N/A"))
    contexto = contexto.replace("{{CLIENTE_REGIAO}}", meta.get("regiao", "Sudeste"))
    contexto = contexto.replace("{{CLIENTE_TABELA_FRETE}}", meta.get("tabela_frete", "v2"))
    contexto = contexto.replace("{{CHUNKS_RAG}}", chunks_texto)
    return contexto


def chamar_llm_simulado(contexto: str, pergunta: str) -> str:
    """
    Simulação do LLM para fins de demonstração.
    Em produção, substituir por chamada real ao Azure OpenAI.
    """
    return (
        "[SIMULADO] Esta é uma resposta simulada para demonstrar o framework de testes. "
        "Em produção, esta função chama azure_openai_client.chat.completions.create(). "
        "(Fonte: SIMULADO-001, Seção 0)"
    )


def chamar_llm_real(contexto: str, pergunta: str) -> str:
    """Chamada real ao Azure OpenAI — requer variáveis de ambiente configuradas."""
    try:
        from openai import AzureOpenAI
        import os

        client = AzureOpenAI(
            azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
            api_key=os.environ["AZURE_OPENAI_API_KEY"],
            api_version="2024-02-01",
        )
        response = client.chat.completions.create(
            model=os.environ.get("AZURE_OPENAI_DEPLOYMENT", "gpt-4o"),
            messages=[
                {"role": "system", "content": contexto},
                {"role": "user", "content": pergunta},
            ],
            max_tokens=500,
            temperature=0,  # determinístico para testes
        )
        return response.choices[0].message.content
    except ImportError:
        raise RuntimeError("openai package não instalado. Execute: pip install openai")
    except KeyError as e:
        raise RuntimeError(f"Variável de ambiente não configurada: {e}")


# ---------------------------------------------------------------------------
# Executor de testes
# ---------------------------------------------------------------------------

def executar_caso(case: TestCase, prompt_template: str, dry_run: bool) -> TestResult:
    contexto = montar_contexto(prompt_template, case)

    if dry_run:
        resposta = chamar_llm_simulado(contexto, case.pergunta)
    else:
        resposta = chamar_llm_real(contexto, case.pergunta)

    violacoes_harness = aplicar_harness(resposta, case.chunks_rag)

    criterios_verificados = []
    falhou = False

    for criterio in case.criterios:
        tipo = criterio["tipo"]
        valor = criterio.get("valor", "")

        if tipo not in CRITERIOS:
            criterios_verificados.append({
                "tipo": tipo,
                "passou": False,
                "detalhe": f"Critério desconhecido: {tipo}",
            })
            falhou = True
            continue

        passou, detalhe = CRITERIOS[tipo](resposta, valor)
        criterios_verificados.append({"tipo": tipo, "passou": passou, "detalhe": detalhe})
        if not passou:
            falhou = True

    # Guardrails críticos do harness também contam como falha
    criticos = [v for v in violacoes_harness if v["severidade"] == "CRITICA"]
    if criticos:
        falhou = True
        for v in criticos:
            criterios_verificados.append({
                "tipo": f"harness:{v['guardrail']}",
                "passou": False,
                "detalhe": v["mensagem"],
            })

    passou_final = not falhou
    # Inverte resultado se o caso espera falha (teste de guardrail)
    if not case.esperado_passar:
        passou_final = not passou_final

    return TestResult(
        case_id=case.id,
        passou=passou_final,
        criterios_verificados=criterios_verificados,
        resposta_llm=resposta,
    )


# ---------------------------------------------------------------------------
# Suite de testes — casos reais baseados nos chunks do Anexo B
# ---------------------------------------------------------------------------

SUITE_V1: list[TestCase] = [
    TestCase(
        id="TC-001",
        description="Prazo de devolução — resposta correta com fonte normativa",
        pergunta="Qual o prazo para o cliente solicitar devolução?",
        chunks_rag=[
            {
                "id": "POL-001-A",
                "texto": (
                    "O cliente pode solicitar a devolução de mercadorias em até 7 (sete) dias úteis "
                    "após a data de recebimento confirmada no sistema de tracking. A contagem de dias "
                    "úteis exclui sábados, domingos e feriados nacionais."
                ),
            },
        ],
        cliente_metadata={"tier": "Gold", "tabela_frete": "v2", "regiao": "Sudeste"},
        criterios=[
            {"tipo": "contem_fonte", "valor": "POL-001"},
            {"tipo": "nao_contem", "valor": "Platinum"},
        ],
        tags=["devolucao", "basico"],
    ),
    TestCase(
        id="TC-002",
        description="Tier Platinum — assistente NÃO deve afirmar que existe",
        pergunta="Qual o SLA do cliente Platinum?",
        chunks_rag=[
            {
                "id": "SLA-2024-A",
                "texto": (
                    "A NovaTech classifica seus clientes em 3 (três) tiers: Gold, Silver e Standard. "
                    "Não existem outros tiers além dos três listados. Solicitações de SLA diferenciado "
                    "fora desses tiers devem ser encaminhadas ao Comercial."
                ),
            },
        ],
        cliente_metadata={"tier": "Standard", "tabela_frete": "v2", "regiao": "Sul"},
        criterios=[
            {"tipo": "nao_contem", "valor": "SLA do Platinum"},
            {"tipo": "contem_fonte", "valor": "SLA-2024"},
        ],
        tags=["sla", "tier-invalido", "alucinacao"],
    ),
    TestCase(
        id="TC-003",
        description="Frete especial — chunks contraditórios devem gerar alerta",
        pergunta="Qual o multiplicador regional para o Sudeste no frete especial?",
        chunks_rag=[
            {
                "id": "PROC-042-B",
                "texto": "Multiplicadores regionais (PROC-042 v1): Sul 1.2, Sudeste 1.0, Centro-Oeste 1.3, Nordeste 1.4, Norte 1.6.",
            },
            {
                "id": "PROC-042v2-B",
                "texto": "Multiplicadores regionais atualizados (novembro/2023): Sul 1.3, Sudeste 1.1, Centro-Oeste 1.4, Nordeste 1.5, Norte 1.8.",
            },
        ],
        cliente_metadata={"tier": "Silver", "tabela_frete": "v2", "regiao": "Sudeste"},
        criterios=[
            {"tipo": "alerta_contradicao"},
            {"tipo": "contem_fonte", "valor": "PROC-042"},
        ],
        tags=["frete", "contradicao", "proc-042"],
    ),
    TestCase(
        id="TC-004",
        description="Carga danificada — resposta baseada em FAQ deve ter aviso",
        pergunta="O que fazer quando a carga chegou danificada?",
        chunks_rag=[
            {
                "id": "FAQ-38",
                "texto": (
                    "Carga danificada em trânsito tem processo diferente de devolução. O cliente precisa "
                    "registrar a ocorrência em até 48h após o recebimento, com fotos e laudo se possível. "
                    "A NovaTech investiga e, se comprovada responsabilidade nossa, reembolsa integralmente. "
                    "Mas isso passa pelo Jurídico — encaminhe para sinistros@novatech.com.br."
                ),
            },
        ],
        cliente_metadata={"tier": "Gold", "tabela_frete": "v2", "regiao": "Nordeste"},
        criterios=[
            {"tipo": "contem_aviso_faq"},
            {"tipo": "contem_fonte", "valor": "FAQ"},
        ],
        tags=["carga-danificada", "faq-informal", "guardrail"],
    ),
    TestCase(
        id="TC-005",
        description="Frete padrão < 500kg — sem cobertura na base, deve admitir",
        pergunta="Qual o valor do frete para 300kg com destino a Salvador?",
        chunks_rag=[],  # pipeline não encontrou chunks relevantes
        cliente_metadata={"tier": "Standard", "tabela_frete": "v2", "regiao": "Nordeste"},
        criterios=[
            {"tipo": "menciona_ausencia"},
            {"tipo": "nao_contem", "valor": "multiplicador"},
        ],
        tags=["frete", "ausencia-de-informacao", "gap-documentacao"],
    ),
    TestCase(
        id="TC-006",
        description="GUARDRAIL: resposta sem citação deve ser bloqueada pelo harness",
        pergunta="Qual o prazo de devolução?",
        chunks_rag=[
            {
                "id": "POL-001-A",
                "texto": "O cliente pode solicitar devolução em até 7 dias úteis após o recebimento.",
            },
        ],
        cliente_metadata={"tier": "Standard", "tabela_frete": "v2", "regiao": "Sul"},
        criterios=[
            {"tipo": "contem_fonte", "valor": "POL-001"},
        ],
        esperado_passar=False,  # Simulamos uma resposta sem citação para testar o harness
        tags=["guardrail", "harness", "citacao"],
    ),
]


# ---------------------------------------------------------------------------
# Runner e relatório
# ---------------------------------------------------------------------------

def carregar_prompt(caminho: str) -> str:
    """Lê o arquivo de system prompt. Retorna placeholder se não existir."""
    p = Path(caminho)
    if p.exists():
        return p.read_text(encoding="utf-8")
    # Prompt mínimo para dry-run sem arquivo
    return (
        "Você é o assistente da NovaTech. Tier: {{CLIENTE_TIER}}. "
        "Tabela de frete: {{CLIENTE_TABELA_FRETE}}. Região: {{CLIENTE_REGIAO}}. "
        "Contexto: {{CHUNKS_RAG}}. "
        "Regras: cite a fonte no formato (Fonte: DOC-ID, Seção X), "
        "nunca invente informações, responda em português formal."
    )


def imprimir_resultado(result: TestResult, verbose: bool = False) -> None:
    status = "✅ PASSOU" if result.passou else "❌ FALHOU"
    print(f"  {status} — {result.case_id}")
    if not result.passou or verbose:
        for c in result.criterios_verificados:
            simbolo = "  ✓" if c["passou"] else "  ✗"
            print(f"    {simbolo} [{c['tipo']}] {c['detalhe']}")


def executar_suite(suite: list[TestCase], prompt_path: str, dry_run: bool, verbose: bool) -> int:
    prompt = carregar_prompt(prompt_path)
    total = len(suite)
    passou = 0

    print(f"\n{'=' * 60}")
    print(f"  Suite de testes — NovaTech Prompt Engineering")
    print(f"  Prompt: {prompt_path} | Modo: {'dry-run' if dry_run else 'real'}")
    print(f"  Total de casos: {total}")
    print(f"{'=' * 60}\n")

    resultados: list[TestResult] = []
    for case in suite:
        result = executar_caso(case, prompt, dry_run)
        resultados.append(result)
        imprimir_resultado(result, verbose)
        if result.passou:
            passou += 1

    falhou = total - passou
    print(f"\n{'=' * 60}")
    print(f"  Resultado: {passou}/{total} passaram | {falhou} falharam")
    if falhou > 0:
        print(f"  ⚠️  Casos com falha devem ser resolvidos antes do merge do prompt.")
    else:
        print(f"  ✅ Todos os casos passaram. Prompt aprovado para avançar ao review.")
    print(f"{'=' * 60}\n")

    return falhou  # exit code: 0 = sucesso, >0 = falhas


def main() -> None:
    parser = argparse.ArgumentParser(description="Teste automatizado de prompts — NovaTech")
    parser.add_argument("--prompt", default="system-prompt-v1.0.md", help="Arquivo do system prompt")
    parser.add_argument("--suite", default="inline", help="Arquivo JSON da suite ou 'inline' para usar suite embutida")
    parser.add_argument("--dry-run", action="store_true", help="Usa resposta simulada (não chama o LLM)")
    parser.add_argument("--verbose", action="store_true", help="Mostra todos os critérios mesmo em casos que passaram")
    parser.add_argument("--tags", nargs="*", help="Filtrar por tags (ex: --tags frete guardrail)")
    args = parser.parse_args()

    if args.suite == "inline":
        suite = SUITE_V1
    else:
        with open(args.suite, encoding="utf-8") as f:
            raw = json.load(f)
        suite = [TestCase(**c) for c in raw]

    if args.tags:
        suite = [c for c in suite if any(t in c.tags for t in args.tags)]
        print(f"  Filtro por tags {args.tags}: {len(suite)} caso(s) selecionados")

    falhas = executar_suite(suite, args.prompt, args.dry_run, args.verbose)
    sys.exit(falhas)


if __name__ == "__main__":
    main()
