"use client";

import { Post } from "@/types/post";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import MediaGrid from "./MediaGrid";
import PostActions from "./PostActions";
import EngagementBadge from "./EngagementBadge";
import { Card, CardContent } from "@/components/ui/card";

interface PostCardProps {
  post: Post;
  onMediaClick?: (mediaIndex: number) => void;
  onReply?: () => void;
  className?: string;
}

export default function PostCard({
  post,
  onMediaClick,
  className = "",
}: PostCardProps) {
  const handleAction = async (action: string, newState: boolean) => {
    // Implement API calls here
    console.log(
      `${action} ${newState ? "added" : "removed"} for post ${post.id}`
    );
  };

  return (
    <Card className={`border ${className}`} data-post-element="true">
      <CardContent className="px-2">
        {/* Engagement badges if user has interacted */}
        <div className="flex items-center space-x-2 mb-2">
          {post.postStatus?.hasLiked && (
            <EngagementBadge type="like" showText />
          )}
          {post.postStatus?.hasReposted && (
            <EngagementBadge type="repost" showText />
          )}
          {post.postStatus?.hasBookmarked && (
            <EngagementBadge type="bookmark" showText />
          )}
        </div>
        {/* Header */}
        <PostHeader post={post} />
        {/* Content */}
        <PostContent content={post.content} id={post.id} />
        {/* Media Grid */}
        {post.media && post.media.length > 0 && (
          <MediaGrid media={post.media} onMediaClick={onMediaClick} />
        )}{" "}
        {/* Actions */}
        <div className="px-4 py-2">
          <PostActions
            postId={post.id}
            initialStatus={{
              hasLiked: post.postStatus?.hasLiked || false,
              hasReposted: post.postStatus?.hasReposted || false,
              hasBookmarked: post.postStatus?.hasBookmarked || false,
            }}
            onAction={handleAction}
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
