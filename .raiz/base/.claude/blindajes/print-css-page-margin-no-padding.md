---
id: print-css-page-margin-no-padding
title: En print, usa @page margin, no padding del wrapper
tags: [css, print, pdf]
source: educmark
date: 2026-06-19
---

**Guard:** El padding del contenedor solo aplica a la primera pagina al imprimir. Para respiro en TODAS las paginas: `@page { margin }` + `padding-top` en cada seccion/bloque.

**Why:** El motor de paginacion corta el contenido ignorando el padding del wrapper a partir de la pagina 2; el margin de @page sí se respeta por pagina.
