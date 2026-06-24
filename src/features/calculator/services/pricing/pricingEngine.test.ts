import { describe, expect, it } from 'vitest'
import type { CalculatorInputs, ValueEstimates } from '@/features/calculator/types'
import { computePricing } from './pricingEngine'

const FX = { usdToEur: 0.92 }

/** Caso 1 — Bot de WhatsApp para clínica dental (cliente pequeño, retainer). */
const dental: { inputs: CalculatorInputs; estimates: ValueEstimates } = {
  inputs: {
    projectDescription: 'Agente de WhatsApp que agenda citas y guarda leads para una clínica dental.',
    niche: 'dental',
    hoursInvested: 25,
    techStack: ['claude_api', 'whatsapp_api', 'vps'],
    clientRevenueSize: 'small',
    saleModality: 'monthly_retainer',
  },
  estimates: {
    nicheHourlyRateUsd: 12,
    hoursSavedPerMonth: 40,
    revenueEnabledPerMonthUsd: 600,
    monthlyApiCostUsd: 30,
    monthlyInfraCostUsd: 50,
    estimatedMaintenanceHoursPerMonth: 2,
    builderHourlyRateUsd: 25,
    confidence: 'medium',
    assumptions: [],
  },
}

/** Caso 2 — Flujo de captación de leads en n8n para inmobiliaria (mediano, setup único). */
const inmobiliaria: { inputs: CalculatorInputs; estimates: ValueEstimates } = {
  inputs: {
    projectDescription: 'Flujo en n8n que captura y califica leads para una inmobiliaria.',
    niche: 'inmobiliaria',
    hoursInvested: 40,
    techStack: ['n8n_cloud', 'vps', 'claude_api'],
    clientRevenueSize: 'medium',
    saleModality: 'one_time',
  },
  estimates: {
    nicheHourlyRateUsd: 15,
    hoursSavedPerMonth: 60,
    revenueEnabledPerMonthUsd: 2000,
    monthlyApiCostUsd: 30,
    monthlyInfraCostUsd: 37,
    estimatedMaintenanceHoursPerMonth: 3,
    builderHourlyRateUsd: 35,
    confidence: 'high',
    assumptions: [],
  },
}

/** Caso 3 — SaaS de gestión de certificaciones de gas (cliente grande, retainer). */
const gasSaas: { inputs: CalculatorInputs; estimates: ValueEstimates } = {
  inputs: {
    projectDescription: 'SaaS con Supabase + Netlify para gestionar certificaciones de gas.',
    niche: 'saas_tech',
    hoursInvested: 120,
    techStack: ['supabase', 'vercel', 'claude_api'],
    clientRevenueSize: 'large',
    saleModality: 'monthly_retainer',
  },
  estimates: {
    nicheHourlyRateUsd: 22,
    hoursSavedPerMonth: 80,
    revenueEnabledPerMonthUsd: 5000,
    monthlyApiCostUsd: 40,
    monthlyInfraCostUsd: 45,
    estimatedMaintenanceHoursPerMonth: 5,
    builderHourlyRateUsd: 50,
    confidence: 'high',
    assumptions: [],
  },
}

const ROUNDING_SLACK = 50 // un paso de redondeo de tolerancia para los topes

describe.each([
  ['dental', dental],
  ['inmobiliaria', inmobiliaria],
  ['gasSaas', gasSaas],
])('computePricing — %s', (_name, fixture) => {
  const result = computePricing(fixture.inputs, fixture.estimates, FX)

  it('mantiene el orden minimo ≤ recomendado ≤ premium (mensual y setup)', () => {
    const [min, rec, premium] = result.tiers
    expect(min.monthly.usd).toBeLessThanOrEqual(rec.monthly.usd)
    expect(rec.monthly.usd).toBeLessThanOrEqual(premium.monthly.usd)
    expect(min.setup.usd).toBeLessThanOrEqual(rec.setup.usd)
    expect(rec.setup.usd).toBeLessThanOrEqual(premium.setup.usd)
  })

  it('aplica un multiplicador dentro de la banda [5, 10]', () => {
    expect(result.multiplier).toBeGreaterThanOrEqual(5)
    expect(result.multiplier).toBeLessThanOrEqual(10)
  })

  it('el precio recomendado no supera el 25% del valor mensual (salvo redondeo)', () => {
    const cap = result.monthlyValue.totalMonthlyValueUsd * 0.25
    expect(result.tiers[1].monthly.usd).toBeLessThanOrEqual(cap + ROUNDING_SLACK)
  })

  it('el precio mínimo mensual cubre al menos 2x el costo operativo', () => {
    const floor = result.monthlyCost.totalMonthlyCostUsd * 2
    expect(result.tiers[0].monthly.usd).toBeGreaterThanOrEqual(floor - ROUNDING_SLACK)
  })

  it('deriva EUR a partir de USD para cada cifra', () => {
    for (const tier of result.tiers) {
      expect(tier.monthly.eur).toBeGreaterThan(0)
      expect(tier.setup.eur).toBeGreaterThan(0)
      // EUR debe estar cerca de usd * fx (con holgura de redondeo).
      expect(tier.monthly.eur).toBeLessThanOrEqual(tier.monthly.usd)
    }
  })

  it('elige la cifra protagonista según la modalidad', () => {
    const expectHeadline = fixture.inputs.saleModality === 'one_time' ? 'setup' : 'monthly'
    for (const tier of result.tiers) {
      expect(tier.headline).toEqual(tier[expectHeadline])
    }
  })
})

describe('computePricing — determinismo', () => {
  it('misma entrada produce exactamente la misma salida', () => {
    const a = computePricing(dental.inputs, dental.estimates, FX)
    const b = computePricing(dental.inputs, dental.estimates, FX)
    expect(a).toEqual(b)
  })
})

describe('computePricing — entradas degeneradas', () => {
  it('no produce negativos ni rompe el orden cuando el costo supera al valor', () => {
    const result = computePricing(
      { ...dental.inputs, clientRevenueSize: 'small' },
      {
        ...dental.estimates,
        hoursSavedPerMonth: 2,
        revenueEnabledPerMonthUsd: 0,
        monthlyApiCostUsd: 100,
        monthlyInfraCostUsd: 100,
        estimatedMaintenanceHoursPerMonth: 10,
        builderHourlyRateUsd: 50,
      },
      FX,
    )
    const [min, rec, premium] = result.tiers
    expect(min.monthly.usd).toBeGreaterThanOrEqual(0)
    expect(min.monthly.usd).toBeLessThanOrEqual(rec.monthly.usd)
    expect(rec.monthly.usd).toBeLessThanOrEqual(premium.monthly.usd)
  })
})
