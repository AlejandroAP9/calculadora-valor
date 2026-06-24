"use client";

import { useEffect, useState } from "react";
import { NAV, BRAND, CONTACT } from "@/features/landing/data/content";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="display text-lg font-semibold tracking-tight">
          {BRAND.name}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </div>

        <a href={CONTACT.whatsappUrl} className="btn-primary hidden text-sm md:inline-flex" target="_blank" rel="noreferrer">
          Hablemos
        </a>

        <button
          className="md:hidden text-foreground"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-6 bg-foreground transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-6 bg-foreground transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-foreground transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-base text-foreground">
                {l.label}
              </a>
            ))}
            <a href={CONTACT.whatsappUrl} className="btn-primary justify-center" target="_blank" rel="noreferrer">
              Hablemos
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
