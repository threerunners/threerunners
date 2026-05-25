'use client'

import { useState, useTransition } from 'react'
import type { Persona, Goal } from '@/types/cms'
import { saveConfigAction } from './actions'

const inp: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: 'var(--radius)',
  border: '1.5px solid var(--ink-200)', fontSize: 13.5, color: 'var(--ink-900)',
  background: 'var(--paper)', outline: 'none', boxSizing: 'border-box',
}
const ta: React.CSSProperties = { ...inp, resize: 'vertical', minHeight: 64, fontFamily: 'inherit', lineHeight: 1.6 }
const lbl: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 5 }

type ConfigSection = 'personas' | 'goals' | 'nav'

function SaveBar({ status, error, onSave }: { status: string; error: string; onSave: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
      {error && <span style={{ fontSize: 12.5, color: 'var(--red-700)' }}>{error}</span>}
      <button onClick={onSave} disabled={status === 'saving'}
        style={{ marginLeft: 'auto', padding: '9px 22px', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', background: status === 'saved' ? 'var(--green-600)' : 'var(--orange-500)', color: 'var(--orange-200)', fontSize: 13.5, fontWeight: 600 }}>
        {status === 'saving' ? 'Saving…' : status === 'saved' ? '✓ Saved' : 'Save'}
      </button>
    </div>
  )
}

function PersonasEditor({ initial }: { initial: Persona[] }) {
  const [personas, setPersonas] = useState<Persona[]>(initial)
  const [status, setStatus] = useState('idle')
  const [err, setErr] = useState('')
  const [, startTransition] = useTransition()

  function save() {
    setStatus('saving'); setErr('')
    startTransition(async () => {
      try {
        await saveConfigAction('personas', JSON.stringify(personas))
        setStatus('saved'); setTimeout(() => setStatus('idle'), 2000)
      } catch (e) { setStatus('error'); setErr((e as Error).message) }
    })
  }

  function update(i: number, field: keyof Persona, value: string) {
    setPersonas(prev => prev.map((p, j) => j === i ? { ...p, [field]: value } : p))
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 20px' }}>
        Runner personas drive the &ldquo;Find My Shoe&rdquo; filter on hub pages.
      </p>
      <SaveBar status={status} error={err} onSave={save} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {personas.map((p, i) => (
          <div key={i} style={{ background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 24 }}>{p.emoji}</span>
                <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-800)' }}>{p.label}</span>
              </div>
              <button type="button" onClick={() => setPersonas(prev => prev.filter((_, j) => j !== i))}
                style={{ fontSize: 12, color: '#b91c1c', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div><label style={lbl}>Emoji</label><input value={p.emoji} onChange={e => update(i, 'emoji', e.target.value)} style={{ ...inp, textAlign: 'center', fontSize: 18 }} /></div>
              <div><label style={lbl}>Label</label><input value={p.label} onChange={e => update(i, 'label', e.target.value)} style={inp} /></div>
              <div><label style={lbl}>ID (slug)</label><input value={p.id} onChange={e => update(i, 'id', e.target.value)} style={inp} /></div>
            </div>
            <div><label style={lbl}>Description</label><textarea value={p.description ?? ''} onChange={e => update(i, 'description', e.target.value)} style={{ ...ta, minHeight: 56 }} /></div>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => setPersonas(prev => [...prev, { id: '', label: '', emoji: '🏃', description: '' }])}
        style={{ marginTop: 12, width: '100%', padding: '10px', borderRadius: 8, border: '1.5px dashed var(--ink-300)', background: 'none', color: 'var(--ink-500)', fontSize: 13, cursor: 'pointer' }}>
        + Add persona
      </button>
    </div>
  )
}

function GoalsEditor({ initial }: { initial: Goal[] }) {
  const [goals, setGoals] = useState<Goal[]>(initial)
  const [status, setStatus] = useState('idle')
  const [err, setErr] = useState('')
  const [, startTransition] = useTransition()

  function save() {
    setStatus('saving'); setErr('')
    startTransition(async () => {
      try {
        await saveConfigAction('goals', JSON.stringify(goals))
        setStatus('saved'); setTimeout(() => setStatus('idle'), 2000)
      } catch (e) { setStatus('error'); setErr((e as Error).message) }
    })
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 20px' }}>
        Running goals shown in the &ldquo;Find My Shoe&rdquo; filter on hub pages.
      </p>
      <SaveBar status={status} error={err} onSave={save} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {goals.map((g, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 36px', gap: 8, alignItems: 'center', background: 'var(--ink-50)', borderRadius: 8, padding: '10px 12px' }}>
            <div>
              <label style={lbl}>ID (slug)</label>
              <input value={g.id} onChange={e => setGoals(prev => prev.map((x, j) => j === i ? { ...x, id: e.target.value } : x))} style={inp} />
            </div>
            <div>
              <label style={lbl}>Label</label>
              <input value={g.label} onChange={e => setGoals(prev => prev.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} style={inp} />
            </div>
            <button type="button" onClick={() => setGoals(prev => prev.filter((_, j) => j !== i))}
              style={{ marginTop: 18, padding: '8px', borderRadius: 6, border: '1px solid #fecaca', background: '#fff', color: '#b91c1c', fontSize: 14, cursor: 'pointer', lineHeight: 1 }}>×</button>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => setGoals(prev => [...prev, { id: '', label: '' }])}
        style={{ marginTop: 10, width: '100%', padding: '10px', borderRadius: 8, border: '1.5px dashed var(--ink-300)', background: 'none', color: 'var(--ink-500)', fontSize: 13, cursor: 'pointer' }}>
        + Add goal
      </button>
    </div>
  )
}

function NavEditor({ initial }: { initial: string }) {
  const [json, setJson] = useState(() => { try { return JSON.stringify(JSON.parse(initial), null, 2) } catch { return initial } })
  const [status, setStatus] = useState('idle')
  const [err, setErr] = useState('')
  const [, startTransition] = useTransition()

  function format() {
    try { setJson(JSON.stringify(JSON.parse(json), null, 2)); setErr('') } catch { setErr('Invalid JSON — fix before formatting') }
  }

  function save() {
    try { JSON.parse(json) } catch (e) { setErr('Invalid JSON: ' + (e as Error).message); return }
    setStatus('saving'); setErr('')
    startTransition(async () => {
      try {
        await saveConfigAction('nav', json)
        setStatus('saved'); setTimeout(() => setStatus('idle'), 2000)
      } catch (e) { setStatus('error'); setErr((e as Error).message) }
    })
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 20px' }}>
        Site navigation structure — top-level items, dropdown groups, and spoke links. Edit the JSON directly.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <button onClick={format} style={{ padding: '7px 14px', borderRadius: 'var(--radius)', border: '1.5px solid var(--ink-200)', background: 'transparent', color: 'var(--ink-600)', fontSize: 13, cursor: 'pointer' }}>Format JSON</button>
        {err && <span style={{ fontSize: 12.5, color: 'var(--red-700)' }}>{err}</span>}
        <button onClick={save} disabled={status === 'saving'}
          style={{ marginLeft: 'auto', padding: '9px 22px', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', background: status === 'saved' ? 'var(--green-600)' : 'var(--orange-500)', color: 'var(--orange-200)', fontSize: 13.5, fontWeight: 600 }}>
          {status === 'saving' ? 'Saving…' : status === 'saved' ? '✓ Saved' : 'Save'}
        </button>
      </div>
      <textarea value={json} onChange={e => { setJson(e.target.value); setStatus('idle') }} spellCheck={false}
        style={{ width: '100%', minHeight: 480, fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.6, padding: 16, borderRadius: 'var(--radius)', border: '1.5px solid var(--ink-200)', background: 'var(--ink-50)', color: 'var(--ink-900)', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }} />
    </div>
  )
}

export default function ConfigEditor({ config }: { config: Array<{ key: string; value: string }> }) {
  const [section, setSection] = useState<ConfigSection>('personas')

  const get = (key: string) => config.find(c => c.key === key)?.value ?? '[]'
  const personas: Persona[] = JSON.parse(get('personas'))
  const goals: Goal[] = JSON.parse(get('goals'))
  const nav = get('nav')

  const tabs: Array<{ key: ConfigSection; label: string }> = [
    { key: 'personas', label: 'Runner personas' },
    { key: 'goals', label: 'Running goals' },
    { key: 'nav', label: 'Site navigation' },
  ]

  return (
    <div>
      {/* Sub-nav */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--ink-200)', paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setSection(t.key)}
            style={{ padding: '10px 16px', border: 'none', borderBottom: `2px solid ${section === t.key ? 'var(--orange-500)' : 'transparent'}`, background: 'none', color: section === t.key ? 'var(--orange-600)' : 'var(--ink-500)', fontWeight: section === t.key ? 700 : 400, fontSize: 13.5, cursor: 'pointer', marginBottom: -1 }}>
            {t.label}
          </button>
        ))}
      </div>

      {section === 'personas' && <PersonasEditor initial={personas} />}
      {section === 'goals' && <GoalsEditor initial={goals} />}
      {section === 'nav' && <NavEditor initial={nav} />}
    </div>
  )
}
