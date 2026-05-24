import Link from 'next/link'

interface Crumb {
  label: string
  url?: string
}

interface BreadcrumbNavProps {
  crumbs: Crumb[]
}

export default function BreadcrumbNav({ crumbs }: BreadcrumbNavProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
        fontSize: 12.5, color: 'var(--ink-500)', marginBottom: 18, letterSpacing: '.005em',
      }}
    >
      {crumbs.map((crumb, idx) => (
        <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {idx > 0 && (
            <span style={{ color: 'var(--ink-300)', userSelect: 'none' }} aria-hidden="true">/</span>
          )}
          {crumb.url ? (
            <Link
              href={crumb.url}
              style={{
                color: 'var(--ink-600)',
                borderBottom: '1px solid transparent',
                transition: 'color .1s, border-color .1s',
              }}
              aria-current={idx === crumbs.length - 1 ? 'page' : undefined}
            >
              {crumb.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--ink-900)', fontWeight: 500 }} aria-current="page">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
