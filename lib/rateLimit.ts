const store = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60 * 1000
const MAX_REQUESTS = 5

function getKey(identifier: string, prefix: string): string {
  return `${prefix}:${identifier}`
}

function cleanup(): void {
  const now = Date.now()
  for (const [key, val] of store.entries()) {
    if (val.resetAt < now) store.delete(key)
  }
}

export function checkRateLimit(identifier: string, prefix: string = 'auth'): { ok: boolean; retryAfter?: number } {
  cleanup()
  const key = getKey(identifier, prefix)
  const now = Date.now()
  const entry = store.get(key)

  if (!entry) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true }
  }

  if (entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true }
  }

  entry.count++
  if (entry.count > MAX_REQUESTS) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }
  return { ok: true }
}

export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIp) return realIp
  return 'unknown'
}
