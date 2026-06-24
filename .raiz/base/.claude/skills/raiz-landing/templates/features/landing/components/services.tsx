import { SERVICES, type Service } from "@/features/landing/data/content";

const accentBar: Record<NonNullable<Service["accent"]>, string> = {
  accent: "bg-accent",
  sap: "bg-sap",
};

export function Services() {
  return (
    <section id="servicios" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <header className="mb-12 max-w-2xl">
        <p className="kicker">Lo que hacemos</p>
        <h2 className="display mt-4 text-3xl font-semibold sm:text-4xl">
          Servicios con un resultado claro, no una lista de tareas.
        </h2>
      </header>

      {/* Bento asimétrico: el destacado ocupa más, los demás se acomodan. */}
      <div className="grid auto-rows-fr gap-4 md:grid-cols-3">
        {SERVICES.map((s) => (
          <article
            key={s.name}
            className={`card group relative flex flex-col p-7 transition-transform hover:-translate-y-1 ${
              s.featured ? "md:col-span-2 md:row-span-1" : ""
            }`}
          >
            <span className={`mb-5 h-1 w-10 rounded-full ${accentBar[s.accent ?? "accent"]}`} />
            <h3 className="display text-2xl font-semibold">{s.name}</h3>
            <p className="mt-3 text-muted">{s.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
