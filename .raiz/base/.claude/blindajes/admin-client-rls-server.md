---
id: admin-client-rls-server
title: Insert server-side a tabla con RLS owner-only falla silencioso
tags: [supabase, rls, server-actions]
source: educmark
date: 2026-05-01
---

**Guard:** Para inserts/updates server-side a tablas con RLS de owner, usa un
admin client (`createAdminSupabase` con `SERVICE_ROLE_KEY`) y valida el ownership
a mano en TypeScript. No confíes en que la sesión del usuario pase el RLS desde el server.

**Why:** El cliente server-side no lleva el JWT del usuario, así que el RLS
owner-only rechaza (o devuelve null silencioso) la operación. El admin client
salta el RLS; la validación de ownership la haces tú en código.
