"use client";

import { useState } from "react";
import { LEAD_MAGNET } from "@/features/landing/data/content";

type State = "idle" | "loading" | "ok" | "error";

export function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setState("error");
    setState("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="recurso" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <div className="card overflow-hidden">
        <div className="grid gap-8 p-8 md:grid-cols-2 md:items-center md:p-12">
          <div>
            <p className="kicker">{LEAD_MAGNET.kicker}</p>
            <h2 className="display mt-4 text-3xl font-semibold sm:text-4xl">{LEAD_MAGNET.title}</h2>
            <p className="mt-3 text-muted">{LEAD_MAGNET.body}</p>
          </div>

          <div>
            {state === "ok" ? (
              <p className="rounded-xl border border-sap/40 bg-sap-soft px-5 py-4 text-foreground">
                Listo, revisa tu correo. Te llegó el acceso.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="lead-email" className="sr-only">
                  Correo electrónico
                </label>
                <input
                  id="lead-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("idle");
                  }}
                  placeholder={LEAD_MAGNET.placeholder}
                  className="w-full rounded-full border border-border bg-elevated px-5 py-3 text-foreground outline-none placeholder:text-faint focus:border-accent"
                />
                <button type="submit" disabled={state === "loading"} className="btn-primary justify-center whitespace-nowrap disabled:opacity-60">
                  {state === "loading" ? "Enviando…" : LEAD_MAGNET.cta}
                </button>
              </form>
            )}
            {state === "error" && (
              <p className="mt-2 text-sm text-danger">Revisa el correo e inténtalo de nuevo.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
