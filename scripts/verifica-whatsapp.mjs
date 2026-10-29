// Verifica que el boton "Escríbeme" de Contacto tenga texto de propuesta como string,
// no "[object Object]".
import { chromium } from 'playwright'

const url = 'https://eddev.vercel.app/#/contacto'
const browser = await chromium.launch({ headless: true, channel: 'chromium' })
const page = await browser.newPage({ viewport: { width: 375, height: 812 } })
const errores = []
page.on('pageerror', e => errores.push(String(e)))
page.on('console', m => { if (m.type() === 'error') errores.push(m.text()) })

await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(2000)

const btn = await page.locator('text=Escríbeme por WhatsApp').first()
const href = await btn.getAttribute('href')
const esWhatsApp = href && href.startsWith('https://wa.me/584241875518?text=')
const noObjeto = !href.includes('%5Bobject%20Object%5D')
const textoDecodificado = href ? decodeURIComponent(href.split('text=')[1]) : ''

console.log('href:', href)
console.log('es enlace wa.me válido:', esWhatsApp)
console.log('NO es [object Object]:', noObjeto)
console.log('texto decodificado:', textoDecodificado)
console.error('errores de consola:', errores.length)

if (!esWhatsApp || !noObjeto) {
  process.exit(1)
}
await browser.close()
