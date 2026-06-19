import type { APIRoute } from 'astro';
import { createSession, getAdminPassword, getSessionSecret, COOKIE_NAME } from '@/lib/admin/auth';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const password = getAdminPassword();
  const secret = getSessionSecret();

  if (!password || !secret) {
    return new Response('Admin auth is not configured', { status: 500 });
  }

  const formData = await request.formData();
  const input = formData.get('password')?.toString() ?? '';

  if (input !== password) {
    return redirect('/admin?error=1');
  }

  const session = await createSession(secret);
  cookies.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return redirect('/admin/dashboard');
};
