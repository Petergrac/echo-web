"use client";

import { Post } from "@/types/post";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import MediaGrid from "../post-media/MediaGrid";
import PostEngagements from "./PostEngagements";
import EngagementBadge from "./EngagementBadge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useCurrentUser } from "@/lib/hooks/useStore";
import UserAvatar from "@/components/profile/UserAvatar";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
  onMediaClick?: (mediaIndex: number) => void;
  onReply?: () => void;
  className?: string;
}

export default function PostCard({ post }: PostCardProps) {
  const [quote, setQuote] = useState(post.repostContent);
  const user = useCurrentUser();
  if (!user) return null;
  return (
    <Card data-post-element="true">
      <CardContent className="px-2">
        {/* Engagement badges if user has interacted */}
        <div className="flex items-center space-x-2 mb-2">
          {post.hasLiked && <EngagementBadge type="like" showText />}
          {post.hasReposted && <EngagementBadge type="repost" showText />}
          {post.hasBookmarked && <EngagementBadge type="bookmark" showText />}
        </div>
        {/* Header */}
        {!quote ? (
          <PostHeader post={post} />
        ) : (
          <div className="flex gap-2">
            <UserAvatar />
            <div className="flex items-center space-x-2">
              <h4 className="font-bold truncate hover:underline">
                {user.firstName + " " + user.lastName}
              </h4>
              <span className="text-gray-500 truncate  hover:underline">
                @{user.username}
              </span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500 text-sm  hover:underline">
                {formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        )}
        {/* Content */}
        <>
          {quote && <p className="px-1 py-3">{quote}</p>}
          <div
            className={
              post.repostContent !== null
                ? `mx-3 px-4 py-2 border rounded-sm`
                : ""
            }
          >
            {quote && <PostHeader post={post} />}
            <PostContent content={post.content} id={post.id} />
            {/* Media Grid */}
            {post.media && post.media.length > 0 && (
              <MediaGrid media={post.media} />
            )}{" "}
          </div>
        </>

        {/* Actions */}
        <div className="px-4 py-2">
          <PostEngagements
            quote={quote}
            setQuote={setQuote}
            postId={post.id}
            initialStatus={{
              hasLiked: post.hasLiked || false,
              hasReplied: post.hasReplied || false,
              hasReposted: post.hasReposted || false,
              hasBookmarked: post.hasBookmarked || false,
            }}
            stats={{
              likeCount: post.likeCount,
              replyCount: post.replyCount,
              repostCount: post.repostCount,
              viewCount: post.viewCount,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
