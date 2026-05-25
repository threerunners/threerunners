'use client'

import { useState, useEffect, useRef } from 'react'
import type { Persona, Goal } from '@/types/cms'
import type { PersonaRecs, ShoeDisplayData, TrainerType } from '@/types/recs'

interface FindMyShoeProps {
  personas: Persona[]
  goals: Goal[]
  defaultPersona?: string
  pageRecs?: PersonaRecs[]
  shoesMap?: Record<string, ShoeDisplayData>
}

const STORAGE_KEY = 'findMyShoe_v1'
const NAV_H = 59

const TRAINER_TYPES: Array<{ id: TrainerType; label: string; desc: string }> = [
  { id: 'daily-trainer', label: 'Daily Trainer', desc: 'Everyday mileage' },
  { id: 'tempo', label: 'Tempo', desc: 'Speed + threshold' },
  { id: 'race-day', label: 'Race Day', desc: 'Competition' },
]

// ── icons ───────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ width: 16, height: 16, color: 'var(--ink-500)', flexShrink: 0 }}>
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ width: 13, height: 13, color: 'var(--orange-500)', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ width: 12, height: 12 }}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ width: 12, height: 12 }}>
      <line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
      <path d="M7 17L17 7M9 7h8v8"/>
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 12, height: 12 }}>
      <path d="M12 2l2.39 4.84L20 7.66l-4 3.9.95 5.5L12 14.77 7.05 17.06 8 11.56 4 7.66l5.61-.82L12 2z"/>
    </svg>
  )
}

// ── pill primitives (for sticky bar) ───────────────────────────────────────

function Pill({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
      background: dark ? 'var(--orange-500)' : 'transparent',
      color: dark ? 'var(--orange-200)' : 'var(--ink-700)',
      border: dark ? 'none' : '1.5px solid var(--ink-200)',
      padding: '6px 13px', borderRadius: 'var(--radius-pill)',
      fontSize: 13, fontWeight: 600,
    }}>
      {children}
    </div>
  )
}

function PillLabel({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', opacity: muted ? 0.6 : 0.72 }}>
      {children}
    </span>
  )
}

function PillDivider() {
  return <span style={{ width: 1, height: 13, background: 'currentColor', opacity: .28, margin: '0 1px' }} />
}

// ── recommendation card ─────────────────────────────────────────────────────

