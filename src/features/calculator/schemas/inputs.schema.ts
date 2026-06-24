import { z } from 'zod'

export const RevenueSizeSchema = z.enum(['small', 'medium', 'large'])
export const SaleModalitySchema = z.enum(['one_time', 'monthly_retainer', 'outcome_based'])

/** Los 6 inputs que recoge el wizard. Fuente de verdad del tipo CalculatorInputs. */
export const CalculatorInputsSchema = z.object({
  projectDescription: z
    .string()
    .min(10)
    .max(2000)
    .describe('Qué construyó el usuario, en sus palabras (texto libre)'),
  niche: z.string().min(2).max(80).describe('Nicho o industria del cliente final (ej: clínica dental)'),
  hoursInvested: z.number().positive().describe('Horas que el usuario invirtió en construirlo'),
  techStack: z
    .array(z.string().min(1).max(60))
    .max(20)
    .describe('Tecnologías usadas: Claude API, n8n, GHL, VPS, WhatsApp API, etc.'),
  clientRevenueSize: RevenueSizeSchema.describe('Tamaño de facturación del cliente'),
  saleModality: SaleModalitySchema.describe('Modalidad de venta'),
})

/** Versión parcial para validar el wizard paso a paso. */
export const PartialCalculatorInputsSchema = CalculatorInputsSchema.partial()
