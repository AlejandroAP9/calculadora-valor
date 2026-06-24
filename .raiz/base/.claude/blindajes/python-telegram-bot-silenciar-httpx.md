---
id: python-telegram-bot-silenciar-httpx
title: Silencia el logger de httpx o filtras tokens a los logs
tags: [python, telegram, bots, security, logging]
source: educmark
date: 2026-06-19
---

**Guard:** Sube el nivel del logger de `httpx` (a WARNING) en bots de Telegram. Si no, las URLs con el `<TOKEN>` del bot entran al log/journald y se filtran.

**Why:** httpx loggea cada request en INFO incluyendo la URL completa de la Bot API, que lleva el token embebido.
