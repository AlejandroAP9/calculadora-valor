---
id: no-deployar-con-job-corriendo
title: No deployes con un job/proceso en curso: el rebuild lo mata
tags: [deploy, ops, jobs]
source: educmark
date: 2026-06-19
---

**Guard:** Antes de pushear/deployar, verifica que no haya un job critico `running` (worker, generacion, proceso largo). El rebuild reinicia el contenedor y lo deja zombie a mitad de camino, a veces tras gastar recursos pagados.

**Why:** Un deploy es un reinicio; cualquier proceso en vuelo muere sin completar ni hacer rollback, y el usuario queda a medias.
