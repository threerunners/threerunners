import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySessionToken, AUTH_COOKIE } from '@/lib/auth'
import { getAllPages, getAllShoes, getAllAdminUsers, getAllConfig } from '@/lib/data'
import AdminPanel from './AdminPanel'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value
  if (!token) redirect('/admin/login')
  const currentUser = await verifySessionToken(token)
  if (!currentUser) redirect('/admin/login')

  const [pages, shoes, users, configRows] = await Promise.all([
    getAllPages(),
    getAllShoes(),
    getAllAdminUsers(),
    getAllConfig(),
  ])

  const sections = [
    // Pages
    ...pages.map(p => ({
      id: p.id,
      label: formatPageLabel(p.id, p.type),
      type: 'page' as const,
      pageType: p.type,
      description: `${p.type === 'hub' ? 'Hub' : 'Spoke'} page — hero, shoe picks, FAQ, editorial`,
      initialJson: JSON.stringify(JSON.parse(p.data), null, 2),
    })),
    // Shoes
    ...shoes.map(shoe => ({
      id: shoe.id,
      label: shoe.name,
      type: 'shoe' as const,
      description: 'Shoe specs, scores, editorial copy, tags',
      initialJson: JSON.stringify(shoe, null, 2),
    })),
    // Config
    ...configRows.map(r => ({
      id: r.key,
      label: formatConfigLabel(r.key),
      type: 'config' as const,
      description: `Config entry: ${r.key}`,
      initialJson: JSON.stringify(JSON.parse(r.value), null, 2),
    })),
    // Users section (virtual — no JSON, handled separately)
    {
      id: '__users__',
      label: 'Users',
      type: 'users' as const,
      description: 'Manage admin users',
    },
  ]

  return <AdminPanel sections={sections} users={users} currentUser={currentUser} />
}

function formatPageLabel(id: string, type: string): string {
  const map: Record<string, string> = {
    'marathon': 'Marathon Hub',
    'half-marathon': 'Half Marathon Hub',
    'marathon-beginners': 'Marathon for Beginners',
  }
  return map[id] ?? id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ') + (type === 'hub' ? ' Hub' : '')
}

function formatConfigLabel(key: string): string {
  const map: Record<string, string> = {
    personas: 'Runner Personas',
    goals: 'Running Goals',
  }
  return map[key] ?? key.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
}
