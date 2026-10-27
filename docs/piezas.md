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
| Máquina de salas | `src/recorrido.js` | Pendiente | Test de inercia/snap + recorrido grabado |
| Mapa de salas | `src/salas.js` | Pendiente | Mockup aprobado |
| Mockup 7 salas | `mockups/recorrido-v1.html` | Pendiente | Aprobación visual de Erickson |

## Regla
Cuando una pieza falla, se repara **esa** pieza. No se tocan las demás.
