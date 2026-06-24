# Blindajes heredados

> La red que conecta tus proyectos Raiz. Cada blindaje es un error ya
> documentado que NO debe repetirse. Generado por `raiz blindajes --reindex`.

| Blindaje | Tags | Origen |
|---|---|---|
| [Insert server-side a tabla con RLS owner-only falla silencioso](admin-client-rls-server.md) | [supabase, rls, server-actions] | educmark |
| [Bot que responde raro = otro proceso con el mismo token](bot-identidad-rara-token-duplicado.md) | [bots, telegram, ops, debugging] | educmark |
| [El dark mode del dashboard contamina los PDFs](chrome-dark-mode-contamina-pdf.md) | [css, print, pdf, dark-mode] | educmark |
| [allowed_tools del claude-agent-sdk no bloquea de verdad](claude-agent-sdk-allowed-tools-no-bloquea.md) | [claude-agent-sdk, ai, security] | educmark |
| [Contenedor que fetchea su propio VPS por URL publica = hairpin NAT](container-fetch-hairpin-nat.md) | [docker, networking, ops] | educmark |
| [Job fantasma: revisa .github/workflows/ antes que los crons del backend](github-actions-antes-que-crons.md) | [ci, cron, github-actions, debugging] | educmark |
| [Un 4xx no es caida: en healthchecks alerta solo en 5xx/timeout](healthcheck-4xx-no-es-caida.md) | [monitoring, healthcheck, ops] | educmark |
| [Heredocs con placeholders <X> no son robustos](heredoc-placeholder-angle-brackets.md) | [bash, shell, dx] | educmark |
| [Tu BD en vivo guarda logica que tu repo no conoce](live-db-tiene-fantasmas.md) | [supabase, postgres, debugging, migrations] | educmark |
| [package-lock de npm nuevo rompe el build en el deploy](lockfile-node-version-deploy.md) | [deploy, npm, node, easypanel] | educmark |
| [El magic link de Supabase ignora redirectTo fuera de la allowlist](magic-link-supabase-no-localhost.md) | [supabase, auth, testing] | educmark |
| [matchear con .includes() da falso positivo por substring](matcher-includes-substring-falso-positivo.md) | [matching, strings, bug] | educmark |
| [redirect() dentro de try/catch no redirige](nextjs-redirect-try-catch.md) | [nextjs, server-actions] | educmark |
| [No deployes con un job/proceso en curso: el rebuild lo mata](no-deployar-con-job-corriendo.md) | [deploy, ops, jobs] | educmark |
| [Ante 'no funciona', revisa el estado real en BD antes de diagnosticar](no-funciona-revisar-estado-en-bd.md) | [debugging, supabase, ops] | educmark |
| [Nunca pidas cat de archivos con secrets](no-imprimir-secrets-en-chat.md) | [security, secrets, dx] | educmark |
| [Nombre de feature con metafora obscura obliga a explicarlo](nombre-de-feature-con-metafora-obscura-obliga-a-explicarlo.md) | [naming, ux, product, dx] | raiz |
| [Bug visual solo en PDF: reproduce con Playwright page.pdf()](playwright-first-bug-visual-pdf.md) | [playwright, pdf, debugging] | educmark |
| [En print, usa @page margin, no padding del wrapper](print-css-page-margin-no-padding.md) | [css, print, pdf] | educmark |
| [python-telegram-bot: concurrent_updates(True) o los clicks se pierden](python-telegram-bot-concurrent-updates.md) | [python, telegram, bots] | educmark |
| [Silencia el logger de httpx o filtras tokens a los logs](python-telegram-bot-silenciar-httpx.md) | [python, telegram, bots, security, logging] | educmark |
| [Si cortas el string por match.end(), el pattern no debe consumir](regex-lookahead-no-consumir.md) | [regex, parsing, bug] | educmark |
| [rsync sobre Cloudflare Tunnel se arrastra: usa tar + ssh](rsync-cloudflare-tunnel.md) | [networking, cloudflare, ssh, ops] | educmark |
| [Cuando el MCP de Supabase falla, corre SQL por la Management API](supabase-management-api-curl.md) | [supabase, mcp, sql] | educmark |
| [Nested select de Supabase devuelve null silencioso con FK nullable](supabase-nested-select-fk-nullable.md) | [supabase, postgrest, rls] | educmark |
| [lint OK no es build OK: corre tsc completo antes de commitear](tsc-noemit-completo-antes-de-commit.md) | [typescript, deploy, ci] | educmark |
| [API externa rara: valida con curl directo antes de debuggear codigo](validar-upstream-con-curl.md) | [debugging, api, http] | educmark |
| [Verifica cada hallazgo de un revisor IA contra el codigo real](verificar-al-critico-ia.md) | [ai, code-review, honestidad] | educmark |
| [Nunca declares 'listo' sin correr el check real](verificar-antes-de-listo.md) | [honestidad, verification, workflow] | educmark |
| [Valida la firma del webhook antes de tocar la BD, y falla cerrado](webhook-firma-primero-fail-closed.md) | [webhooks, security, payments, hmac] | educmark |
| [Idempotencia de webhook por SELECT-luego-INSERT tiene carrera](webhook-idempotencia-atomica.md) | [webhooks, idempotency, supabase, payments] | educmark |
| [Texto editable sale translucido en PDF sin -webkit-text-fill-color](webkit-text-fill-color-print.md) | [css, print, pdf, forms] | educmark |
