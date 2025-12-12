"use client";
import PostCard from "./PostCard";
import posts from "../../../mock-post.json";

export default function PostsList() {
  if (!posts.length) {
    return (
      <div className="text-center py-10 text-gray-500">No posts to display</div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="cursor-pointer hover:opacity-95 transition-opacity"
        >
          <PostCard
            post={post}
          />
        </div>
      ))}
    </div>
  );
}
