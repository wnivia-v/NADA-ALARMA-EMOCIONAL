export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Extrae el ID de video de un link de YouTube o YouTube Music
 * (watch?v=, youtu.be/, shorts/). Devuelve null si no lo reconoce.
 */
export function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\.|^m\.|^music\./, '');
    if (host === 'youtu.be') {
      return u.pathname.slice(1).split('/')[0] || null;
    }
    if (host === 'youtube.com') {
      if (u.pathname.startsWith('/shorts/')) {
        return u.pathname.split('/')[2] || null;
      }
      const v = u.searchParams.get('v');
      if (v) return v;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Extrae el ID numérico de un link de TikTok con formato
 * tiktok.com/@usuario/video/1234567890. Devuelve null si no lo reconoce
 * (por ejemplo, links cortos como vm.tiktok.com/vt.tiktok.com, que no
 * incluyen el ID en la URL y necesitan resolverse vía oEmbed).
 */
export function extractTikTokVideoId(url: string): string | null {
  try {
    const u = new URL(url.trim());
    if (!u.hostname.replace(/^www\./, '').endsWith('tiktok.com')) return null;
    const match = u.pathname.match(/\/video\/(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/** True si el host es de la familia tiktok.com (incluye links cortos). */
export function isTikTokUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    return u.hostname.replace(/^www\./, '').endsWith('tiktok.com');
  } catch {
    return false;
  }
}

export interface ParsedVideoUrl {
  provider: 'youtube' | 'tiktok';
  externalId: string;
}

export function parseVideoUrl(url: string): ParsedVideoUrl | null {
  const youtubeId = extractYouTubeId(url);
  if (youtubeId) return { provider: 'youtube', externalId: youtubeId };
  const tiktokId = extractTikTokVideoId(url);
  if (tiktokId) return { provider: 'tiktok', externalId: tiktokId };
  return null;
}
