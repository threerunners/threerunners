export interface ShoeSpecs {
  weightGrams: number
  stackHeightHeel: number
  stackHeightToe: number
  dropMm: number
  carbonPlate: boolean
  widthOptions: string[]
}

export interface ShoeScores {
  cushioning: number
  responsiveness: number
  stability: number
  durability: number
  valueForMoney: number
  overall: number
}

export interface ShoeTags {
  useCase: string[]
  terrain: string[]
  distanceSuitability: string[]
  runnerLevel: string[]
  pronationSuitability: string[]
  personaFit: string[]
  conditionSuitability: string[]
}

export interface ShoeEditorial {
  verdict: string
  realTalkTags: string[]
  whoThisIsFor: string
  longFormReview: string
}

export interface ShoeMedia {
  primaryImage: string
  altText: string
  gallery: string[]
}

export interface ShoeRideFeel {
  cushion: number
  response: number
  stability: number
}

export interface Shoe {
  id: string
  name: string
  brand: string
  version: string
  year: number
  supersededBy: string | null
  specs: ShoeSpecs
  scores: ShoeScores
  tags: ShoeTags
  editorial: ShoeEditorial
  media: ShoeMedia
  rideFeel?: ShoeRideFeel
  genderFit?: ('men' | 'women' | 'all')[]
}

export interface RetailerPricing {
  retailerId: string
  retailerName: string
  currentPrice: number
  currency: string
  inStock: boolean
  lastChecked: string
  priceHistory: Array<{ price: number; date: string }>
}

export interface ShoePricing {
  shoeId: string
  retailers: RetailerPricing[]
}

export interface AffiliateLink {
  retailerId: string
  affiliateUrl: string
  commissionRate: number
  programStatus: string
  lastUpdated: string
}

export interface ShoeAffiliates {
  shoeId: string
  links: AffiliateLink[]
}
