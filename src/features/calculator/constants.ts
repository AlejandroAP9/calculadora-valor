import type { RevenueSize, SaleModality } from '@/features/calculator/types'

/** Sugerencias de nicho (el usuario puede escribir el suyo). */
export const NICHE_SUGGESTIONS = [
  'Clínica dental',
  'Inmobiliaria',
  'E-commerce',
  'Agencia de marketing',
  'Restaurante',
  'Estudio legal',
  'Contabilidad',
  'Agencia de viajes',
  'SaaS / Tech',
  'Educación',
]

/** Sugerencias de stack (multiselección + escribir libre). */
export const STACK_SUGGESTIONS = [
  'Claude API',
  'OpenAI API',
  'n8n',
  'GoHighLevel',
  'WhatsApp API',
  'VPS',
  'Supabase',
  'Vercel',
  'Twilio',
  'Make',
]

export const REVENUE_SIZE_OPTIONS: { value: RevenueSize; title: string; desc: string }[] = [
  { value: 'small', title: 'Pequeño', desc: 'Negocio local, emprendedor, freelancer.' },
  { value: 'medium', title: 'Mediano', desc: 'PyME consolidada, varios empleados.' },
  { value: 'large', title: 'Grande', desc: 'Empresa con facturación alta y procesos.' },
]

export const SALE_MODALITY_OPTIONS: { value: SaleModality; title: string; desc: string }[] = [
  { value: 'one_time', title: 'Setup único', desc: 'Un pago por construir y entregar.' },
  {
    value: 'monthly_retainer',
    title: 'Retainer mensual',
    desc: 'Cuota fija mes a mes por operar y mantener.',
  },
  { value: 'outcome_based', title: 'Por resultado', desc: 'Cobras según el valor que generas.' },
]

export const STEP_META = [
  { field: 'projectDescription', title: '¿Qué construiste?', kicker: 'Cuéntame el proyecto' },
  { field: 'niche', title: '¿Para qué industria?', kicker: 'El cliente final' },
  { field: 'hoursInvested', title: '¿Cuántas horas te tomó?', kicker: 'Tu inversión' },
  { field: 'techStack', title: '¿Qué stack usaste?', kicker: 'Las herramientas' },
  { field: 'clientRevenueSize', title: '¿Tamaño del cliente?', kicker: 'Su facturación' },
  { field: 'saleModality', title: '¿Cómo quieres vender?', kicker: 'La modalidad' },
] as const
