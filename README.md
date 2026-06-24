# Raíz

Template production-ready para crear aplicaciones SaaS con desarrollo asistido por IA. Filosofia Agent-First: el usuario dice que quiere, el agente construye todo.

## Que incluye

- Next.js 16 (App Router) + TypeScript
- Supabase (Database + Auth + RLS)
- Tailwind CSS + shadcn/ui
- 24 Skills de Claude Code
- Playwright CLI para QA automatizado
- AI Templates (Vercel AI SDK v5 + OpenRouter)
- 5 Design Systems listos para usar
- Arquitectura Feature-First optimizada para IA
- Auto-Blindaje: el sistema aprende de cada error

## Quick Start

### 1. Instalar

```bash
npm install
```

### 2. Variables de Entorno

```bash
cp .env.example .env.local
# Editar con credenciales de Supabase
```

### 3. MCPs (Opcional)

```bash
cp .claude/example.mcp.json .mcp.json
# Editar con project ref de Supabase
```

### 4. Desarrollar

```bash
npm run dev
# Auto-detecta puerto disponible (3000-3006)
```

## Tech Stack

```yaml
Runtime: Node.js + TypeScript
Framework: Next.js 16 (App Router)
Database: PostgreSQL/Supabase
Styling: Tailwind CSS 3.4
Components: shadcn/ui
State: Zustand
Validation: Zod
AI Engine: Vercel AI SDK v5 + OpenRouter
Testing: Playwright CLI + MCP
Deploy: Vercel
```

## Arquitectura Feature-First

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Rutas auth
│   ├── (main)/              # Rutas principales
│   └── layout.tsx
│
├── features/                 # Organizadas por funcionalidad
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── store/
│
└── shared/                   # Codigo reutilizable
    ├── components/
    ├── hooks/
    ├── lib/
    └── types/
```

## Skills (24 total)

| Skill | Que hace |
|-------|----------|
| `new-app` | Entrevista de negocio → BUSINESS_LOGIC.md |
| `primer` | Inicializar contexto del proyecto |
| `add-login` | Auth completo (Email + Google OAuth + profiles + RLS) |
| `add-payments` | Pagos: checkout, webhooks, suscripciones |
| `add-emails` | Emails transaccionales (Resend + React Email) |
| `add-mobile` | PWA instalable + notificaciones push |
| `website-3d` | Landing cinematica scroll-stop + copy de alta conversion |
| `prp` | Planificar features complejas antes de implementar |
| `bucle-agentico` | Implementar features complejas por fases |
| `ai` | Agregar IA: chat, RAG, vision, tools, structured outputs |
| `supabase` | Todo BD: tablas, RLS, migraciones, queries |
| `playwright-cli` | QA automatizado con browser real |
| `memory-manager` | Memoria persistente por proyecto |
| `image-generation` | Generar y editar imagenes (OpenRouter + Gemini) |
| `video-visuals` | Paquetes visuales para video/presentacion |
| `autoresearch` | Auto-optimizar skills (patron Karpathy) |
| `skill-creator` | Crear nuevos skills |
| `design-review` | Critica y pule la UI (anti-AI-slop) |
| `security-audit` | Auditoria de seguridad (RLS, secrets, XSS, npm audit) |
| `plan` | Pipeline de planificacion (10 docs → Blueprint) antes de construir |
| `architecture-review` | Revision de arquitectura (acoplamiento, capas, deuda) |
| `performance-review` | Revision de performance (N+1, bundle, caché, indices) |
| `update-raiz` | Actualizar (merge 3-way, no pisa tu codigo) |
| `eject-raiz` | Remover Raíz (destructivo) |

## AI Templates

Bloques LEGO para construir features de IA con Vercel AI SDK v5 + OpenRouter:

| Template | Que hace |
|----------|----------|
| setup-base | Configuracion inicial |
| chat | Chat streaming con useChat |
| web-search | Busqueda con :online |
| historial | Persistencia en Supabase |
| vision | Analisis de imagenes |
| tools | Funciones/herramientas |
| rag | pgvector + embeddings |
| single-call | generateText() puntual |
| structured-outputs | generateObject() con Zod |
| generative-ui | LLM decide que componente renderizar |

## Design Systems

5 sistemas visuales listos en `.claude/design-systems/`:

- **Liquid Glass** - iOS-like, transparencias
- **Gradient Mesh** - Degradados fluidos
- **Neumorphism** - Soft UI, sombras suaves
- **Bento Grid** - Grids asimetricos
- **Neobrutalism** - Bold, bordes duros

## Comandos

```bash
npm run dev          # Desarrollo (auto-port 3000-3006)
npm run build        # Build produccion
npm run typecheck    # TypeScript check
npm run lint         # ESLint
```

## Deploy

```bash
# Vercel (recomendado)
npm install -g vercel
vercel
```

Variables en Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Estructura .claude/

```
.claude/
├── skills/              # 24 skills (skills/ai/references/ trae los templates de IA)
├── memory/              # Memoria persistente del proyecto
├── blindajes/           # Memoria de errores compartida entre proyectos
├── PRPs/                # Product Requirements Proposals
├── design-systems/      # 5 sistemas de diseno
├── hooks/               # Scripts en eventos
└── example.mcp.json     # Config de MCPs
```

---

**Raíz** | Agent-First. De una raíz, todos tus proyectos.
