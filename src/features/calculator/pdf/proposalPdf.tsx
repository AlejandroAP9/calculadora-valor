/**
 * Genera la Propuesta de Valor en PDF (vectorial, texto seleccionable) con
 * @react-pdf/renderer. Documento orientado al CLIENTE: ROI + precios + contrato.
 * El script de venta queda fuera (es interno del builder).
 *
 * Este módulo se importa de forma DINÁMICA desde el handler del botón, para que
 * @react-pdf/renderer nunca entre al bundle inicial de la página.
 *
 * Las cifras en EUR se escriben como "1.234 EUR" (sin el glifo €) para ser
 * 100% portables entre las fuentes estándar del PDF.
 */
import { Document, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer'
import type { CalculatorInputs, PricingResult, Proposal } from '@/features/calculator/types'

const TEAL = '#0d9488'
const INK = '#18181b'
const MUTE = '#71717a'
const LINE = '#e4e4e7'
const SOFT = '#f4f4f5'

const usdFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const eurFmt = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 })
const usd = (n: number) => `$${usdFmt.format(Math.round(n))}`
const eur = (n: number) => `${eurFmt.format(Math.round(n))} EUR`

const TIER_LABEL: Record<string, string> = {
  minimo: 'Mínimo',
  recomendado: 'Recomendado',
  premium: 'Premium',
}

const styles = StyleSheet.create({
  // paddingBottom amplio: reserva espacio para el footer fijo y evita que el
  // contenido se solape con él al final de cada página.
  page: { paddingTop: 44, paddingBottom: 72, paddingHorizontal: 48, fontSize: 10, color: INK, lineHeight: 1.5 },
  kicker: { fontSize: 8, color: TEAL, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'Helvetica-Bold' },
  h1: { fontSize: 20, fontFamily: 'Helvetica-Bold', marginTop: 6 },
  sub: { color: MUTE, marginTop: 4 },
  divider: { borderBottomWidth: 1, borderBottomColor: LINE, marginVertical: 16 },
  sectionTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 8 },
  bulletRow: { flexDirection: 'row', marginBottom: 5 },
  dot: { color: TEAL, marginRight: 6, fontFamily: 'Helvetica-Bold' },
  box: { backgroundColor: SOFT, borderRadius: 6, padding: 14, flexDirection: 'row', marginTop: 10 },
  boxCol: { flex: 1 },
  boxLabel: { color: MUTE, fontSize: 9 },
  boxValBig: { fontSize: 15, fontFamily: 'Helvetica-Bold', marginTop: 2 },
  boxValTeal: { fontSize: 15, fontFamily: 'Helvetica-Bold', marginTop: 2, color: TEAL },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: LINE, paddingBottom: 5 },
  row: { flexDirection: 'row', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: LINE },
  rowRec: { flexDirection: 'row', paddingVertical: 7, backgroundColor: '#f0fdfa', borderBottomWidth: 1, borderBottomColor: LINE },
  cTier: { width: '34%', fontFamily: 'Helvetica-Bold' },
  cNum: { width: '33%', textAlign: 'right' },
  cHead: { fontSize: 8, color: MUTE, textTransform: 'uppercase', letterSpacing: 0.5 },
  small: { fontSize: 9, color: MUTE },
  contractCol: { flex: 1, paddingRight: 10 },
  contractTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 5 },
  footer: { position: 'absolute', bottom: 28, left: 48, right: 48, fontSize: 8, color: MUTE, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 8 },
})

