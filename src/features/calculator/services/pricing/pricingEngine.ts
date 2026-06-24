import type {
  CalculatorInputs,
  MoneyDual,
  PriceTier,
  PricingResult,
  SaleModality,
  TierLabel,
  ValueEstimates,
} from '@/features/calculator/types'
import { calcBuildEffortCost } from './buildEffortCost'
import { calcMonthlyClientValue } from './monthlyClientValue'
import { roundMoney } from './money'
import { chooseValueMultiplier } from './multiplier'
import { calcMonthlyOperatingCost } from './operatingCost'

const TIER_LABELS: TierLabel[] = ['minimo', 'recomendado', 'premium']

/** Convierte un monto USD a su par {usd, eur}, ambos redondeados a cifra vendible. */
function toDual(usd: number, fxRate: number): MoneyDual {
  return { usd: roundMoney(usd), eur: roundMoney(usd * fxRate) }
}

/** Garantiza una secuencia no decreciente (red de seguridad tras redondear). */
function enforceOrder(values: number[]): number[] {
  const out = [...values]
  for (let i = 1; i < out.length; i++) {
    if (out[i] < out[i - 1]) out[i] = out[i - 1]
  }
  return out
}

/** La cifra protagonista según la modalidad de venta. */
function pickHeadline(modality: SaleModality, setup: MoneyDual, monthly: MoneyDual): MoneyDual {
  return modality === 'one_time' ? setup : monthly
}

/**
 * Motor de pricing determinista. Misma entrada → misma salida, siempre.
 * La IA jamás llama a esto para inventar números; recibe el resultado ya hecho.
 */
export function computePricing(
  inputs: CalculatorInputs,
  estimates: ValueEstimates,
  fx: { usdToEur: number },
): PricingResult {
  const fxRate = fx.usdToEur
  const monthlyValue = calcMonthlyClientValue(estimates)
  const monthlyCost = calcMonthlyOperatingCost(estimates)
  const buildEffortCostUsd = calcBuildEffortCost(inputs, estimates)

  const value = monthlyValue.totalMonthlyValueUsd
  const operating = monthlyCost.totalMonthlyCostUsd

  const { multiplier, rationale } = chooseValueMultiplier({
    clientRevenueSize: inputs.clientRevenueSize,
    totalMonthlyValueUsd: value,
    totalMonthlyCostUsd: operating,
  })

  // MENSUAL (retainer): el mínimo siempre cubre 2x el costo (nunca operar a
  // pérdida). Recomendado y premium aplican 5–10x del costo, topados al 25%/40%
  // del valor generado (defendible: el cliente conserva ≥75%), pero nunca por
  // debajo del piso de costo. Floor monótono en vez de sort: así "mínimo" sigue
  // significando "cubre el costo" incluso con estimaciones degeneradas.
  const monthlyMin = operating * 2
  const monthlyRecBase = Math.max(Math.min(operating * multiplier, value * 0.25), monthlyMin)
  const monthlyPremBase = Math.max(Math.min(operating * (multiplier + 2), value * 0.4), monthlyRecBase)
  // Escalonado mínimo visible entre tramos: solo eleva cuando los topes de valor
  // comprimen los precios contra el piso de costo (proyectos de bajo valor). Con
  // valor alto, los números anclados al valor ya superan este gradiente.
  const monthlyRec = Math.max(monthlyRecBase, monthlyMin * 1.2)
  const monthlyPremium = Math.max(monthlyPremBase, monthlyRec * 1.25)
  const monthlySorted = enforceOrder([monthlyMin, monthlyRec, monthlyPremium].map(roundMoney))

  // SETUP único: piso de equidad (build + 30% margen) + un kicker de valor.
  const setupFloor = buildEffortCostUsd * 1.3
  const setupSorted = enforceOrder(
    [setupFloor, setupFloor + value * 0.5, setupFloor + value * 1.0].map(roundMoney),
  )

  const tiers: PriceTier[] = TIER_LABELS.map((label, i) => {
    const setup = toDual(setupSorted[i], fxRate)
    const monthly = toDual(monthlySorted[i], fxRate)
    return {
      label,
      setup,
      monthly,
      headline: pickHeadline(inputs.saleModality, setup, monthly),
    }
  })

  return {
    tiers,
    multiplier,
    multiplierRationale: rationale,
    monthlyValue,
    monthlyCost,
    buildEffortCostUsd: roundMoney(buildEffortCostUsd),
    fxRate,
    saleModality: inputs.saleModality,
  }
}
