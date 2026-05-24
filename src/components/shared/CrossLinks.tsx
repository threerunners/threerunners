import Link from 'next/link'

interface CrossLinksProps {
  hubLink: { title: string; description: string; url: string }
  siblingSpokes: Array<{ title: string; description: string; url: string }>
}

export default function CrossLinks({ hubLink, siblingSpokes }: CrossLinksProps) {
  return (
    <div>
      {/* Up to hub — prominent gradient card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--orange-50) 0%, #fff 60%, var(--ink-50) 100%)',
        border: '1px solid var(--orange-200)', borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center',
        marginBottom: 26, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(255,107,92,.08), transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
            color: 'var(--orange-700)', marginBottom: 8,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            ↑ Up to hub
          </div>
          <h3 style={{
            fontFamily: 'inherit', fontSize: 24, fontWeight: 700, color: 'var(--ink-900)',
            letterSpacing: '-0.015em', lineHeight: 1.2, marginBottom: 10,
            margin: '0 0 10px',
          }}>
            {hubLink.title}
          </h3>
          <p style={{ fontSize: 14.5, color: 'var(--ink-700)', lineHeight: 1.55, maxWidth: '48ch', margin: 0 }}>
            {hubLink.description}
          </p>
        </div>
        <Link
          href={hubLink.url}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--ink-900)', color: 'var(--orange-200)',
            padding: '14px 20px', borderRadius: 'var(--radius)',
            fontSize: 14, fontWeight: 600, position: 'relative', whiteSpace: 'nowrap',
          }}
        >
          All marathon shoes
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* Sibling spokes — 3-column grid */}
      {siblingSpokes.length > 0 && (
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
            color: 'var(--ink-500)', marginBottom: 12,
          }}>
            Related guides
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {siblingSpokes.map((sibling, idx) => (
              <Link
                key={idx}
                href={sibling.url}
                style={{
                  background: 'var(--paper)', border: '1px solid var(--ink-200)',
                  borderRadius: 'var(--radius)', padding: '18px 20px',
                  display: 'flex', flexDirection: 'column', gap: 6,
                  transition: 'border-color .15s',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', lineHeight: 1.25 }}>
                  {sibling.title}
                </span>
                <span style={{ fontSize: 13, color: 'var(--ink-600)', lineHeight: 1.5, marginTop: 2 }}>
                  {sibling.description}
                </span>
                <span style={{
                  marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--ink-150)',
                  fontSize: 12.5, color: 'var(--ink-700)', fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  Read guide
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
                    <path d="M5 12h14M13 5l7 7-7 7"/>
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
