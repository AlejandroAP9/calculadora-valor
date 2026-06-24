'use client'

import { useState } from 'react'
import {
  NICHE_SUGGESTIONS,
  REVENUE_SIZE_OPTIONS,
  SALE_MODALITY_OPTIONS,
  STACK_SUGGESTIONS,
  STEP_META,
} from '@/features/calculator/constants'
import { useCalculatorStore } from '@/features/calculator/store/useCalculatorStore'
import { Chip, OptionCard, StepShell } from './ui'

const inputClass =
  'w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500'

export function WizardSteps({ stepIndex }: { stepIndex: number }) {
  const inputs = useCalculatorStore((s) => s.inputs)
  const setField = useCalculatorStore((s) => s.setField)
  const meta = STEP_META[stepIndex]

  return (
    <StepShell kicker={meta.kicker} title={meta.title}>
      {meta.field === 'projectDescription' && (
        <textarea
          autoFocus
          rows={5}
          className={inputClass}
          placeholder="Ej: Un agente de WhatsApp que agenda citas y guarda los leads de una clínica dental, conectado a su calendario."
          value={inputs.projectDescription ?? ''}
          onChange={(e) => setField('projectDescription', e.target.value)}
        />
      )}

      {meta.field === 'niche' && <NicheStep inputClass={inputClass} />}

      {meta.field === 'hoursInvested' && (
        <div>
          <input
            autoFocus
            type="number"
            min={1}
            className={`${inputClass} max-w-xs`}
            placeholder="Ej: 25"
            value={inputs.hoursInvested ?? ''}
            onChange={(e) =>
              setField('hoursInvested', e.target.value === '' ? (undefined as never) : Number(e.target.value))
            }
          />
          <p className="mt-2 text-sm text-zinc-500">
            Horas reales de construcción. Sé honesto: es el piso para cubrir tu tiempo.
          </p>
        </div>
      )}

      {meta.field === 'techStack' && <StackStep inputClass={inputClass} />}

      {meta.field === 'clientRevenueSize' && (
        <div className="grid gap-3 sm:grid-cols-3">
          {REVENUE_SIZE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              title={opt.title}
              desc={opt.desc}
              selected={inputs.clientRevenueSize === opt.value}
              onClick={() => setField('clientRevenueSize', opt.value)}
            />
          ))}
        </div>
      )}

      {meta.field === 'saleModality' && (
        <div className="grid gap-3 sm:grid-cols-3">
          {SALE_MODALITY_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              title={opt.title}
              desc={opt.desc}
              selected={inputs.saleModality === opt.value}
              onClick={() => setField('saleModality', opt.value)}
            />
          ))}
        </div>
      )}
    </StepShell>
  )
}

function NicheStep({ inputClass }: { inputClass: string }) {
  const niche = useCalculatorStore((s) => s.inputs.niche)
  const setField = useCalculatorStore((s) => s.setField)
  return (
    <div>
      <input
        autoFocus
        className={inputClass}
        placeholder="Ej: Clínica dental"
        value={niche ?? ''}
        onChange={(e) => setField('niche', e.target.value)}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        {NICHE_SUGGESTIONS.map((s) => (
          <Chip key={s} label={s} active={niche === s} onClick={() => setField('niche', s)} />
        ))}
      </div>
    </div>
  )
}

function StackStep({ inputClass }: { inputClass: string }) {
  const techStack = useCalculatorStore((s) => s.inputs.techStack) ?? []
  const setField = useCalculatorStore((s) => s.setField)
  const [custom, setCustom] = useState('')

  const toggle = (item: string) => {
    const next = techStack.includes(item)
      ? techStack.filter((t) => t !== item)
      : [...techStack, item]
    setField('techStack', next)
  }

  const addCustom = () => {
    const trimmed = custom.trim()
    if (trimmed && !techStack.includes(trimmed)) {
      setField('techStack', [...techStack, trimmed])
    }
    setCustom('')
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {[...new Set([...STACK_SUGGESTIONS, ...techStack])].map((item) => (
          <Chip key={item} label={item} active={techStack.includes(item)} onClick={() => toggle(item)} />
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          className={`${inputClass} flex-1`}
          placeholder="Agregar otra herramienta…"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addCustom()
            }
          }}
        />
        <button
          type="button"
          onClick={addCustom}
          className="rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          Agregar
        </button>
      </div>
    </div>
  )
}
