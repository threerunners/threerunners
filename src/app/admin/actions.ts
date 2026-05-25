'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { verifySessionToken, hashPassword, AUTH_COOKIE } from '@/lib/auth'
import {
  upsertPage, upsertShoe, upsertConfig, deletePage,
  createAdminUser, deleteAdminUser, getAllAdminUsers,
} from '@/lib/data'

async function requireAuth(): Promise<string> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value
  if (!token) throw new Error('Not authenticated')
  const username = await verifySessionToken(token)
  if (!username) throw new Error('Session expired')
  return username
}

export async function savePageAction(id: string, type: string, json: string) {
  await requireAuth()
  JSON.parse(json)
  await upsertPage(id, type, json)
  revalidatePath(`/${id === 'marathon-beginners' ? 'marathon/beginners' : id}`)
}

export async function deletePageAction(id: string) {
  await requireAuth()
  await deletePage(id)
  revalidatePath('/')
}

export async function saveShoeAction(id: string, json: string) {
  await requireAuth()
  JSON.parse(json)
  await upsertShoe(id, json)
  revalidatePath('/marathon')
  revalidatePath('/half-marathon')
}

export async function saveConfigAction(key: string, json: string) {
  await requireAuth()
  JSON.parse(json)
  await upsertConfig(key, json)
}

export async function addUserAction(username: string, password: string) {
  await requireAuth()
  if (!username.trim() || !password) throw new Error('Username and password required')
  const ph = await hashPassword(password)
  await createAdminUser(username.trim(), ph)
}

export async function removeUserAction(username: string) {
  const currentUser = await requireAuth()
  if (username === currentUser) throw new Error('Cannot delete your own account')
  const all = await getAllAdminUsers()
  if (all.length <= 1) throw new Error('Cannot delete the last admin user')
  await deleteAdminUser(username)
}
