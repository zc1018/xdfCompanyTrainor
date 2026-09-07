import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('/Users/xdf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = fileURLToPath(new URL('../', import.meta.url));
const original = '/Users/xdf/.codex/generated_images/019f878d-5fe4-73f0-8465-9ff985ebfd37/exec-c5eead55-ba86-495b-8698-f0a110dc72ab.png';
await Promise.all([800, 1200].map(width => sharp(original).resize({ width }).webp({ quality: 84 }).toFile(path.join(root, `assets/workplace-${width}.webp`))));

// Self-host page-specific CJK subsets: no third-party font request at runtime.
const sources = await Promise.all(['index.html', 'app.js'].map(name => readFile(path.join(root, name), 'utf8')));
const allText = sources.join(' ').replace(/<[^>]*>/g, ' ');
const glyphs = [...new Set((allText.match(/[\u3000-\u9fff\uf900-\ufaff\uff00-\uffef]/gu) || []).concat([...Array(95)].map((_, i) => String.fromCharCode(i + 32)), [...'↗↓↘✓·–—’ˈəʊʒɪɛɑɔæθðŋ']))].sort().join('');
const fontsDir = path.join(root, 'assets/fonts');
await mkdir(fontsDir, { recursive: true });
let stylesheet = '';
for (const [family, alias, weight, slug] of [['Noto Sans SC', 'Enterprise Sans', 400, 'sans'], ['Noto Serif SC', 'Enterprise Serif', 600, 'serif']]) {
  const chunks = glyphs.match(/.{1,500}/gu);
  for (const [index, chunk] of chunks.entries()) {
    const params = new URLSearchParams({ family: `${family}:wght@${weight}`, display: 'swap', text: chunk });
    const response = await fetch(`https://fonts.googleapis.com/css2?${params}`, { headers: { 'User-Agent': 'Mozilla/5.0 Chrome/131.0.0.0 Safari/537.36' } });
    if (!response.ok) throw new Error(`Font CSS failed: ${response.status}`);
    const css = await response.text();
    const remote = css.match(/url\(([^)]+)\)/)?.[1];
    if (!remote) throw new Error('No font URL returned');
    const font = await fetch(remote);
    if (!font.ok) throw new Error(`Font download failed: ${font.status}`);
    const filename = `${slug}-${index}.woff2`;
    await writeFile(path.join(fontsDir, filename), Buffer.from(await font.arrayBuffer()));
    const range = [...chunk].map(char => `U+${char.codePointAt(0).toString(16)}`).join(',');
    stylesheet += `@font-face{font-family:'${alias}';font-style:normal;font-weight:${weight};font-display:swap;src:url('${filename}') format('woff2');unicode-range:${range};}\n`;
  }
  const license = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/noto${slug}sc/OFL.txt`);
  if (!license.ok) throw new Error(`Font license failed: ${license.status}`);
  await writeFile(path.join(fontsDir, `${slug}-OFL.txt`), await license.text());
}
await writeFile(path.join(fontsDir, 'fonts.css'), stylesheet);
console.log(`Prepared two hero sizes and ${glyphs.length} font glyphs per family.`);
