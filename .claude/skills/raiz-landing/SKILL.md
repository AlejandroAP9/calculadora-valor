---
name: raiz-landing
description: Construye landing pages editoriales de alta conversion para cualquier negocio (personal brand, SaaS, agencia, producto, curso, consultor, clínica, colegio). Entrevista, llena copy REAL (cero placeholders), arma todas las secciones, critica anti-AI-slop y audita. Nunca entrega landings genéricas ni incompletas. Triggers "necesito una landing", "landing que convierta", "hazme una pagina de aterrizaje", "renueva mi sitio".
---

# raiz-landing — landings editoriales, completas y nunca genéricas

Construye landings con identidad editorial (tipografía display con carácter, bento
asimétrico, ritmo de scroll, paleta de marca) para cualquier tipo de negocio. Dos
reglas que NO se negocian:

1. **Nunca genérica.** Nada de tres cards idénticas, botón degradado morado-azul,
   Inter sobre blanco, copy de relleno tipo "soluciones innovadoras". La identidad la
   da la tipografía, el color de marca y el copy real del cliente.
2. **Nunca incompleta.** No se entrega una landing con `{{PLACEHOLDERS}}` vivos ni con
   secciones a medio llenar. Cada sección o tiene copy real, o se borra. No hay punto
   medio.

## Tipo de negocio → qué secciones

`/raiz-landing build` elige las secciones según el negocio. Todas viven en
`templates/features/landing/components/` y se orquestan en `app/page.tsx`:

| Sección | Cuándo incluirla |
|---------|------------------|
| `Hero` + métricas | Siempre |
| `ScrollStops` (problema/solución/método) | Siempre, es la narrativa |
| `About` | Personal brand, consultor, clínica, colegio, agencia |
| `Services` (bento) | Cualquiera que venda servicios o features |
| `Portfolio` (casos con resultado) | Hay casos reales que mostrar |
| `Process` | El "cómo trabajamos" es diferenciador |
| `Proof` (testimonios) | Hay testimonios reales |
| `LeadMagnet` | Captura de emails (curso, consultor, SaaS) |
| `Community` | Negocio con comunidad/membresía real (`COMMUNITY.enabled`) |
| `CtaFinal` + `Footer` | Siempre |

Si una sección no aplica, **se borra de `page.tsx` y se borra su componente**. No se
deja vacía ni con texto inventado.

## Comandos (rutas)

| Comando | Qué hace | Ruta |
|---------|----------|------|
| `/raiz-landing build` | Entrevista, elige secciones, llena copy real, arma el scaffold | `routes/build.md` |
| `/raiz-landing critique` | Review anti-AI-slop + gate de completitud | `routes/critique.md` |
| `/raiz-landing polish` | Aplica los fixes del critique | `routes/polish.md` |
| `/raiz-landing audit` | Performance, a11y y SEO antes de publicar | `routes/audit.md` |
| `/raiz-landing deploy` | Deploy a Vercel + dominio + verificación OG | `routes/deploy.md` |

## Stack y dónde vive cada cosa

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4 (`@theme` en `globals.css`).
- Contenido como datos: `templates/features/landing/data/content.ts` (todo tipado).
- Tema y utilidades de marca: `templates/app/globals.css`.
- Fondo de marca CSS (auroras + grano, costo cero, sin video ni API): `components/backdrop.tsx`.
- Captura de leads: `app/api/lead/route.ts` (valida server-side, guarda en Supabase si hay).

## Paleta: usa la marca del cliente

El tema por defecto es editorial oscuro. **Si es un cliente con su propia marca, corre
primero el skill `brand-palette` con su logo** y pega los tokens en el `@theme` de
`globals.css`. Así la landing sale con SUS colores y contraste AA verificado, no con el
default. Para renovar un sitio existente, entra por el skill `site-reboot` (te trae el
copy real y la marca antes de construir).

## Principios

1. **Copy primero, código después.** El contenido real manda; el componente sólo lo viste.
2. **Cero placeholders al entregar.** `critique` falla si encuentra `{{` vivo.
3. **La tipografía es identidad.** Display serif con carácter, itálica como acento.
4. **Ritmo de scroll.** Cada sección rompe con la anterior; no una cuadrícula monótona.
5. **Color con propósito.** El acento sólo donde importa (CTA, una palabra, un dato).
6. **Honestidad.** No se inventan casos, testimonios ni métricas. Si no hay, se borra
   la sección. Datos fabricados = sección eliminada, no rellenada.
