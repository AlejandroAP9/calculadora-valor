---
name: add-payments
description: |
  Integra pagos con Mercado Pago (CLP nativo, LATAM) en tu proyecto Next.js + Supabase:
  suscripciones via preapproval + webhook firmado HMAC-SHA256, con las guardas de un
  sistema de pagos correcto (firma primero, idempotencia atomica, fail-closed).

  Usar cuando: "agrega pagos", "add payments", "cobrar", "checkout", "suscripciones",
  "preapproval", "webhook MercadoPago", "sistema de cobros", "monetizar", "MercadoPago", "MP".

  Pre-requisito: /add-login (necesita auth + profiles en Supabase).
  NO USAR para: Polar/Stripe (esto es Mercado Pago), analytics de revenue.
allowed-tools: Bash(npm *), Bash(npx *), Bash(curl *), Read, Write, Edit, Glob, Grep
---

# Add Payments — Mercado Pago (CLP)

Integra pagos con **Mercado Pago**, la pasarela para LATAM (CLP nativo, boleta/IVA
local). Suscripciones via `preapproval` + webhook firmado. Tu recibes el dinero.

> El **MCP de Mercado Pago** NO reemplaza este skill: el MCP te da herramientas en
> vivo (test users, consultar pagos, ver config del webhook, buscar doc). Este skill
> es el PLANO con las guardas correctas. Usalos juntos: este te dice como construir,
> el MCP te ayuda a testear. Y ojo: el MCP **no crea planes**, los `preapproval_plan`
> se crean con `curl` directo a la API.

NO PREGUNTES. Ejecuta el Sistema de Raices completo.

## Pre-requisitos

1. `/add-login` ejecutado (busca `src/shared/lib/supabase/client.ts`). Si no existe, dile al usuario que lo corra primero.
2. Cuenta Mercado Pago + credenciales (Access Token, Webhook Secret).

## Principios Criticos (las cicatrices — NO negociables)

Cada uno es un bug real ya pagado en produccion. El webhook de abajo los respeta:

1. **Valida la firma HMAC PRIMERO**, antes de cualquier lectura/escritura. Sin secret → **fail-closed** (rechaza). `timingSafeEqual` + ventana anti-replay por timestamp.
2. **Whitelist de plan y ciclo.** Rechaza un `external_reference` con plan desconocido o ciclo != monthly/annual antes de tocar la sub.
3. **No dejes que un evento de una preapproval vieja/fuera de orden pise la sub activa.** Un `cancelled`/`paused` de otra preapproval no puede mutar la fila vigente.
4. **El webhook es la frontera final de autorizacion.** Monto anomalo = fail-closed (rechaza), no "alerta y procesa".
5. **Idempotencia ATOMICA**, no SELECT-luego-INSERT. Indice unico parcial + manejo de `23505`. Dos webhooks concurrentes del mismo pago no duplican.
6. **Degradacion por suscripcion, no por usuario.** Si el primer cobro de ESTA sub falla, degrada; cuenta los pagos por `sub_external_ref`, no por todo el usuario.
7. **Reactivacion a prueba de fallos.** Si falla el `pending→active`, devuelve 500 (MP reintenta); el reintento la re-aplica.
8. **Payload minimo** en `transaction_data` (id/status/monto/moneda/fecha), no el objeto MP completo (datos del pagador de mas).

## Archivos a Crear

### 1. Migracion SQL

`supabase/migrations/$(date +%Y%m%d%H%M%S)_add_payments_mp.sql`

```sql
-- Requiere: profiles (de add-login)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_access boolean DEFAULT false;

-- Suscripcion vigente por usuario (1 fila por user)
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('active','pending','paused','cancelled')),
  subscription_type text CHECK (subscription_type IN ('monthly','annual')),
  mercadopago_preapproval_id text,
  next_billing_date date,
  updated_at timestamptz DEFAULT now()
);

-- Log de transacciones (cobros + eventos)
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type text,
  amount numeric,
  currency text DEFAULT 'CLP',
  status text,
  transaction_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- GAP #5: idempotencia atomica de pagos de suscripcion.
-- Un segundo webhook del mismo payment_id falla con 23505 (el codigo lo trata como ya procesado).
CREATE UNIQUE INDEX IF NOT EXISTS payment_transactions_sub_payment_id_uniq
  ON public.payment_transactions ((transaction_data->>'payment_id'))
  WHERE (transaction_data->>'event_type') = 'subscription_payment';

-- RLS (el webhook usa service_role, que salta RLS)
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own sub" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "read own tx"  ON public.payment_transactions FOR SELECT USING (auth.uid() = user_id);
```

