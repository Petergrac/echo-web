"use client";
import PostCard from "@/components/post/view-post(s)/PostCard";
import PostDetailLoader from "@/components/post/post-detail/PostDetailLoader";
import { Post } from "@/types/post";
export interface PostDetailProps {
  loading: boolean;
  post: Post;
}

const PostDetails = ({ loading, post }: PostDetailProps) => {
  if (loading) return <PostDetailLoader />;
  return (
    <div className="pt-10">
      <PostCard post={post} />
    </div>
  );
};

export default PostDetails;
