import { SearchX } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AboutPage } from './components/AboutPage';
import { FeaturedPanel } from './components/FeaturedPanel';
import { FilterBar } from './components/FilterBar';
import { Header } from './components/Header';
import { SavedPage } from './components/SavedPage';
import { VideoCard } from './components/VideoCard';
import { VideoDetailPage } from './components/VideoDetailPage';
import { useArchiveStore } from './hooks/useArchiveStore';
import type { AppView, FilterState, ViralVideo } from './types/video';
import {
  extractFilterOptions,
  filterVideos,
  getRelatedVideos,
  sortVideos,
} from './utils/archiveLogic';

const INITIAL_FILTERS: FilterState = {
  search: '',
  country: 'ALL',
  year: 'ALL',
  month: 'ALL',
  categories: [],
  sort: 'newest',
};

export default function App() {
  const {
    videos,
    isLoading,
    loadError,
    reloadVideos,
    bookmarkedIds,
    toggleBookmark,
  } = useArchiveStore();

  const [view, setView] = useState<AppView>('home');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [randomSeed, setRandomSeed] = useState<number>(1);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const [spotlightId, setSpotlightId] = useState<string>(videos[0]?.id ?? '');
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const lastDetailOpenAtRef = useRef<number>(0);

  const filterOptions = useMemo(() => extractFilterOptions(videos), [videos]);

  const filteredAndSorted = useMemo(() => {
    const filtered = filterVideos(videos, filters);
    return sortVideos(filtered, filters.sort, randomSeed);
  }, [videos, filters, randomSeed]);

  const spotlightVideo = useMemo(() => {
    return (
      videos.find((v) => v.id === spotlightId) ??
      filteredAndSorted[0] ??
      videos[0] ??
      null
    );
  }, [videos, spotlightId, filteredAndSorted]);

  const detailVideo = useMemo(() => {
    if (!selectedDetailId) return null;
    return videos.find((v) => v.id === selectedDetailId) ?? null;
  }, [videos, selectedDetailId]);

  const spotlightRelated = useMemo(() => {
    if (!spotlightVideo) return [];
    return getRelatedVideos(spotlightVideo, videos, 3);
  }, [spotlightVideo, videos]);

  const detailRelated = useMemo(() => {
    if (!detailVideo) return [];
    return getRelatedVideos(detailVideo, videos, 3);
  }, [detailVideo, videos]);

  useEffect(() => {
    if (!hasInteracted) return;
    setIsFiltering(true);
    const timer = window.setTimeout(() => setIsFiltering(false), 110);
    return () => window.clearTimeout(timer);
  }, [filters, randomSeed, hasInteracted]);

  const handleOpenDetail = (video: ViralVideo) => {
    const now = Date.now();
    if (now - lastDetailOpenAtRef.current < 400) {
      return;
    }
    lastDetailOpenAtRef.current = now;
    setSelectedDetailId(video.id);
    setSpotlightId(video.id);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleNavigate = (nextView: AppView) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRandomPick = () => {
    const pool = filteredAndSorted.length > 0 ? filteredAndSorted : videos;
    if (pool.length === 0) return;

    const candidates = pool.filter((v) => v.id !== spotlightVideo?.id);
    const pickFrom = candidates.length > 0 ? candidates : pool;
    const picked = pickFrom[Math.floor(Math.random() * pickFrom.length)];

    setSpotlightId(picked.id);
    setRandomSeed((s) => s + 1);
    if (view !== 'home') {
      setSelectedDetailId(picked.id);
      setView('detail');
    }
  };

  const handleFilterChange = (next: FilterState) => {
    setHasInteracted(true);
    if (next.sort === 'random' && filters.sort !== 'random') {
      setRandomSeed((s) => s + 1);
    }
    setFilters(next);
  };

  return (
    <div className="archive-grid-bg flex min-h-screen flex-col text-zinc-100">
      <Header
        currentView={view}
        onNavigate={handleNavigate}
      />

      <main
        className={`flex-1 ${view === 'detail' ? 'cursor-pointer' : ''}`}
        onClick={(e) => {
          if (view !== 'detail') return;
          const selectedText = window.getSelection()?.toString();
          if (selectedText && selectedText.length > 0) return;
          const target = e.target as HTMLElement | null;
          if (!target) return;
          if (
            target.closest(
              'button, a, input, select, textarea, iframe, article, [data-detail-content]'
            )
          ) {
            return;
          }
          handleNavigate('home');
        }}
      >
        {view === 'home' && (
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Masthead Strip */}
            <div className="mb-6 border-b border-zinc-800 pb-6 text-center">
              <div className="mx-auto max-w-3xl">
                <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl [text-wrap:balance]">
                  The original video. The story behind it.
                </h1>
                <p className="mx-auto mt-2 max-w-2xl text-sm font-medium text-zinc-200">
                  History is written by the victors, but memes must be preserved by the internet.
                </p>
                <p className="mx-auto mt-2.5 max-w-2xl text-sm text-zinc-400">
                  Archiving real, hilarious viral moments from Malaysia and around the world—with
                  the verified context and story behind them.
                </p>
              </div>
            </div>

            {loadError && (
              <div
                role="alert"
                className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-950/30 bg-[#DEC03B] px-4 py-3 text-xs font-medium text-zinc-950"
              >
                <span>{loadError}</span>
                <button
                  type="button"
                  onClick={() => void reloadVideos()}
                  className="rounded-lg border border-zinc-950 bg-zinc-950 px-3 py-1.5 font-semibold text-zinc-100 hover:bg-zinc-900"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Wireframe Two-Column Discovery + Featured Spotlight Workspace */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
              {/* Left Column: Search, Green Filters & 3-per-row Discovery Grid */}
              <div className="space-y-6 lg:col-span-8">
                <FilterBar
                  filters={filters}
                  options={filterOptions}
                  totalCount={videos.length}
                  filteredCount={filteredAndSorted.length}
                  onChange={handleFilterChange}
                  onReset={() => setFilters(INITIAL_FILTERS)}
                />

                {isLoading || isFiltering ? (
                  <div
                    aria-busy="true"
                    aria-label="Updating video results"
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div
                        key={n}
                        className="h-72 animate-pulse rounded-xl border border-zinc-600 bg-zinc-700/90 p-4"
                      >
                        <div className="aspect-[4/3] w-full rounded-lg bg-zinc-800" />
                        <div className="mt-3 h-4 w-3/4 rounded bg-zinc-600" />
                        <div className="mt-2 h-3 w-1/2 rounded bg-zinc-600/70" />
                      </div>
                    ))}
                  </div>
                ) : filteredAndSorted.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSorted.map((video) => (
                      <VideoCard
                        key={video.id}
                        video={video}
                        isBookmarked={bookmarkedIds.includes(video.id)}
                        isSpotlit={spotlightVideo?.id === video.id}
                        onOpenDetail={handleOpenDetail}
                        onToggleBookmark={toggleBookmark}
                        onSpotlight={(v) => setSpotlightId(v.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center">
                    <SearchX
                      className="mx-auto h-9 w-9 text-zinc-500"
                      aria-hidden="true"
                    />
                    <h2 className="mt-3 font-display text-lg font-bold text-zinc-50">
                      {videos.length === 0
                        ? 'No videos in Supabase yet'
                        : 'No matching videos found'}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-400">
                      {videos.length === 0
                        ? 'Add rows to viral_videos in Supabase to display them here.'
                        : 'Try clearing one of your category tags, date filters, or search keywords.'}
                    </p>
                    {videos.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setFilters(INITIAL_FILTERS)}
                        className="mt-4 rounded-lg border border-zinc-950 bg-[#FACC15] px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-[#EAB308]"
                      >
                        Reset All Filters
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void reloadVideos()}
                        className="mt-4 rounded-lg border border-zinc-950 bg-[#FACC15] px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-[#EAB308]"
                      >
                        Refresh from Supabase
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Yellow Featured Video + Story Context Panel */}
              <div className="lg:sticky lg:top-20 lg:col-span-4">
                {spotlightVideo && (
                  <FeaturedPanel
                    video={spotlightVideo}
                    relatedVideos={spotlightRelated}
                    isBookmarked={bookmarkedIds.includes(spotlightVideo.id)}
                    onOpenDetail={handleOpenDetail}
                    onToggleBookmark={toggleBookmark}
                    onSelectSpotlight={(v) => setSpotlightId(v.id)}
                    onRandomPick={handleRandomPick}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'detail' && detailVideo && (
          <VideoDetailPage
            video={detailVideo}
            relatedVideos={detailRelated}
            bookmarkedIds={bookmarkedIds}
            onBack={() => handleNavigate('home')}
            onOpenDetail={handleOpenDetail}
            onToggleBookmark={toggleBookmark}
          />
        )}

        {view === 'detail' && !detailVideo && (
          <div
            data-detail-content
            className="mx-auto max-w-2xl cursor-auto px-4 py-16 text-center"
          >
            <h1 className="font-display text-2xl font-bold text-zinc-50">
              Video entry not found
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              This entry is not available in the archive.
            </p>
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className="mt-4 rounded-lg border border-zinc-950 bg-[#FACC15] px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-[#EAB308]"
            >
              Return to Archive
            </button>
          </div>
        )}

        {view === 'saved' && (
          <SavedPage
            videos={videos}
            bookmarkedIds={bookmarkedIds}
            onBack={() => handleNavigate('home')}
            onOpenDetail={handleOpenDetail}
            onToggleBookmark={toggleBookmark}
          />
        )}

        {view === 'about' && <AboutPage onBack={() => handleNavigate('home')} />}
      </main>

      <footer className="mt-12 border-t border-zinc-800 bg-[#16161A]/90">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 text-xs text-zinc-400 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <p className="font-display font-bold text-zinc-50">VIRAL ARCHIVE</p>
            <p className="mt-0.5">
              Metadata & story archive only — never downloads, hosts, or scrapes platform videos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5 font-medium">
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className="hover:text-zinc-100"
            >
              Archive
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('saved')}
              className="hover:text-zinc-100"
            >
              Saved
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('about')}
              className="hover:text-zinc-100"
            >
              About
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
