---
id: webhook-firma-primero-fail-closed
title: Valida la firma del webhook antes de tocar la BD, y falla cerrado
tags: [webhooks, security, payments, hmac]
source: educmark
date: 2026-06-19
---

**Guard:** En un webhook (sobre todo de pagos), valida la firma HMAC como PRIMER paso, antes de cualquier lectura/escritura. Si el secret no esta configurado, RECHAZA (fail-closed), no proceses. Compara con `timingSafeEqual` y agrega ventana anti-replay por timestamp.

**Why:** Sin firma validada primero, un payload falsificado dispara logica financiera. Fail-open ante secret ausente convierte un error de config en un agujero.
