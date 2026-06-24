import { beforeEach, describe, expect, it } from 'vitest'
import { __resetRateLimit, rateLimit } from './rateLimit'

const LIMIT = 3
const WINDOW = 60_000

describe('rateLimit', () => {
  beforeEach(() => __resetRateLimit())

  it('permite hasta el límite dentro de la ventana', () => {
    const t = 1_000
    expect(rateLimit('ip-a', LIMIT, WINDOW, t).ok).toBe(true)
    expect(rateLimit('ip-a', LIMIT, WINDOW, t).ok).toBe(true)
    expect(rateLimit('ip-a', LIMIT, WINDOW, t).ok).toBe(true)
  })

  it('bloquea el golpe que supera el límite y reporta retryAfter', () => {
    const t = 1_000
    for (let i = 0; i < LIMIT; i++) rateLimit('ip-b', LIMIT, WINDOW, t)
    const blocked = rateLimit('ip-b', LIMIT, WINDOW, t + 10_000)
    expect(blocked.ok).toBe(false)
    expect(blocked.remaining).toBe(0)
    // resetAt = 1000 + 60000 = 61000; ahora = 11000 → faltan 50s
    expect(blocked.retryAfterSec).toBe(50)
  })

  it('resetea el contador al expirar la ventana', () => {
    const t = 1_000
    for (let i = 0; i < LIMIT; i++) rateLimit('ip-c', LIMIT, WINDOW, t)
    expect(rateLimit('ip-c', LIMIT, WINDOW, t).ok).toBe(false)
    // Justo en el reset (t + WINDOW) la ventana vuelve a abrir.
    expect(rateLimit('ip-c', LIMIT, WINDOW, t + WINDOW).ok).toBe(true)
  })

  it('cuenta cada clave por separado', () => {
    const t = 1_000
    for (let i = 0; i < LIMIT; i++) rateLimit('ip-d', LIMIT, WINDOW, t)
    expect(rateLimit('ip-d', LIMIT, WINDOW, t).ok).toBe(false)
    // Otra IP arranca limpia.
    expect(rateLimit('ip-e', LIMIT, WINDOW, t).ok).toBe(true)
  })

  it('expone el remaining decreciente', () => {
    const t = 1_000
    expect(rateLimit('ip-f', LIMIT, WINDOW, t).remaining).toBe(2)
    expect(rateLimit('ip-f', LIMIT, WINDOW, t).remaining).toBe(1)
    expect(rateLimit('ip-f', LIMIT, WINDOW, t).remaining).toBe(0)
  })
})
