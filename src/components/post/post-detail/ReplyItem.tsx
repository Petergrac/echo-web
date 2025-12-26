"use client";
import api from "@/lib/api/axios";
import { PostReply } from "@/types/reply";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ReplyCompose from "./ReplyCompose";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { useCurrentUser } from "@/lib/stores/useStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUniversalInfiniteQuery } from "@/lib/hooks/useUniversalInfiniteQuery";
import InfiniteScrollTrigger from "@/components/shared/infiniteScrollTrigger";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { toast } from "sonner";

export default function ReplyItem({
  reply,
  depth = 0,
}: {
  reply: PostReply;
  depth?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyInput, setReplyInput] = useState(false);
  const [isPatching, setIsPatching] = useState(false);
  const [preview, setPreview] = useState(false);
  const [value, setValue] = useState("");
  const [media, setMedia] = useState<File | null>(null);

  const queryClient = useQueryClient();
  const user = useCurrentUser();

  const replyRef = useClickOutside(() => {
    if (replyInput) setReplyInput(false);
  });

  //* 1. Paginated Nested Replies
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: loadingChildren,
  } = useUniversalInfiniteQuery<PostReply>(
    ["replies", "nested", reply.id],
    `engagement/replies/${reply.id}/replies`,
    5,
    {
      enabled: isExpanded,
    }
  );

  const children = data?.pages.flatMap((page) => page.items) ?? [];

  //* 2.Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`engagement/replies/${reply.id}`),
    onSuccess: () => {
      //? Invalidate the parent query so the reply disappears
      queryClient.invalidateQueries({ queryKey: ["replies"] });
    },
  });
  //* 3.Edit Mutation
  const editMutation = useMutation({
    mutationFn: () =>
      isPatching
        ? api.patch(
            `engagement/posts/${reply.postId}/${reply.id}`,
            {
              content: value,
              media: media,
              parentReplyId: reply.parentReplyId,
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
        : api.post(
            `engagement/posts/${reply.postId}/reply`,
            {
              content: value,
              media: media,
              parentReplyId: reply.id,
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replies"],
      });
      toast.success(isPatching ? "Update success" : "Reply successful");
      setReplyInput(false);
      setIsPatching(false);
    },
    onError: () => {
      toast.error("Failed, Try again");
    },
  });
  //* 4.Expand the reply textarea and load more replies
  const toggleExpand = async () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className="flex flex-col w-full">
      {/* Reply Body */}
      <div className="flex gap-3 py-3">
        {/* Avatar/Vertical Line Area */}
        <Link
          href={`/${reply.author.username}`}
          className="flex flex-col items-center"
        >
          <Image
            width={24}
            height={24}
            alt="avatar"
            src={reply.author.avatar || `https://github.com/shadcn`}
            className="w-8 h-8 rounded-full"
          />
          {/* This creates the Reddit "Thread Line" */}
          {isExpanded && <div className="w-px h-full bg-sky-600 my-1" />}
        </Link>

        <div className="flex-1">
          <div className="flex gap-2">
            <Link
              href={`/users/${reply.author.username}`}
              className="flex items-center gap-2 text-sm"
            >
              <span className="font-bold">{reply.author.username}</span>
              <span className="text-gray-500 text-xs">
                {new Date(reply.createdAt).toLocaleDateString()}
              </span>
            </Link>
            {reply.author.id === user?.id && (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <MoreVertical className="text-gray-400" size={18} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => deleteMutation.mutate()}
                    className="flex gap-2 items-center"
                  >
                    <Trash2 size={18} className="text-rose-500" />
                    <p className="text-xs text-red-500">Delete</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setReplyInput((f) => !f);
                      setIsPatching(true);
                      setValue(reply.content);
                    }}
                    className="flex gap-2 items-center"
                  >
                    <Edit2 size={18} />
                    <p className="text-xs">Edit</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="text-gray-300 mt-1">{reply.content}</p>
          {reply.media.length > 0 && (
            <Image
              src={reply.media[0].mediaUrl}
              alt="reply-media"
              width={150}
              onClick={() => setPreview((f) => !f)}
              className="mt-1 rounded-sm"
              height={150}
            />
          )}
          {preview && reply.media.length > 0 && (
            <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/95">
              <button
                onClick={() => setPreview(false)}
                className="absolute top-4 right-4 text-white text-2xl"
              >
                ✕
              </button>
              <Image
                src={reply.media[0].mediaUrl}
                alt="reply-media"
                width={400}
                onClick={() => setPreview((f) => !f)}
                className="mt-1 rounded-sm"
                height={400}
              />
            </div>
          )}
          {/* Action Buttons */}
          <div className="flex gap-4 mt-2 text-xs font-semibold text-gray-500">
            <button
              onClick={() => setReplyInput((f) => !f)}
              disabled={depth >= 6}
              className="hover:underline"
            >
              Reply
            </button>
            {reply.directDescendantsCount > 0 && (
              <button
                onClick={toggleExpand}
                className="text-blue-600 hover:underline"
              >
                {isExpanded
                  ? "Hide Replies"
                  : `View ${reply.directDescendantsCount} Replies`}
              </button>
            )}
          </div>
          {replyInput && (
            <div
              ref={replyRef}
              className="fixed bottom-0 w-full sm:w-150 sm:left-1/2 sm:-translate-x-1/3 z-80 bg-black left-0"
            >
              <ReplyCompose
                value={value}
                setValue={setValue}
                setMedia={setMedia}
                setReplyInput={setReplyInput}
                placeholder="Comment this reply"
                media={media}
                handleSubmit={() => editMutation.mutate()}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies (Recursion) */}
      {isExpanded && (
        <div className="pl-10 border-l border-sky-500 ml-4">
          {loadingChildren && (
            <p className="border-sky-500 w-full border-y rounded-full animate-spin"></p>
          )}
          {children.map((child: PostReply) => (
            <ReplyItem key={child.id} reply={child} depth={depth + 1} />
          ))}
          <InfiniteScrollTrigger
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      )}
    </div>
  );
}
