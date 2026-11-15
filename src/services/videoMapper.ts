import {
  VIDEO_PLATFORMS,
  type VideoCategory,
  type VideoPlatform,
  type ViralVideo,
} from '../types/video';
import { detectPlatformFromUrl, normalizeEmbedUrl } from './videoEmbed';

export interface SupabaseVideoRow {
  id: string;
  platform: string;
  original_url: string;
  embed_url?: string | null;
  thumbnail_url?: string | null;
  title: string;
  description?: string | null;
  uploader: string;
  country?: string | null;
  date_added?: string | null;
  categories?: string[] | string | null;
  tags?: string[] | string | null;
  what_happened: string;
  background_story: string;
  additional_context?: string | null;
  is_published?: boolean | null;
}

const VALID_PLATFORMS = new Set<string>(VIDEO_PLATFORMS);

function normalizeStringArray(input: string[] | string | null | undefined): string[] {
  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .replace(/^\{|\}$/g, '')
      .split(',')
      .map((item) => item.replace(/^"|"$/g, '').trim())
      .filter(Boolean);
  }
  return [];
}

function deduplicateStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

function normalizeDate(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  const isoMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return fallback;
}

export function mapSupabaseRowToViralVideo(row: SupabaseVideoRow): ViralVideo {
  const detectedPlatform =
    detectPlatformFromUrl(row.original_url) ?? detectPlatformFromUrl(row.embed_url ?? '');
  const platform: VideoPlatform =
    detectedPlatform ??
    (VALID_PLATFORMS.has(row.platform) ? (row.platform as VideoPlatform) : 'TikTok');

  const categories: VideoCategory[] = deduplicateStrings(
    normalizeStringArray(row.categories)
  );

  const tags = normalizeStringArray(row.tags);
  const dateAdded = normalizeDate(row.date_added, '2026-01-01');

  const embedUrl = normalizeEmbedUrl(platform, row.original_url, row.embed_url);

  return {
    id: row.id,
    title: row.title,
    description: row.description?.trim() || row.what_happened,
    platform,
    original_url: row.original_url,
    embed_url: embedUrl,
    thumbnail_url: row.thumbnail_url?.trim() || '',
    uploader: row.uploader,
    country: row.country?.trim() || 'Malaysia',
    date_added: dateAdded,
    categories,
    tags,
    background_story: row.background_story,
    what_happened: row.what_happened,
    additional_context: row.additional_context?.trim() || '',
  };
}
