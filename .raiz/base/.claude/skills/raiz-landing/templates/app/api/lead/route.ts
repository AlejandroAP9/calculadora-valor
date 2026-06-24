import { NextResponse } from "next/server";

/**
 * Captura de leads del lead-magnet. Valida server-side (el cliente se salta) y
 * guarda en Supabase si está configurado. Conéctalo a add-emails para mandar el
 * recurso, o a add-storage si entregas un archivo. Por defecto no rompe: si no hay
 * Supabase, igual responde ok para no perder el lead (revisa los logs).
 */
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  let email = "";
  try {
    ({ email } = await req.json());
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Correo inválido" }, { status: 422 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const db = createClient(url, key);
      const { error } = await db
        .from("leads")
        .upsert({ email, source: "landing" }, { onConflict: "email" });
      if (error) throw error;
    } catch (err) {
      console.error("lead insert error:", err);
      // aditivo: no perdemos el lead por un fallo de BD
    }
  } else {
    console.warn("lead recibido sin Supabase configurado:", email);
  }

  return NextResponse.json({ ok: true });
}
