import type { APIRoute } from 'astro';
import { getSanityAdminClient, isSanityWriteConfigured } from '@/lib/admin/sanity';
import { COOKIE_NAME, getSessionSecret, getRuntimeEnv, verifySession } from '@/lib/admin/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const env = await getRuntimeEnv();
  const session = cookies.get(COOKIE_NAME)?.value;
  const secret = getSessionSecret(env);
  const isLoggedIn = secret ? await verifySession(session, secret) : false;

  if (!isLoggedIn) return new Response('Unauthorized', { status: 401 });
  if (!isSanityWriteConfigured(env)) return new Response('API token not configured', { status: 500 });

  const formData = await request.formData();
  const file = formData.get('image') as File | null;
  if (!file) return new Response('No image file provided', { status: 400 });

  try {
    const client = getSanityAdminClient(env);
    const asset = await client.assets.upload('image', file, {
      filename: file.name,
      contentType: file.type,
    });
    return new Response(JSON.stringify({ _id: asset._id, url: asset.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
