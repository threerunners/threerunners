import type { Metadata } from 'next'
import { getShoe, getPersonas, getGoals, getBestAffiliateUrl, getBestPrice } from '@/lib/data'
import hubData from '@/data/pages/half-marathon-hub.json'
import authorData from '@/data/authors/ashley-morgan.json'
import type { HubPageData, HubShoeRecommendation } from '@/types/cms'
import type { Author } from '@/types/author'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import FindMyShoe from '@/components/hub/FindMyShoe'
import SubNavTabs from '@/components/hub/SubNavTabs'
import ShoeCard from '@/components/shared/ShoeCard'
import EditorialBoxes from '@/components/hub/EditorialBoxes'
import FindYourFit from '@/components/hub/FindYourFit'
import ComparisonTable from '@/components/shared/ComparisonTable'
import FAQAccordion from '@/components/shared/FAQAccordion'
import AffiliateDisclosure from '@/components/shared/AffiliateDisclosure'
import AuthorBlock from '@/components/shared/AuthorBlock'

const page = hubData as HubPageData
const author = authorData as Author

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: page.canonicalUrl },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: page.title,
  description: page.metaDescription,
  url: `https://therundown.co.uk${page.canonicalUrl}`,
  dateModified: page.lastUpdated,
}

export default function HalfMarathonHubPage() {
  const personas = getPersonas().filter(p => page.personasShown.includes(p.id))
  const goals = getGoals()

  const shoeCards = (page.shoeRecommendations as HubShoeRecommendation[]).map(rec => {
    const shoe = getShoe(rec.shoeId)!
    return { shoe, rec }
  })

  const comparisonShoes = shoeCards.map(({ shoe }) => ({ shoe, label: shoe.name }))

  const comparisonRows = page.comparisonRows.map(row => ({
    label: getShoe(row.shoeId)?.name ?? row.shoeId,
    values: [row.bestFor, row.runnerType, row.cushion, row.weight, row.drop, row.carbon, row.priceTier] as Array<string | boolean>,
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="wrap" style={{ paddingBottom: 60 }}>
        <BreadcrumbNav crumbs={[{ label: 'Home', url: '/' }, { label: 'Half Marathon' }]} />

        <div style={{ maxWidth: '72ch', marginBottom: 32 }}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.02em',
            lineHeight: 1.1, margin: '0 0 14px', color: 'var(--ink-900)',
          }}>
            {page.title}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-600)', lineHeight: 1.65, margin: 0 }}>
            {page.subtitle}
          </p>
        </div>

        <FindMyShoe personas={personas} goals={goals} defaultPersona={page.defaultPersona} />

        <SubNavTabs tabs={page.subNavTabs} />

        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 14.5, color: 'var(--ink-600)', lineHeight: 1.7, maxWidth: '72ch', margin: 0 }}>
            {page.whoThisIsFor}
          </p>
        </div>

        <div style={{ marginBottom: 56 }}>
          <h2 style={{
            fontFamily: 'inherit', fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em',
            margin: '0 0 20px', color: 'var(--ink-900)',
          }}>
            Our picks
          </h2>
          <div className="picks-mobile" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20,
          }}>
            {shoeCards.map(({ shoe, rec }) => (
              <ShoeCard
                key={rec.shoeId}
                shoe={shoe}
                recommendation={rec}
                variant="hub"
                affiliateUrl={getBestAffiliateUrl(rec.shoeId)}
                bestPrice={getBestPrice(rec.shoeId)}
              />
            ))}
          </div>
        </div>

        <AffiliateDisclosure variant="inline" />

        <div style={{ marginTop: 56, marginBottom: 56 }}>
          <EditorialBoxes heading="How we think about half marathon shoes" boxes={page.editorialBoxes} />
        </div>

        <div style={{ marginBottom: 56 }}>
          <FindYourFit categories={page.findYourFitCategories} />
        </div>

        <div style={{ marginBottom: 56 }}>
          <h2 style={{
            fontFamily: 'inherit', fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em',
            margin: '0 0 16px', color: 'var(--ink-900)',
          }}>
            Side by side
          </h2>
          <ComparisonTable variant="hub" rows={comparisonRows} shoes={comparisonShoes} />
        </div>

        <div style={{ marginBottom: 56 }}>
          <FAQAccordion
            heading="Common questions"
            subheading="Things we get asked about half marathon shoes."
            faqs={page.faqs}
            variant="hub"
          />
        </div>

        <AuthorBlock author={author} />
      </div>
    </>
  )
}
