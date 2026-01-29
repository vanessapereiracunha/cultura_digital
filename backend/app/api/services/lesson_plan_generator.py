import os
from fpdf import FPDF
from fpdf.errors import FPDFException
import uuid
 
OUTPUT_DIR = "output/generated_plans"
os.makedirs(OUTPUT_DIR, exist_ok=True)
 
class LessonPlanGenerator:
    @staticmethod
    def generate_pdf(data: dict) -> str:
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Helvetica", size=12)
 
        # Header
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, "Plano de Aula", ln=True, align="C")
        pdf.ln(10)
 
        pdf.set_font("Helvetica", size=12)
        pdf.cell(0, 10, "Escola: _______________________________________________________", ln=True)
        pdf.cell(0, 10, "Professor(a): _________________________________________________ Data: ___/___/___", ln=True)
        pdf.ln(10)
 
        # Título
        pdf.set_font("Helvetica", "B", 14)
        titulo = data.get("titulo", "Sem Título")
        safe_titulo = str(titulo).encode("latin-1", "replace").decode("latin-1")
        pdf.multi_cell(0, 10, safe_titulo, align="C")
        pdf.ln(5)
 
        # Metadados
        pdf.set_font("Helvetica", "B", 12)
        serie = str(data.get("serieAno", "")).encode("latin-1", "replace").decode("latin-1")
        duracao = str(data.get("duracao", "")).encode("latin-1", "replace").decode("latin-1")
        pdf.cell(0, 8, f"Série/Ano: {serie}", ln=True)
        pdf.cell(0, 8, f"Duração: {duracao}", ln=True)
        pdf.ln(5)
 
        # Objetivos
        objetivos = data.get("objetivos") or []
        if objetivos:
            pdf.set_font("Helvetica", "B", 12)
            pdf.cell(0, 10, "Objetivos de Aprendizagem:", ln=True)
            pdf.set_font("Helvetica", size=11)
            for obj in objetivos:
                safe_obj = str(obj).encode("latin-1", "replace").decode("latin-1")
                pdf.set_x(pdf.l_margin)
                width = pdf.w - pdf.l_margin - pdf.r_margin
                try:
                    pdf.multi_cell(width, 8, f"- {safe_obj}")
                except FPDFException:
                    pdf.multi_cell(width, 8, "-")
            pdf.ln(5)

        # Conteúdo Programático
        conteudo = data.get("conteudoProgramatico") or []
        if conteudo:
            pdf.set_font("Helvetica", "B", 12)
            pdf.cell(0, 10, "Conteudo Programatico:", ln=True)
            pdf.set_font("Helvetica", size=11)
            for item in conteudo:
                safe_item = str(item).encode("latin-1", "replace").decode("latin-1")
                pdf.set_x(pdf.l_margin)
                width = pdf.w - pdf.l_margin - pdf.r_margin
                try:
                    pdf.multi_cell(width, 8, f"- {safe_item}")
                except FPDFException:
                    pdf.multi_cell(width, 8, "-")
            pdf.ln(5)

        # BNCC / CIEB
        bncc = data.get("bncc") or []
        if bncc:
            pdf.set_font("Helvetica", "B", 12)
            pdf.cell(0, 10, "Habilidades BNCC / CIEB:", ln=True)
            pdf.set_font("Helvetica", size=11)
            for skill in bncc:
                safe_skill = str(skill).encode("latin-1", "replace").decode("latin-1")
                pdf.set_x(pdf.l_margin)
                width = pdf.w - pdf.l_margin - pdf.r_margin
                try:
                    pdf.multi_cell(width, 8, f"- {safe_skill}")
                except FPDFException:
                    pdf.multi_cell(width, 8, "-")
            pdf.ln(5)

        # Estratégias
        estrategias = data.get("estrategiasEnsino") or []
        if estrategias:
            pdf.set_font("Helvetica", "B", 12)
            pdf.cell(0, 10, "Estrategias de Ensino:", ln=True)
            pdf.set_font("Helvetica", size=11)
            for i, step in enumerate(estrategias, 1):
                safe_step = str(step).encode("latin-1", "replace").decode("latin-1")
                pdf.set_x(pdf.l_margin)
                width = pdf.w - pdf.l_margin - pdf.r_margin
                try:
                    pdf.multi_cell(width, 8, f"{i}. {safe_step}")
                except FPDFException:
                    pdf.multi_cell(width, 8, f"{i}.")
            pdf.ln(5)
 
        # Avaliação
        avaliacao = data.get("avaliacao")
        if avaliacao:
            pdf.set_font("Helvetica", "B", 12)
            pdf.cell(0, 10, "Avaliacao:", ln=True)
            pdf.set_font("Helvetica", size=11)
            safe_avaliacao = str(avaliacao).encode("latin-1", "replace").decode("latin-1")
            pdf.multi_cell(0, 8, safe_avaliacao)
            pdf.ln(5)

        # Referências
        referencias = data.get("referencias") or []
        if referencias:
            pdf.set_font("Helvetica", "B", 12)
            pdf.cell(0, 10, "Referencias:", ln=True)
            pdf.set_font("Helvetica", size=11)
            for ref in referencias:
                safe_ref = str(ref).encode("latin-1", "replace").decode("latin-1")
                pdf.set_x(pdf.l_margin)
                width = pdf.w - pdf.l_margin - pdf.r_margin
                try:
                    pdf.multi_cell(width, 8, f"- {safe_ref}")
                except FPDFException:
                    pdf.multi_cell(width, 8, "-")
            pdf.ln(5)
 
        filename = f"plano_{uuid.uuid4()}.pdf"
        filepath = os.path.join(OUTPUT_DIR, filename)
        pdf.output(filepath)
 
        return filename
