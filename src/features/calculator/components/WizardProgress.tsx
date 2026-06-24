'use client'

import { STEP_META } from '@/features/calculator/constants'

export function WizardProgress({ stepIndex }: { stepIndex: number }) {
  const total = STEP_META.length
  const pct = Math.round(((stepIndex + 1) / total) * 100)
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-500">
          Paso {stepIndex + 1} de {total}
        </span>
        <span className="font-medium text-teal-600">{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-teal-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
