import type { Metadata } from 'next'
import { getShoe, getPersonas, getGoals, getBestAffiliateUrl, getBestPrice, getHubPage, getAuthor, getPageRecs } from '@/lib/data'
import type { HubShoeRecommendation } from '@/types/cms'
import type { Author } from '@/types/author'
import type { ShoeDisplayData } from '@/types/recs'
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

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHubPage('marathon')
  return {
    title: page?.metaTitle,
    description: page?.metaDescription,
    alternates: { canonical: page?.canonicalUrl },
  }
}

export default async function MarathonHubPage() {
  const [page, personas, goals, author, pageRecs] = await Promise.all([
    getHubPage('marathon'),
    getPersonas(),
    getGoals(),
    getAuthor('ashley-morgan'),
    getPageRecs('marathon'),
  ])

  if (!page) return <div className="wrap" style={{ padding: '60px 0' }}>Page not found in database. Run <code>npm run seed</code> first.</div>

  const filteredPersonas = personas.filter(p => page.personasShown.includes(p.id))

  // Build shoesMap for dynamic recommendations (all unique shoes across page recs)
  const recShoeIds = Array.from(new Set(pageRecs.flatMap(r => r.picks.map(p => p.shoeId)).filter(Boolean)))
  const shoesMapEntries = await Promise.all(
    recShoeIds.map(async id => {
      const [shoe, affiliateUrl, bestPrice] = await Promise.all([
        getShoe(id),
        getBestAffiliateUrl(id),
        getBestPrice(id),
      ])
      return shoe ? [id, { shoe, affiliateUrl, bestPrice } satisfies ShoeDisplayData] as const : null
    })
  )
  const shoesMap = Object.fromEntries(shoesMapEntries.filter((e): e is NonNullable<typeof e> => e !== null))

  // Static editorial picks (shown when no dynamic recs configured, and for comparison table)
  const shoeCards = await Promise.all(
    (page.shoeRecommendations as HubShoeRecommendation[]).map(async rec => ({
      shoe: (await getShoe(rec.shoeId))!,
      rec,
      affiliateUrl: await getBestAffiliateUrl(rec.shoeId),
      bestPrice: await getBestPrice(rec.shoeId),
    }))
  )

  const comparisonRows = await Promise.all(
    page.comparisonRows.map(async row => ({
      label: (await getShoe(row.shoeId))?.name ?? row.shoeId,
      values: [row.bestFor, row.runnerType, row.cushion, row.weight, row.drop, row.carbon, row.priceTier] as Array<string | boolean>,
    }))
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.title,
    description: page.metaDescription,
    url: `https://therundown.co.uk${page.canonicalUrl}`,
    dateModified: page.lastUpdated,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="wrap" style={{ paddingBottom: 60 }}>
        <BreadcrumbNav crumbs={[{ label: 'Home', url: '/' }, { label: 'Marathon' }]} />

        <div style={{ maxWidth: '72ch', marginBottom: 32 }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 14px', color: 'var(--ink-900)' }}>
            {page.title}
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-600)', lineHeight: 1.65, margin: 0 }}>{page.subtitle}</p>
        </div>

        <FindMyShoe
          personas={filteredPersonas}
          goals={goals}
          defaultPersona={page.defaultPersona}
          pageRecs={pageRecs}
          shoesMap={shoesMap}
        />

        <SubNavTabs tabs={page.subNavTabs} />

        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 14.5, color: 'var(--ink-600)', lineHeight: 1.7, maxWidth: '72ch', margin: 0 }}>{page.whoThisIsFor}</p>
        </div>

        {/* Show static editorial picks only when no dynamic recs are configured */}
        {pageRecs.length === 0 && shoeCards.length > 0 && (
          <div style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'inherit', fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 20px', color: 'var(--ink-900)' }}>Our picks</h2>
            <div className="picks-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {shoeCards.map(({ shoe, rec, affiliateUrl, bestPrice }) => (
                <ShoeCard key={rec.shoeId} shoe={shoe} recommendation={rec} variant="hub" affiliateUrl={affiliateUrl} bestPrice={bestPrice} />
              ))}
            </div>
          </div>
        )}

        <AffiliateDisclosure variant="inline" />

        <div style={{ marginTop: 56, marginBottom: 56 }}>
          <EditorialBoxes heading="How we think about marathon shoes" boxes={page.editorialBoxes} />
        </div>

        <div style={{ marginBottom: 56 }}>
          <FindYourFit categories={page.findYourFitCategories} />
        </div>

        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontFamily: 'inherit', fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 16px', color: 'var(--ink-900)' }}>Side by side</h2>
          <ComparisonTable variant="hub" rows={comparisonRows} shoes={shoeCards.map(c => ({ label: c.shoe.name }))} />
        </div>

        <div style={{ marginBottom: 56 }}>
          <FAQAccordion heading="Common questions" subheading="Things we get asked about marathon shoes." faqs={page.faqs} variant="hub" />
        </div>

        {author && <AuthorBlock author={author as Author} />}
      </div>
    </>
  )
}
