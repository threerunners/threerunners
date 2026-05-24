import Link from 'next/link'
import type { Author } from '@/types/author'

interface AuthorBlockProps {
  author: Author
  compact?: boolean
}

function InitialsAvatar({ initials, size = 64 }: { initials: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--orange-50)', color: 'var(--orange-700)',
      display: 'grid', placeItems: 'center',
      fontWeight: 700, fontSize: size * 0.28, flexShrink: 0,
      border: '2px solid var(--orange-100)',
    }}>
      {initials}
    </div>
  )
}

export default function AuthorBlock({ author, compact = false }: AuthorBlockProps) {
  if (compact) {
    return (
      <div style={{
        marginTop: 28, display: 'flex', alignItems: 'flex-start', gap: 18,
        padding: '20px 0', borderTop: '1px solid var(--ink-200)', borderBottom: '1px solid var(--ink-200)',
      }}>
        {/* Avatar */}
        <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
          {author.photo ? (
            <img
              src={author.photo}
              alt={author.name}
              width={64}
              height={64}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <InitialsAvatar initials={author.initials} size={64} />
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-900)' }}>
              Curated by <strong>{author.name}</strong>
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '2px 9px', borderRadius: 'var(--radius-pill)',
              background: 'var(--ink-100)', color: 'var(--ink-700)',
              fontSize: 11, fontWeight: 600, letterSpacing: '.04em',
            }}>
              {author.runnerTypeTag}
            </span>
          </div>

          <p style={{ fontSize: 15, color: 'var(--ink-800)', fontWeight: 500, margin: '8px 0 16px', maxWidth: '56ch' }}>
            {author.voiceLine}
          </p>

          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', fontSize: 12.5, color: 'var(--ink-600)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12, color: 'var(--orange-500)' }}>
                <path d="M3 12h4l3-7 4 14 3-7h4"/>
              </svg>
              <strong style={{ color: 'var(--ink-900)', fontWeight: 600 }}>{author.weeklyMileage}</strong> weekly average
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12, color: 'var(--orange-500)' }}>
                <circle cx="12" cy="8" r="6"/><path d="M9 14l-2 8 5-3 5 3-2-8"/>
              </svg>
              <strong style={{ color: 'var(--ink-900)', fontWeight: 600 }}>{author.racesCompleted}</strong> · PB {author.pb}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12, color: 'var(--orange-500)' }}>
                <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
              </svg>
              Training for <strong style={{ color: 'var(--ink-900)', fontWeight: 600 }}>{author.currentTrainingGoal}</strong>
            </span>
          </div>

          <div style={{ marginTop: 10, display: 'flex', gap: 14, fontSize: 12.5 }}>
            <Link
              href={`/authors/${author.slug}`}
              style={{
                color: 'var(--ink-700)', fontWeight: 500,
                display: 'inline-flex', alignItems: 'center', gap: 4,
                borderBottom: '1px solid var(--ink-200)',
              }}
            >
              Read {author.name.split(' ')[0]}&apos;s full bio
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 11, height: 11 }}>
                <path d="M7 17L17 7M9 7h8v8"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Full version for hub pages or author bio
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 16 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }}>
        {author.photo ? (
          <img src={author.photo} alt={author.name} width={36} height={36} loading="lazy" style={{ borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--orange-100)', color: 'var(--orange-700)',
            display: 'grid', placeItems: 'center',
            fontWeight: 700, fontSize: 12,
          }}>{author.initials}</div>
        )}
      </div>
      <div>
        <h6 style={{ margin: 0, fontSize: 13, color: 'var(--ink-900)' }}>{author.name}</h6>
        <p style={{ fontSize: 12, color: 'var(--ink-600)', margin: '4px 0 0', lineHeight: 1.5 }}>
          {author.runnerTypeTag} · {author.weeklyMileage}/week · PB {author.pb}
        </p>
      </div>
    </div>
  )
}
