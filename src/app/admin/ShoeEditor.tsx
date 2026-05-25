'use client'

import { useState, useTransition } from 'react'
import type { Shoe, ShoeSpecs, ShoeScores, ShoeTags, ShoeEditorial, ShoeMedia } from '@/types/shoe'
import { saveShoeAction } from './actions'

const inp: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: 'var(--radius)',
  border: '1.5px solid var(--ink-200)', fontSize: 13.5, color: 'var(--ink-900)',
  background: 'var(--paper)', outline: 'none', boxSizing: 'border-box',
}
const ta: React.CSSProperties = { ...inp, resize: 'vertical', minHeight: 80, fontFamily: 'inherit', lineHeight: 1.6 }
const lbl: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 5 }

const TAG_OPTIONS = {
  useCase: ['daily-trainer', 'tempo', 'race-day', 'long-run', 'recovery'],
  terrain: ['road', 'trail', 'track', 'treadmill'],
  distanceSuitability: ['5k', '10k', 'half', 'marathon', 'ultra'],
  runnerLevel: ['beginner', 'intermediate', 'advanced', 'elite'],
  pronationSuitability: ['neutral', 'mild-overpronation', 'stability'],
  personaFit: ['new-runner', 'parkrunner', 'race-trainer', 'pb-chaser', 'trail-runner', 'running-smart'],
  conditionSuitability: ['wet', 'hot', 'cold', 'night'],
}
const TAG_LABELS: Record<string, string> = {
  useCase: 'Use case', terrain: 'Terrain', distanceSuitability: 'Distance',
  runnerLevel: 'Runner level', pronationSuitability: 'Pronation', personaFit: 'Persona fit',
  conditionSuitability: 'Conditions',
}
const WIDTH_OPTIONS = ['narrow', 'standard', 'wide', 'extra-wide', '2E', '4E']

function SectionHead({ title }: { title: string }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid var(--ink-100)' }}>{title}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 14 }}><label style={lbl}>{label}</label>{children}</div>
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!on)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 20, border: `1.5px solid ${on ? 'var(--orange-500)' : 'var(--ink-200)'}`, background: on ? 'var(--orange-50)' : 'transparent', color: on ? 'var(--orange-700)' : 'var(--ink-500)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
      <span style={{ width: 28, height: 16, borderRadius: 8, background: on ? 'var(--orange-500)' : 'var(--ink-300)', display: 'inline-block', position: 'relative', transition: 'background .15s', flexShrink: 0 }}>
        <span style={{ position: 'absolute', top: 2, left: on ? 14 : 2, width: 12, height: 12, borderRadius: '50%', background: '#fff', transition: 'left .15s' }} />
      </span>
      {label}
    </button>
  )
}

