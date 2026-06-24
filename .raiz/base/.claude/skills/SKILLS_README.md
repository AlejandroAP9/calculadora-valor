# Skills System - Raíz

> De una raíz, todos tus proyectos.

Cada skill vive en su propia carpeta con un `SKILL.md` (frontmatter YAML +
instrucciones en markdown). El agente decide cuál activar según lo que dice el
usuario en lenguaje natural; algunas también se invocan con `/<nombre>`.

## Los 31 skills

| Skill | Qué hace |
|-------|----------|
| `new-app` | Entrevista de negocio → BUSINESS_LOGIC.md |
| `primer` | Inicializar contexto del proyecto |
| `add-login` | Auth completo Supabase (login, signup, reset, profiles, RLS) |
| `add-payments` | Pagos: checkout, webhooks, suscripciones, acceso |
| `add-emails` | Emails transaccionales (Resend + React Email + batch + unsubscribe) |
| `add-mobile` | PWA instalable + notificaciones push (iOS compatible) |
| `website-3d` | Landing cinematica scroll-stop + copy de alta conversion |
| `prp` | Generar Product Requirements Proposal antes de implementar |
| `bucle-agentico` | Features complejas por fases coordinadas (DB + API + UI) |
| `ai` | Templates de IA: chat, RAG, vision, tools, web search, structured outputs |
| `supabase` | Todo BD: tablas, RLS, migraciones, queries, metricas |
| `playwright-cli` | QA automatizado con browser real |
| `memory-manager` | Memoria persistente por proyecto en `.claude/memory/` |
| `image-generation` | Generar y editar imagenes (OpenRouter + Gemini) |
| `video-visuals` | Paquetes visuales narrativos para video/presentacion |
| `autoresearch` | Auto-optimizar skills con loop autonomo (patron Karpathy) |
| `skill-creator` | Crear nuevos skills |
| `design-review` | Critica y pule la UI (anti-AI-slop): jerarquia, contraste, a11y, estados |
| `security-audit` | Auditoria de seguridad: RLS, secrets, XSS, rate limiting, webhooks, npm audit |
| `plan` | Pipeline de planificacion de producto (9 docs → Blueprint maestro) antes de construir |
| `architecture-review` | Revision de arquitectura: acoplamiento, capas, deuda, Feature-First |
| `performance-review` | Revision de performance: N+1, bundle, imagenes, caché, indices |
| `update-raiz` | Actualizar a la ultima version (merge 3-way, no pisa tu codigo) |
| `eject-raiz` | Remover Raíz del proyecto (DESTRUCTIVO) |
| `raiz-landing` | Landing modular de alta conversion para cualquier nicho (primera opcion) |
| `brand-palette` | Logo del cliente → paleta con rampas OKLCH + tokens y contraste WCAG AA |
| `site-reboot` | URL de un sitio existente → Playwright audita → reconstruye mejor (antes/despues) |
| `add-cron` | Trabajos programados: Vercel Cron + Supabase pg_cron, versionados en codigo |
| `add-storage` | Subida y entrega de archivos: buckets publico/privado + proxy autenticado |
| `add-notifications` | Notificaciones in-app: tabla + Realtime + helper a prueba de fallos |
| `adversarial-review` | Review cross-vendor: Codex audita, Claude verifica cada hallazgo |

El skill `ai` trae templates de referencia en `ai/references/` (setup base, chat
streaming, web search, historial, vision, tools, RAG, single-call, structured
outputs, generative UI).

## Anatomía de un skill

```yaml
---
name: skill-name
description: Qué hace y cuándo activarlo
allowed-tools: Read, Write, Bash   # opcional: tools sin pedir permiso
---

# Instrucciones del skill en markdown (forma imperativa, <5k palabras)
```

## Crear un skill nuevo

Usa `skill-creator`, o créalo a mano. Checklist de calidad:

- [ ] `SKILL.md` con frontmatter YAML válido (name + description)
- [ ] Contenido <5k palabras, en forma imperativa
- [ ] Scripts con `--help` y manejo de errores
- [ ] `references/` para docs largas (>5k palabras), bajo demanda
- [ ] Descripción clara de cuándo activarlo

---

*Raíz: De una raíz, todos tus proyectos.*
*Basado en Claude Code Skills (CC 2.1.0+).*
