"use client";

import { useState } from "react";
import { Media } from "@/types/post";
import { Play, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface MediaItemProps {
  media: Media;
}

export default function MediaItem({ media }: MediaItemProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center text-sm text-gray-500">
          <ImageIcon className="w-6 h-6 mx-auto mb-1" />
          Failed to load
        </div>
      </div>
    );
  }

  if (media.resourceType === "video") {
    return (
      <div className="relative w-full h-full bg-black overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 animate-pulse text-xs text-white">
            Loading…
          </div>
        )}
        <video
          src={media.mediaUrl}
          poster={`${media.mediaUrl}?thumbnail`}
          className="w-full h-full object-cover"
          controls
          onLoadedMetadata={() => setIsLoading(false)}
          onError={() => setError(true)}
          onClick={(e) => e.stopPropagation()}
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <Play className="w-3 h-3" />
          Video
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-700" />
      )}
      <Image
        src={media.mediaUrl}
        alt="Post media"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
      />
    </div>
  );
}
