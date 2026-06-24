---
id: webkit-text-fill-color-print
title: Texto editable sale translucido en PDF sin -webkit-text-fill-color
tags: [css, print, pdf, forms]
source: educmark
date: 2026-06-19
---

**Guard:** Inputs y contenteditable salen gris-translucidos en el PDF. Agrega `-webkit-text-fill-color: inherit` a esos elementos para que impriman con el color real.

**Why:** WebKit aplica un fill-color propio a campos editables que el `color` normal no sobrescribe al renderizar a PDF.
