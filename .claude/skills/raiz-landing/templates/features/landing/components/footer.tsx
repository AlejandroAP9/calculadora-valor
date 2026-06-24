import { BRAND, FOOTER, CONTACT, NAV } from "@/features/landing/data/content";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="hairline">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <a href="#top" className="display text-lg font-semibold">
              {BRAND.name}
            </a>
            <p className="mt-3 text-sm leading-relaxed text-muted">{FOOTER.note}</p>
          </div>

          <nav className="flex flex-col gap-3" aria-label="Pie de página">
            {NAV.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-muted transition-colors hover:text-foreground">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 text-sm">
            <a href={`mailto:${CONTACT.email}`} className="text-muted transition-colors hover:text-foreground">
              {CONTACT.email}
            </a>
            <a href={CONTACT.whatsappUrl} target="_blank" rel="noreferrer" className="text-muted transition-colors hover:text-foreground">
              WhatsApp
            </a>
            <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="text-muted transition-colors hover:text-foreground">
              Instagram
            </a>
          </div>
        </div>

        <p className="mt-12 text-xs text-faint">
          © {year} {BRAND.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
