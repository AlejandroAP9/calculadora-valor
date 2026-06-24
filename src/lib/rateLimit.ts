/**
 * Rate limiter de ventana fija, en memoria y sin dependencias.
 *
 * Cuenta requests por clave (normalmente IP + ruta) dentro de una ventana. Cuando
 * se supera el límite, devuelve `ok: false` con los segundos que faltan para
 * resetear, y la ruta responde 429.
 *
 * LIMITACIÓN: el contador vive en la memoria del proceso. En un servidor único de
 * larga vida (Docker/Easypanel) es exacto. En serverless multi-instancia (Vercel
 * con varias lambdas) cada instancia cuenta por separado, así que es best-effort:
 * si algún día despliegas así y necesitas un límite estricto, cambia este store
 * por uno compartido (ej. @upstash/ratelimit con Redis) manteniendo la misma firma.
 */

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export interface RateLimitResult {
  ok: boolean
  remaining: number
  /** Segundos hasta poder reintentar (0 si ok). */
  retryAfterSec: number
}

/** Configuración por defecto para los endpoints de la calculadora. */
export const CALCULATOR_RATE_LIMIT = { limit: 15, windowMs: 60_000 } as const

/**
 * Registra un golpe contra `key`. `now` es inyectable para tests deterministas.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult {
  // Poda perezosa: evita que el Map crezca sin techo con IPs que no vuelven.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (now >= b.resetAt) buckets.delete(k)
    }
  }

  const bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1, retryAfterSec: 0 }
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count += 1
  return { ok: true, remaining: limit - bucket.count, retryAfterSec: 0 }
}

/** IP del cliente a partir de los headers del proxy. Fallback 'unknown'. */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/** Sólo para tests: vacía el store entre casos. */
export function __resetRateLimit() {
  buckets.clear()
}
