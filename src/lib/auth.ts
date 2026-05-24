// Edge-safe auth utilities — uses Web Crypto API only (no Node.js crypto)

export const AUTH_COOKIE = 'admin_auth'
const EXPIRY_MS = 86_400_000 // 24 h

async function hmacHex(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function createSessionToken(username: string): Promise<string> {
  const payload = `${username}:${Date.now() + EXPIRY_MS}`
  const sig = await hmacHex(payload, process.env.ADMIN_SECRET!)
  return `${btoa(payload)}.${sig}`
}

/** Returns username if valid, null otherwise. */
export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const [payloadB64, sig] = token.split('.')
    if (!sig) return null
    const payload = atob(payloadB64)
    const [username, expiry] = payload.split(':')
    if (!username || !expiry || Date.now() > Number(expiry)) return null
    const expected = await hmacHex(payload, process.env.ADMIN_SECRET!)
    return sig === expected ? username : null
  } catch {
    return null
  }
}

// ── Password hashing (Node.js runtime only — not for Edge/middleware) ────────

export async function hashPassword(password: string): Promise<string> {
  const { pbkdf2Sync, randomBytes } = await import('crypto')
  const salt = randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const { pbkdf2Sync, timingSafeEqual } = await import('crypto')
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const inputHash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex')
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(inputHash, 'hex'))
}
