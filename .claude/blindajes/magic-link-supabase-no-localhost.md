---
id: magic-link-supabase-no-localhost
title: El magic link de Supabase ignora redirectTo fuera de la allowlist
tags: [supabase, auth, testing]
source: educmark
date: 2026-06-19
---

**Guard:** `generateLink` ignora `redirectTo` si la URL no esta en la allowlist de Auth, y no redirige a localhost. Valida los flujos de auth contra produccion o un dispositivo real, no asumas que el link local funciona.

**Why:** El backend silenciosamente cae al site_url configurado; pruebas locales 'pasan' pero el flujo real lleva a otra parte.
