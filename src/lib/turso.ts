import { createClient, type Client, type InStatement } from '@libsql/client'

declare global {
  // eslint-disable-next-line no-var
  var _turso: Client | undefined
}

function getClient(): Client {
  if (process.env.NODE_ENV === 'production') {
    return createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    })
  }
  return (global._turso ??= createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  }))
}

// Lazy wrapper — createClient() is deferred until the first query.
// This keeps module import side-effect-free at build time.
export const turso = {
  execute: (stmt: InStatement) => getClient().execute(stmt),
}
