import { roundMoney } from '@/features/calculator/services/pricing/money'

/**
 * Tipo de cambio USD→EUR. Constante de entorno con fallback estable: una
 * calculadora de precios necesita un número explicable y reproducible, no una
 * llamada en vivo que pueda fallar. Actualizar = cambiar la env y redeployar.
 */
export const USD_TO_EUR = Number(process.env.NEXT_PUBLIC_USD_TO_EUR ?? '0.92')

/** El objeto fx que espera el motor de pricing. */
export const FX = { usdToEur: USD_TO_EUR } as const

/** Convierte USD a EUR redondeado a cifra vendible. */
export function toEur(usd: number): number {
  return roundMoney(usd * USD_TO_EUR)
}
