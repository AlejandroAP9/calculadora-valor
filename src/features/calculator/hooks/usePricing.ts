'use client'

import { useCallback } from 'react'
import { FX } from '@/lib/config/currency'
import type { CalculatorInputs } from '@/features/calculator/types'
import { fallbackEstimates } from '@/features/calculator/services/pricing/defaults'
import { computePricing } from '@/features/calculator/services/pricing/pricingEngine'
import { useApiKeyStore } from '@/features/calculator/store/useApiKeyStore'
import { useCalculatorStore } from '@/features/calculator/store/useCalculatorStore'

/**
 * Orquesta las dos llamadas de IA. El motor de pricing es puro, así que también
 * corre en el cliente: da un preview instantáneo al editar estimados y sirve de
 * red si la red falla (el precio determinista nunca depende de la IA).
 */
export function usePricing() {
  const inputs = useCalculatorStore((s) => s.inputs)
  const estimates = useCalculatorStore((s) => s.estimates)
  const setPhase = useCalculatorStore((s) => s.setPhase)
  const setEstimates = useCalculatorStore((s) => s.setEstimates)
  const setResult = useCalculatorStore((s) => s.setResult)
  const apiKey = useApiKeyStore((s) => s.apiKey)

  const runEstimate = useCallback(async () => {
    setPhase('estimating')
    const fullInputs = inputs as CalculatorInputs
    try {
      const res = await fetch('/api/calculator/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: fullInputs, apiKey }),
      })
      if (!res.ok) throw new Error(`estimate ${res.status}`)
      const data = await res.json()
      setEstimates(data.estimates, Boolean(data.usedFallback))
    } catch (error) {
      console.error('[usePricing] estimate falló, usando tablas en cliente:', error)
      setEstimates(
        fallbackEstimates({
          niche: fullInputs.niche,
          techStack: fullInputs.techStack,
          clientRevenueSize: fullInputs.clientRevenueSize,
          hoursInvested: fullInputs.hoursInvested,
        }),
        true,
      )
    }
    setPhase('review')
  }, [inputs, apiKey, setPhase, setEstimates])

  const runProposal = useCallback(async () => {
    if (!estimates) return
    const fullInputs = inputs as CalculatorInputs
    setPhase('computing')
    try {
      const res = await fetch('/api/calculator/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: fullInputs, estimates, apiKey }),
      })
      if (!res.ok) throw new Error(`proposal ${res.status}`)
      const data = await res.json()
      setResult(data.pricing, data.proposal ?? null, Boolean(data.proposalError))
    } catch (error) {
      console.error('[usePricing] proposal falló, precio local sin prosa:', error)
      const pricing = computePricing(fullInputs, estimates, FX)
      setResult(pricing, null, true)
    }
  }, [inputs, estimates, apiKey, setPhase, setResult])

  /** Precio en vivo recalculado en el cliente (para el preview en review). */
  const previewPricing =
    estimates && inputs.niche ? computePricing(inputs as CalculatorInputs, estimates, FX) : null

  return { runEstimate, runProposal, previewPricing }
}
