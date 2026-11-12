import manifest from '@/public/media/manifest.json';

export function mediaUrl(path: string) {
  return (manifest as Record<string, string>)[path] || path;
}

export function imageUrl(src?: string, width = 1000) {
  const resolved = mediaUrl(src || '/media/brand/image-unavailable.svg');
  if (resolved.startsWith('https://res.cloudinary.com/') && resolved.includes('/image/upload/')) {
    return resolved.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
  }
  return resolved;
}
