---
name: site-reboot
description: Toma la URL del sitio web actual de un cliente, lo visita con Playwright, lo audita (capturas, copy, estructura, problemas) y reconstruye uno renovado y mejor componiendo brand-palette + raiz-landing. Para renovar sitios existentes de colegios, clínicas, pymes, agencias. Triggers "renueva este sitio", "mejora la web del colegio", "rehaz esta pagina", "moderniza este sitio", "dale una vuelta a esta web".
---

# site-reboot — del sitio viejo a uno renovado

Renovar un sitio que ya existe es distinto a partir de cero: el cliente ya tiene
contenido, marca y estructura. El trabajo es **rescatar lo que sirve, diagnosticar lo
que no, y reconstruir mejor**. Este skill orquesta esa secuencia. No reemplaza a
`raiz-landing` ni a `brand-palette`: los encadena, y aporta el paso que ninguno tiene,
mirar el sitio actual de verdad antes de tocar nada.

Pensado para el wedge de servicios: le mejoras la web a un cliente como prueba de tu
forma de trabajar, y eso abre la conversación de tu producto. El sitio es el pie en la
puerta, no el negocio. Hazlo bueno, rápido y acotado.

Ejemplo trabajado de referencia: `examples/le-monde-school.md` (un colegio real, sólo
de muestra del paso visita + diagnóstico).

## Entrada

- **URL del sitio actual** (obligatoria).
- **Logo del cliente** si lo tienes (para `brand-palette`). Si no, lo extraes del sitio
  en el paso 1.
- Opcional: a qué se dedica, qué quiere lograr (más matrículas, más contacto, etc.).

## El loop

### 1. Visita y captura (Playwright)

Usa el skill `playwright-cli` para mirar el sitio real. No asumas nada, observa:

```bash
# screenshot full-page de la home y las páginas clave
npx playwright screenshot --full-page "<URL>" .reboot/home.png
# si hay más páginas (nosotros, admisión, contacto), captura cada una
```

Además de las capturas, extrae con Playwright (o leyendo el HTML):
- **Copy real**: títulos, textos, lemas, datos de contacto, horarios. Esto se reusa,
  no se inventa. Si el colegio dice "Formación integral desde 1995", eso es oro, va.
- **Estructura/IA**: qué secciones y navegación tiene hoy.
- **Marca**: logo (descárgalo), colores actuales, tipografías.
- **Assets**: fotos propias (alumnos, edificio, equipo). Las fotos reales valen más
  que cualquier stock. Lista cuáles se pueden reusar.

### 2. Diagnóstico honesto

Mira las capturas y nombra qué está flojo, con criterio, no genérico:
- ¿Mobile roto? ¿Carga lenta? ¿Texto ilegible (contraste)?
- ¿Sin CTA claro? ¿No se entiende qué hacer (matricular, contactar)?
- ¿Se ve de 2009? ¿Stock genérico? ¿Información clave escondida?
- ¿SEO básico ausente (title, meta, OG)?

Apunta 5-8 problemas concretos. Esto también es tu material de venta: cuando le
muestras al cliente "esto estaba pasando", el cambio se justifica solo.

### 3. Paleta de marca

Corre `brand-palette` con el logo (descargado en el paso 1 o el que te pasó el
cliente). Obtienes rampas + tokens con contraste AA. Esa es la marca del cliente, no
la paleta ember de `raiz-landing`.

### 4. Reconstruir mejor

Corre `raiz-landing build`:
- **Copy**: parte del copy real rescatado en el paso 1, mejorado, no placeholders.
- **Tema**: los tokens de `brand-palette` (Step 7 de raiz-landing).
- **Secciones**: las que el negocio necesita (un colegio: hero, propuesta, niveles/
  admisión, valores, galería real, contacto/ubicación con mapa, CTA matrícula).
- **Fotos**: reusa las propias del cliente; nunca stock si hay material real.

### 5. Critique + audit + comparación

- `raiz-landing critique` + `polish`: anti-AI-slop.
- `raiz-landing audit`: performance, a11y, SEO.
- Captura el resultado nuevo con Playwright y ponlo lado a lado con la captura del
  paso 1. El antes/después es lo que cierra al cliente.

## Reglas

- **No inventes datos del cliente.** Nombres, años, lemas, contacto: salen del sitio
  actual o se los preguntas. Si no lo sabes, lo dejas como campo a confirmar, no lo
  fabricas (esto es honestidad dura, no opcional).
- **Rescata las fotos reales.** El edificio, los alumnos, el equipo. Eso no se
  reemplaza con stock.
- **Acotado.** Una vuelta buena, no un proyecto infinito de revisiones. Si el cliente
  pide rondas sin fin, ya es agencia y ahí defines alcance.
- **El sitio queda limpio.** Sin marca tuya en el footer del cliente. La entrada a tu
  producto es la conversación después de entregar, no un crédito en su web.

## Composicion

```
site-reboot
  → playwright-cli   (visita + captura + extrae copy/IA/assets)
  → brand-palette    (logo → tokens con contraste AA)
  → raiz-landing     (build con copy real + tokens del cliente → critique → audit)
  → antes/después    (Playwright del resultado vs la captura inicial)
```