function Pills({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(opt => {
        const active = selected.includes(opt)
        return (
          <button key={opt} type="button" onClick={() => onChange(active ? selected.filter(s => s !== opt) : [...selected, opt])}
            style={{ padding: '5px 12px', borderRadius: 20, border: `1.5px solid ${active ? 'var(--orange-500)' : 'var(--ink-200)'}`, background: active ? 'var(--orange-50)' : 'transparent', color: active ? 'var(--orange-700)' : 'var(--ink-500)', fontSize: 12.5, fontWeight: active ? 600 : 400, cursor: 'pointer' }}>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function ChipInput({ values, onChange, placeholder }: { values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState('')
  function add() {
    const v = input.trim()
    if (v && !values.includes(v)) { onChange([...values, v]); setInput('') }
  }
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {values.map(v => (
          <span key={v} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 20, background: 'var(--ink-100)', fontSize: 12.5, color: 'var(--ink-700)' }}>
            {v}
            <button type="button" onClick={() => onChange(values.filter(x => x !== v))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-400)', fontSize: 14, lineHeight: 1, padding: 0, marginLeft: 2 }}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder || 'Add…'} style={{ ...inp, flex: 1 }} />
        <button type="button" onClick={add} style={{ padding: '8px 14px', borderRadius: 'var(--radius)', border: '1.5px solid var(--ink-200)', background: 'transparent', color: 'var(--ink-600)', fontSize: 13, cursor: 'pointer' }}>Add</button>
      </div>
    </div>
  )
}

function ScoreRow({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 36px', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <span style={{ fontSize: 13, color: 'var(--ink-700)' }}>{label}</span>
      <input type="range" min={0} max={10} step={0.5} value={value} onChange={e => onChange(+e.target.value)} style={{ width: '100%', accentColor: 'var(--orange-500)' }} />
      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--orange-600)', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

export default function ShoeEditor({ shoe: initial, onBack }: { shoe: Shoe; onBack: () => void }) {
  const [shoe, setShoe] = useState<Shoe>(initial)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [, startTransition] = useTransition()

  function setSpec<K extends keyof ShoeSpecs>(k: K, v: ShoeSpecs[K]) {
    setShoe(s => ({ ...s, specs: { ...s.specs, [k]: v } }))
  }
  function setScore<K extends keyof ShoeScores>(k: K, v: number) {
    setShoe(s => ({ ...s, scores: { ...s.scores, [k]: v } }))
  }
  function setTag<K extends keyof ShoeTags>(k: K, v: string[]) {
    setShoe(s => ({ ...s, tags: { ...s.tags, [k]: v } }))
  }
  function setEd<K extends keyof ShoeEditorial>(k: K, v: ShoeEditorial[K]) {
    setShoe(s => ({ ...s, editorial: { ...s.editorial, [k]: v } }))
  }
  function setMedia<K extends keyof ShoeMedia>(k: K, v: ShoeMedia[K]) {
    setShoe(s => ({ ...s, media: { ...s.media, [k]: v } }))
  }

  function save() {
    setSaveStatus('saving'); setErrMsg('')
    startTransition(async () => {
      try {
        await saveShoeAction(shoe.id, JSON.stringify(shoe))
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch (e) { setSaveStatus('error'); setErrMsg((e as Error).message) }
    })
  }

  return (
    <div>
      {/* Sticky top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 12 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-500)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          ← Shoes
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {saveStatus === 'error' && <span style={{ fontSize: 12.5, color: 'var(--red-700)' }}>{errMsg}</span>}
          <button onClick={save} disabled={saveStatus === 'saving'}
            style={{ padding: '9px 22px', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', background: saveStatus === 'saved' ? 'var(--green-600)' : 'var(--orange-500)', color: 'var(--orange-200)', fontSize: 13.5, fontWeight: 600 }}>
            {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Basic info */}
        <div>
          <SectionHead title="Basic info" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <Field label="Name"><input value={shoe.name} onChange={e => setShoe(s => ({ ...s, name: e.target.value }))} style={inp} /></Field>
            <Field label="Brand"><input value={shoe.brand} onChange={e => setShoe(s => ({ ...s, brand: e.target.value }))} style={inp} /></Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Field label="Version"><input value={shoe.version} onChange={e => setShoe(s => ({ ...s, version: e.target.value }))} style={inp} /></Field>
            <Field label="Year"><input type="number" value={shoe.year} onChange={e => setShoe(s => ({ ...s, year: +e.target.value }))} style={inp} /></Field>
            <Field label="Superseded by (ID or blank)"><input value={shoe.supersededBy ?? ''} onChange={e => setShoe(s => ({ ...s, supersededBy: e.target.value || null }))} placeholder="none" style={inp} /></Field>
          </div>
          <div style={{ marginTop: 8, padding: '6px 10px', background: 'var(--ink-50)', borderRadius: 6, display: 'inline-block' }}>
            <span style={{ fontSize: 11, color: 'var(--ink-400)' }}>ID (read-only): </span>
            <code style={{ fontSize: 12, color: 'var(--ink-600)' }}>{shoe.id}</code>
          </div>
        </div>

        {/* Specs */}
        <div>
          <SectionHead title="Specs" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            <Field label="Weight (g)"><input type="number" value={shoe.specs.weightGrams} onChange={e => setSpec('weightGrams', +e.target.value)} style={inp} /></Field>
            <Field label="Heel stack (mm)"><input type="number" value={shoe.specs.stackHeightHeel} onChange={e => setSpec('stackHeightHeel', +e.target.value)} style={inp} /></Field>
            <Field label="Toe stack (mm)"><input type="number" value={shoe.specs.stackHeightToe} onChange={e => setSpec('stackHeightToe', +e.target.value)} style={inp} /></Field>
            <Field label="Drop (mm)"><input type="number" value={shoe.specs.dropMm} onChange={e => setSpec('dropMm', +e.target.value)} style={inp} /></Field>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <label style={lbl}>Carbon plate</label>
              <Toggle on={shoe.specs.carbonPlate} onChange={v => setSpec('carbonPlate', v)} label={shoe.specs.carbonPlate ? 'Yes' : 'No'} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={lbl}>Width options</label>
              <Pills options={WIDTH_OPTIONS} selected={shoe.specs.widthOptions} onChange={v => setSpec('widthOptions', v)} />
            </div>
          </div>
        </div>

        {/* Scores */}
        <div>
          <SectionHead title="Scores (0 – 10)" />
          {([
            ['cushioning', 'Cushioning'],
            ['responsiveness', 'Responsiveness'],
            ['stability', 'Stability'],
            ['durability', 'Durability'],
            ['valueForMoney', 'Value for money'],
            ['overall', 'Overall'],
          ] as [keyof ShoeScores, string][]).map(([k, label]) => (
            <ScoreRow key={k} label={label} value={shoe.scores[k]} onChange={v => setScore(k, v)} />
          ))}
        </div>

        {/* Tags */}
        <div>
          <SectionHead title="Tags" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(Object.keys(TAG_OPTIONS) as Array<keyof typeof TAG_OPTIONS>).map(cat => (
              <div key={cat}>
                <label style={lbl}>{TAG_LABELS[cat]}</label>
                <Pills options={TAG_OPTIONS[cat]} selected={shoe.tags[cat]} onChange={v => setTag(cat, v)} />
              </div>
            ))}
          </div>
        </div>

        {/* Editorial */}
        <div>
          <SectionHead title="Editorial" />
          <Field label="Verdict"><textarea value={shoe.editorial.verdict} onChange={e => setEd('verdict', e.target.value)} style={ta} /></Field>
          <Field label="Real-talk tags">
            <ChipInput values={shoe.editorial.realTalkTags} onChange={v => setEd('realTalkTags', v)} placeholder="e.g. Everyday workhorse" />
          </Field>
          <Field label="Who this is for"><textarea value={shoe.editorial.whoThisIsFor} onChange={e => setEd('whoThisIsFor', e.target.value)} style={{ ...ta, minHeight: 64 }} /></Field>
          <Field label="Long-form review"><textarea value={shoe.editorial.longFormReview} onChange={e => setEd('longFormReview', e.target.value)} style={{ ...ta, minHeight: 160 }} /></Field>
        </div>

        {/* Media */}
        <div>
          <SectionHead title="Media" />
          <Field label="Primary image URL"><input value={shoe.media.primaryImage} onChange={e => setMedia('primaryImage', e.target.value)} style={inp} /></Field>
          <Field label="Alt text"><input value={shoe.media.altText} onChange={e => setMedia('altText', e.target.value)} style={inp} /></Field>
          {shoe.media.primaryImage && (
            <img src={shoe.media.primaryImage} alt={shoe.media.altText} style={{ marginTop: 8, height: 120, width: 'auto', borderRadius: 8, objectFit: 'cover', border: '1px solid var(--ink-100)' }} />
          )}
        </div>
      </div>
    </div>
  )
}
