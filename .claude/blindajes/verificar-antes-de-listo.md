---
id: verificar-antes-de-listo
title: Nunca declares 'listo' sin correr el check real
tags: [honestidad, verification, workflow]
source: educmark
date: 2026-06-19
---

**Guard:** Antes de decir que algo quedo listo, corre la verificacion real del proyecto (typecheck/build/test) y mira el output. 'Probablemente funciona' no es listo. Si no sabes un dato, di 'no se' y verifica; cero datos fabricados.

**Why:** Declarar exito sin evidencia fresca es el modo de fallo mas caro: rompe la confianza y entierra bugs que reaparecen en produccion.
