'use client'

import { useEffect, useState } from 'react'
import { WIZARD_FIELDS, useCalculatorStore } from '@/features/calculator/store/useCalculatorStore'
import { useApiKeyStore } from '@/features/calculator/store/useApiKeyStore'
import type { CalculatorInputs } from '@/features/calculator/types'
import { usePricing } from '@/features/calculator/hooks/usePricing'
import { ApiKeyField } from './ApiKeyField'
import { EstimatesReview } from './EstimatesReview'
import { ResultView } from './ResultView'
import { WizardProgress } from './WizardProgress'
import { WizardSteps } from './WizardSteps'
import { Button } from './ui'

/** Valida el campo del paso actual para habilitar "Siguiente". */
function canAdvance(field: (typeof WIZARD_FIELDS)[number], inputs: Partial<CalculatorInputs>): boolean {
  switch (field) {
    case 'projectDescription':
      return (inputs.projectDescription ?? '').trim().length >= 10
    case 'niche':
      return (inputs.niche ?? '').trim().length >= 2
    case 'hoursInvested':
      return typeof inputs.hoursInvested === 'number' && inputs.hoursInvested > 0
    case 'techStack':
      return Array.isArray(inputs.techStack) && inputs.techStack.length > 0
    case 'clientRevenueSize':
      return Boolean(inputs.clientRevenueSize)
    case 'saleModality':
      return Boolean(inputs.saleModality)
    default:
      return false
  }
}

export function CalculatorWizard() {
  const phase = useCalculatorStore((s) => s.phase)
  const stepIndex = useCalculatorStore((s) => s.stepIndex)
  const inputs = useCalculatorStore((s) => s.inputs)
  const nextStep = useCalculatorStore((s) => s.nextStep)
  const prevStep = useCalculatorStore((s) => s.prevStep)
  const apiKey = useApiKeyStore((s) => s.apiKey)
  const { runEstimate } = usePricing()

  // La key viene de localStorage (persist); leerla sólo tras montar evita un
  // mismatch de hidratación en el atributo disabled del botón.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const hasKey = mounted && apiKey.trim().length > 0

  if (phase === 'estimating') {
    return <Loading label="Analizando tu proyecto y estimando el valor de mercado…" />
  }
  if (phase === 'computing') {
    return <Loading label="Calculando tu precio y redactando la propuesta…" />
  }
  if (phase === 'review') {
    return <EstimatesReview />
  }
  if (phase === 'result') {
    return <ResultView />
  }

  // phase === 'intake'
  const isLast = stepIndex === WIZARD_FIELDS.length - 1
  const ready = canAdvance(WIZARD_FIELDS[stepIndex], inputs)

  return (
    <div className="mx-auto w-full max-w-2xl">
      <WizardProgress stepIndex={stepIndex} />
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <WizardSteps stepIndex={stepIndex} />
        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" onClick={prevStep} disabled={stepIndex === 0}>
            ← Atrás
          </Button>
          {isLast ? (
            <Button onClick={() => runEstimate()} disabled={!ready || !hasKey}>
              Calcular valor →
            </Button>
          ) : (
            <Button onClick={nextStep} disabled={!ready}>
              Siguiente →
            </Button>
          )}
        </div>
      </div>
      <ApiKeyField />
      {isLast && ready && !hasKey ? (
        <p className="mx-auto mt-2 w-full max-w-2xl text-center text-sm text-amber-600">
          Pega tu API key de OpenRouter arriba para calcular tu precio.
        </p>
      ) : null}
    </div>
  )
}

function Loading({ label }: { label: string }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 py-20 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-teal-600" />
      <p className="text-zinc-600">{label}</p>
    </div>
  )
}
