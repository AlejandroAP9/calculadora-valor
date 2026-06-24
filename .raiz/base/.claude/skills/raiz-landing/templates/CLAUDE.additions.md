# Reglas de la landing (añadir al CLAUDE.md del proyecto)

Estas reglas aplican al editar la landing generada por `raiz-landing`.

- **Contenido como datos.** Todo el copy vive en `features/landing/data/content.ts`.
  Para cambiar texto, edita ahí, no en los componentes.
- **Tokens, no hex sueltos.** Los colores salen de los tokens del `@theme` en
  `app/globals.css` (`bg-background`, `text-accent`, etc.). Para cambiar la paleta,
  corre el skill `brand-palette` y reemplaza los tokens. No metas hex en los `.tsx`.
- **Cero placeholders en producción.** Nada de `{{...}}` vivo. Sección sin contenido
  real se borra (de `page.tsx` y su componente), no se deja vacía.
- **Tipografía de marca.** Titulares con `.display`; acento itálico con `.accent-italic`.
- **Acento con propósito.** El color de acento sólo en CTA, una palabra del hero o un
  dato. No por todos lados.
- **Honestidad.** No se inventan casos, testimonios ni métricas. Si no hay, se borra la
  sección.
- **Movimiento sobrio.** El fondo es CSS (`backdrop.tsx`), costo cero. Respeta
  `prefers-reduced-motion` (ya está). No agregues librerías de animación pesadas.
