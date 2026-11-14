import type { VideoPlatform, ViralVideo } from '../types/video';

export interface EmbedResolution {
  canEmbed: boolean;
  embedUrl: string | null;
  platformLabel: string;
  officialMechanism: string;
  fallbackReason: string;
}

/**
 * Infers the original platform from a video URL when possible.
 * Never attempts to scrape, bypass logins, or download media files.
 */
export function detectPlatformFromUrl(url: string): VideoPlatform | null {
  const normalized = url.trim().toLowerCase();
  if (!normalized) return null;

  try {
    const parsed = new URL(normalized.startsWith('http') ? normalized : `https://${normalized}`);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) return 'TikTok';
    if (host === 'instagram.com' || host.endsWith('.instagram.com')) return 'Instagram';
    if (host === 'facebook.com' || host.endsWith('.facebook.com') || host === 'fb.watch') {
      return 'Facebook';
    }
    if (host === 'youtube.com' || host.endsWith('.youtube.com') || host === 'youtu.be') {
      return 'YouTube';
    }
    if (host === 'twitter.com' || host === 'x.com') return 'X';
  } catch {
    return null;
  }

  return null;
}

/**
 * Validates that a user-submitted URL is a safe http/https URL.
 */
export function validateVideoUrl(rawUrl: string): { valid: boolean; normalizedUrl: string; error?: string } {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { valid: false, normalizedUrl: '', error: 'Please enter the original video URL.' };
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, normalizedUrl: trimmed, error: 'Only HTTP or HTTPS URLs are supported.' };
    }
    if (!parsed.hostname.includes('.')) {
      return { valid: false, normalizedUrl: trimmed, error: 'Enter a complete domain URL.' };
    }
    return { valid: true, normalizedUrl: parsed.toString() };
  } catch {
    return { valid: false, normalizedUrl: trimmed, error: 'Enter a valid URL (for example, https://www.tiktok.com/@user/video/123).' };
  }
}

/**
 * Builds an official, non-autoplaying embed URL for supported platforms when a real
 * public post/video ID is present. Respects platform embed rules and avoids workarounds.
 */
