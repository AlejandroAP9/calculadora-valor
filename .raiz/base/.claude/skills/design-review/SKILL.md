---
name: design-review
description: "Revisión y refinamiento de calidad visual (anti-AI-slop): critica la UI en dimensiones concretas, la alinea al design-system elegido y la pule para que no se vea genérica. Activar cuando el usuario dice: revisa el diseño, se ve genérico, parece hecho con IA, mejora la UI, critica esta pantalla, pule el diseño, design review, no me gusta cómo se ve, hazlo más pro."
allowed-tools: Read, Grep, Glob, Bash
---

# Design Review

Evita el "AI slop": la UI que funciona pero se ve idéntica a cualquier otra hecha
con IA (gradientes morados al azar, espaciado inconsistente, todo centrado, cero
jerarquía). Critica con criterio y luego pule.

## Cómo correrla

1. **Mira la UI real, no el código.** Levanta la app (`npm run dev`) y usa
   Playwright para capturar screenshots de las pantallas clave (desktop y móvil).
   No critiques de memoria; critica lo que se ve.
2. **Identifica el design-system** elegido del proyecto (`.claude/design-systems/`).
   Si no hay uno definido, propónlo antes de pulir.
3. **Critica** cada pantalla en las dimensiones de abajo, con hallazgos concretos
   (qué, dónde, por qué falla, cómo se arregla).
4. **Pule**: aplica los fixes y vuelve a capturar para comparar antes/después.

## Dimensiones de crítica

1. **Jerarquía visual.** ¿El ojo sabe dónde mirar primero? Un tamaño/peso/color
   dominante por sección. Si todo grita, nada grita.
2. **Tipografía.** Escala coherente (no 7 tamaños arbitrarios), interlineado
   legible, longitud de línea 45-75 caracteres, contraste de pesos.
3. **Espaciado y ritmo.** Escala consistente (4/8px). Espaciado interno vs externo
   intencional. El "aire" no es desperdicio; agrupa por proximidad.
4. **Color y contraste.** Paleta del design-system, no morado random. Contraste
   AA (texto normal ≥ 4.5:1, grande ≥ 3:1). Acento usado con moderación.
5. **Consistencia.** Botones, inputs, cards, radios y sombras del mismo lenguaje.
   Nada de tres estilos de botón en una pantalla.
6. **Estados.** hover, focus (visible, para teclado), active, disabled, **loading**
   (skeleton, no spinner pelado), **empty** (con guía, no vacío frío), **error**.
7. **Accesibilidad (a11y).** Foco visible, labels en inputs, `alt` en imágenes,
   roles/aria donde toca, navegable por teclado, no comunicar solo por color.
8. **Densidad y layout.** Alineación a una grilla, ancho de contenido controlado
   (no full-bleed de texto), responsive real (no solo "se encoge").
9. **Detalle (lo que separa pro de slop).** Microcopy claro, transiciones suaves
   y con propósito, esquinas/sombras coherentes, íconos del mismo set, sin texto
   placeholder olvidado.

## Salida

- **Crítica**: lista priorizada por impacto (qué rompe más la percepción primero),
  cada ítem con screenshot/ubicación y el arreglo concreto.
- **Polish**: aplica los fixes de mayor impacto, respeta el design-system, y
  muestra antes/después. Strip Back: el cambio simple que sube más el listón gana.

No rediseñes por gusto: cada cambio debe tener una razón de diseño explícita.
