from fpdf import FPDF
from pathlib import Path
import textwrap

SRC = Path(__file__).with_name('openclaw-quick-fix-guide.md')
OUT = Path(__file__).resolve().parents[1] / 'public' / 'free' / 'openclaw-quick-fix-guide.pdf'


def clean(s: str) -> str:
    return (
        s.replace('→', '->')
         .replace('’', "'")
         .replace('“', '"')
         .replace('”', '"')
         .replace('\u00a0', ' ')
         .replace('\t', ' ')
         .encode('latin-1', 'replace')
         .decode('latin-1')
    )


pdf = FPDF()
pdf.set_auto_page_break(auto=True, margin=14)
pdf.set_margins(16, 16, 16)
pdf.add_page()

lines = SRC.read_text(encoding='utf-8').splitlines()

def line(h, txt, align='L'):
    pdf.multi_cell(0, h, txt, align=align, new_x='LMARGIN', new_y='NEXT')

for raw in lines:
    s = clean(raw.strip())

    if not s:
        pdf.ln(3)
        continue

    if s == '---':
        pdf.set_draw_color(200, 210, 230)
        y = pdf.get_y()
        pdf.line(16, y, 194, y)
        pdf.ln(4)
        continue

    if s.startswith('# '):
        pdf.set_font('Helvetica', 'B', 20)
        pdf.set_text_color(20, 30, 60)
        line(10, s[2:])
        pdf.set_text_color(40, 40, 40)
        pdf.ln(2)
        continue

    if s.startswith('## '):
        pdf.set_font('Helvetica', 'B', 14)
        pdf.set_text_color(20, 30, 60)
        line(8, s[3:])
        pdf.set_text_color(40, 40, 40)
        pdf.ln(1)
        continue

    if s.startswith('```'):
        continue

    pdf.set_font('Helvetica', '', 11)

    if s.startswith('- '):
        s = f"- {s[2:]}"
    elif s.startswith('**'):
        s = s.replace('**', '')

    try:
        line(6, s)
    except Exception:
        for part in textwrap.wrap(s, width=95, break_long_words=True, break_on_hyphens=False):
            line(6, part)

OUT.parent.mkdir(parents=True, exist_ok=True)
pdf.output(str(OUT))
print(f'Generated: {OUT}')
