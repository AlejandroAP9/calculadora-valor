---
id: container-fetch-hairpin-nat
title: Contenedor que fetchea su propio VPS por URL publica = hairpin NAT
tags: [docker, networking, ops]
source: educmark
date: 2026-06-19
---

**Guard:** Si un contenedor necesita un recurso que vive en el MISMO VPS, no lo pidas por la URL publica: usa la URL interna (`servicio:puerto` / red interna). Por la publica es hairpin NAT (falla o lento).

**Why:** El trafico sale y trata de volver a entrar por la IP publica del mismo host; muchos setups no soportan ese loopback.
