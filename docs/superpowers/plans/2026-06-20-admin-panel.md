# Admin Panel Implementation Plan

> **For agentic workers:** Use subagent-driven-development or executing-plans.

**Goal:** Build a full-featured admin panel at `/admin` with CRUD for all Sanity content types, contact message viewer, and image upload.

**Architecture:** Astro SSR pages with form POSTs to API endpoints. Content type forms are dynamic — driven by a field config (not 10 separate form implementations). Auth via existing HMAC-SHA256 cookie.

**Tech Stack:** Astro 6 SSR + Tailwind CSS v4 + Sanity write API + Cloudflare D1

---

## File Structure

### New Files
- `src/lib/admin/fields.ts` — field definitions for all 10 content types
- `src/lib/admin/layout.astro` — shared admin layout (sidebar + header)
- `src/lib/admin/auth-check.ts` — reusable auth check helper
- `src/pages/admin/content/[type].astro` — dynamic list page
- `src/pages/admin/content/[type]/new.astro` — create form
- `src/pages/admin/content/[type]/[id].astro` — edit form
- `src/pages/admin/messages.astro` — contact messages list
- `src/pages/admin/messages/[id].astro` — message detail
- `src/pages/api/admin/content/delete.ts` — delete API
- `src/pages/api/admin/content/upload.ts` — image upload API
- `src/pages/api/admin/messages.ts` — messages API

### Modified Files
- `src/pages/admin/index.astro` — use layout
- `src/pages/admin/dashboard.astro` — enhanced stats, use layout
- `src/pages/admin/settings.astro` — use layout, improve fields
- `src/pages/api/admin/create.ts` — enhance for image/rich text handling
- `src/pages/api/admin/update.ts` — enhance for all content types

### Deleted Files
- `src/pages/admin/create.astro` — replaced by content/[type]/new.astro

---

## Implementation Tasks

### Task 1: Field Definitions Config

**Files:**
- Create: `src/lib/admin/fields.ts`

Field config for all 10 content types. Each field has: name, label, type (text|textarea|number|select|image|datetime|richText|slug), required, options (for selects), reference (for references).

### Task 2: Admin Layout Component

**Files:**
- Create: `src/lib/admin/layout.astro`
- Create: `src/lib/admin/auth-check.ts`

Layout with:
- Sidebar: Dashboard, Content tree (collapsible), Messages, Settings
- Header: site name, logout button
- Auth check helper that returns redirect or continues

### Task 3: Enhanced API Endpoints

**Files:**
- Modify: `src/pages/api/admin/create.ts` — add image asset handling, tags arrays, gallery support
- Modify: `src/pages/api/admin/update.ts` — handle all field types
- Create: `src/pages/api/admin/content/delete.ts` — delete Sanity doc
- Create: `src/pages/api/admin/content/upload.ts` — upload image to Sanity assets

### Task 4: Content CRUD Pages

**Files:**
- Create: `src/pages/admin/content/[type].astro` — dynamic list with search, edit/delete links
- Create: `src/pages/admin/content/[type]/new.astro` — dynamic create form
- Create: `src/pages/admin/content/[type]/[id].astro` — dynamic edit form

### Task 5: Contact Messages

**Files:**
- Create: `src/pages/admin/messages.astro` — list from D1 with search
- Create: `src/pages/admin/messages/[id].astro` — single message view
- Create: `src/pages/api/admin/messages.ts` — JSON API for D1 messages (optional, can be inline)

### Task 6: Dashboard, Settings, Login Updates

**Files:**
- Modify: `src/pages/admin/dashboard.astro` — use layout, enhance stats
- Modify: `src/pages/admin/settings.astro` — use layout
- Modify: `src/pages/admin/index.astro` — use layout
- Delete: `src/pages/admin/create.astro` — replaced by content/[type]/new

### Task 7: Env Setup & Deploy

Setup wrangler secrets and deploy to Cloudflare Pages.
