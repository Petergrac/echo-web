"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, VolumeX, UserMinus, Flag } from "lucide-react";
import { Post } from "@/types/post";
import { useCurrentUser } from "@/lib/stores/useStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import { toast } from "sonner";

interface PostActionsProps {
  post: Post;
}

export default function PostActions({ post }: PostActionsProps) {
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await api.delete(`posts/${post.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", currentUser?.username],
      });
      toast.success("Post deleted successfully");
    },
    onError: () => {
      toast.error("Post could not be deleted");
    },
  });
  if (!post.author) return null;
  const isOwner = currentUser?.id === post.author.id;
  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 text-gray-500 hover:text-sky-500 hover:bg-sky-500/10 rounded-full transition-colors outline-none">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 font-semibold">
        {isOwner ? (
          <>
            {/* OWNER ACTIONS */}
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive gap-3 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {/* VISITOR ACTIONS */}
            <DropdownMenuItem className="gap-3 cursor-pointer">
              <UserMinus className="w-4 h-4" />
              Unfollow @{post.author.username}
            </DropdownMenuItem>

            <DropdownMenuItem className="gap-3 cursor-pointer">
              <VolumeX className="w-4 h-4" />
              Mute @{post.author.username}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-3 cursor-pointer">
              <Flag className="w-4 h-4" />
              Report Post
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