function RecCard({ pick, display, rank }: {
  pick: { shoeId: string; bannerLabel: string; whyThisWorks: string; features: Array<{ label: string; positive: boolean }> }
  display: ShoeDisplayData
  rank: number
}) {
  const { shoe, affiliateUrl, bestPrice } = display
  const isTop = rank === 0
  const rideFeel = shoe.rideFeel

  const priceTier = bestPrice
    ? bestPrice.price < 150 ? '££' : bestPrice.price < 200 ? '£££' : '££££'
    : '£££'

  return (
    <article style={{
      position: 'relative',
      background: isTop ? 'linear-gradient(180deg, #f4fbf6 0%, #ffffff 60%)' : 'var(--paper)',
      border: isTop ? '1px solid var(--orange-200)' : '1px solid var(--ink-150)',
      borderRadius: 'var(--radius-lg)',
      padding: '50px 22px 22px',
      display: 'flex', flexDirection: 'column', gap: 14,
      boxShadow: isTop
        ? '0 1px 2px rgba(15,23,42,.04), 0 18px 40px -20px rgba(1,42,46,.35)'
        : 'var(--shadow-sm)',
    }}>
      {/* Banner */}
      <div style={{
        position: 'absolute', top: -1, left: -1, right: -1,
        padding: '7px 14px', fontSize: 11.5, fontWeight: 700,
        letterSpacing: '.08em', textTransform: 'uppercase',
        borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)',
        display: 'flex', alignItems: 'center', gap: 8,
        ...(isTop
          ? { background: 'var(--orange-200)', color: 'var(--orange-500)' }
          : { background: '#fff', color: 'var(--ink-700)', borderBottom: '1px solid var(--ink-150)' }
        ),
      }}>
        <span style={{ color: 'var(--orange-500)' }}>{isTop ? '🏠' : <StarIcon />}</span>
        {pick.bannerLabel || (isTop ? 'Top pick' : 'Also great')}
      </div>

      {/* Price tier */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--ink-900)', color: 'var(--orange-200)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13 }}>
          #{rank + 1}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink-900)', letterSpacing: '.02em' }}>{priceTier}</div>
      </div>

      {/* Image */}
      {shoe.media.primaryImage && (
        <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src={shoe.media.primaryImage} alt={shoe.media.altText}
            style={{ maxWidth: '100%', maxHeight: 140, objectFit: 'contain' }} />
        </div>
      )}

      {/* Brand + Name */}
      <div>
        <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-500)', fontWeight: 600 }}>
          {shoe.brand}
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', margin: '2px 0 0', color: 'var(--ink-900)' }}>
          {shoe.name}
        </h3>
      </div>

      {/* Verdict */}
      {shoe.editorial.verdict && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--orange-600)', marginBottom: 4 }}>
            <StarIcon /> The verdict
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-700)', fontStyle: 'italic', lineHeight: 1.55, margin: 0 }}>
            &ldquo;{shoe.editorial.verdict}&rdquo;
          </p>
        </div>
      )}

      {/* Ride feel */}
      {rideFeel && (
        <div style={{ background: 'var(--ink-50)', borderRadius: 'var(--radius)', padding: 14 }}>
          <div style={{ fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-500)', fontWeight: 600, marginBottom: 10 }}>
            Ride feel
          </div>
          {[
            { name: 'Cushion', value: rideFeel.cushion },
            { name: 'Response', value: rideFeel.response },
            { name: 'Stability', value: rideFeel.stability },
          ].map(bar => (
            <div key={bar.name} style={{ display: 'grid', gridTemplateColumns: '78px 1fr', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 11.5, color: 'var(--ink-700)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>{bar.name}</div>
              <div style={{ height: 6, background: 'var(--bar-bg)', borderRadius: 999, overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', background: 'var(--orange-400)', borderRadius: 999, width: `${bar.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Features */}
      {pick.features.length > 0 && (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12.5 }}>
          {pick.features.map((f, idx) => (
            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: f.positive ? 'var(--green-600)' : 'var(--red-700)' }}>
              {f.positive ? <CheckIcon /> : <CrossIcon />}
              {f.label}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <a href={affiliateUrl} target="_blank" rel="noopener nofollow"
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: 'var(--orange-500)', color: 'var(--orange-200)', padding: '11px 16px', borderRadius: 10, fontSize: 13.5, fontWeight: 600, border: 0, cursor: 'pointer', textDecoration: 'none' }}>
        Check price <ArrowIcon />
      </a>

      {/* Why this works */}
      {pick.whyThisWorks && (
        <div style={{ background: isTop ? 'var(--orange-50)' : 'var(--ink-50)', borderRadius: 'var(--radius)', padding: '12px 14px', marginTop: 'auto' }}>
          <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: isTop ? 'var(--orange-700)' : 'var(--ink-600)', fontWeight: 700, marginBottom: 6 }}>
            Why this works for you
          </div>
          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-700)', lineHeight: 1.55 }}>{pick.whyThisWorks}</p>
        </div>
      )}
    </article>
  )
}

// ── main component ───────────────────────────────────────────────────────────

export default function FindMyShoe({ personas, goals, defaultPersona, pageRecs = [], shoesMap = {} }: FindMyShoeProps) {
  const [gender, setGender] = useState<'men' | 'women'>('men')
  const [personaId, setPersonaId] = useState(defaultPersona || personas[0]?.id || '')
  const [goalId, setGoalId] = useState(goals[0]?.id || '')
  const [trainerType, setTrainerType] = useState<TrainerType>('daily-trainer')
  const [isSticky, setIsSticky] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const hasRecs = pageRecs.length > 0

  // Restore from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      if (saved.gender === 'men' || saved.gender === 'women') setGender(saved.gender)
      if (saved.personaId && personas.find(p => p.id === saved.personaId)) setPersonaId(saved.personaId)
      if (saved.goalId && goals.find(g => g.id === saved.goalId)) setGoalId(saved.goalId)
      if (saved.trainerType && ['daily-trainer', 'tempo', 'race-day'].includes(saved.trainerType)) {
        setTrainerType(saved.trainerType)
      }
    } catch { /* ignore */ }
  }, [personas, goals])

  // Persist selections
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ gender, personaId, goalId, trainerType }))
  }, [gender, personaId, goalId, trainerType])

  // Sticky panel detection
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { setIsSticky(!entry.isIntersecting); if (entry.isIntersecting) setEditOpen(false) },
      { rootMargin: `-${NAV_H}px 0px 0px 0px` }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Close edit dropdown on outside click
  useEffect(() => {
    if (!editOpen) return
    function onOutside(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest('[data-fms]')) setEditOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [editOpen])

  // ── Compute recommendations ──────────────────────────────────────────────

  const picks = (() => {
    if (!hasRecs) return []
    const rec = pageRecs.find(r => r.personaId === personaId && r.trainerType === trainerType)
    if (!rec) return []
    const validPicks = rec.picks
      .filter(p => p.shoeId && shoesMap[p.shoeId])
      .filter(p => {
        const gf = shoesMap[p.shoeId].shoe.genderFit
        if (!gf || gf.length === 0) return true
        return gf.includes('all') || gf.includes(gender)
      })
    return [...validPicks]
      .sort((a, b) => ((b.goalBoost[goalId] ?? 0) - (a.goalBoost[goalId] ?? 0)))
      .slice(0, 3)
  })()

  const selectedPersona = personas.find(p => p.id === personaId)
  const selectedGoal = goals.find(g => g.id === goalId)

  function PanelBody() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Gender + Profile row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 36, paddingBottom: 20, borderBottom: '1px dashed var(--ink-200)', marginBottom: 20, alignItems: 'start' }}>
          {/* Gender */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 10 }}>Gender</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['men', 'women'] as const).map(g => (
                <button key={g} onClick={() => setGender(g)}
                  style={{ padding: '9px 22px', borderRadius: 'var(--radius-pill)', fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', background: gender === g ? 'var(--orange-500)' : 'var(--ink-100)', color: gender === g ? 'var(--orange-200)' : 'var(--ink-600)', transition: 'all .15s' }}>
                  {g === 'men' ? 'Men' : 'Women'}
                </button>
              ))}
            </div>
          </div>

          {/* Runner profile */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 10 }}>Your Runner Profile</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {personas.map(p => {
                const active = p.id === personaId
                return (
                  <button key={p.id} onClick={() => setPersonaId(p.id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 15px', borderRadius: 'var(--radius-pill)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', border: active ? '2px solid var(--orange-500)' : '2px solid var(--ink-200)', background: active ? 'var(--orange-500)' : 'transparent', color: active ? 'var(--orange-200)' : 'var(--ink-700)', transition: 'all .15s' }}>
                    <span>{p.emoji}</span>{p.label}
                  </button>
                )
              })}
            </div>
            {selectedPersona?.description && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: 'var(--ink-600)', fontSize: 13.5 }}>
                <span>{selectedPersona.emoji}</span>
                {selectedPersona.description}
              </div>
            )}
          </div>
        </div>

        {/* Goal row */}
        <div style={{ paddingBottom: hasRecs ? 20 : 0, borderBottom: hasRecs ? '1px dashed var(--ink-200)' : 'none', marginBottom: hasRecs ? 20 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
            <TargetIcon />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-500)' }}>Your Goal</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {goals.map(g => {
              const active = g.id === goalId
              return (
                <button key={g.id} onClick={() => setGoalId(g.id)}
                  style={{ padding: '9px 18px', borderRadius: 'var(--radius-pill)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', border: active ? 'none' : '1.5px solid var(--ink-200)', background: active ? 'var(--orange-500)' : 'transparent', color: active ? 'var(--orange-200)' : 'var(--ink-700)', transition: 'all .15s' }}>
                  {g.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Training type row (only when recs are configured) */}
        {hasRecs && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 12 }}>Training type</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TRAINER_TYPES.map(t => {
                const active = t.id === trainerType
                return (
                  <button key={t.id} onClick={() => setTrainerType(t.id)}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 16px', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${active ? 'var(--orange-500)' : 'var(--ink-200)'}`, background: active ? 'var(--orange-50)' : 'transparent', transition: 'all .15s' }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: active ? 'var(--orange-700)' : 'var(--ink-800)' }}>{t.label}</span>
                    <span style={{ fontSize: 11.5, color: active ? 'var(--orange-600)' : 'var(--ink-500)', marginTop: 1 }}>{t.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* ── Full inline panel ────────────────────────────────────────────── */}
      <div ref={panelRef} style={{ background: 'var(--paper)', border: '1px solid var(--ink-150)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: picks.length > 0 ? 0 : 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <SearchIcon />
            <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--ink-900)' }}>Find Your Shoe</span>
          </div>
          <span style={{ fontSize: 13, color: 'var(--ink-500)' }}>
            {hasRecs ? 'Pick your profile to see personalised shoe picks' : 'Refine the three picks below for your training'}
          </span>
        </div>
        <PanelBody />
      </div>

      {/* ── Dynamic recommendations ──────────────────────────────────────── */}
      {picks.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{ background: 'var(--ink-50)', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', border: '1px solid var(--ink-150)', borderTop: 'none', padding: '16px 28px 20px', marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>
              Showing picks for{' '}
              <strong style={{ color: 'var(--ink-800)' }}>{gender === 'men' ? 'Men' : 'Women'}</strong>
              {' · '}
              <strong style={{ color: 'var(--ink-800)' }}>{selectedPersona?.emoji} {selectedPersona?.label}</strong>
              {' · '}
              <strong style={{ color: 'var(--ink-800)' }}>{TRAINER_TYPES.find(t => t.id === trainerType)?.label}</strong>
              {selectedGoal && (
                <>{' · '}Goal: <strong style={{ color: 'var(--ink-800)' }}>{selectedGoal.label}</strong></>
              )}
            </div>
          </div>

          <h2 style={{ fontFamily: 'inherit', fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 20px', color: 'var(--ink-900)' }}>
            Your picks
          </h2>

          <div className="picks-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {picks.map((pick, i) => {
              const display = shoesMap[pick.shoeId]
              if (!display) return null
              return <RecCard key={pick.shoeId} pick={pick} display={display} rank={i} />
            })}
          </div>
        </div>
      )}

      {/* No recs configured for this combination */}
      {hasRecs && picks.length === 0 && (
        <div style={{ marginBottom: 36, padding: '20px 28px', background: 'var(--ink-50)', border: '1px solid var(--ink-150)', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', borderTop: 'none', fontSize: 13.5, color: 'var(--ink-500)' }}>
          No personalised picks configured for this combination yet — see the editorial picks below.
        </div>
      )}

      {/* ── Compact sticky bar ────────────────────────────────────────────── */}
      {isSticky && (
        <div data-fms style={{ position: 'fixed', top: NAV_H, left: 0, right: 0, zIndex: 40, background: 'var(--paper)', borderBottom: '1px solid var(--ink-150)', boxShadow: '0 4px 20px -6px rgba(1,42,46,.14)' }}>
          <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, height: 52 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 4, flexShrink: 0 }}>
              <SearchIcon />
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink-900)', whiteSpace: 'nowrap' }}>Find Your Shoe</span>
            </div>

            <Pill dark>
              <PillLabel>Gender</PillLabel>
              <PillDivider />
              {gender === 'men' ? 'Men' : 'Women'}
            </Pill>

            <Pill>
              <PillLabel muted>Profile</PillLabel>
              <span style={{ margin: '0 2px' }}>{selectedPersona?.emoji}</span>
              {selectedPersona?.label}
            </Pill>

            <Pill dark>
              <PillLabel>Goal</PillLabel>
              <PillDivider />
              <span style={{ maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedGoal?.label}
              </span>
            </Pill>

            {hasRecs && (
              <Pill>
                <PillLabel muted>Type</PillLabel>
                <span style={{ marginLeft: 2 }}>{TRAINER_TYPES.find(t => t.id === trainerType)?.label}</span>
              </Pill>
            )}

            <button onClick={() => setEditOpen(o => !o)}
              style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1.5px solid var(--ink-200)', padding: '7px 16px', borderRadius: 'var(--radius-pill)', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--ink-700)', flexShrink: 0 }}>
              Edit <PencilIcon />
            </button>
          </div>

          {editOpen && (
            <div style={{ borderTop: '1px solid var(--ink-150)', background: 'var(--bg)', padding: '20px 0 24px' }}>
              <div className="wrap">
                <PanelBody />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
