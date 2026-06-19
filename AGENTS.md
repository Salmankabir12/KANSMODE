# Kans Mode Website — AGENTS.md

## Stack

| Aspect | Choice |
|---|---|
| Framework | **Astro v6** (SSR, `output: 'server'`) |
| Adapter | `@astrojs/cloudflare` (defaults) |
| UI islands | **React 19** + **Svelte 5** co-existing |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite` plugin) |
| CMS | **Sanity** (project `c4c751hn`, dataset `production`, 11 content types) |
| Database | Cloudflare D1 (`DB` binding, `kansmode-contacts`) |
| Email | Resend (raw fetch) |
| 3D | Three.js / @react-three/fiber / D3-geo globe |
| Auth | Custom HMAC-SHA256 cookie (admin panel) |
| Forms | Zod v4 validation |
| Fonts | Self-hosted Inter + Plus Jakarta Sans (woff2) |

## Commands

```bash
npm run dev         # astro dev
npm run build       # astro build + post-processing (see quirks)
npm run preview     # astro preview

# Sanity Studio (separate project in studio/)
cd studio && npm run dev      # sanity dev
cd studio && npm run build    # sanity build
cd studio && npm run deploy   # sanity deploy

# Production secrets (Cloudflare Pages)
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
npx wrangler secret put SANITY_API_TOKEN
npx wrangler secret put RESEND_API_KEY

# Local worker dev (for D1 + secrets)
npx wrangler dev
```

No test, lint, format, or typecheck scripts.

## Build — custom post-processing

`npm run build` runs `astro build` then a Node script that:
1. Creates `dist/_worker.js` (wrapper importing `./server/entry.mjs`)
2. Copies `dist/client/_astro` → `dist/_astro` and `dist/client/assets` → `dist/assets`
3. Deletes `dist/server/wrangler.json`, `dist/server/.prerender/wrangler.json`, `dist/client/`, `.wrangler/`
4. Writes `_worker.js > dist/.assetsignore`

This manually rearranges the Cloudflare adapter output for `_worker.js`-based deployment.

## D1 binding

API routes use Astro Cloudflare locals pattern:
```ts
const db = (locals as any).runtime?.env?.DB
```

Single table `contacts` in `db/schema.sql`.

## Environment

| Var | Type | Notes |
|---|---|---|
| `PUBLIC_SITE_URL` | Public (committed) | Fallback `https://kansmode-website.pages.dev` |
| `PUBLIC_SANITY_PROJECT_ID` | Public | `c4c751hn` |
| `PUBLIC_SANITY_DATASET` | Public | `production` |
| `ADMIN_PASSWORD` | **Secret** | wrangler secret |
| `ADMIN_SESSION_SECRET` | **Secret** | min 32 chars |
| `SANITY_API_TOKEN` | **Secret** | Editor role write token |
| `RESEND_API_KEY` | **Secret** | Resend |
| `ADMIN_EMAIL` | **Secret** | default `info@kansmode.com` |
| `FROM_EMAIL` | **Secret** | default `contact@kansmode.com` |

**Two different env-reading mechanisms coexist:**
- Admin auth uses `getRuntimeEnv()` (tries `cloudflare:workers` import, falls back to `import.meta.env`)
- Contact form uses `(locals as any).runtime?.env?.RESEND_API_KEY`

## Architecture quirks

- **LiquidEther.tsx** (933 lines) — full Navier-Stokes fluid simulation in inline GLSL + Three.js. Not from an npm package.
- **GlobeViz** — uses D3-geo orthographic SVG, NOT Three.js. The "3D" scene is CSS perspective + keyframes.
- **Placeholder fallback** — every page falls back to `src/data/placeholders.ts` if Sanity returns empty. Site looks complete even with empty CMS.
- **Admin auth is custom** — HMAC-SHA256 cookie, no JWT/Passport. 24h expiry.
- **Sanity Studio** deployed at `https://kansmode-cms.sanity.studio`
- **Unused components** exist — `PartnersStrip.svelte`, `CTABanner.svelte`, `TiltCard.svelte`, `LucideIcon.svelte`, `MagicBento.tsx` — not imported anywhere.
- **Lenis smooth scroll** injected via inline `<script>` in `BaseLayout.astro`.
- **Tailwind v4 `@theme`** — custom tokens defined in `global.css`. Keyframes duplicated inside and outside `@theme` (Tailwind v4 quirk).
- **Fonts** self-hosted with `unicode-range` optimization.

## Sanity (studio/)

- 11 schema types, project ID `c4c751hn`, dataset `production`
- Pre-deployed studio app ID: `zkgzhm5pzjin6d66u4xegstd`
- Live at `https://kansmode-cms.sanity.studio`

## Path alias

`@/*` → `src/*` (used throughout)
