import { ArrowLeft } from 'lucide-react';
import type { ViralVideo } from '../types/video';
import { VideoCard } from './VideoCard';

interface SavedPageProps {
  videos: ViralVideo[];
  bookmarkedIds: string[];
  onBack: () => void;
  onOpenDetail: (video: ViralVideo) => void;
  onToggleBookmark: (videoId: string) => void;
}

export function SavedPage({
  videos,
  bookmarkedIds,
  onBack,
  onOpenDetail,
  onToggleBookmark,
}: SavedPageProps) {
  const savedVideos = videos.filter((v) => bookmarkedIds.includes(v.id));

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-zinc-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Archive</span>
          </button>
          <h1 className="mt-4 font-display text-3xl font-bold text-zinc-50">
            Saved Archive Entries
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Bookmarked clips kept in your browser for quick reference.
          </p>
        </div>
      </div>

      {savedVideos.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {savedVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isBookmarked={true}
              onOpenDetail={onOpenDetail}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <h2 className="font-display text-lg font-bold text-zinc-50">
            No saved videos yet
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Click the bookmark button on any video card or detail page to save it here.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-4 rounded-lg border border-zinc-950 bg-[#FACC15] px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-[#EAB308]"
          >
            Browse Archive
          </button>
        </div>
      )}
    </div>
  );
}
