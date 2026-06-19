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
    return redirect('/admin/create?error=Sanity+API+token+not+configured');
  }

  const formData = await request.formData();
  const type = formData.get('type')?.toString();

  if (!type) {
    return redirect('/admin/create?error=Missing+type');
  }

  const doc: Record<string, any> = {
    _type: type,
  };

  formData.forEach((value, key) => {
    if (key === 'type') return;
    const str = value.toString();
    if (!str) return;

    if (key === 'order') {
      doc[key] = Number(str);
    } else if (key === 'category') {
      doc[key] = { _type: 'reference', _ref: str };
    } else if (key === 'publishedAt') {
      doc[key] = new Date(str).toISOString();
    } else {
      doc[key] = str;
    }
  });

  // Generate slug for types that need one
  if (['productCategory', 'productSubcategory', 'product', 'post', 'heroBanner'].includes(type) && !doc.slug && doc.name) {
    doc.slug = { _type: 'slug', current: doc.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') };
  }
  if (type === 'post' && !doc.slug && doc.title) {
    doc.slug = { _type: 'slug', current: doc.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') };
  }

  // Product needs name field, slug generated from name already
  // Ensure subcategory has category reference; if missing, redirect
  if (type === 'productSubcategory' && !doc.category) {
    return redirect('/admin/create?type=productSubcategory&error=Category+is+required');
  }
  if (type === 'product' && !doc.category) {
    return redirect('/admin/create?type=product&error=Category+is+required');
  }

  try {
    const sanityAdminClient = getSanityAdminClient(env);
    await sanityAdminClient.create(doc);
    return redirect(`/admin/create?type=${type}&success=1`);
  } catch (err: any) {
    const message = err?.message ?? 'Unknown error';
    return redirect(`/admin/create?type=${type}&error=${encodeURIComponent(message)}`);
  }
};
