"use client";
import PostCard from "@/components/post/view-post(s)/PostCard";
import PostDetailLoader from "@/components/post/post-detail/PostDetailLoader";
import api from "@/lib/api/axios";
import { Post } from "@/types/post";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) return <PostDetailLoader />;
  if (!post)
    return (
      <div className="flex flex-col w-full items-center">
        <p className="text-center pt-30 w-full text-gray-300">
          Post not found.
        </p>
        <p
          className="text-center p-1 mt-2 bg-sky-500 cursor-pointer border rounded-sm"
          onClick={() => window.location.reload()}
        >
          Reload
        </p>
      </div>
    );
  return (
    <div className="pt-10">
      <PostCard post={post} />
    </div>
  );
};

export default PostDetails;
