---
id: claude-agent-sdk-allowed-tools-no-bloquea
title: allowed_tools del claude-agent-sdk no bloquea de verdad
tags: [claude-agent-sdk, ai, security]
source: educmark
date: 2026-06-19
---

**Guard:** En claude-agent-sdk, `allowed_tools` NO es vinculante para bloquear. Para impedir una tool de verdad, usa una lista `DENIED_TOOLS` dentro de `can_use_tool`.

**Why:** `allowed_tools` filtra que se ofrece, pero el modelo puede invocar otras; el bloqueo real se hace en el callback de permiso.
