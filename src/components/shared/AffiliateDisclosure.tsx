interface AffiliateDisclosureProps {
  variant: 'inline' | 'full'
}

export default function AffiliateDisclosure({ variant }: AffiliateDisclosureProps) {
  if (variant === 'inline') {
    return (
      <p style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        background: 'var(--ink-50)', borderRadius: 'var(--radius)',
        padding: '12px 16px', margin: '22px 0 0',
        fontSize: 13, lineHeight: 1.55, color: 'var(--ink-600)',
        maxWidth: '60ch',
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14, flexShrink: 0, marginTop: 3, color: 'var(--orange-500)' }}>
          <circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/>
        </svg>
        <span>
          When you buy through links on this page we may earn a small commission.{' '}
          <strong style={{ color: 'var(--ink-700)', fontWeight: 600 }}>We never accept payment for placements</strong>{' '}
          — every shoe here is picked on merit.
        </span>
      </p>
    )
  }

  return (
    <div style={{
      background: 'var(--paper)', border: '1px solid var(--ink-150)',
      borderRadius: 'var(--radius-lg)', padding: 18,
    }}>
      <h4 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, margin: '0 0 6px' }}>
        🔗 Affiliate disclosure
      </h4>
      <p style={{ fontSize: 12.5, color: 'var(--ink-600)', margin: 0, lineHeight: 1.6 }}>
        Some retailer links on shoe review pages may be affiliate links — we may earn a small commission at no extra cost to you. This does not influence our editorial picks or rankings. We never accept payment for placements.
      </p>
    </div>
  )
}
