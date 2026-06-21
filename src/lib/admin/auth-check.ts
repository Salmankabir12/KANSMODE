import { COOKIE_NAME, getSessionSecret, getRuntimeEnv, verifySession } from './auth'
import type { AstroGlobal } from 'astro'

export async function requireAdmin(Astro: Readonly<AstroGlobal>): Promise<boolean> {
  const env = await getRuntimeEnv()
  const session = Astro.cookies.get(COOKIE_NAME)?.value
  const secret = getSessionSecret(env)
  const isLoggedIn = secret ? await verifySession(session, secret) : false

  if (!isLoggedIn) {
    return Astro.redirect('/admin')
  }
  return true
}
