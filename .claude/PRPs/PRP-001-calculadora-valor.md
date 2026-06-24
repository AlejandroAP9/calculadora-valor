# PRP-001 — Calculadora de Valor

> Estado: **COMPLETADO** (documentado de forma retroactiva el 2026-06-24)
> Blueprint del contrato humano-IA. Este PRP se escribió **después** de construir
> la feature para dejar el rastro de proceso que faltaba: la implementación se
> hizo saltándose el paso PRP. Refleja el código tal como existe en el commit
> `30c0a97`, no una intención previa.

---

## Objetivo

Una herramienta conversacional que, a partir de la descripción de un proyecto de
IA ya construido, entrega un **precio defendible en tres tramos** (mínimo,
recomendado, premium) más los materiales para venderlo: script de venta, resumen
de ROI para el cliente y estructura de contrato. Mercado objetivo: constructores
de IA hispanohablantes (LATAM/España) de la comunidad Imperio Agéntico.

Estado final: un wizard de 6 pasos → estimación de valor → propuesta completa,
en menos de 5 minutos, sin que el usuario tenga que pensar en pricing.

## Por qué

De >200 posts analizados en Imperio Agéntico, el problema recurrente **sin
solución existente** es comercial, no técnico: los miembros construyen pero no
saben cuánto cobrar, cómo justificarlo, ni cuál es su margen real. Detalle
completo del problema y casos de uso en [`BUSINESS_LOGIC.md`](../../BUSINESS_LOGIC.md).

## Qué (comportamiento + criterios de éxito)

**Comportamiento**
1. El usuario completa 6 inputs (descripción, nicho, horas invertidas, stack,
   tamaño del cliente, modalidad de venta).
2. El sistema estima los valores económicos del proyecto (con IA, con fallback
   determinista por tablas).
3. El usuario revisa y ajusta las estimaciones.
4. El sistema calcula 3 tramos de precio + redacta la propuesta comercial.

**Criterios de éxito (los que valida el código)**
- El precio es **determinista**: misma entrada → misma salida exacta.
- Los tramos respetan `mínimo ≤ recomendado ≤ premium` siempre, incluso con
  entradas degeneradas (costo > valor).
- El mínimo mensual cubre al menos **2x** el costo operativo (nunca operar a
  pérdida).
- El recomendado no supera el **25%** del valor mensual generado (defendible: el
  cliente conserva ≥75%).
- El multiplicador de valor vive en la banda **5x–10x** (principio de
  consultoría).
- La IA **nunca inventa cifras**: sólo redacta prosa alrededor de números ya
  calculados.

## Contexto (decisión arquitectónica clave)

**Separación dura entre número y prosa.** Es el corazón del diseño y lo que lo
hace confiable:

- **Motor determinista** (`services/pricing/`): TODAS las cifras salen de fórmulas
  reproducibles. No interviene ningún LLM. Piezas chicas y testeadas:
  `multiplier`, `operatingCost`, `monthlyClientValue`, `buildEffortCost`, `money`,
  orquestadas por `pricingEngine.ts`.
- **IA sólo para lenguaje** (`services/prompts.ts` + `generateProposal.ts`): recibe
  los números ya congelados y redacta script de venta, ROI y contrato. El system
  prompt le prohíbe recalcular o redondear.

Esto cumple la filosofía operativa "Data engineering > AI": lo que se resuelve con
fórmulas no usa LLM. Golden Path respetado: Next.js 16 (App Router, runtime
nodejs), Zod como fuente de verdad de tipos, OpenRouter como motor de IA, Zustand
para el estado del wizard.

**Resiliencia:** el endpoint de propuesta calcula el pricing siempre; si la prosa
de la IA falla, devuelve el pricing igual + `proposalError: true` para que la UI
ofrezca reintentar. El estimador tiene fallback por tablas (`fallbackEstimates`)
cuando `generateObject` falla.

## Blueprint (fases)

