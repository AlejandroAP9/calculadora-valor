import { ABOUT } from "@/features/landing/data/content";

export function About() {
  return (
    <section id="nosotros" className="hairline">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-24 md:grid-cols-2 md:py-32">
        <div>
          <p className="kicker">{ABOUT.kicker}</p>
          <h2 className="display mt-4 text-3xl font-semibold sm:text-4xl">{ABOUT.title}</h2>
        </div>
        <div>
          <p className="text-lg leading-relaxed text-muted">{ABOUT.body}</p>
          <ul className="mt-8 space-y-4">
            {ABOUT.points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-foreground">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
