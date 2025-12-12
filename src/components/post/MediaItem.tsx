"use client";

import { useState } from "react";
import { Media } from "@/types/post";
import { Play, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface MediaItemProps {
  media: Media;
  className?: string;
}

export default function MediaItem({ media, className = "" }: MediaItemProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => setIsLoading(false);
  const handleError = () => setError(true);

  if (error) {
    return (
      <div
        className={`${className} bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-lg`}
      >
        <div className="text-center p-4">
          <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Failed to load media</p>
        </div>
      </div>
    );
  }

  if (media.resourceType === "video") {
    return (
      <div
        className={`${className} relative bg-black rounded-lg overflow-hidden`}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="animate-pulse">Loading video...</div>
          </div>
        )}
        <video
          src={media.mediaUrl}
          className="w-full h-full object-cover"
          controls
          onLoadedData={handleLoad}
          onError={handleError}
          poster={`${media.mediaUrl}?thumbnail`}
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          <Play className="w-3 h-3 inline mr-1" />
          Video
        </div>
      </div>
    );
  }

  // Image media
  return (
    <div
      className={`${className} relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden`}
    >
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
      )}
      <Image
        src={media.mediaUrl}
        alt="Post image"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
