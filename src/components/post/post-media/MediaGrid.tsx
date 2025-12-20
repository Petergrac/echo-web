"use client";

import { Media } from "@/types/post";
import { useState } from "react";
import MediaItem from "./MediaItem";
import MediaViewer from "./MediaViewer";

interface MediaGridProps {
  media: Media[];
}

export default function MediaGrid({ media }: MediaGridProps) {
  const [expanded, setExpanded] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!media.length) return null;

  const visibleMedia = expanded ? media : media.slice(0, 4);

  const gridCols =
    media.length === 1
      ? "grid-cols-1"
      : media.length <= 4
      ? "grid-cols-2 gap-1"
      : "grid-cols-3 gap-1";

  const handleOpenViewer = (index: number) => {
    setActiveIndex(index);
    setViewerOpen(true);
  };

  return (
    <>
      <div className={`relative grid ${gridCols} rounded-xl overflow-hidden`}>
        {visibleMedia.map((item, index) => {
          const realIndex = expanded ? index : index;

          let layoutClass = "aspect-square";
          if (media.length === 1) layoutClass = "aspect-video";
          if (media.length === 3 && index === 0) layoutClass = "row-span-2";
          if (media.length === 5 && index === 4)
            layoutClass = "col-span-2 aspect-video";

          return (
            <div
              key={item.id}
              className={`relative cursor-pointer ${layoutClass}`}
              onClick={() => handleOpenViewer(realIndex)}
            >
              <MediaItem media={item} />
              {index === 3 && media.length > 4 && !expanded && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold">
                  +{media.length - 4} more
                </div>
              )}
            </div>
          );
        })}

        {media.length > 4 && !expanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(true);
            }}
            className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full"
          >
            Show all
          </button>
        )}
      </div>

      {viewerOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95">
          <button
            onClick={() => setViewerOpen(false)}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            ✕
          </button>
          <MediaViewer media={media} startIndex={activeIndex} />
        </div>
      )}
    </>
  );
}
