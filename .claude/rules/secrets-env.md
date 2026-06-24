---
paths:
  - ".env*"
  - "**/.env*"
  - "src/app/api/**/route.ts"
  - "next.config.*"
  - "**/*secret*"
  - "**/*config*.ts"
---
# Regla: Secrets y variables de entorno

Estas tocando codigo que maneja secrets o configuracion sensible. Reglas duras:

1. **Nunca committear secrets.** Claves, tokens y `.env*` (excepto `.env.example`)
   viven gitignored. Si un secret entro al repo, se considera comprometido: rotalo.
2. **Nunca imprimir secrets** a logs ni a la consola. Un secret logueado una vez
   queda filtrado para siempre (logs, journald, historial).
3. **Valida la presencia de cada env var al arranque** del modulo que la usa, y
   falla con un error claro si falta. No dejes que un undefined silencioso rompa
   en runtime.
4. **`.env.example` documenta las vars esperadas** (sin valores reales). Mantenlo
   al dia cuando agregas una variable nueva.
5. En el cliente, **solo** exponer vars con prefijo publico (`NEXT_PUBLIC_`). Todo
   lo demas es server-only.
