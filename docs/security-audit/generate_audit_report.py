import os
import sys
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas
import pymupdf

# Diretórios
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PDF = os.path.join(BASE_DIR, "relatorio-auditoria-seguranca.pdf")
IMG_DIR = os.path.join(BASE_DIR, "assets")
os.makedirs(IMG_DIR, exist_ok=True)

# Paleta oficial requerida
PALETTE = {
    "critica": "#B91C1C",
    "alta": "#EA580C",
    "media": "#D97706",
    "baixa": "#2563EB",
    "ponto_forte": "#059669",
    "informativa": "#64748B",
    "dark": "#0F172A",
    "light": "#F8FAFC",
    "border": "#CBD5E1",
    "text": "#1E293B",
    "muted": "#64748B",
}

def generate_charts():
    # 1. Gráfico de Rosca por Severidade
    labels_sev = ['Crítica (1)', 'Alta (2)', 'Média (2)', 'Baixa (1)']
    sizes_sev = [1, 2, 2, 1]
    colors_sev = [PALETTE["critica"], PALETTE["alta"], PALETTE["media"], PALETTE["baixa"]]

    fig, ax = plt.subplots(figsize=(3.8, 2.7), subplot_kw=dict(aspect="equal"))
    wedges, texts, autotexts = ax.pie(
        sizes_sev,
        labels=labels_sev,
        autopct='%1.0f%%',
        startangle=140,
        colors=colors_sev,
        pctdistance=0.75,
        textprops=dict(color="#0F172A", size=8, weight="bold"),
        wedgeprops=dict(width=0.42, edgecolor='white', linewidth=2)
    )
    for autotext in autotexts:
        autotext.set_color('white')
        autotext.set_fontsize(8.5)
        autotext.set_weight('bold')
    ax.set_title("Achados por Severidade", fontsize=10, fontweight='bold', pad=8, color=PALETTE["dark"])
    plt.tight_layout()
    chart_sev_path = os.path.join(IMG_DIR, "chart_severity.png")
    plt.savefig(chart_sev_path, dpi=220, transparent=True)
    plt.close()

    # 2. Gráfico de Barras por Categoria
    categorias = [
        '1. Banco sem Tranca',
        '2. Permissão Navegador',
        '3. IDOR / Auth Objeto',
        '4. Chaves Expostas',
        '5. Inputs / XSS / Headers'
    ]
    contagens = [1, 0, 1, 2, 2]

    fig, ax = plt.subplots(figsize=(4.8, 2.7))
    bars = ax.barh(categorias[::-1], contagens[::-1], color=[
        PALETTE["media"], PALETTE["alta"], PALETTE["alta"], PALETTE["informativa"], PALETTE["critica"]
    ], height=0.52, edgecolor='none')
    
    ax.set_xlim(0, 3)
    ax.set_xticks([0, 1, 2, 3])
    ax.set_xlabel("Número de Vulnerabilidades", fontsize=7.5, color=PALETTE["muted"], fontweight='bold')
    ax.set_title("Achados por Categoria Auditada", fontsize=10, fontweight='bold', pad=8, color=PALETTE["dark"])
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(PALETTE["border"])
    ax.spines['bottom'].set_color(PALETTE["border"])
    ax.tick_params(colors=PALETTE["text"], labelsize=7.5)

    for bar in bars:
        w = bar.get_width()
        if w > 0:
            ax.text(w + 0.08, bar.get_y() + bar.get_height()/2, f'{int(w)}',
                    va='center', ha='left', fontsize=8.5, fontweight='bold', color=PALETTE["dark"])

    plt.tight_layout()
    chart_cat_path = os.path.join(IMG_DIR, "chart_category.png")
    plt.savefig(chart_cat_path, dpi=220, transparent=True)
    plt.close()

    return chart_sev_path, chart_cat_path

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_number(self, page_count):
        if self._pageNumber == 1:
            return
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor(PALETTE["muted"]))
        
        # Cabeçalho
        self.setStrokeColor(colors.HexColor(PALETTE["border"]))
        self.setLineWidth(0.5)
        self.line(18 * mm, 283 * mm, 192 * mm, 283 * mm)
        self.drawString(18 * mm, 285.5 * mm, "Relatório de Auditoria de Segurança — Vou de Van Alagoas")
        self.drawRightString(192 * mm, 285.5 * mm, "CONFIDENCIAL / TÉCNICO")
        
        # Rodapé
        self.line(18 * mm, 15 * mm, 192 * mm, 15 * mm)
        self.drawString(18 * mm, 10.5 * mm, "Engenharia de Segurança & Qualidade de Software")
        page_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(192 * mm, 10.5 * mm, page_text)
        self.restoreState()

