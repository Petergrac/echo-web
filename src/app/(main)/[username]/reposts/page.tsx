"use client";
import { Post } from "@/types/post";
import { useUniversalInfiniteQuery } from "@/lib/hooks/useUniversalInfiniteQuery";
import InfiniteScrollTrigger from "@/components/shared/infiniteScrollTrigger";
import { toast } from "sonner";
import PostDetailLoader from "@/components/post/post-detail/PostDetailLoader";
import PostCard from "@/components/post/view-post(s)/PostCard";
import { useParams, useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/hooks/useStore";
import { useEffect } from "react";

export default function UserRePosts() {
  //* 1. Use the Universal Hook

  const { username } = useParams() as { username: string };
  const router = useRouter();
  const user = useCurrentUser();
  useEffect(() => {
    if (!user) return;
    if (user.username !== username) {
      router.replace(`/${username}`);
    }
  }, [user, username, router]);
  const {
    data,
    isLoading,
    error,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUniversalInfiniteQuery<Post>(
    ["posts", "reposts", username], //* Unique key per feed type
    `engagement/me/reposts`,
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
  if (isError) {
    if (error.message === "AxiosError: Request failed with status code 429")
      toast.error("Too many requests, Try again after one minute");
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-2">Failed to load Reposts</p>
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
        You haven&apos;t reposted any post. Try to repost
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