/** Exportado para test de render; en runtime se usa vía downloadProposalPdf. */
export function ProposalDocument({
  pricing,
  proposal,
  inputs,
}: {
  pricing: PricingResult
  proposal: Proposal
  inputs: Partial<CalculatorInputs>
}) {
  const isOneTime = pricing.saleModality === 'one_time'
  const rec = pricing.tiers[1]
  const recHead = isOneTime ? rec.setup : rec.monthly
  const suffix = isOneTime ? '' : '/mes'

  return (
    <Document title="Propuesta de Valor">
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <Text style={styles.kicker}>Propuesta de Valor</Text>
        <Text style={styles.h1}>{proposal.roiSummary.headline}</Text>
        {inputs.niche ? <Text style={styles.sub}>Para: {inputs.niche}</Text> : null}

        <View style={styles.divider} />

        {/* ROI */}
        <Text style={styles.sectionTitle}>Lo que esta solución hace por ti</Text>
        {proposal.roiSummary.bullets.map((b, i) => (
          <View key={i} style={styles.bulletRow}>
            <Text style={styles.dot}>•</Text>
            <Text style={{ flex: 1 }}>{b}</Text>
          </View>
        ))}
        <View style={styles.box}>
          <View style={styles.boxCol}>
            <Text style={styles.boxLabel}>Valor generado al mes</Text>
            <Text style={styles.boxValBig}>{usd(pricing.monthlyValue.totalMonthlyValueUsd)}</Text>
          </View>
          <View style={styles.boxCol}>
            <Text style={styles.boxLabel}>Inversión recomendada</Text>
            <Text style={styles.boxValTeal}>
              {usd(recHead.usd)}
              {suffix} · {eur(recHead.eur)}
              {suffix}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Precios */}
        <Text style={styles.sectionTitle}>Opciones de inversión</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.cTier, styles.cHead]}>Plan</Text>
          <Text style={[styles.cNum, styles.cHead]}>Setup único</Text>
          <Text style={[styles.cNum, styles.cHead]}>Mensual</Text>
        </View>
        {pricing.tiers.map((t) => (
          <View key={t.label} style={t.label === 'recomendado' ? styles.rowRec : styles.row}>
            <Text style={styles.cTier}>
              {TIER_LABEL[t.label]}
              {t.label === 'recomendado' ? '  (sugerido)' : ''}
            </Text>
            <Text style={styles.cNum}>
              {usd(t.setup.usd)}
              {'\n'}
              <Text style={styles.small}>{eur(t.setup.eur)}</Text>
            </Text>
            <Text style={styles.cNum}>
              {usd(t.monthly.usd)}/mes{'\n'}
              <Text style={styles.small}>{eur(t.monthly.eur)}/mes</Text>
            </Text>
          </View>
        ))}
        <Text style={[styles.small, { marginTop: 8 }]}>{pricing.multiplierRationale}</Text>

        <View style={styles.divider} />

        {/* Contrato — wrap=false: la sección no se parte a media lista entre páginas. */}
        <View wrap={false}>
          <Text style={styles.sectionTitle}>Qué incluye</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.contractCol}>
              <Text style={styles.contractTitle}>Setup</Text>
              {proposal.contract.setupIncludes.map((it, i) => (
                <Text key={i} style={{ marginBottom: 3 }}>• {it}</Text>
              ))}
            </View>
            <View style={styles.contractCol}>
              <Text style={styles.contractTitle}>Retainer mensual</Text>
              {proposal.contract.retainerIncludes.map((it, i) => (
                <Text key={i} style={{ marginBottom: 3 }}>• {it}</Text>
              ))}
            </View>
            <View style={styles.contractCol}>
              <Text style={styles.contractTitle}>Fuera de alcance</Text>
              {proposal.contract.outOfScope.map((it, i) => (
                <Text key={i} style={{ marginBottom: 3, color: MUTE }}>× {it}</Text>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.footer} fixed>
          {proposal.roiSummary.closingLine} · Cifras en USD y EUR (1 USD = {pricing.fxRate} EUR).
        </Text>
      </Page>
    </Document>
  )
}

/** Construye el PDF y dispara la descarga en el navegador. */
export async function downloadProposalPdf(
  pricing: PricingResult,
  proposal: Proposal,
  inputs: Partial<CalculatorInputs>,
): Promise<void> {
  const blob = await pdf(<ProposalDocument pricing={pricing} proposal={proposal} inputs={inputs} />).toBlob()
  const slug = (inputs.niche ?? 'cliente').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `propuesta-${slug || 'valor'}.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
