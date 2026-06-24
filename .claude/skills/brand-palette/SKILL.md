---
name: brand-palette
description: Genera una paleta de color completa y accesible a partir del logo o la marca del cliente, para cualquier nicho (colegio, clínica, agencia, SaaS, producto, consultor). Extrae los colores reales del logo, construye rampas 50-950, asigna tokens semanticos (shadcn) y VERIFICA contraste WCAG AA antes de emitir. Sale como tokens Tailwind 4 listos para raiz-landing o cualquier proyecto Raíz. Triggers "paleta del logo", "colores de marca", "tema de este cliente", "branding de la landing", "paleta para el colegio".
---

# brand-palette — del logo a tokens accesibles

`raiz-landing` trae una paleta propia (ember: dark + amber-red). Eso sirve para tu
marca, no para la de un cliente. Este skill toma el logo del cliente y produce su
paleta: real, sistematica y con contraste verificado, en la misma forma que consume
`raiz-landing`. Funciona para cualquier nicho y cualquier tipo de usuario, no sólo
colegios.

Lo que separa una paleta usable de "colores lindos que fallan en produccion" es el
contraste. Texto que no se lee sobre el color de marca es un bug, no un detalle. Por
eso el paso de verificacion WCAG es obligatorio, no opcional.

Ejemplo trabajado de referencia: `examples/le-monde-school.md` (un colegio real, sólo
de muestra). El módulo runnable vive en `palette.mjs`, en esta carpeta.

## Entrada

- **Logo o referencia de marca**: ruta a un PNG/JPG/SVG. Léelo con la tool Read
  (la lees visualmente).
- Opcional: nicho/industria, mood (sobrio, cálido, energético), color de marca ya
  conocido en hex si el cliente lo dio.

## El loop

### 1. Extraer los colores reales del logo

Dos caminos. Por defecto el primero; el segundo cuando quieres precisión.

- **Visual (default)**: lee el logo con Read e identifica los hex dominantes: el
  color de marca principal y, si existe, el secundario. Ignora blancos/negros puros
  del fondo del logo, esos son neutros, no marca.
- **Determinista (precisión)**: muestrea los colores dominantes del archivo. En macOS
  sin instalar nada:

  ```bash
  # cuenta los colores más frecuentes (requiere ImageMagick; si no, usa el visual)
  magick logo.png -resize 100x100 -colors 8 -unique-colors txt: 2>/dev/null \
    | grep -oE '#[0-9A-Fa-f]{6}' | sort | uniq -c | sort -rn
  ```

No te quedes con el hex crudo del logo y lo sueltes como `primary`. Un logo suele
traer 1-2 colores; tu trabajo es construir el SISTEMA alrededor de esos colores.

### 2. Construir el sistema (rampas + neutros + estados)

Corre el módulo que viene en esta carpeta (matemática real en OKLCH, sin
dependencias). Le pasas el hex de marca y devuelve la rampa 50-950 perceptualmente
uniforme, con el on-color (texto legible encima) y el contraste WCAG de cada paso:

```bash
node .claude/skills/brand-palette/palette.mjs "#E3B23C"
```

OKLCH mantiene el tono constante y varía sólo la luminosidad: por eso la rampa sale
pareja. Repite para el secundario si el logo lo tiene. Ojo honesto: a croma constante, los
pasos muy claros (50-100) de azules y violetas pueden derivar a cyan (artefacto de
tono OKLCH en los extremos). Revisa esos pasos a ojo y, si chillan, corrige el tono
del paso manualmente. La rampa media (300-700), que es la que más se usa, sale limpia.

Para los **neutros** no uses gris puro:
toma la rampa con la croma casi a cero (multiplica `C` por ~0.04) manteniendo el tono
de marca. Da neutros con temperatura, que es lo que hace que se vea diseñado y no
plantilla.

### 3. Asignar tokens semanticos (compatibles shadcn)

Mapea la rampa a roles, no pongas hex sueltos en los componentes:

| Token | De dónde sale |
|-------|---------------|
| `background` / `foreground` | neutro 50 / neutro 950 (o invertido en dark) |
| `primary` / `primary-foreground` | marca 600 / su `on-color` |
| `secondary` / `accent` | secundario o marca 100/200 |
| `muted` / `muted-foreground` | neutro 100 / neutro 500 |
| `card`, `border`, `input`, `ring` | neutro 50, neutro 200, neutro 200, marca 500 |
| `destructive` / `success` / `warning` | rojo / verde / ámbar fijos, ajustados al tono |

### 4. Verificar contraste (obligatorio)

Toda combinacion de texto sobre fondo debe pasar WCAG AA: **4.5:1** texto normal,
**3:1** texto grande y elementos de UI. El módulo ya imprime el contraste de cada
`on-color`. Revisa explícitamente:

- `foreground` sobre `background`
- `primary-foreground` sobre `primary`
- `muted-foreground` sobre `background` y sobre `muted`

Si algo no llega a AA, ajusta el paso de la rampa (usa 700 en vez de 600 para
`primary`, etc.) y vuelve a medir. No declares "accesible" sin el número. Si no se
puede verificar, dilo, no lo afirmes (esto es honestidad, no adorno).

### 5. Emitir tokens Tailwind 4

Escribe en `src/app/globals.css` un bloque `@theme` con variables OKLCH (Tailwind 4
las soporta nativo) y los alias semanticos. Forma:

```css
@theme {
  /* marca */
  --color-brand-50: #F2F6FF;
  /* ...50 a 950 con los hex que imprimió el módulo... */
  --color-brand-950: #10183A;

  /* semanticos (shadcn) */
  --color-background: var(--color-neutral-50);
  --color-foreground: var(--color-neutral-950);
  --color-primary: var(--color-brand-600);
  --color-primary-foreground: #FFFFFF;   /* el on-color verificado */
  --color-muted: var(--color-neutral-100);
  --color-muted-foreground: var(--color-neutral-500);
  --color-border: var(--color-neutral-200);
  --color-ring: var(--color-brand-500);
  --color-destructive: #DC2626;
}
```

Si el proyecto aún usa `tailwind.config.ts` con `theme.extend.colors`, replica ahí los
mismos tokens. Opcional: un bloque dark (`.dark { ... }`) invirtiendo background/
foreground y subiendo `primary` un paso para que mantenga contraste sobre oscuro.

## Composicion

- **Antes de `raiz-landing`**: corre `brand-palette` con el logo del cliente, y en el
  Step 7 de `raiz-landing` (design system) usa estos tokens en vez de la paleta ember.
  Misma estructura de archivos, sólo cambian los valores.
- **Standalone**: sirve para el tema de cualquier proyecto Raíz, no sólo landings.
- Después, `design-review` valida que el color se usó con propósito (dimensión 8).

## Honestidad / anti-AI-slop

- No el degradado morado-azul de siempre. La marca manda, no el cliché.
- No neutros gris-cemento si la marca es cálida: tíñelos con el tono de marca.
- El contraste es número verificado, no impresión. AA o lo dices.
- Una paleta es sistema, no 3 hex. Si entregas sólo el color del logo, no hiciste el trabajo.
