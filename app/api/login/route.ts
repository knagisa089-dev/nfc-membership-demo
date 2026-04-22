import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

  if (body.password !== 'demo1234') {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('auth', 'demo1234', {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return response
}