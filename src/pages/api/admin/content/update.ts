import type { APIRoute } from 'astro';
import { getSanityAdminClient, isSanityWriteConfigured } from '@/lib/admin/sanity';
import { COOKIE_NAME, getSessionSecret, getRuntimeEnv, verifySession } from '@/lib/admin/auth';
import { getTypeDef } from '@/lib/admin/fields';

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

  const typeDef = getTypeDef(type);
  if (!typeDef) return redirect(`/admin/content?error=Unknown+type`);

  const client = getSanityAdminClient(env);
  const patch: Record<string, any> = {};
  const unset: string[] = [];

  for (const field of typeDef.fields) {
    if (field.type === 'image' || field.type === 'images' || field.type === 'richText') continue;
    const value = formData.get(field.name);

    if (!value || value instanceof File) {
      unset.push(field.name);
      continue;
    }
    const str = value.toString().trim();
    if (!str) {
      unset.push(field.name);
      continue;
    }

    if (field.type === 'number') {
      patch[field.name] = Number(str);
    } else if (field.type === 'datetime') {
      patch[field.name] = new Date(str).toISOString();
    } else if (field.reference) {
      patch[field.name] = { _type: 'reference', _ref: str };
    } else if (field.type === 'tags') {
      patch[field.name] = str.split(',').map((t) => t.trim()).filter(Boolean);
    } else if (field.type === 'slug') {
      patch[field.name] = { _type: 'slug', current: str };
    } else if (field.name.startsWith('socialLinks.')) {
      const socialKey = field.name.replace('socialLinks.', '');
      if (!patch.socialLinks) patch.socialLinks = {};
      patch.socialLinks[socialKey] = str;
    } else {
      patch[field.name] = str;
    }
  }

  try {
    const doc = client.patch(id);
    if (Object.keys(patch).length > 0) doc.set(patch);
    if (unset.length > 0) doc.unset(unset);
    await doc.commit();
    return redirect(`/admin/content/${type}?updated=1`);
  } catch (err: any) {
    const message = err?.message ?? 'Unknown error';
    return redirect(`/admin/content/${type}/${id}/edit?error=${encodeURIComponent(message)}`);
  }
};
