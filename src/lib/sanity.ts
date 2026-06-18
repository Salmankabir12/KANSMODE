import { createClient } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'c4c751hn';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

export const sanityClient = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2024-01-01',
});
