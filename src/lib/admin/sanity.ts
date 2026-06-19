import { createClient } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'c4c751hn';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

export function getSanityAdminClient(env: Record<string, any> = import.meta.env) {
  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: env.SANITY_API_TOKEN,
  });
}

export function isSanityWriteConfigured(env: Record<string, any> = import.meta.env): boolean {
  return Boolean(env.SANITY_API_TOKEN);
}
