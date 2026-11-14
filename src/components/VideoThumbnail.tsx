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
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-800 to-zinc-700 px-5 pt-4 pb-10 text-center ${className}`}
      >
        <Film className="mb-2 h-8 w-8 text-zinc-400" aria-hidden="true" />
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          {platform} Original Post
        </p>
        <p className="mt-1 line-clamp-2 max-w-xs text-xs font-medium text-zinc-200">
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
