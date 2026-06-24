---
name: add-notifications
description: Agrega notificaciones in-app (campana + Supabase Realtime) a un proyecto Raíz. Tabla notifications con RLS por owner, helper notify_user() que NUNCA rompe la transacción principal, triggers productores aditivos y componente campana que escucha en tiempo real. Base de engagement para cualquier SaaS. Usar cuando el proyecto necesita avisar al usuario de eventos (pago, proceso listo, mención, recordatorio). Triggers "notificaciones", "campana", "avisar al usuario", "notificar cuando", "in-app notifications", "badge de no leidos".
---

# add-notifications — avisos que nunca rompen el flujo

Una notificación es secundaria por definición: si falla, el evento que la disparó NO
debe caerse. El error clásico es meter el INSERT de la notificación dentro de la
transacción del negocio: si la notif falla, te tumba el pago, la generación, lo que
sea. La regla es **aditivo y a prueba de fallos**: notificar nunca bloquea.

## 1. La tabla (con RLS por owner)

```sql
-- supabase/migrations/XXXX_notifications.sql
create table notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null,              -- 'payment', 'process_done', 'mention', ...
  title       text not null,
  body        text,
  link        text,                       -- a dónde lleva el click
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);
create index on notifications (user_id, read, created_at desc);

alter table notifications enable row level security;

create policy "ver lo propio"      on notifications for select to authenticated
  using (user_id = auth.uid());
create policy "marcar lo propio"   on notifications for update to authenticated
  using (user_id = auth.uid());
```

Habilita Realtime en la tabla (Supabase Dashboard → Database → Replication, o por
migración con `alter publication supabase_realtime add table notifications`).

## 2. El helper que nunca rompe nada

Centraliza el INSERT y atrápalo: si algo falla, se traga el error y sigue. Así puedes
llamarlo desde triggers de pago, de procesos, etc. sin miedo a tumbar la operación.

```sql
create or replace function notify_user(
  p_user_id uuid, p_type text, p_title text, p_body text default null, p_link text default null
) returns void language plpgsql security definer as $$
begin
  insert into notifications (user_id, type, title, body, link)
  values (p_user_id, p_type, p_title, p_body, p_link);
exception when others then
  -- aditivo: una notif que falla NUNCA rompe la transacción que la disparó
  raise warning 'notify_user fallo: %', sqlerrm;
end $$;
```

## 3. Productores: triggers aditivos

Cada evento llama a `notify_user`. NUNCA modifiques un trigger existente del negocio
para meter la notif: agrega uno nuevo, aditivo. Si lo borras, el negocio sigue igual.

```sql
create or replace function notif_on_payment() returns trigger language plpgsql as $$
begin
  perform notify_user(new.user_id, 'payment', 'Pago confirmado',
                      'Tu suscripción quedó activa.', '/dashboard/billing');
  return new;
end $$;

create trigger trg_notif_payment after insert on payments
  for each row execute function notif_on_payment();
```

## 4. La campana (cliente, en tiempo real)

Carga las no leídas y se suscribe a Realtime para que aparezcan sin refrescar.

```tsx
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/shared/lib/supabase-client";

export function NotificationBell({ userId }: { userId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("notifications").select("*")
      .order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => setItems(data ?? []));

    const ch = supabase.channel("notif")
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        ({ new: n }) => setItems((prev) => [n, ...prev]))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId]);

  const noLeidas = items.filter((n) => !n.read).length;
  // render: ícono campana + badge {noLeidas} + dropdown con items + marcar leído
  return null; // (esqueleto: completa el dropdown con tu UI)
}
```

Marcar como leído: `update notifications set read = true where id = ...` (la RLS ya
garantiza que sólo toca lo suyo).

## Tres canales, no confundir

| Canal | Para qué | Skill |
|-------|----------|-------|
| **In-app (este)** | Historial persistente, badge de no leídos | add-notifications |
| **Toast (sonner)** | Feedback inmediato de una acción del momento | UI directa |
| **Push / email** | Llegar cuando el usuario NO está en la app | add-mobile / add-emails |

Un mismo evento puede usar varios: toast al instante + notif in-app para el historial
+ push si es importante y está fuera. No metas los tres en el mismo lugar.

## Hardening

- **Aditivo siempre.** El productor de notif nunca dentro de la transacción crítica; el
  helper se traga sus errores.
- **RLS por owner.** Un usuario sólo ve y marca lo suyo. Verifícalo.
- **Filtra el Realtime por user_id.** Sin el `filter`, el cliente recibe inserts de
  todos (fuga + ruido).
- **Indexa (user_id, read, created_at).** La query de la campana lo agradece.

## Composicion

- `add-login` da el `user_id`. `add-payments` y cualquier proceso largo (ver add-cron)
  son productores naturales de notificaciones.
