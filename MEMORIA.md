# Memoria del proyecto

## Qué es (1 línea)
Portafolio ED-Dev: webapp de una sola página con recorrido horizontal de 7 salas (Home, Landings, Apps/Juegos, Música, Libros, Video contenido, Contacto) y una caverna/jardín animado como ambiente.

## Decisiones (con fecha)
- 2026-10-24 — Armazón P0 en Vite + JavaScript vanilla (sin framework). Sigue así: ligero y rápido.
- 2026-10-24 — WhatsApp centralizado en `src/main.js` (`CONFIG.whatsappNumber`). Número aprobado por Erickson: `584241875518`.
- 2026-10-24 — La pieza `src/mundo-caverna.js` + `test-mundo.html` quedó congelada bajo un Pi anterior (P1/P2/P3 aprobadas).
- 2026-10-26 — Recorrido horizontal aprobado por Erickson con **7 salas**, no 3: Home, Landings, Apps/Juegos, Música, Libros, Video contenido, Contacto.
- 2026-10-26 — **Un solo canvas** fijo detrás del escenario deslizante, con ambiente por sala (Cueva / Jardín). Un solo bucle RAF para toda la app, para que 7 salas no multipliquen el coste.
- 2026-10-26 — Música y Libros quedan como salas "En construcción con dignidad" (0 proyectos). No se inventa contenido.
- 2026-10-26 — El filtro por tipo se elimina: la navegación por salas ES el filtro.
- 2026-10-26 — Erickson autoriza modificar `src/mundo-caverna.js` (estaba congelado) para optimización interna: DPR, pausa, debounce, caché de gradientes, densidad adaptativa. Sin cambiar su API ni su aspecto.
- 2026-10-26 — Nada público sin sí explícito. Este plan no incluye deploy, registro ni APIs de pago.

## Lecciones verificadas
- (pendiente de verificar 2x) La verificación post-build que busca el marcador `ED-Dev` en `dist/assets/*.js` funciona y falla el build cuando la firma falta.

## Vara actual (qué subió 1% y cuándo)
- 2026-10-26 — Línea base: armazón estático con i18n incompleta, fuga de IntersectionObserver, 3 canvas en test-mundo, sin docs/ ni git. Objetivo de esta actualización: recorrido navegable + caverna integrada + 60 fps en gama media + repo limpio con memoria viva.

## Pendientes
- Fase 3: REA + mockup de las 7 salas + aprobación visual de Erickson antes de codear la app.
- Fase 4: tests de UI, Lighthouse, traza de performance, evidencia en `02 LISTOS/`, reporte final.
- Rellenar Música y Libros cuando Erickson tenga material real.

## Archivo (lo viejo, sin borrar)
- `99 ARCHIVO/mockups/` — mockup-boveda, mockup-multipagina, mockup-caverna-v2/v3/v4/v5.
- `99 ARCHIVO/pruebas/` — test-mundo.html (recorrido horizontal de 3 salas, superseded por el de 7).
- `99 ARCHIVO/referencias/` — 5 mp4 de referencias-webs + 4 jpg de referencias-pinturas (31 MB, no versionados).
- `99 ARCHIVO/borrador/` — hero.png, javascript.svg, vite.svg (restos de plantilla, sin uso).
- `03 REPORTES/2026-10-24-portafolio-armazon.md` — reporte de higiene del armazón.
