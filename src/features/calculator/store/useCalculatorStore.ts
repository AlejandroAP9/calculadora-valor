import { create } from 'zustand'
import type {
  CalculatorInputs,
  PricingResult,
  Proposal,
  ValueEstimates,
} from '@/features/calculator/types'

export type Phase = 'intake' | 'estimating' | 'review' | 'computing' | 'result'

/** Orden de los pasos del wizard; cada uno mapea a un campo de CalculatorInputs. */
export const WIZARD_FIELDS = [
  'projectDescription',
  'niche',
  'hoursInvested',
  'techStack',
  'clientRevenueSize',
  'saleModality',
] as const

const REQUIRED_FIELDS: (keyof CalculatorInputs)[] = [...WIZARD_FIELDS]

interface CalculatorState {
  phase: Phase
  stepIndex: number
  inputs: Partial<CalculatorInputs>
  estimates: ValueEstimates | null
  estimatesEdited: boolean
  usedFallback: boolean
  result: PricingResult | null
  proposal: Proposal | null
  proposalError: boolean

  setField: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (index: number) => void
  isIntakeComplete: () => boolean

  setPhase: (phase: Phase) => void
  setEstimates: (estimates: ValueEstimates, usedFallback: boolean) => void
  patchEstimate: <K extends keyof ValueEstimates>(key: K, value: ValueEstimates[K]) => void
  setResult: (result: PricingResult, proposal: Proposal | null, proposalError: boolean) => void
  reset: () => void
}

const INITIAL: Pick<
  CalculatorState,
  | 'phase'
  | 'stepIndex'
  | 'inputs'
  | 'estimates'
  | 'estimatesEdited'
  | 'usedFallback'
  | 'result'
  | 'proposal'
  | 'proposalError'
> = {
  phase: 'intake',
  stepIndex: 0,
  inputs: { techStack: [] },
  estimates: null,
  estimatesEdited: false,
  usedFallback: false,
  result: null,
  proposal: null,
  proposalError: false,
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  ...INITIAL,

  setField: (key, value) => set((s) => ({ inputs: { ...s.inputs, [key]: value } })),

  nextStep: () =>
    set((s) => ({ stepIndex: Math.min(s.stepIndex + 1, WIZARD_FIELDS.length - 1) })),
  prevStep: () => set((s) => ({ stepIndex: Math.max(s.stepIndex - 1, 0) })),
  goToStep: (index) =>
    set({ stepIndex: Math.max(0, Math.min(index, WIZARD_FIELDS.length - 1)) }),

  isIntakeComplete: () => {
    const { inputs } = get()
    return REQUIRED_FIELDS.every((field) => {
      const value = inputs[field]
      if (field === 'techStack') return Array.isArray(value) && value.length > 0
      if (field === 'hoursInvested') return typeof value === 'number' && value > 0
      return value !== undefined && value !== null && String(value).trim().length > 0
    })
  },

  setPhase: (phase) => set({ phase }),
  setEstimates: (estimates, usedFallback) =>
    set({ estimates, usedFallback, estimatesEdited: false }),
  patchEstimate: (key, value) =>
    set((s) =>
      s.estimates
        ? { estimates: { ...s.estimates, [key]: value }, estimatesEdited: true }
        : {},
    ),
  setResult: (result, proposal, proposalError) =>
    set({ result, proposal, proposalError, phase: 'result' }),

  reset: () => set({ ...INITIAL, inputs: { techStack: [] } }),
}))
