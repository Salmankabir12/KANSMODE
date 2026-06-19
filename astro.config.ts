import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

const SITE = process.env.PUBLIC_SITE_URL || 'https://kansmode-website.pages.dev';

export default defineConfig({
  site: SITE,
  output: 'server',
  adapter: cloudflare(),
  integrations: [svelte(), react(), sitemap()],
  vite: {
    plugins: [tailwindcss() as any],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
  },
});
