import { Film } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { VideoPlatform } from '../types/video';

interface VideoThumbnailProps {
  src: string;
  alt: string;
  platform: VideoPlatform;
  title: string;
  className?: string;
}

export function VideoThumbnail({
  src,
  alt,
  platform,
  title,
  className = '',
}: VideoThumbnailProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-800 to-zinc-700 px-3 py-3 text-center sm:px-5 sm:pt-4 sm:pb-10 ${className}`}
      >
        <Film className="mb-1.5 h-6 w-6 text-zinc-400 sm:mb-2 sm:h-8 sm:w-8" aria-hidden="true" />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-400 sm:text-[11px]">
          {platform} Original Post
        </p>
        <p className="mt-1 line-clamp-2 max-w-xs text-[11px] font-medium text-zinc-200 sm:text-xs">
          {title}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
