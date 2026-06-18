import type { SanityImage } from '@/types';

export function getSanityImageUrl(image?: SanityImage, width = 800): string | undefined {
  if (!image?.asset?._ref) return undefined;
  const ref = image.asset._ref;
  const [type, id, dimensions, format] = ref.split('-');
  if (type !== 'image') return undefined;
  const projectId = 'c4c751hn';
  const dataset = 'production';
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}?w=${width}`;
}
