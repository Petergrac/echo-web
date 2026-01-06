"use client";

import * as React from "react";
import { Search, Loader2, Hash, User, TrendingUp, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useDebounce from "@/lib/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import api from "@/lib/api/axios";
import { UserType } from "@/types/user-type";
import { Post } from "@/types/post";

interface SuggestionType {
  users: UserType[];
  hashtags: {
    id: string;
    tag: string;
    postCount: number;
  }[];
  popularQueries: string[];
  posts: Post[];
}

const TwitterSearch = () => {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const debouncedQuery = useDebounce(query, 300);

  // 1. Fetch Suggestions
  const { data: suggestions, isLoading: suggestionsLoading } =
    useQuery<SuggestionType>({
      queryKey: ["search-suggestions", debouncedQuery],
      queryFn: async () => {
        if (debouncedQuery.length < 2) return null;
        const { data } = await api.get(
          `/search/suggestions?q=${debouncedQuery}`
        );
        return data;
      },
      enabled: debouncedQuery.length >= 2,
    });

  // 2. Fetch Trending (Empty state)
  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending-searches"],
    queryFn: async () => {
      const { data } = await api.get(`/search/trending?limit=5`);
      return data; // Returns { trendingSearches: string[] }
    },
    enabled: isFocused && query.length < 2,
  });

  // Navigation Handlers
  const navigate = (path: string) => {
    router.push(path);
    setIsFocused(false);
    setQuery(""); // Optional: clear search on navigation
  };

  return (
    <div className="relative w-full max-w-[600px]">
      <div className="relative flex items-center">
        <Search
          className={cn(
            "absolute left-4 size-4 transition-colors",
            isFocused ? "text-primary" : "text-muted-foreground"
          )}
        />
        <Input
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="h-11 w-full rounded-full bg-secondary/50 pl-11 pr-10 border-none focus-visible:ring-1 focus-visible:bg-background"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 p-1 bg-primary rounded-full text-white"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      {isFocused && (
        <div className="absolute top-full mt-1 w-full bg-popover border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <ScrollArea className="max-h-[80vh]">
            {/* --- CASE A: TRENDING (Empty Input) --- */}
            {!query && (
              <div className="py-2">
                <h3 className="px-4 py-2 text-lg font-bold">
                  Trending Searches
                </h3>
                {trendingLoading && (
                  <div className="p-4 flex justify-center">
                    <Loader2 className="animate-spin size-4" />
                  </div>
                )}
                {trending?.trendingSearches?.map((item: string) => (
                  <div
                    key={item}
                    onClick={() =>
                      navigate(`/hashtag/${item.replace("#", "")}`)
                    }
                  >
                    <SearchItem
                      icon={<TrendingUp className="size-4" />}
                      label={item}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* --- CASE B: LOADING SUGGESTIONS --- */}
            {suggestionsLoading && query.length >= 2 && (
              <div className="p-8 flex justify-center">
                <Loader2 className="animate-spin text-primary" />
              </div>
            )}

            {/* --- CASE C: SUGGESTION RESULTS --- */}
            {suggestions && query.length >= 2 && (
              <div className="divide-y divide-border">
                {/* Users */}
                {suggestions.users?.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => navigate(`/${user.username}`)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent cursor-pointer"
                  >
                    <Avatar className="size-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold leading-tight">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Hashtags */}
                {suggestions.hashtags?.map((tag) => (
                  <div
                    key={tag.id}
                    onClick={() => navigate(`/hashtag/${tag.tag}`)}
                  >
                    <SearchItem
                      icon={<Hash className="size-4" />}
                      label={`#${tag.tag}`}
                      subLabel={`${tag.postCount.toLocaleString()} posts`}
                    />
                  </div>
                ))}

                {/* Posts */}
                {suggestions.posts?.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => navigate(`/posts/${post.id}`)}
                  >
                    <SearchItem
                      icon={<Search className="size-4" />}
                      label={post.content.substring(0, 40) + "..."}
                      subLabel={`Post by @${post.author?.username}`}
                    />
                  </div>
                ))}

                {/* Popular Queries */}
                {suggestions.popularQueries?.map((q) => (
                  <div
                    key={q}
                    onClick={() => navigate(`/hashtag/${q.replace("#", "")}`)}
                  >
                    <SearchItem
                      icon={<Search className="size-4" />}
                      label={q}
                    />
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

const SearchItem = ({
  icon,
  label,
  subLabel,
}: {
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
}) => (
  <div className="flex items-center gap-4 px-4 py-3 hover:bg-accent cursor-pointer transition-colors">
    <div className="text-muted-foreground">{icon}</div>
    <div className="flex flex-col flex-1">
      <span className="font-semibold text-sm">{label}</span>
      {subLabel && (
        <span className="text-xs text-muted-foreground">{subLabel}</span>
      )}
    </div>
  </div>
);

export default TwitterSearch;
