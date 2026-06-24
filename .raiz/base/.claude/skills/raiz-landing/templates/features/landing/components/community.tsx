import { COMMUNITY } from "@/features/landing/data/content";

/**
 * Sección de comunidad/membresía. Sólo se renderiza si COMMUNITY.enabled = true
 * (lo controla page.tsx). Para negocios con comunidad, curso o membresía real.
 */
export function Community() {
  return (
    <section id="comunidad" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <div className="card relative overflow-hidden p-10 md:p-16">
        <div
          aria-hidden
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-sap), transparent 60%)" }}
        />
        <div className="relative max-w-2xl">
          <p className="kicker">{COMMUNITY.kicker}</p>
          <h2 className="display mt-4 text-3xl font-semibold sm:text-4xl">{COMMUNITY.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{COMMUNITY.body}</p>
          <a href={COMMUNITY.cta.href} className="btn-primary mt-8">
            {COMMUNITY.cta.label}
          </a>
        </div>
      </div>
    </section>
  );
}
