/**
 * Smoke test e2e del flujo completo: landing → wizard → estimados → propuesta.
 * Requiere el dev server corriendo (npm run dev) y chromium instalado
 * (npx playwright install chromium). Uso: node e2e/smoke.mjs
 *
 * Funciona con o sin OPENROUTER_API_KEY: sin key, los estimados caen a tablas y
 * la propuesta marca proposalError; el flujo y los precios igual se renderizan.
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const log = (...a) => console.log('[e2e]', ...a)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()))

try {
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await page.goto(`${BASE}/calculadora`, { waitUntil: 'networkidle' })

  await page.fill('textarea', 'Agente de WhatsApp que agenda citas y guarda los leads de una clínica dental.')
  await page.click('button:has-text("Siguiente")')
  await page.click('button:has-text("Clínica dental")')
  await page.click('button:has-text("Siguiente")')
  await page.fill('input[type="number"]', '25')
  await page.click('button:has-text("Siguiente")')
  await page.click('button:has-text("Claude API")')
  await page.click('button:has-text("WhatsApp API")')
  await page.click('button:has-text("Siguiente")')
  await page.click('button:has-text("Pequeño")')
  await page.click('button:has-text("Siguiente")')
  await page.click('button:has-text("Retainer mensual")')
  await page.click('button:has-text("Calcular valor")')

  await page.waitForSelector('text=Ajusta lo que conozcas mejor', { timeout: 30000 })
  await page.click('button:has-text("Generar propuesta")')
  await page.waitForSelector('text=Tu propuesta está lista', { timeout: 90000 })

  const bodyText = await page.textContent('body')
  if (!/\$\d/.test(bodyText)) throw new Error('No se renderizó ningún precio en USD')
  if (errors.length) throw new Error('Errores en consola: ' + errors.join(' | '))

  log('OK: flujo completo sin errores, precios renderizados')
} catch (e) {
  log('FAIL:', e.message)
  process.exitCode = 1
} finally {
  await browser.close()
}
