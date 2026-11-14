import type { ViralVideo } from '../types/video';
import { getSupabaseClient } from './supabaseClient';
import { mapSupabaseRowToViralVideo, type SupabaseVideoRow } from './videoMapper';

export interface VideoLoadResult {
  videos: ViralVideo[];
  error: string | null;
}

export async function fetchPublishedVideos(): Promise<VideoLoadResult> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      videos: [],
      error:
        'Supabase connection is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('viral_videos')
      .select('*')
      .eq('is_published', true)
      .order('date_added', { ascending: false });

    if (error) {
      return {
        videos: [],
        error: 'Unable to load archive entries from Supabase right now.',
      };
    }

    const mapped = ((data ?? []) as SupabaseVideoRow[]).map(mapSupabaseRowToViralVideo);
    return {
      videos: mapped,
      error: null,
    };
  } catch {
    return {
      videos: [],
      error: 'Unable to connect to Supabase right now.',
    };
  }
}
