'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid credentials')
      }
    } catch {
      setError('Network error — try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink-50)', display: 'grid', placeItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 380, padding: '0 20px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--orange-500)', color: 'var(--orange-200)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800 }}>MR</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink-900)' }}>The Run Down</span>
        </div>

        <div style={{ background: 'var(--paper)', border: '1px solid var(--ink-200)', borderRadius: 'var(--radius-lg)', padding: '32px 28px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: 'var(--ink-900)', textAlign: 'center' }}>Admin sign in</h1>
          <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '0 0 24px', textAlign: 'center' }}>
            Credentials set in Vercel environment variables
          </p>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-700)', marginBottom: 6 }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius)',
                  border: '1.5px solid var(--ink-200)', fontSize: 14, color: 'var(--ink-900)',
                  background: 'var(--paper)', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--ink-700)', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius)',
                  border: '1.5px solid var(--ink-200)', fontSize: 14, color: 'var(--ink-900)',
                  background: 'var(--paper)', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#b91c1c' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '11px', borderRadius: 'var(--radius)',
                background: loading ? 'var(--ink-300)' : 'var(--orange-500)',
                color: 'var(--orange-200)', fontSize: 14, fontWeight: 600,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 4,
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
