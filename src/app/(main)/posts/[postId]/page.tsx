"use client";
import BackBar from "@/components/post/post-detail/Back-Bar";
import CommentSection from "@/components/post/post-detail/CommentSection";
import PostDetails from "@/components/post/post-detail/PostDetailCard";
import ReplyCompose from "@/components/post/post-detail/ReplyCompose";
import ReplyLoader from "@/components/post/post-detail/ReplyLoader";
import InfiniteScrollTrigger from "@/components/shared/infiniteScrollTrigger";
import api from "@/lib/api/axios";
import { useUniversalInfiniteQuery } from "@/lib/hooks/useUniversalInfiniteQuery";
import { PostReply } from "@/types/reply";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SelectedPost = () => {
  const [_, setReplyInput] = useState(false);
  const [value, setValue] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const { postId } = useParams();
  const queryClient = useQueryClient();

  //* 1.Fetch Single Post
  const {
    data: postDetails,
    isLoading: PostLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["postDetail"],
    queryFn: async () => {
      const response = await api.get(`posts/${postId}`);
      return response.data;
    },
  });
  //* 2.Fetch paginated replies
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUniversalInfiniteQuery<PostReply>(
      ["replies", postId as string],
      `engagement/posts/${postId}/replies`
    );
  //* Mutate main reply
  const replyMutation = useMutation({
    mutationFn: () =>
      api.post(
        `engagement/posts/${postId}/reply`,
        {
          content: value,
          media: media,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ),
    onSuccess: () => {
      setValue("");
      toast.success("Comment successful");
      queryClient.invalidateQueries({
        queryKey: ["replies", postId],
      });
    },
    onError: () => {
      toast.error("Failed to comment");
    },
  });
  if (isError) {
    toast.error(error.message);
  }
  const allReplies = data?.pages.flatMap((page) => page.items) ?? [];
  if (!postDetails && !PostLoading)
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
    <>
      <BackBar />
      <PostDetails loading={PostLoading} post={postDetails} />
      {PostLoading && [1, 2, 3, 4].map((i) => <ReplyLoader key={i} />)}
      {!PostLoading && (
        <>
          <ReplyCompose
            value={value}
            setValue={setValue}
            setMedia={setMedia}
            setReplyInput={setReplyInput}
            placeholder="Comment this reply"
            media={media}
            handleSubmit={() => replyMutation.mutate()}
          />
          <CommentSection topLevelReplies={allReplies} />
        </>
      )}
      <InfiniteScrollTrigger
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
};

export default SelectedPost;
