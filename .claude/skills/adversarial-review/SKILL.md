---
name: adversarial-review
description: Revision de codigo adversarial cross-vendor. Claude arma o apunta al codigo, Codex (modelo de otro proveedor) lo audita en read-only, y Claude verifica CADA hallazgo contra el codigo real antes de reportar. Usar como segundo par de ojos sobre codigo sensible (pagos, auth, webhooks, migraciones) antes de declarar listo. Triggers "revisa adversarial", "que Codex audite", "segundo par de ojos", "review cross-vendor", "audita este archivo".
---

# adversarial-review — Claude propone, Codex audita, Claude verifica

Dos modelos de proveedores distintos tienen puntos ciegos distintos. Esta skill
pone a uno a auditar el trabajo y al otro a verificar el resultado. Lo importante
no es el reporte que escupe el critico, es **separar lo real del ruido**.

## Requisito previo

Codex CLI instalado y logueado (una sola vez):

```bash
npm i -g @openai/codex
codex login              # usa tu plan de ChatGPT (cero costo de API), o una API key
codex login status       # confirma que quedo logueado
```

Si `codex` no aparece en tu PATH (instalado bajo nvm), crea un wrapper en
`/opt/homebrew/bin/codex` (o tu dir de PATH) que llame al node correcto.

## El loop

1. **Arma el trabajo** (o apunta a un archivo/diff ya existente).
2. **Lanza Codex en read-only** sobre el codigo real (no toca nada, solo lee):

   ```bash
   codex exec -s read-only -C <repo> "Eres un revisor de codigo senior y adversarial. \
   Revisa EXCLUSIVAMENTE <archivo>. Busca fallos REALES: bugs, race conditions, \
   validaciones faltantes, agujeros de seguridad, manejo de errores incompleto, \
   idempotencia. Para cada hallazgo: archivo+linea, severidad, por que es real, y un \
   fix concreto. Se honesto: si algo ya esta bien resuelto, NO lo marques. NO modifiques nada."
   ```

   La salida trae toda la traza agentica; el reporte final va al final.

3. **Codex devuelve los hallazgos.**
4. **La pieza que nadie cuenta — Claude verifica cada hallazgo contra el codigo real.**
   El critico tambien alucina, o marca como bug una decision consciente y documentada.
   Verifica uno por uno; quedate solo con lo confirmado.
5. **Reporta solo lo confirmado**, con su evidencia. El numero honesto es lo verificado,
   no lo que Codex escupio.

## Cuando usarla

- Codigo sensible antes de deployar: pagos, auth, webhooks, migraciones.
- Despues de un cambio grande, como segundo par de ojos de otro proveedor.
- Cuando quieras confianza extra sin esperar a que un humano revise.

## La regla de oro

El valor esta en la verificacion, no en el reporte. Nunca actues ni publiques los
hallazgos sin chequearlos contra el codigo. Un reporte de "8 bugs" puede ser 6 reales
+ 2 decisiones tuyas a proposito. Decir "8 bugs" sin verificar es mentir con estadistica.

## Honestidad

Esto NO reemplaza los tests ni tu criterio. Es una capa de revision cross-vendor, no
una garantia. Para que de verdad bloquee, parea con el hook de verify-after-edit.
