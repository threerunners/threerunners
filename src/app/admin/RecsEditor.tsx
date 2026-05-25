'use client'

import { useState, useTransition } from 'react'
import type { Shoe } from '@/types/shoe'
import type { Persona, Goal } from '@/types/cms'
import type { PersonaRecs, ShoePick, TrainerType } from '@/types/recs'
import { savePersonaRecsAction } from './actions'

const TRAINER_TYPES: Array<{ id: TrainerType; label: string }> = [
  { id: 'daily-trainer', label: 'Daily Trainer' },
  { id: 'tempo', label: 'Tempo' },
  { id: 'race-day', label: 'Race Day' },
]

const inp: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: 'var(--radius)',
  border: '1.5px solid var(--ink-200)', fontSize: 13.5, color: 'var(--ink-900)',
  background: 'var(--paper)', outline: 'none', boxSizing: 'border-box',
}
const ta: React.CSSProperties = { ...inp, resize: 'vertical', minHeight: 64, fontFamily: 'inherit', lineHeight: 1.6 }
const lbl: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.06em',
  textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 5,
}

function empty(personaId: string, trainerType: TrainerType): PersonaRecs {
  return { personaId, trainerType, picks: [] }
}

function emptyPick(): ShoePick {
  return { shoeId: '', bannerLabel: '', whyThisWorks: '', features: [], goalBoost: {} }
}

interface PickEditorProps {
  pick: ShoePick
  index: number
  shoes: Shoe[]
  goals: Goal[]
  onChange: (pick: ShoePick) => void
  onRemove: () => void
}

