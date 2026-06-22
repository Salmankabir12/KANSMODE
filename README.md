# Kans Mode International Website

**Live:** [https://650d54fe.kansmode-website.pages.dev](https://650d54fe.kansmode-website.pages.dev)

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

## Admin Panel

A built-in admin dashboard is available at `/admin`.

Features:
- Password-protected login
- Content overview with document counts
- Quick create forms for testimonials, clients, services, team members, categories, products, posts, and hero banners
- Site settings editor for title, contact info, and social links
- Direct links to Sanity Studio for full editing

Required environment variables:

```
ADMIN_PASSWORD=change-me
ADMIN_SESSION_SECRET=any-long-random-string
SANITY_API_TOKEN=sk...   # token with Editor permissions
```

In production, set these via Wrangler secrets:

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
npx wrangler secret put SANITY_API_TOKEN
```
