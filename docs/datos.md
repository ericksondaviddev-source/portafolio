# Cómo se edita el contenido (para un niño, para Erickson)

Todo lo que se ve en la web vive en 3 archivos de datos. No toques el HTML ni el CSS para cambiar contenido: edita estos archivos, guarda, y la web se actualiza sola.

## `src/salas.js` — las 7 salas
Cada sala es un bloque así:

```js
{
  id: 'landings',            // nombre corto para el enlace (#/landings)
  ambiente: 'cueva',         // 'cueva' o 'jardin': define el fondo
  titulo: { es: 'Landings', en: 'Landings' },
  resumen: { es: 'Webs de marca con identidad propia.', en: 'Brand sites with their own identity.' }
}
```

## `src/proyectos.js` — los proyectos
Cada proyecto es un bloque:

```js
{
  id: 'rincon',
  type: 'landing',           // landing | app | video
  sala: 'landings',          // en qué sala vive
  destacado: true,           // true = aparece también en Home
  estado: 'listo',           // listo | proximo
  title: { es: 'El Rincón Venezolano', en: 'El Rincón Venezolano' },
  description: { es: '...', en: '...' },
  urlDemo: 'https://...',    // vacío = botón "Pronto"
  propuesta: { es: 'Hola ED-Dev...', en: 'Hi ED-Dev...' },   // texto del WhatsApp
  imagen: '/img/rincon.jpg'  // OPCIONAL: captura del proyecto. Si no existe, la tarjeta se muestra sin imagen
}
```

Reglas rápidas:
- ¿Proyecto nuevo en una sala nueva? Añade aquí el bloque con su `sala`.
- ¿Quieres marcarlo en la portada? Pon `destacado: true`.
- ¿Tienes la captura? Sube la imagen a `public/img/` y pon la ruta en `imagen`.
- El número de WhatsApp NO está aquí: vive solo en `src/main.js` (`CONFIG.whatsappNumber`).

## `src/textos.js` — los textos de la interfaz
Botones, títulos y frases. Cada texto tiene sus dos versiones (`es` y `en`). Si añades una clave en un idioma, añádela también en el otro.
