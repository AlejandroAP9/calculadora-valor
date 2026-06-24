---
id: tsc-noemit-completo-antes-de-commit
title: lint OK no es build OK: corre tsc completo antes de commitear
tags: [typescript, deploy, ci]
source: educmark
date: 2026-06-19
---

**Guard:** Antes de commitear, corre `tsc --noEmit` COMPLETO (o `npm run build`), no un grep filtrado ni solo el lint. El deploy corre el typecheck entero y un error en un archivo que no tocaste te rompe la build.

**Why:** ESLint y un typecheck parcial pasan aunque haya errores de tipos en otros archivos; el build de produccion no perdona.
