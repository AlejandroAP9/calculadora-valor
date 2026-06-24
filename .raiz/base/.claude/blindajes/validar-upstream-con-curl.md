---
id: validar-upstream-con-curl
title: API externa rara: valida con curl directo antes de debuggear codigo
tags: [debugging, api, http]
source: educmark
date: 2026-06-19
---

**Guard:** Si una API externa o un LLM devuelve vacio/raro, valida con `curl` directo usando la key ANTES de leer tu codigo. 30 segundos de curl vs varios commits especulativos.

**Why:** El bug suele estar upstream (key, endpoint, payload), no en tu codigo; confirmarlo primero evita arreglar lo que no esta roto.
