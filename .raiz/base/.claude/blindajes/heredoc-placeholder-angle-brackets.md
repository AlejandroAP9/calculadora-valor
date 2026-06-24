---
id: heredoc-placeholder-angle-brackets
title: Heredocs con placeholders <X> no son robustos
tags: [bash, shell, dx]
source: educmark
date: 2026-06-19
---

**Guard:** No uses placeholders tipo `<PEGAR_AQUI>` en heredocs o comandos para que el usuario rellene: deja los angle brackets al pegar y bash los lee como redireccion. Usa `"PEGAR_AQUI"` entre comillas.

**Why:** `<` y `>` sin escapar son operadores de redireccion en el shell; el comando falla o crea archivos basura.
