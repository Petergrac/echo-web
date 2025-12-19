"use client";
import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import { Post } from "@/types/post";
import api from "@/lib/api/axios";

type FeedType = "forYou" | "following";

interface PostsListProps {
  feedType: FeedType;
}

export default function PostsList({ feedType }: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const endpoint =
          feedType === "forYou" ? "/posts/feed/for-you" : "/posts/feed/following";

        const response = await api(endpoint);

        if (!response.data) {
          throw new Error(`Failed to fetch ${feedType} posts`);
        }

        const data = response.data;
        setPosts(data.posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
        console.error("Error fetching posts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [feedType]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-40 bg-gray-800 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sky-500 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!posts.length) {
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
      {posts.map((post) => (
        <div
          key={post.id}
          className="cursor-pointer hover:opacity-95 transition-opacity"
        >
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
