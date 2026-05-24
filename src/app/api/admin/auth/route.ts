import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/data'
import { verifyPassword, createSessionToken, AUTH_COOKIE } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
    }

    const user = await getAdminUser(username)
    if (!user) {
      // Constant-time-ish: still hash even on miss to avoid timing oracle
      await verifyPassword(password, 'x:x')
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createSessionToken(username)

    const res = NextResponse.json({ ok: true })
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86_400, // 24h
      path: '/',
    })
    return res
  } catch (err) {
    console.error('Auth error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
