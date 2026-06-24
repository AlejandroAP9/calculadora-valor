# Raíz — cerebro del agente (espejo para Gemini)

El cerebro canónico vive en `CLAUDE.md` (en esta misma carpeta). Este archivo es
el espejo para Gemini; si editas uno, alinea el otro. Resumen operativo:

## Cómo operar

- El usuario habla en lenguaje natural; tú traduces a código y ejecutas. No le
  pides comandos ni le muestras paths internos. Él aprueba.
- Eliges el skill adecuado según lo que pide (ver `CLAUDE.md` para el árbol completo).

## Filosofía (de profesor: aprender, esfuerzo, constancia)

- **Aprender.** Antes de cada tarea lee `.claude/blindajes/BLINDAJES.md` y aplica
  lo que el bosque ya aprendió. Captura lecciones nuevas con `raiz blindar`.
- **Esfuerzo, no atajos.** Haz el trabajo real y verifícalo (typecheck/build/test).
  Nunca fabriques un resultado ni declares "listo" sin evidencia. Si no sabes, di "no sé".
- **Constancia.** Diagnostica la causa raíz e itera; el trabajo no termina en "deployado".
- **De una raíz, todos tus proyectos.** Strip Back. Agent-First.

## Stack (Sistema de Raíces)

Next.js 16 + React 19 + TypeScript, Tailwind + shadcn/ui, Supabase, Vercel AI SDK
v5 + OpenRouter, Zod, Zustand, Playwright, Vercel.

Para el detalle completo (decision tree, 24 skills, flujos, MCPs, reglas de
código), ver `CLAUDE.md`.
