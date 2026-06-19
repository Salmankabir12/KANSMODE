/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_SANITY_PROJECT_ID: string;
  readonly PUBLIC_SANITY_DATASET: string;
  readonly RESEND_API_KEY: string;
  readonly ADMIN_EMAIL: string;
  readonly FROM_EMAIL: string;
  readonly ADMIN_PASSWORD: string;
  readonly ADMIN_SESSION_SECRET: string;
  readonly SANITY_API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
