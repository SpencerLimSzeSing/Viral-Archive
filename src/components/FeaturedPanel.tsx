import { ArrowRight, ExternalLink, Shuffle } from 'lucide-react';
import type { ViralVideo } from '../types/video';
import { formatArchiveDate } from '../utils/archiveLogic';
import { VideoEmbedPlayer } from './VideoEmbedPlayer';

interface FeaturedPanelProps {
  video: ViralVideo;
  relatedVideos: ViralVideo[];
  isBookmarked: boolean;
  onOpenDetail: (video: ViralVideo) => void;
  onToggleBookmark: (videoId: string) => void;
  onSelectSpotlight: (video: ViralVideo) => void;
  onRandomPick: () => void;
}

export function FeaturedPanel({
  video,
  relatedVideos,
  isBookmarked,
  onOpenDetail,
  onToggleBookmark,
  onSelectSpotlight,
  onRandomPick,
}: FeaturedPanelProps) {
  return (
    <aside
      aria-label="Featured video spotlight and viral context"
      className="space-y-3.5"
    >
      {/* Random Video trigger directly on top of Featured Spotlight */}
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-400">
          Spotlight Pick
        </span>
        <button
          type="button"
          onClick={onRandomPick}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-950 bg-[#FACC15] px-3.5 py-2 text-xs font-semibold text-zinc-950 shadow-xs transition-transform duration-150 hover:-translate-y-0.5 hover:bg-[#EAB308] active:translate-y-0 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15]"
        >
          <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Random Video</span>
        </button>
      </div>

      {/* Yellow Featured Player Card (Wireframe center-right yellow block) */}
      <div className="rounded-2xl border border-zinc-950/30 bg-[#DEC03B] p-4 shadow-xs sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-950">
            Featured Spotlight
          </span>
          <span className="text-xs font-medium text-zinc-900">
            {video.platform} · {video.country} · {formatArchiveDate(video.date_added)}
          </span>
        </div>

        <VideoEmbedPlayer video={video} compact />

        <div className="mt-4">
          <h2 className="font-display text-lg leading-snug font-bold text-zinc-950 sm:text-xl">
            {video.title}
          </h2>

          {video.categories.length > 0 && (
            <p className="mt-1.5 text-xs font-medium text-zinc-900">
              {video.categories.join(' · ')}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenDetail(video)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-950 px-3.5 py-2 text-xs font-semibold text-zinc-100 transition-colors hover:bg-zinc-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
            >
              <span>Read Full Story</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => onToggleBookmark(video.id)}
              aria-pressed={isBookmarked}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 ${
                isBookmarked
                  ? 'border-zinc-950 bg-zinc-950 text-[#FACC15]'
                  : 'border-zinc-950/35 bg-[#FACC15] text-zinc-950 hover:bg-[#EAB308]'
              }`}
            >
              <span>{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            <a
              href={video.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-950/35 bg-zinc-950/10 px-3 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-950/20 whitespace-nowrap shrink-0"
            >
              <span>Open Original</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* Yellow Story Context Card (Wireframe far-right yellow block) */}
      <div className="rounded-2xl border border-zinc-950/30 bg-[#D4B42C] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 border-b border-zinc-950/15 pb-2.5">
          <h3 className="font-display text-base font-bold text-zinc-950">
            Why you should laugh?
          </h3>
        </div>

        <dl className="mt-3 space-y-2.5 text-xs leading-relaxed text-zinc-900">
          <div>
            <dt className="font-semibold text-zinc-950">The story behind the video:</dt>
            <dd className="mt-0.5 text-zinc-900">{video.what_happened}</dd>
          </div>

          <div>
            <dt className="font-semibold text-zinc-950">What led to this moment?</dt>
            <dd className="mt-0.5 text-zinc-900">{video.background_story}</dd>
          </div>

          {video.additional_context && (
            <div>
              <dt className="font-semibold text-zinc-950">Additional context:</dt>
              <dd className="mt-0.5 text-zinc-900">{video.additional_context}</dd>
            </div>
          )}

          <div>
            <dt className="font-semibold text-zinc-950">Video source:</dt>
            <dd className="mt-0.5 text-zinc-900">
              {video.uploader} on {video.platform}
            </dd>
          </div>

          {relatedVideos.length > 0 && (
            <div className="pt-1">
              <dt className="font-semibold text-zinc-950">Other angles &amp; follow-ups:</dt>
              <dd className="mt-1.5 space-y-1">
                {relatedVideos.map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onSelectSpotlight(rel)}
                    className="block w-full truncate rounded-md px-2 py-1 text-left text-xs font-medium text-zinc-950 underline decoration-zinc-900/50 underline-offset-2 hover:bg-zinc-950/15"
                  >
                    {rel.title}
                  </button>
                ))}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </aside>
  );
}
