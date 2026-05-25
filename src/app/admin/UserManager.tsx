'use client'

import { useState, useTransition } from 'react'
import { addUserAction, removeUserAction } from './actions'

const inp: React.CSSProperties = {
  padding: '9px 12px', borderRadius: 'var(--radius)', border: '1.5px solid var(--ink-200)',
  fontSize: 13.5, outline: 'none', width: '100%', boxSizing: 'border-box',
}

export default function UserManager({
  users, currentUser,
}: {
  users: Array<{ username: string; createdAt: number }>
  currentUser: string
}) {
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
        setStatus('User added — refresh to see updated list')
      } catch (e) { setStatus('Error: ' + (e as Error).message) }
    })
  }

  function removeUser(username: string) {
    if (!confirm(`Delete user "${username}"?`)) return
    startTransition(async () => {
      try {
        await removeUserAction(username)
        setStatus(`Deleted ${username} — refresh to update list`)
      } catch (e) { setStatus('Error: ' + (e as Error).message) }
    })
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 24px' }}>
        Manage who can log in to the admin panel.
      </p>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-500)', marginBottom: 10 }}>Current users</div>
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
                    {u.username === currentUser && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--ink-500)', fontWeight: 400 }}>(you)</span>}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-400)' }}>Added {new Date(u.createdAt * 1000).toLocaleDateString('en-GB')}</div>
                </div>
              </div>
              {u.username !== currentUser && (
                <button onClick={() => removeUser(u.username)} disabled={isPending}
                  style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: '#b91c1c', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius)', padding: '18px 20px' }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)', marginBottom: 14 }}>Add new user</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <input placeholder="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} style={inp} />
          <input type="password" placeholder="Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inp} />
        </div>
        <button onClick={addUser} disabled={isPending || !newUsername || !newPassword}
          style={{ padding: '9px 20px', borderRadius: 'var(--radius)', border: 'none', background: 'var(--orange-500)', color: 'var(--orange-200)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
          {isPending ? 'Adding…' : 'Add user'}
        </button>
        {status && <div style={{ marginTop: 10, fontSize: 13, color: status.startsWith('Error') ? 'var(--red-700)' : 'var(--green-600)' }}>{status}</div>}
      </div>
    </div>
  )
}
