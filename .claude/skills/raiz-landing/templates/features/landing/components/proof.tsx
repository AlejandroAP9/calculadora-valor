import { TESTIMONIALS } from "@/features/landing/data/content";

/** Prueba social: testimonios reales. Si no hay, borra la sección, no inventes. */
export function Proof() {
  return (
    <section id="testimonios" className="hairline">
      <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <header className="mb-12 max-w-2xl">
          <p className="kicker">Lo que dicen</p>
          <h2 className="display mt-4 text-3xl font-semibold sm:text-4xl">
            En palabras de quienes ya trabajaron con nosotros.
          </h2>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure key={t.author} className="card flex flex-col p-8">
              <span className="display text-5xl leading-none text-accent">&ldquo;</span>
              <blockquote className="-mt-3 text-lg leading-relaxed text-foreground">{t.quote}</blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-medium text-foreground">{t.author}</span>
                <span className="text-muted"> · {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
