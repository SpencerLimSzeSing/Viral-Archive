import { ExternalLink, Play, VideoOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  detectPlatformFromUrl,
  isYouTubeShortsUrl,
  resolveEmbedConfig,
} from '../services/videoEmbed';
import type { ViralVideo } from '../types/video';
import { VideoThumbnail } from './VideoThumbnail';

interface VideoEmbedPlayerProps {
  video: ViralVideo;
  compact?: boolean;
}

function parseInstagramMeasureHeight(rawData: unknown): number | null {
  try {
    const payload =
      typeof rawData === 'string' ? (JSON.parse(rawData) as unknown) : rawData;
    if (
      payload &&
      typeof payload === 'object' &&
      'type' in payload &&
      (payload as { type?: unknown }).type === 'MEASURE' &&
      'details' in payload
    ) {
      const height = (payload as { details?: { height?: unknown } }).details?.height;
      if (typeof height === 'number' && Number.isFinite(height) && height > 120) {
        return Math.ceil(height);
      }
    }
  } catch {
    // Ignore unrelated cross-origin postMessage payloads
  }
  return null;
}

export function VideoEmbedPlayer({ video, compact = false }: VideoEmbedPlayerProps) {
  const [playerRequested, setPlayerRequested] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [instagramHeight, setInstagramHeight] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setPlayerRequested(false);
    setIframeError(false);
    setInstagramHeight(null);
  }, [video.id]);

  useEffect(() => {
    if (!playerRequested || video.platform !== 'Instagram') return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const originHost = new URL(event.origin).hostname.toLowerCase();
        if (originHost !== 'instagram.com' && !originHost.endsWith('.instagram.com')) {
          return;
        }
      } catch {
        return;
      }

      if (
        iframeRef.current?.contentWindow &&
        event.source !== iframeRef.current.contentWindow
      ) {
        return;
      }

      const measured = parseInstagramMeasureHeight(event.data);
      if (measured !== null) {
        setInstagramHeight(measured);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [playerRequested, video.platform]);

  const embedInfo = resolveEmbedConfig(video);
  const effectivePlatform =
    detectPlatformFromUrl(video.original_url) ??
    detectPlatformFromUrl(video.embed_url ?? '') ??
    video.platform;
  const isYouTube = effectivePlatform === 'YouTube';
  const isYouTubeShorts = isYouTube && isYouTubeShortsUrl(video.original_url);
  const previewFrameClass = isYouTube
    ? isYouTubeShorts
      ? 'mx-auto aspect-[9/16] w-full max-w-[360px]'
      : 'aspect-video w-full'
    : compact
      ? 'aspect-[4/3] w-full'
      : 'aspect-video w-full';

  // Never autoplay with sound: wait until user explicitly requests to load the player
  if (!playerRequested) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-zinc-900/15 bg-zinc-900">
        <div className={previewFrameClass}>
          <VideoThumbnail
            src={video.thumbnail_url}
            alt={`Preview frame for ${video.title}`}
            platform={effectivePlatform}
            title={video.title}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2.5 p-3.5 text-white sm:p-4">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-wider text-yellow-200">
              {effectivePlatform} Official Embed
            </p>
            <p className="mt-0.5 text-xs text-zinc-200">
              Player loads only on request (never autoplays with sound).
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPlayerRequested(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#FACC15] px-4 py-2 text-xs font-semibold text-zinc-950 shadow-sm transition-colors duration-150 hover:bg-[#EAB308] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Play className="h-3.5 w-3.5 fill-zinc-950" aria-hidden="true" />
            <span>{embedInfo.canEmbed ? 'Load Original Embed' : 'Inspect Source Preview'}</span>
          </button>
        </div>
      </div>
    );
  }

  if (embedInfo.canEmbed && embedInfo.embedUrl && !iframeError) {
    const isInstagram = effectivePlatform === 'Instagram';
    const isTikTok = effectivePlatform === 'TikTok';

    return (
      <div
        className={`overflow-hidden rounded-xl border border-zinc-900/15 ${
          isInstagram ? 'bg-white' : 'bg-zinc-950'
        }`}
      >
        {isInstagram ? (
          <div className="w-full bg-white">
            <iframe
              ref={iframeRef}
              src={embedInfo.embedUrl}
              title={`${video.title} (${video.platform} official embed)`}
              height={instagramHeight ?? (compact ? 640 : 760)}
              scrolling={instagramHeight ? 'no' : 'auto'}
              className="block w-full border-0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              onError={() => setIframeError(true)}
            />
          </div>
        ) : (
          <div
            className={
              isTikTok
                ? 'mx-auto h-[620px] w-full max-w-[380px]'
                : isYouTube
                  ? isYouTubeShorts
                    ? 'mx-auto aspect-[9/16] w-full max-w-[360px]'
                    : 'aspect-video w-full'
                  : compact
                    ? 'aspect-[4/3] w-full'
                    : 'aspect-video w-full'
            }
          >
            <iframe
              ref={iframeRef}
              src={embedInfo.embedUrl}
              title={`${video.title} (${effectivePlatform} official embed)`}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              loading="lazy"
              onError={() => setIframeError(true)}
            />
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-zinc-300">
          <span>{embedInfo.officialMechanism}</span>
          <button
            type="button"
            onClick={() => setPlayerRequested(false)}
            className="font-medium text-yellow-300 hover:text-yellow-200 underline underline-offset-2"
          >
            Close Embed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-900/15 bg-white">
      <div className="relative aspect-video w-full bg-zinc-100">
        <VideoThumbnail
          src={video.thumbnail_url}
          alt={`Archival frame for ${video.title}`}
          platform={effectivePlatform}
          title={video.title}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/75 p-5 text-center text-white">
          <VideoOff className="mb-2 h-7 w-7 text-[#FACC15]" aria-hidden="true" />
          <h4 className="font-display text-base font-semibold">
            Direct {effectivePlatform} Playback Unavailable
          </h4>
          <p className="mt-1.5 max-w-md text-xs leading-relaxed text-zinc-200">
            {embedInfo.fallbackReason}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <a
              href={video.original_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#FACC15] px-3.5 py-2 text-xs font-semibold text-zinc-950 hover:bg-[#EAB308]"
            >
              <span>Open on {effectivePlatform}</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => setPlayerRequested(false)}
              className="rounded-lg border border-zinc-500 px-3 py-2 text-xs font-medium text-white hover:bg-white/10"
            >
              Show Thumbnail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
