---
id: lockfile-node-version-deploy
title: package-lock de npm nuevo rompe el build en el deploy
tags: [deploy, npm, node, easypanel]
source: educmark
date: 2026-04-10
---

**Guard:** Antes de tocar `package.json`, fija la versión de Node a la que usa
producción (ej. `nvm use 22` → npm 10.9.8). No regeneres el lockfile con un npm
más nuevo que el del servidor de deploy.

**Why:** Un `package-lock.json` generado por npm 11 (Node 24) usa un formato que
el builder de producción (npm más viejo) no entiende, y el deploy falla con
"Missing X from lock file". El lockfile debe nacer con el npm del entorno destino.
