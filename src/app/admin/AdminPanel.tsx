'use client'

import { useState, useTransition } from 'react'
import type { Shoe } from '@/types/shoe'
import type { Persona, Goal } from '@/types/cms'
import type { PersonaRecs } from '@/types/recs'
import { deletePageAction, savePageAction } from './actions'
import ShoeEditor from './ShoeEditor'
import PageEditor from './PageEditor'
import ConfigEditor from './ConfigEditor'
import UserManager from './UserManager'
import RecsEditor from './RecsEditor'

type PageRow = { id: string; type: string; data: string }

interface AdminPanelProps {
  shoes: Shoe[]
  pages: PageRow[]
  config: Array<{ key: string; value: string }>
  users: Array<{ username: string; createdAt: number }>
  currentUser: string
  allPageRecs: Array<{ pageId: string; personaId: string; trainerType: string; data: string }>
}

type Tab = 'shoes' | 'pages' | 'config' | 'users'
type Screen =
  | { tab: 'shoes'; editing: string | null }
  | { tab: 'pages'; editing: string | null; creating: boolean; editingRecs: string | null }
  | { tab: 'config' }
  | { tab: 'users' }

const DEFAULT_HUB = (id: string): object => ({
  id, slug: id, pillarType: 'distance', title: 'New Hub Page', subtitle: '',
  metaTitle: `New Hub Page | The Run Down`, metaDescription: '',
  canonicalUrl: `/${id}`, lastUpdated: new Date().toISOString().slice(0, 10),
  personasShown: [], defaultPersona: '', subNavTabs: [], whoThisIsFor: '',
  editorialBoxes: [], findYourFitCategories: [], comparisonTableColumns: [],
  shoeRecommendations: [], comparisonRows: [], faqs: [], author: 'ashley-morgan', exploreLinks: [],
})

const DEFAULT_SPOKE = (id: string): object => ({
  id, slug: id, parentHub: 'marathon', pillarType: 'distance',
  title: 'New Guide', italicWord: '', subtitle: '',
  metaTitle: 'New Guide | The Run Down', metaDescription: '',
  canonicalUrl: `/marathon/${id}`, lastUpdated: new Date().toISOString().slice(0, 10),
  author: 'ashley-morgan', whoThisIsFor: '', shoeRecommendations: [],
  editorialTitle: 'Our take', editorialTitleItalic: '', editorialBody: '',
  editorialAttribution: '', faqIntro: '', faqs: [], siblingSpokes: [],
  comparisonTable: { title: 'Quick comparison', subtitle: '', rows: [] },
})

function TabBtn({ label, count, active, onClick }: { label: string; count?: number; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: '14px 20px', border: 'none', borderBottom: `2px solid ${active ? 'var(--orange-500)' : 'transparent'}`, background: 'none', color: active ? 'var(--orange-600)' : 'var(--ink-500)', fontWeight: active ? 700 : 400, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
      {label}
      {count !== undefined && <span style={{ fontSize: 11, background: active ? 'var(--orange-100)' : 'var(--ink-100)', color: active ? 'var(--orange-700)' : 'var(--ink-500)', borderRadius: 10, padding: '1px 7px', fontWeight: 600 }}>{count}</span>}
    </button>
  )
}

function ShoeList({ shoes, onEdit }: { shoes: Shoe[]; onEdit: (id: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
      {shoes.map(shoe => (
        <button key={shoe.id} onClick={() => onEdit(shoe.id)}
          style={{ textAlign: 'left', background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 10, padding: '16px 18px', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--orange-400)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--ink-200)')}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-400)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{shoe.brand}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 2 }}>{shoe.name}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-400)', marginBottom: 10 }}>v{shoe.version} · {shoe.year}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {shoe.tags.useCase.slice(0, 2).map(t => (
                <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'var(--ink-100)', color: 'var(--ink-600)' }}>{t}</span>
              ))}
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--orange-600)' }}>{shoe.scores.overall}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--ink-400)' }}>/10</span></span>
          </div>
        </button>
      ))}
    </div>
  )
}

