---
id: live-db-tiene-fantasmas
title: Tu BD en vivo guarda logica que tu repo no conoce
tags: [supabase, postgres, debugging, migrations]
source: educmark
date: 2026-06-19
---

**Guard:** Cuando algo falla de forma inexplicable y el codigo se ve perfecto, lista los TRIGGERS y funciones reales de la BD en vivo (`pg_get_triggerdef`), no solo grepees migraciones. Lo creado a mano desde un panel no esta versionado.

**Why:** Triggers/funciones creados por dashboard viven solo en la BD, fuera de control de versiones; son el culpable que nunca aparece en el codigo.
