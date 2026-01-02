"use client";
import PostCard from "@/components/post/feed/PostCard";
import BackBar from "@/components/post/post-detail/Back-Bar";
import PostDetailLoader from "@/components/post/post-detail/PostDetailLoader";
import InfiniteScrollTrigger from "@/components/shared/infiniteScrollTrigger";
import { useUniversalInfiniteQuery } from "@/lib/hooks/useUniversalInfiniteQuery";
import { useUniversalStore } from "@/stores/universalStore";
import { Post } from "@/types/post";
import { toast } from "sonner";

const BookMarks = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUniversalInfiniteQuery<Post>(
    ["bookmarks"],
    "engagement/me/bookmarks",
    15
  );
  const { mutedUsers } = useUniversalStore();
  //* 2. Flatten the nested pages into a single array
  const rawBookmarks = data?.pages.flatMap((page) => page.items) ?? [];

  //* 3. Deduplicate by bookmark ID
  const allBookmarks = Array.from(
    new Map(rawBookmarks.map((bookmark) => [bookmark.id, bookmark])).values()
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
    toast.error(`${error}`);
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-2">Failed to load bookmarks</p>
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
  if (!allBookmarks.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No bookmarks yet</p>
      </div>
    );
  }
  const bookmarks = allBookmarks.map((bookmark) => ({
    ...bookmark,
    isMuted: mutedUsers.includes(bookmark.author!.id),
  }));

  return (
    <>
      <BackBar type="Bookmarks" />
      <div className="pt-18">
        {bookmarks.map((bookmark) => (
          <PostCard key={bookmark.id} post={bookmark} />
        ))}
      </div>
      <InfiniteScrollTrigger
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
};

export default BookMarks;