export function buildOfficialEmbedUrl(platform: VideoPlatform, originalUrl: string): string | null {
  try {
    const parsed = new URL(originalUrl);

    if (platform === 'TikTok') {
      const match = parsed.pathname.match(/\/video\/(\d+)/);
      if (match?.[1]) {
        return `https://www.tiktok.com/embed/v2/${match[1]}?autoplay=0`;
      }
      return null;
    }

    if (platform === 'Instagram') {
      const match = parsed.pathname.match(/\/(reel|p|tv)\/([A-Za-z0-9_-]+)/);
      if (match?.[1] && match?.[2]) {
        return `https://www.instagram.com/${match[1]}/${match[2]}/embed/captioned/`;
      }
      return null;
    }

    if (platform === 'Facebook') {
      if (
        parsed.pathname.includes('/videos/') ||
        parsed.pathname.includes('/reel/') ||
        parsed.hostname.includes('fb.watch')
      ) {
        const encoded = encodeURIComponent(originalUrl);
        return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&autoplay=false`;
      }
      return null;
    }

    if (platform === 'YouTube') {
      let videoId: string | null = null;
      if (parsed.hostname.includes('youtu.be')) {
        videoId = parsed.pathname.slice(1).split('/')[0] || null;
      } else if (
        parsed.pathname.startsWith('/shorts/') ||
        parsed.pathname.startsWith('/embed/') ||
        parsed.pathname.startsWith('/live/')
      ) {
        videoId = parsed.pathname.split('/')[2] || null;
      } else {
        videoId = parsed.searchParams.get('v');
      }
      if (videoId && /^[A-Za-z0-9_-]{6,20}$/.test(videoId)) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`;
      }
      return null;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Returns true if the URL points to a vertical YouTube Shorts clip.
 */
export function isYouTubeShortsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    return (
      (host === 'youtube.com' || host.endsWith('.youtube.com')) &&
      parsed.pathname.startsWith('/shorts/')
    );
  } catch {
    return false;
  }
}

/**
 * Normalizes a stored embed URL or builds an official embed URL from the original URL.
 * Converts raw YouTube, Instagram, TikTok, or Facebook post links placed in embed_url
 * into valid iframe-embeddable URLs so platforms do not refuse connection.
 */
export function normalizeEmbedUrl(
  platform: VideoPlatform,
  originalUrl: string,
  rawEmbedUrl?: string | null
): string | null {
  const trimmedEmbed = rawEmbedUrl?.trim() || '';

  if (platform === 'YouTube') {
    if (trimmedEmbed) {
      const normalizedFromEmbed = buildOfficialEmbedUrl('YouTube', trimmedEmbed);
      if (normalizedFromEmbed) return normalizedFromEmbed;
    }
    return buildOfficialEmbedUrl('YouTube', originalUrl);
  }

  if (platform === 'Instagram') {
    if (trimmedEmbed) {
      try {
        const parsed = new URL(trimmedEmbed);
        if (/\/embed(\/captioned)?\/?$/i.test(parsed.pathname)) {
          return trimmedEmbed;
        }
      } catch {
        // Fall through to normalization
      }
      const normalizedFromEmbed = buildOfficialEmbedUrl('Instagram', trimmedEmbed);
      if (normalizedFromEmbed) return normalizedFromEmbed;
    }
    return buildOfficialEmbedUrl('Instagram', originalUrl);
  }

  if (platform === 'TikTok') {
    if (trimmedEmbed) {
      try {
        const parsed = new URL(trimmedEmbed);
        if (parsed.pathname.startsWith('/embed/')) {
          return trimmedEmbed;
        }
      } catch {
        // Fall through to normalization
      }
      const normalizedFromEmbed = buildOfficialEmbedUrl('TikTok', trimmedEmbed);
      if (normalizedFromEmbed) return normalizedFromEmbed;
    }
    return buildOfficialEmbedUrl('TikTok', originalUrl);
  }

  if (platform === 'Facebook') {
    if (trimmedEmbed) {
      try {
        const parsed = new URL(trimmedEmbed);
        if (parsed.pathname.includes('/plugins/video.php')) {
          return trimmedEmbed;
        }
      } catch {
        // Fall through to normalization
      }
      const normalizedFromEmbed = buildOfficialEmbedUrl('Facebook', trimmedEmbed);
      if (normalizedFromEmbed) return normalizedFromEmbed;
    }
    return buildOfficialEmbedUrl('Facebook', originalUrl);
  }

  return trimmedEmbed || buildOfficialEmbedUrl(platform, originalUrl);
}

/**
 * Resolves how a video entry should be rendered in the player pane.
 * Unsupported URLs fall back to an archival thumbnail card with an external link to the original platform.
 */
export function resolveEmbedConfig(
  video: Pick<ViralVideo, 'platform' | 'original_url' | 'embed_url'>
): EmbedResolution {
  const effectivePlatform =
    detectPlatformFromUrl(video.original_url) ??
    detectPlatformFromUrl(video.embed_url ?? '') ??
    video.platform;

  const mechanismByPlatform: Record<VideoPlatform, string> = {
    TikTok: 'Official TikTok Embed v2 Player',
    Instagram: 'Official Instagram oEmbed / Embed Frame',
    Facebook: 'Official Facebook Video Plugin',
    YouTube: 'Official YouTube Privacy-Enhanced Embed',
    X: 'External Source Card (X posts link directly to source)',
  };

  const derivedEmbed = normalizeEmbedUrl(
    effectivePlatform,
    video.original_url,
    video.embed_url
  );

  if (derivedEmbed) {
    return {
      canEmbed: true,
      embedUrl: derivedEmbed,
      platformLabel: effectivePlatform,
      officialMechanism: mechanismByPlatform[effectivePlatform],
      fallbackReason: '',
    };
  }

  return {
    canEmbed: false,
    embedUrl: null,
    platformLabel: effectivePlatform,
    officialMechanism: mechanismByPlatform[effectivePlatform],
    fallbackReason: `${effectivePlatform} embed preview is unavailable for this URL format or privacy setting. Open the original post directly on ${effectivePlatform}.`,
  };
}
