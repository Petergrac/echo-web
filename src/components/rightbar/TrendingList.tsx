"use client";
import { TrendingUp, MoreHorizontal} from "lucide-react"
import { useRouter } from "next/navigation";
import { useTrendingSearches } from "@/lib/hooks/useSearch";

export const TrendingList = () => {
  const { data: trendingSearches, isLoading } = useTrendingSearches(3);

  const router = useRouter();

  const handleTrendingClick = (query: string) => {
    if (query.startsWith("#")) {
      router.push(`/hashtag/${query.replace("#", "")}`);
    } else if (query.startsWith("@")) {
      router.push(`/@${query.replace("@", "")}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4">
      <div className="flex flex-col  items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Now
        </h2>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : trendingSearches && trendingSearches.length > 0 ? (
        <div className="space-y-4">
          {trendingSearches.map((trend: string, index: number) => (
            <button
              key={index}
              className="w-full text-left group hover:bg-zinc-100 dark:hover:bg-zinc-800/50 p-2 rounded-lg transition-colors"
              onClick={() => handleTrendingClick(trend)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {index + 1} · Trending
                    </span>
                  </div>
                  <div className="font-semibold text-sm mb-1 group-hover:text-sky-500 transition-colors">
                    {trend}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {trend.startsWith("#")
                      ? "Trending hashtag"
                      : trend.startsWith("@")
                      ? "Trending profile"
                      : "Trending topic"}
                  </div>
                </div>
                <p className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors">
                  <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-zinc-500 dark:text-zinc-400 text-sm">
          No trending searches at the moment
        </div>
      )}

      <button
        className="w-full text-sky-500 hover:text-sky-600 dark:text-sky-400 
                        dark:hover:text-sky-300 text-sm font-medium mt-4 pt-3 
                        border-t border-zinc-200 dark:border-zinc-800 text-left"
      >
        Show more
      </button>
    </div>
  );
};