function PickEditor({ pick, index, shoes, goals, onChange, onRemove }: PickEditorProps) {
  function set<K extends keyof ShoePick>(k: K, v: ShoePick[K]) {
    onChange({ ...pick, [k]: v })
  }

  function addFeature() {
    onChange({ ...pick, features: [...pick.features, { label: '', positive: true }] })
  }

  function updateFeature(i: number, label: string, positive: boolean) {
    const features = pick.features.map((f, j) => j === i ? { label, positive } : f)
    onChange({ ...pick, features })
  }

  function removeFeature(i: number) {
    onChange({ ...pick, features: pick.features.filter((_, j) => j !== i) })
  }

  return (
    <div style={{ background: 'var(--ink-50)', border: '1px solid var(--ink-200)', borderRadius: 10, padding: '16px 18px', marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-700)' }}>Pick #{index + 1}</span>
        <button type="button" onClick={onRemove} style={{ fontSize: 12, color: '#b91c1c', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <label style={lbl}>Shoe</label>
          <select value={pick.shoeId} onChange={e => set('shoeId', e.target.value)}
            style={{ ...inp, cursor: 'pointer' }}>
            <option value="">— select shoe —</option>
            {shoes.map(s => (
              <option key={s.id} value={s.id}>{s.brand} {s.name} v{s.version}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={lbl}>Banner label</label>
          <input value={pick.bannerLabel} onChange={e => set('bannerLabel', e.target.value)}
            placeholder="e.g. Top pick" style={inp} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={lbl}>Why this works</label>
        <textarea value={pick.whyThisWorks} onChange={e => set('whyThisWorks', e.target.value)}
          placeholder="Explain why this shoe suits this persona + training type…"
          style={{ ...ta, minHeight: 56 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={lbl}>Features (pros &amp; cons)</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
          {pick.features.map((f, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr 26px', gap: 8, alignItems: 'center' }}>
              <button type="button"
                onClick={() => updateFeature(i, f.label, !f.positive)}
                style={{ height: 32, borderRadius: 6, border: `1.5px solid ${f.positive ? 'var(--green-600)' : '#b91c1c'}`, background: f.positive ? '#f0fdf4' : '#fff0f0', color: f.positive ? 'var(--green-600)' : '#b91c1c', fontSize: 14, cursor: 'pointer', fontWeight: 700 }}>
                {f.positive ? '✓' : '✗'}
              </button>
              <input value={f.label} onChange={e => updateFeature(i, e.target.value, f.positive)}
                placeholder="Feature label" style={{ ...inp, fontSize: 13 }} />
              <button type="button" onClick={() => removeFeature(i)}
                style={{ background: 'none', border: 'none', color: 'var(--ink-400)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addFeature}
          style={{ fontSize: 12.5, color: 'var(--ink-500)', background: 'none', border: '1.5px dashed var(--ink-300)', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}>
          + Add feature
        </button>
      </div>

      {goals.length > 0 && (
        <div>
          <label style={lbl}>Goal boost — higher number = ranked first for that goal</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {goals.map(g => (
              <div key={g.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--ink-500)', fontWeight: 600 }}>{g.label}</span>
                <input type="number" min={0} step={1}
                  value={pick.goalBoost[g.id] ?? 0}
                  onChange={e => set('goalBoost', { ...pick.goalBoost, [g.id]: +e.target.value })}
                  style={{ ...inp, width: 70, textAlign: 'center' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface CellEditorProps {
  pageId: string
  rec: PersonaRecs
  shoes: Shoe[]
  goals: Goal[]
  onUpdate: (rec: PersonaRecs) => void
}

function CellEditor({ pageId, rec, shoes, goals, onUpdate }: CellEditorProps) {
  const [local, setLocal] = useState<PersonaRecs>(rec)
  const [status, setStatus] = useState('idle')
  const [err, setErr] = useState('')
  const [, startTransition] = useTransition()

  function updatePick(i: number, pick: ShoePick) {
    setLocal(r => ({ ...r, picks: r.picks.map((p, j) => j === i ? pick : p) }))
    setStatus('idle')
  }

  function addPick() {
    if (local.picks.length >= 3) return
    setLocal(r => ({ ...r, picks: [...r.picks, emptyPick()] }))
    setStatus('idle')
  }

  function removePick(i: number) {
    setLocal(r => ({ ...r, picks: r.picks.filter((_, j) => j !== i) }))
    setStatus('idle')
  }

  function save() {
    setStatus('saving'); setErr('')
    startTransition(async () => {
      try {
        await savePersonaRecsAction(pageId, local.personaId, local.trainerType, JSON.stringify(local))
        setStatus('saved')
        onUpdate(local)
        setTimeout(() => setStatus('idle'), 2000)
      } catch (e) { setStatus('error'); setErr((e as Error).message) }
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        {err && <span style={{ fontSize: 12.5, color: 'var(--red-700)' }}>{err}</span>}
        <button onClick={save} disabled={status === 'saving'}
          style={{ marginLeft: 'auto', padding: '9px 22px', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', background: status === 'saved' ? 'var(--green-600)' : 'var(--orange-500)', color: 'var(--orange-200)', fontSize: 13.5, fontWeight: 600 }}>
          {status === 'saving' ? 'Saving…' : status === 'saved' ? '✓ Saved' : 'Save picks'}
        </button>
      </div>

      {local.picks.map((pick, i) => (
        <PickEditor key={i} pick={pick} index={i} shoes={shoes} goals={goals}
          onChange={p => updatePick(i, p)}
          onRemove={() => removePick(i)}
        />
      ))}

      {local.picks.length < 3 && (
        <button type="button" onClick={addPick}
          style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px dashed var(--ink-300)', background: 'none', color: 'var(--ink-500)', fontSize: 13, cursor: 'pointer' }}>
          + Add pick {local.picks.length > 0 ? `(${3 - local.picks.length} remaining)` : ''}
        </button>
      )}
    </div>
  )
}

interface RecsEditorProps {
  pageId: string
  initialRecs: PersonaRecs[]
  personas: Persona[]
  goals: Goal[]
  shoes: Shoe[]
}

export default function RecsEditor({ pageId, initialRecs, personas, goals, shoes }: RecsEditorProps) {
  const [allRecs, setAllRecs] = useState<PersonaRecs[]>(initialRecs)
  const [personaId, setPersonaId] = useState(personas[0]?.id ?? '')
  const [trainerType, setTrainerType] = useState<TrainerType>('daily-trainer')

  function getRec(pId: string, tType: TrainerType): PersonaRecs {
    return allRecs.find(r => r.personaId === pId && r.trainerType === tType) ?? empty(pId, tType)
  }

  function getCellCount(pId: string, tType: TrainerType): number {
    return getRec(pId, tType).picks.filter(p => p.shoeId).length
  }

  function updateRec(rec: PersonaRecs) {
    setAllRecs(prev => {
      const exists = prev.find(r => r.personaId === rec.personaId && r.trainerType === rec.trainerType)
      return exists
        ? prev.map(r => r.personaId === rec.personaId && r.trainerType === rec.trainerType ? rec : r)
        : [...prev, rec]
    })
  }

  const currentRec = getRec(personaId, trainerType)
  const currentPersona = personas.find(p => p.id === personaId)

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 24px' }}>
        Configure up to 3 shoe picks for each runner persona and training type. The goal boost numbers control ranking when a visitor selects a specific goal.
      </p>

      {/* Overview grid */}
      <div style={{ background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 10, padding: '16px 20px', marginBottom: 28, overflowX: 'auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 12 }}>Coverage overview</div>
        <table style={{ borderCollapse: 'collapse', fontSize: 12.5, width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '6px 12px 6px 0', color: 'var(--ink-500)', fontWeight: 600, whiteSpace: 'nowrap' }}>Persona</th>
              {TRAINER_TYPES.map(t => (
                <th key={t.id} style={{ padding: '6px 12px', color: 'var(--ink-500)', fontWeight: 600, textAlign: 'center', whiteSpace: 'nowrap' }}>{t.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {personas.map(p => (
              <tr key={p.id}>
                <td style={{ padding: '6px 12px 6px 0', color: 'var(--ink-700)', whiteSpace: 'nowrap' }}>
                  {p.emoji} {p.label}
                </td>
                {TRAINER_TYPES.map(t => {
                  const count = getCellCount(p.id, t.id)
                  const isActive = p.id === personaId && t.id === trainerType
                  return (
                    <td key={t.id} style={{ padding: '4px 12px', textAlign: 'center' }}>
                      <button type="button"
                        onClick={() => { setPersonaId(p.id); setTrainerType(t.id) }}
                        style={{ padding: '4px 14px', borderRadius: 20, border: `1.5px solid ${isActive ? 'var(--orange-500)' : count > 0 ? 'var(--green-600)' : 'var(--ink-200)'}`, background: isActive ? 'var(--orange-50)' : count > 0 ? '#f0fdf4' : 'transparent', color: isActive ? 'var(--orange-700)' : count > 0 ? 'var(--green-600)' : 'var(--ink-400)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                        {count > 0 ? `${count}/3` : 'empty'}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Persona selector */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 10 }}>Runner persona</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {personas.map(p => {
            const active = p.id === personaId
            return (
              <button key={p.id} type="button" onClick={() => setPersonaId(p.id)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 15px', borderRadius: 'var(--radius-pill)', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: active ? '2px solid var(--orange-500)' : '2px solid var(--ink-200)', background: active ? 'var(--orange-50)' : 'transparent', color: active ? 'var(--orange-700)' : 'var(--ink-700)' }}>
                <span>{p.emoji}</span>{p.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Trainer type selector */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 10 }}>Training type</div>
        <div style={{ display: 'flex', gap: 6, borderBottom: '1px solid var(--ink-200)', paddingBottom: 0 }}>
          {TRAINER_TYPES.map(t => {
            const active = t.id === trainerType
            return (
              <button key={t.id} type="button" onClick={() => setTrainerType(t.id)}
                style={{ padding: '9px 18px', border: 'none', borderBottom: `2px solid ${active ? 'var(--orange-500)' : 'transparent'}`, background: 'none', color: active ? 'var(--orange-600)' : 'var(--ink-500)', fontWeight: active ? 700 : 400, fontSize: 13.5, cursor: 'pointer', marginBottom: -1 }}>
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ marginBottom: 20, padding: '12px 16px', background: 'var(--orange-50)', borderRadius: 8, borderLeft: '3px solid var(--orange-500)' }}>
        <span style={{ fontSize: 13.5, color: 'var(--orange-700)' }}>
          Editing: <strong>{currentPersona?.emoji} {currentPersona?.label}</strong> — <strong>{TRAINER_TYPES.find(t => t.id === trainerType)?.label}</strong>
        </span>
      </div>

      <CellEditor
        key={`${personaId}-${trainerType}`}
        pageId={pageId}
        rec={currentRec}
        shoes={shoes}
        goals={goals}
        onUpdate={updateRec}
      />
    </div>
  )
}
