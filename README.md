# Kans Mode International Website

Built with Astro v6 + React 19 + Svelte 5 + Tailwind v4, deployed on Cloudflare Pages with D1 and Sanity CMS.

## Stack

- **Framework:** Astro v6 (SSR)
- **UI Islands:** React 19 + Svelte 5
- **Styling:** Tailwind CSS v4
- **CMS:** Sanity (`c4c751hn` / `production`)
- **Database:** Cloudflare D1 (contact form)
- **Email:** Resend (optional)
- **Hosting:** Cloudflare Pages

## Development

```bash
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env` and fill in:

```
PUBLIC_SITE_URL=https://www.kansmode.com
PUBLIC_SANITY_PROJECT_ID=c4c751hn
PUBLIC_SANITY_DATASET=production
```

For local contact form email notifications, copy `.dev.vars.example` to `.dev.vars`:

```
RESEND_API_KEY=re_...
```

## Build & Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=kansmode-website --branch=main
```

## Sanity Studio

```bash
cd studio
npm install
npm run dev
```
