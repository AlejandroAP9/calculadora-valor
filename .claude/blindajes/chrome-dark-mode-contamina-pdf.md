---
id: chrome-dark-mode-contamina-pdf
title: El dark mode del dashboard contamina los PDFs
tags: [css, print, pdf, dark-mode]
source: educmark
date: 2026-06-19
---

**Guard:** Si tu UI tiene dark mode, el color claro heredado se cuela al PDF (texto translucido/invisible). En `@media print`: fuerza `html, body { color: #000 }` + `color-scheme: light`.

**Why:** El auto dark mode del navegador hereda colores de la UI al print; sin un reset explicito para print, el PDF sale ilegible.
