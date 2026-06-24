---
id: rsync-cloudflare-tunnel
title: rsync sobre Cloudflare Tunnel se arrastra: usa tar + ssh
tags: [networking, cloudflare, ssh, ops]
source: educmark
date: 2026-06-19
---

**Guard:** rsync cae a velocidad minima sobre un Cloudflare Tunnel. Para mover archivos por el tunel usa `tar | ssh` en vez de rsync.

**Why:** rsync negocia mal su protocolo sobre el tunel y colapsa el throughput; tar+ssh stremea sin esa negociacion.