### 2. Helper de Mercado Pago

`src/shared/lib/mercadopago.ts`

```typescript
import crypto from 'crypto';

// Limites/planes conocidos. La whitelist se deriva de las KEYS de aqui.
export const PLAN_LIMITS: Record<string, number> = {
  // ejemplo: 'basic': 10, 'pro': 50  — ajusta a tus planes
};

// Montos esperados por plan+ciclo (CLP). Vacio => no se valida ese plan.
const EXPECTED: Record<string, { monthly?: number[]; annual?: number[] }> = {
  // 'basic': { monthly: [9900], annual: [99000] },
};

export function checkAmount(plan: string, cycle: string, paid: number): boolean {
  const e = EXPECTED[plan]; const list = e ? (cycle === 'annual' ? e.annual : e.monthly) : undefined;
  if (!list || list.length === 0) return true; // sin precio conocido => no bloquea
  return list.some((x) => Math.abs(paid - x) <= 1);
}

// GAP #1: firma primero, fail-closed, timingSafeEqual + anti-replay.
export function verifyMpSignature(req: Request, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET?.trim();
  if (!secret) { console.error('[mp] sin MP_WEBHOOK_SECRET — rechazo'); return false; }
  const sig = req.headers.get('x-signature') || '';
  const reqId = req.headers.get('x-request-id') || '';
  if (!sig) return false;
  const parts = Object.fromEntries(sig.split(',').map((s) => s.trim().split('=')));
  const ts = parts.ts, v1 = parts.v1;
  if (!ts || !v1) return false;
  const manifest = `id:${dataId};request-id:${reqId};ts:${ts};`;
  const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(v1, 'hex'), Buffer.from(expected, 'hex'))) return false;
    const n = Number(ts); if (!Number.isFinite(n)) return false;
    const sec = n > 1e12 ? Math.floor(n / 1000) : n;
    if (Math.abs(Date.now() / 1000 - sec) > 600) return false; // anti-replay 10 min
    return true;
  } catch { return false; }
}

const MP = 'https://api.mercadopago.com';
export async function fetchPreapproval(id: string, token: string) {
  const r = await fetch(`${MP}/preapproval/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  return r.ok ? r.json() : null;
}
export async function fetchPayment(id: string, token: string) {
  const r = await fetch(`${MP}/v1/payments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  return r.ok ? r.json() : null;
}
```

### 3. Supabase Admin Client

`src/shared/lib/supabase/admin.ts` — SI ya existe, NO lo sobreescribas.

```typescript
import { createClient } from '@supabase/supabase-js';
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

### 4. Webhook (el archivo critico — respeta los 8 principios)

`src/app/api/mercadopago/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/shared/lib/supabase/admin';
import { verifyMpSignature, fetchPreapproval, fetchPayment, PLAN_LIMITS, checkAmount } from '@/shared/lib/mercadopago';

export async function POST(req: NextRequest) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ ok: false, reason: 'no_token' }, { status: 500 });

  let body: { type?: string; action?: string; data?: { id?: string } };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const type = body.type || body.action || '';
  const dataId = body.data?.id;
  if (!dataId) return NextResponse.json({ ok: true, skipped: 'no_data_id' });

  // ===== PREAPPROVAL: autorizacion / cancelacion / pausa de la sub =====
  if (type === 'subscription_preapproval' || type === 'preapproval') {
    if (!verifyMpSignature(req, dataId)) return NextResponse.json({ ok: false, reason: 'invalid_signature' }, { status: 401 }); // #1
    const pre = await fetchPreapproval(dataId, token);
    if (!pre) return NextResponse.json({ ok: false, reason: 'fetch_failed' }, { status: 502 });
    const ref: string = pre.external_reference || '';
    if (!ref.startsWith('sub:')) return NextResponse.json({ ok: true, skipped: 'not_a_sub' });
    const [, planKey, cycle, userId] = ref.split(':');
    if (!planKey || !cycle || !userId) return NextResponse.json({ ok: false, reason: 'bad_ref' }, { status: 400 });
    if (!(planKey in PLAN_LIMITS) || (cycle !== 'monthly' && cycle !== 'annual'))            // #2
      return NextResponse.json({ ok: false, reason: 'unknown_plan_or_cycle' }, { status: 400 });

    const st: string = pre.status || '';
    const dbStatus = st === 'authorized' ? 'active' : st === 'paused' ? 'paused' : st === 'cancelled' ? 'cancelled' : 'pending';

    // #3: un evento no-authorized de una preapproval que NO es la actual no pisa la sub vigente
    const { data: cur } = await supabaseAdmin.from('user_subscriptions')
      .select('mercadopago_preapproval_id').eq('user_id', userId).maybeSingle();
    if (cur?.mercadopago_preapproval_id && cur.mercadopago_preapproval_id !== dataId && st !== 'authorized')
      return NextResponse.json({ ok: true, skipped: 'stale_preapproval' });

    const { error } = await supabaseAdmin.from('user_subscriptions').upsert({
      user_id: userId, plan_type: planKey, status: dbStatus, subscription_type: cycle,
      mercadopago_preapproval_id: dataId,
      next_billing_date: pre.next_payment_date ? String(pre.next_payment_date).split('T')[0] : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    if (error) return NextResponse.json({ ok: false, reason: 'upsert_failed' }, { status: 500 });

    await supabaseAdmin.from('profiles').update({ has_access: dbStatus === 'active' }).eq('id', userId);
    return NextResponse.json({ ok: true, status: dbStatus });
  }

  // ===== PAYMENT: el cobro real =====
  if (!type.startsWith('payment')) return NextResponse.json({ ok: true, skipped: 'not_payment' });
  if (!verifyMpSignature(req, dataId)) return NextResponse.json({ ok: false, reason: 'invalid_signature' }, { status: 401 }); // #1
  const pay = await fetchPayment(dataId, token);
  if (!pay) return NextResponse.json({ ok: false, reason: 'fetch_failed' }, { status: 502 });
  const st: string = pay.status || '';
  const ref: string = pay.external_reference || '';
  const amount = Number(pay.transaction_amount || 0);
  if (!ref.startsWith('sub:')) return NextResponse.json({ ok: true, skipped: 'not_a_sub' });
  const [, planKey, cycle, userId] = ref.split(':');
  if (!planKey || !cycle || !userId) return NextResponse.json({ ok: false, reason: 'bad_ref' }, { status: 400 });

  if (st !== 'approved') {
    // #6: si el PRIMER cobro de ESTA sub se rechaza, degradar (cuenta por sub_external_ref)
    if (st === 'rejected' || st === 'cancelled') {
      const { count } = await supabaseAdmin.from('payment_transactions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'approved')
        .eq('transaction_data->>event_type', 'subscription_payment')
        .eq('transaction_data->>sub_external_ref', ref);
      if ((count ?? 0) === 0) {
        await supabaseAdmin.from('user_subscriptions').update({ status: 'pending', updated_at: new Date().toISOString() })
          .eq('user_id', userId).eq('status', 'active');
        await supabaseAdmin.from('profiles').update({ has_access: false }).eq('id', userId);
      }
    }
    return NextResponse.json({ ok: true, status: st, skipped: 'not_approved' });
  }

  if (!(planKey in PLAN_LIMITS) || (cycle !== 'monthly' && cycle !== 'annual'))               // #2
    return NextResponse.json({ ok: false, reason: 'unknown_plan_or_cycle' }, { status: 400 });
  if (!checkAmount(planKey, cycle, amount))                                                   // #4: monto fail-closed
    return NextResponse.json({ ok: false, reason: 'amount_mismatch' }, { status: 400 });

  // #5: idempotencia. SELECT rapido + el indice unico + 23505 cierran la carrera.
  const paymentRef = String(pay.id);
  const { data: existing } = await supabaseAdmin.from('payment_transactions')
    .select('id').eq('transaction_data->>payment_id', paymentRef).maybeSingle();
  if (existing) {
    // #7: re-intenta la reactivacion por si fallo en un intento previo
    const { error } = await supabaseAdmin.from('user_subscriptions')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('user_id', userId).eq('status', 'pending');
    if (error) return NextResponse.json({ ok: false, reason: 'reactivation_failed' }, { status: 500 });
    await supabaseAdmin.from('profiles').update({ has_access: true }).eq('id', userId);
    return NextResponse.json({ ok: true, status: 'already_logged' });
  }

  const { error: insErr } = await supabaseAdmin.from('payment_transactions').insert({
    user_id: userId, plan_type: planKey, amount, currency: pay.currency_id || 'CLP', status: 'approved',
    transaction_data: {
      event_type: 'subscription_payment', payment_id: pay.id, cycle, sub_external_ref: ref,
      mp_payment: {  // #8: payload minimo
        id: pay.id, status: pay.status, external_reference: pay.external_reference,
        transaction_amount: pay.transaction_amount, currency_id: pay.currency_id, date_approved: pay.date_approved,
      },
    },
  });
  if (insErr) {
    if ((insErr as { code?: string }).code === '23505') return NextResponse.json({ ok: true, status: 'already_logged' }); // #5
    return NextResponse.json({ ok: false, reason: 'insert_failed' }, { status: 500 });
  }

  // #7: reactivacion a prueba de fallos (si falla, 500 → MP reintenta → entra por already_logged)
  const { error: reErr } = await supabaseAdmin.from('user_subscriptions')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('user_id', userId).eq('status', 'pending');
  if (reErr) return NextResponse.json({ ok: false, reason: 'reactivation_failed' }, { status: 500 });
  await supabaseAdmin.from('profiles').update({ has_access: true }).eq('id', userId);

  return NextResponse.json({ ok: true, type: 'subscription_payment', plan: planKey });
}

// MP a veces hace GET para verificar
export async function GET() { return NextResponse.json({ ok: true }); }
```

### 5. Crear la suscripcion (preapproval)

`src/features/billing/actions/subscribe.ts`

```typescript
'use server';
import { createClient } from '@/shared/lib/supabase/server';

// Crea un preapproval de MP. external_reference = sub:<plan>:<cycle>:<userId>
// (el webhook lo parsea). Necesita un preapproval_plan_id ya creado en MP.
export async function subscribe(planKey: string, cycle: 'monthly' | 'annual', preapprovalPlanId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const res = await fetch('https://api.mercadopago.com/preapproval', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      preapproval_plan_id: preapprovalPlanId,
      payer_email: user.email,
      external_reference: `sub:${planKey}:${cycle}:${user.id}`,
      back_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
    }),
  });
  if (!res.ok) { console.error('[subscribe] MP error', await res.text()); return { error: 'mp_failed' }; }
  const pre = await res.json();
  return { url: pre.init_point as string };
}
```

> Los `preapproval_plan` se crean UNA vez con `curl` a `https://api.mercadopago.com/preapproval_plan`
> (el MCP de MP no crea planes). Guarda el `id` y pasalo a `subscribe()`.

