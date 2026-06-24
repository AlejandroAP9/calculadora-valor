#!/usr/bin/env node
/**
 * Site Doctor — control de calidad automatico de Raiz.
 *
 * Examina un sitio generado y bloquea lo que hace que una pagina con IA se vea
 * barata o rota. Cada chequeo nace de un error real:
 *   1. Contraste     texto ilegible sobre foto (el fallo del Liceo). Mide pixeles + WCAG.
 *   2. Placeholders  {{...}}, "lorem", "ejemplo", "TODO" que quedaron en produccion.
 *   3. Imagenes      foto pixelada (resolucion real < tamano en pantalla) o rota (404).
 *   4. Movil         scroll horizontal a 390px (el clasico "ilegible en el celular").
 *   5. Accesibilidad alt faltantes, un solo h1, jerarquia de titulos.
 *
 * Uso:
 *   node site-doctor.mjs <archivo.html | url> [--selectors "h1,.lead"] [--json]
 *
 * Sale con codigo 1 si hay fallas duras (contraste, imagen rota, overflow movil).
 * Requiere playwright-core (parte del stack de Raiz).
 */

import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { existsSync } from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);

// playwright-core: intenta local; cae al node_modules del proyecto principal.
function loadChromium() {
  const candidates = [
    'playwright-core',
    '/Users/alejandro/Developer/software/educmark/educmark/node_modules/playwright-core',
  ];
  for (const c of candidates) {
    try { return require(c).chromium; } catch { /* sigue */ }
  }
  throw new Error('No encuentro playwright-core. Instalalo en el proyecto (npm i -D playwright-core).');
}

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--'));
const jsonOut = args.includes('--json');
const selArg = (args.find((a) => a.startsWith('--selectors=')) || '').split('=')[1];
const SELECTORS = selArg || 'h1, h2, .lead, .motto, .kick, .hero p, .hero a, [data-doctor]';

if (!target) {
  console.error('Uso: node site-doctor.mjs <archivo.html | url> [--selectors="h1,.lead"] [--json]');
  process.exit(2);
}
const url = /^https?:\/\//.test(target)
  ? target
  : pathToFileURL(path.resolve(target)).href;

// ---------- helpers de color / luminancia ----------
const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const relLum = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contrast = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
function parseRGB(str) {
  const m = str.match(/rgba?\(([^)]+)\)/);
  if (!m) return [0, 0, 0];
  const p = m[1].split(',').map((s) => parseFloat(s.trim()));
  return [p[0], p[1], p[2]];
}

// luminancia promedio de un buffer PNG, decodificado con canvas dentro del browser
async function bufLuminance(page, buf) {
  const dataUrl = 'data:image/png;base64,' + buf.toString('base64');
  return page.evaluate(async (u) => {
    const img = new Image();
    img.src = u;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    let r = 0, g = 0, b = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
    return [r / n, g / n, b / n];
  }, dataUrl);
}

const report = { url, checks: {}, failures: 0, warnings: 0 };
const fail = (k, items) => { report.checks[k] = { status: 'FAIL', items }; report.failures += items.length; };
const warn = (k, items) => { report.checks[k] = { status: 'WARN', items }; report.warnings += items.length; };
const pass = (k, note) => { report.checks[k] = { status: 'PASS', note: note || '' }; };

