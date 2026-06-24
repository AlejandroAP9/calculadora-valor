---
id: supabase-nested-select-fk-nullable
title: Nested select de Supabase devuelve null silencioso con FK nullable
tags: [supabase, postgrest, rls]
source: educmark
date: 2026-06-19
---

**Guard:** Un nested select `tabla:otra!fk_col(...)` devuelve null en silencio cuando la FK es SET NULL + hay RLS. No asumas que el join trajo datos: si la relacion puede ser null, haz 2 queries y une con `.in()`.

**Why:** PostgREST resuelve el embed con las politicas RLS del lado embebido; si la FK es null o el RLS lo bloquea, no error, devuelve null y el bug pasa desapercibido.
