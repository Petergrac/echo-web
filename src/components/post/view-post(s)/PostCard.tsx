"use client";

import { Post } from "@/types/post";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import MediaGrid from "../post-media/MediaGrid";
import PostActions from "./PostActions";
import EngagementBadge from "./EngagementBadge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

interface PostCardProps {
  post: Post;
  onMediaClick?: (mediaIndex: number) => void;
  onReply?: () => void;
  className?: string;
}

export default function PostCard({ post, className = "" }: PostCardProps) {
  const [quote, setQuote] = useState(post.repostContent);
  console.log(quote);
  return (
    <Card className={`border ${className}`} data-post-element="true">
      <CardContent className="px-2">
        {/* Engagement badges if user has interacted */}
        <div className="flex items-center space-x-2 mb-2">
          {post.hasLiked && <EngagementBadge type="like" showText />}
          {post.hasReposted && <EngagementBadge type="repost" showText />}
          {post.hasBookmarked && <EngagementBadge type="bookmark" showText />}
        </div>
        {/* Header */}
        <PostHeader post={post} />
        {/* Content */}
        <>
          {quote && <p className="px-1 py-3">{quote}</p>}
          <div
            className={
              post.repostContent !== null ? `pl-10 border rounded-sm` : ""
            }
          >
            <PostContent content={post.content} id={post.id} />
            {/* Media Grid */}
            {post.media && post.media.length > 0 && (
              <MediaGrid media={post.media} />
            )}{" "}
          </div>
        </>

        {/* Actions */}
        <div className="px-4 py-2">
          <PostActions
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
