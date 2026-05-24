import { createClient, type Client } from '@libsql/client'

declare global {
  // eslint-disable-next-line no-var
  var _turso: Client | undefined
}

function makeTurso(): Client {
  return createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  })
}

// Reuse in dev to survive hot-module reloads; always fresh in prod (serverless)
export const turso: Client =
  process.env.NODE_ENV === 'production'
    ? makeTurso()
    : (global._turso ??= makeTurso())
