---
id: regex-lookahead-no-consumir
title: Si cortas el string por match.end(), el pattern no debe consumir
tags: [regex, parsing, bug]
source: educmark
date: 2026-06-19
---

**Guard:** Si el codigo hace `texto[match.end():]` para seguir parseando, el pattern NO debe consumir el primer char del resto. Usa lookahead `(?=...)` para mirar sin consumir.

**Why:** Consumir ese char lo borra del tramo restante y aparece texto truncado (el clasico bug de la primera letra que falta).
