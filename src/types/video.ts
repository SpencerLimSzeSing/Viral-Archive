export type VideoPlatform = 'TikTok' | 'Instagram' | 'Facebook' | 'YouTube' | 'X';

export const VIDEO_PLATFORMS: VideoPlatform[] = [
  'TikTok',
  'Instagram',
  'Facebook',
  'YouTube',
  'X',
];

export type VideoCategory = string;

export const ALL_CATEGORIES: VideoCategory[] = [
  'Funny',
  'Unexpected',
  'Animals',
  'Public incidents',
  'Internet trends',
  'Reactions',
  'Awkward moments',
  'Wholesome moments',
  'Controversial moments',
];

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'random';

export interface ViralVideo {
  id: string;
  title: string;
  description: string;
  platform: VideoPlatform;
  original_url: string;
  embed_url: string | null;
  thumbnail_url: string;
  uploader: string;
  country: string;
  date_added: string; // YYYY-MM-DD
  categories: VideoCategory[];
  tags: string[];
  background_story: string;
  what_happened: string;
  why_viral: string;
  additional_context: string;
}

export interface FilterState {
  search: string;
  country: string;
  year: string;
  month: string;
  categories: VideoCategory[];
  sort: SortOption;
}

export type AppView = 'home' | 'detail' | 'saved' | 'about';
