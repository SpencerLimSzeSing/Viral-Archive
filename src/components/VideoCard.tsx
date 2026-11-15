import { Maximize2 } from 'lucide-react';
import type { ViralVideo } from '../types/video';
import { formatArchiveDate } from '../utils/archiveLogic';
import { VideoThumbnail } from './VideoThumbnail';

interface VideoCardProps {
  video: ViralVideo;
  isBookmarked: boolean;
  isSpotlit?: boolean;
  onOpenDetail: (video: ViralVideo) => void;
  onToggleBookmark: (videoId: string) => void;
  onSpotlight?: (video: ViralVideo) => void;
}

export function VideoCard({
  video,
  isBookmarked,
  isSpotlit = false,
  onOpenDetail,
  onToggleBookmark,
  onSpotlight,
}: VideoCardProps) {
  return (
    <article
      className={`group flex flex-col justify-between overflow-hidden rounded-xl border bg-zinc-700 transition-colors duration-150 ${
        isSpotlit
          ? 'border-[#FACC15] ring-2 ring-[#FACC15]'
          : 'border-zinc-600 hover:border-zinc-500'
      }`}
    >
      <div>
        <button
          type="button"
          onClick={() => onOpenDetail(video)}
          aria-label={`Open full story for ${video.title}`}
          className="block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15]"
        >
          <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-800">
            <VideoThumbnail
              src={video.thumbnail_url}
              alt={video.title}
              platform={video.platform}
              title={video.title}
              className="transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </div>
        </button>

        <div className="p-4 pb-2">
          {/* Unboxed typographic metadata per Zero-Pill rule */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-300">
            <span className="font-semibold text-zinc-100">{video.platform}</span>
            <span aria-hidden="true">·</span>
            <span>{video.country}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {formatArchiveDate(video.date_added)}
            </span>
          </div>

          <h3 className="mt-1.5 font-display text-base leading-snug font-semibold text-zinc-50">
            <button
              type="button"
              onClick={() => onOpenDetail(video)}
              className="text-left hover:underline decoration-[#FACC15] decoration-2 underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15]"
            >
              {video.title}
            </button>
          </h3>

          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-200">
            {video.description || video.what_happened}
          </p>

          {video.categories.length > 0 && (
            <p className="mt-2.5 text-[11px] font-medium text-emerald-300">
              {video.categories.join(' · ')}
            </p>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-zinc-600/80 px-3.5 py-2.5">
        {onSpotlight ? (
          <button
            type="button"
            onClick={() => onSpotlight(video)}
            aria-label={`Preview ${video.title} in spotlight`}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15] ${
              isSpotlit
                ? 'bg-[#FACC15] text-zinc-950'
                : 'text-zinc-200 hover:bg-zinc-600 hover:text-white'
            }`}
          >
            <Maximize2 className="h-3 w-3" aria-hidden="true" />
            <span>Spotlight</span>
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={() => onToggleBookmark(video.id)}
          aria-pressed={isBookmarked}
          aria-label={
            isBookmarked
              ? `Remove ${video.title} from saved`
              : `Save ${video.title}`
          }
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15] ${
            isBookmarked
              ? 'bg-zinc-900 text-[#FACC15]'
              : 'text-zinc-200 hover:bg-zinc-600 hover:text-white'
          }`}
        >
          {isBookmarked ? 'Saved' : 'Save'}
        </button>
      </div>
    </article>
  );
}
