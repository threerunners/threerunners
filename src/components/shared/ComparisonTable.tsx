import type { SpokeComparisonRow } from '@/types/cms'

interface HubRow {
  label: string
  values: Array<string | boolean | number>
}

interface HubShoeCol {
  label: string
}

interface HubComparisonTableProps {
  variant: 'hub'
  rows: HubRow[]
  shoes: HubShoeCol[]
}

interface SpokeComparisonTableProps {
  variant: 'spoke'
  title?: string
  rows: SpokeComparisonRow[]
}

type ComparisonTableProps = HubComparisonTableProps | SpokeComparisonTableProps

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ width: 14, height: 14, color: 'var(--green-600)' }}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ width: 14, height: 14, color: 'var(--red-700)' }}>
      <line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  )
}

function renderCell(val: string | boolean | number) {
  if (val === true) return <CheckIcon />
  if (val === false) return <CrossIcon />
  return <span style={{ fontSize: 13, color: 'var(--ink-800)' }}>{val}</span>
}

export default function ComparisonTable(props: ComparisonTableProps) {
  if (props.variant === 'spoke') {
    const { title, rows } = props
    const headers = rows[0] ? Object.keys(rows[0]) : []
    return (
      <div>
        {title && (
          <h2 style={{
            fontFamily: 'inherit', fontWeight: 700, fontSize: 28, lineHeight: 1.15,
            letterSpacing: '-0.015em', margin: '0 0 18px', color: 'var(--ink-900)',
          }}>
            {title}
          </h2>
        )}
        <div className="table-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--ink-200)' }}>
                {headers.map((key) => (
                  <th key={key} style={{
                    padding: '10px 14px', textAlign: 'left',
                    fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                    color: 'var(--ink-500)', whiteSpace: 'nowrap',
                    background: 'var(--ink-50)',
                  }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--ink-150)', background: idx % 2 === 0 ? 'var(--paper)' : 'var(--ink-50)' }}>
                  {Object.values(row).map((val, cidx) => (
                    <td key={cidx} style={{
                      padding: '11px 14px', verticalAlign: 'middle',
                      fontWeight: cidx === 0 ? 600 : 400,
                      color: cidx === 0 ? 'var(--ink-900)' : 'var(--ink-700)',
                      whiteSpace: cidx <= 1 ? 'nowrap' : undefined,
                    }}>
                      {renderCell(val as string | boolean | number)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const { rows, shoes } = props
  return (
    <div className="table-scroll">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--ink-200)' }}>
            <th style={{
              padding: '10px 14px', textAlign: 'left', position: 'sticky', left: 0, zIndex: 1,
              fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
              color: 'var(--ink-500)', background: 'var(--ink-50)',
            }}>
              Criteria
            </th>
            {shoes.map((s, idx) => (
              <th key={idx} style={{
                padding: '10px 14px', textAlign: 'center',
                fontSize: 11.5, fontWeight: 700, color: 'var(--ink-800)',
                background: 'var(--ink-50)', whiteSpace: 'nowrap',
              }}>
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid var(--ink-150)', background: idx % 2 === 0 ? 'var(--paper)' : 'var(--ink-50)' }}>
              <td style={{
                padding: '11px 14px', fontWeight: 600, color: 'var(--ink-900)',
                position: 'sticky', left: 0, background: idx % 2 === 0 ? 'var(--paper)' : 'var(--ink-50)',
                whiteSpace: 'nowrap',
              }}>
                {row.label}
              </td>
              {row.values.map((val, vidx) => (
                <td key={vidx} style={{ padding: '11px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                  {renderCell(val)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