### 6. Success Page

`src/app/(auth)/checkout/success/page.tsx` — poll de `has_access` (igual patron; el acceso lo da el webhook, no esta pagina).

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/client';

export default function Success() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'timeout'>('verifying');
  const router = useRouter();
  useEffect(() => {
    let n = 0;
    const tick = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');
      const { data: p } = await supabase.from('profiles').select('has_access').eq('id', user.id).single();
      if (p?.has_access) { setStatus('success'); setTimeout(() => router.push('/'), 2000); return; }
      if (++n >= 10) return setStatus('timeout');
      setTimeout(tick, 2000);
    };
    tick();
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-center">
      {status === 'verifying' && <p>Verificando pago...</p>}
      {status === 'success' && <p>Pago confirmado. Redirigiendo...</p>}
      {status === 'timeout' && <p>Tu pago fue recibido. El acceso se activa en unos minutos.</p>}
    </div>
  );
}
```

## Flujo de Ejecucion

1. Verificar `/add-login` (busca `src/shared/lib/supabase/client.ts`).
2. Crear los archivos (si `admin.ts` ya existe, NO lo sobreescribas).
3. Llenar `PLAN_LIMITS` y `EXPECTED` en `mercadopago.ts` con los planes reales.
4. Aplicar la migracion (Supabase MCP `apply_migration` o `npx supabase db push`).
5. Mostrar el mensaje final.

## Testear (aqui SI usa el MCP de Mercado Pago)

- Crea test users y simula pagos con el **MCP de Mercado Pago**.
- Verifica la config del webhook (topics: payment, subscription_preapproval) con el MCP.
- Local: expone tu webhook con un tunel (ngrok/cloudflared) y configuralo en MP.

## Mensaje Final

```
Pagos integrados con Mercado Pago (CLP), con las 8 guardas correctas.

Archivos:
  supabase/migrations/XXXXX_add_payments_mp.sql
  src/shared/lib/mercadopago.ts
  src/shared/lib/supabase/admin.ts
  src/app/api/mercadopago/webhook/route.ts
  src/features/billing/actions/subscribe.ts
  src/app/(auth)/checkout/success/page.tsx

.env.local:
  MP_ACCESS_TOKEN=...
  MP_WEBHOOK_SECRET=...

Pasos:
  1. Crea tus preapproval_plan con curl a la API de MP (el MCP no crea planes). Guarda los ids.
  2. Llena PLAN_LIMITS y EXPECTED en src/shared/lib/mercadopago.ts.
  3. Configura el webhook en MP: URL https://tudominio.com/api/mercadopago/webhook
     Topics: payment, subscription_preapproval
  4. Testea con el MCP de Mercado Pago (test users + simular pagos).
  5. La regla .claude/rules/payments-webhooks.md se carga sola al tocar este codigo.
```
