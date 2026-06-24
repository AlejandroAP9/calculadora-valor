import { Backdrop } from "@/features/landing/components/backdrop";
import { Navbar } from "@/features/landing/components/navbar";
import { Hero } from "@/features/landing/components/hero";
import { ScrollStops } from "@/features/landing/components/scroll-stops";
import { About } from "@/features/landing/components/about";
import { Services } from "@/features/landing/components/services";
import { Portfolio } from "@/features/landing/components/portfolio";
import { Process } from "@/features/landing/components/process";
import { Proof } from "@/features/landing/components/proof";
import { LeadMagnet } from "@/features/landing/components/lead-magnet";
import { Community } from "@/features/landing/components/community";
import { CtaFinal } from "@/features/landing/components/cta-final";
import { Footer } from "@/features/landing/components/footer";
import { COMMUNITY } from "@/features/landing/data/content";

/**
 * Orden de secciones. Es el ritmo de scroll: cada bloque rompe con el anterior.
 * Borra de aquí (y borra el componente) las secciones que el negocio no use.
 * No dejes secciones con placeholders vivos.
 */
export default function Page() {
  return (
    <>
      <Backdrop />
      <Navbar />
      <main>
        <Hero />
        <ScrollStops />
        <About />
        <Services />
        <Portfolio />
        <Process />
        <Proof />
        <LeadMagnet />
        {COMMUNITY.enabled && <Community />}
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
