import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer style={{
      background: 'var(--paper)', borderTop: '1px solid var(--ink-150)',
      marginTop: 40, padding: '28px 0 20px',
    }}>
      <div className="wrap">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700 }}>
              <span style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'var(--orange-500)', color: 'var(--orange-200)',
                display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800,
              }}>MR</span>
              The Run Down
            </div>
            <p style={{ color: 'var(--ink-500)', fontSize: 12.5, maxWidth: 480, margin: '6px 0 0' }}>
              Curated recommendations from runners, for runners. We test, research, and debate so you can run with confidence.
            </p>
          </div>
          <nav style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--ink-700)' }}>
            <Link href="/marathon">Marathon</Link>
            <Link href="/half-marathon">Half Marathon</Link>
            <Link href="#faq">FAQ</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </div>
        <div style={{
          marginTop: 22, paddingTop: 16, borderTop: '1px solid var(--ink-150)',
          display: 'flex', justifyContent: 'space-between', gap: 12,
          fontSize: 12, color: 'var(--ink-500)', flexWrap: 'wrap',
        }}>
          <div>© 2026 The Run Down. All recommendations are independent and editorial-led.</div>
          <div>Not affiliated with any shoe brand.</div>
        </div>
      </div>
    </footer>
  )
}
