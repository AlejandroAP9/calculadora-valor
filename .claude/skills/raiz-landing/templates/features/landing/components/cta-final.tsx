import { CTA } from "@/features/landing/data/content";

/** Cierre. Un solo CTA primario, sin distracciones. La decisión es ahora. */
export function CtaFinal() {
  return (
    <section id="cta" className="mx-auto max-w-6xl px-5 py-28 md:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="display text-4xl font-semibold sm:text-5xl md:text-6xl">{CTA.title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">{CTA.body}</p>
        <div className="mt-9 flex justify-center">
          <a href={CTA.primary.href} className="btn-primary text-base">
            {CTA.primary.label}
          </a>
        </div>
        <p className="mt-4 text-sm text-faint">{CTA.reassurance}</p>
      </div>
    </section>
  );
}
