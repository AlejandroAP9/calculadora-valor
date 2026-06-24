---
id: globals-css-usa-import-tailwindcss-sintaxis-tailwind-v4-pero-el-proyecto-tiene-tailwind-3-4-plugin-postcss-v3-no-se-renderiza-ningun-estilo
title: globals.css usa @import 'tailwindcss' (sintaxis Tailwind v4) pero el proyecto tiene Tailwind 3.4 + plugin PostCSS v3 -> no se renderiza ningun estilo
tags: [tailwind, css, template, styling]
source: calculadora-valor
date: 2026-06-24
---

**Guard:** Con Tailwind 3.4 usa las tres directivas @tailwind base/components/utilities en globals.css, NO @import 'tailwindcss' (eso es v4). Verifica la version: cat node_modules/tailwindcss/package.json

**Why:** El template Raiz mezcla sintaxis v4 con deps v3; el build pasa pero la UI sale sin estilos
