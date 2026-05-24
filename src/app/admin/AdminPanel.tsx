'use client'

import { useState, useTransition } from 'react'
import { savePageAction, saveShoeAction, saveConfigAction, addUserAction, removeUserAction } from './actions'

interface Section {
  id: string
  label: string
  type: 'page' | 'shoe' | 'config' | 'users'
  pageType?: string
  description: string
  initialJson?: string
}

interface AdminPanelProps {
  sections: Section[]
  users: Array<{ username: string; createdAt: number }>
  currentUser: string
}

function JsonEditor({ section }: { section: Section }) {
  const [json, setJson] = useState(section.initialJson || '')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()

  async function save() {
    setStatus('saving')
    setErrorMsg('')
    try {
      JSON.parse(json) // client-side validation
    } catch (e) {
      setStatus('error')
      setErrorMsg('Invalid JSON: ' + (e as Error).message)
      return
    }
    startTransition(async () => {
      try {
        if (section.type === 'page') await savePageAction(section.id, section.pageType!, json)
        else if (section.type === 'shoe') await saveShoeAction(section.id, json)
        else if (section.type === 'config') await saveConfigAction(section.id, json)
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2000)
      } catch (e) {
        setStatus('error')
        setErrorMsg((e as Error).message)
      }
    })
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 14px' }}>{section.description}</p>
      <textarea
        value={json}
        onChange={e => { setJson(e.target.value); setStatus('idle') }}
        spellCheck={false}
        style={{
          width: '100%', minHeight: 420, fontFamily: 'monospace', fontSize: 12.5,
          lineHeight: 1.6, padding: 16, borderRadius: 'var(--radius)',
          border: '1.5px solid var(--ink-200)', background: 'var(--ink-50)',
          color: 'var(--ink-900)', resize: 'vertical', boxSizing: 'border-box', outline: 'none',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
        <button
          onClick={save}
          disabled={isPending || status === 'saving'}
          style={{
            padding: '9px 22px', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer',
            background: status === 'saved' ? 'var(--green-600)' : 'var(--orange-500)',
            color: 'var(--orange-200)', fontSize: 13.5, fontWeight: 600,
          }}
        >
          {status === 'saving' || isPending ? 'Saving…' : status === 'saved' ? '✓ Saved' : 'Save to Turso'}
        </button>
        {status === 'error' && (
          <span style={{ fontSize: 13, color: 'var(--red-700)' }}>{errorMsg}</span>
        )}
      </div>
    </div>
  )
}

function UserManager({ users, currentUser }: { users: AdminPanelProps['users']; currentUser: string }) {
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [status, setStatus] = useState('')
  const [isPending, startTransition] = useTransition()

  function addUser() {
    setStatus('')
    startTransition(async () => {
      try {
        await addUserAction(newUsername, newPassword)
        setNewUsername('')
        setNewPassword('')
        setStatus('User added — refresh to see')
      } catch (e) {
        setStatus('Error: ' + (e as Error).message)
      }
    })
  }

  function removeUser(username: string) {
    if (!confirm(`Delete user "${username}"?`)) return
    startTransition(async () => {
      try {
        await removeUserAction(username)
        setStatus(`Deleted ${username} — refresh to update list`)
      } catch (e) {
        setStatus('Error: ' + (e as Error).message)
      }
    })
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 20px' }}>
        Manage who can log in to the admin panel.
      </p>

      {/* Current users */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 10 }}>
          Current users
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {users.map(u => (
            <div key={u.username} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--ink-50)', borderRadius: 'var(--radius)', padding: '10px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--orange-500)', color: 'var(--orange-200)', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>
                  {u.username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-900)' }}>
                    {u.username}
                    {u.username === currentUser && (
                      <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--ink-500)', fontWeight: 400 }}>(you)</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-400)' }}>
                    Added {new Date(u.createdAt * 1000).toLocaleDateString('en-GB')}
                  </div>
                </div>
              </div>
              {u.username !== currentUser && (
                <button
                  onClick={() => removeUser(u.username)}
                  disabled={isPending}
                  style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: '#b91c1c', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add user */}
      <div style={{ background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', padding: '18px 20px' }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)', marginBottom: 14 }}>Add new user</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <input
            placeholder="Username"
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
            style={{ padding: '9px 12px', borderRadius: 'var(--radius)', border: '1.5px solid var(--ink-200)', fontSize: 13.5, outline: 'none' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            style={{ padding: '9px 12px', borderRadius: 'var(--radius)', border: '1.5px solid var(--ink-200)', fontSize: 13.5, outline: 'none' }}
          />
        </div>
        <button
          onClick={addUser}
          disabled={isPending || !newUsername || !newPassword}
          style={{ padding: '9px 20px', borderRadius: 'var(--radius)', border: 'none', background: 'var(--orange-500)', color: 'var(--orange-200)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}
        >
          {isPending ? 'Adding…' : 'Add user'}
        </button>
        {status && <div style={{ marginTop: 10, fontSize: 13, color: status.startsWith('Error') ? 'var(--red-700)' : 'var(--green-600)' }}>{status}</div>}
      </div>
    </div>
  )
}

export default function AdminPanel({ sections, users, currentUser }: AdminPanelProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id || '')
  const activeSection = sections.find(s => s.id === activeId)

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
          <button onClick={logout} style={{ fontSize: 12.5, color: 'rgba(157,255,197,.75)', background: 'none', border: '1px solid rgba(157,255,197,.3)', padding: '5px 12px', borderRadius: 6, cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', maxWidth: 1200, margin: '0 auto', padding: 24, gap: 24, alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <nav style={{ width: 220, flexShrink: 0, background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '12px 8px', position: 'sticky', top: 24 }}>
          {[
            { heading: 'Pages', ids: sections.filter(s => s.type === 'page').map(s => s.id) },
            { heading: 'Shoe data', ids: sections.filter(s => s.type === 'shoe').map(s => s.id) },
            { heading: 'Config', ids: sections.filter(s => s.type === 'config').map(s => s.id) },
            { heading: 'Users', ids: sections.filter(s => s.type === 'users').map(s => s.id) },
          ].map(group => group.ids.length > 0 && (
            <div key={group.heading} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-400)', padding: '4px 12px', marginBottom: 2 }}>
                {group.heading}
              </div>
              {group.ids.map(id => {
                const s = sections.find(x => x.id === id)!
                return (
                  <button key={id} onClick={() => setActiveId(id)} style={{ width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: activeId === id ? 'var(--orange-50)' : 'transparent', color: activeId === id ? 'var(--orange-700)' : 'var(--ink-700)', fontSize: 13.5, fontWeight: activeId === id ? 600 : 400, display: 'block', marginBottom: 2 }}>
                    {s.label}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Main panel */}
        <div style={{ flex: 1 }}>
          <div style={{ background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '24px 28px' }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: 'var(--ink-900)' }}>
              {activeSection?.label}
            </h1>

            {activeSection?.type === 'users' ? (
              <UserManager users={users} currentUser={currentUser} />
            ) : activeSection ? (
              <JsonEditor section={activeSection} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
