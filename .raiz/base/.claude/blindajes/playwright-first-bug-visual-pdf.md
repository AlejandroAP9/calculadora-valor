---
id: playwright-first-bug-visual-pdf
title: Bug visual solo en PDF: reproduce con Playwright page.pdf()
tags: [playwright, pdf, debugging]
source: educmark
date: 2026-06-19
---

**Guard:** Si un bug visual aparece SOLO en el PDF/print y no en pantalla, no iteres CSS a ciegas: reproduce con Playwright + `page.pdf()` y depura sobre el output real. Llegas en minutos en vez de a tientas.

**Why:** El render de print difiere del de pantalla; sin reproducir el medio exacto, cada cambio de CSS es una apuesta.
