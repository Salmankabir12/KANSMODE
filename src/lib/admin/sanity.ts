import { createClient } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'c4c751hn';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
const token = import.meta.env.SANITY_API_TOKEN;

export const sanityAdminClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

export function isSanityWriteConfigured(): boolean {
  return Boolean(token);
}
