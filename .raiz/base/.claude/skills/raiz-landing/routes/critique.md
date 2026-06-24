# /raiz-landing critique

Dos partes: un **gate de completitud** (binario, lo pasas o no) y una **crítica
anti-AI-slop** (10 dimensiones). No se entrega una landing que no pase el gate.

## Gate de completitud (binario, primero)

Si cualquiera de estos falla, la landing NO está lista. Arréglalo antes de seguir.

1. **Cero placeholders vivos.** Corre:
   ```bash
   grep -rn "{{" src/ && echo "HAY PLACEHOLDERS -> NO está lista" || echo "OK: sin placeholders"
   ```
   Cualquier `{{...}}` que aparezca es un hueco sin llenar.

2. **Cero secciones vacías o inventadas.** Cada sección renderizada tiene copy real.
   Si una sección no tenía contenido real (casos, testimonios), debe estar BORRADA de
   `page.tsx`, no vacía ni con texto fabricado.

3. **Compila.** `npm run typecheck` y `npm run build` sin errores.

4. **Una sola landing coherente.** Un solo H1 (el del hero), CTAs que apuntan a anclas
   que existen, links del navbar que llevan a secciones reales.

## Crítica anti-AI-slop (10 dimensiones)

Puntúa cada una 1-5 y arregla todo lo que baje de 4:

1. **AI-slop (crítico)**: ¿tres cards idénticas? ¿botón degradado morado-azul? ¿Inter
   sobre blanco? ¿íconos genéricos sin significado? Si sí, rehazlo.
2. **Jerarquía visual**: ¿se entiende qué mirar primero? ¿el hero domina?
3. **Arquitectura de información**: ¿el orden cuenta una historia (dolor→solución→prueba→CTA)?
4. **Resonancia emocional**: ¿el copy le habla al avatar o es corporativo neutro?
5. **Affordance**: ¿los CTAs parecen clickeables y dicen qué pasa al hacer click?
6. **Composición**: ¿hay ritmo, o es una cuadrícula monótona? ¿espacios que respiran?
7. **Tipografía**: ¿la display tiene carácter? ¿se usa la itálica de acento con criterio?
8. **Color con propósito**: ¿el acento aparece sólo donde importa, o está por todos lados?
9. **Estados y bordes**: ¿el form de lead tiene loading/ok/error? ¿hover en lo clickeable?
10. **Microcopy y voz**: ¿los textos chicos (botones, labels) están en la voz del negocio?

Reporta el puntaje por dimensión + la lista de fixes concretos. `polish` los aplica.
