---
paths:
  - "src/app/api/**webhook**"
  - "**/api/**payment**"
  - "**/billing/**"
  - "**/polar/**"
  - "**/mercadopago/**"
  - "**/stripe/**"
  - "supabase/migrations/*payment*"
  - "supabase/migrations/*subscription*"
  - "supabase/migrations/*credit*"
---
# Regla: Codigo de pagos y webhooks

Estas tocando codigo de plata. Cero margen de error: un error aqui = revenue perdido,
cobros falsos o reclamos. Reglas duras:

1. **Valida la firma del webhook (HMAC) como PRIMER paso**, antes de cualquier
   lectura/escritura a BD. Compara con `timingSafeEqual` y agrega ventana anti-replay
   por timestamp. Si el secret no esta configurado, **falla cerrado** (rechaza), no
   proceses. Ver blindaje `webhook-firma-primero-fail-closed`.
2. **Idempotencia atomica, no SELECT-luego-INSERT.** Dos webhooks concurrentes del
   mismo evento duplican. Pon un indice unico (parcial) en el id del pago y maneja
   el `23505` como "ya procesado". Ver blindaje `webhook-idempotencia-atomica`.
3. **El webhook es la frontera final de autorizacion.** No registres como `approved`
   un cobro con monto/estado anomalo solo para "alertar"; o lo rechazas, o lo marcas
   explicito y no concedes el entitlement.
4. **No mutes la suscripcion actual con eventos viejos/fuera de orden.** Verifica que
   el evento corresponde a la suscripcion vigente del usuario antes de sobrescribir.
5. **Escribe a tablas de pago solo con admin client** + validacion de ownership.
   Nunca desde el cliente anon.
6. Guarda en `transaction_data` un **payload minimo** (id, status, monto, moneda,
   fechas), no el objeto completo del proveedor (trae datos del pagador de mas).
