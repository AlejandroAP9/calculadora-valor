import type { OperatingCostBreakdown, ValueEstimates } from '@/features/calculator/types'

/**
 * Costo real de operación mensual: APIs + infraestructura + mantenimiento
 * (horas de mantenimiento × tarifa del builder). Es lo que el precio mínimo
 * debe cubrir para no operar a pérdida.
 */
export function calcMonthlyOperatingCost(e: ValueEstimates): OperatingCostBreakdown {
  const apiUsd = Math.max(e.monthlyApiCostUsd, 0)
  const infraUsd = Math.max(e.monthlyInfraCostUsd, 0)
  const maintenanceUsd =
    Math.max(e.estimatedMaintenanceHoursPerMonth, 0) * Math.max(e.builderHourlyRateUsd, 0)
  return {
    apiUsd,
    infraUsd,
    maintenanceUsd,
    totalMonthlyCostUsd: apiUsd + infraUsd + maintenanceUsd,
  }
}
