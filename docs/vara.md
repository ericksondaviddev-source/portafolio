# Vara — Portafolio ED-Dev

La vara sube 1% con cada pieza. Nada baja.

## Vara heredada
- Ligero y rápido, 60 fps en teléfono de gama media.
- Experiencia completa sin WebGL (solo canvas 2D).
- Tipografía elegante, colores intensos y profundos, scrolls con intención.
- Números y precios siempre legibles y completos.
- Contenido en archivos de datos editables, no hardcodeado.

## Línea base — 2026-10-24 (armazón P0)
- Vite + JS vanilla, 6 proyectos en catálogo, ES/EN, filtro por tipo, WhatsApp centralizado.
- Pieceza "Mundo Caverna" aprobada pero **sin integrar** en la app: vivía solo en `test-mundo.html`.
- i18n incompleta, fuga de `IntersectionObserver`, tarjeta de WhatsApp muerta, sin `<h1>`, sin docs, sin git.

## Qué sube 1% en esta actualización

### Fase 0 — higiene (2026-10-26)
- El proyecto deja de ser un armazón suelto: nace `MEMORIA.md`, `AGENTS.md`, `docs/` y un repo git.
- Raíz limpia: 31 MB de referencias y 8 mockups fuera del área de trabajo, sin borrar historia.

### Fase 1 — calidad (2026-10-26)
- i18n que funciona de verdad en las dos pantallas, sin parche a mano.
- Cero observers huérfanos, cero números duplicados, una sola fuente de verdad para WhatsApp.
- Accesibilidad real: `<h1>`, skip link, foco visible, contraste en modo claro.
- SEO completo: `og:image`, canonical, JSON-LD, sitemap.

### Fase 2 — rendimiento (2026-10-26)
- La caverna dibuja a resolución real del dispositivo (DPR) en vez de 1×.
- Un solo bucle de animación activo; se pausa con la pestaña oculta y fuera de pantalla.
- El gradiente de la antorcha se cachea en vez de recrearse cada frame.
- `resize` con debounce y sin recrear 660 partículas por evento.
- Densidad adaptativa al tamaño de pantalla; modo estático con `prefers-reduced-motion`.

### Fase 3 — recorrido (2026-10-26)
- De "scroll vertical" a "recorrido de 7 salas" con narrativa: caverna (Home, Landings, Apps) → jardín (Música, Libros) → VIDEO contenido (vuelve a la caverna) → contacto (salida a la luz).
- Navegación con mapa de salas y barra de progreso: el usuario siempre sabe dónde está.
- Botón de Contacto siempre visible: nadie tiene que llegar al final para escribir.

### Fase 4 — cierre (2026-10-26)
- Checks automáticos de UI que no dependan solo del build verde.
- Evidencia vista: capturas y grabación del recorrido, en escritorio y móvil.

## Pendiente de subir
- Rellenar Música y Libros con material real.
- Ficha de cada proyecto con imagen cuando Erickson entregue las capturas.
