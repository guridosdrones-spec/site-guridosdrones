"""Regenera o catálogo usado pelo navegador, sem dependências externas."""
import json
from pathlib import Path

base = Path(__file__).resolve().parent
catalogo = {}
for numero, linha in enumerate((base / 'idiomas.tsv').read_text(encoding='utf-8').splitlines(), 1):
    if not linha.strip():
        continue
    partes = linha.split('\t')
    if len(partes) != 3 or not all(partes):
        raise ValueError(f'Linha {numero}: informe português, inglês e espanhol.')
    pt, en, es = partes
    if pt in catalogo:
        raise ValueError(f'Texto repetido na linha {numero}: {pt}')
    catalogo[pt] = [en, es]
(base / 'idiomas-dados.js').write_text(
    '// Gerado por gerar_idiomas.py a partir de idiomas.tsv.\nwindow.IDIOMAS = '
    + json.dumps(catalogo, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
print(f'{len(catalogo)} textos traduzidos.')
