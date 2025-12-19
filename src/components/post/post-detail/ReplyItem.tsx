"use client";
import api from "@/lib/api/axios";
import { PostReply } from "@/types/reply";
import Image from "next/image";
import { useState } from "react";

export default function ReplyItem({
  reply,
  depth = 0,
}: {
  reply: PostReply;
  depth?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [children, setChildren] = useState<PostReply[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleExpand = async () => {
    if (
      !isExpanded &&
      children.length === 0 &&
      reply.directDescendantsCount > 0
    ) {
      setLoading(true);
      const res = await api.get(`engagement/replies/${reply.id}/replies`);
      const data = res.data as { replies: PostReply[] };
      setChildren(data.replies);
      setLoading(false);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Reply Body */}
      <div className="flex gap-3 py-3">
        {/* Avatar/Vertical Line Area */}
        <div className="flex flex-col items-center">
          <Image
            width={24}
            height={24}
            alt="avatar"
            src={reply.author.avatar || `https://github.com/shadcn`}
            className="w-8 h-8 rounded-full"
          />
          {/* This creates the Reddit "Thread Line" */}
          {isExpanded && <div className="w-px h-full bg-gray-400 my-1" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold">{reply.author.username}</span>
            <span className="text-gray-500 text-xs">
              {new Date(reply.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="text-gray-800 mt-1">{reply.content}</p>
          {reply.media && (
            <Image
              src={reply.media[0].mediaUrl}
              alt="reply-media"
              width={40}
              className="mt-1 rounded-sm"
              height={40}
            />
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-2 text-xs font-semibold text-gray-500">
            <button className="hover:underline">Reply</button>
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
        </div>
      </div>

      {/* Nested Replies (Recursion) */}
      {isExpanded && (
        <div className="pl-10 border-l border-gray-200 ml-4">
          {loading && <p className="text-xs text-gray-400">Loading...</p>}
          {children.map((child: PostReply) => (
            <ReplyItem key={child.id} reply={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
