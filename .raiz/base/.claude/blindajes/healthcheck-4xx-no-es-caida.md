---
id: healthcheck-4xx-no-es-caida
title: Un 4xx no es caida: en healthchecks alerta solo en 5xx/timeout
tags: [monitoring, healthcheck, ops]
source: educmark
date: 2026-06-19
---

**Guard:** En un healthcheck, acepta `2xx|3xx|4xx` como 'el servicio responde'. Alerta SOLO en 5xx, timeout o connection refused. Un 404 o un 401 significan que el server esta vivo.

**Why:** Un endpoint que responde 404/401 esta operativo; tratar cualquier no-2xx como caida genera falsos positivos que entrenan a ignorar las alertas.
