import SiteNav from '@/components/nav/SiteNav'
import SiteFooter from '@/components/shared/SiteFooter'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main style={{ background: 'var(--bg)', minHeight: '60vh', paddingTop: 24 }}>
        {children}
      </main>
      <SiteFooter />
    </>
  )
}
