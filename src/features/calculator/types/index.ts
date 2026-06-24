/**
 * Tipos del dominio de la Calculadora de Valor.
 *
 * Los inputs/estimates/proposal se infieren de los schemas Zod (fuente de verdad).
 * Los tipos de salida del motor (PricingResult y compañía) son interfaces planas:
 * el motor produce esas cifras, no se validan con Zod.
 */

import type { z } from 'zod'
import type { ValueEstimatesSchema } from '@/features/calculator/schemas/estimates.schema'
import type {
  CalculatorInputsSchema,
  RevenueSizeSchema,
  SaleModalitySchema,
} from '@/features/calculator/schemas/inputs.schema'
import type { ProposalSchema } from '@/features/calculator/schemas/output.schema'

export type RevenueSize = z.infer<typeof RevenueSizeSchema>
export type SaleModality = z.infer<typeof SaleModalitySchema>
export type CalculatorInputs = z.infer<typeof CalculatorInputsSchema>
export type ValueEstimates = z.infer<typeof ValueEstimatesSchema>
export type Proposal = z.infer<typeof ProposalSchema>

/** Una cifra de dinero en ambas monedas. */
export interface MoneyDual {
  usd: number
  eur: number
}

export type TierLabel = 'minimo' | 'recomendado' | 'premium'

export interface PriceTier {
  label: TierLabel
  /** Precio de setup único. */
  setup: MoneyDual
  /** Precio mensual (retainer / fee recurrente). */
  monthly: MoneyDual
  /** La cifra protagonista según la modalidad de venta elegida. */
  headline: MoneyDual
}

export interface MonthlyValueBreakdown {
  timeSavingsUsd: number
  revenueEnabledUsd: number
  totalMonthlyValueUsd: number
}

export interface OperatingCostBreakdown {
  apiUsd: number
  infraUsd: number
  maintenanceUsd: number
  totalMonthlyCostUsd: number
}

/**
 * Salida del motor determinista. NUNCA la genera la IA: todas las cifras vienen
 * de fórmulas reproducibles. La IA solo redacta prosa alrededor de estos números.
 */
export interface PricingResult {
  tiers: PriceTier[]
  multiplier: number
  multiplierRationale: string
  monthlyValue: MonthlyValueBreakdown
  monthlyCost: OperatingCostBreakdown
  buildEffortCostUsd: number
  fxRate: number
  saleModality: SaleModality
}
