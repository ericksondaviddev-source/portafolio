# Piezas — Portafolio ED-Dev

Estado de cada pieza. "Congelada" = no se toca sin permiso de Erickson.

| Pieza | Archivo | Estado | Nota |
|---|---|---|---|
| Armazón UI | `src/main.js` | En marcha (Fase 1) | Se reescribe el render, no se regenera desde cero. |
| Caverna / Jardín | `src/mundo-caverna.js` | Aprobada + optimizada (Fase 2) | Pieza P1/P2 de un Pi anterior. Erickson autorizó la reparación interna el 2026-10-26. API pública intacta. |
| Recorrido 3 salas | `99 ARCHIVO/pruebas/test-mundo.html` | Archivada | Supersedida por el recorrido de 7 salas. |
| Mockup multipágina | `99 ARCHIVO/mockups/mockup-multipagina.html` | Archivada | Su idea de "en construcción con dignidad" se reutiliza en Música/Libros. |
| Mockup caverna v5 | `99 ARCHIVO/mockups/mockup-caverna-v5.html` | Archivada | Base visual del recorrido nuevo. |
| Verificación post-build | `scripts/verify-build.mjs` | Aprobada | Busca el marcador `ED-Dev` en el bundle. Se extiende en Fase 4. |
| Grabación de evidencia | `scripts/record-mundo.js`, `scripts/record-real.mjs` | Activa | Generan capturas y video del recorrido. |

## Piezas nuevas (Fase 3)
| Pieza | Archivo | Estado | Cierre |
|---|---|---|---|
| Máquina de salas | `src/recorrido.js` | Aprobada con evidencia 2026-10-27 | Navegación reparada, 60-61 FPS, 0 errores, capturas de las 7 salas |
| Mapa de salas | `src/salas.js` | Aprobada con evidencia 2026-10-27 | Las 7 salas renderizadas y navegables, mapa activo por sala |
| Captura de salas | `scripts/captura-salas.mjs` | Aprobada | Genera las 14 capturas (7 salas × escritorio/móvil) |
| Inercia de la rueda | `src/recorrido.js` + `scripts/prueba-inercia.mjs` | Aprobada 2026-10-27 | Lerp con freno + snap al asentarse; FPS 60 intactos |
| Amanecer cueva↔jardín | `src/mundo-caverna.js` + `scripts/captura-amanecer.mjs` | Aprobada 2026-10-27 | Reparación autorizada: blend continuo, API intacta, 60 FPS |
| Parallax de títulos | `src/recorrido.js` | Aprobada 2026-10-27 | translateX/opacity con peso, off con reduced-motion |
| HUD: progreso + Contacto | `src/recorrido.js` + `scripts/prueba-hud.mjs` | Aprobada 2026-10-27 | Barra arriba, contacto abajo-derecha, se oculta en su sala |
| Tipografía + tarjetas (P6.1) | `src/style.css` + `src/recorrido.js` + `src/main.js` | Aprobada 2026-10-27 | Space Grotesk + Inter locales (woff2), h1 editorial, tarjetas 340px+ con tag y botones Ver demo/WhatsApp |
| Fondo vivo (P6.2) | `src/mundo-caverna.js` + `src/recorrido.js` | Aprobada 2026-10-27 | `setScene({scroll,seed})`: parallax por capas + variantes por sala; parallax de títulos matemático + `will-change` (58 FPS en vuelo, 60 estable) |
| Destacados en Home | `src/recorrido.js` + `src/style.css` | Por aprobar (captura lista 2026-10-27) | 3 tarjetas destacado bajo el hero, reutiliza `crearCard`; falta el sí de Erickson |
| Rutas por sala (A1) | `src/recorrido.js` | Aprobada 2026-10-28 | `#/landings`: aterriza, URL cambia con la sala; `prueba-rutas.mjs` verde |
| Idioma sin recarga (A2) | `src/main.js` + `src/recorrido.js` | Aprobada 2026-10-28 | Repinta y conserva la sala; destroy limpio (canvas, observers, listeners) |
| og para compartir (A3) | `scripts/gen-og.mjs` → `public/og-image.jpg` | Aprobada 2026-10-28 | 62 KB JPEG desde la sala real de la web |
| Fuentes latino (B1) | `src/fonts.css` | Aprobada 2026-10-28 | Solo woff2 latinos: 9 archivos → 2, ~200 KB → ~71 KB |
| Parallax legible (B2) | `src/recorrido.js` | Aprobada 2026-10-28 | Piso de opacidad 0.25 → 0.45 en vuelo |
| Variantes marcadas (B3) | `src/mundo-caverna.js` | Aprobada 2026-10-28 | Cúpula, sol y antorcha varían fuerte por semilla de sala |
| Accesibilidad del recorrido (B4) | `src/recorrido.js` | Aprobada 2026-10-28 | `aria-live` anuncia sala, `aria-current` en mapa |
| Imagen en fichas (C1) | `src/recorrido.js` + `src/proyectos.js` | Listo, sin material | Campo `imagen` opcional; espera capturas de Erickson. Guía en `docs/datos.md` |
| Logo + favicon | `public/logo.svg`, `logo-claro.svg`, `favicon.svg` | Aprobada 2026-10-28 | Arco + sol partido gold/verde; 2 variantes (oscuro/claro), favicon 16 px legible; `mockup-logo.png` |
| Kicker de marca | `src/recorrido.js` | Aprobada 2026-10-28 | Home firma "ED-Dev" + signo; números SOLO en el mapa; capturas 7 salas |
| Estándar ED-Dev | `~/.config/opencode/ESTANDAR-ED-DEV.md` + `AGENTS.md` | Activo 2026-10-28 | Fuente única con valores reales; línea en reglas globales |
| Kit de arranque | `~/.config/opencode/plantilla-ed-dev/` | Activo 2026-10-28 | Portátil (no depende de este proyecto); "ED-Dev nuevo" lo copia |
| Anuncio aria-live | `src/recorrido.js` + `scripts/prueba-rutas.mjs` | Reparada 2026-10-28 | Bug de bloque duplicado silenciaba el anuncio; aserción "Sala 5 de 7" añadida |

## Regla
Cuando una pieza falla, se repara **esa** pieza. No se tocan las demás.
