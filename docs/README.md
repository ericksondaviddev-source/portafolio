# Documentación viva — Portafolio ED-Dev

Esto es lo que existe, en simple.

## Qué es
Un portafolio que se recorre como si fueran casas en una caverna: 7 salas horizontales, cada una con su ambiente. Al final sales a la luz y escribes por WhatsApp.

## Las 7 salas
1. **Home** — portada y proyectos destacados.
2. **Landings** — webs de marca (El Rincón Venezolano, Ritmo Na'má).
3. **Apps / Juegos** — Cargo Express CFT, Inglés con Chunks, Completa el Compás.
4. **Música** — en construcción con dignidad.
5. **Libros** — en construcción con dignidad.
6. **Video contenido** — Trilogía ED-Dev (lyric videos).
7. **Contacto** — WhatsApp, propuesta copiada, firma ED-Dev.

## Dónde está cada cosa
| Ruta | Qué hay |
|---|---|
| `index.html` | La entrada. Estructura, meta SEO, JSON-LD. |
| `src/main.js` | El armazón: datos, idioma, contacto, render. |
| `src/recorrido.js` | La máquina de salas: inercia, snap, teclado, táctil. |
| `src/salas.js` | El mapa de salas (dato editable). |
| `src/proyectos.js` | El catálogo de proyectos (dato editable). |
| `src/textos.js` | Los textos ES/EN (dato editable). |
| `src/mundo-caverna.js` | La caverna y el jardín (canvas 2D). |
| `src/style.css` | Los tokens de color y todo el estilo. |
| `scripts/` | Verificación de build y checks de UI. |
| `02 LISTOS/` | Piezas terminadas con su evidencia. |
| `99 ARCHIVO/` | Lo viejo, archivado. No se borra. |

## Cómo se trabaja aquí
- `npm run dev` → abre http://localhost:5173
- `npm run build` → compila y verifica que la firma ED-Dev quedó en el bundle. Si no, falla.
- `npm run verify` → solo la verificación.

## Reglas de la casa
- WhatsApp: un solo número, en `CONFIG.whatsappNumber` (`src/main.js`). Ya aprobado: `584241875518`.
- Nada se publica ni registra sin el sí de Erickson.
- Todo termina con firma ED-Dev.
- El contenido se edita en los archivos de datos, no en el código.

ED-Dev
