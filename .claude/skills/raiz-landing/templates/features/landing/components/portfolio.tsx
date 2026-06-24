import { PORTFOLIO } from "@/features/landing/data/content";

/**
 * Casos: nombre + el RESULTADO concreto (no "hicimos una web bonita").
 * El resultado en grande es lo que convence. Si no hay casos reales, borra
 * esta sección entera en page.tsx; no la rellenes con inventos.
 */
export function Portfolio() {
  return (
    <section id="casos" className="hairline">
      <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <header className="mb-12 max-w-2xl">
          <p className="kicker">Casos</p>
          <h2 className="display mt-4 text-3xl font-semibold sm:text-4xl">
            Resultados, no portafolio de adorno.
          </h2>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {PORTFOLIO.map((p) => (
            <article key={p.name} className="card flex flex-col justify-between p-7">
              <div>
                <p className="kicker text-faint">{p.tag}</p>
                <h3 className="mt-3 text-lg font-medium text-foreground">{p.name}</h3>
              </div>
              <p className="display mt-8 text-3xl font-semibold text-accent">{p.result}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
