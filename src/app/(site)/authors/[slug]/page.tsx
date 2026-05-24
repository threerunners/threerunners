import type { Metadata } from 'next'
import { getAuthor } from '@/lib/data'
import type { Author } from '@/types/author'
import BreadcrumbNav from '@/components/shared/BreadcrumbNav'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps { params: { slug: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const author = await getAuthor(params.slug)
  if (!author) return {}
  return { title: `${author.name} | The Run Down`, description: author.voiceLine }
}

export default async function AuthorPage({ params }: PageProps) {
  const author = await getAuthor(params.slug) as Author | undefined
  if (!author) return <div className="wrap" style={{ paddingBottom: 60 }}>Author not found.</div>

  const paragraphs = author.runningStory.split('\n\n').filter(Boolean)

  return (
    <div className="wrap-narrow" style={{ paddingBottom: 72 }}>
      <BreadcrumbNav crumbs={[{ label: 'Home', url: '/' }, { label: author.name }]} />

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap' }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', flexShrink: 0, background: 'var(--orange-500)', color: 'var(--orange-200)', display: 'grid', placeItems: 'center', fontSize: 28, fontWeight: 800 }}>
          {author.initials}
        </div>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 6px', color: 'var(--ink-900)' }}>{author.name}</h1>
          <div style={{ display: 'inline-block', fontSize: 12.5, fontWeight: 600, background: 'var(--orange-50)', color: 'var(--orange-700)', padding: '4px 12px', borderRadius: 'var(--radius-pill)', marginBottom: 10 }}>
            {author.runnerTypeTag}
          </div>
          <p style={{ fontSize: 15, color: 'var(--ink-600)', lineHeight: 1.6, margin: 0, maxWidth: '56ch' }}>{author.voiceLine}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 40, background: 'var(--ink-50)', borderRadius: 'var(--radius-lg)', padding: '20px 24px' }}>
        {[
          { label: 'Weekly mileage', value: author.weeklyMileage },
          { label: 'Races completed', value: author.racesCompleted },
          { label: 'Marathon PB', value: author.pb },
          { label: 'Goal', value: author.currentTrainingGoal },
        ].map(stat => (
          <div key={stat.label}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 48 }}>
        {paragraphs.map((para, idx) => (
          <p key={idx} style={{ fontSize: 15.5, color: 'var(--ink-700)', lineHeight: 1.75, margin: idx < paragraphs.length - 1 ? '0 0 18px' : 0, maxWidth: '62ch' }}>
            {para}
          </p>
        ))}
      </div>

      {author.authoredSpokes.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'inherit', fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 16px', color: 'var(--ink-900)' }}>
            Guides by {author.name.split(' ')[0]}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {author.authoredSpokes.map(spokeId => (
              <Link key={spokeId} href={`/marathon/${spokeId.replace('marathon-', '')}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', padding: '16px 20px', fontSize: 15, fontWeight: 600, color: 'var(--ink-900)' }}>
                {spokeId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14, color: 'var(--ink-500)' }}><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
