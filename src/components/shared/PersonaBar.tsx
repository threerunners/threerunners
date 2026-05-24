'use client'

import { useState, useEffect } from 'react'
import type { Persona } from '@/types/cms'

interface PersonaBarProps {
  personas: Persona[]
  defaultPersona?: string
}

const STORAGE_KEY = 'runnerPersona'

export default function PersonaBar({ personas, defaultPersona }: PersonaBarProps) {
  const [selected, setSelected] = useState<string>(defaultPersona || personas[0]?.id || '')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && personas.find(p => p.id === saved)) {
      setSelected(saved)
    }
  }, [personas])

  function selectPersona(id: string) {
    setSelected(id)
    localStorage.setItem(STORAGE_KEY, id)
  }

  return (
    <div style={{
      background: 'var(--paper)', border: '1px solid var(--ink-150)',
      borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: 32,
    }}>
      <div style={{
        fontSize: 11.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
        color: 'var(--ink-500)', marginBottom: 14,
      }}>
        I&rsquo;m a…
      </div>
      <div className="chip-row-scroll" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {personas.map(persona => {
          const active = selected === persona.id
          return (
            <button
              key={persona.id}
              onClick={() => selectPersona(persona.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '9px 16px', borderRadius: 'var(--radius-pill)',
                fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                border: active ? '2px solid var(--orange-500)' : '2px solid var(--ink-200)',
                background: active ? 'var(--orange-500)' : 'transparent',
                color: active ? 'var(--orange-200)' : 'var(--ink-700)',
                transition: 'all .15s',
              }}
            >
              <span>{persona.emoji}</span>
              {persona.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
