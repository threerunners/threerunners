'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import navData from '@/data/nav.json'

interface SiteNavProps {
  currentPath?: string
}

function NavIcon({ icon }: { icon: string }) {
  const props = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, width: 12, height: 12 }
  switch (icon) {
    case 'home': return <svg {...props}><path d="M5 21V8l7-5 7 5v13M9 21v-7h6v7"/></svg>
    case 'chart': return <svg {...props}><path d="M3 12h4l3-7 4 14 3-7h4"/></svg>
    case 'road': return <svg {...props}><path d="M3 18h18M5 18l4-10 4 6 3-4 3 8"/></svg>
    case 'clock': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
    case 'foot': return <svg {...props}><path d="M6 4c2 0 3 2 3 4s-1 4-1 6 1 4 3 4 3-2 3-4M9 14c0 2 1 4 3 4M5 20h14"/></svg>
    case 'brand': return <svg {...props}><path d="M3 14c3-4 6-4 9 0s6 4 9 0M3 18h18"/></svg>
    default: return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>
  }
}

export default function SiteNav({ currentPath = '' }: SiteNavProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<Record<number, boolean>>({})
  const headerRef = useRef<HTMLElement>(null)

  function toggleMenu(idx: number) {
    setOpenIdx(prev => prev === idx ? null : idx)
  }

  function closeAll() { setOpenIdx(null) }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) closeAll()
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeAll()
    }
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const caretStyle = (open: boolean) => ({
    width: 9, height: 9,
    borderRight: '1.6px solid currentColor', borderBottom: '1.6px solid currentColor',
    transform: open ? 'rotate(-135deg) translateY(-2px)' : 'rotate(45deg) translateY(-2px)',
    display: 'inline-block', transition: 'transform .15s ease',
  } as React.CSSProperties)

  const icoStyle = (active = false) => ({
    width: 22, height: 22, borderRadius: 6,
    background: active ? 'var(--orange-100)' : 'var(--orange-50)',
    color: 'var(--orange-600)',
    display: 'grid', placeItems: 'center', flexShrink: 0,
  } as React.CSSProperties)

  const panelBase = {
    position: 'absolute' as const, top: 'calc(100% + 14px)', left: '50%',
    background: 'var(--paper)', border: '1px solid var(--ink-150)',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)', zIndex: 30,
  }

  return (
    <>
      <header
        ref={headerRef}
        style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--paper)', borderBottom: '1px solid var(--ink-150)' }}
      >
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px' }}>
          {/* Brand */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 15, color: 'var(--ink-900)' }}>
            <span style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'var(--orange-500)', color: 'var(--orange-200)',
              display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800, letterSpacing: '.02em',
            }}>MR</span>
            <span>The Run Down</span>
          </Link>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: 22, fontSize: 13.5, color: 'var(--ink-700)', alignItems: 'center' }}>
            {navData.items.map((item, idx) => {
              if (item.simple) {
                return <Link key={idx} href={item.url || '#'} style={{ color: 'var(--ink-700)' }}>{item.label}</Link>
              }
              const isOpen = openIdx === idx
              const isWide = !!item.wide
              return (
                <div key={idx} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => toggleMenu(idx)}
                    aria-haspopup="true"
                    aria-expanded={isOpen ? 'true' : 'false'}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: 'none', border: 0, padding: 0, font: 'inherit',
                      color: isOpen ? 'var(--ink-900)' : 'var(--ink-700)', cursor: 'pointer',
                    }}
                  >
                    {item.label}
                    <span style={caretStyle(isOpen)} />
                  </button>

                  {/* Wide grouped dropdown (By Distance) */}
                  {isWide && item.groups && isOpen && (
                    <div role="menu" style={{
                      ...panelBase,
                      transform: 'translateX(-50%) translateY(-4px)',
                      minWidth: 520, padding: 10,
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6,
                    }}>
                      {item.groups.map((group, gIdx) => (
                        <div key={gIdx} style={{
                          padding: '8px 4px',
                          ...(gIdx > 0 ? { borderLeft: '1px solid var(--ink-150)', paddingLeft: 14 } : {}),
                        }}>
                          {group.heading && (
                            <div style={{
                              fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase',
                              color: 'var(--ink-500)', fontWeight: 700, padding: '4px 8px 8px', marginBottom: 2,
                            }}>{group.heading}</div>
                          )}
                          {group.hubUrl && (
                            <Link
                              role="menuitem"
                              href={group.hubUrl}
                              onClick={closeAll}
                              aria-current={currentPath === group.hubUrl ? 'page' : undefined}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '9px 10px', borderRadius: 8, fontSize: 14, fontWeight: 700,
                                color: currentPath === group.hubUrl ? 'var(--orange-700)' : 'var(--ink-900)',
                                background: currentPath === group.hubUrl ? 'var(--orange-50)' : 'transparent',
                              }}
                            >
                              <span style={icoStyle(currentPath === group.hubUrl)}>
                                <NavIcon icon={group.hubIcon || 'home'} />
                              </span>
                              {group.hubLabel}
                            </Link>
                          )}
                          {group.spokes && group.spokes.length > 0 && (
                            <>
                              <div style={{
                                fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase',
                                color: 'var(--ink-400)', fontWeight: 600,
                                padding: '10px 10px 4px', marginTop: 6, borderTop: '1px dashed var(--ink-150)',
                              }}>For your situation →</div>
                              {group.spokes.map((spoke: { label: string; url: string }, sIdx: number) => (
                                <Link
                                  key={sIdx}
                                  role="menuitem"
                                  href={spoke.url}
                                  onClick={closeAll}
                                  aria-current={currentPath === spoke.url ? 'page' : undefined}
                                  style={{
                                    display: 'block', padding: '7px 10px 7px 28px', borderRadius: 8,
                                    fontSize: 13, fontWeight: 500,
                                    color: currentPath === spoke.url ? 'var(--orange-700)' : 'var(--ink-700)',
                                    background: currentPath === spoke.url ? 'var(--orange-50)' : 'transparent',
                                    position: 'relative',
                                  }}
                                >
                                  <span style={{
                                    position: 'absolute', left: 12, top: '50%',
                                    width: 8, height: 8,
                                    borderBottom: '1.5px solid var(--ink-300)', borderLeft: '1.5px solid var(--ink-300)',
                                    transform: 'translateY(-80%)',
                                  }} />
                                  {spoke.label}
                                </Link>
                              ))}
                            </>
                          )}
                          {group.spokes && group.spokes.length === 0 && (
                            <div style={{ padding: '7px 10px 7px 28px', fontSize: 13, color: 'var(--ink-400)', fontStyle: 'italic' }}>
                              More guides coming soon
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Standard single dropdown */}
                  {!isWide && item.groups && isOpen && (
                    <div role="menu" style={{ ...panelBase, transform: 'translateX(-50%) translateY(-4px)', minWidth: 220, padding: 8 }}>
                      {item.groups.flatMap((g: { items?: Array<{ label: string; url: string; icon?: string }> }) => g.items || []).map((navItem: { label: string; url: string; icon?: string }, iIdx: number) => (
                        <Link
                          key={iIdx}
                          role="menuitem"
                          href={navItem.url}
                          onClick={closeAll}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '9px 12px', borderRadius: 8,
                            fontSize: 13.5, color: 'var(--ink-800)', fontWeight: 500,
                          }}
                        >
                          <span style={icoStyle()}><NavIcon icon={navItem.icon || 'home'} /></span>
                          {navItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            <Link href="#compare" style={{ color: 'var(--ink-700)' }}>Compare</Link>
            <Link href="#faq" style={{ color: 'var(--ink-700)' }}>FAQ</Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none', background: 'none', border: '1px solid var(--ink-200)',
              borderRadius: 8, padding: '8px 12px', color: 'var(--ink-700)', cursor: 'pointer',
            }}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              {mobileOpen
                ? <><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>
                : <><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>
              }
            </svg>
          </button>
        </div>

        {/* Mobile nav panel */}
        {mobileOpen && (
          <div style={{ borderTop: '1px solid var(--ink-150)', background: 'var(--paper)', padding: '8px 0 16px' }}>
            {navData.items.map((item, idx) => {
              if (item.simple) {
                return (
                  <Link key={idx} href={item.url || '#'} style={{ display: 'block', padding: '12px 28px', fontSize: 15, color: 'var(--ink-800)', fontWeight: 500 }}>
                    {item.label}
                  </Link>
                )
              }
              return (
                <div key={idx}>
                  <button
                    type="button"
                    onClick={() => setMobileExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '12px 28px', background: 'none', border: 0,
                      cursor: 'pointer', fontSize: 15, color: 'var(--ink-800)', fontWeight: 600, textAlign: 'left',
                    }}
                  >
                    {item.label}
                    <span style={caretStyle(!!mobileExpanded[idx])} />
                  </button>
                  {mobileExpanded[idx] && item.groups && (
                    <div style={{ paddingLeft: 28, paddingBottom: 8 }}>
                      {item.groups.map((group: { heading?: string | null; hubUrl?: string; hubLabel?: string; spokes?: Array<{ label: string; url: string }>; items?: Array<{ label: string; url: string }> }, gIdx: number) => (
                        <div key={gIdx}>
                          {group.heading && (
                            <div style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-500)', fontWeight: 700, padding: '6px 0 4px' }}>
                              {group.heading}
                            </div>
                          )}
                          {group.hubUrl && (
                            <Link href={group.hubUrl} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '8px 0', fontSize: 14, fontWeight: 700, color: 'var(--ink-900)' }}>
                              {group.hubLabel}
                            </Link>
                          )}
                          {group.spokes?.map((spoke: { label: string; url: string }, sIdx: number) => (
                            <Link key={sIdx} href={spoke.url} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '6px 0 6px 16px', fontSize: 13.5, color: 'var(--ink-600)' }}>
                              {spoke.label}
                            </Link>
                          ))}
                          {group.items?.map((navItem: { label: string; url: string }, iIdx: number) => (
                            <Link key={iIdx} href={navItem.url} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '8px 0', fontSize: 14, color: 'var(--ink-800)' }}>
                              {navItem.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
