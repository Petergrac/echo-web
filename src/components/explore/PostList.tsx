"use client";
import { Post } from "@/types/post";
import { useUniversalInfiniteQuery } from "@/lib/hooks/useUniversalInfiniteQuery";
import InfiniteScrollTrigger from "@/components/shared/infiniteScrollTrigger";
import { toast } from "sonner";
import { useUniversalStore } from "@/stores/universalStore";
import PostDetailLoader from "../post/post-detail/PostDetailLoader";
import PostCard from "../post/feed/PostCard";

export type AxiosError = {
  response: { data: { message: string[] | "string" } };
};
export default function PostsList({ feedType }: { feedType: string }) {
  const { mutedUsers } = useUniversalStore();
  const endpoint =
    feedType === "for-you"
      ? "/posts/feed/for-you"
      : feedType === "following"
        ? "/posts/feed/following"
        : feedType === "trending"
          ? "/posts/feed/trending"
          : "/posts/feed/discover";

  //* 1. Use the Universal Hook
  const {
    data,
    isLoading,
    error,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUniversalInfiniteQuery<Post>(
    ["posts", feedType], //* Unique key per feed type
    endpoint,
    20,
  );

  //* 2. Flatten the nested pages into a single array
  const rawPosts = data?.pages.flatMap((page) => page.items) ?? [];

  //* 3. Deduplicate by post ID
  const allPosts = Array.from(
    new Map(rawPosts.map((post) => [post.id, post])).values(),
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
  if (isError) {
    toast.error(
      `${(error as unknown as { response: { data: { message: string } } }).response.data.message[0]}`,
    );
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-2">Failed to load posts</p>
        <button
          onClick={() => refetch()}
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
        {feedType === "for-you"
          ? "No posts to display. Follow some users!"
          : "No posts from people you follow. Try following more users!"}
      </div>
    );
  }
  const postWithStatus = allPosts.map((post) => ({
    ...post,
    isMuted: mutedUsers.includes(post.author!.id),
  }));

  return (
    <div className="space-y-4">
      {/*//* 3. Render the flattened list */}
      {postWithStatus.map((post) => (
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
