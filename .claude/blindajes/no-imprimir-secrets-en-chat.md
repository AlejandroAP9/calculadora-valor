---
id: no-imprimir-secrets-en-chat
title: Nunca pidas cat de archivos con secrets
tags: [security, secrets, dx]
source: educmark
date: 2026-06-19
---

**Guard:** No corras `cat` de `.env` ni de archivos con tokens: los pega al chat/historial y quedan expuestos. Extrae el valor a una variable sin imprimirlo, o copialo via gestor de contrasenas.

**Why:** El historial de la sesion se persiste y se comparte; un secret impreso una vez queda filtrado para siempre.
