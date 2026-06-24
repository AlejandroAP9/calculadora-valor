# Comando: /raiz-landing

Despacha al subcomando. Sin argumento, parte por `build`.

| Invocación | Ruta que se ejecuta |
|------------|---------------------|
| `/raiz-landing` o `/raiz-landing build` | `routes/build.md` |
| `/raiz-landing build-loop` | `routes/build-loop.md` |
| `/raiz-landing critique` | `routes/critique.md` |
| `/raiz-landing polish` | `routes/polish.md` |
| `/raiz-landing audit` | `routes/audit.md` |
| `/raiz-landing deploy` | `routes/deploy.md` |

Flujo típico: `build` → `critique` → `polish` → `audit` → `deploy`.
`build-loop` es el modo autónomo: maker → Site Doctor → fix, en loop con `/goal` nativo
hasta 0 fallas duras. El auditor (`audit`) y el constructor (`build`) corren separados a
propósito: el que construye no se autoaprueba.
Regla dura: no se pasa de `critique` si quedan `{{placeholders}}` o el build no compila.
