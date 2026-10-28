// Captura la transición cueva → jardín (amanecer) en el tiempo.
// Uso: node scripts/captura-amanecer.mjs [url]
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const url = process.argv[2] || 'http://localhost:5173/';
const outDir = '02 LISTOS/Portafolio-v2/evidencia';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errores = [];
page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
page.on('pageerror', (e) => errores.push(String(e)));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

// FPS durante la transición
const fpsPromesa = page.evaluate(() => new Promise((resolve) => {
  let frames = 0;
  const inicio = performance.now();
  function tick(now) {
    frames++;
    if (now - inicio >= 2500) resolve(Math.round((frames * 1000) / (now - inicio)));
    else requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}));

// Apps (cueva) → Música (jardín)
await page.evaluate(() => window.__recorrido.goTo(3));

const PASOS = [0, 250, 500, 900, 1600];
for (const ms of PASOS) {
  const t = PASOS.filter((p) => p <= ms).reduce((a, b) => a + (b - Math.max(a, 0)) , 0) || ms;
  await page.waitForTimeout(ms === 0 ? 0 : ms - (PASOS[PASOS.indexOf(ms) - 1] || 0));
  await page.screenshot({ path: `${outDir}/amanecer-${String(ms).padStart(4, '0')}ms.png` });
}
const fps = await fpsPromesa;
await context.close();
await browser.close();

console.log(`fps durante transición: ${fps}`);
if (errores.length) {
  console.error('❌ errores de consola:', JSON.stringify(errores, null, 2));
  process.exit(1);
}
console.log('✅ amanecer capturado en', PASOS.join('/'), 'ms');
