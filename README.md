# Embosser

Ferramenta no browser para transformar uma **medalha (STL)** e uma **arte vetorial (DXF ou SVG)** num par de cunhos de selo branco — **positivo** (relevo) e **negativo** (cavidade) — já com as tolerâncias para o papel, prontos a imprimir em 3D num único STL.

## Usar

- Abrir `index.html` (ou a versão no GitHub Pages) e carregar a medalha e a arte. O exemplo (medalha + estrela) abre por defeito quando servido por HTTP.
- Ajustar a arte: arrastar para mover, roda do rato para escalar, Shift + roda para rodar; ou usar os campos à esquerda.
- **Descarregar STL**: as duas peças lado a lado, de face para cima.

Para usar: virar o negativo como a página de um livro e alinhar os entalhes da borda, com o papel no meio.

## Como funciona

1. **Medalha** — lê o STL (binário ou ASCII), encontra o eixo mais fino e extrai o contorno da face plana (com furos). Assume uma medalha extrudida. Pode ser rodada no plano (atalhos de 90°).
2. **Arte** — **SVG**: `path` (todos os comandos, incl. arcos), `rect` (com cantos), `circle`, `ellipse`, `polygon`, `polyline`, transformações em grupos/elementos e `fill-rule` de cada elemento (os elementos somam-se; `defs`, `clipPath`, `mask` e `text` são ignorados — converte texto em contornos). **DXF**: lê `SPLINE` (NURBS, incl. racionais), `LWPOLYLINE`/`POLYLINE` (com bulges), `CIRCLE`, `ELLIPSE`, `ARC` e `LINE` (encadeados em contornos). Preenchimento alternado (par/ímpar) ou total.
3. **Positivo** — base da medalha + relevo em degraus com ângulo de saída (as paredes inclinam para o papel soltar e as peças se centrarem).
4. **Moldura** — molduras circulares centradas na medalha (raio automático = maior círculo que cabe dentro da margem, evitando entalhes). Rotação, tamanho e quantidade dos elementos automáticos ou manuais; a arte é ajustada para caber dentro.
5. **Negativo** — cavidade = arte alargada por *papel + folga*, com o mesmo ângulo, mais funda que o relevo, sempre com parede mínima à borda; depois espelhada.
6. Cada peça sai como **um único sólido fechado** (estanque), em STL binário.

| Parâmetro | Por defeito | Notas |
|---|---|---|
| Altura do relevo | 0,8 mm | |
| Espessura do papel | 0,15 mm | atalhos para 80/120/200/300 g |
| Folga de impressão | 0,15 mm | somada ao papel, em cada lado |
| Ângulo de saída | 12° | em 4 degraus |
| Profundidade extra | 0,2 mm | cavidade mais funda que o relevo |
| Margem à borda | 3 mm | |
| Moldura | sem moldura | linha fina/grossa/dupla/tracejada, pontos, contas, estrelas, serrilha, corda, louros, louros + pontos |
| Espelhar arte | ligado | positivo espelhado, cavidade do negativo igual ao desenho |

Atenção: com o espelho ligado, o lado **afundado** do papel fica igual ao DXF e o lado em **relevo** fica espelhado. Desligar para o contrário.

## Desempenho

- A pré-visualização 3D corre num Web Worker (a interface não congela) e usa no máximo 2 degraus de saída; a exportação gera sempre o modelo completo.
- Offsets com tolerância de arco de 20 µm (abaixo da resolução de impressão).

## Linha de comandos

```bash
npm install
npm run exemplo                     # gera exemplo/embosser_estrela*.stl
node tools/gerar.js medalha.stl arte.dxf saida.stl [parametros.json]
```

`parametros.json` aceita as mesmas chaves que a página exporta no zip (`artWidth`, `reliefH`, `paper`, `clearance`, `draftDeg`, `steps`, `mirrorArt`, …).

## Estrutura

- `src/core.js` — motor geométrico (browser e Node): DXF, STL, offsets (Clipper), malha (earcut), STL/ZIP.
- `src/page.html` — interface; `python3 tools/build.py` gera `index.html` com o core embutido.
- `exemplo/` — medalha e estrela de exemplo (`estrela.dxf`, desenhada de raiz); `exemplo.json` é a mesma coisa empacotada para a página.

Dependências no browser (CDN): three.js r128, clipper-lib 6.4.2, earcut 2.2.4.
