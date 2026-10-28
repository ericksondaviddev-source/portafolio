// Prueba de HUD (barra de progreso + botón Contacto) y parallax de títulos.
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const outDir = '02 LISTOS/Portafolio-v2/evidencia';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errores = [];
page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
page.on('pageerror', (e) => errores.push(String(e)));

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

const estado = async () => page.evaluate(() => ({
  width: document.querySelector('.progress-bar').style.width,
  contactoOculto: document.querySelector('.contacto-btn').classList.contains('oculto'),
  head3: (() => {
    const heads = document.querySelectorAll('.room-head');
    return { t: heads[3].style.transform, o: heads[3].style.opacity };
  })()
}));

const s0 = await estado();

// Media carrera: parallax activo durante el vuelo
await page.evaluate(() => window.__recorrido.goTo(3));
await page.waitForTimeout(250);
const sMid = await estado();
await page.screenshot({ path: `${outDir}/hud-mid-vuelo.png` });
await page.waitForTimeout(2200);
const s3 = await estado();

await page.evaluate(() => window.__recorrido.goTo(6));
await page.waitForTimeout(2200);
const s6 = await estado();
await page.screenshot({ path: `${outDir}/hud-final.png` });

await browser.close();

const fallos = [];
if (s0.contactoOculto) fallos.push('contacto-btn oculto al inicio');
if (parseFloat(s3.width, 10) < 45 || parseFloat(s3.width) > 55) fallos.push(`progreso en sala 3 = ${s3.width}, esperado ~50%`);
if (s3.contactoOculto) fallos.push('contacto-btn oculto en sala 3');
if (!s6.contactoOculto) fallos.push('contacto-btn visible en la sala de contacto (ocultarse)');
if (parseFloat(s6.width) < 99.9) fallos.push(`progreso final = ${s6.width}`);
if (!sMid.head3.t || !sMid.head3.t.includes('translate')) fallos.push('parallax no aplicó transform mid-vuelo');

console.log(JSON.stringify({ s0, sMid: sMid.head3, s3, s6 }, null, 2));
if (sMid.head3.t) console.log('transform mid-vuelo:', sMid.head3.t, '| opacity:', sMid.head3.o);

if (errores.length) { console.error('❌ errores de consola:', errores); process.exit(1); }
if (fallos.length) { console.error('❌ HUD:', fallos.join(' | ')); process.exit(1); }
console.log('✅ HUD y parallax verificados');
