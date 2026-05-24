'use client'

import { useState, useEffect, useRef } from 'react'
import type { Persona, Goal } from '@/types/cms'

interface FindMyShoeProps {
  personas: Persona[]
  goals: Goal[]
  defaultPersona?: string
}

const STORAGE_KEY = 'findMyShoe_v1'
const NAV_H = 59

// ── small primitives ────────────────────────────────────────────────────────

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
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase',
      opacity: muted ? 0.6 : 0.72,
    }}>
      {children}
    </span>
  )
}

function PillDivider() {
  return <span style={{ width: 1, height: 13, background: 'currentColor', opacity: .28, margin: '0 1px' }} />
}

// ── main component ───────────────────────────────────────────────────────────

export default function FindMyShoe({ personas, goals, defaultPersona }: FindMyShoeProps) {
  const [gender, setGender] = useState<'men' | 'women'>('men')
  const [personaId, setPersonaId] = useState(defaultPersona || personas[0]?.id || '')
  const [goalId, setGoalId] = useState(goals[0]?.id || '')
  const [isSticky, setIsSticky] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Restore from localStorage (client only)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      if (saved.gender === 'men' || saved.gender === 'women') setGender(saved.gender)
      if (saved.personaId && personas.find(p => p.id === saved.personaId)) setPersonaId(saved.personaId)
      if (saved.goalId && goals.find(g => g.id === saved.goalId)) setGoalId(saved.goalId)
    } catch { /* ignore malformed storage */ }
  }, [personas, goals])

  // Persist selections
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ gender, personaId, goalId }))
  }, [gender, personaId, goalId])

  // Show compact bar when full panel scrolls off-screen (accounting for nav height)
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting)
        if (entry.isIntersecting) setEditOpen(false)
      },
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

  const selectedPersona = personas.find(p => p.id === personaId)
  const selectedGoal = goals.find(g => g.id === goalId)

  function PanelBody() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Gender + Profile row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 36,
          paddingBottom: 20, borderBottom: '1px dashed var(--ink-200)', marginBottom: 20,
          alignItems: 'start',
        }}>
          {/* Gender */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
              color: 'var(--ink-500)', marginBottom: 10,
            }}>
              Gender
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['men', 'women'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  style={{
                    padding: '9px 22px', borderRadius: 'var(--radius-pill)',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none',
                    background: gender === g ? 'var(--orange-500)' : 'var(--ink-100)',
                    color: gender === g ? 'var(--orange-200)' : 'var(--ink-600)',
                    transition: 'all .15s',
                  }}
                >
                  {g === 'men' ? 'Men' : 'Women'}
                </button>
              ))}
            </div>
          </div>

          {/* Runner profile */}
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
              color: 'var(--ink-500)', marginBottom: 10,
            }}>
              Your Runner Profile
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {personas.map(p => {
                const active = p.id === personaId
                return (
                  <button
                    key={p.id}
                    onClick={() => setPersonaId(p.id)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '8px 15px', borderRadius: 'var(--radius-pill)',
                      fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                      border: active ? '2px solid var(--orange-500)' : '2px solid var(--ink-200)',
                      background: active ? 'var(--orange-500)' : 'transparent',
                      color: active ? 'var(--orange-200)' : 'var(--ink-700)',
                      transition: 'all .15s',
                    }}
                  >
                    <span>{p.emoji}</span>
                    {p.label}
                  </button>
                )
              })}
            </div>
            {selectedPersona?.description && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginTop: 12, color: 'var(--ink-600)', fontSize: 13.5,
              }}>
                <span>{selectedPersona.emoji}</span>
                {selectedPersona.description}
              </div>
            )}
          </div>
        </div>

        {/* Goal row */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
            <TargetIcon />
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
              textTransform: 'uppercase', color: 'var(--ink-500)',
            }}>
              Your Goal
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {goals.map(g => {
              const active = g.id === goalId
              return (
                <button
                  key={g.id}
                  onClick={() => setGoalId(g.id)}
                  style={{
                    padding: '9px 18px', borderRadius: 'var(--radius-pill)',
                    fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                    border: active ? 'none' : '1.5px solid var(--ink-200)',
                    background: active ? 'var(--orange-500)' : 'transparent',
                    color: active ? 'var(--orange-200)' : 'var(--ink-700)',
                    transition: 'all .15s',
                  }}
                >
                  {g.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Full inline panel ─────────────────────────────────────────────── */}
      <div
        ref={panelRef}
        style={{
          background: 'var(--paper)', border: '1px solid var(--ink-150)',
          borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 36,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <SearchIcon />
            <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--ink-900)' }}>Find Your Shoe</span>
          </div>
          <span style={{ fontSize: 13, color: 'var(--ink-500)' }}>
            Refine the three picks below for your training
          </span>
        </div>
        <PanelBody />
      </div>

      {/* ── Compact sticky bar ────────────────────────────────────────────── */}
      {isSticky && (
        <div
          data-fms
          style={{
            position: 'fixed', top: NAV_H, left: 0, right: 0, zIndex: 40,
            background: 'var(--paper)', borderBottom: '1px solid var(--ink-150)',
            boxShadow: '0 4px 20px -6px rgba(1,42,46,.14)',
          }}
        >
          {/* Bar row */}
          <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, height: 52 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 4, flexShrink: 0 }}>
              <SearchIcon />
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink-900)', whiteSpace: 'nowrap' }}>
                Find Your Shoe
              </span>
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

            <button
              onClick={() => setEditOpen(o => !o)}
              style={{
                marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'transparent', border: '1.5px solid var(--ink-200)',
                padding: '7px 16px', borderRadius: 'var(--radius-pill)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--ink-700)',
                flexShrink: 0,
              }}
            >
              Edit <PencilIcon />
            </button>
          </div>

          {/* Edit dropdown */}
          {editOpen && (
            <div style={{
              borderTop: '1px solid var(--ink-150)',
              background: 'var(--bg)', padding: '20px 0 24px',
            }}>
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
