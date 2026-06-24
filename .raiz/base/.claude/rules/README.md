# Reglas path-scoped (`.claude/rules/`)

Cada archivo `.md` aquí es una regla que el harness **carga sola** cuando el agente
toca un archivo que matchea su frontmatter `paths:`. No necesitan hook ni wiring:
es nativo de Claude Code.

```
---
paths:
  - "src/app/api/**/route.ts"
  - "supabase/migrations/*payment*"
---
# Regla: ...
```

Ajusta los globs a la estructura real de tu proyecto. Agrega reglas nuevas para los
puntos donde un error cuesta caro (pagos, datos sensibles, auth). El objetivo: que
el agente recuerde tus reglas duras justo cuando importa, sin que tú se lo digas.
