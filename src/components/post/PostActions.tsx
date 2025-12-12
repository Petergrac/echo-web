// components/post/PostActions.tsx
"use client";

import { useState } from "react";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Bookmark,
  Share,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

interface PostActionsProps {
  postId: string;
  stats: {
    likeCount: number;
    replyCount: number;
    repostCount: number;
    bookmarkCount?: number;
    viewCount?: number;
  };
  initialStatus?: {
    hasLiked: boolean;
    hasReposted: boolean;
    hasBookmarked: boolean;
    hasReplied?: boolean;
  };
  onAction?: (action: string, newState: boolean) => Promise<void>;
}

export default function PostActions({
  postId,
  stats,
  initialStatus = {
    hasLiked: true,
    hasReposted: false,
    hasBookmarked: false,
    hasReplied: false,
  },
  onAction,
}: PostActionsProps) {
  const [status, setStatus] = useState(initialStatus);
  const [counts, setCounts] = useState(stats);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleAction = async (action: keyof typeof status) => {
    if (isLoading) return;

    setIsLoading(action);
    const newValue = !status[action];

    // Optimistic update for status
    setStatus((prev) => ({ ...prev, [action]: newValue }));

    // Optimistic update for counts
    const countKeyMap = {
      hasLiked: "likeCount",
      hasReposted: "repostCount",
      hasBookmarked: "bookmarkCount",
      hasReplied: "replyCount",
    } as const;

    const countKey = countKeyMap[action];
    if (countKey) {
      setCounts((prev) => ({
        ...prev,
        [countKey]: newValue
          ? (prev[countKey] ?? 0) + 1
          : (prev[countKey] ?? 0) - 1,
      }));
    }

    try {
      if (onAction) {
        await onAction(action, newValue);
      } else {
        // Default API call
        await fetch(`/api/posts/${postId}/${action}`, {
          method: newValue ? "POST" : "DELETE",
        });
      }
    } catch (error) {
      // Revert on error
      setStatus((prev) => ({ ...prev, [action]: !newValue }));
      if (countKey) {
        setCounts((prev) => ({
          ...prev,
          [countKey]: newValue
            ? (prev[countKey] ?? 0) - 1
            : (prev[countKey] ?? 0) + 1,
        }));
      }
      console.error(`Failed to ${action} post:`, error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleReply = () => {
    console.log("Open reply for post:", postId);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this post",
        url: `${window.location.origin}/post/${postId}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
      // Show toast notification
      toast.success("Link copied to clipboard!");
    }
  };

  const actionItems = [
    {
      id: "reply",
      icon: MessageCircle,
      label: "Reply",
      color: "text-gray-500 hover:text-sky-500 hover:bg-sky-500/10",
      activeColor: "text-sky-500 bg-sky-500/10",
      onClick: handleReply,
      count: counts.replyCount,
      showCount: true,
      active: status.hasReplied,
    },
    {
      id: "repost",
      icon: Repeat2,
      label: "Repost",
      color: "text-gray-500 hover:text-green-500 hover:bg-green-500/10",
      activeColor: "text-green-500 bg-green-500/10",
      onClick: () => handleAction("hasReposted"),
      count: counts.repostCount,
      showCount: true,
      active: status.hasReposted,
    },
    {
      id: "like",
      icon: Heart,
      label: "Like",
      color: "text-gray-500 hover:text-red-500 hover:bg-red-500/10",
      activeColor: "text-red-500 bg-red-500/10",
      onClick: () => handleAction("hasLiked"),
      count: counts.likeCount,
      showCount: true,
      active: status.hasLiked,
    },
    {
      id: "bookmark",
      icon: Bookmark,
      label: "Bookmark",
      color: "text-gray-500 hover:text-yellow-500 hover:bg-yellow-500/10",
      activeColor: "text-yellow-500 bg-yellow-500/10",
      onClick: () => handleAction("hasBookmarked"),
      showCount: false,
      active: status.hasBookmarked,
    },
    {
      id: "share",
      icon: Share,
      label: "Share",
      color: "text-gray-500 hover:text-blue-500 hover:bg-blue-500/10",
      onClick: handleShare,
      showCount: false,
    },
    {
      id: "analytics",
      icon: BarChart3,
      label: "Analytics",
      color: "text-gray-500 hover:text-purple-500 hover:bg-purple-500/10",
      onClick: () => {
        // Show analytics modal
        console.log("Show analytics for post:", postId);
      },
      count: counts.viewCount,
      showCount: true,
      countLabel: "Views",
    },
  ];

  return (
    <div className="flex items-center justify-between pt-3 px-5">
      {actionItems.map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          disabled={isLoading === item.id}
          className={`group flex items-center space-x-2 p-2 rounded-full transition-colors ${
            item.active ? item.activeColor : item.color
          } ${isLoading === item.id ? "opacity-50 cursor-not-allowed" : ""}`}
          title={item.label}
        >
          <div className="relative">
            <item.icon
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                item.active ? "fill-current" : ""
              }`}
            />
            {item.active && item.id === "like" && (
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
            )}
          </div>

          {item.showCount && item.count !== undefined && (
            <span
              className={`text-sm font-medium ${
                item.active
                  ? "opacity-100"
                  : "opacity-70 group-hover:opacity-100"
              }`}
            >
              {item.id === "analytics" && item.countLabel ? (
                <>
                  <span>{formatCount(item.count)}</span>
                  <span className="ml-1 text-xs opacity-70">
                    {item.countLabel}
                  </span>
                </>
              ) : (
                formatCount(item.count)
              )}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
