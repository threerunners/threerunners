import Link from 'next/link'
import type { FindYourFitCategory } from '@/types/cms'

interface FindYourFitProps {
  categories: FindYourFitCategory[]
}

export default function FindYourFit({ categories }: FindYourFitProps) {
  return (
    <div>
      <h2 style={{
        fontFamily: 'inherit', fontSize: 28, fontWeight: 700, letterSpacing: '-0.015em',
        margin: '0 0 24px', color: 'var(--ink-900)',
      }}>
        Find your fit
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {categories.map((cat, idx) => (
          <div key={idx} style={{
            background: 'var(--paper)', border: '1px solid var(--ink-200)',
            borderRadius: 'var(--radius-lg)', padding: '22px 24px',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 6 }}>
              {cat.heading}
            </div>
            {cat.subheading && (
              <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 16px', lineHeight: 1.5 }}>
                {cat.subheading}
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cat.entries.map((entry, eidx) => (
                <Link
                  key={eidx}
                  href={entry.url}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: 'var(--radius)',
                    transition: 'background .12s',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)' }}>
                      {entry.label}
                    </div>
                    {entry.sublabel && (
                      <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 1 }}>
                        {entry.sublabel}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 12 }}>
                    {entry.price && (
                      <span style={{ fontSize: 12.5, color: 'var(--orange-600)', fontWeight: 600 }}>
                        {entry.price}
                      </span>
                    )}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13, color: 'var(--ink-400)' }}>
                      <path d="M5 12h14M13 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
