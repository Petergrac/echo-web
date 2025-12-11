"use client";

import * as React from "react";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { X, Video, File, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/button";

interface FilePreviewProps {
  files: FileList | null;
  setFiles: (files: FileList | null) => void;
}

const FilePreview = ({ files, setFiles }: FilePreviewProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [videoSrcs, setVideoSrcs] = React.useState<Record<string, string>>({});
  const [imageSrcs, setImageSrcs] = React.useState<Record<string, string>>({});

  // Convert FileList to array
  const fileArray = React.useMemo(() => {
    if (!files) return [];
    return Array.from(files).slice(0, 5);
  }, [files]);

  // Create object URLs when files change
  React.useEffect(() => {
    const newImageSrcs: Record<string, string> = {};
    const newVideoSrcs: Record<string, string> = {};

    fileArray.forEach((file, index) => {
      const key = `${file.name}-${file.size}-${index}`;
      try {
        const url = URL.createObjectURL(file);
        if (file.type.startsWith("image/")) {
          newImageSrcs[key] = url;
        } else if (file.type.startsWith("video/")) {
          newVideoSrcs[key] = url;
        }
      } catch (error) {
        console.error("Error creating object URL:", error);
      }
    });

    setImageSrcs(newImageSrcs);
    setVideoSrcs(newVideoSrcs);

    // Cleanup function
    return () => {
      // Revoke all URLs on cleanup
      Object.values(newImageSrcs).forEach((url) => URL.revokeObjectURL(url));
      Object.values(newVideoSrcs).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileArray]);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    if (!files) return;

    // Revoke the URL for the removed file
    const fileToRemove = fileArray[index];
    const key = `${fileToRemove.name}-${fileToRemove.size}-${index}`;

    if (fileToRemove.type.startsWith("image/") && imageSrcs[key]) {
      URL.revokeObjectURL(imageSrcs[key]);
      setImageSrcs((prev) => {
        const newSrcs = { ...prev };
        delete newSrcs[key];
        return newSrcs;
      });
    } else if (fileToRemove.type.startsWith("video/") && videoSrcs[key]) {
      URL.revokeObjectURL(videoSrcs[key]);
      setVideoSrcs((prev) => {
        const newSrcs = { ...prev };
        delete newSrcs[key];
        return newSrcs;
      });
    }

    // Update files
    const dataTransfer = new DataTransfer();
    Array.from(files).forEach((file, i) => {
      if (i !== index) {
        dataTransfer.items.add(file);
      }
    });

    setFiles(dataTransfer.files.length > 0 ? dataTransfer.files : null);
  };

  // Helper to get URL for a file
  const getFileUrl = (file: File, index: number) => {
    const key = `${file.name}-${file.size}-${index}`;

    if (file.type.startsWith("image/")) {
      return imageSrcs[key] || null; // Return null instead of empty string
    } else if (file.type.startsWith("video/")) {
      return videoSrcs[key] || null; // Return null instead of empty string
    }

    return null;
  };

  if (!files || fileArray.length === 0) {
    return null;
  }

  return (
    <div className="relative mb-4">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {fileArray.map((file, index) => {
            const fileUrl = getFileUrl(file, index);

            return (
              <CarouselItem key={`${file.name}-${index}`}>
                <Card className="relative overflow-hidden bg-gray-900">
                  {/* Remove button */}
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  <CardContent className="flex aspect-square items-center justify-center p-0">
                    {file.type.startsWith("image/") ? (
                      fileUrl ? (
                        <img
                          src={fileUrl}
                          alt={`Preview ${index + 1}`}
                          className="w-full max-h-[400px] object-contain rounded-lg"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8">
                          <ImageIcon className="text-4xl mb-2 text-gray-400" />
                          <div className="text-sm text-gray-500">
                            Loading image...
                          </div>
                        </div>
                      )
                    ) : file.type.startsWith("video/") ? (
                      fileUrl ? (
                        <div className="relative w-full h-full">
                          <video
                            src={fileUrl} // Will be null if not ready, preventing empty string
                            className="h-full w-full object-contain rounded-lg"
                            controls
                            crossOrigin="anonymous"
                            preload="metadata"
                            playsInline
                          />
                          <div className="absolute bottom-2 right-2 bg-black/60 rounded-full p-1">
                            <Video className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8">
                          <Video className="text-4xl mb-2 text-gray-400" />
                          <div className="text-sm text-gray-500">
                            Loading video...
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8">
                        <File className="text-4xl mb-2 text-gray-400" />
                        <div className="text-sm text-gray-500 truncate max-w-full">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {(file.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {fileArray.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      {/* Bottom info */}
      <div className="flex items-center justify-between py-2 px-1">
        <div className="text-muted-foreground text-sm">
          {current} of {count}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
