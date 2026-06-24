import { HERO, PROOF_METRICS } from "@/features/landing/data/content";

/** Resalta la palabra marcada con *asteriscos* en el titular con .accent-italic. */
function Title({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") ? (
          <span key={i} className="accent-italic">
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-6xl px-5 pb-24 pt-36 md:pt-48">
      <p className="kicker mb-5">{HERO.kicker}</p>

      <h1 className="display max-w-4xl text-5xl font-semibold sm:text-6xl md:text-7xl">
        <Title text={HERO.title} />
      </h1>

      <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">{HERO.subtitle}</p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <a href={HERO.primary.href} className="btn-primary">
          {HERO.primary.label}
        </a>
        <a href={HERO.secondary.href} className="btn-ghost">
          {HERO.secondary.label}
        </a>
      </div>

      {/* Prueba en cifras, pegada al hero para anclar credibilidad temprano. */}
      <dl className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[--radius-card] border border-border sm:grid-cols-3">
        {PROOF_METRICS.map((m) => (
          <div key={m.label} className="bg-surface px-6 py-7">
            <dt className="display text-3xl font-semibold text-foreground">{m.value}</dt>
            <dd className="mt-1 text-sm text-muted">{m.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
