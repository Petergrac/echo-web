"use client";
import BackBar from "@/components/post/post-detail/Back-Bar";
import CommentSection from "@/components/post/post-detail/CommentSection";
import PostDetails from "@/components/post/post-detail/PostDetailCard";
import ReplyCompose from "@/components/post/post-detail/ReplyCompose";
import api from "@/lib/api/axios";
import { PostReply } from "@/types/reply";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const SelectedPost = () => {
  const [replies, setReplies] = useState<PostReply[]>([]);
  const { postId } = useParams();
  useEffect(() => {
    (async () => {
      try {
        const response = await api.get(`engagement/posts/${postId}/replies`);
        const data = response.data as { replies: PostReply[] };
        setReplies(data.replies);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [postId]);
  console.log(replies);
  return (
    <>
      <BackBar />
      <PostDetails />
      <ReplyCompose />
      <CommentSection topLevelReplies={replies} />
    </>
  );
};

export default SelectedPost;
