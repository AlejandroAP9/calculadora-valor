---
id: webhook-idempotencia-atomica
title: Idempotencia de webhook por SELECT-luego-INSERT tiene carrera
tags: [webhooks, idempotency, supabase, payments]
source: educmark
date: 2026-06-19
---

**Guard:** No confies en `SELECT existe? -> INSERT` para idempotencia de webhooks: dos eventos concurrentes del mismo id pasan ambos el SELECT y duplican. Pon un indice unico (parcial) en el id del evento y maneja el `23505` como 'ya procesado'.

**Why:** El proveedor reintenta y manda eventos en paralelo; sin garantia atomica en BD, duplicas transacciones, alertas o revenue.
