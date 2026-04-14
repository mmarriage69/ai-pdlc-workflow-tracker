'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const CORRECT_PASSWORD = 'Bl00merang2026!'
const AUTH_COOKIE = 'pdlc-auth'

export async function loginAction(
  _prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const password = formData.get('password') as string

  if (password === CORRECT_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIE, '1', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      // 30-day session
      maxAge: 60 * 60 * 24 * 30,
    })
    redirect('/dashboard')
  }

  return 'Incorrect password. Please try again.'
}
