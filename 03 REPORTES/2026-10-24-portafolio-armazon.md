# Reporte de higiene del armazón — Portafolio ED-Dev
Fecha: 2026-10-24
Proyecto: portafolio / P0 Armazón

## Objetivo
Higiene del armazón sin tocar piezas congeladas. Alcance limitado a index.html, src/main.js, textos, proyectos, style.

## Cambios realizados

### 1. index.html
- `<html lang="en">` → `<html lang="es">`
- Título actualizado a "Portafolio ED-Dev"
- Añadida meta description con firma ED-Dev
- Open Graph básicos: og:title, og:description, og:type, og:site_name = ED-Dev

### 2. WhatsApp centralizado
- Creada constante CONFIG en `src/main.js`:
  ```js
  const CONFIG = {
    whatsappNumber: '584120000000' // PLACEHOLDER — número documentado, no inventado
  }
  ```
- Enlace WhatsApp en renderProjects ahora usa `waHref = p.linkWhatsApp.replace(/wa\.me\/\d+/, `wa.me/${CONFIG.whatsappNumber}`)`
- Cambio en un solo punto, sin inventar número real.

### 3. Trilogía ED-Dev
- Se mantuvo `urlDemo: ""` en `src/proyectos.js` sin modificar.
- Render condicional existente deja tarjeta en estado "Pronto" con span disabled, sin botón que navegue.
- No se inventó URL de demo.

### 4. Verificación post-build
- Creado `scripts/verify-build.mjs` que busca cadena "ED-Dev" en `dist/assets/*.js`
- `package.json`:
  - `build`: `vite build && node scripts/verify-build.mjs`
  - `verify`: `node scripts/verify-build.mjs`
- Build falla si el marcador no está presente.

### 5. Documentación
- Creado `README.md` con instrucciones para ejecutar `test-mundo.html` y generar evidencias con Playwright usando `record-mundo.js` y `record-real.mjs`.
- Documentada centralización de WhatsApp y verificación post-build.

## Piezas explícitamente NO tocadas

- `src/mundo-caverna.js` — congelada, en vuelo con Pi P1/P2 aprobadas.
- `test-mundo.html` — congelada, pieza P3 Recorrido en marcha.
- Mockups y referencias.
- Carpetas `02 LISTOS`, `99 ARCHIVO`.

Motivo: orden de higiene restringe trabajo SOLO al armazón. Mundo caverna y recorrido están bajo otro Pi y aprobación previa. No se introduce riesgo de regresión.

## Verificación
- `npm run build` ejecutado con éxito, verificación post-build confirma presencia de marcador ED-Dev en bundle.
- Sin deploy realizado, conforme a instrucción.

## Anexo 2026-10-24 21:xx — Número WhatsApp aprobado
- Número aprobado por Erickson: `584241875518`
- `src/main.js` CONFIG actualizado: `whatsappNumber: '584241875518'`
- Rebuild ejecutado:
  - Build OK, verificación post-build OK, marcador ED-Dev encontrado en `dist/assets/index-BVFDMXQQ.js`
- Sin cambios en piezas congeladas.

Firma: ED-Dev
