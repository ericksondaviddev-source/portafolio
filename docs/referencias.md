# Referencias — Portafolio ED-Dev

## Material propio archivado
En `99 ARCHIVO/referencias/` (no versionado por git, son 31 MB):

**referencias-webs/** — 5 grabaciones de pantalla (2026-10-23), de sitios que se tomaron como referente visual.
**referencias-pinturas/** — 4 fotos (2026-10-23) usadas como base del ambiente pictórico de la casa.

## Referentes externos (REA) — 2026-10-26

**Referente 1 — Camille Mormal** (https://camillemormal.com/) · captura: `99 ARCHIVO/referencias/referente-camille-mormal.png` · Lighthouse móvil: **100 / 100 / 100 / 100**
Qué se mina:
- **Un solo eje, sin mezclar.** La rueda empuja lateral con inercia; en el teléfono es un swipe. Media mitad horizontal y media vertical es donde el impuesto de usabilidad te cobra.
- **Contador de posición.** "Solo hay un eje y un contador de progreso": el usuario siempre sabe dónde está.
- **Mapa de páginas numerado** (1..8) para saltar a cualquier punto.
- **Carga inicial con contador** que ya enseña que el recorrido es un riel.

**Referente 2 — Le Mans Classic / Richard Mille** (https://lemansclassic.richardmille.com/)
Qué se mina:
- **Capitular el riel.** "Doce mil píxeles sin waypoints son un pasillo sin puertas": un menú de capítulos convierte un test de resistencia en una historia navegable.
- La dirección lateral **tiene que significar algo**: aquí el eje es el día de la carrera. Para nosotros el eje es literal: caminas por salas de una caverna.

**Referente 3 — Guía de scroll horizontal** (https://dappasol.com/guides/horizontal-scroll-website-examples/)
Qué se mina (los riesgos que hay que pagar):
- La barra de scroll desaparece → hace falta un indicador propio.
- El gesto de retroceso del móvil pelea con la página → hay que aislar el contenedor (`overscroll-behavior`).
- Los usuarios de teclado se caen del borde → hay que dar soporte a ←/→ y foco visible.
- El scroll restoration se rompe → hay que guardar la sala en `localStorage` y restaurarla al volver.

**Lo que NO se copia:** ninguno de los tres aporta contenido, tipografía ni modelo entero. Solo se reconstruyen los mecanismos de: un solo eje, snap nativo, contador de posición, mapa de salas y aislamiento del gesto.

Los tres van en `src/recorrido.js` y `src/mundo-caverna.js`, reconstruidos propios.