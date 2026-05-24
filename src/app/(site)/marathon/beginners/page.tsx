import type { Metadata } from 'next'
import { getShoe, getBestAffiliateUrl, getBestPrice, getSpokePage, getAuthor } from '@/lib/data'
import type { SpokeShoeRecommendation } from '@/types/cms'
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

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSpokePage('marathon-beginners')
  return {
    title: page?.metaTitle,
    description: page?.metaDescription,
    alternates: { canonical: page?.canonicalUrl },
  }
}

export default async function MarathonBeginnersPage() {
  const [page, author] = await Promise.all([
    getSpokePage('marathon-beginners'),
    getAuthor('ashley-morgan'),
  ])

  if (!page) return <div className="wrap" style={{ padding: '60px 0' }}>Page not found. Run <code>npm run seed</code>.</div>

  const shoeCards = await Promise.all(
    (page.shoeRecommendations as SpokeShoeRecommendation[]).map(async rec => ({
      shoe: (await getShoe(rec.shoeId))!,
      rec,
      affiliateUrl: await getBestAffiliateUrl(rec.shoeId),
      bestPrice: await getBestPrice(rec.shoeId),
    }))
  )

  const titleParts = page.title.split(page.italicWord)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.metaDescription,
    url: `https://therundown.co.uk${page.canonicalUrl}`,
    dateModified: page.lastUpdated,
    author: author ? { '@type': 'Person', name: author.name } : undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="wrap-narrow" style={{ paddingBottom: 72 }}>
        <BreadcrumbNav crumbs={[{ label: 'Home', url: '/' }, { label: 'Marathon', url: '/marathon' }, { label: 'Beginners' }]} />

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 14px', color: 'var(--ink-900)' }}>
            {titleParts[0]}
            <em style={{ fontStyle: 'normal', color: 'var(--orange-600)' }}>{page.italicWord}</em>
            {titleParts[1]}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-600)', lineHeight: 1.65, margin: '0 0 22px' }}>{page.subtitle}</p>
          {author && <AuthorBlock author={author as Author} compact />}
        </div>

        <div style={{ marginBottom: 36 }}>
          <WhoThisIsFor body={page.whoThisIsFor} />
        </div>

        <AffiliateDisclosure variant="inline" />

        <div style={{ marginTop: 40, marginBottom: 56 }}>
          <div className="picks-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {shoeCards.map(({ shoe, rec, affiliateUrl, bestPrice }) => (
              <ShoeCard key={rec.shoeId} shoe={shoe} recommendation={rec} variant="spoke" affiliateUrl={affiliateUrl} bestPrice={bestPrice} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 56 }}>
          <EditorialSection title={page.editorialTitle} titleItalic={page.editorialTitleItalic} body={page.editorialBody} attribution={page.editorialAttribution} />
        </div>

        <div style={{ marginBottom: 56 }}>
          <ComparisonTable variant="spoke" title={page.comparisonTable.title} rows={page.comparisonTable.rows} />
        </div>

        <div style={{ marginBottom: 56 }}>
          <FAQAccordion heading={page.faqIntro} faqs={page.faqs} variant="spoke" />
        </div>

        <CrossLinks
          hubLink={{ title: 'Best Marathon Running Shoes', description: 'All marathon shoe categories — from race-day carbon to daily trainers.', url: '/marathon' }}
          siblingSpokes={page.siblingSpokes}
        />
      </div>
    </>
  )
}
