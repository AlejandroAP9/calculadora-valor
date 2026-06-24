import { z } from 'zod'

/**
 * Salida de PROSA de la IA. NO contiene cifras de precio: los números vienen del
 * motor determinista y se inyectan en la UI. La IA solo redacta lenguaje de
 * negocio alrededor de números que ya están calculados.
 */

const TierCopySchema = z.object({
  label: z.enum(['minimo', 'recomendado', 'premium']),
  pitch: z.string().describe('Una frase de venta para este tramo, en lenguaje de negocio'),
})

const ObjectionSchema = z.object({
  objection: z.string().describe('Objeción típica del cliente sobre el precio'),
  response: z.string().describe('Respuesta breve que reencuadra hacia el valor'),
})

export const ProposalSchema = z.object({
  // Sin .length(3): algunos proveedores (Bedrock vía OpenRouter) rechazan minItems
  // distinto de 0/1. El conteo se pide en el prompt y la UI mapea por `label`.
  tiers: z
    .array(TierCopySchema)
    .describe('Una frase de venta por cada tramo: minimo, recomendado y premium (3 en total)'),
  salesScript: z.object({
    opening: z.string().describe('Cómo abrir la conversación de precio'),
    valueFraming: z.string().describe('Traduce lo técnico a impacto económico para el cliente'),
    priceReveal: z.string().describe('Cómo presentar el precio recomendado sin titubear'),
    objectionHandling: z.array(ObjectionSchema).describe('Objeciones típicas y sus respuestas'),
  }),
  roiSummary: z.object({
    headline: z.string().describe('Titular de una línea con el ROI para el cliente'),
    bullets: z.array(z.string()).describe('3 a 5 bullets con números reales para el cliente'),
    closingLine: z.string().describe('Frase de cierre que invita a avanzar'),
  }),
  contract: z.object({
    setupIncludes: z.array(z.string()).describe('Qué cubre el setup único'),
    retainerIncludes: z.array(z.string()).describe('Qué cubre el retainer mensual'),
    outOfScope: z.array(z.string()).describe('Qué queda fuera de alcance / es extra'),
  }),
})
