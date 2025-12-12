"use client";

import { Media } from "@/types/post";
import MediaItem from "./MediaItem";
import { useState } from "react";

interface MediaGridProps {
  media: Media[];
  onMediaClick?: (index: number) => void;
}

export default function MediaGrid({ media, onMediaClick }: MediaGridProps) {
  const [expanded, setExpanded] = useState(false);

  if (!media.length) return null;

  const getGridClasses = (count: number): string => {
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2 gap-1";
      case 3:
        return "grid-cols-2 gap-1";
      case 4:
        return "grid-cols-2 gap-1";
      case 5:
        return "grid-cols-3 gap-1";
      default:
        return "grid-cols-1";
    }
  };

  const renderMedia = () => {
    const mediaToShow = expanded ? media : media.slice(0, 4);

    return mediaToShow.map((item, index) => {
      let className = "aspect-square";

      // Special handling for different grid layouts
      if (media.length === 1) {
        className = "aspect-video";
      } else if (media.length === 3) {
        if (index === 0) className = "row-span-2 aspect-square";
      } else if (media.length === 5 && index === 4) {
        className = "col-span-2 aspect-video";
      }

      return (
        <div
          key={item.id}
          className={`relative cursor-pointer ${className}`}
          onClick={() => onMediaClick?.(index)}
        >
          <MediaItem media={item} className="w-full h-full" />
          {index === 3 && media.length > 4 && !expanded && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                +{media.length - 4} more
              </span>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className={`grid ${getGridClasses(
        media.length
      )} rounded-xl overflow-hidden`}
    >
      {renderMedia()}
      {media.length > 4 && !expanded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}
          className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-3 py-1 rounded-full"
        >
          Show all
        </button>
      )}
    </div>
  );
}
