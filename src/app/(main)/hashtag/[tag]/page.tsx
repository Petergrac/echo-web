"use client";
import SearchHashTags from "@/components/hashtags/SearchHashTags";
import TagComponent from "@/components/hashtags/TagComponent";
import PostCard from "@/components/post/feed/PostCard";
import BackBar from "@/components/post/post-detail/Back-Bar";
import PostDetailLoader from "@/components/post/post-detail/PostDetailLoader";
import InfiniteScrollTrigger from "@/components/shared/infiniteScrollTrigger";
import { useUniversalInfiniteQuery } from "@/lib/hooks/useUniversalInfiniteQuery";
import { useUniversalStore } from "@/stores/universalStore";
import { Post } from "@/types/post";
import { SearchIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const HashTagPage = () => {
  const { tag } = useParams() as { tag: string };

  //* 1.Get posts of a given hashtag
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUniversalInfiniteQuery<Post>(
    ["hashtags", tag],
    `hashtags/${tag}/posts`,
    15
  );
  const { mutedUsers } = useUniversalStore();
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
  if (!allPosts.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>No Posts yet</p>
      </div>
    );
  }
  const posts = allPosts.map((post) => ({
    ...post,
    isMuted: mutedUsers.includes(post.author!.id),
  }));

  return (
    <>
      <BackBar type={`#${tag}`} />
      {/* SEARCH HASHTAGS */}
      <SearchHashTags />
      {/* TRENDING HASHTAGS */}
      <TagComponent />
      <div>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
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

export default HashTagPage;
