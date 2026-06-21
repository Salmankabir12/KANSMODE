import type { APIRoute } from 'astro';
import { getSanityAdminClient, isSanityWriteConfigured } from '@/lib/admin/sanity';
import { COOKIE_NAME, getSessionSecret, getRuntimeEnv, verifySession } from '@/lib/admin/auth';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const env = await getRuntimeEnv();
  const session = cookies.get(COOKIE_NAME)?.value;
  const secret = getSessionSecret(env);
  const isLoggedIn = secret ? await verifySession(session, secret) : false;

  if (!isLoggedIn) return redirect('/admin');
  if (!isSanityWriteConfigured(env)) return redirect('/admin?error=API+token+not+configured');

  const formData = await request.formData();
  const type = formData.get('_type')?.toString();
  const id = formData.get('_id')?.toString();
  if (!type || !id) return redirect('/admin?error=Missing+type+or+id');

  try {
    const client = getSanityAdminClient(env);
    await client.delete(id);
    return redirect(`/admin/content/${type}?deleted=1`);
  } catch (err: any) {
    const message = err?.message ?? 'Unknown error';
    return redirect(`/admin/content/${type}?error=${encodeURIComponent(message)}`);
  }
};
