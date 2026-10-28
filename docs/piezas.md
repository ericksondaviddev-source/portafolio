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

## Regla
Cuando una pieza falla, se repara **esa** pieza. No se tocan las demás.
