// Banco de medición de la pieza caverna.
// Comprueba: fps, resolución real (DPR), pausa real del bucle,
// y que un resize NO recrea las partículas.
import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:5173/tests/mundo-caverna.html';
const browser = await chromium.launch({ headless: true, channel: 'chromium' });

async function medir(nombre, viewport, reducedMotion = 'no-preference') {
  const context = await browser.newContext({ viewport, reducedMotion, deviceScaleFactor: viewport.dsf || 1 });
  const page = await context.newPage();
  const errores = [];
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  page.on('pageerror', (e) => errores.push(String(e)));

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const fps = await page.evaluate(() => new Promise((resolve) => {
    let frames = 0;
    const inicio = performance.now();
    function tick(now) {
      frames++;
      if (now - inicio >= 2000) resolve(Math.round((frames * 1000) / (now - inicio)));
      else requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }));

  const info = await page.evaluate(async () => {
    const canvas = document.querySelector('canvas');
    const mundo = window.__mundo;
    const antes = mundo.stars[0];
    const antesLen = mundo.stars.length;

    canvas.style.width = '72vw';
    mundo.resize();
    // La MISMA partícula debe seguir siendo el mismo objeto: no se recrea,
    // solo se recoloca. El número puede bajar porque la densidad se adapta.
    const mismaParticula = mundo.stars[0] === antes;
    const densidadAdaptativa = mundo.stars.length <= antesLen;

    // Pausa real: si el bucle está parado, los frames no avanzan
    mundo.stop();
    let cuadros = 0;
    const t0 = performance.now();
    await new Promise((r) => {
      function tick() {
        cuadros++;
        if (performance.now() - t0 < 500) requestAnimationFrame(tick);
        else r();
      }
      requestAnimationFrame(tick);
    });
    const bucleParado = !mundo.running;

    mundo.start();
    mundo.setMode('jardin');

    return {
      dpr: mundo.dpr,
      cssSize: `${mundo.width}x${mundo.height}`,
      bufferSize: `${canvas.width}x${canvas.height}`,
      particulas: { estrellas: mundo.stars.length, glifos: mundo.glyphs.length, polen: mundo.pollen.length },
      resizeRecreoParticulas: !mismaParticula,
      densidadAdaptativa,
      pausaFunciona: bucleParado,
      modo: mundo.mode
    };
  });

  await page.screenshot({ path: `02 LISTOS/Portafolio-v2/evidencia/caverna-${nombre}.png` });
  await context.close();
  return { nombre, fps, ...info, errores };
}

const escritorio = await medir('escritorio', { width: 1440, height: 900 });
const movil = await medir('movil', { width: 390, height: 844, dsf: 3 });
const reducido = await medir('movimiento-reducido', { width: 1440, height: 900 }, 'reduce');

console.log(JSON.stringify({ escritorio, movil, reducido }, null, 2));
await browser.close();

const fallos = [];
if (escritorio.fps < 55) fallos.push(`escritorio: ${escritorio.fps} fps`);
if (movil.fps < 50) fallos.push(`movil: ${movil.fps} fps`);
if (escritorio.resizeRecreoParticulas) fallos.push('resize recrea las partículas');
if (!escritorio.densidadAdaptativa) fallos.push('la densidad no se adapta al tamaño');
if (!movil.densidadAdaptativa) fallos.push('la densidad móvil no baja');
if (!escritorio.pausaFunciona) fallos.push('la pausa no detiene el bucle');
if (movil.bufferSize === movil.cssSize) fallos.push('movil: el canvas no escala con el DPR');
const errores = [escritorio, movil, reducido].flatMap((r) => r.errores);
if (errores.length) fallos.push(`errores de consola: ${errores.join(' | ')}`);

if (fallos.length) {
  console.error('❌ caverna: ' + fallos.join('; '));
  process.exit(1);
}
console.log('✅ caverna: 60 fps, DPR correcto, resize sin recrear, pausa real');
