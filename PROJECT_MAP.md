# Kans Mode Website — Full Project Map

---

## ✅ Completed

### 1. Discovery & Stack Selection
- Cloned `Grand-Scope/mustang` and inspected its architecture
- Confirmed stack: Astro v6 SSR, React 19, Svelte 5, Tailwind v4, Cloudflare Pages/Workers, D1, Resend, Zod, Sanity CMS

### 2. Project Scaffold
- Created `/Users/kansmode/Dev/kansmode_website`
- Set up `package.json`, `astro.config.ts`, `tsconfig.json`, `wrangler.json`, `.env.example`, `.dev.vars.example`, `.gitignore`

### 3. Sanity CMS
- Created new Sanity project: `c4c751hn` / dataset `production`
- Built studio in `studio/` with schemas:
  - `siteSettings`, `heroBanner`, `service`, `productCategory`, `productSubcategory`, `product`, `teamMember`, `client`, `testimonial`, `post`, `blockContent`

### 4. Database
- Created Cloudflare D1 database `kansmode-contacts`
- Created `contacts` table schema in `db/schema.sql`

### 5. Frontend Pages
- `BaseLayout.astro`, `Header.svelte`, `Footer.svelte`
- Home, About, Products (category → subcategory → list), Product detail, Clients, Contact, Blog (index + detail), 404

### 6. API
- Contact form POST endpoint at `/api/contact` — validates with Zod, stores in D1, sends email via Resend

### 7. Deployment
- Created Cloudflare Pages project `kansmode-website`
- Deployed to: `https://30207a26.kansmode-website.pages.dev/`

### 8. Repo
- Initialized git repo, committed initial build + README + TypeScript fixes

---

## 🔄 Next Steps

### Phase A: Domain Routing
1. Add `kansmode.com` / `www.kansmode.com` as custom domain in Cloudflare Pages
2. Update DNS nameservers at domain registrar to point to Cloudflare
3. Verify SSL/TLS provisioning
4. Set up redirects: `http` → `https`, `kansmode.com` → `www.kansmode.com` (if desired)
5. Test live domain

### Phase B: GitHub Repository
1. Create repo under appropriate account (Grand-Scope or Salmankabir12)
2. Add remote origin
3. Push `main` branch
4. (Optional) Set up CI/CD with GitHub Actions for auto-deploy on push

### Phase C: Real Content Migration
1. Migrate/copy existing kansmode.com text content
2. Upload real images/assets to Sanity or R2
3. Populate Sanity documents: site settings, hero banners, services, categories, subcategories, products, team, clients, testimonials, posts
4. Update placeholders to be truly temporary / remove fallback reliance

### Phase D: Feature Enhancements
1. **Images**: real product/category images, Sanity image URL helper, responsive images
2. **Hero slider**: multiple banners with navigation
3. **Google Map** on contact page
4. **Turnstile CAPTCHA** on contact form
5. **Testimonials carousel**
6. **SEO**: meta tags, Open Graph, structured data
7. **Search / filtering** on products
8. **Analytics**: Google Analytics / Cloudflare Web Analytics

### Phase E: Admin & Operations
1. Deploy Sanity Studio
2. Train/add CMS users
3. Document content update workflow
4. Set up Resend verified domain for `kansmode.com`
5. Configure production secrets in wrangler
