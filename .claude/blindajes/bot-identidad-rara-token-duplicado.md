---
id: bot-identidad-rara-token-duplicado
title: Bot que responde raro = otro proceso con el mismo token
tags: [bots, telegram, ops, debugging]
source: educmark
date: 2026-06-19
---

**Guard:** Si un bot 'responde otra cosa' o tiene identidad inconsistente, casi siempre es OTRO proceso haciendo polling con el mismo token, no un bug de prompt. Rota el token y mata el proceso duplicado.

**Why:** Dos procesos con un mismo token se roban los updates entre si; debuggear el prompt es perseguir un fantasma.
