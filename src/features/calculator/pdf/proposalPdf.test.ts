import { createElement } from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { describe, expect, it } from 'vitest'
import { FX } from '@/lib/config/currency'
import { computePricing } from '@/features/calculator/services/pricing/pricingEngine'
import type { CalculatorInputs, Proposal, SaleModality, ValueEstimates } from '@/features/calculator/types'
import { ProposalDocument } from './proposalPdf'

/**
 * ProposalDocument retorna un <Document>, pero su tipo de componente no coincide
 * con el ReactElement<DocumentProps> que pide renderToBuffer. El render real
 * funciona (lo prueban los asserts); el cast alinea sólo los tipos.
 */
type RenderArg = Parameters<typeof renderToBuffer>[0]
function docElement(props: Parameters<typeof ProposalDocument>[0]): RenderArg {
  return createElement(ProposalDocument, props) as unknown as RenderArg
}

const ESTIMATES: ValueEstimates = {
  nicheHourlyRateUsd: 15,
  hoursSavedPerMonth: 30,
  revenueEnabledPerMonthUsd: 200,
  monthlyApiCostUsd: 30,
  monthlyInfraCostUsd: 12,
  estimatedMaintenanceHoursPerMonth: 2,
  builderHourlyRateUsd: 35,
  confidence: 'medium',
  assumptions: ['Supuesto de prueba con acentos: configuración, agendación.'],
}

function inputsFor(saleModality: SaleModality): CalculatorInputs {
  return {
    projectDescription: 'Agente de WhatsApp que agenda citas para una clínica dental.',
    niche: 'dental',
    hoursInvested: 20,
    techStack: ['claude_api', 'n8n_selfhost', 'whatsapp_api'],
    clientRevenueSize: 'medium',
    saleModality,
  }
}

// Acentos y ñ a propósito: confirma que las fuentes estándar del PDF los aceptan.
const PROPOSAL: Proposal = {
  tiers: [
    { label: 'minimo', pitch: 'Cubre tu tiempo y costos sin morir en el intento.' },
    { label: 'recomendado', pitch: 'El punto justo entre valor y precio defendible.' },
    { label: 'premium', pitch: 'Para clientes grandes donde el ROI es altísimo.' },
  ],
  salesScript: {
    opening: 'Quiero mostrarte qué significa esto en plata.',
    valueFraming: 'Hoy pagas a una persona por agendar; esto lo hace solo.',
    priceReveal: 'La inversión recomendada es X al mes.',
    objectionHandling: [{ objection: 'Está caro.', response: 'Comparado con la hora-persona, se paga solo.' }],
  },
  roiSummary: {
    headline: 'Recupera 30 horas al mes de gestión de citas',
    bullets: [
      'Ahorras ~30 horas mensuales de agenda telefónica.',
      'Reduces inasistencias con recordatorios automáticos.',
      'Atiendes consultas fuera del horario de la recepción.',
    ],
    closingLine: 'Si te hace sentido, lo dejamos andando esta semana.',
  },
  contract: {
    setupIncludes: ['Configuración del agente', 'Conexión con tu WhatsApp'],
    retainerIncludes: ['Soporte mensual', 'Ajustes de guiones'],
    outOfScope: ['Integraciones nuevas no listadas'],
  },
}

describe('ProposalDocument → PDF', () => {
  it('renderiza un PDF válido para retainer mensual', async () => {
    const inputs = inputsFor('monthly_retainer')
    const pricing = computePricing(inputs, ESTIMATES, FX)
    const buf = await renderToBuffer(docElement({ pricing, proposal: PROPOSAL, inputs }))
    expect(buf.subarray(0, 5).toString('latin1')).toBe('%PDF-')
    expect(buf.length).toBeGreaterThan(1000)
  })

  it('renderiza un PDF válido para setup único (rama suffix vacío)', async () => {
    const inputs = inputsFor('one_time')
    const pricing = computePricing(inputs, ESTIMATES, FX)
    const buf = await renderToBuffer(docElement({ pricing, proposal: PROPOSAL, inputs }))
    expect(buf.subarray(0, 5).toString('latin1')).toBe('%PDF-')
    expect(buf.length).toBeGreaterThan(1000)
  })
})
