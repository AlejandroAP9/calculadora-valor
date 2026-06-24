/**
 * Utilidades puras de dinero. Sin dependencias, sin I/O.
 *
 * El tipo de cambio real vive en `src/lib/config/currency.ts` (lee env); este
 * módulo solo redondea de forma reproducible para que el motor sea testeable.
 */

/**
 * Redondea a un número "vendible": múltiplos de 10 bajo 1000, de 50 desde 1000.
 * Nunca devuelve negativos ni NaN.
 */
export function roundMoney(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0
  const step = amount < 1000 ? 10 : 50
  return Math.round(amount / step) * step
}

/** Clampea un número al rango [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
