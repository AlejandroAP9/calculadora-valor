/**
 * Contenido como datos para la landing.
 *
 * `/raiz-landing build` rellena esto con el copy REAL del cliente durante la
 * entrevista. Todo lo que quede como {{PLACEHOLDER}} es un hueco sin llenar:
 * la skill NO da una landing por terminada con placeholders vivos (ver routes/critique.md).
 *
 * Borra las secciones que el negocio no necesite (no las dejes vacías).
 */

export type Cta = { label: string; href: string };

export const SEO = {
  title: "{{SEO_TITLE}}",
  description: "{{SEO_DESCRIPTION}}",
  url: "https://{{DOMAIN}}",
  ogImage: "/og.jpg",
  locale: "es_CL",
} as const;

export const CONTACT = {
  email: "{{EMAIL}}",
  whatsappNumber: "{{PHONE_DIGITS}}",
  whatsappUrl:
    "https://wa.me/{{PHONE_DIGITS}}?text=Hola%2C%20vengo%20de%20tu%20sitio.",
  instagram: "{{INSTAGRAM_URL}}",
  github: "{{GITHUB_URL}}",
  mapUrl: "{{GOOGLE_MAPS_URL}}",
} as const;

export const BRAND = {
  name: "{{BRAND_NAME}}",
  tagline: "{{BRAND_TAGLINE}}",
} as const;

export const NAV: { label: string; href: string }[] = [
  { label: "Propuesta", href: "#propuesta" },
  { label: "Servicios", href: "#servicios" },
  { label: "Proceso", href: "#proceso" },
  { label: "Casos", href: "#casos" },
  { label: "Contacto", href: "#cta" },
];

export const HERO = {
  kicker: "{{HERO_KICKER}}",
  // El titular admite una palabra con .accent-italic. Marca cuál con *asteriscos*
  // en build; el componente la resalta.
  title: "{{HERO_TITLE}}",
  subtitle: "{{HERO_SUBTITLE}}",
  primary: { label: "{{HERO_CTA_PRIMARY}}", href: "#cta" } as Cta,
  secondary: { label: "{{HERO_CTA_SECONDARY}}", href: "#servicios" } as Cta,
};

export const PROOF_METRICS: { value: string; label: string }[] = [
  { value: "{{METRIC_1}}", label: "{{METRIC_1_LABEL}}" },
  { value: "{{METRIC_2}}", label: "{{METRIC_2_LABEL}}" },
  { value: "{{METRIC_3}}", label: "{{METRIC_3_LABEL}}" },
];

/** Problema → solución → método. El corazón narrativo de la página. */
export const SCROLL_STOPS: { tag: string; title: string; body: string }[] = [
  { tag: "El problema", title: "{{PROBLEM_TITLE}}", body: "{{PROBLEM_BODY}}" },
  { tag: "La solución", title: "{{SOLUTION_TITLE}}", body: "{{SOLUTION_BODY}}" },
  { tag: "El método", title: "{{METHOD_TITLE}}", body: "{{METHOD_BODY}}" },
];

export const ABOUT = {
  kicker: "Quién está detrás",
  title: "{{ABOUT_TITLE}}",
  body: "{{ABOUT_BODY}}",
  points: ["{{ABOUT_POINT_1}}", "{{ABOUT_POINT_2}}", "{{ABOUT_POINT_3}}"],
};

export type Service = {
  name: string;
  description: string;
  accent?: "accent" | "sap";
  featured?: boolean;
};
export const SERVICES: Service[] = [
  { name: "{{SERVICE_1}}", description: "{{SERVICE_1_DESC}}", accent: "accent", featured: true },
  { name: "{{SERVICE_2}}", description: "{{SERVICE_2_DESC}}", accent: "sap" },
  { name: "{{SERVICE_3}}", description: "{{SERVICE_3_DESC}}", accent: "accent" },
];

export type Project = { name: string; result: string; tag: string };
export const PORTFOLIO: Project[] = [
  { name: "{{PROJECT_1}}", result: "{{PROJECT_1_RESULT}}", tag: "{{PROJECT_1_TAG}}" },
  { name: "{{PROJECT_2}}", result: "{{PROJECT_2_RESULT}}", tag: "{{PROJECT_2_TAG}}" },
  { name: "{{PROJECT_3}}", result: "{{PROJECT_3_RESULT}}", tag: "{{PROJECT_3_TAG}}" },
];

export const PROCESS: { step: string; title: string; body: string }[] = [
  { step: "01", title: "{{STEP_1_TITLE}}", body: "{{STEP_1_BODY}}" },
  { step: "02", title: "{{STEP_2_TITLE}}", body: "{{STEP_2_BODY}}" },
  { step: "03", title: "{{STEP_3_TITLE}}", body: "{{STEP_3_BODY}}" },
];

export type Testimonial = { quote: string; author: string; role: string };
export const TESTIMONIALS: Testimonial[] = [
  { quote: "{{TESTIMONIAL_1}}", author: "{{AUTHOR_1}}", role: "{{ROLE_1}}" },
  { quote: "{{TESTIMONIAL_2}}", author: "{{AUTHOR_2}}", role: "{{ROLE_2}}" },
];

export const LEAD_MAGNET = {
  kicker: "Gratis",
  title: "{{LEAD_TITLE}}",
  body: "{{LEAD_BODY}}",
  cta: "{{LEAD_CTA}}",
  placeholder: "tu@correo.cl",
};

export const COMMUNITY = {
  enabled: false, // pon true sólo si el negocio tiene comunidad/membresía real
  kicker: "Comunidad",
  title: "{{COMMUNITY_TITLE}}",
  body: "{{COMMUNITY_BODY}}",
  cta: { label: "{{COMMUNITY_CTA}}", href: "#cta" } as Cta,
};

export const CTA = {
  title: "{{CTA_TITLE}}",
  body: "{{CTA_BODY}}",
  primary: { label: "{{CTA_PRIMARY}}", href: "#" } as Cta,
  reassurance: "{{CTA_REASSURANCE}}",
};

export const FOOTER = {
  note: "{{FOOTER_NOTE}}",
  links: NAV,
};
