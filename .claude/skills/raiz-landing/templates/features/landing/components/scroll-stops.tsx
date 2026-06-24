import { SCROLL_STOPS } from "@/features/landing/data/content";

/**
 * Problema → solución → método. Tres paradas grandes, alternadas, que llevan
 * al lector por la narrativa. Número índice grande a un lado para dar ritmo.
 */
export function ScrollStops() {
  return (
    <section id="propuesta" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <div className="space-y-20 md:space-y-28">
        {SCROLL_STOPS.map((s, i) => (
          <article
            key={s.tag}
            className={`grid items-center gap-8 md:grid-cols-12 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="md:col-span-4">
              <span className="display block text-7xl font-semibold text-elevated md:text-8xl">
                0{i + 1}
              </span>
              <p className="kicker mt-2">{s.tag}</p>
            </div>
            <div className="md:col-span-8">
              <h2 className="display text-3xl font-semibold sm:text-4xl">{s.title}</h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{s.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
