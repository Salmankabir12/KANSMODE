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
  if (!type) return redirect('/admin?error=Missing+type');

  const typeDef = getTypeDef(type);
  if (!typeDef) return redirect(`/admin/content?error=Unknown+type+${type}`);

  const client = getSanityAdminClient(env);
  const doc: Record<string, any> = { _type: type };

  for (const field of typeDef.fields) {
    if (field.type === 'richText') continue;

    if (field.type === 'image') {
      const file = formData.get(field.name) as File | null;
      if (file && file.size > 0) {
        try {
          const asset = await client.assets.upload('image', file, {
            filename: file.name,
            contentType: file.type,
          });
          doc[field.name] = {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
          };
        } catch {
          // upload failed, skip field
        }
      }
      continue;
    }

    if (field.type === 'images') {
      const files = formData.getAll(field.name) as File[];
      const gallery: any[] = [];
      for (const file of files) {
        if (file && file.size > 0) {
          try {
            const asset = await client.assets.upload('image', file, {
              filename: file.name,
              contentType: file.type,
            });
            gallery.push({
              _type: 'image',
              asset: { _type: 'reference', _ref: asset._id },
              _key: `${field.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            });
          } catch {
            // skip failed uploads
          }
        }
      }
      if (gallery.length > 0) doc[field.name] = gallery;
      continue;
    }

    const value = formData.get(field.name);
    if (!value) {
      if (field.required) return redirect(`/admin/content/${type}/new?error=${encodeURIComponent(`${field.label} is required`)}`);
      continue;
    }
    const str = value.toString().trim();
    if (!str && field.required) return redirect(`/admin/content/${type}/new?error=${encodeURIComponent(`${field.label} is required`)}`);
    if (!str) continue;

    if (field.type === 'number') {
      doc[field.name] = Number(str);
    } else if (field.type === 'datetime') {
      doc[field.name] = new Date(str).toISOString();
    } else if (field.reference) {
      doc[field.name] = { _type: 'reference', _ref: str };
    } else if (field.type === 'tags') {
      doc[field.name] = str.split(',').map((t) => t.trim()).filter(Boolean);
    } else if (field.type === 'slug') {
      doc[field.name] = { _type: 'slug', current: str };
    } else if (field.name.startsWith('socialLinks.')) {
      const socialKey = field.name.replace('socialLinks.', '');
      if (!doc.socialLinks) doc.socialLinks = {};
      doc.socialLinks[socialKey] = str;
    } else {
      doc[field.name] = str;
    }
  }

  if (typeDef.slugFrom && !doc.slug) {
    const source = doc[typeDef.slugFrom];
    if (source) {
      doc.slug = {
        _type: 'slug',
        current: source.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      };
    }
  }

  try {
    await client.create(doc);
    return redirect(`/admin/content/${type}?created=1`);
  } catch (err: any) {
    const message = err?.message ?? 'Unknown error';
    return redirect(`/admin/content/${type}/new?error=${encodeURIComponent(message)}`);
  }
};
