# Ejemplo — Le Monde School

Caso real usado para probar la skill. Sirve de referencia de cómo se ve un output
bueno. **No es parte de Raíz como proyecto, es un ejemplo del skill.**

## Logo de entrada

Escudo circular: fondo de espacio (navy muy oscuro con estrellas), un globo terráqueo
al centro (océanos azules, continentes verde/amarillo), texto manuscrito dorado
"Le Monde / School", aro dorado/bronce de borde, y un pequeño eclipse blanco-gris a la
derecha.

Colores de marca extraídos (ignorando blancos/negros de fondo, que son neutros):

| Rol | Hex semilla | De dónde |
|-----|-------------|----------|
| Dorado (principal) | `#E3B23C` | texto manuscrito + aro |
| Navy espacio (secundario) | `#0E1B3D` | fondo del escudo |
| Azul globo (acento) | `#2D7DD2` | océanos |
| Verde globo (acento) | `#4E9F3D` | continentes |

## Rampas generadas (`node palette.mjs "<hex>"`)

```
DORADO #E3B23C   50 #FFF2B3 · 100 #FFE8AA · 200 #FECD5B · 300 #E0AF39 · 400 #C09000
                500 #A07100 · 600 #875A00 · 700 #6F4300 · 800 #582C00 · 900 #392100 · 950 #271000
NAVY   #0E1B3D   50 #E8F5FF · 100 #DEEBFF · 200 #BFD4FF · 300 #A3B7E4 · 400 #8498C3
                500 #677AA3 · 600 #51628A · 700 #3B4C72 · 800 #27365B · 900 #1D263A · 950 #0D1528
AZUL   #2D7DD2   600 #0763B6 (CTA, blanco encima 6.05:1)
VERDE  #4E9F3D   600 #24770B (success, blanco encima 5.65:1)
```

## Tokens semanticos resultantes (tema claro)

```css
@theme {
  --color-background:           #FFFFFF;
  --color-foreground:           #0D1528;   /* navy-950, 18:1 */
  --color-primary:              #0763B6;   /* azul globo, blanco encima 6.05:1 */
  --color-primary-foreground:   #FFFFFF;
  --color-secondary:            #1D263A;   /* navy-900 */
  --color-secondary-foreground: #FFFFFF;
  --color-accent:               #E0AF39;   /* dorado, texto OSCURO encima */
  --color-accent-foreground:    #271000;   /* 9.77:1 */
  --color-muted:                #DEEBFF;   /* navy-100 */
  --color-muted-foreground:     #3B4C72;   /* navy-700, 8.5:1 sobre blanco */
  --color-border:               #BFD4FF;   /* navy-200 */
  --color-ring:                 #2B7CD0;
  --color-success:              #24770B;
  --color-warning:              #C09000;
  --color-destructive:          #B91C1C;
}
```

Variante dark (calcada al logo): fondo `#0D1528`, texto `#E8F5FF`, y el dorado
brillante `#FECD5B` explota sobre el navy como el texto del escudo.

## Aprendizaje del caso

El dorado brillante **no sirve como texto sobre blanco** (~2:1, ilegible). Es color de
fondo o acento con texto oscuro encima, o brilla sobre navy. Para texto: navy o azul.
Esto sale de verificar el contraste, no de suponerlo.
