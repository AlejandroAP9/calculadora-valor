import { generateObject } from 'ai'
import { MODELS, openrouter } from '@/lib/ai/openrouter'
import { ProposalSchema } from '@/features/calculator/schemas/output.schema'
import type { CalculatorInputs, PricingResult, Proposal } from '@/features/calculator/types'
import { PROPOSAL_SYSTEM_PROMPT, buildProposalPrompt } from './prompts'

/**
 * Redacta la prosa comercial (script, ROI, contrato) alimentada con los números
 * YA calculados por el motor. La IA jamás recalcula precios. Lanza si falla para
 * que la UI muestre "reintentar" — pero el precio del motor sigue visible.
 */
export async function generateProposal(
  inputs: CalculatorInputs,
  pricing: PricingResult,
): Promise<Proposal> {
  const { object } = await generateObject({
    model: openrouter(MODELS.powerful),
    schema: ProposalSchema,
    system: PROPOSAL_SYSTEM_PROMPT,
    prompt: buildProposalPrompt(inputs, pricing),
  })
  return object
}
