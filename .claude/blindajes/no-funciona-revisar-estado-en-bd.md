---
id: no-funciona-revisar-estado-en-bd
title: Ante 'no funciona', revisa el estado real en BD antes de diagnosticar
tags: [debugging, supabase, ops]
source: educmark
date: 2026-06-19
---

**Guard:** Cuando algo 'no funciona', consulta primero la tabla de attempts/jobs/estado en BD. 0 registros = el problema esta en el frontend/disparo; existen registros fallidos = el problema esta en el pipeline. No adivines la capa.

**Why:** El sintoma del usuario no dice donde fallo; el estado persistido si, y te ahorra horas de debuggear la capa equivocada.
