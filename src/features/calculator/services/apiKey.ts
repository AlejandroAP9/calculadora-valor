/**
 * Extrae la API key de OpenRouter del body de una request (patrón BYOK).
 * Devuelve null si no viene o está vacía. La key nunca se persiste ni se loguea.
 */
export function extractApiKey(body: unknown): string | null {
  const raw = (body as { apiKey?: unknown } | null)?.apiKey
  const key = typeof raw === 'string' ? raw.trim() : ''
  return key.length > 0 ? key : null
}

/** Mensaje único para el 400 cuando falta la key, en lenguaje del usuario. */
export const MISSING_API_KEY_MESSAGE =
  'Falta tu API key de OpenRouter. Pégala en el campo correspondiente para calcular tu precio.'