def build_pdf():
    chart_sev, chart_cat = generate_charts()
    
    doc = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm
    )

    styles = getSampleStyleSheet()
    
    style_title = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=23,
        leading=27,
        textColor=colors.HexColor(PALETTE["dark"]),
        spaceAfter=8
    )
    style_subtitle = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#0038A8"),
        spaceAfter=18
    )
    style_h1 = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13.5,
        leading=17,
        textColor=colors.HexColor(PALETTE["dark"]),
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )
    style_h2 = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#0038A8"),
        spaceBefore=8,
        spaceAfter=5,
        keepWithNext=True
    )
    style_body = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor(PALETTE["text"]),
        spaceAfter=4
    )
    style_body_bold = ParagraphStyle(
        'Body_Bold_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor(PALETTE["dark"]),
        spaceAfter=3
    )

    story = []

    # =========================================================================
    # PÁGINA 1: CAPA
    # =========================================================================
    story.append(Spacer(1, 20))
    badge_data = [[
        Paragraph("<font color='#0038A8'><b>PROJETO OFICIAL: VOU DE VAN — ALAGOAS</b></font>", style_body)
    ]]
    badge_table = Table(badge_data, colWidths=[174 * mm])
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EFF6FF")),
        ('BORDER', (0,0), (-1,-1), 1, colors.HexColor("#BFDBFE")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 12))

    story.append(Paragraph("Relatório de Auditoria de Segurança", style_title))
    story.append(Paragraph("Avaliação Técnica Sistemática de Riscos, Permissões e Integridade de Código", style_subtitle))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#0038A8"), spaceAfter=16))

    meta_info = [
        [Paragraph("<b>Data da Auditoria:</b>", style_body), Paragraph("05 de Setembro de 2026", style_body)],
        [Paragraph("<b>Escopo Auditado:</b>", style_body), Paragraph("Repositório <code>millersantosbr/Vou-de-Van-Alagoas</code> (Branch: main)", style_body)],
        [Paragraph("<b>Stack Detectada:</b>", style_body), Paragraph("Next.js 16.1 (App Router, SSG Export), React 19, Cloud Firestore (Firebase SDK 11.10), Firebase Hosting, Tailwind CSS, Leaflet Maps.", style_body)],
        [Paragraph("<b>Responsável Técnico:</b>", style_body), Paragraph("Antigravity AI Security Suite (Engenharia de Segurança)", style_body)],
        [Paragraph("<b>Status de Conclusão:</b>", style_body), Paragraph("<font color='#059669'><b>Concluída — 6 Achados Catalogados com Remediações</b></font>", style_body)],
    ]
    t_meta = Table(meta_info, colWidths=[38 * mm, 136 * mm])
    t_meta.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor(PALETTE["border"])),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 16))

    story.append(Paragraph("Nota Metodológica & Mapeamento de Stack", style_h2))
    story.append(Paragraph(
        "A auditoria cobriu rigorosamente cinco categorias essenciais de segurança adaptadas à arquitetura do projeto "
        "(aplicação web estática Next.js exportada em SSG vinculada a projeto Cloud Firestore no Firebase Hosting):<br/>"
        "<b>1. BANCO SEM TRANCA (Isolamento de inquilino/dono):</b> Mapeado para as regras declarativas do Cloud Firestore (<code>firestore.rules</code>), investigando permissões globais de leitura e escritas sem validação de autorização de dono ou inquilino.<br/>"
        "<b>2. PERMISSÃO DEFINIDA NO NAVEGADOR:</b> Mapeado para checagens de gates de papel (isAdmin/canEdit) no client Next.js vs validações correspondentes nas regras de banco.<br/>"
        "<b>3. IDOR (Insecure Direct Object References):</b> Mapeado para manipulação direta de IDs em rotas Next.js (<code>routes/[id]</code>) e mutação de documentos Firestore por ID sem checagem de propriedade.<br/>"
        "<b>4. CHAVES EXPOSTAS (Hardcode):</b> Varredura em código-fonte, arquivos raiz, configurações, variáveis de ambiente, histórico git e scripts de apoio.<br/>"
        "<b>5. INPUTS SEM TRATAMENTO (XSS / Injeção):</b> Análise de <code>dangerouslySetInnerHTML</code>, sanitização de parâmetros de busca, injeção em URLs externas e cabeçalhos HTTP no <code>firebase.json</code>.",
        style_body
    ))

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 2: RESUMO EXECUTIVO & RISCOS CENTRAIS
    # =========================================================================
    story.append(Paragraph("1. Resumo Executivo", style_h1))
    story.append(Paragraph(
        "A análise estática e estrutural identificou que a camada de frontend estático do Vou de Van possui boa higiene "
        "no consumo de dados imutáveis de itinerários, não apresentando pontos clássicos de XSS por interpolação de input de usuário. "
        "Entretanto, <b>duas vulnerabilidades críticas/altas</b> foram identificadas na infraestrutura do banco de dados (Cloud Firestore) "
        "e na gestão de segredos locais (chave de API de IA em texto puro), além da ausência de cabeçalhos de proteção no servidor de hosting.",
        style_body
    ))
    story.append(Spacer(1, 4))

    chart_table_data = [
        [
            Image(chart_sev, width=74 * mm, height=52 * mm),
            Image(chart_cat, width=98 * mm, height=52 * mm)
        ]
    ]
    t_charts = Table(chart_table_data, colWidths=[75 * mm, 99 * mm])
    t_charts.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_charts)
    story.append(Spacer(1, 6))

    resumo_cards = [
        [
            Paragraph("<b>CRÍTICA</b><br/><font size='12' color='#B91C1C'><b>1</b></font>", style_body),
            Paragraph("<b>ALTA</b><br/><font size='12' color='#EA580C'><b>2</b></font>", style_body),
            Paragraph("<b>MÉDIA</b><br/><font size='12' color='#D97706'><b>2</b></font>", style_body),
            Paragraph("<b>BAIXA</b><br/><font size='12' color='#2563EB'><b>1</b></font>", style_body),
            Paragraph("<b>PONTOS FORTES</b><br/><font size='12' color='#059669'><b>4</b></font>", style_body),
        ]
    ]
    t_resumo = Table(resumo_cards, colWidths=[34.8 * mm] * 5)
    t_resumo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor(PALETTE["border"])),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor(PALETTE["border"])),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_resumo)
    story.append(Spacer(1, 10))

    story.append(Paragraph("2. Pontos Fortes e Riscos Centrais", style_h1))
    pf_pw_data = [
        [
            Paragraph("<font color='#059669'><b>PONTOS FORTES (Auditado e Protegido)</b></font>", style_body_bold),
            Paragraph("<font color='#B91C1C'><b>PONTOS FRACOS (Riscos Centrais)</b></font>", style_body_bold)
        ],
        [
            Paragraph(
                "• <b>Imutabilidade do Dataset:</b> Os horários e rotas são consultados de um dataset estático imutável (<code>lib/bus-data.ts</code>), impedindo corrupção via banco.<br/>"
                "• <b>Sanitização de URLs Externas:</b> Parâmetros de GPS para Apple Maps e Google Maps usam <code>encodeURIComponent</code> e números estritos.<br/>"
                "• <b>Higiene no Histórico Git:</b> Não foram encontradas credenciais administrativas de deploy do Firebase nos commits públicos.<br/>"
                "• <b>Isolamento no Client:</b> Ausência de chamadas perigosas a <code>eval()</code> ou injeção de strings de busca em HTML bruto.",
                style_body
            ),
            Paragraph(
                "• <b>Banco Globalmente Aberto:</b> <code>firestore.rules</code> libera leitura completa para qualquer um e escrita para qualquer usuário logado.<br/>"
                "• <b>Chave de IA em Texto Puro:</b> Arquivo <code>apikeyuilora.txt</code> presente na raiz do repositório local.<br/>"
                "• <b>Sem Cabeçalhos de Segurança HTTP:</b> <code>firebase.json</code> não aplica CSP, X-Frame-Options nem mitigação de clickjacking.<br/>"
                "• <b>Validação Silenciosa no Next.js:</b> <code>next.config.mjs</code> configurado com <code>ignoreBuildErrors: true</code>.",
                style_body
            )
        ]
    ]
    t_pfpw = Table(pf_pw_data, colWidths=[87 * mm, 87 * mm])
    t_pfpw.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor("#ECFDF5")),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#FEF2F2")),
        ('BACKGROUND', (0,1), (0,1), colors.HexColor("#F0FDF4")),
        ('BACKGROUND', (1,1), (1,1), colors.HexColor("#FFF1F2")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor(PALETTE["border"])),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor(PALETTE["border"])),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_pfpw)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 3: TABELA DE ACHADOS & RECOMENDAÇÕES PRIORIZADAS
    # =========================================================================
    story.append(Paragraph("3. Tabela de Achados Detalhados", style_h1))
    story.append(Paragraph("Relação arquivo por arquivo, linha por linha de todas as vulnerabilidades detectadas:", style_body))
    story.append(Spacer(1, 3))

    table_headers = [
        Paragraph("<b>Severidade</b>", style_body_bold),
        Paragraph("<b>Categoria</b>", style_body_bold),
        Paragraph("<b>Arquivo : Linha</b>", style_body_bold),
        Paragraph("<b>Descrição Sintética da Vulnerabilidade</b>", style_body_bold),
    ]

    findings_rows = [
        table_headers,
        [
            Paragraph("<font color='#B91C1C'><b>CRÍTICA</b></font>", style_body),
            Paragraph("1. Banco sem Tranca", style_body),
            Paragraph("<code>firestore.rules:5-8</code>", style_body),
            Paragraph("Regra coringa (<code>/{document=**}</code>) permitindo leitura pública irrestrita e escrita/exclusão global para qualquer usuário autenticado sem segregação de inquilino.", style_body),
        ],
        [
            Paragraph("<font color='#EA580C'><b>ALTA</b></font>", style_body),
            Paragraph("3. IDOR / Auth", style_body),
            Paragraph("<code>firestore.rules:7</code>", style_body),
            Paragraph("Ausência de validação de propriedade (<code>request.auth.uid == resource.data.ownerId</code>) permitindo alteração e exclusão de objetos de terceiros via ID direto.", style_body),
        ],
        [
            Paragraph("<font color='#EA580C'><b>ALTA</b></font>", style_body),
            Paragraph("4. Chaves Expostas", style_body),
            Paragraph("<code>apikeyuilora.txt:1</code>", style_body),
            Paragraph("Chave de API secreta de IA (<code>sk-uilora-...</code>) armazenada em texto puro na raiz do projeto, sujeita a vazamento e sequestro de cota.", style_body),
        ],
        [
            Paragraph("<font color='#D97706'><b>MÉDIA</b></font>", style_body),
            Paragraph("5. Headers / XSS", style_body),
            Paragraph("<code>firebase.json:10-54</code>", style_body),
            Paragraph("Ausência de cabeçalhos de segurança HTTP (CSP, X-Frame-Options contra Clickjacking, X-Content-Type-Options e Referrer-Policy).", style_body),
        ],
        [
            Paragraph("<font color='#D97706'><b>MÉDIA</b></font>", style_body),
            Paragraph("4. Chaves Expostas", style_body),
            Paragraph("<code>lib/firebase.ts:5,10</code>", style_body),
            Paragraph("Defaults inseguros com fallback permissivo sem validação de inicialização (startup fail-fast) para credenciais do Firebase SDK.", style_body),
        ],
        [
            Paragraph("<font color='#2563EB'><b>BAIXA</b></font>", style_body),
            Paragraph("Higiene de Build", style_body),
            Paragraph("<code>next.config.mjs:6</code>", style_body),
            Paragraph("Parâmetro <code>ignoreBuildErrors: true</code> suprime checagens do compilador TypeScript, permitindo deploy com regressões e tipos inválidos.", style_body),
        ],
        [
            Paragraph("<font color='#64748B'><b>INFO</b></font>", style_body),
            Paragraph("2. Permissão Nav.", style_body),
            Paragraph("<code>app/page.tsx</code>", style_body),
            Paragraph("Não aplicável no frontend atual (aplicação de consulta pública sem painel administrativo ou gestão de usuários no client).", style_body),
        ],
    ]

    t_findings = Table(findings_rows, colWidths=[24 * mm, 38 * mm, 38 * mm, 74 * mm])
    t_findings.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor(PALETTE["border"])),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor(PALETTE["border"])),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_findings)
    story.append(Spacer(1, 10))

    story.append(Paragraph("4. Recomendações Priorizadas", style_h1))
    recom_data = [
        [Paragraph("<b>Prioridade</b>", style_body_bold), Paragraph("<b>Ação Recomendada</b>", style_body_bold), Paragraph("<b>Impacto na Segurança</b>", style_body_bold)],
        [
            Paragraph("<font color='#B91C1C'><b>P1 (Crítica)</b></font>", style_body),
            Paragraph("<b>Fechar regras do Firestore:</b> Substituir <code>match /{document=**}</code> por regras estritas e fechadas por padrão (<code>allow read, write: if false;</code>) caso o Firestore não seja consumido no client, ou especificar coleções públicas de somente-leitura.", style_body),
            Paragraph("Elimina o risco de dump público de dados e remoção/destruição maliciosa do banco por qualquer usuário autenticado.", style_body)
        ],
        [
            Paragraph("<font color='#EA580C'><b>P1 (Alta)</b></font>", style_body),
            Paragraph("<b>Rotacionar e expurgar chaves em arquivo:</b> Remover <code>apikeyuilora.txt</code> da raiz do projeto, invalidar a chave no console do provedor e adotar injeção exclusiva via variáveis de ambiente.", style_body),
            Paragraph("Previne sequestro de cotas pagas e uso não autorizado da API de IA.", style_body)
        ],
        [
            Paragraph("<font color='#D97706'><b>P2 (Média)</b></font>", style_body),
            Paragraph("<b>Adicionar cabeçalhos HTTP no Firebase:</b> Configurar no <code>firebase.json</code> os headers <code>X-Frame-Options: DENY</code>, <code>X-Content-Type-Options: nosniff</code>, <code>Referrer-Policy</code> e CSP estrita.", style_body),
            Paragraph("Protege usuários contra Clickjacking, ataques de MIME-sniffing e execução de scripts não autorizados.", style_body)
        ],
        [
            Paragraph("<font color='#D97706'><b>P2 (Média)</b></font>", style_body),
            Paragraph("<b>Startup Validation de Env Vars:</b> Em <code>lib/firebase.ts</code>, remover fallbacks de string vazia/dummy e validar variáveis com Zod no build.", style_body),
            Paragraph("Garante que a aplicação falhe imediatamente no build caso credenciais obrigatórias estejam ausentes.", style_body)
        ],
        [
            Paragraph("<font color='#2563EB'><b>P3 (Baixa)</b></font>", style_body),
            Paragraph("<b>Ativar verificação rigorosa de tipos:</b> Remover <code>ignoreBuildErrors: true</code> em <code>next.config.mjs</code>.", style_body),
            Paragraph("Evita que quebras de código ou inconsistências estruturais passem despercebidas para produção.", style_body)
        ],
    ]
    t_recom = Table(recom_data, colWidths=[24 * mm, 88 * mm, 62 * mm])
    t_recom.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0038A8")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor(PALETTE["border"])),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor(PALETTE["border"])),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_recom)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 4: ISSUES 1 & 2 PARA O GITHUB
    # =========================================================================
    story.append(Paragraph("5. Issues para o GitHub (Prontas para Copiar e Colar)", style_h1))
    story.append(Paragraph(
        "Abaixo constam os textos completos em Markdown de cada issue gerada a partir dos achados auditados. "
        "Cada bloco está delimitado para facilitar a inclusão direta no GitHub Issues.",
        style_body
    ))
    story.append(Spacer(1, 4))

    # ISSUE 1
    issue1_text = """<b>--- ISSUE 1 ---</b><br/>
<b>Título:</b> [Segurança] Regras permissivas no Cloud Firestore expõem banco a leitura e mutação arbitrária<br/>
<b>Labels:</b> <code>security</code>, <code>critical</code>, <code>database</code><br/>
<b>Descrição do Problema:</b><br/>
O arquivo <code>firestore.rules</code> utiliza uma regra coringa <code>match /{document=**}</code> com <code>allow read: if true;</code> e <code>allow write: if request.auth != null;</code>. Isso expõe qualquer coleção presente ou futura para leitura irrestrita e permite a qualquer usuário autenticado criar, modificar ou apagar todos os documentos do banco sem segregação de inquilino ou validação de dono.<br/>
<b>Evidência:</b> Arquivo: <code>firestore.rules:5-8</code><br/>
<code>service cloud.firestore { match /databases/{database}/documents { match /{document=**} { allow read: if true; allow write: if request.auth != null; } } }</code><br/>
<b>Impacto:</b> Risco de destruição integral (wipe) de dados, alteração de tabelas e exposição de dados sensíveis.<br/>
<b>Sugestão de Correção:</b> Restringir as regras às coleções estritamente necessárias e proibir escrita global por padrão (<code>allow write: if false;</code>).<br/>
<b>Critérios de Aceite:</b><br/>
[ ] A regra recursiva aberta <code>/{document=**}</code> foi removida.<br/>
[ ] Escrita global não autenticada/não-admin foi bloqueada.<br/>
[ ] Testes de regras do Firestore executados com sucesso no emulador.<br/>
<b>--- FIM ISSUE 1 ---</b>"""
    
    t_issue1 = Table([[Paragraph(issue1_text, style_body)]], colWidths=[174 * mm])
    t_issue1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEF2F2")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#FCA5A5")),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_issue1)
    story.append(Spacer(1, 8))

    # ISSUE 2
    issue2_text = """<b>--- ISSUE 2 ---</b><br/>
<b>Título:</b> [Segurança] Chave de API de IA em texto puro na raiz do projeto (apikeyuilora.txt)<br/>
<b>Labels:</b> <code>security</code>, <code>high</code>, <code>secrets</code><br/>
<b>Descrição do Problema:</b><br/>
O arquivo <code>apikeyuilora.txt</code> contém uma credencial privada ativa de serviço de inteligência artificial (<code>sk-uilora-...</code>) armazenada em texto puro no sistema de arquivos do projeto. Embora o nome do arquivo tenha sido inserido no <code>.gitignore</code>, sua presença física no disco representa risco de vazamento em compartilhamentos, backups desprotegidos ou ambientes de CI/CD.<br/>
<b>Evidência:</b> Arquivo: <code>apikeyuilora.txt:1</code> — <code>sk-uilora-92yyHJiDHaP-XoikguP4ovWfcMWP7AIXWbBKjsqNHd4</code><br/>
<b>Impacto:</b> Consumo não autorizado de cota paga, acesso a recursos de terceiros e risco financeiro.<br/>
<b>Sugestão de Correção:</b> Revogar imediatamente a chave no painel do provedor, excluir o arquivo do disco e configurar consumo via variável de ambiente <code>UI_LORA_API_KEY</code>.<br/>
<b>Critérios de Aceite:</b><br/>
[ ] A chave exposta foi revogada e uma nova gerada.<br/>
[ ] O arquivo <code>apikeyuilora.txt</code> foi excluído do repositório.<br/>
[ ] Confirmado que a chave não está presente em commits do histórico git.<br/>
<b>--- FIM ISSUE 2 ---</b>"""

    t_issue2 = Table([[Paragraph(issue2_text, style_body)]], colWidths=[174 * mm])
    t_issue2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FFF7ED")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#FDBA74")),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_issue2)

    story.append(PageBreak())

    # =========================================================================
    # PÁGINA 5: ISSUES 3 & 4 PARA O GITHUB
    # =========================================================================
    story.append(Paragraph("5. Issues para o GitHub (Continuação)", style_h1))
    story.append(Spacer(1, 4))

    # ISSUE 3
    issue3_text = """<b>--- ISSUE 3 ---</b><br/>
<b>Título:</b> [Segurança] Ausência de cabeçalhos de segurança HTTP e CSP no Firebase Hosting<br/>
<b>Labels:</b> <code>security</code>, <code>medium</code>, <code>headers</code>, <code>hosting</code><br/>
<b>Descrição do Problema:</b><br/>
O arquivo <code>firebase.json</code> define parâmetros de <code>Cache-Control</code>, mas não configura cabeçalhos defensivos essenciais recomendados pela OWASP, como <code>Content-Security-Policy</code>, <code>X-Frame-Options</code>, <code>X-Content-Type-Options</code> e <code>Referrer-Policy</code>. Isso deixa a aplicação vulnerável a ataques de Clickjacking (incorporação em <code>&lt;iframe&gt;</code> malicioso) e MIME-confusion.<br/>
<b>Evidência:</b> Arquivo: <code>firebase.json:10-54</code> (Bloco <code>headers</code> sem políticas de proteção de framing e MIME).<br/>
<b>Impacto:</b> Risco de sequestro de interface (Clickjacking) e execução indevida de scripts caso uma injeção seja explorada.<br/>
<b>Sugestão de Correção:</b> Inserir no bloco global <code>headers</code> do <code>firebase.json</code>:<br/>
• <code>X-Frame-Options: DENY</code><br/>
• <code>X-Content-Type-Options: nosniff</code><br/>
• <code>Referrer-Policy: strict-origin-when-cross-origin</code><br/>
• <code>Permissions-Policy: geolocation=(self), microphone=(), camera=()</code><br/>
<b>Critérios de Aceite:</b><br/>
[ ] Cabeçalhos de segurança adicionados ao <code>firebase.json</code>.<br/>
[ ] Deploy executado e validação via <code>curl -I https://voudevan-al.web.app</code> confirmando a presença dos headers.<br/>
<b>--- FIM ISSUE 3 ---</b>"""

    t_issue3 = Table([[Paragraph(issue3_text, style_body)]], colWidths=[174 * mm])
    t_issue3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FEFCE8")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#FDE047")),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_issue3)
    story.append(Spacer(1, 8))

    # ISSUE 4
    issue4_text = """<b>--- ISSUE 4 ---</b><br/>
<b>Título:</b> [Segurança] Defaults inseguros e falta de validação de startup em variáveis de ambiente<br/>
<b>Labels:</b> <code>security</code>, <code>medium</code>, <code>configuration</code><br/>
<b>Descrição do Problema:</b><br/>
Em <code>lib/firebase.ts</code>, variáveis de ambiente críticas utilizam operadores de fallback silencioso (<code>process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForVouDeVanAlagoas"</code>). Se as variáveis não forem supridas no build, a aplicação inicializa com credenciais inválidas silenciosamente, sem lançar erro (fail-fast). Além disso, em <code>next.config.mjs</code>, o parâmetro <code>ignoreBuildErrors: true</code> suprime falhas de compilação.<br/>
<b>Evidência:</b> Arquivos: <code>lib/firebase.ts:5,10</code> e <code>next.config.mjs:6</code><br/>
<b>Impacto:</b> Falhas silenciosas em produção e mascaramento de erros críticos de tipagem e ambiente.<br/>
<b>Sugestão de Correção:</b> Criar módulo de validação de ambiente com <code>zod</code> e desativar <code>ignoreBuildErrors</code>.<br/>
<b>Critérios de Aceite:</b><br/>
[ ] Validação com Zod implementada garantindo fail-fast na ausência de variáveis obrigatórias.<br/>
[ ] <code>ignoreBuildErrors: true</code> removido de <code>next.config.mjs</code> com compilação limpa do TypeScript.<br/>
<b>--- FIM ISSUE 4 ---</b>"""

    t_issue4 = Table([[Paragraph(issue4_text, style_body)]], colWidths=[174 * mm])
    t_issue4.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor(PALETTE["border"])),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_issue4)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF gerado com sucesso em: {OUTPUT_PDF}")

    # Rasterizar páginas para verificação visual
    doc_fitz = pymupdf.open(OUTPUT_PDF)
    print(f"Total de páginas final: {len(doc_fitz)}")
    for i, page in enumerate(doc_fitz):
        pix = page.get_pixmap(dpi=150)
        pix.save(os.path.join(IMG_DIR, f"page_{i+1}.png"))
    print("Páginas renderizadas em imagem com sucesso.")

if __name__ == "__main__":
    build_pdf()