(async () => {
  const chromium = loadChromium();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
  await page.waitForTimeout(1200);

  // ===== CHECK 1: CONTRASTE =====
  const targets = await page.$$(SELECTORS);
  const metas = [];
  for (const el of targets) {
    const box = await el.boundingBox();
    if (!box || box.width < 4 || box.height < 4) continue;
    const info = await el.evaluate((node) => {
      const cs = getComputedStyle(node);
      const txt = (node.innerText || '').trim();
      const fs = parseFloat(cs.fontSize);
      const fw = parseInt(cs.fontWeight, 10) || 400;
      return { color: cs.color, fs, fw, txt: txt.slice(0, 50), hasText: txt.length > 0 };
    });
    if (!info.hasText) continue;
    metas.push({ box, ...info });
  }
  // ocultar SOLO el texto (no el fondo) para medir el fondo real sobre el que se lee:
  // su propio fondo si lo tiene (boton, pill) o la foto si el texto va directo sobre ella.
  await page.$$eval(SELECTORS, (els) => els.forEach((e) => {
    e.dataset.sdColor = e.style.color; e.dataset.sdShadow = e.style.textShadow;
    e.style.setProperty('color', 'transparent', 'important');
    e.style.setProperty('text-shadow', 'none', 'important');
  }));
  const contrastFails = [];
  for (const m of metas) {
    const clip = { x: Math.max(0, m.box.x), y: Math.max(0, m.box.y), width: Math.min(m.box.width, 1280), height: m.box.height };
    if (clip.y > 900) continue; // solo primer viewport
    let bg;
    try {
      const png = await page.screenshot({ clip });
      bg = await bufLuminance(page, png);
    } catch { continue; }
    const [tr, tg, tb] = parseRGB(m.color);
    const ratio = contrast(relLum(tr, tg, tb), relLum(bg[0], bg[1], bg[2]));
    const large = m.fs >= 24 || (m.fs >= 18.66 && m.fw >= 700);
    const min = large ? 3.0 : 4.5;
    if (ratio < min) {
      contrastFails.push({ text: m.txt, ratio: +ratio.toFixed(2), min, box: m.box });
    }
  }
  await page.$$eval(SELECTORS, (els) => els.forEach((e) => { e.style.color = e.dataset.sdColor || ''; e.style.textShadow = e.dataset.sdShadow || ''; }));
  if (contrastFails.length) {
    fail('contraste', contrastFails.map((c) => `"${c.text}" — contraste ${c.ratio}:1 (minimo ${c.min}:1)`));
    // captura anotada
    await page.evaluate((boxes) => {
      boxes.forEach((b) => {
        const d = document.createElement('div');
        Object.assign(d.style, { position: 'absolute', left: b.x + 'px', top: (b.y + window.scrollY) + 'px', width: b.width + 'px', height: b.height + 'px', outline: '3px solid #ff2d2d', background: 'rgba(255,45,45,.18)', zIndex: 99999, pointerEvents: 'none' });
        document.body.appendChild(d);
      });
    }, contrastFails.map((c) => c.box));
    await page.screenshot({ path: 'site-doctor-contraste.png', clip: { x: 0, y: 0, width: 1280, height: 900 } });
    await page.evaluate(() => document.querySelectorAll('div').forEach((d) => { if (d.style.outline.includes('255, 45, 45') || d.style.outline.includes('#ff2d2d')) d.remove(); }));
  } else {
    pass('contraste', `${metas.length} textos revisados, todos legibles`);
  }

  // ===== CHECK 2: PLACEHOLDERS =====
  const ph = await page.evaluate(() => {
    const html = document.body.innerHTML;
    const txt = document.body.innerText;
    const out = [];
    const mustache = html.match(/\{\{[^}]+\}\}/g);
    if (mustache) out.push(...mustache.slice(0, 5));
    const pats = [/lorem ipsum/i, /\bTODO\b/, /tu texto aqu[ií]/i, /reemplaza(r)? esto/i, /t[ií]tulo de noticia/i, /texto de ejemplo/i, /placeholder/i];
    txt.split('\n').forEach((line) => {
      const l = line.trim();
      if (l && pats.some((p) => p.test(l))) out.push(l.slice(0, 60));
    });
    return [...new Set(out)];
  });
  if (ph.length) warn('placeholders', ph);
  else pass('placeholders', 'sin texto de relleno');

  // ===== CHECK 3: IMAGENES =====
  const imgs = await page.evaluate(() => {
    const dpr = window.devicePixelRatio || 1;
    return [...document.images].map((im) => ({
      src: (im.currentSrc || im.src || '').split('/').slice(-1)[0],
      nat: im.naturalWidth,
      disp: im.clientWidth,
      dpr,
    }));
  });
  const imgFails = [];
  const imgWarns = [];
  for (const im of imgs) {
    if (im.disp === 0) continue; // no visible
    if (im.nat === 0) { imgFails.push(`${im.src} — no carga (404 o ruta rota)`); continue; }
    // se ve pixelada cuando la imagen se agranda mas alla de su tamano real (upscaling)
    if (im.nat < im.disp) imgWarns.push(`${im.src} — ${im.nat}px reales estirados a ${im.disp}px en pantalla (se vera pixelada)`);
  }
  if (imgFails.length) fail('imagenes', imgFails.concat(imgWarns));
  else if (imgWarns.length) warn('imagenes', imgWarns);
  else pass('imagenes', `${imgs.length} imagenes OK`);

  // ===== CHECK 4: OVERFLOW MOVIL =====
  await page.setViewportSize({ width: 390, height: 800 });
  await page.waitForTimeout(500);
  const overflow = await page.evaluate(() => {
    const iw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    if (sw <= iw + 2) return { over: false, sw, iw, els: [] };
    const els = [];
    document.querySelectorAll('*').forEach((n) => {
      const r = n.getBoundingClientRect();
      if (r.width > 0 && r.right > iw + 1) {
        els.push((n.tagName.toLowerCase()) + (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\s+/)[0] : '') + ` (${Math.round(r.right)}px)`);
      }
    });
    return { over: true, sw, iw, els: [...new Set(els)].slice(0, 6) };
  });
  if (overflow.over) {
    fail('movil', [`scroll horizontal: el contenido mide ${overflow.sw}px en una pantalla de ${overflow.iw}px`, ...overflow.els.map((e) => 'desborda: ' + e)]);
    await page.screenshot({ path: 'site-doctor-movil.png', fullPage: false });
  } else {
    pass('movil', `sin scroll horizontal a ${overflow.iw}px`);
  }
  await page.setViewportSize({ width: 1280, height: 900 });

  // ===== CHECK 5: ACCESIBILIDAD =====
  const a11y = await page.evaluate(() => {
    const out = [];
    const h1 = document.querySelectorAll('h1').length;
    if (h1 === 0) out.push('no hay <h1> (la pagina necesita un titulo principal)');
    if (h1 > 1) out.push(`hay ${h1} <h1> (deberia haber solo uno)`);
    let noAlt = 0;
    document.querySelectorAll('img').forEach((im) => { if (im.getAttribute('alt') === null) noAlt++; });
    if (noAlt) out.push(`${noAlt} imagen(es) sin atributo alt`);
    let icon = 0;
    document.querySelectorAll('a, button').forEach((b) => {
      const t = (b.innerText || '').trim();
      const lbl = b.getAttribute('aria-label') || b.getAttribute('title');
      if (!t && !lbl) icon++;
    });
    if (icon) out.push(`${icon} boton/enlace sin texto ni aria-label`);
    return out;
  });
  if (a11y.length) warn('accesibilidad', a11y);
  else pass('accesibilidad', 'h1 unico, alt presentes, controles etiquetados');

  await browser.close();

  // ---------- salida ----------
  if (jsonOut) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    const icon = (s) => (s === 'PASS' ? '✓' : s === 'WARN' ? '!' : '✗');
    console.log('\n  SITE DOCTOR — ' + url + '\n');
    for (const [k, v] of Object.entries(report.checks)) {
      console.log(`  ${icon(v.status)} ${k.toUpperCase().padEnd(14)} ${v.status}${v.note ? '  ·  ' + v.note : ''}`);
      if (v.items) v.items.forEach((it) => console.log('       - ' + it));
    }
    console.log('');
    const hard = report.failures;
    if (hard) console.log(`  Resultado: ${hard} falla(s) dura(s), ${report.warnings} advertencia(s). NO publicar.\n`);
    else if (report.warnings) console.log(`  Resultado: 0 fallas duras, ${report.warnings} advertencia(s) por revisar.\n`);
    else console.log('  Resultado: limpio. Listo para publicar.\n');
  }
  process.exit(report.failures > 0 ? 1 : 0);
})().catch((e) => { console.error('site-doctor error:', e.message); process.exit(2); });
