'use client'

import { useState } from 'react'
import type { SubNavTab } from '@/types/cms'

interface SubNavTabsProps {
  tabs: SubNavTab[]
}

export default function SubNavTabs({ tabs }: SubNavTabsProps) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.filterKey || '')

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        display: 'flex', gap: 4, borderBottom: '2px solid var(--ink-150)',
        overflowX: 'auto',
      }}>
        {tabs.map(tab => {
          const active = activeKey === tab.filterKey
          return (
            <button
              key={tab.filterKey}
              onClick={() => setActiveKey(tab.filterKey)}
              style={{
                padding: '10px 18px', fontSize: 13.5, fontWeight: 600,
                cursor: 'pointer', border: 'none', background: 'transparent',
                color: active ? 'var(--orange-500)' : 'var(--ink-500)',
                borderBottom: active ? '2px solid var(--orange-500)' : '2px solid transparent',
                marginBottom: -2, whiteSpace: 'nowrap', transition: 'color .15s',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
