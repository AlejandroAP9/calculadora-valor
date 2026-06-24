---
name: performance-review
description: "Revisión de performance del proyecto: queries N+1, waterfalls, bundle size, imágenes, re-renders, caché e índices. Activar cuando el usuario dice: revisa performance, está lento, optimiza, performance review, carga lento, antes de lanzar, mejora la velocidad."
allowed-tools: Read, Grep, Glob, Bash
---

# Performance Review

Caza los cuellos de botella comunes antes de lanzar. Es uno de los 4 revisores
pre-launch (junto a security-audit, design-review, architecture-review).

## Cómo correrla

Revisa el código y, cuando puedas, mide de verdad (build, Lighthouse, logs de
queries) en vez de adivinar. Reporta cada hallazgo con su impacto y el fix.

## Dimensiones

### Datos (Supabase / DB)
1. **N+1 queries.** Loops que hacen una query por ítem. Resuelve con un join,
   `.in()` o un select anidado.
2. **Índices faltantes.** Columnas usadas en `WHERE`/`ORDER BY`/joins sin índice.
   Revisa las queries calientes y propón los índices (incluye GIN para arrays/jsonb).
3. **Over-fetching.** `select('*')` cuando se usan 3 columnas; traer filas que se
   filtran en cliente; falta de paginación en listas grandes.
4. **Waterfalls.** `await` secuenciales que podrían ir en `Promise.all`.

### Frontend / Next.js
5. **Bundle size.** Dependencias pesadas, imports de librería completa en vez de
   por módulo, falta de dynamic import para lo no-crítico. Corre `npm run build` y
   mira los tamaños de ruta.
6. **Server vs Client Components.** `"use client"` de más arrastrando JS al cliente;
   data fetching que debería ser server-side.
7. **Imágenes.** Sin `next/image`, sin tamaños, sin lazy-load, formatos pesados.
8. **Re-renders.** Estado mal ubicado que re-renderiza árboles grandes; falta de
   `memo`/`useMemo` donde de verdad pesa (no por todos lados).

### Red y caché
9. **Caché.** Falta de `revalidate`/cache en data estable; refetch innecesario.
10. **Payloads.** Respuestas API gordas, sin compresión, sin streaming donde aplica.

## Salida

Hallazgos por impacto (🔴 bloquea UX / 🟠 notable / 🟡 menor), con evidencia
(archivo:línea o medición) y el fix concreto. Prioriza lo que el usuario siente.
Strip Back: no micro-optimices lo que no pesa. Captura con `raiz blindar` los
patrones de performance que sirvan a otros proyectos.
