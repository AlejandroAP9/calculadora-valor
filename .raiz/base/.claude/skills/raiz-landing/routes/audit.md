# /raiz-landing audit

Chequeo final antes de publicar: performance, accesibilidad y SEO. Verifica de verdad,
no a ojo.

## Site Doctor (automatizado, primero)

Antes de revisar a mano, corre el control de calidad automatico. Examina la pagina
renderizada y bloquea lo que hace que un sitio con IA se vea barato o roto. Cada
chequeo nace de un error real documentado.

```bash
node .claude/skills/raiz-landing/tools/site-doctor.mjs <archivo.html | url> [--selectors="h1,.lead"] [--json]
```

Los 5 chequeos:

1. **Contraste** — mide los pixeles reales detras de cada texto y calcula el contraste
   WCAG. Atrapa el clasico "texto blanco ilegible sobre la foto". Falla dura.
2. **Placeholders** — detecta `{{...}}`, "lorem ipsum", "TODO", "titulo de noticia" y
   demas texto de relleno que quedo vivo. Advertencia.
3. **Imagenes** — marca fotos rotas (404, falla dura) o estiradas mas alla de su
   resolucion real (se ven pixeladas, advertencia).
4. **Movil** — renderiza a 390px y detecta scroll horizontal, identificando el
   elemento que desborda. Falla dura.
5. **Accesibilidad** — h1 unico, `alt` presentes, controles con etiqueta. Advertencia.

Sale con codigo 1 si hay fallas duras. Para fallas de contraste y overflow deja una
captura anotada (`site-doctor-contraste.png`, `site-doctor-movil.png`) marcando el
problema. Regla dura: **no se deploya con fallas duras abiertas.**

El resto de esta guia (performance, SEO) sigue siendo revision a ojo informada.

## Performance

- `npm run build` y revisa el peso del bundle de la ruta. El hero no debe traer JS
  pesado: el `backdrop` es CSS, no video.
- Imágenes con `next/image` (width/height explícitos, `priority` sólo en el hero).
- Fuentes con `next/font` (ya configurado en `layout.tsx`), sin FOUT.
- Nada de librerías de animación pesadas para un fade; CSS basta.

## Accesibilidad

- Un solo `<h1>` (el hero). Jerarquía de headings correcta (`h2` por sección).
- Contraste AA: si usaste `brand-palette`, ya viene verificado. Si no, revisa texto
  sobre acento y sobre superficies.
- Todo lo interactivo es alcanzable por teclado, con foco visible.
- `alt` en imágenes; `aria-label` en botones de sólo ícono (el del navbar ya lo tiene).
- `prefers-reduced-motion` respetado (ya está en `globals.css` y `backdrop`).

## SEO

- `metadata` lleno en `layout.tsx` (title, description, OG, canonical) desde `SEO`.
- `og.jpg` 1200×630 en `public/`.
- `robots.ts` y `sitemap.ts` presentes (ya incluidos) con el dominio real.
- Texto real en el HTML (no todo dentro de imágenes), headings descriptivos.

## Comparación (si vienes de site-reboot)

Captura el resultado con Playwright y ponlo lado a lado con el sitio anterior. El
antes/después es lo que cierra al cliente.
