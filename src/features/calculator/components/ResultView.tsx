'use client'

import { useState } from 'react'
import { usePricing } from '@/features/calculator/hooks/usePricing'
import { useCalculatorStore } from '@/features/calculator/store/useCalculatorStore'
import { ContractStructure } from './ContractStructure'
import { PriceTiers } from './PriceTiers'
import { RoiSummary } from './RoiSummary'
import { SalesScript } from './SalesScript'
import { Button } from './ui'

type Tab = 'precios' | 'script' | 'roi' | 'contrato'

const TABS: { id: Tab; label: string }[] = [
  { id: 'precios', label: 'Precios' },
  { id: 'script', label: 'Script de venta' },
  { id: 'roi', label: 'Resumen ROI' },
  { id: 'contrato', label: 'Contrato' },
]

export function ResultView() {
  const result = useCalculatorStore((s) => s.result)
  const proposal = useCalculatorStore((s) => s.proposal)
  const proposalError = useCalculatorStore((s) => s.proposalError)
  const inputs = useCalculatorStore((s) => s.inputs)
  const reset = useCalculatorStore((s) => s.reset)
  const { runProposal } = usePricing()
  const [tab, setTab] = useState<Tab>('precios')
  const [pdfState, setPdfState] = useState<'idle' | 'loading' | 'error'>('idle')

  if (!result) return null

  // Genera el PDF de un clic. @react-pdf/renderer se importa aquí (dinámico) para
  // no cargarlo en el bundle inicial de la página.
  const handleDownloadPdf = async () => {
    if (!proposal) return
    setPdfState('loading')
    try {
      const { downloadProposalPdf } = await import('@/features/calculator/pdf/proposalPdf')
      await downloadProposalPdf(result, proposal, inputs)
      setPdfState('idle')
    } catch (e) {
      console.error('[pdf] no se pudo generar:', e)
      setPdfState('error')
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="no-print mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Tu propuesta está lista</h2>
          <p className="text-sm text-zinc-500">Precios defendibles, en lenguaje de negocio.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={!proposal || pdfState === 'loading'}
          >
            {pdfState === 'loading'
              ? 'Generando…'
              : pdfState === 'error'
                ? 'Reintentar PDF'
                : 'Descargar PDF'}
          </Button>
          <Button variant="ghost" onClick={reset}>
            Empezar de nuevo
          </Button>
        </div>
      </div>

      {proposalError && (
        <div className="no-print mb-5 flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span>
            El precio está calculado, pero la redacción de la propuesta (script, ROI, contrato) no
            se generó. Suele faltar la OpenRouter API key.
          </span>
          <Button variant="outline" onClick={() => runProposal()} className="shrink-0">
            Reintentar
          </Button>
        </div>
      )}

      <div className="no-print mb-6 flex flex-wrap gap-1 rounded-xl bg-zinc-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {tab === 'precios' && <PriceTiers result={result} proposal={proposal} />}
        {tab === 'script' &&
          (proposal ? (
            <SalesScript script={proposal.salesScript} />
          ) : (
            <NoProsa onRetry={() => runProposal()} />
          ))}
        {tab === 'roi' &&
          (proposal ? (
            <RoiSummary roi={proposal.roiSummary} result={result} />
          ) : (
            <NoProsa onRetry={() => runProposal()} />
          ))}
        {tab === 'contrato' &&
          (proposal ? (
            <ContractStructure contract={proposal.contract} />
          ) : (
            <NoProsa onRetry={() => runProposal()} />
          ))}
      </div>
    </div>
  )
}

function NoProsa({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
      <p className="text-zinc-600">
        Esta sección necesita la redacción de la IA, que aún no se generó.
      </p>
      <Button variant="outline" onClick={onRetry} className="mt-4">
        Generar ahora
      </Button>
    </div>
  )
}
