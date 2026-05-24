/**
 * Data access layer — currently reads from flat JSON files.
 *
 * Migration path to Turso (SQLite for edge, as preferred by the project):
 *  1. Replace the JSON imports below with Turso client queries
 *  2. The function signatures stay identical — components are not aware of the source
 *  3. Turso queries map directly: getShoe(id) → SELECT * FROM shoes WHERE id = ?
 *  4. Three tables: shoes, pricing, affiliates — matching the three JSON files
 *  5. Page CMS data can stay in JSON or move to a `pages` table in Turso
 *
 * When migrating: install `@libsql/client` and create a turso.ts helper.
 */

import shoesData from '@/data/shoes.json'
import pricingData from '@/data/pricing.json'
import affiliatesData from '@/data/affiliates.json'
import personasData from '@/data/personas.json'
import type { Shoe, ShoePricing, ShoeAffiliates } from '@/types/shoe'
import type { Persona } from '@/types/cms'

export function getShoe(id: string): Shoe | undefined {
  return (shoesData as Shoe[]).find(s => s.id === id)
}

export function getAllShoes(): Shoe[] {
  return shoesData as Shoe[]
}

export function getShoePrice(shoeId: string): ShoePricing | undefined {
  return (pricingData as ShoePricing[]).find(p => p.shoeId === shoeId)
}

export function getShoeAffiliates(shoeId: string): ShoeAffiliates | undefined {
  return (affiliatesData as ShoeAffiliates[]).find(a => a.shoeId === shoeId)
}

export function getPersonas(): Persona[] {
  return personasData as Persona[]
}

export function getBestAffiliateUrl(shoeId: string): string {
  const aff = getShoeAffiliates(shoeId)
  const activeLink = aff?.links.find(l => l.programStatus === 'active')
  return activeLink?.affiliateUrl ?? '#'
}

export function getBestPrice(shoeId: string): { price: number; retailer: string; lastChecked: string } | null {
  const p = getShoePrice(shoeId)
  if (!p || !p.retailers.length) return null
  const inStock = p.retailers.filter(r => r.inStock)
  if (!inStock.length) return null
  const cheapest = inStock.reduce((a, b) => a.currentPrice < b.currentPrice ? a : b)
  return {
    price: cheapest.currentPrice,
    retailer: cheapest.retailerName,
    lastChecked: cheapest.lastChecked,
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(price)
}
