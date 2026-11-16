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

        <div className="p-2.5 pb-1.5 sm:p-4 sm:pb-2">
          {/* Unboxed typographic metadata per Zero-Pill rule */}
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-zinc-300 sm:gap-x-2 sm:gap-y-1 sm:text-xs">
            <span className="font-semibold text-zinc-100">{video.platform}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[90px] sm:max-w-none">{video.country}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {formatArchiveDate(video.date_added)}
            </span>
          </div>

          <h3 className="mt-1 font-display text-sm leading-snug font-semibold text-zinc-50 sm:mt-1.5 sm:text-base">
            <button
              type="button"
              onClick={() => onOpenDetail(video)}
              className="text-left hover:underline decoration-[#FACC15] decoration-2 underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15]"
            >
              {video.title}
            </button>
          </h3>

          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-zinc-200 sm:mt-1.5 sm:text-xs sm:leading-relaxed">
            {video.description || video.what_happened}
          </p>

          {video.categories.length > 0 && (
            <p className="mt-1.5 truncate text-[10px] font-medium text-emerald-300 sm:mt-2.5 sm:text-[11px]">
              {video.categories.join(' · ')}
            </p>
          )}
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-1 border-t border-zinc-600/80 px-2 py-2 sm:mt-2 sm:gap-2 sm:px-3.5 sm:py-2.5">
        {onSpotlight ? (
          <button
            type="button"
            onClick={() => onSpotlight(video)}
            aria-label={`Preview ${video.title} in spotlight`}
            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15] sm:px-2 sm:text-xs ${
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
          className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15] sm:px-2.5 sm:text-xs ${
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
