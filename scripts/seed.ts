/**
 * One-time seed: creates Turso tables and populates them from local JSON files.
 * Run with: npm run seed
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@libsql/client'
import { pbkdf2Sync, randomBytes } from 'crypto'
import { readFileSync } from 'fs'
import { join } from 'path'
import type { PersonaRecs } from '../src/types/recs'

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

function readJson(rel: string) {
  return JSON.parse(readFileSync(join(process.cwd(), 'src/data', rel), 'utf8'))
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

async function main() {
  console.log('⏳ Creating tables…')

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS shoes (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS pricing (
      shoe_id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS affiliates (
      shoe_id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL DEFAULT 'hub',
      data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS authors (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    );
    CREATE TABLE IF NOT EXISTS page_recs (
      page_id TEXT NOT NULL,
      persona_id TEXT NOT NULL,
      trainer_type TEXT NOT NULL,
      data TEXT NOT NULL,
      PRIMARY KEY (page_id, persona_id, trainer_type)
    );
  `)

  console.log('✓ Tables ready')

  // ── Shoes ────────────────────────────────────────────────────────────────
  const shoes = readJson('shoes.json') as Array<{ id: string }>
  for (const shoe of shoes) {
    await db.execute({
      sql: 'INSERT OR REPLACE INTO shoes (id, data) VALUES (?, ?)',
      args: [shoe.id, JSON.stringify(shoe)],
    })
  }
  console.log(`✓ ${shoes.length} shoes seeded`)

  // ── Pricing ───────────────────────────────────────────────────────────────
  const pricing = readJson('pricing.json') as Array<{ shoeId: string }>
  for (const p of pricing) {
    await db.execute({
      sql: 'INSERT OR REPLACE INTO pricing (shoe_id, data) VALUES (?, ?)',
      args: [p.shoeId, JSON.stringify(p)],
    })
  }
  console.log(`✓ ${pricing.length} pricing records seeded`)

  // ── Affiliates ────────────────────────────────────────────────────────────
  const affiliates = readJson('affiliates.json') as Array<{ shoeId: string }>
  for (const a of affiliates) {
    await db.execute({
      sql: 'INSERT OR REPLACE INTO affiliates (shoe_id, data) VALUES (?, ?)',
      args: [a.shoeId, JSON.stringify(a)],
    })
  }
  console.log(`✓ ${affiliates.length} affiliate records seeded`)

  // ── Pages ─────────────────────────────────────────────────────────────────
  const pageFiles: Array<[string, string, string]> = [
    ['marathon', 'hub', 'pages/marathon-hub.json'],
    ['half-marathon', 'hub', 'pages/half-marathon-hub.json'],
    ['marathon-beginners', 'spoke', 'pages/marathon-beginners.json'],
  ]
  for (const [id, type, file] of pageFiles) {
    const data = readJson(file)
    await db.execute({
      sql: 'INSERT OR REPLACE INTO pages (id, type, data) VALUES (?, ?, ?)',
      args: [id, type, JSON.stringify(data)],
    })
  }
  console.log(`✓ ${pageFiles.length} pages seeded`)

  // ── Authors ───────────────────────────────────────────────────────────────
  const author = readJson('authors/ashley-morgan.json')
  await db.execute({
    sql: 'INSERT OR REPLACE INTO authors (id, data) VALUES (?, ?)',
    args: [author.id, JSON.stringify(author)],
  })
  console.log('✓ 1 author seeded')

  // ── Config (personas, goals, nav) ─────────────────────────────────────────
  const configs: Array<[string, string]> = [
    ['personas', readFileSync(join(process.cwd(), 'src/data/personas.json'), 'utf8')],
    ['goals', readFileSync(join(process.cwd(), 'src/data/goals.json'), 'utf8')],
    ['nav', readFileSync(join(process.cwd(), 'src/data/nav.json'), 'utf8')],
  ]
  for (const [key, value] of configs) {
    await db.execute({
      sql: 'INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)',
      args: [key, value],
    })
  }
  console.log(`✓ ${configs.length} config entries seeded`)

  // ── Page recs (marathon) — INSERT OR IGNORE to preserve admin edits ──────
  const marathonRecs = readJson('page-recs/marathon.json') as PersonaRecs[]
  for (const rec of marathonRecs) {
    await db.execute({
      sql: 'INSERT OR IGNORE INTO page_recs (page_id, persona_id, trainer_type, data) VALUES (?, ?, ?, ?)',
      args: ['marathon', rec.personaId, rec.trainerType, JSON.stringify(rec)],
    })
  }
  console.log(`✓ ${marathonRecs.length} marathon page_recs seeded (INSERT OR IGNORE)`)

  // ── Initial admin user ────────────────────────────────────────────────────
  const username = process.env.INITIAL_ADMIN_USERNAME || 'admin'
  const password = process.env.INITIAL_ADMIN_PASSWORD
  if (!password) {
    console.warn('⚠ INITIAL_ADMIN_PASSWORD not set — skipping admin user creation')
  } else {
    const existing = await db.execute({
      sql: 'SELECT id FROM admin_users WHERE username = ?',
      args: [username],
    })
    if (existing.rows.length === 0) {
      const passwordHash = hashPassword(password)
      await db.execute({
        sql: 'INSERT INTO admin_users (id, username, password_hash) VALUES (?, ?, ?)',
        args: [crypto.randomUUID(), username, passwordHash],
      })
      console.log(`✓ Admin user '${username}' created`)
    } else {
      console.log(`ℹ Admin user '${username}' already exists — skipping`)
    }
  }

  console.log('\n✅ Seed complete!')
  process.exit(0)
}

main().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
