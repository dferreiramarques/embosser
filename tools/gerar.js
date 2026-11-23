#!/usr/bin/env node
// Uso: node tools/gerar.js medalha.stl arte.(dxf|svg) saida.stl [parametros.json]
const fs = require('fs'), path = require('path');
const C = require('../src/core.js');
const [, , stl, dxf, out, pjson] = process.argv;
if (!stl || !dxf || !out) { console.error('Uso: node tools/gerar.js medalha.stl arte.(dxf|svg) saida.stl [parametros.json]'); process.exit(1); }
const b = fs.readFileSync(stl);
const P = Object.assign({}, C.DEFAULTS, pjson ? JSON.parse(fs.readFileSync(pjson, 'utf8')) : {});
const medal = C.rotateMedal(C.medalFromSTL(b.buffer.slice(b.byteOffset, b.byteOffset + b.length)), P.medalRot || 0);
const loops = C.parseArt(fs.readFileSync(dxf, 'utf8'), dxf);
if (!pjson || P.artWidth === undefined) P.artWidth = Math.floor(C.fitWidth(medal, loops, P) * 0.92 * 10) / 10;
const r = C.build(medal, loops, P);
fs.writeFileSync(out, C.toSTL([r.male, r.female], 'Embosser - positivo + negativo'));
const base = out.replace(/\.stl$/i, '');
fs.writeFileSync(base + '_positivo.stl', C.toSTL([r.maleLocal], 'Embosser - positivo'));
fs.writeFileSync(base + '_negativo.stl', C.toSTL([r.femaleLocal], 'Embosser - negativo'));
console.log(`Largura da arte ${P.artWidth} mm · ${Math.round(r.stats.triangles / 1000)} mil triângulos → ${path.basename(out)}`);
r.warnings.forEach(w => console.warn('Aviso: ' + w));
