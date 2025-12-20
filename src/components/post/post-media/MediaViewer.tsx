"use client";

import { Media } from "@/types/post";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface MediaViewerProps {
  media: Media[];
  startIndex: number;
}

export default function MediaViewer({
  media,
  startIndex,
}: MediaViewerProps) {
  return (
        <Carousel
          opts={{ startIndex }}
          className="w-full h-[80vh]"
        >
          <CarouselContent>
            {media.map((item) => (
              <CarouselItem key={item.id}>
                <div className="relative w-full h-[80vh] flex items-center justify-center">
                  {item.resourceType === "video" ? (
                    <video
                      src={item.mediaUrl}
                      poster={`${item.mediaUrl}?thumbnail`}
                      className="max-h-full max-w-full"
                      controls
                    />
                  ) : (
                    <Image
                      src={item.mediaUrl}
                      alt="Media preview"
                      fill
                      className="object-contain"
                    />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
  );
}
