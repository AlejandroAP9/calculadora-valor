import { z } from 'zod'

/**
 * Valores de conocimiento del mundo que estima la IA y el usuario confirma.
 * Schema plano (sin anidación) para maximizar la fiabilidad de generateObject.
 */
export const ValueEstimatesSchema = z.object({
  nicheHourlyRateUsd: z
    .number()
    .describe('Tarifa de mercado en USD/hora del rol que la automatización reemplaza'),
  hoursSavedPerMonth: z.number().describe('Horas al mes que la solución le ahorra al cliente'),
  revenueEnabledPerMonthUsd: z
    .number()
    .describe('Ingresos nuevos o pérdidas evitadas en USD/mes; 0 si no aplica'),
  monthlyApiCostUsd: z.number().describe('Costo mensual de APIs (tokens) en USD'),
  monthlyInfraCostUsd: z.number().describe('Costo mensual de VPS, hosting y líneas en USD'),
  estimatedMaintenanceHoursPerMonth: z
    .number()
    .describe('Horas al mes de mantenimiento que invierte el builder'),
  builderHourlyRateUsd: z.number().describe('Valor en USD/hora del tiempo del builder'),
  confidence: z.enum(['low', 'medium', 'high']).describe('Confianza de estas estimaciones'),
  assumptions: z
    .array(z.string())
    .describe('Supuestos hechos, en español, para que el usuario los valide'),
})
