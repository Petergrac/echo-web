"use client";

import { UserPlus, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useWhoToFollow } from "@/lib/hooks/useSearch";
import api from "@/lib/api/axios";

export const WhoToFollow = () => {
  const { data: suggestions, isLoading, refetch } = useWhoToFollow(5);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const router = useRouter();

  const handleFollow = async (username: string) => {
    try {
      // Optimistically update UI
      const newFollowing = new Set(following);
      if (newFollowing.has(username)) {
        newFollowing.delete(username);
      } else {
        newFollowing.add(username);
      }
      setFollowing(newFollowing);

      // Call follow API
      await api.post(`/users/${username}/follow`);

      // Refetch to update follow status
      refetch();
    } catch (error) {
      console.error("Error following user:", error);
      // Revert on error
      const revertedFollowing = new Set(following);
      if (following.has(username)) {
        revertedFollowing.delete(username);
      } else {
        revertedFollowing.add(username);
      }
      setFollowing(revertedFollowing);
    }
  };

  const handleUserClick = (username: string) => {
    router.push(`/@${username}`);
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4">
      <h2 className="text-xl font-bold mb-4">Who to follow</h2>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
              <div className="flex-1">
                <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-24 mb-2"></div>
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-32"></div>
              </div>
              <div className="h-8 w-20 bg-zinc-300 dark:bg-zinc-700 rounded-full"></div>
            </div>
          ))}
        </div>
      ) : suggestions && suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between group"
            >
              <button
                className="flex items-center gap-3 flex-1 group-hover:bg-zinc-100 
                         dark:group-hover:bg-zinc-800/50 p-2 rounded-lg transition-colors"
                onClick={() => handleUserClick(user.username)}
              >
                <div className="relative">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-sky-500">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.username}
                        className="h-full w-full object-cover"
                        height={40}
                        width={40}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    @{user.username}
                  </div>
                  {user.bio && (
                    <div className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 line-clamp-2">
                      {user.bio}
                    </div>
                  )}
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollow(user.username);
                }}
                className={`ml-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  following.has(user.id) || user.isFollowing
                    ? "bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                    : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
                }`}
              >
                {following.has(user.id) || user.isFollowing ? (
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Following</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <UserPlus className="h-3 w-3" />
                    <span>Follow</span>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-zinc-500 dark:text-zinc-400 text-sm">
          No suggestions available
        </div>
      )}
    </div>
  );
};
