"use client";

import { SetStateAction, useOptimistic, useTransition } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
  feedType: "forYou" | "following";
}

type ActionType = "hasLiked" | "hasReposted" | "hasBookmarked" | "hasReplied";

interface StatusState {
  hasLiked: boolean;
  hasReposted: boolean;
  hasBookmarked: boolean;
  hasReplied: boolean;
}

export default function PostActions({
  postId,
  stats,
  quote,
  feedType,
  setQuote,
  initialStatus = {
    hasLiked: false,
    hasReposted: false,
    hasBookmarked: false,
    hasReplied: false,
  },
}: PostActionsProps) {
  const [counts, setCounts] = useState(stats);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const queryClient = useQueryClient();

  //* Optimistic state for immediate UI updates
  const [optimisticStatus, addOptimisticStatus] = useOptimistic(
    initialStatus,
    (state: StatusState, action: { type: ActionType; value: boolean }) => ({
      ...state,
      [action.type]: action.value,
    })
  );

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  //* Generic mutation for all post actions
  const actionMutation = useMutation({
    mutationFn: ({
      action,
      content,
    }: {
      action: "like" | "bookmark" | "repost";
      content?: string | null;
    }) => {
      return api.post(`/engagement/posts/${postId}/${action}`, {
        ...(content && { content }),
      });
    },
    onSuccess: (_, variables) => {
      //* Invalidate posts cache to refresh counts
      queryClient.invalidateQueries({ queryKey: ["posts", feedType] });
      const actionLabels = {
        like: "Post liked",
        bookmark: "Post bookmarked",
        repost: "Post reposted",
      };
      toast.success(actionLabels[variables.action]);
    },
    onError: (error, variables) => {
      const actionLabels = {
        like: "like",
        bookmark: "bookmark",
        repost: "repost",
      };
      toast.error(`Failed to ${actionLabels[variables.action]} post`);
    },
  });

  const handleAction = (action: ActionType, content?: string | null) => {
    if (action === "hasReplied") {
      router.push(`/posts/${postId}`);
      return;
    }

    const newValue = !optimisticStatus[action];

    startTransition(() => {
      addOptimisticStatus({ type: action, value: newValue });

      //* Update counts optimistically
      const countKeyMap = {
        hasLiked: "likeCount",
        hasReposted: "repostCount",
        hasBookmarked: "bookmarkCount",
      } as const;
      const countKey = countKeyMap[action as keyof typeof countKeyMap];
      if (countKey) {
        setCounts((prev) => ({
          ...prev,
          [countKey]: newValue
            ? (prev[countKey] ?? 0) + 1
            : (prev[countKey] ?? 0) - 1,
        }));
      }
    });

    //* Call mutation
    const actionMap = {
      hasLiked: "like",
      hasReposted: "repost",
      hasBookmarked: "bookmark",
    } as const;
    const apiAction = actionMap[action as keyof typeof actionMap];

    actionMutation.mutate({
      action: apiAction,
      content,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this post",
        url: `${window.location.origin}/post/${postId}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
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
      active: optimisticStatus.hasReplied,
    },
    {
      id: "repost",
      icon: Repeat2,
      label: "Repost",
      color: "text-gray-500 hover:text-green-500 hover:bg-green-500/10",
      activeColor: "text-green-500 bg-green-500/10",
      count: counts.repostCount,
      showCount: true,
      active: optimisticStatus.hasReposted,
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
      active: optimisticStatus.hasLiked,
    },
    {
      id: "bookmark",
      icon: Bookmark,
      label: "Bookmark",
      color: "text-gray-500 hover:text-yellow-500 hover:bg-yellow-500/10",
      activeColor: "text-yellow-500 bg-yellow-500/10",
      onClick: () => handleAction("hasBookmarked"),
      showCount: false,
      active: optimisticStatus.hasBookmarked,
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
      {actionItems.map((item) => {
        if (item.id === "repost") {
          return (
            <DropdownMenu key={item.id}>
              <DropdownMenuTrigger asChild>
                <button
                  disabled={isPending}
                  className={`group flex items-center space-x-2 p-2 rounded-full transition-colors ${
                    item.activeColor && item.active
                      ? item.activeColor
                      : item.color
                  } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={item.label}
                >
                  <item.icon
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      item.active ? "fill-current" : ""
                    }`}
                  />
                  {item.showCount && item.count !== undefined && (
                    <span
                      className={`text-sm font-medium ${
                        item.active
                          ? "opacity-100"
                          : "opacity-70 group-hover:opacity-100"
                      }`}
                    >
                      {formatCount(item.count)}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleAction("hasReposted")}
                  disabled={isPending}
                >
                  <div className="flex gap-2">
                    <Repeat2 />
                    <p>Repost</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (!item.active) setQuoteOpen(true);
                  }}
                  className="flex gap-2 items-center"
                  disabled={item.active || isPending}
                >
                  <PenIcon />
                  <p>Quote</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <button
            key={item.id}
            onClick={item.onClick}
            disabled={isPending}
            className={`group flex items-center space-x-2 p-2 rounded-full transition-colors ${
              item.active ? item.activeColor : item.color
            } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
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
        );
      })}

      {/* Quote Dialog */}
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
              disabled={isPending}
              className="text-sm text-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                if (quote?.trim()) {
                  handleAction("hasReposted", quote);
                  setQuoteOpen(false);
                } else {
                  toast.warning("Quote cannot be empty");
                }
              }}
              disabled={!quote?.trim() || isPending}
              className="px-4 py-1 rounded-full bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isPending ? "Posting..." : "Quote"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
