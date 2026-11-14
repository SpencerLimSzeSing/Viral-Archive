import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { ViralVideo } from '../types/video';
import { formatArchiveDate } from '../utils/archiveLogic';
import { VideoCard } from './VideoCard';
import { VideoEmbedPlayer } from './VideoEmbedPlayer';

interface VideoDetailPageProps {
  video: ViralVideo;
  relatedVideos: ViralVideo[];
  bookmarkedIds: string[];
  onBack: () => void;
  onOpenDetail: (video: ViralVideo) => void;
  onToggleBookmark: (videoId: string) => void;
}

export function VideoDetailPage({
  video,
  relatedVideos,
  bookmarkedIds,
  onBack,
  onOpenDetail,
  onToggleBookmark,
}: VideoDetailPageProps) {
  const isBookmarked = bookmarkedIds.includes(video.id);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Top breadcrumb & bookmark action */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-200 transition-colors hover:border-zinc-400 hover:text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Archive</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleBookmark(video.id)}
          aria-pressed={isBookmarked}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15] ${
            isBookmarked
              ? 'border-[#FACC15] bg-[#FACC15] text-zinc-950'
              : 'border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-400'
          }`}
        >
          <span>{isBookmarked ? 'Saved in Archive' : 'Save Video'}</span>
        </button>
      </div>

      {/* Main 2-column Detail Layout: A. Original Video, B. Archival Context, C. Video Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-8">
        {/* Section A: Original Video */}
        <section
          aria-labelledby="section-original-video"
          className="space-y-4 lg:col-span-7 lg:col-start-1 lg:row-start-1"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id="section-original-video"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400"
            >
              A. Original Video
            </h2>
            <span className="text-xs font-medium text-zinc-300">
              {video.platform} · {video.country}
            </span>
          </div>

          <VideoEmbedPlayer video={video} />

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-zinc-100">Original Video URL</p>
              <p className="mt-0.5 truncate font-mono text-xs text-zinc-400">
                {video.original_url}
              </p>
            </div>
            <a
              href={video.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#FACC15] px-3.5 py-2 text-xs font-semibold text-zinc-950 hover:bg-[#EAB308] whitespace-nowrap shrink-0"
            >
              <span>Open Original Post on {video.platform}</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* Section B: Archival Context */}
        <section
          aria-labelledby="section-story-behind"
          className="rounded-2xl border border-zinc-950/30 bg-[#DEC03B] p-5 sm:p-6 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1"
        >
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-900">
            B. Archival Context
          </p>
          <h2
            id="section-story-behind"
            className="mt-1 font-display text-2xl font-bold text-zinc-950"
          >
            Why you should laugh?
          </h2>

          <div className="mt-5 space-y-5 text-sm leading-relaxed text-zinc-900">
            <div>
              <h3 className="font-display text-base font-bold text-zinc-950">
                The story behind the video
              </h3>
              <p className="mt-1">{video.what_happened}</p>
            </div>

            <div>
              <h3 className="font-display text-base font-bold text-zinc-950">
                What led to this moment?
              </h3>
              <p className="mt-1">{video.background_story}</p>
            </div>

            <div>
              <h3 className="font-display text-base font-bold text-zinc-950">
                Why it&apos;s funny
              </h3>
              <p className="mt-1">{video.why_viral}</p>
            </div>

            <div>
              <h3 className="font-display text-base font-bold text-zinc-950">
                Original source
              </h3>
              <p className="mt-1">
                <span className="font-semibold">{video.uploader}</span> on{' '}
                <span className="font-semibold">{video.platform}</span>
              </p>
            </div>

            <div>
              <h3 className="font-display text-base font-bold text-zinc-950">
                Additional context
              </h3>
              <p className="mt-1">
                {video.additional_context ||
                  'No other angles, original footage, or follow-up clips recorded yet.'}
              </p>
            </div>

            <div className="border-t border-zinc-950/15 pt-4">
              <h3 className="font-display text-base font-bold text-zinc-950">
                Original source link
              </h3>
              <div className="mt-2.5 flex flex-wrap items-center gap-3">
                <a
                  href={video.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-950 bg-[#FACC15] px-3.5 py-2 text-xs font-semibold text-zinc-950 hover:bg-[#EAB308]"
                >
                  <span>Visit Original Post</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section C: Video Information */}
        <section
          aria-labelledby="section-video-info"
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 lg:col-span-7 lg:col-start-1 lg:row-start-2"
        >
          <p
            id="section-video-info"
            className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400"
          >
            C. Video Information
          </p>

          <h1 className="mt-2 font-display text-2xl leading-tight font-bold text-zinc-50 [text-wrap:balance]">
            {video.title}
          </h1>

          <p className="mt-2.5 text-sm leading-relaxed text-zinc-300">
            {video.description}
          </p>

          <dl className="mt-5 divide-y divide-zinc-800 border-t border-zinc-800 text-xs">
            <div className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="font-medium text-zinc-400">Original uploader</dt>
              <dd className="text-right font-semibold text-zinc-100">{video.uploader}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="font-medium text-zinc-400">Platform</dt>
              <dd className="text-right font-semibold text-zinc-100">{video.platform}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="font-medium text-zinc-400">Country</dt>
              <dd className="text-right font-semibold text-zinc-100">{video.country}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 py-2.5">
              <dt className="font-medium text-zinc-400">Added to archive</dt>
              <dd className="text-right font-mono text-zinc-100 tabular-nums">
                {formatArchiveDate(video.date_added)}
              </dd>
            </div>
            <div className="py-2.5">
              <dt className="font-medium text-zinc-400">Categories</dt>
              <dd className="mt-1 font-medium text-emerald-400">
                {video.categories.length > 0 ? video.categories.join(' · ') : 'Uncategorized'}
              </dd>
            </div>
            <div className="py-2.5">
              <dt className="font-medium text-zinc-400">Tags</dt>
              <dd className="mt-1 text-zinc-300">
                {video.tags.length > 0 ? video.tags.join(' / ') : 'None listed'}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Section D: Related videos */}
      <section aria-labelledby="section-related-videos" className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              D. Related Videos
            </p>
            <h2
              id="section-related-videos"
              className="mt-0.5 font-display text-xl font-bold text-zinc-50"
            >
              Similar moments in the archive
            </h2>
          </div>
        </div>

        {relatedVideos.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedVideos.map((rel) => (
              <VideoCard
                key={rel.id}
                video={rel}
                isBookmarked={bookmarkedIds.includes(rel.id)}
                onOpenDetail={onOpenDetail}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 text-sm text-zinc-400">
            No related entries found yet.
          </p>
        )}
      </section>
    </div>
  );
}
