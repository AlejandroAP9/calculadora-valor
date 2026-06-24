import { generateObject } from 'ai'
import { MODELS, getOpenRouter } from '@/lib/ai/openrouter'
import { ValueEstimatesSchema } from '@/features/calculator/schemas/estimates.schema'
import type { CalculatorInputs, ValueEstimates } from '@/features/calculator/types'
import { fallbackEstimates } from './pricing/defaults'
import { ESTIMATE_SYSTEM_PROMPT, buildEstimatePrompt } from './prompts'

export interface EstimateResult {
  estimates: ValueEstimates
  /** true si la IA falló y se usaron las tablas de referencia. */
  usedFallback: boolean
}

/**
 * Estima los valores económicos del proyecto con la IA. Si generateObject falla
 * (modelo sin soporte, schema inválido, sin API key), cae a las tablas de
 * referencia LATAM/España: el flujo NUNCA se rompe por culpa de la IA.
 */
export async function estimateValues(
  inputs: CalculatorInputs,
  apiKey: string,
): Promise<EstimateResult> {
  try {
    const openrouter = getOpenRouter(apiKey)
    const { object } = await generateObject({
      model: openrouter(MODELS.balanced),
      schema: ValueEstimatesSchema,
      system: ESTIMATE_SYSTEM_PROMPT,
      prompt: buildEstimatePrompt(inputs),
    })
    return { estimates: object, usedFallback: false }
  } catch (error) {
    console.error('[estimateValues] generateObject falló, usando tablas:', error)
    return {
      estimates: fallbackEstimates({
        niche: inputs.niche,
        techStack: inputs.techStack,
        clientRevenueSize: inputs.clientRevenueSize,
        hoursInvested: inputs.hoursInvested,
      }),
      usedFallback: true,
    }
  }
}
