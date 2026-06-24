---
id: python-telegram-bot-concurrent-updates
title: python-telegram-bot: concurrent_updates(True) o los clicks se pierden
tags: [python, telegram, bots]
source: educmark
date: 2026-06-19
---

**Guard:** En python-telegram-bot, si un handler bloquea, los clicks de InlineKeyboard nunca llegan. Activa `concurrent_updates(True)` en el builder. Sintoma: 'se queda esperando' sin registrar el click.

**Why:** El bot procesa updates en serie por defecto; un handler lento congela la cola y los callbacks quedan sin atender.