function PageList({ pages, onEdit, onEditRecs, onDelete, onNew }: {
  pages: PageRow[]
  onEdit: (id: string) => void
  onEditRecs: (id: string) => void
  onDelete: (id: string) => void
  onNew: () => void
}) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function del(id: string) {
    if (!confirm(`Delete page "${id}"? This cannot be undone.`)) return
    setDeleting(id)
    startTransition(async () => {
      try { await deletePageAction(id); onDelete(id) }
      catch (e) { alert('Error: ' + (e as Error).message) }
      finally { setDeleting(null) }
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button onClick={onNew} style={{ padding: '9px 18px', borderRadius: 'var(--radius)', border: 'none', background: 'var(--orange-500)', color: 'var(--orange-200)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
          + New page
        </button>
      </div>
      <div style={{ background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {pages.map((p, i) => {
          const title = (() => { try { return (JSON.parse(p.data) as { title?: string }).title ?? p.id } catch { return p.id } })()
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: i < pages.length - 1 ? '1px solid var(--ink-100)' : 'none' }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: p.type === 'hub' ? 'var(--orange-50)' : 'var(--ink-100)', color: p.type === 'hub' ? 'var(--orange-700)' : 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '.06em', flexShrink: 0 }}>{p.type}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-400)', fontFamily: 'monospace' }}>{p.id}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => onEdit(p.id)} style={{ padding: '6px 14px', borderRadius: 8, border: '1.5px solid var(--orange-300)', background: 'var(--orange-50)', color: 'var(--orange-700)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                {p.type === 'hub' && (
                  <button onClick={() => onEditRecs(p.id)} style={{ padding: '6px 14px', borderRadius: 8, border: '1.5px solid var(--ink-300)', background: 'var(--ink-50)', color: 'var(--ink-700)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>Recs</button>
                )}
                <button onClick={() => del(p.id)} disabled={isPending && deleting === p.id} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: '#b91c1c', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                  {deleting === p.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          )
        })}
        {pages.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: 'var(--ink-400)', fontSize: 13 }}>No pages yet.</div>}
      </div>
    </div>
  )
}

function NewPageForm({ onCreated, onCancel }: { onCreated: (page: PageRow) => void; onCancel: () => void }) {
  const [id, setId] = useState('')
  const [type, setType] = useState<'hub' | 'spoke'>('hub')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  async function create() {
    if (!id.trim()) { setErr('Page ID is required'); return }
    if (!/^[a-z0-9-]+$/.test(id)) { setErr('ID must be lowercase letters, numbers and hyphens only'); return }
    setSaving(true); setErr('')
    const data = type === 'hub' ? DEFAULT_HUB(id) : DEFAULT_SPOKE(id)
    const json = JSON.stringify(data)
    try {
      await savePageAction(id, type, json)
      onCreated({ id, type, data: json })
    } catch (e) { setErr((e as Error).message); setSaving(false) }
  }

  return (
    <div style={{ background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', maxWidth: 480 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px', color: 'var(--ink-900)' }}>New page</h2>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 5 }}>Page ID (URL slug)</label>
        <input value={id} onChange={e => setId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
          placeholder="e.g. 5k or marathon-beginners-women"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius)', border: '1.5px solid var(--ink-200)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 8 }}>Page type</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['hub', 'spoke'] as const).map(t => (
            <button key={t} type="button" onClick={() => setType(t)}
              style={{ flex: 1, padding: '10px', borderRadius: 8, border: `1.5px solid ${type === t ? 'var(--orange-500)' : 'var(--ink-200)'}`, background: type === t ? 'var(--orange-50)' : 'transparent', color: type === t ? 'var(--orange-700)' : 'var(--ink-500)', fontWeight: type === t ? 700 : 400, fontSize: 14, cursor: 'pointer' }}>
              {t === 'hub' ? 'Hub page' : 'Spoke / guide'}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-400)', margin: '8px 0 0' }}>
          {type === 'hub' ? 'Hub pages list multiple shoes (e.g. /marathon).' : 'Spoke pages focus on a specific need (e.g. /marathon/beginners).'}
        </p>
      </div>
      {err && <div style={{ marginBottom: 12, fontSize: 13, color: '#b91c1c' }}>{err}</div>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={create} disabled={saving} style={{ padding: '10px 22px', borderRadius: 'var(--radius)', border: 'none', background: 'var(--orange-500)', color: 'var(--orange-200)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          {saving ? 'Creating…' : 'Create page'}
        </button>
        <button onClick={onCancel} style={{ padding: '10px 16px', borderRadius: 'var(--radius)', border: '1.5px solid var(--ink-200)', background: 'transparent', color: 'var(--ink-600)', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  )
}

export default function AdminPanel({ shoes: initialShoes, pages: initialPages, config, users, currentUser, allPageRecs }: AdminPanelProps) {
  const [screen, setScreen] = useState<Screen>({ tab: 'shoes', editing: null })
  const [pages, setPages] = useState<PageRow[]>(initialPages)

  const personas: Persona[] = JSON.parse(config.find(c => c.key === 'personas')?.value ?? '[]')
  const goals: Goal[] = JSON.parse(config.find(c => c.key === 'goals')?.value ?? '[]')

  const activeTab: Tab = screen.tab

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)' }}>
      {/* Header */}
      <div style={{ background: 'var(--orange-500)', color: 'var(--orange-200)', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--orange-200)', color: 'var(--orange-500)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 800 }}>MR</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>The Run Down — Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, opacity: .7 }}>Signed in as <strong>{currentUser}</strong></span>
          <button onClick={logout} style={{ fontSize: 12.5, color: 'rgba(157,255,197,.75)', background: 'none', border: '1px solid rgba(157,255,197,.3)', padding: '5px 12px', borderRadius: 6, cursor: 'pointer' }}>Sign out</button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: 'var(--paper)', borderBottom: '1px solid var(--ink-200)', padding: '0 28px', display: 'flex', gap: 4 }}>
        <TabBtn label="Shoes" count={initialShoes.length} active={activeTab === 'shoes'} onClick={() => setScreen({ tab: 'shoes', editing: null })} />
        <TabBtn label="Pages" count={pages.length} active={activeTab === 'pages'} onClick={() => setScreen({ tab: 'pages', editing: null, creating: false, editingRecs: null })} />
        <TabBtn label="Config" active={activeTab === 'config'} onClick={() => setScreen({ tab: 'config' })} />
        <TabBtn label="Users" active={activeTab === 'users'} onClick={() => setScreen({ tab: 'users' })} />
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>

        {/* Shoes */}
        {screen.tab === 'shoes' && screen.editing === null && (
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: 'var(--ink-900)' }}>Shoes</h1>
            <ShoeList shoes={initialShoes} onEdit={id => setScreen({ tab: 'shoes', editing: id })} />
          </div>
        )}
        {screen.tab === 'shoes' && screen.editing !== null && (() => {
          const shoe = initialShoes.find(s => s.id === screen.editing)
          return shoe ? <ShoeEditor shoe={shoe} onBack={() => setScreen({ tab: 'shoes', editing: null })} /> : null
        })()}

        {/* Pages */}
        {screen.tab === 'pages' && !screen.creating && screen.editing === null && screen.editingRecs === null && (
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: 'var(--ink-900)' }}>Pages</h1>
            <PageList
              pages={pages}
              onEdit={id => setScreen({ tab: 'pages', editing: id, creating: false, editingRecs: null })}
              onEditRecs={id => setScreen({ tab: 'pages', editing: null, creating: false, editingRecs: id })}
              onDelete={id => setPages(prev => prev.filter(p => p.id !== id))}
              onNew={() => setScreen({ tab: 'pages', editing: null, creating: true, editingRecs: null })}
            />
          </div>
        )}
        {screen.tab === 'pages' && screen.creating && (
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: 'var(--ink-900)' }}>New page</h1>
            <NewPageForm
              onCreated={page => { setPages(prev => [...prev, page]); setScreen({ tab: 'pages', editing: page.id, creating: false, editingRecs: null }) }}
              onCancel={() => setScreen({ tab: 'pages', editing: null, creating: false, editingRecs: null })}
            />
          </div>
        )}
        {screen.tab === 'pages' && !screen.creating && screen.editing !== null && screen.editingRecs === null && (() => {
          const page = pages.find(p => p.id === screen.editing)
          return page
            ? <PageEditor pageId={page.id} pageType={page.type} pageData={page.data} shoes={initialShoes} onBack={() => setScreen({ tab: 'pages', editing: null, creating: false, editingRecs: null })} />
            : null
        })()}
        {screen.tab === 'pages' && screen.editingRecs !== null && (() => {
          const pageId = screen.editingRecs
          const pageRecs: PersonaRecs[] = allPageRecs
            .filter(r => r.pageId === pageId)
            .map(r => JSON.parse(r.data) as PersonaRecs)
          return (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <button onClick={() => setScreen({ tab: 'pages', editing: null, creating: false, editingRecs: null })}
                  style={{ fontSize: 13, color: 'var(--ink-500)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  ← Pages
                </button>
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: 'var(--ink-900)' }}>Recommendations — {pageId}</h1>
              <div style={{ background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '24px 28px' }}>
                <RecsEditor
                  pageId={pageId}
                  initialRecs={pageRecs}
                  personas={personas}
                  goals={goals}
                  shoes={initialShoes}
                />
              </div>
            </div>
          )
        })()}

        {/* Config */}
        {screen.tab === 'config' && (
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: 'var(--ink-900)' }}>Config</h1>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '24px 28px' }}>
              <ConfigEditor config={config} />
            </div>
          </div>
        )}

        {/* Users */}
        {screen.tab === 'users' && (
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: 'var(--ink-900)' }}>Users</h1>
            <div style={{ background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '24px 28px' }}>
              <UserManager users={users} currentUser={currentUser} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
