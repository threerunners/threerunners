import type { EditorialBox } from '@/types/cms'

function CushionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
    </svg>
  )
}

function SpecIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 18, height: 18 }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

const iconMap: Record<string, () => JSX.Element> = {
  cushion: CushionIcon,
  spec: SpecIcon,
  profile: ProfileIcon,
}

interface EditorialBoxesProps {
  heading?: string
  boxes: EditorialBox[]
}

export default function EditorialBoxes({ heading, boxes }: EditorialBoxesProps) {
  return (
    <div>
      {heading && (
        <h2 style={{
          fontFamily: 'inherit', fontSize: 28, fontWeight: 700, letterSpacing: '-0.015em',
          margin: '0 0 24px', color: 'var(--ink-900)',
        }}>
          {heading}
        </h2>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {boxes.map((box, idx) => {
          const Icon = iconMap[box.icon] || SpecIcon
          return (
            <div key={idx} style={{
              background: 'var(--paper)', border: '1px solid var(--ink-200)',
              borderRadius: 'var(--radius-lg)', padding: '22px 24px',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'var(--orange-50)', color: 'var(--orange-600)',
                display: 'grid', placeItems: 'center', marginBottom: 14,
              }}>
                <Icon />
              </div>
              <h3 style={{
                fontFamily: 'inherit', fontWeight: 700, fontSize: 15.5, lineHeight: 1.35,
                color: 'var(--ink-900)', margin: '0 0 10px', letterSpacing: '-0.005em',
              }}>
                {box.heading}
              </h3>
              <p style={{ fontSize: 13.5, color: 'var(--ink-600)', lineHeight: 1.6, margin: 0 }}>
                {box.body}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
