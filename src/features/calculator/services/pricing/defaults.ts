/**
 * Tablas por defecto para el mercado LATAM/España. Conservadoras a propósito
 * (el spec pide "conservador pero justo"). Siembran al estimador de la IA y son
 * el fallback cuando la extracción falla. Todo en USD.
 */

import type { RevenueSize } from '@/features/calculator/types'

/** Tarifa horaria de mercado (USD/hr) del rol que la automatización reemplaza. */
export const NICHE_HOURLY_RATE_USD: Record<string, number> = {
  clinica_salud: 12,
  dental: 12,
  inmobiliaria: 15,
  ecommerce: 14,
  agencia_marketing: 18,
  restaurante_hosteleria: 10,
  educacion: 12,
  legal: 25,
  finanzas_contabilidad: 20,
  logistica: 13,
  turismo_viajes: 13,
  saas_tech: 22,
  default: 15,
}

/** Costo mensual asumido (USD/mes) por item de stack. */
export const STACK_MONTHLY_COST_USD: Record<string, number> = {
  claude_api: 30,
  openai_api: 30,
  n8n_cloud: 25,
  n8n_selfhost: 0,
  vps: 12,
  whatsapp_api: 45,
  ghl: 97,
  supabase: 25,
  vercel: 20,
  twilio: 20,
  default: 10,
}

/** Tarifa USD/hora del builder según el tamaño del cliente. */
export const BUILDER_HOURLY_RATE_USD: Record<RevenueSize, number> = {
  small: 25,
  medium: 35,
  large: 50,
}

/** Horas de mantenimiento mensuales por defecto. */
export const DEFAULT_MAINTENANCE_HOURS = 2

/**
 * Construye unas estimaciones de fallback puramente desde las tablas, sin IA.
 * Útil cuando `generateObject` falla. Importa el tipo de forma perezosa para no
 * crear ciclos.
 */
export function fallbackEstimates(input: {
  niche: string
  techStack: string[]
  clientRevenueSize: RevenueSize
  hoursInvested: number
}): import('@/features/calculator/types').ValueEstimates {
  const nicheKey = input.niche.trim().toLowerCase().replace(/\s+/g, '_')
  const nicheHourlyRateUsd = NICHE_HOURLY_RATE_USD[nicheKey] ?? NICHE_HOURLY_RATE_USD.default

  const monthlyStackCost = input.techStack.reduce((sum, item) => {
    const key = item.trim().toLowerCase().replace(/\s+/g, '_')
    return sum + (STACK_MONTHLY_COST_USD[key] ?? STACK_MONTHLY_COST_USD.default)
  }, 0)

  // Reparto simple: APIs vs infra. Si no hay stack, asume un mínimo razonable.
  const monthlyApiCostUsd = Math.max(monthlyStackCost * 0.5, 10)
  const monthlyInfraCostUsd = Math.max(monthlyStackCost * 0.5, 5)

  return {
    nicheHourlyRateUsd,
    hoursSavedPerMonth: 20,
    revenueEnabledPerMonthUsd: 0,
    monthlyApiCostUsd,
    monthlyInfraCostUsd,
    estimatedMaintenanceHoursPerMonth: DEFAULT_MAINTENANCE_HOURS,
    builderHourlyRateUsd: BUILDER_HOURLY_RATE_USD[input.clientRevenueSize],
    confidence: 'low',
    assumptions: [
      'Estimaciones generadas desde tablas de referencia LATAM/España (sin análisis de IA).',
      'Ajusta los valores que conozcas mejor antes de calcular el precio.',
    ],
  }
}
