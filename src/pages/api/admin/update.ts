import type { APIRoute } from 'astro';
import { getSanityAdminClient, isSanityWriteConfigured } from '@/lib/admin/sanity';
import { COOKIE_NAME, getSessionSecret, getRuntimeEnv, verifySession } from '@/lib/admin/auth';

export const POST: APIRoute = async ({ request, cookies, redirect, locals }) => {
  const env = await getRuntimeEnv();
  const session = cookies.get(COOKIE_NAME)?.value;
  const secret = getSessionSecret(env);
  const isLoggedIn = secret ? await verifySession(session, secret) : false;

  if (!isLoggedIn) {
    return redirect('/admin');
  }

  if (!isSanityWriteConfigured(env)) {
    return redirect('/admin/settings?error=Sanity+API+token+not+configured');
  }

  const formData = await request.formData();
  const type = formData.get('type')?.toString();
  const id = formData.get('id')?.toString();

  if (!type || !id) {
    return redirect('/admin/settings?error=Missing+type+or+id');
  }

  const patch: Record<string, any> = {};
  const unset: string[] = [];

  formData.forEach((value, key) => {
    if (key === 'type' || key === 'id') return;
    const str = value.toString();

    if (key === 'phones') {
      patch[key] = str.split(',').map((p) => p.trim()).filter(Boolean);
      if (patch[key].length === 0) unset.push(key);
    } else if (key.startsWith('socialLinks.')) {
      const socialKey = key.replace('socialLinks.', '');
      if (!patch.socialLinks) patch.socialLinks = {};
      patch.socialLinks[socialKey] = str || undefined;
    } else if (key === 'order') {
      patch[key] = Number(str);
    } else {
      patch[key] = str || undefined;
    }
  });

  // Remove undefined values so they get unset instead of becoming empty strings
  Object.keys(patch).forEach((k) => {
    if (patch[k] === undefined) {
      delete patch[k];
      unset.push(k);
    }
  });

  if (patch.socialLinks) {
    Object.keys(patch.socialLinks).forEach((k) => {
      if (patch.socialLinks[k] === undefined) {
        delete patch.socialLinks[k];
      }
    });
    if (Object.keys(patch.socialLinks).length === 0) {
      delete patch.socialLinks;
      unset.push('socialLinks');
    }
  }

  try {
    const sanityAdminClient = getSanityAdminClient(env);
    const doc = sanityAdminClient.patch(id);
    if (Object.keys(patch).length > 0) doc.set(patch);
    if (unset.length > 0) doc.unset(unset);
    await doc.commit();
    return redirect('/admin/settings?success=1');
  } catch (err: any) {
    const message = err?.message ?? 'Unknown error';
    return redirect(`/admin/settings?error=${encodeURIComponent(message)}`);
  }
};
