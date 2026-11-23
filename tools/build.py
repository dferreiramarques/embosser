#!/usr/bin/env python3
"""Gera index.html a partir de src/page.html + src/core.js (core embutido)."""
from pathlib import Path
root = Path(__file__).resolve().parent.parent
page = (root / 'src/page.html').read_text(encoding='utf-8')
core = (root / 'src/core.js').read_text(encoding='utf-8')
assert '/*__CORE__*/' in page
(root / 'index.html').write_text(page.replace('/*__CORE__*/', core), encoding='utf-8')
print('index.html atualizado')
