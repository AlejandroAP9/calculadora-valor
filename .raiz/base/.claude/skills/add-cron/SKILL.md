---
name: add-cron
description: Agrega trabajos programados (cron) a un proyecto Raíz. Cubre los dos motores del stack: Vercel Cron (para lógica de app vía rutas /api) y Supabase pg_cron (para trabajo de BD), ambos versionados en código y nunca editados por dashboard. Incluye auth fail-closed con CRON_SECRET, idempotencia, deteccion de jobs colgados y auditoría en vivo. Usar cuando el proyecto necesita digests, limpieza periódica, métricas nocturnas, recordatorios, secuencias de email o cualquier tarea que corra sola. Triggers "agrega un cron", "tarea programada", "job nocturno", "que corra todos los dias", "scheduled job", "limpieza periodica".
---

# add-cron — trabajo que corre solo, versionado en codigo

Un cron es trabajo que pasa sin que nadie lo dispare: un resumen diario, limpiar
filas viejas, capturar métricas, mandar un recordatorio. En el stack Raíz hay dos
motores, y cada uno es para algo distinto.

**La regla de oro, antes que nada:** el schedule vive en CODIGO (vercel.json o una
migración SQL), nunca lo creas a mano por el dashboard. Un cron editado por dashboard
es lógica que tu repo no conoce: se pierde en cada clon, nadie sabe por qué corre, y
el día que falla no hay dónde mirar. Esto es un blindaje, no una preferencia
(ver "Tu BD en vivo guarda logica que tu repo no conoce" en BLINDAJES.md).

## Cuál motor usar

| Necesidad | Motor | Por qué |
|-----------|-------|---------|
| Lógica de app (llamar una API, mandar emails, pegarle a un servicio) | **Vercel Cron** | Corre tu código Next.js con todo su contexto, deps y env |
| Trabajo de BD puro (agregaciones, limpieza, snapshots de métricas) | **Supabase pg_cron** | Corre dentro de Postgres, sin red de por medio, transaccional |
| Frecuencia < 1/día y estás en Vercel Hobby | **pg_cron** | El plan Hobby de Vercel limita los crons a 1 vez al día; pg_cron no |

Si dudas: lógica de negocio → Vercel Cron. Mantenimiento de datos → pg_cron.

---

## Opción A — Vercel Cron (lógica de app)

### 1. Declara el job en `vercel.json`

```json
{
  "crons": [
    { "path": "/api/cron/daily-digest", "schedule": "0 9 * * *" },
    { "path": "/api/cron/cleanup",      "schedule": "0 3 * * *" }
  ]
}
```

Los schedules son sintaxis cron estándar y corren en **UTC**. Documenta al lado la
hora local si te importa, pero el UTC es la verdad.

### 2. La ruta, con auth fail-closed

Vercel manda el header `Authorization: Bearer <CRON_SECRET>` automáticamente si
defines la env var `CRON_SECRET`. La ruta DEBE verificarlo y fallar cerrado: si no
coincide, 401 y no se ejecuta nada. Sin esto, cualquiera con la URL dispara tu job.

```ts
// src/app/api/cron/daily-digest/route.ts
import { createAdminSupabase } from "@/shared/lib/supabase-admin";

export async function GET(req: Request) {
  // 1. Auth primero, fail-closed
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. El trabajo, idempotente (seguro de re-correr)
  const db = createAdminSupabase();
  const { data: pendientes } = await db
    .from("users")
    .select("id, email")
    .eq("digest_sent_today", false);

  for (const u of pendientes ?? []) {
    await enviarDigest(u);
    await db.from("users").update({ digest_sent_today: true }).eq("id", u.id);
  }

  // 3. Responde con lo que hizo (queda en los logs de Vercel)
  return Response.json({ ok: true, enviados: pendientes?.length ?? 0 });
}
```

Agrega `CRON_SECRET` a `.env.local` y a las env vars de Vercel. Genera uno fuerte:
`openssl rand -hex 32`.

---

## Opción B — Supabase pg_cron (trabajo de BD)

### 1. Helper para versionar jobs en migraciones

Crea esto una vez. Hace los jobs idempotentes: re-aplicar la migración no duplica el
cron, lo reemplaza.

```sql
-- supabase/migrations/XXXX_cron_helper.sql
create extension if not exists pg_cron;
create extension if not exists pg_net;   -- sólo si vas a pegarle a un HTTP endpoint

create or replace function _upsert_cron(job_name text, job_schedule text, job_command text)
returns void language plpgsql as $$
begin
  if exists (select 1 from cron.job where jobname = job_name) then
    perform cron.unschedule(job_name);
  end if;
  perform cron.schedule(job_name, job_schedule, job_command);
end $$;
```

### 2. Cada job es una migración nueva

```sql
-- supabase/migrations/XXXX_cron_nightly_metrics.sql
select _upsert_cron(
  'nightly-metrics',
  '55 23 * * *',                 -- UTC: pg_cron SIEMPRE corre en UTC
  $$ select capture_daily_metrics() $$
);
```

### 3. Si el job necesita pegarle a una ruta de tu app (pg_net)

Guarda el secreto en Supabase Vault, no en texto plano en la migración:

```sql
-- una vez: select vault.create_secret('<tu-cron-secret>', 'cron_secret');

select _upsert_cron(
  'trigger-cleanup',
  '0 3 * * *',
  $$ select net.http_post(
       url     := 'https://TU-APP.vercel.app/api/cron/cleanup',
       headers := jsonb_build_object(
         'Authorization',
         'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
       )
     ) $$
);
```

### Cambiar un job después

NUNCA por el dashboard. Escribe una migración nueva con `_upsert_cron` y el mismo
nombre: reemplaza el schedule/comando y queda en el historial. El nombre es la llave.

---

## Hardening (vale para los dos motores)

- **Auth fail-closed.** Si el secreto no coincide, 401 y cero ejecución. Nunca abierto.
- **Idempotencia.** El job debe poder correr dos veces sin romper nada (marca lo ya
  hecho, usa `on conflict`, filtra por estado). Los crons se reintentan y se solapan.
- **Sin solape en jobs largos.** Si un job puede tardar más que su intervalo, marca un
  estado `running` al empezar y sáltate si ya hay uno corriendo.
- **Detecta colgados.** Para workers largos, un segundo cron corto (cada 5 min) que
  busque tareas `running` por más de N minutos y las recicle o alerte. Un job que
  muere a mitad de camino sin esto queda zombie para siempre.
- **Que reporte.** Devuelve/loguea qué hizo (cuántos, cuáles). Un cron mudo que falla
  en silencio es peor que no tenerlo.
- **No deployes con un job en curso.** El rebuild mata el proceso running
  (ver blindaje "No deployes con un job/proceso en curso: el rebuild lo mata").

## Auditar en vivo

Lo que está versionado es la verdad, pero confirma lo que de verdad corre:

```sql
select jobname, schedule, active from cron.job order by jobname;   -- pg_cron
```

Para Vercel Cron: el dashboard de Vercel → Cron Jobs muestra los activos y sus
últimas corridas. Si lo que ves no coincide con `vercel.json` o tus migraciones,
gana el código: re-deploya / re-aplica la migración.

## Honestidad

No inventes que un cron "quedó andando" sin verificarlo: revisa `cron.job` o la
corrida en Vercel. Un schedule en el repo no es un job corriendo hasta que lo
confirmas (Regla de verificación, igual que el resto de Raíz).
