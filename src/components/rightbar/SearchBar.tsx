"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchSuggestions } from "@/lib/hooks/useSearch";
import Image from "next/image";
import Link from "next/link";

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: suggestions, isLoading } = useSearchSuggestions(debouncedQuery);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSelectSuggestion = (
    type: "user" | "hashtag" | "query",
    value: string
  ) => {
    setIsFocused(false);
    setQuery(value);

    switch (type) {
      case "user":
        router.push(`/@${value.replace("@", "")}`);
        break;
      case "hashtag":
        router.push(`/hashtag/${value.replace("#", "")}`);
        break;
      default:
        router.push(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setIsFocused(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-10 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-full 
                     border border-transparent focus:border-sky-500 focus:outline-none 
                     text-sm placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>{" "}
        <Link href={`/search`} className="text-xs hover:underline text-sky-500">
          Advance Search
        </Link>
      </form>

      {/* Search Suggestions Dropdown */}
      {isFocused && query.length >= 2 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 
                      rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 
                      max-h-96 overflow-y-auto z-50"
        >
          {isLoading ? (
            <div className="p-4 text-center text-zinc-500 text-sm">
              Loading suggestions...
            </div>
          ) : suggestions ? (
            <div className="p-2">
              {/* Users */}
              {suggestions.users && suggestions.users.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 px-2 py-1">
                    People
                  </h3>
                  {suggestions.users.map((user) => (
                    <button
                      key={user.id}
                      className="w-full flex items-center gap-3 p-2 hover:bg-zinc-100 
                               dark:hover:bg-zinc-800 rounded-lg transition-colors"
                      onClick={() =>
                        handleSelectSuggestion("user", `@${user.username}`)
                      }
                    >
                      <div className="h-8 w-8 rounded-full bg-sky-500 overflow-hidden">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.username}
                            className="h-full w-full object-cover"
                            height={32}
                            width={32}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-white text-xs">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-zinc-500">
                          @{user.username}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Hashtags */}
              {suggestions.hashtags && suggestions.hashtags.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 px-2 py-1">
                    Hashtags
                  </h3>
                  {suggestions.hashtags.map((hashtag) => (
                    <button
                      key={hashtag.id}
                      className="w-full flex items-center gap-3 p-2 hover:bg-zinc-100 
                               dark:hover:bg-zinc-800 rounded-lg transition-colors"
                      onClick={() =>
                        handleSelectSuggestion("hashtag", `#${hashtag.tag}`)
                      }
                    >
                      <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                        <span className="text-white text-xs">#</span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">
                          #{hashtag.tag}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {hashtag.postCount} posts
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Queries */}
              {suggestions.popularQueries &&
                suggestions.popularQueries.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 px-2 py-1">
                      Popular
                    </h3>
                    {suggestions.popularQueries.map(
                      (query: string, index: number) => (
                        <button
                          key={index}
                          className="w-full text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 
                               rounded-lg transition-colors text-sm"
                          onClick={() => handleSelectSuggestion("query", query)}
                        >
                          {query}
                        </button>
                      )
                    )}
                  </div>
                )}

              {/* Search for "query" */}
              <button
                className="w-full text-left p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 
                         rounded-lg transition-colors border-t border-zinc-200 dark:border-zinc-800 
                         text-sm text-sky-500 font-medium mt-2"
                onClick={() => handleSelectSuggestion("query", query)}
              >
                Search for &quot;{query}&quot;
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-zinc-500 text-sm">
              No suggestions found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
