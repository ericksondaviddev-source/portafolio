// Prueba de inercia: lanza rueda vertical y muestrea scrollLeft en el tiempo.
// Evidencia esperada: los valores suben gradualmente (lerp), no de golpe.
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

// 6 eventos de rueda seguidos (= ~2/3 de sala)
await page.mouse.move(720, 450);
for (let i = 0; i < 6; i++) {
  await page.mouse.wheel(0, 160);
  await page.waitForTimeout(40);
}

// Muestrear la persecución del scroll durante 1.5 s
const muestras = await page.evaluate(() => new Promise((resolve) => {
  const serie = [];
  const inicio = performance.now();
  function tick() {
    serie.push(Math.round(document.querySelector('.stage').scrollLeft));
    if (performance.now() - inicio >= 1500) resolve(serie);
    else setTimeout(tick, 60);
  }
  tick();
}));

await page.screenshot({ path: `${outDir}/inercia-final.png` });

await browser.close();

const convergio = muestras.length > 10 &&
  muestras[2] < muestras[muestras.length - 1] && // seguía avanzando a mitad
  Math.max(...muestras) === muestras[muestras.length - 1]; // se asentó al final

console.log('muestras scrollLeft:', muestras.join(' → '));
console.log(convergio
  ? '✅ inercia verificada: persecución gradual con freno y asiento final'
  : '❌ no hay inercia o no se asentó');
if (errores.length) {
  console.error('❌ errores de consola:', JSON.stringify(errores, null, 2));
  process.exit(1);
}
if (!convergio) process.exit(1);
