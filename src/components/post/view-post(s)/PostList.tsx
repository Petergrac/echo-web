"use client";
import PostCard from "./PostCard";
import { Post } from "@/types/post";
import PostDetailLoader from "../post-detail/PostDetailLoader";
import { useUniversalInfiniteQuery } from "@/lib/hooks/useUniversalInfiniteQuery";
import InfiniteScrollTrigger from "@/components/shared/infiniteScrollTrigger";

type FeedType = "forYou" | "following";

interface PostsListProps {
  feedType: FeedType;
}

export default function PostsList({ feedType }: PostsListProps) {
  const endpoint =
    feedType === "forYou" ? "/posts/feed/for-you" : "/posts/feed/following";

  //* 1. Use the Universal Hook
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUniversalInfiniteQuery<Post>(
    ["posts", feedType], //* Unique key per feed type
    endpoint,
    20
  );

  //* 2. Flatten the nested pages into a single array
  const rawPosts = data?.pages.flatMap((page) => page.items) ?? [];

  //* 3. Deduplicate by post ID
  const allPosts = Array.from(
    new Map(rawPosts.map((post) => [post.id, post])).values()
  );
  //* Handle Initial Loading State
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <PostDetailLoader key={i} />
        ))}
      </div>
    );
  }

  //* Handle Error State
  if (error) {
    console.log(error);
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-2">Failed to load posts</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sky-500 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  //* Handle Empty State
  if (!allPosts.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        {feedType === "forYou"
          ? "No posts to display. Follow some users!"
          : "No posts from people you follow. Try following more users!"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/*//* 3. Render the flattened list */}
      {allPosts.map((post) => (
        <div
          key={post.id}
          className="cursor-pointer hover:opacity-95 transition-opacity"
        >
          <PostCard post={post} />
        </div>
      ))}

      {/*//*  4. The Observable Trigger for Infinite Scroll */}
      <InfiniteScrollTrigger
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
