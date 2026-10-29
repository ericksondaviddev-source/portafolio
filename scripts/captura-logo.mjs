// Captura del mockup de logo/favicon (evidencia visual antes de congelar)
import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true, channel: 'chromium' });
const page = await browser.newPage({ viewport: { width: 900, height: 560 } });
page.on('pageerror', e => console.error(e));
await page.goto('http://localhost:5173/02%20LISTOS/mockup-logo.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: '02 LISTOS/Portafolio-v2/evidencia/mockup-logo.png' });
await browser.close();
console.log('✅ mockup-logo.png');
