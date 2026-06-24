# /raiz-landing deploy

Publica en Vercel. Asume que el critique pasó y el audit está limpio: no se deploya una
landing con placeholders.

## Pasos

1. **Pre-check**: `npm run build` local en verde. Si falla, no se deploya.
2. **Env vars** en Vercel: las de `.env.example` que uses (Supabase para el lead form,
   etc.). Sin secrets en el repo.
3. **Deploy**:
   ```bash
   npx vercel --prod
   ```
   O conecta el repo de GitHub a Vercel para deploy automático en cada push.
4. **Dominio**: asigna el dominio del cliente en el panel de Vercel y configura el DNS.
5. **Verifica OG**: pega la URL en un validador de Open Graph (o compártela en un chat)
   y confirma que el título, la descripción y `og.jpg` aparecen bien.

## Post-deploy

- Carga la URL en móvil real: el navbar colapsa, el lead form funciona, los CTAs van a
  WhatsApp/contacto reales.
- Si es trabajo de cliente: el sitio queda limpio, sin marca tuya en el footer. La
  conversación de tu producto va aparte, después de entregar.
