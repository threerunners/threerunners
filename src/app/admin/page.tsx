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

  const [pages, shoes, users, config] = await Promise.all([
    getAllPages(),
    getAllShoes(),
    getAllAdminUsers(),
    getAllConfig(),
  ])

  return (
    <AdminPanel
      shoes={shoes}
      pages={pages}
      config={config}
      users={users}
      currentUser={currentUser}
    />
  )
}
