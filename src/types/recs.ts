import type { Shoe } from './shoe'
import type { ShoeFeature } from './cms'

export type TrainerType = 'daily-trainer' | 'tempo' | 'race-day'

export interface ShoePick {
  shoeId: string
  bannerLabel: string
  whyThisWorks: string
  features: ShoeFeature[]
  goalBoost: Record<string, number>
}

export interface PersonaRecs {
  personaId: string
  trainerType: TrainerType
  picks: ShoePick[]
}

export interface ShoeDisplayData {
  shoe: Shoe
  affiliateUrl: string
  bestPrice: { price: number; retailer: string; lastChecked: string } | null
}
