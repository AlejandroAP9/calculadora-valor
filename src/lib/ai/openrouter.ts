import { createOpenRouter } from '@openrouter/ai-sdk-provider'

/**
 * Provider de OpenRouter para el Vercel AI SDK — patrón BYOK (Bring Your Own Key).
 * Cada usuario trae SU propia API key, así cada uno paga su propio consumo y no
 * existe una clave del servidor que abusar. La key llega por request desde el
 * cliente; jamás se persiste en BD ni se loguea.
 * Server-only: no importar desde componentes cliente.
 */
export function getOpenRouter(apiKey: string) {
  return createOpenRouter({ apiKey })
}

/**
 * Modelos por rol. Los slugs son overridables por env para no tocar código si
 * OpenRouter renombra un modelo. Las llamadas estructuradas (estimate/proposal)
 * usan `balanced`/`powerful` (Claude Sonnet, fiable con JSON schema), NUNCA un
 * modelo `:free`.
 */
export const MODELS = {
  fast: process.env.OPENROUTER_MODEL_FAST ?? 'anthropic/claude-3.5-haiku',
  balanced: process.env.OPENROUTER_MODEL_BALANCED ?? 'anthropic/claude-sonnet-4.5',
  powerful: process.env.OPENROUTER_MODEL_POWERFUL ?? 'anthropic/claude-sonnet-4.5',
} as const
