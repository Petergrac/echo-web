"use client";

import { useCallback, useRef, useState, useMemo } from "react";
import { Button } from "../../ui/button";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MediaUploadProps {
  files: FileList | null;
  setFiles: (files: FileList | null) => void;
  maxFiles?: number;
  className?: string;
}

const MediaUpload = ({
  files,
  setFiles,
  maxFiles = 5,
  className,
}: MediaUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileArray = useMemo(() => (files ? Array.from(files) : []), [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);

    //* 1.Check if adding new files would exceed max
    if (fileArray.length + newFiles.length > maxFiles) {
      toast.warning(`You can only upload up to ${maxFiles} files`);
      return;
    }

    //* 2.Combine existing and new files
    const dataTransfer = new DataTransfer();

    //* 3.Add existing files
    fileArray.forEach((file) => dataTransfer.items.add(file));

    //* 4.Add new files
    newFiles.slice(0, maxFiles - fileArray.length).forEach((file) => {
      dataTransfer.items.add(file);
    });

    setFiles(dataTransfer.files);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (!droppedFiles.length) return;

      //* Check if adding new files would exceed max
      if (fileArray.length + droppedFiles.length > maxFiles) {
        toast.warning(`You can only upload up to ${maxFiles} files`);
        return;
      }

      const dataTransfer = new DataTransfer();

      // Add existing files
      fileArray.forEach((file) => dataTransfer.items.add(file));

      // Add new dropped files
      const filesToAdd = Array.from(droppedFiles).slice(
        0,
        maxFiles - fileArray.length
      );

      filesToAdd.forEach((file) => dataTransfer.items.add(file));

      setFiles(dataTransfer.files);
    },
    [fileArray, maxFiles, setFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeAllFiles = () => {
    setFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drop zone (shown when no files) */}
      {fileArray.length === 0 && (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all",
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-700 hover:border-blue-500 hover:bg-blue-500/5"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <Upload className="h-10 w-10 text-gray-500" />
            <div>
              <p className="font-medium">Drag & drop images/videos here</p>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse (max {maxFiles} files)
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2">
              <ImageIcon className="h-4 w-4 mr-2" />
              Select Files
            </Button>
          </div>
        </div>
      )}

      {/* File count indicator */}
      {fileArray.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <ImageIcon className="h-4 w-4" />
              <span>
                {fileArray.length} file{fileArray.length !== 1 ? "s" : ""}{" "}
                selected
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeAllFiles}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
