import type { RevenueSize } from '@/features/calculator/types'
import { clamp } from './money'

/** Base del multiplicador según el tamaño de facturación del cliente. */
const BASE_BY_SIZE: Record<RevenueSize, number> = { small: 5, medium: 7, large: 9 }

const SIZE_LABEL: Record<RevenueSize, string> = {
  small: 'pequeña',
  medium: 'media',
  large: 'grande',
}

/**
 * Elige el multiplicador de valor en la banda 5x–10x (principio de consultoría:
 * el cliente paga 5x–10x del costo operativo si el valor lo justifica).
 *
 * Señal A — tamaño del cliente fija la posición base en la banda.
 * Señal B — el ROI (valor/costo) aporta un bonus dentro de la banda.
 */
export function chooseValueMultiplier(args: {
  clientRevenueSize: RevenueSize
  totalMonthlyValueUsd: number
  totalMonthlyCostUsd: number
}): { multiplier: number; rationale: string } {
  const base = BASE_BY_SIZE[args.clientRevenueSize]
  const ratio = args.totalMonthlyValueUsd / Math.max(args.totalMonthlyCostUsd, 1)
  const bonus = ratio >= 10 ? 1 : ratio >= 5 ? 0.5 : 0
  const multiplier = clamp(base + bonus, 5, 10)

  const rationale =
    `Cliente de facturación ${SIZE_LABEL[args.clientRevenueSize]} (base ${base}x) ` +
    `con un ROI de ${ratio.toFixed(1)}x sobre el costo operativo (+${bonus}), ` +
    `por eso aplicamos ${multiplier}x.`

  return { multiplier, rationale }
}
