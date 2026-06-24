import type { MonthlyValueBreakdown, ValueEstimates } from '@/features/calculator/types'

/**
 * Valor económico mensual que la solución genera al cliente:
 * ahorro de tiempo (horas ahorradas × tarifa del nicho) + ingresos habilitados.
 */
export function calcMonthlyClientValue(e: ValueEstimates): MonthlyValueBreakdown {
  const timeSavingsUsd = Math.max(e.hoursSavedPerMonth, 0) * Math.max(e.nicheHourlyRateUsd, 0)
  const revenueEnabledUsd = Math.max(e.revenueEnabledPerMonthUsd, 0)
  return {
    timeSavingsUsd,
    revenueEnabledUsd,
    totalMonthlyValueUsd: timeSavingsUsd + revenueEnabledUsd,
  }
}
