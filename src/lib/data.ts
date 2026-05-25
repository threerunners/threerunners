/**
 * Data access layer — reads from Turso (LibSQL).
 * All functions are async; page components must await them.
 *
 * Schema: shoes | pricing | affiliates | pages | authors | config | admin_users
 * Run `npm run seed` once to populate the database from the local JSON files.
 */
import { turso } from '@/lib/turso'
import type { Shoe, ShoePricing, ShoeAffiliates } from '@/types/shoe'
import type { Persona, Goal, HubPageData, SpokePageData } from '@/types/cms'
import type { Author } from '@/types/author'

function row<T>(json: unknown): T {
  return JSON.parse(json as string) as T
}

// ── Shoes ────────────────────────────────────────────────────────────────────

export async function getShoe(id: string): Promise<Shoe | undefined> {
  const res = await turso.execute({ sql: 'SELECT data FROM shoes WHERE id = ?', args: [id] })
  return res.rows[0] ? row<Shoe>(res.rows[0].data) : undefined
}

export async function getAllShoes(): Promise<Shoe[]> {
  const res = await turso.execute('SELECT data FROM shoes ORDER BY id')
  return res.rows.map(r => row<Shoe>(r.data))
}

// ── Pricing ───────────────────────────────────────────────────────────────────

export async function getShoePrice(shoeId: string): Promise<ShoePricing | undefined> {
  const res = await turso.execute({ sql: 'SELECT data FROM pricing WHERE shoe_id = ?', args: [shoeId] })
  return res.rows[0] ? row<ShoePricing>(res.rows[0].data) : undefined
}

// ── Affiliates ────────────────────────────────────────────────────────────────

export async function getShoeAffiliates(shoeId: string): Promise<ShoeAffiliates | undefined> {
  const res = await turso.execute({ sql: 'SELECT data FROM affiliates WHERE shoe_id = ?', args: [shoeId] })
  return res.rows[0] ? row<ShoeAffiliates>(res.rows[0].data) : undefined
}

// ── Config ────────────────────────────────────────────────────────────────────

export async function getPersonas(): Promise<Persona[]> {
  const res = await turso.execute({ sql: "SELECT value FROM config WHERE key = 'personas'", args: [] })
  return res.rows[0] ? JSON.parse(res.rows[0].value as string) : []
}

export async function getGoals(): Promise<Goal[]> {
  const res = await turso.execute({ sql: "SELECT value FROM config WHERE key = 'goals'", args: [] })
  return res.rows[0] ? JSON.parse(res.rows[0].value as string) : []
}

// ── Pages ─────────────────────────────────────────────────────────────────────

export async function getHubPage(id: string): Promise<HubPageData | undefined> {
  const res = await turso.execute({ sql: "SELECT data FROM pages WHERE id = ? AND type = 'hub'", args: [id] })
  return res.rows[0] ? row<HubPageData>(res.rows[0].data) : undefined
}

export async function getSpokePage(id: string): Promise<SpokePageData | undefined> {
  const res = await turso.execute({ sql: "SELECT data FROM pages WHERE id = ? AND type = 'spoke'", args: [id] })
  return res.rows[0] ? row<SpokePageData>(res.rows[0].data) : undefined
}

export async function getAllPages(): Promise<Array<{ id: string; type: string; data: string }>> {
  const res = await turso.execute('SELECT id, type, data FROM pages ORDER BY type, id')
  return res.rows.map(r => ({ id: r.id as string, type: r.type as string, data: r.data as string }))
}

// ── Authors ───────────────────────────────────────────────────────────────────

export async function getAuthor(id: string): Promise<Author | undefined> {
  const res = await turso.execute({ sql: 'SELECT data FROM authors WHERE id = ?', args: [id] })
  return res.rows[0] ? row<Author>(res.rows[0].data) : undefined
}

export async function getAllAuthors(): Promise<Author[]> {
  const res = await turso.execute('SELECT data FROM authors ORDER BY id')
  return res.rows.map(r => row<Author>(r.data))
}

// ── Derived helpers ───────────────────────────────────────────────────────────

export async function getBestAffiliateUrl(shoeId: string): Promise<string> {
  const aff = await getShoeAffiliates(shoeId)
  return aff?.links.find(l => l.programStatus === 'active')?.affiliateUrl ?? '#'
}

export async function getBestPrice(shoeId: string): Promise<{ price: number; retailer: string; lastChecked: string } | null> {
  const p = await getShoePrice(shoeId)
  if (!p?.retailers.length) return null
  const inStock = p.retailers.filter(r => r.inStock)
  if (!inStock.length) return null
  const cheapest = inStock.reduce((a, b) => a.currentPrice < b.currentPrice ? a : b)
  return { price: cheapest.currentPrice, retailer: cheapest.retailerName, lastChecked: cheapest.lastChecked }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(price)
}

// ── Admin users ───────────────────────────────────────────────────────────────

export async function getAdminUser(username: string): Promise<{ username: string; passwordHash: string } | undefined> {
  const res = await turso.execute({ sql: 'SELECT username, password_hash FROM admin_users WHERE username = ?', args: [username] })
  if (!res.rows[0]) return undefined
  return { username: res.rows[0].username as string, passwordHash: res.rows[0].password_hash as string }
}

export async function getAllAdminUsers(): Promise<Array<{ username: string; createdAt: number }>> {
  const res = await turso.execute('SELECT username, created_at FROM admin_users ORDER BY created_at')
  return res.rows.map(r => ({ username: r.username as string, createdAt: r.created_at as number }))
}

export async function createAdminUser(username: string, passwordHash: string): Promise<void> {
  await turso.execute({
    sql: 'INSERT INTO admin_users (id, username, password_hash) VALUES (?, ?, ?)',
    args: [crypto.randomUUID(), username, passwordHash],
  })
}

export async function deleteAdminUser(username: string): Promise<void> {
  await turso.execute({ sql: 'DELETE FROM admin_users WHERE username = ?', args: [username] })
}

// ── Content mutations (used by admin) ─────────────────────────────────────────

export async function upsertPage(id: string, type: string, data: string): Promise<void> {
  await turso.execute({
    sql: 'INSERT OR REPLACE INTO pages (id, type, data) VALUES (?, ?, ?)',
    args: [id, type, data],
  })
}

export async function upsertShoe(id: string, data: string): Promise<void> {
  await turso.execute({ sql: 'INSERT OR REPLACE INTO shoes (id, data) VALUES (?, ?)', args: [id, data] })
}

export async function deletePage(id: string): Promise<void> {
  await turso.execute({ sql: 'DELETE FROM pages WHERE id = ?', args: [id] })
}

export async function getAllConfig(): Promise<Array<{ key: string; value: string }>> {
  const res = await turso.execute('SELECT key, value FROM config ORDER BY key')
  return res.rows.map(r => ({ key: r.key as string, value: r.value as string }))
}

export async function upsertConfig(key: string, value: string): Promise<void> {
  await turso.execute({ sql: 'INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', args: [key, value] })
}
