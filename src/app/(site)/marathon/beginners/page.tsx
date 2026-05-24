import type { Metadata } from 'next'
import { getShoe, getBestAffiliateUrl, getBestPrice } from '@/lib/data'
import spokeData from '@/data/pages/marathon-beginners.json'
import authorData from '@/data/authors/ashley-morgan.json'
import type { SpokePageData, SpokeShoeRecommendation } from '@/types/cms'
import type { Author } from '@/types/author'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import AffiliateDisclosure from '@/components/shared/AffiliateDisclosure'
import AuthorBlock from '@/components/shared/AuthorBlock'
import ShoeCard from '@/components/shared/ShoeCard'
import EditorialSection from '@/components/shared/EditorialSection'
import ComparisonTable from '@/components/shared/ComparisonTable'
import FAQAccordion from '@/components/shared/FAQAccordion'
import CrossLinks from '@/components/shared/CrossLinks'
import WhoThisIsFor from '@/components/shared/WhoThisIsFor'

const page = spokeData as SpokePageData
const author = authorData as Author

export const metadata: Metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: page.canonicalUrl },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: page.title,
  description: page.metaDescription,
  url: `https://therundown.co.uk${page.canonicalUrl}`,
  dateModified: page.lastUpdated,
  author: {
    '@type': 'Person',
    name: author.name,
  },
}

export default function MarathonBeginnersSpokeePage() {
  const shoeCards = (page.shoeRecommendations as SpokeShoeRecommendation[]).map(rec => {
    const shoe = getShoe(rec.shoeId)!
    return { shoe, rec }
  })

  const titleParts = page.title.split(page.italicWord)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="wrap-narrow" style={{ paddingBottom: 72 }}>
        <BreadcrumbNav crumbs={[
          { label: 'Home', url: '/' },
          { label: 'Marathon', url: '/marathon' },
          { label: 'Beginners' },
        ]} />

        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.02em',
            lineHeight: 1.1, margin: '0 0 14px', color: 'var(--ink-900)',
          }}>
            {titleParts[0]}
            <em style={{ fontStyle: 'normal', color: 'var(--orange-600)' }}>{page.italicWord}</em>
            {titleParts[1]}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-600)', lineHeight: 1.65, margin: '0 0 22px' }}>
            {page.subtitle}
          </p>
          <AuthorBlock author={author} compact />
        </div>

        {/* Who this is for */}
        <div style={{ marginBottom: 36 }}>
          <WhoThisIsFor body={page.whoThisIsFor} />
        </div>

        <AffiliateDisclosure variant="inline" />

        {/* Shoe picks */}
        <div style={{ marginTop: 40, marginBottom: 56 }}>
          <div className="picks-mobile" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20,
          }}>
            {shoeCards.map(({ shoe, rec }) => (
              <ShoeCard
                key={rec.shoeId}
                shoe={shoe}
                recommendation={rec}
                variant="spoke"
                affiliateUrl={getBestAffiliateUrl(rec.shoeId)}
                bestPrice={getBestPrice(rec.shoeId)}
              />
            ))}
          </div>
        </div>

        {/* Editorial */}
        <div style={{ marginBottom: 56 }}>
          <EditorialSection
            title={page.editorialTitle}
            titleItalic={page.editorialTitleItalic}
            body={page.editorialBody}
            attribution={page.editorialAttribution}
          />
        </div>

        {/* Comparison table */}
        <div style={{ marginBottom: 56 }}>
          <ComparisonTable
            variant="spoke"
            title={page.comparisonTable.title}
            rows={page.comparisonTable.rows}
          />
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 56 }}>
          <FAQAccordion
            heading={page.faqIntro}
            faqs={page.faqs}
            variant="spoke"
          />
        </div>

        {/* Cross links */}
        <CrossLinks
          hubLink={{
            title: 'Best Marathon Running Shoes',
            description: 'All marathon shoe categories — from race-day carbon to daily trainers.',
            url: '/marathon',
          }}
          siblingSpokes={page.siblingSpokes}
        />
      </div>
    </>
  )
}
