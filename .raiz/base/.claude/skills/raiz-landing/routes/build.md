# /raiz-landing build

Construye la landing de punta a punta. El orden es sagrado: **primero el contenido
real, después el código**. Una landing sin copy real es un placeholder bonito.

## 1. Entrevista (no inventes, pregunta)

Saca el contenido real del cliente. Si no tienes los datos, pregúntalos; no los
rellenes con supuestos (esto es honestidad dura). Si vienes de `site-reboot`, ya
tienes mucho de esto del sitio actual.

- **Negocio**: nombre, a qué se dedica, tono (sobrio, cálido, técnico).
- **Avatar**: a quién le habla, en una frase.
- **Dolor → solución → método**: las tres paradas narrativas (ScrollStops).
- **Servicios**: 2-4, cada uno con su resultado (no la tarea, el resultado).
- **Casos**: nombre + resultado concreto. Si no hay casos reales, no habrá sección Portfolio.
- **Proceso**: 3 pasos del "cómo trabajamos".
- **Testimonios**: reales, con nombre y rol. Si no hay, no habrá sección Proof.
- **Métricas de prueba**: 3 cifras reales (años, clientes, % de mejora).
- **Lead magnet**: si captura emails, qué entrega.
- **Contacto**: WhatsApp, email, Instagram, dominio.
- **CTA**: qué quiere que haga el visitante (cotizar, agendar, comprar).

## 2. Marca

- Cliente con logo → corre el skill `brand-palette` con su logo y pega los tokens en
  el `@theme` de `app/globals.css`. Esa es su paleta, no el default.
- Sin logo → usa el default editorial oscuro o pide su color principal.

## 3. Scaffold

1. Copia `templates/app/*` y `templates/features/landing/*` al proyecto.
2. Agrega las reglas de `templates/CLAUDE.additions.md` al `CLAUDE.md` del proyecto.
3. Rellena **todo** `data/content.ts` con el copy real de la entrevista.
4. En `app/page.tsx`, **borra las secciones que el negocio no use** (y borra su
   componente). Mejor 6 secciones reales que 10 a medias.
5. Marca con `*asteriscos*` la palabra del titular del hero que va en itálica de acento.

## 4. Cierre

Corre `/raiz-landing critique` (gate de completitud + anti-slop) y arregla con
`polish` lo que salga. Recién ahí `audit` y `deploy`. No declares la landing lista sin
pasar el critique.
