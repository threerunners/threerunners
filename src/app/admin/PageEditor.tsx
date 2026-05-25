'use client'

import { useState, useTransition } from 'react'
import type { HubPageData, SpokePageData, FAQ, EditorialBox, SpokeShoeRecommendation, ShoeFeature } from '@/types/cms'
import type { Shoe } from '@/types/shoe'
import { savePageAction } from './actions'

const inp: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: 'var(--radius)',
  border: '1.5px solid var(--ink-200)', fontSize: 13.5, color: 'var(--ink-900)',
  background: 'var(--paper)', outline: 'none', boxSizing: 'border-box',
}
const ta: React.CSSProperties = { ...inp, resize: 'vertical', minHeight: 80, fontFamily: 'inherit', lineHeight: 1.6 }
const lbl: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 5 }

function SectionHead({ title }: { title: string }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid var(--ink-100)' }}>{title}</div>
}
function Field({ label, children, half }: { label: string; children: React.ReactNode; half?: boolean }) {
  return <div style={{ marginBottom: 14, ...(half ? {} : {}) }}><label style={lbl}>{label}</label>{children}</div>
}

function FaqEditor({ faqs, onChange }: { faqs: FAQ[]; onChange: (v: FAQ[]) => void }) {
  return (
    <div>
      {faqs.map((faq, i) => (
        <div key={i} style={{ marginBottom: 12, background: 'var(--ink-50)', borderRadius: 8, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-400)', textTransform: 'uppercase', letterSpacing: '.06em' }}>FAQ {i + 1}</span>
            <button type="button" onClick={() => onChange(faqs.filter((_, j) => j !== i))}
              style={{ fontSize: 12, color: '#b91c1c', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
          </div>
          <input placeholder="Question" value={faq.question}
            onChange={e => { const n = [...faqs]; n[i] = { ...faq, question: e.target.value }; onChange(n) }}
            style={{ ...inp, marginBottom: 8 }} />
          <textarea placeholder="Answer" value={faq.answer}
            onChange={e => { const n = [...faqs]; n[i] = { ...faq, answer: e.target.value }; onChange(n) }}
            style={{ ...ta, minHeight: 72 }} />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...faqs, { question: '', answer: '' }])}
        style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px dashed var(--ink-300)', background: 'none', color: 'var(--ink-500)', fontSize: 13, cursor: 'pointer' }}>
        + Add FAQ
      </button>
    </div>
  )
}

function EditorialBoxEditor({ boxes, onChange }: { boxes: EditorialBox[]; onChange: (v: EditorialBox[]) => void }) {
  return (
    <div>
      {boxes.map((box, i) => (
        <div key={i} style={{ marginBottom: 12, background: 'var(--ink-50)', borderRadius: 8, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-400)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Box {i + 1}</span>
            <button type="button" onClick={() => onChange(boxes.filter((_, j) => j !== i))}
              style={{ fontSize: 12, color: '#b91c1c', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 8, marginBottom: 8 }}>
            <input placeholder="Icon key" value={box.icon} onChange={e => { const n = [...boxes]; n[i] = { ...box, icon: e.target.value }; onChange(n) }} style={inp} />
            <input placeholder="Heading" value={box.heading} onChange={e => { const n = [...boxes]; n[i] = { ...box, heading: e.target.value }; onChange(n) }} style={inp} />
          </div>
          <textarea placeholder="Body" value={box.body} onChange={e => { const n = [...boxes]; n[i] = { ...box, body: e.target.value }; onChange(n) }} style={{ ...ta, minHeight: 72 }} />
        </div>
      ))}
      <button type="button" onClick={() => onChange([...boxes, { icon: '', heading: '', body: '' }])}
        style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px dashed var(--ink-300)', background: 'none', color: 'var(--ink-500)', fontSize: 13, cursor: 'pointer' }}>
        + Add editorial box
      </button>
    </div>
  )
}

function FeaturesEditor({ features, onChange }: { features: ShoeFeature[]; onChange: (v: ShoeFeature[]) => void }) {
  return (
    <div>
      {features.map((f, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
          <input value={f.label} onChange={e => { const n = [...features]; n[i] = { ...f, label: e.target.value }; onChange(n) }}
            placeholder="Feature label" style={{ ...inp, flex: 1 }} />
          <button type="button" onClick={() => { const n = [...features]; n[i] = { ...f, positive: !f.positive }; onChange(n) }}
            style={{ padding: '7px 12px', borderRadius: 8, border: `1.5px solid ${f.positive ? '#16a34a' : '#dc2626'}`, background: f.positive ? '#f0fdf4' : '#fef2f2', color: f.positive ? '#16a34a' : '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {f.positive ? '✓ Pro' : '✗ Con'}
          </button>
          <button type="button" onClick={() => onChange(features.filter((_, j) => j !== i))}
            style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid var(--ink-200)', background: 'none', color: 'var(--ink-400)', fontSize: 13, cursor: 'pointer' }}>×</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...features, { label: '', positive: true }])}
        style={{ fontSize: 12, color: 'var(--ink-500)', border: '1.5px dashed var(--ink-200)', background: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', marginTop: 4 }}>
        + Add feature
      </button>
    </div>
  )
}

function RideFeelSliders({ rideFeel, onChange }: {
  rideFeel: { cushion: number; response: number; stability: number }
  onChange: (v: typeof rideFeel) => void
}) {
  return (
    <div>
      {(['cushion', 'response', 'stability'] as const).map(k => (
        <div key={k} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 36px', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 12.5, color: 'var(--ink-600)', textTransform: 'capitalize' }}>{k}</span>
          <input type="range" min={0} max={100} value={rideFeel[k]} onChange={e => onChange({ ...rideFeel, [k]: +e.target.value })} style={{ width: '100%', accentColor: 'var(--orange-500)' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--orange-600)', textAlign: 'right' }}>{rideFeel[k]}</span>
        </div>
      ))}
    </div>
  )
}

function SpokeRecsEditor({ recs, shoes, onChange }: { recs: SpokeShoeRecommendation[]; shoes: Shoe[]; onChange: (v: SpokeShoeRecommendation[]) => void }) {
  const defaultRec: SpokeShoeRecommendation = { shoeId: shoes[0]?.id ?? '', rank: recs.length + 1, bannerType: 'top', bannerLabel: '', verdict: '', whyThisWorks: '', features: [], realTalkTags: [], tags: [], priceTier: '££', priceChecked: new Date().toISOString().slice(0, 10), rideFeel: { cushion: 70, response: 70, stability: 60 } }
  return (
    <div>
      {recs.map((rec, i) => {
        const shoeName = shoes.find(s => s.id === rec.shoeId)?.name ?? rec.shoeId
        return (
          <div key={i} style={{ marginBottom: 16, border: '1px solid var(--ink-200)', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-800)' }}>#{rec.rank} {shoeName}</span>
              <button type="button" onClick={() => onChange(recs.filter((_, j) => j !== i))}
                style={{ fontSize: 12, color: '#b91c1c', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 100px 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={lbl}>Shoe</label>
                <select value={rec.shoeId} onChange={e => { const n = [...recs]; n[i] = { ...rec, shoeId: e.target.value }; onChange(n) }} style={inp}>
                  {shoes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Rank</label><input type="number" value={rec.rank} onChange={e => { const n = [...recs]; n[i] = { ...rec, rank: +e.target.value }; onChange(n) }} style={inp} /></div>
              <div>
                <label style={lbl}>Banner</label>
                <div style={{ display: 'flex', gap: 4 }}>
                  {(['top', 'alt'] as const).map(t => (
                    <button key={t} type="button" onClick={() => { const n = [...recs]; n[i] = { ...rec, bannerType: t }; onChange(n) }}
                      style={{ flex: 1, padding: '8px 0', borderRadius: 6, border: `1.5px solid ${rec.bannerType === t ? 'var(--orange-500)' : 'var(--ink-200)'}`, background: rec.bannerType === t ? 'var(--orange-50)' : 'transparent', color: rec.bannerType === t ? 'var(--orange-700)' : 'var(--ink-500)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{t}</button>
                  ))}
                </div>
              </div>
              <div><label style={lbl}>Banner label</label><input value={rec.bannerLabel} onChange={e => { const n = [...recs]; n[i] = { ...rec, bannerLabel: e.target.value }; onChange(n) }} style={inp} /></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div><label style={lbl}>Verdict</label><input value={rec.verdict} onChange={e => { const n = [...recs]; n[i] = { ...rec, verdict: e.target.value }; onChange(n) }} style={inp} /></div>
              <div><label style={lbl}>Price tier</label><input value={rec.priceTier} onChange={e => { const n = [...recs]; n[i] = { ...rec, priceTier: e.target.value }; onChange(n) }} style={inp} placeholder="££" /></div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={lbl}>Why this works</label>
              <textarea value={rec.whyThisWorks} onChange={e => { const n = [...recs]; n[i] = { ...rec, whyThisWorks: e.target.value }; onChange(n) }} style={{ ...ta, minHeight: 60 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label style={lbl}>Features</label><FeaturesEditor features={rec.features} onChange={v => { const n = [...recs]; n[i] = { ...rec, features: v }; onChange(n) }} /></div>
              <div><label style={lbl}>Ride feel</label><RideFeelSliders rideFeel={rec.rideFeel} onChange={v => { const n = [...recs]; n[i] = { ...rec, rideFeel: v }; onChange(n) }} /></div>
            </div>
          </div>
        )
      })}
      <button type="button" onClick={() => onChange([...recs, { ...defaultRec, rank: recs.length + 1 }])}
        style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px dashed var(--ink-300)', background: 'none', color: 'var(--ink-500)', fontSize: 13, cursor: 'pointer' }}>
        + Add shoe pick
      </button>
    </div>
  )
}

// ── Hub page editor ────────────────────────────────────────────────────────────

function HubEditor({ initial, onBack }: { initial: HubPageData; shoes: Shoe[]; onBack: () => void }) {
  const [page, setPage] = useState<HubPageData>(initial)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [, startTransition] = useTransition()

  function save() {
    setSaveStatus('saving'); setErrMsg('')
    startTransition(async () => {
      try {
        await savePageAction(page.id, 'hub', JSON.stringify(page))
        setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000)
      } catch (e) { setSaveStatus('error'); setErrMsg((e as Error).message) }
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button onClick={onBack} style={{ fontSize: 13, color: 'var(--ink-500)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>← Pages</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {saveStatus === 'error' && <span style={{ fontSize: 12.5, color: 'var(--red-700)' }}>{errMsg}</span>}
          <button onClick={save} disabled={saveStatus === 'saving'}
            style={{ padding: '9px 22px', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', background: saveStatus === 'saved' ? 'var(--green-600)' : 'var(--orange-500)', color: 'var(--orange-200)', fontSize: 13.5, fontWeight: 600 }}>
            {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <SectionHead title="SEO & meta" />
          <Field label="Page title"><input value={page.title} onChange={e => setPage(p => ({ ...p, title: e.target.value }))} style={inp} /></Field>
          <Field label="Subtitle"><textarea value={page.subtitle} onChange={e => setPage(p => ({ ...p, subtitle: e.target.value }))} style={{ ...ta, minHeight: 64 }} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Meta title"><input value={page.metaTitle} onChange={e => setPage(p => ({ ...p, metaTitle: e.target.value }))} style={inp} /></Field>
            <Field label="Canonical URL"><input value={page.canonicalUrl} onChange={e => setPage(p => ({ ...p, canonicalUrl: e.target.value }))} style={inp} /></Field>
          </div>
          <Field label="Meta description"><textarea value={page.metaDescription} onChange={e => setPage(p => ({ ...p, metaDescription: e.target.value }))} style={{ ...ta, minHeight: 60 }} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Author ID"><input value={page.author} onChange={e => setPage(p => ({ ...p, author: e.target.value }))} style={inp} /></Field>
            <Field label="Last updated"><input type="date" value={page.lastUpdated} onChange={e => setPage(p => ({ ...p, lastUpdated: e.target.value }))} style={inp} /></Field>
          </div>
        </div>

        <div>
          <SectionHead title="Intro" />
          <Field label="Who this is for"><textarea value={page.whoThisIsFor} onChange={e => setPage(p => ({ ...p, whoThisIsFor: e.target.value }))} style={{ ...ta, minHeight: 100 }} /></Field>
        </div>

        <div>
          <SectionHead title="Editorial boxes" />
          <EditorialBoxEditor boxes={page.editorialBoxes} onChange={v => setPage(p => ({ ...p, editorialBoxes: v }))} />
        </div>

        <div>
          <SectionHead title="Shoe picks" />
          <div style={{ padding: '14px 16px', background: 'var(--orange-50)', border: '1px solid var(--orange-200)', borderRadius: 8, fontSize: 13.5, color: 'var(--orange-700)' }}>
            Shoe picks for hub pages are managed in the <strong>Recs</strong> tab — use the &ldquo;← Pages&rdquo; back button and click <strong>Recs</strong> next to this page.
          </div>
        </div>

        <div>
          <SectionHead title="FAQs" />
          <FaqEditor faqs={page.faqs} onChange={v => setPage(p => ({ ...p, faqs: v }))} />
        </div>
      </div>
    </div>
  )
}

// ── Spoke page editor ──────────────────────────────────────────────────────────

function SpokeEditor({ initial, shoes, onBack }: { initial: SpokePageData; shoes: Shoe[]; onBack: () => void }) {
  const [page, setPage] = useState<SpokePageData>(initial)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [, startTransition] = useTransition()

  function save() {
    setSaveStatus('saving'); setErrMsg('')
    startTransition(async () => {
      try {
        await savePageAction(page.id, 'spoke', JSON.stringify(page))
        setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000)
      } catch (e) { setSaveStatus('error'); setErrMsg((e as Error).message) }
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <button onClick={onBack} style={{ fontSize: 13, color: 'var(--ink-500)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>← Pages</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {saveStatus === 'error' && <span style={{ fontSize: 12.5, color: 'var(--red-700)' }}>{errMsg}</span>}
          <button onClick={save} disabled={saveStatus === 'saving'}
            style={{ padding: '9px 22px', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer', background: saveStatus === 'saved' ? 'var(--green-600)' : 'var(--orange-500)', color: 'var(--orange-200)', fontSize: 13.5, fontWeight: 600 }}>
            {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div>
          <SectionHead title="SEO & meta" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 0 }}>
            <Field label="Page title"><input value={page.title} onChange={e => setPage(p => ({ ...p, title: e.target.value }))} style={inp} /></Field>
            <Field label="Italic word"><input value={page.italicWord ?? ''} onChange={e => setPage(p => ({ ...p, italicWord: e.target.value }))} style={{ ...inp, width: 120 }} placeholder="e.g. Beginners" /></Field>
          </div>
          <Field label="Subtitle"><textarea value={page.subtitle} onChange={e => setPage(p => ({ ...p, subtitle: e.target.value }))} style={{ ...ta, minHeight: 60 }} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Meta title"><input value={page.metaTitle} onChange={e => setPage(p => ({ ...p, metaTitle: e.target.value }))} style={inp} /></Field>
            <Field label="Canonical URL"><input value={page.canonicalUrl} onChange={e => setPage(p => ({ ...p, canonicalUrl: e.target.value }))} style={inp} /></Field>
          </div>
          <Field label="Meta description"><textarea value={page.metaDescription} onChange={e => setPage(p => ({ ...p, metaDescription: e.target.value }))} style={{ ...ta, minHeight: 60 }} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Field label="Author ID"><input value={page.author} onChange={e => setPage(p => ({ ...p, author: e.target.value }))} style={inp} /></Field>
            <Field label="Parent hub"><input value={page.parentHub} onChange={e => setPage(p => ({ ...p, parentHub: e.target.value }))} style={inp} /></Field>
            <Field label="Last updated"><input type="date" value={page.lastUpdated} onChange={e => setPage(p => ({ ...p, lastUpdated: e.target.value }))} style={inp} /></Field>
          </div>
        </div>

        <div>
          <SectionHead title="Content" />
          <Field label="Who this is for"><textarea value={page.whoThisIsFor} onChange={e => setPage(p => ({ ...p, whoThisIsFor: e.target.value }))} style={{ ...ta, minHeight: 100 }} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12 }}>
            <Field label="Editorial section title"><input value={page.editorialTitle} onChange={e => setPage(p => ({ ...p, editorialTitle: e.target.value }))} style={inp} /></Field>
            <Field label="Italic subtitle"><input value={page.editorialTitleItalic ?? ''} onChange={e => setPage(p => ({ ...p, editorialTitleItalic: e.target.value }))} style={{ ...inp, width: 160 }} /></Field>
          </div>
          <Field label="Editorial body"><textarea value={page.editorialBody} onChange={e => setPage(p => ({ ...p, editorialBody: e.target.value }))} style={{ ...ta, minHeight: 160 }} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Editorial attribution"><input value={page.editorialAttribution} onChange={e => setPage(p => ({ ...p, editorialAttribution: e.target.value }))} style={inp} /></Field>
            <Field label="FAQ intro line"><input value={page.faqIntro} onChange={e => setPage(p => ({ ...p, faqIntro: e.target.value }))} style={inp} /></Field>
          </div>
        </div>

        <div>
          <SectionHead title="Shoe picks" />
          <SpokeRecsEditor recs={page.shoeRecommendations} shoes={shoes} onChange={v => setPage(p => ({ ...p, shoeRecommendations: v }))} />
        </div>

        <div>
          <SectionHead title="FAQs" />
          <FaqEditor faqs={page.faqs} onChange={v => setPage(p => ({ ...p, faqs: v }))} />
        </div>
      </div>
    </div>
  )
}

// ── Public export ─────────────────────────────────────────────────────────────

export default function PageEditor({
  pageType, pageData, shoes, onBack,
}: {
  pageId: string
  pageType: string
  pageData: string
  shoes: Shoe[]
  onBack: () => void
}) {
  const parsed = JSON.parse(pageData)
  if (pageType === 'hub') return <HubEditor initial={parsed as HubPageData} shoes={shoes} onBack={onBack} />
  return <SpokeEditor initial={parsed as SpokePageData} shoes={shoes} onBack={onBack} />
}
