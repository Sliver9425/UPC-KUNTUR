from fpdf import FPDF

def generar_pdf_denuncia(denuncia, output_path):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Parte Policial", ln=True, align="C")
    pdf.ln(10)
    pdf.cell(200, 10, txt=f"ID: {denuncia.id}", ln=True)
    pdf.cell(200, 10, txt=f"Descripción: {denuncia.descripcion}", ln=True)
    pdf.cell(200, 10, txt=f"Ubicación: {denuncia.ubicacion}", ln=True)
    pdf.cell(200, 10, txt=f"Código: {denuncia.codigo}", ln=True)
    pdf.cell(200, 10, txt=f"Unidades: {denuncia.unidades}", ln=True)
    pdf.cell(200, 10, txt=f"Evidencia: {denuncia.url}", ln=True)
    pdf.cell(200, 10, txt=f"Fecha: {denuncia.fecha}", ln=True)
    pdf.output(output_path)