### Fase 1 — Intake (wizard de 6 pasos)
- `schemas/inputs.schema.ts`: `CalculatorInputsSchema` (Zod) = fuente de verdad.
- `components/CalculatorWizard.tsx`, `WizardSteps.tsx`, `WizardProgress.tsx`.
- `store/useCalculatorStore.ts`: estado del wizard (Zustand).
- Validación parcial paso a paso vía `PartialCalculatorInputsSchema`.

### Fase 2 — Estimación del valor generado
- API `POST /api/calculator/estimate` → `services/estimateValues.ts`.
- IA estima con `ESTIMATE_SYSTEM_PROMPT` (conservador, tarifas hispanohablantes).
- Fallback determinista por tablas LATAM/España en `pricing/defaults.ts`
  (tarifas por nicho, costos por stack, tarifa builder por tamaño de cliente).
- `components/EstimatesReview.tsx`: el usuario revisa/ajusta antes de calcular.

### Fase 3 — Cálculo de precio + propuesta (output)
- API `POST /api/calculator/proposal` → `computePricing()` (determinista) +
  `generateProposal()` (prosa IA).
- Motor: `pricing/pricingEngine.ts` produce 3 tramos en USD+EUR, headline según
  modalidad de venta.
- Salida de prosa validada con `schemas/output.schema.ts` (`ProposalSchema`): sin
  cifras, sólo lenguaje de negocio.
- UI: `ResultView`, `PriceTiers`, `SalesScript`, `RoiSummary`, `ContractStructure`.

## Verificación

- `pricingEngine.test.ts`: 20 casos (vitest). Cubre orden de tramos, banda del
  multiplicador, tope del 25%, piso del 2x, derivación EUR, headline por
  modalidad, **determinismo** y entradas degeneradas.
- `e2e/smoke.mjs`: smoke end-to-end (Playwright).
- Estado al 2026-06-24: `npm run typecheck` ✓ · `npm run test` 20/20 ✓ ·
  `npm run build` ✓.

## Aprendizajes (Self-Annealing)

1. **Tailwind v4-syntax sobre deps v3** → blindaje capturado. El template Raíz
   traía `@import 'tailwindcss'` (sintaxis v4) con Tailwind 3.4 + plugin PostCSS
   v3: el build pasaba pero la UI salía **sin estilos**. Fix aplicado en
   `globals.css`: usar las tres directivas `@tailwind base/components/utilities`.
   Verificar versión con `cat node_modules/tailwindcss/package.json`. Ver
   `.claude/blindajes/`.
2. **`ProposalSchema` sin `.length(3)`**: algunos proveedores vía OpenRouter
   (Bedrock) rechazan `minItems` ≠ 0/1. El conteo de tramos se pide en el prompt y
   la UI mapea por `label`, no por posición.
3. **Proceso**: esta feature se construyó sin PRP previo. Funcionó (compila, pasa
   tests, sigue el Golden Path), pero saltarse el blueprint rompe la disciplina de
   "aprobación antes de implementar". La próxima feature arranca desde un PRP.
4. **Auditoría de seguridad + BYOK (2026-06-24)**: la primera versión usaba una
   API key de OpenRouter del servidor (`OPENROUTER_API_KEY`), lo que dejaba los
   endpoints `/api/calculator/*` como un vector de costo (cualquiera podía quemar
   el crédito del dueño). Se migró a **BYOK (Bring Your Own Key)**: cada usuario
   pega su propia key en la UI (`ApiKeyField` + `useApiKeyStore`, persistida sólo
   en su localStorage, nunca en BD), se manda por request y las rutas la exigen
   (`extractApiKey` → 400 si falta). Esto elimina el riesgo de costo de raíz. Se
   añadieron además `max` a `projectDescription` (2000) y `techStack` (20×60) para
   acotar el costo de tokens por request. Resto de la auditoría: secretos limpios,
   key server-only, Zod en entradas, sin XSS, prompt injection mitigado por el
   motor determinista.
