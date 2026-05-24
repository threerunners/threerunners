'use client'

import { useState } from 'react'
import Link from 'next/link'

const SECTIONS = [
  { id: 'marathon-hub', label: 'Marathon Hub', file: 'pages/marathon-hub.json', description: 'Hero, personas, editorial boxes, shoe picks, FAQ' },
  { id: 'half-marathon-hub', label: 'Half Marathon Hub', file: 'pages/half-marathon-hub.json', description: 'Hero, personas, editorial boxes, shoe picks, FAQ' },
  { id: 'marathon-beginners', label: 'Marathon for Beginners (Spoke)', file: 'pages/marathon-beginners.json', description: 'Shoe picks, editorial, comparison table, FAQ' },
  { id: 'ashley-morgan', label: 'Ashley Morgan (Author)', file: 'authors/ashley-morgan.json', description: 'Bio, stats, voice line' },
  { id: 'shoes', label: 'Shoes', file: 'shoes.json', description: 'Shoe specs, scores, editorial, tags' },
  { id: 'pricing', label: 'Pricing', file: 'pricing.json', description: 'Retailer prices (volatile data — update frequently)' },
  { id: 'affiliates', label: 'Affiliates', file: 'affiliates.json', description: 'Affiliate links and commission rates' },
]

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id)
  const active = SECTIONS.find(s => s.id === activeSection)!

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--orange-500)', color: 'var(--orange-200)',
        padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'var(--orange-200)', color: 'var(--orange-500)',
            display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 800,
          }}>MR</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>The Run Down — Admin</span>
        </div>
        <Link href="/marathon" style={{ fontSize: 13, color: 'rgba(157,255,197,.7)', fontWeight: 500 }}>
          ← View site
        </Link>
      </div>

      <div style={{ display: 'flex', maxWidth: 1200, margin: '0 auto', padding: 24, gap: 24, alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <nav style={{
          width: 220, flexShrink: 0, background: 'var(--paper)',
          border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)',
          padding: '12px 8px', position: 'sticky', top: 24,
        }}>
          <div style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
            color: 'var(--ink-400)', padding: '4px 12px', marginBottom: 4,
          }}>
            Data files
          </div>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                width: '100%', textAlign: 'left', padding: '9px 12px',
                borderRadius: 8, border: 'none', cursor: 'pointer',
                background: activeSection === s.id ? 'var(--orange-50)' : 'transparent',
                color: activeSection === s.id ? 'var(--orange-700)' : 'var(--ink-700)',
                fontSize: 13.5, fontWeight: activeSection === s.id ? 600 : 400,
                display: 'block', marginBottom: 2,
              }}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Main panel */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: 'var(--paper)', border: '1px solid var(--ink-200)',
            borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', color: 'var(--ink-900)' }}>
                  {active.label}
                </h1>
                <p style={{ fontSize: 13.5, color: 'var(--ink-500)', margin: 0 }}>
                  {active.description}
                </p>
              </div>
              <div style={{
                background: 'var(--ink-50)', borderRadius: 8, padding: '8px 14px',
                fontSize: 12, fontFamily: 'monospace', color: 'var(--ink-600)',
              }}>
                src/data/{active.file}
              </div>
            </div>
          </div>

          {/* Instructions card */}
          <div style={{
            background: 'var(--paper)', border: '1px solid var(--ink-200)',
            borderRadius: 'var(--radius-lg)', padding: '24px 28px',
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
              color: 'var(--orange-600)', marginBottom: 16,
            }}>
              How to edit this data
            </div>
            <ol style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                `Open src/data/${active.file} in your editor`,
                'Edit the JSON — all fields are documented with inline comments',
                'Run npm run build to verify your changes compile',
                'Deploy to Vercel — the static export picks up all JSON changes at build time',
              ].map((step, idx) => (
                <li key={idx} style={{ fontSize: 14, color: 'var(--ink-700)', lineHeight: 1.6 }}>
                  {step}
                </li>
              ))}
            </ol>

            <div style={{
              marginTop: 24, padding: '14px 18px', borderRadius: 'var(--radius)',
              background: 'var(--ink-50)', border: '1px solid var(--ink-200)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-700)', marginBottom: 6 }}>
                Turso migration note
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: 0, lineHeight: 1.6 }}>
                When you&rsquo;re ready to move pricing data to Turso for live updates, the data access functions in{' '}
                <code style={{ fontSize: 12, background: 'var(--ink-100)', padding: '1px 5px', borderRadius: 4 }}>src/lib/data.ts</code>{' '}
                stay identical — swap the JSON imports for Turso client queries, keeping the same function signatures.
              </p>
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-700)', marginBottom: 10 }}>
                Quick links
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Link href="/marathon" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8,
                  border: '1px solid var(--ink-200)', background: 'var(--paper)',
                  fontSize: 13, fontWeight: 500, color: 'var(--ink-700)',
                }}>
                  Marathon hub
                </Link>
                <Link href="/half-marathon" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8,
                  border: '1px solid var(--ink-200)', background: 'var(--paper)',
                  fontSize: 13, fontWeight: 500, color: 'var(--ink-700)',
                }}>
                  Half marathon hub
                </Link>
                <Link href="/marathon/beginners" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8,
                  border: '1px solid var(--ink-200)', background: 'var(--paper)',
                  fontSize: 13, fontWeight: 500, color: 'var(--ink-700)',
                }}>
                  Marathon beginners
                </Link>
                <Link href="/authors/ashley-morgan" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8,
                  border: '1px solid var(--ink-200)', background: 'var(--paper)',
                  fontSize: 13, fontWeight: 500, color: 'var(--ink-700)',
                }}>
                  Ashley Morgan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
