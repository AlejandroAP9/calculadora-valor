// palette.mjs — del hex de marca a una rampa 50-950 accesible (OKLCH, sin dependencias)
// Uso:  node palette.mjs "#E3B23C"
// Imprime cada paso con su hex, el on-color (texto legible encima) y el contraste WCAG.
//
// OKLCH mantiene el tono constante y varía sólo la luminosidad: rampa perceptualmente
// pareja. El contraste es número real (luminancia relativa WCAG), no impresión.

const seed = process.argv[2] || "#2563EB";

const srgbToLin = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linToSrgb = c => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const hexToRgb = h => { h = h.replace("#", ""); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255); };
const clamp = x => Math.min(1, Math.max(0, x));
const rgbToHex = ([r, g, b]) => "#" + [r, g, b].map(c => Math.round(clamp(c) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();

function hexToOklch(hex) {
  let [r, g, b] = hexToRgb(hex).map(srgbToLin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(A, B), H: Math.atan2(B, A) };
}
function oklchToHex(L, C, H) {
  const A = C * Math.cos(H), B = C * Math.sin(H);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return rgbToHex([
    linToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]);
}
// luminancia relativa + contraste WCAG
const relLum = hex => { const [r, g, b] = hexToRgb(hex).map(srgbToLin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [relLum(a) + 0.05, relLum(b) + 0.05]; return (Math.max(x, y) / Math.min(x, y)).toFixed(2); };
const onColor = hex => (contrast(hex, "#FFFFFF") >= contrast(hex, "#0A0A0A") ? "#FFFFFF" : "#0A0A0A");

const { C, H } = hexToOklch(seed);
const steps = { 50: 0.97, 100: 0.94, 200: 0.87, 300: 0.78, 400: 0.68, 500: 0.58, 600: 0.50, 700: 0.42, 800: 0.34, 900: 0.27, 950: 0.20 };
console.log(`seed ${seed}`);
console.log("paso  hex       on-color  contraste");
for (const [k, L] of Object.entries(steps)) {
  const c = C * (L > 0.9 || L < 0.3 ? 0.6 : 1);   // baja croma en extremos para que no chille
  const hex = oklchToHex(L, c, H);
  const on = onColor(hex);
  console.log(`${k.padStart(4)}  ${hex}  ${on === "#FFFFFF" ? "blanco" : "negro "}    ${contrast(hex, on)}:1`);
}
