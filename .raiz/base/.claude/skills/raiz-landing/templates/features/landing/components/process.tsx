import { PROCESS } from "@/features/landing/data/content";

/** Cómo trabajamos. Tres pasos con número grande; el "cómo" como diferenciador. */
export function Process() {
  return (
    <section id="proceso" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <header className="mb-14 max-w-2xl">
        <p className="kicker">Cómo trabajamos</p>
        <h2 className="display mt-4 text-3xl font-semibold sm:text-4xl">
          Un proceso claro, sin sorpresas.
        </h2>
      </header>

      <ol className="grid gap-px overflow-hidden rounded-[--radius-card] border border-border md:grid-cols-3">
        {PROCESS.map((p) => (
          <li key={p.step} className="bg-surface p-8">
            <span className="display text-5xl font-semibold text-accent">{p.step}</span>
            <h3 className="mt-4 text-xl font-medium text-foreground">{p.title}</h3>
            <p className="mt-2 text-muted">{p.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
