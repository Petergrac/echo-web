"use client";

import { SetStateAction, useState } from "react";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Bookmark,
  Share,
  BarChart3,
  PenIcon,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import AutoResizeTextarea from "../create-post/AutoResizeTextArea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { useRouter } from "next/navigation";

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
  quote: string | null;
  setQuote: React.Dispatch<SetStateAction<string | null>>;
}

export default function PostActions({
  postId,
  stats,
  quote,
  setQuote,
  initialStatus = {
    hasLiked: true,
    hasReposted: false,
    hasBookmarked: false,
    hasReplied: false,
  },
}: PostActionsProps) {
  const [status, setStatus] = useState(initialStatus);
  const [counts, setCounts] = useState(stats);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const router = useRouter();
  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleAction = async (
    action: keyof typeof status,
    quote?: string | null,
    active: boolean = false
  ) => {
    if (isLoading) return;
    setIsLoading(action);
    const newValue = !status[action];
    setStatus((prev) => ({ ...prev, [action]: newValue }));
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
      if (action === "hasReposted" && active) setQuote("");
      await api.post(
        `/engagement/posts/${postId}/${
          action === "hasBookmarked"
            ? "bookmark"
            : action === "hasLiked"
            ? "like"
            : "repost"
        }`,
        {
          content: quote,
        }
      );
    } catch (error) {
      // Revert on error
      setQuote("");
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
      count: counts.replyCount,
      showCount: true,
      onClick: () => router.push(`/posts/${postId}`),
      active: status.hasReplied,
    },
    {
      id: "repost",
      icon: Repeat2,
      label: "Repost",
      color: "text-gray-500 hover:text-green-500 hover:bg-green-500/10",
      activeColor: "text-green-500 bg-green-500/10",
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
            {item.id !== "repost" && (
              <item.icon
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  item.active ? "fill-current" : ""
                }`}
              />
            )}
            {item.id === "repost" && (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none" asChild>
                  <item.icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      item.active ? "fill-current" : ""
                    }`}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() =>
                      handleAction("hasReposted", null, item.active)
                    }
                  >
                    <div className="flex gap-2">
                      <Repeat2 />
                      <p className="">Repost</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (!item.active) setQuoteOpen(true);
                    }}
                    className="flex gap-2 items-center"
                    disabled={item.active}
                  >
                    <PenIcon />
                    <p>Quote</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
      <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Quote Post</DialogTitle>
          </DialogHeader>

          <AutoResizeTextarea
            value={quote ?? ""}
            onChange={setQuote}
            placeholder="Add your thoughts"
            rows={3}
            className="text-base"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setQuoteOpen(false)}
              className="text-sm text-gray-500"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                handleAction("hasReposted", quote);
                setQuoteOpen(false);
              }}
              disabled={quote !== null && !quote.trim()}
              className="px-4 py-1 rounded-full bg-green-500 text-white disabled:opacity-50"
            >
              Quote
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
