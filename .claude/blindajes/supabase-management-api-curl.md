---
id: supabase-management-api-curl
title: Cuando el MCP de Supabase falla, corre SQL por la Management API
tags: [supabase, mcp, sql]
source: educmark
date: 2026-06-19
---

**Guard:** Si el MCP de Supabase da 'Unauthorized' o no responde, corre el SQL directo: POST a `https://api.supabase.com/v1/projects/{ref}/database/query` con el access token en el header. Mismo resultado, sin depender del MCP.

**Why:** El MCP se cae o pierde auth seguido; la Management API es el canal estable para DDL/consultas administrativas.
