---
id: nextjs-redirect-try-catch
title: redirect() dentro de try/catch no redirige
tags: [nextjs, server-actions]
source: educmark
date: 2026-05-15
---

**Guard:** Llama a `redirect()` y `notFound()` FUERA de cualquier bloque
try/catch en Server Actions y route handlers de Next.js.

**Why:** `redirect()`/`notFound()` funcionan lanzando una excepción especial
(`NEXT_REDIRECT`). Un `catch` envolvente la atrapa y la suprime, así que la
redirección nunca ocurre y el error queda tragado.
