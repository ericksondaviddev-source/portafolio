# Referencias — Portafolio ED-Dev

## Material propio archivado
En `99 ARCHIVO/referencias/` (no versionado por git, son 31 MB):

**referencias-webs/** — 5 grabaciones de pantalla (2026-10-23), de sitios que se tomaron como referente visual.
**referencias-pinturas/** — 4 fotos (2026-10-23) usadas como base del ambiente pictórico de la casa.

## Referentes externos (REA)
Se documentan aquí cuando la Fase 3 arranque: 1 a 3 referentes, de los que solo se mina el **mecanismo** (navegación entre salas, ambientación de fondo, relación entre gesto y ambiente). Nunca se importa un modelo entero ajeno: se reconstruye propio.

## Mecanismos que nos interesan
1. **Recorrido espacial con snap** — pasar de una sección a otra con inercia y anclaje.
2. **Fondo generativo reactivo al puntero** — ambiente que responde sin distraer.
3. **Mapa de secciones** — que el usuario sepa cuántas hay y dónde está.

Los tres van en `src/recorrido.js` y `src/mundo-caverna.js`, reconstruidos propios.