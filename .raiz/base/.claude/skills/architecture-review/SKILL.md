---
name: architecture-review
description: "Revisión de arquitectura del proyecto: acoplamiento, límites de módulo, deuda estructural, consistencia Feature-First. Activar cuando el usuario dice: revisa la arquitectura, está bien estructurado, architecture review, deuda técnica, esto se está volviendo un desastre, antes de lanzar, refactor."
allowed-tools: Read, Grep, Glob, Bash
---

# Architecture Review

Revisa que el proyecto sea **mantenible y coherente**, no un castillo de naipes
donde cada cambio rompe tres cosas. Es uno de los 4 revisores antes de lanzar
(junto a security-audit, design-review, performance-review).

## Cómo correrla

Mapea la estructura real (`src/`, imports, tamaños de archivo) y revisa cada
dimensión. Reporta hallazgos con severidad y el refactor concreto. No reescribas
por gusto: cada señalamiento debe tener una razón estructural.

## Dimensiones

1. **Feature-First respetado.** Cada feature debe tener su contexto colocalizado
   (`components/`, `hooks/`, `services/`, `types/`). Señala lógica de negocio
   regada en componentes, o features que se importan entre sí en cruz (deberían
   pasar por `shared/`).
2. **Límites de módulo / acoplamiento.** ¿`shared/` depende de una feature
   concreta? (no debe). ¿Hay imports circulares? ¿Una feature conoce los internals
   de otra en vez de una interfaz?
3. **God components / archivos.** Componentes de 500+ líneas, funciones que hacen
   de todo, "utils.ts" basurero. Propón la división por responsabilidad.
4. **Capas y responsabilidad.** UI no hace queries directas saltándose el service;
   server actions con lógica de negocio mezclada con acceso a datos; validación Zod
   ausente en los bordes (input de usuario, API).
5. **Estado.** Zustand vs estado local vs server state bien separados. Señala
   estado global que debería ser local, o prop-drilling profundo.
6. **Consistencia de patrones.** Mismas convenciones de naming, manejo de errores,
   data fetching en todo el repo. Tres formas distintas de hacer lo mismo = deuda.
7. **Duplicación.** Lógica copiada en vez de extraída a `shared/`. (Pero no
   sobre-abstraigas: dos usos no siempre justifican una abstracción.)
8. **Alineación al tech-spec.** Si existe `docs/plan/02-tech-spec.md`, contrasta el
   código real contra lo planificado y señala el drift.

## Salida

Hallazgos por severidad (🔴 estructural / 🟠 deuda real / 🟡 mejora / 🔵 nota), con
ubicación y el refactor propuesto. Prioriza lo que más frena el cambio futuro.
Captura con `raiz blindar` los anti-patrones que aplicarían a otros proyectos.
