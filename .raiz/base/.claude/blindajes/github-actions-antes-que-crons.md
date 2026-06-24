---
id: github-actions-antes-que-crons
title: Job fantasma: revisa .github/workflows/ antes que los crons del backend
tags: [ci, cron, github-actions, debugging]
source: educmark
date: 2026-06-19
---

**Guard:** Si aparece un job/mensaje/deploy sin un scheduler obvio, revisa `.github/workflows/` ANTES de buscar en los crons del backend o la BD. Muchos 'crons fantasma' son GitHub Actions olvidados.

**Why:** Los Actions corren fuera de tu infra y no aparecen en `cron.job` ni en tu codigo de servidor; es el ultimo lugar donde uno mira y suele ser el culpable.
