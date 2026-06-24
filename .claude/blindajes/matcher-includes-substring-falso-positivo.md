---
id: matcher-includes-substring-falso-positivo
title: matchear con .includes() da falso positivo por substring
tags: [matching, strings, bug]
source: educmark
date: 2026-06-19
---

**Guard:** Para matchear una key contra una lista, NO uses `.includes()`: una key corta gana sobre una larga que la contiene. Match exacto primero; si necesitas fuzzy, ordena por longitud DESC.

**Why:** `'plan'.includes` matchea 'plan' dentro de 'plan-premium' y agarra el equivocado. El substring no respeta limites de token.
