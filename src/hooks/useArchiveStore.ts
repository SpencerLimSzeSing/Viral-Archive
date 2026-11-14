import { useCallback, useEffect, useState } from 'react';
import { fetchPublishedVideos } from '../services/videoRepository';
import type { ViralVideo } from '../types/video';

const STORAGE_BOOKMARKS_KEY = 'viral_archive_bookmarks_v1';

function loadInitialBookmarks(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_BOOKMARKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useArchiveStore() {
  const [videos, setVideos] = useState<ViralVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(loadInitialBookmarks);

  const loadVideos = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchPublishedVideos();
    setVideos(result.videos);
    setLoadError(result.error);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadVideos();
  }, [loadVideos]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(bookmarkedIds));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [bookmarkedIds]);

  const toggleBookmark = useCallback((videoId: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(videoId);
      return exists ? prev.filter((id) => id !== videoId) : [...prev, videoId];
    });
  }, []);

  return {
    videos,
    isLoading,
    loadError,
    reloadVideos: loadVideos,
    bookmarkedIds,
    toggleBookmark,
  };
}
