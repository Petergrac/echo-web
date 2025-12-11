"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import AutoResizeTextarea from "./AutoResizeTextArea";
import CharacterProgress from "./CharacterProgress";
import FilePreview from "./Carousel";
import MediaUpload from "./MediaUpload";
import ReplySettingsSelect from "./ReplySettingsSelect";
import ToolbarActions from "./ToolbarActions";
import UserAvatar from "../profile/UserAvatar";

type ReplySetting = "everyone" | "following" | "mentioned";

const TweetComposer = () => {
  const [tweetContent, setTweetContent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [replySetting, setReplySetting] = useState<ReplySetting>("everyone");

  // Handle post submission
  const handleSubmit = async () => {
    if (!tweetContent.trim() && (!files || files.length === 0)) {
      alert("Please add some content or media");
      return;
    }

    const formData = new FormData();

    // Add tweet content
    formData.append("content", tweetContent);
    formData.append("replySetting", replySetting);

    // Add files if any
    if (files) {
      Array.from(files).forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
    }

    try {
      console.log("Posting tweet with:", {
        content: tweetContent,
        replySetting,
        fileCount: files?.length || 0,
      });

      // TODO: Replace with your actual API endpoint
      // const response = await fetch("/api/tweets", {
      //   method: "POST",
      //   body: formData,
      // });

      // Clear form after successful submission
      setTweetContent("");
      setFiles(null);
      setReplySetting("everyone");

      alert("Tweet posted successfully!");
    } catch (error) {
      console.error("Error posting tweet:", error);
      alert("Failed to post tweet. Please try again.");
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="md:pt-12 pt-25">
      <div className="px-5 pt-5 flex items-start justify-start gap-2">
        {/* Avatar - Hidden on mobile */}
        <UserAvatar className="hidden md:block" />

        <div className="flex flex-col gap-5 w-full">
          {/* Textarea */}
          <AutoResizeTextarea
            value={tweetContent}
            onChange={setTweetContent}
            onKeyDown={handleKeyDown}
            placeholder="What's happening?"
            maxLength={280}
          />

          {/* Media Upload Section */}
          <MediaUpload files={files} setFiles={setFiles} maxFiles={5} />

          {/* File Preview (when files are selected) */}
          {files && files.length > 0 && (
            <FilePreview files={files} setFiles={setFiles} />
          )}

          {/* Reply Settings and Character Counter */}
          <div className="flex justify-between items-center">
            <ReplySettingsSelect
              value={replySetting}
              onChange={setReplySetting}
            />
            <CharacterProgress tweetSize={tweetContent.length} />
          </div>

          {/* Toolbar and Post Button */}
          <div className="flex border-t justify-between w-full pl-4">
            <ToolbarActions
              onMediaClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = true;
                input.accept = "image/*,video/*";
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                input.onchange = (e: any) => setFiles(e.target.files);
                input.click();
              }}
            />
            <Button
              onClick={handleSubmit}
              disabled={!tweetContent.trim() && (!files || files.length === 0)}
              className="my-6 rounded-full text-white bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetComposer;
