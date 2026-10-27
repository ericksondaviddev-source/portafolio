# Portafolio ED-Dev — proyecto personal ED-Dev

Aplica las reglas globales ED-Dev.

Proyecto: Portafolio ED-Dev

Lee MEMORIA.md al empezar y actualízala al terminar.
Puerta 0 antes de codear. Iterar, nunca regenerar. Piezas verificadas con evidencia.
Una carpeta, sin basura. Costo cero, local. Nada público sin el sí de Erickson. Firma ED-Dev.

## Reglas propias de este proyecto
- El contenido (proyectos, salas, textos) vive en archivos de datos editables bajo `src/`: `proyectos.js`, `salas.js`, `textos.js`. Nada hardcodeado en el HTML.
- El número de WhatsApp vive solo en `CONFIG.whatsappNumber` (`src/main.js`). Nunca duplicarlo en otro archivo.
- `src/mundo-caverna.js` es una pieza optimizada: no reescribirla, repararla. Su API pública es `new MundoCaverna(canvas, {mode})`, `setMode(m)`, `resize()`.
- Nada se publica ni se registra sin el sí explícito de Erickson.
