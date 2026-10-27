# Portafolio ED-Dev

Portafolio de ED-Dev con recorrido horizontal de 7 salas y una caverna/jardín animado como ambiente.

Proyecto personal ED-Dev. Firma ED-Dev.

## Las 7 salas

1. **Home** — portada y proyectos destacados
2. **Landings** — webs de marca
3. **Apps / Juegos** — productos digitales
4. **Música** — en construcción con dignidad
5. **Libros** — en construcción con dignidad
6. **Video contenido** — lyric videos
7. **Contacto** — WhatsApp, propuesta copiada, firma ED-Dev

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Build

```bash
npm run build
```

El script `build` ejecuta Vite y luego `scripts/verify-build.mjs`, que verifica la presencia de la cadena `ED-Dev` en `dist/assets/*.js`. Si no se encuentra, el build falla.

```bash
npm run verify   # solo la verificación
```

## Contacto (WhatsApp)

El número de WhatsApp está centralizado en `src/main.js`:

```js
const CONFIG = {
  whatsappNumber: '584241875518' // aprobado por Erickson
}
```

No duplicar el número en ningún otro archivo.

## Dónde está cada cosa

| Ruta | Qué hay |
|---|---|
| `index.html` | Entrada, meta SEO, JSON-LD |
| `src/main.js` | Armazón: datos, idioma, contacto, render |
| `src/recorrido.js` | Máquina de salas: inercia, snap, teclado, táctil |
| `src/salas.js` | Mapa de salas (dato editable) |
| `src/proyectos.js` | Catálogo de proyectos (dato editable) |
| `src/textos.js` | Textos ES/EN (dato editable) |
| `src/mundo-caverna.js` | La caverna y el jardín (canvas 2D) |
| `src/style.css` | Tokens de color y estilo |
| `scripts/` | Verificación de build y checks de UI |
| `docs/` | Documentación viva |
| `02 LISTOS/` | Piezas terminadas con evidencia |
| `99 ARCHIVO/` | Lo viejo, archivado. No se borra |

## Generar evidencias

```bash
npm run dev                 # servidor en http://localhost:5173
npx playwright install chromium
node scripts/record-real.mjs
node scripts/record-mundo.js
```

Las evidencias se guardan en `02 LISTOS/Portafolio-Recorrido/evidencia-pieza-N/`.

## Reglas de la casa

- Nada se publica ni se registra sin el sí explícito de Erickson.
- Todo termina con firma ED-Dev.
- El contenido se edita en los archivos de datos, no en el código.

ED-Dev
