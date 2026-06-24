---
paths:
  - "src/app/api/auth/**"
  - "src/middleware.ts"
  - "**/lib/supabase/**"
  - "supabase/migrations/**"
  - "src/app/api/**/route.ts"
---
# Regla: Auth y Row Level Security (Supabase)

Estas tocando auth, middleware o acceso a datos. Reglas duras:

1. **RLS activado en TODA tabla con datos de usuario.** Sin RLS, cualquier cliente
   lee/escribe todo. Una tabla nueva sin policies es un agujero.
2. **Inserts/updates server-side a tablas con RLS owner-only** van con admin client
   (`SERVICE_ROLE_KEY`) + validacion de ownership a mano en TypeScript. El cliente
   server-side no lleva el JWT del usuario, asi que el RLS lo rechaza o devuelve
   null silencioso. Ver blindaje `admin-client-rls-server`.
3. **Nunca confies en un `user_id` que venga del cliente.** Derivalo de la sesion
   verificada server-side (`auth.uid()` / la sesion del request), no del body.
4. **Valida la sesion en el server** antes de cualquier operacion protegida. No
   asumas que el middleware ya filtro.
5. Las migraciones que tocan policies se revisan con cuidado: un `DROP POLICY` sin
   su reemplazo deja la tabla abierta.
