import type { CalculatorInputs, ValueEstimates } from '@/features/calculator/types'

/**
 * Costo de construcción (sweat equity): horas invertidas × tarifa del builder.
 * Es el piso de equidad para el precio de setup único — por debajo de esto, el
 * builder regala su trabajo.
 */
export function calcBuildEffortCost(inputs: CalculatorInputs, e: ValueEstimates): number {
  return Math.max(inputs.hoursInvested, 0) * Math.max(e.builderHourlyRateUsd, 0)
}
