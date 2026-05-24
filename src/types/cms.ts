export interface Persona {
  id: string
  label: string
  emoji: string
}

export interface SubNavTab {
  label: string
  filterKey: string
}

export interface EditorialBox {
  icon: string
  heading: string
  body: string
}

export interface FindYourFitEntry {
  label: string
  sublabel?: string
  price?: string
  url: string
}

export interface FindYourFitCategory {
  heading: string
  subheading?: string
  entries: FindYourFitEntry[]
}

export interface ShoeFeature {
  label: string
  positive: boolean
}

export interface HubShoeRecommendation {
  shoeId: string
  bannerType: 'top' | 'alt'
  bannerLabel: string
  whyThisWorks: string
  features: ShoeFeature[]
  tags: string[]
  rideFeel: { cushion: number; response: number; stability: number }
}

export interface SpokeShoeRecommendation {
  shoeId: string
  rank: number
  bannerType: 'top' | 'alt'
  bannerLabel: string
  verdict: string
  whyThisWorks: string
  features: ShoeFeature[]
  realTalkTags: string[]
  tags: string[]
  priceTier: string
  priceChecked: string
  rideFeel: { cushion: number; response: number; stability: number }
}

export interface FAQ {
  question: string
  answer: string
}

export interface ComparisonRow {
  shoeId: string
  bestFor: string
  runnerType: string
  cushion: string
  weight: string
  drop: string
  carbon: boolean
  priceTier: string
}

export interface HubPageData {
  id: string
  slug: string
  pillarType: string
  title: string
  subtitle: string
  metaTitle: string
  metaDescription: string
  canonicalUrl: string
  lastUpdated: string
  personasShown: string[]
  defaultPersona: string
  subNavTabs: SubNavTab[]
  whoThisIsFor: string
  editorialBoxes: EditorialBox[]
  findYourFitCategories: FindYourFitCategory[]
  comparisonTableColumns: string[]
  shoeRecommendations: HubShoeRecommendation[]
  comparisonRows: ComparisonRow[]
  faqs: FAQ[]
  author: string
  exploreLinks: Array<{ label: string; url: string }>
}

export interface SpokeComparisonRow {
  brand: string
  name: string
  price: string
  cushioning: string
  weight: string
  bestFor: string
  whyWePicked: string
}

export interface SpokePageData {
  id: string
  slug: string
  parentHub: string
  pillarType: string
  title: string
  italicWord: string
  subtitle: string
  metaTitle: string
  metaDescription: string
  canonicalUrl: string
  lastUpdated: string
  author: string
  whoThisIsFor: string
  shoeRecommendations: SpokeShoeRecommendation[]
  editorialTitle: string
  editorialTitleItalic?: string
  editorialBody: string
  editorialAttribution: string
  faqIntro: string
  faqs: FAQ[]
  siblingSpokes: Array<{ title: string; description: string; url: string }>
  comparisonTable: {
    title: string
    subtitle: string
    rows: SpokeComparisonRow[]
  }
}
