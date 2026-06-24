# /raiz-landing polish

Aplica los fixes que salieron del `critique`. Trabaja de lo crítico a lo cosmético.

## Orden

1. **Gate primero.** Si el critique marcó placeholders, secciones vacías o build roto,
   eso se arregla antes que cualquier detalle visual. Una landing que no compila no se pule.
2. **AI-slop.** Rehaz lo que se vea genérico: rompe la simetría de cards iguales,
   cambia el botón cliché por el `.btn-primary` de marca, mete la tipografía display
   donde haya un titular plano.
3. **Jerarquía y ritmo.** Ajusta tamaños, espaciados (`py-24`/`py-32` entre secciones),
   alterna layout en los ScrollStops.
4. **Color con propósito.** Saca el acento de donde sobre; déjalo en CTA, una palabra
   del hero, un dato.
5. **Estados.** Verifica loading/ok/error del lead form, hover en todo lo clickeable,
   foco visible para teclado.
6. **Microcopy.** Reescribe labels y botones en la voz del negocio.

## Cierre

Vuelve a correr `/raiz-landing critique`. Si el gate pasa y no queda nada bajo 4,
sigue a `audit`. No iteres infinito: 2 vueltas de polish suelen bastar.
