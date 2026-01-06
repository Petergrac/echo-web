"use client";

import { useState } from "react";
import { SearchIcon, Loader2, Hash, TrendingUp, Users } from "lucide-react";
import useDebounce from "@/lib/hooks/useDebounce";
import { useSearchQuery } from "@/lib/hooks/useGeneralHook";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface TagResponseDto {
  id: string;
  tag: string;
  usageCount: number;
  postCount: number;
  trendScore: number;
}

const SearchHashTags = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: tags, isLoading, isError } = useSearchQuery(debouncedSearch);

  const formatCount = (num: number) => {
    return Intl.NumberFormat("en-US", { notation: "compact" }).format(num);
  };

  return (
    <div className="sticky w-full backdrop-blur-lg z-60 top-18">
      {/* Search Bar */}
      <div className="relative gap-1 justify-between flex items-center">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search hashtags..."
          className="pl-10 h-12 bg-secondary/50 border-border focus-visible:ring-1"
          value={searchTerm}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin size-4 text-primary" />
        )}
        <Link href={`/search`} className="text-xs hover:underline text-sky-500">
          Advance Search
        </Link>
      </div>

      {/* Results Dropdown */}
      {isOpen && (searchTerm || tags) && (
        <div className="absolute top-full left-0 mt-2 w-full z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          <ScrollArea
            className={cn(
              "flex flex-col",
              tags && tags.length > 0 ? "h-32" : "h-auto"
            )}
          >
            <div className="p-1">
              {/* Status & Error Handling */}
              {isError && (
                <div className="p-4 text-sm text-destructive text-center">
                  Failed to fetch results.
                </div>
              )}

              {!isLoading && tags?.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No hashtags found for `&quot;{searchTerm}&quot;`
                </div>
              )}

              {/* Tag Items */}
              {tags?.map((item: TagResponseDto) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsOpen(false);
                    setSearchTerm("");
                    router.push(`/hashtag/${item.tag}/`);
                  }}
                  className="w-full relative flex cursor-default select-none items-center rounded-sm px-3 py-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex size-8 items-center justify-center rounded border bg-muted">
                      <Hash className="size-4 text-primary" />
                    </div>

                    <div className="flex flex-col items-start flex-1 overflow-hidden">
                      <span className="font-semibold truncate">
                        #{item.tag}
                      </span>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />{" "}
                          {formatCount(item.usageCount)}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="size-3" /> {item.trendScore}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant="secondary"
                      className="text-[10px] font-normal"
                    >
                      {formatCount(item.postCount)} posts
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default SearchHashTags;
