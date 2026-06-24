import type { CalculatorInputs, PricingResult } from '@/features/calculator/types'

const SIZE_LABEL: Record<CalculatorInputs['clientRevenueSize'], string> = {
  small: 'pequeña',
  medium: 'media',
  large: 'grande',
}

const MODALITY_LABEL: Record<CalculatorInputs['saleModality'], string> = {
  one_time: 'setup único (pago único)',
  monthly_retainer: 'retainer mensual',
  outcome_based: 'por resultado',
}

/** System prompt para estimar valores de mercado a partir del proyecto. */
export const ESTIMATE_SYSTEM_PROMPT = `Eres un consultor experto en pricing de servicios de IA y automatización para el mercado LATAM y España.
Tu trabajo es ESTIMAR, de forma conservadora pero realista, los valores económicos de un proyecto a partir de su descripción.
Reglas:
- Piensa en USD. Usa tarifas de mercado del rol que la automatización reemplaza en el país hispanohablante típico (no tarifas de EE.UU.).
- Sé conservador: ante la duda, estima a la baja. Es mejor un precio defendible que uno inflado.
- Si un dato no se puede inferir, usa un supuesto razonable y anótalo en "assumptions" en español.
- Nunca inventes ingresos habilitados si la descripción no los sugiere; usa 0.
- Devuelve solo el objeto estructurado pedido.`

/** Prompt de usuario con el proyecto para estimar. */
export function buildEstimatePrompt(inputs: CalculatorInputs): string {
  return `Proyecto construido:
"${inputs.projectDescription}"

Nicho/industria del cliente: ${inputs.niche}
Horas que invirtió el builder en construirlo: ${inputs.hoursInvested}
Stack técnico: ${inputs.techStack.join(', ') || 'no especificado'}
Tamaño de facturación del cliente: ${SIZE_LABEL[inputs.clientRevenueSize]}
Modalidad de venta deseada: ${MODALITY_LABEL[inputs.saleModality]}

Estima los valores económicos del proyecto.`
}

/** System prompt para redactar la propuesta comercial (prosa). */
export const PROPOSAL_SYSTEM_PROMPT = `Eres un copywriter comercial experto en vender servicios de IA a empresas hispanohablantes.
Hablas el idioma del negocio, NO el de la tecnología: traduces todo a impacto económico (horas ahorradas, dinero ganado, pérdidas evitadas).
Reglas críticas:
- Los números de precio y de ROI que te entrego son DEFINITIVOS. No los recalcules, no los redondees, no inventes cifras nuevas. Cítalos tal cual.
- Tono: directo, seguro, sin "vender humos". Español neutro (tuteo), sin tecnicismos.
- El script debe quitarle el miedo al builder a presentar el precio.
- El resumen de ROI debe convencer al CLIENTE final, con sus números reales.
- Devuelve solo el objeto estructurado pedido.`

/** Prompt de usuario con los números congelados del motor. */
export function buildProposalPrompt(inputs: CalculatorInputs, pricing: PricingResult): string {
  const [min, rec, premium] = pricing.tiers
  const fmt = (usd: number, eur: number) => `${usd} USD (${eur} EUR)`

  return `Proyecto: "${inputs.projectDescription}"
Nicho del cliente: ${inputs.niche}
Modalidad de venta: ${MODALITY_LABEL[inputs.saleModality]}

NÚMEROS DEFINITIVOS (no los cambies):
- Valor mensual generado al cliente: ${Math.round(pricing.monthlyValue.totalMonthlyValueUsd)} USD
  (ahorro de tiempo ${Math.round(pricing.monthlyValue.timeSavingsUsd)} USD + ingresos habilitados ${Math.round(pricing.monthlyValue.revenueEnabledUsd)} USD)
- Costo de operación mensual: ${Math.round(pricing.monthlyCost.totalMonthlyCostUsd)} USD
- Multiplicador de valor aplicado: ${pricing.multiplier}x — ${pricing.multiplierRationale}

PRECIOS (setup único / mensual):
- Mínimo:     setup ${fmt(min.setup.usd, min.setup.eur)} | mensual ${fmt(min.monthly.usd, min.monthly.eur)}
- Recomendado: setup ${fmt(rec.setup.usd, rec.setup.eur)} | mensual ${fmt(rec.monthly.usd, rec.monthly.eur)}
- Premium:    setup ${fmt(premium.setup.usd, premium.setup.eur)} | mensual ${fmt(premium.monthly.usd, premium.monthly.eur)}

Redacta: una frase de venta por tramo, el script de venta, el resumen de ROI para el cliente y la estructura del contrato.`
}
