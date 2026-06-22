# Admin Panel — Kans Mode Website

## Stack
- Astro 6 SSR (same as main site)
- HMAC-SHA256 cookie auth (existing)
- Sanity write API (via `@sanity/client`)
- Cloudflare D1 (contact messages)
- Tailwind CSS v4 (dark theme)

## Routes

| Route | Method | Purpose |
|---|---|---|
| `/admin` | GET | Login page |
| `/admin/dashboard` | GET | Stats overview |
| `/admin/content/[type]` | GET | Table listing of documents |
| `/admin/content/[type]/new` | GET | Create form |
| `/admin/content/[type]/[id]/edit` | GET | Edit form |
| `/admin/content/[type]/[id]/delete` | POST | Delete with confirmation |
| `/admin/messages` | GET | Contact submissions from D1 |
| `/admin/messages/[id]` | GET | Single message detail |
| `/admin/settings` | GET | Site settings editor |
| `/api/admin/login` | POST | Authenticate |
| `/api/admin/logout` | POST | Clear session |
| `/api/admin/content/create` | POST | Create document + upload assets |
| `/api/admin/content/update` | POST | Patch document |
| `/api/admin/content/delete` | POST | Delete document |
| `/api/admin/upload` | POST | Upload image to Sanity |

## Content Types (10)

heroBanner, service, productCategory, productSubcategory, product, teamMember, client, testimonial, post, siteSettings

Each type has a field definition config mapping field names to input types (text, textarea, number, select, image, datetime, richText).

## Layout

Sidebar (left) + header (top) + content area.
Dark theme: `bg-slate-950 text-white` with indigo accents.

Sidebar sections:
- Dashboard
- Content (collapsible list of all 9 content types)
- Messages
- Settings

## Data Flow

```
Admin page → check HMAC cookie → render
Form POST → API endpoint → auth check → Sanity/D1 operation → redirect
Image upload → POST /api/admin/upload → Sanity client.assets.upload() → JSON with asset ID
```

## Key Implementation Details

1. **Dynamic content forms** — Single set of page templates driven by a field config (`src/lib/admin/fields.ts`), not 10 separate form pages
2. **Image upload** — via Sanity's `client.assets.upload('image', file)` API
3. **Rich text / Portable Text** — fields marked as `richText` show a link to Sanity Studio; not built as an inline editor
4. **D1 contact messages** — queried via `(locals as any).runtime?.env?.DB` (matching existing contact form pattern)
5. **Auth** — reused from existing `auth.ts` with extracted middleware helper

## Deployment

- `www.kansmode.com` connected to Cloudflare Pages
- Required secrets: `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `SANITY_API_TOKEN`
- Preview domain (`650d54fe.kansmode-website.pages.dev`) already works with Cloudflare Pages
