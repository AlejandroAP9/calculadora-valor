---
name: security-audit
description: "Auditoría de seguridad del proyecto contra una checklist real (clases de vulnerabilidad observadas en producción, no teoría). Activar cuando el usuario dice: audita la seguridad, revisa vulnerabilidades, está seguro, security audit, antes de lanzar, revisa RLS, hay algún hueco, pentest, checklist de seguridad."
allowed-tools: Read, Grep, Glob, Bash
---

# Security Audit

Audita el proyecto contra clases de vulnerabilidad **reales** (destiladas de
auditorías de producción de stacks Next.js + Supabase). El objetivo es **reducir
el riesgo y bloquear lo conocido**, no prometer cero vulnerabilidades.

> Honestidad (no negociable): ninguna auditoría garantiza "100% seguro". Esto
> caza las clases comunes y deja un reporte accionable. Dilo así en el reporte.

## Cómo correrla

1. Mapea la superficie: rutas (`src/app/api/**`, server actions), tablas y
   policies (Supabase), `next.config.*` (headers), `.env*`, `package.json`.
2. Revisa cada área de la checklist de abajo con `grep`/lectura real del código
   y queries a la BD cuando aplique. **No asumas**: si una policy "debería"
   existir, verifícala en prod (`pg_policies`), porque hay drift prod-only.
3. Emite un reporte con: hallazgo, **severidad** (🔴 critical / 🟠 high / 🟡 medium
   / 🔵 low), evidencia (archivo:línea o query), y **cómo fixear**.
4. Para cada hallazgo confirmado que aplique a cualquier proyecto, captúralo con
   `raiz blindar` para que el bosque no lo repita.

## Checklist (clases reales)

### 1. Autorización / RLS (la más cara)
- **Escalada de privilegios**: ¿el cliente puede escribir campos sensibles?
  `role`, `plan`, `status`, `institution`, contadores de uso. Las mutaciones de
  esos campos deben ser **service-role only** (webhook/RPC SECURITY DEFINER), no
  `authenticated`. Revisa policies INSERT/UPDATE de tablas de plan/suscripción/uso.
- **WITH CHECK débil**: una policy self-update que no congela `role`/`plan` deja
  auto-ascenso a admin. Verifica que el WITH CHECK impida cambiar el campo crítico.
- **RLS drift prod-only**: policies que viven en prod pero no en migraciones.
  Audita en vivo: `SELECT relname, polname, polroles::regrole[] FROM pg_class c
  JOIN pg_policy p ON p.polrelid=c.oid WHERE c.relrowsecurity`.
- **RPC SECURITY DEFINER con GRANT a authenticated**: bypassa la RLS. Revoca
  EXECUTE a `authenticated`, deja solo `service_role`.
- **Admin hardcodeado**: email/uid literal como bypass de RLS. Usa una función
  `is_admin()`, no un literal.

### 2. Endpoints y auth
- **user_id desde el body**: endpoints públicos que confían en `userId` del
  payload → secuestro. Fuerza `user_id = auth.getUser().id`, ignora el body.
- **Rutas sin auth**: server actions / API que mutan sin validar sesión.
- **Proxies que sirven PII sin ownership** (archivos, fotos, PDFs con datos
  personales) + `CORS: *`. Exige sesión + ownership o token firmado con expiración.
- **IDOR**: acceso a recurso por id sin comprobar pertenencia.

### 3. Secrets
- **Secrets en el bundle**: cualquier `NEXT_PUBLIC_*` que sea un secreto es
  público. Grep `NEXT_PUBLIC_.*SECRET|KEY` y muévelo a server-side.
- **`.env.local` commiteado** o keys en código. Grep claves de Supabase/Stripe/etc.
- **God-token**: un solo secreto para todo (crons + admin). Sepáralos.
- **SERVICE_ROLE_KEY como bearer** sobre el cable: usa un secreto dedicado rotable.
- **Comparación de secretos no constant-time**: usa `crypto.timingSafeEqual`.

### 4. Inyección y XSS
- **XSS almacenado / de segundo orden**: output de LLM o input de usuario
  renderizado con `dangerouslySetInnerHTML` sin sanitizar. Escapa `& < >` antes
  de cualquier replace de markdown, o usa DOMPurify.
- **SQL injection**: queries con interpolación de strings en vez de parámetros.
- **SSRF**: fetch a URLs controladas por el usuario sin allowlist.

### 5. Headers y transporte
- **CSP** con `unsafe-inline`/`unsafe-eval` debilita la defensa XSS (objetivo:
  nonce-CSP). Falta **HSTS** (`Strict-Transport-Security`). Revisa `next.config`
  headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- **Content-Type del cliente sin allowlist** en uploads → sniffing. Valida contra
  allowlist (`image/jpeg|png|webp`) y fuerza un Content-Type seguro al servir.

### 6. Rate limiting y abuso
- **Sin rate limiting** = email bombing y fuerza bruta (login, redeem, captura de
  leads). Añade límite por IP + por identidad (tabla con ventana, o el borde/CF).
- **Endpoints fuerza-bruteables** (códigos, tokens): backoff + bloqueo.

### 7. Pagos / webhooks / idempotencia
- **Firma del webhook**: verifica HMAC con `timingSafeEqual` + ventana anti-replay.
- **Idempotencia TOCTOU**: SELECT-luego-INSERT sin guard atómico duplica cobros.
  Usa **UNIQUE constraint** (índice parcial) + maneja `23505` como ya-procesado.
- **Validación de monto** antes de acreditar.

### 8. Dependencias
- Corre `npm audit --omit=dev` y reporta CVEs con fix disponible. No subas de
  versión major a ciegas; nota las que tocan auth/cookies.

## Salida

Tabla por severidad + un resumen honesto: "X críticos, Y altos... Esto reduce el
riesgo de las clases conocidas; no es garantía de ausencia de vulnerabilidades."
Ofrece arreglar los 🔴/🟠 primero. Nunca declares "100% seguro".
