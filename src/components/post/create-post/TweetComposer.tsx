/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { Button } from "../../ui/button";
import AutoResizeTextarea from "./AutoResizeTextArea";
import CharacterProgress from "./CharacterProgress";
import FilePreview from "./Carousel";
import MediaUpload from "./MediaUpload";
import VisibilitySelect from "./VisibilitySelect";
import ToolbarActions from "./ToolbarActions";
import UserAvatar from "../../profile/UserAvatar";
import api from "@/lib/api/axios";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type VisibilitySetting = "public" | "followers" | "private";
type feedTypeType = "forYou" | "following";
const TweetComposer = ({ feedType }: { feedType: feedTypeType }) => {
  const [tweetContent, setTweetContent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [visibilitySetting, setVisibilitySetting] =
    useState<VisibilitySetting>("public");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  const postMutation = useMutation({
    mutationFn: async () => {
      await api.post(
        `posts/`,
        {
          content: tweetContent,
          visibility: visibilitySetting,
          media: files,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    onSuccess: () => {
      setTweetContent("");
      queryClient.invalidateQueries({
        queryKey: ["posts", feedType],
      });
      toast.success("Tweet posted successfully!");
      setFiles(null);
      setVisibilitySetting("public");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  //TODO===> Function to insert emoji at cursor position
  const insertEmoji = (emoji: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    const textBefore = tweetContent.substring(0, cursorPosition);
    const textAfter = tweetContent.substring(textarea.selectionEnd);

    const newText = textBefore + emoji + textAfter;
    setTweetContent(newText);

    //*  Focus back to textarea and position cursor after emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        cursorPosition + emoji.length,
        cursorPosition + emoji.length
      );
    }, 0);
  };
  //todo=> Handle post submission
  const handleSubmit = async () => {
    if (!tweetContent.trim() && (!files || files.length === 0)) {
      toast.warning("Please add some content or media");
      return;
    }
    postMutation.mutate();
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
          {/*//* Textarea */}
          <AutoResizeTextarea
            ref={textareaRef}
            value={tweetContent}
            onChange={setTweetContent}
            onKeyDown={handleKeyDown}
            placeholder="What's happening?"
            maxLength={280}
          />

          {/*//? Media Upload Section */}
          <MediaUpload files={files} setFiles={setFiles} maxFiles={5} />

          {/*//? File Preview (when files are selected) */}
          {files && files.length > 0 && (
            <FilePreview files={files} setFiles={setFiles} />
          )}

          {/*//? Reply Settings and Character Counter */}
          <div className="flex justify-between items-center">
            <VisibilitySelect
              value={visibilitySetting}
              onChange={setVisibilitySetting}
            />
            <CharacterProgress tweetSize={tweetContent.length} />
          </div>

          {/*//? Toolbar and Post Button */}
          <div className="flex border-t justify-between w-full pl-4">
            <ToolbarActions
              onMediaClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.multiple = true;
                input.accept = "image/*,video/*";
                input.onchange = (e: any) => setFiles(e.target.files);
                input.click();
              }}
              onEmojiSelect={insertEmoji}
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
