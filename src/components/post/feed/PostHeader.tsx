"use client";

import { Post } from "@/types/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, Users, Lock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import PostActions from "./PostAction";

interface PostHeaderProps {
  post: Post;
}

const visibilityIcons = {
  public: Globe,
  followers: Users,
  private: Lock,
};

export default function PostHeader({ post }: PostHeaderProps) {
  const VisibilityIcon =
    visibilityIcons[post.visibility as keyof typeof visibilityIcons];

  const getVisibilityText = () => {
    switch (post.visibility) {
      case "public":
        return "Everyone";
      case "followers":
        return "Followers";
      case "private":
        return "Only you";
    }
  };
  if (!post.author) return;
  return (
    <div className="flex items-start justify-between z-0">
      <Link
        href={`/${post.author.username}`}
        className="flex items-start space-x-3 flex-1"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.avatar} alt={post.author.firstName} />
          <AvatarFallback>{post.author.firstName.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <div className="flex flex-col ">
              <h4 className="font-bold truncate hover:underline">
                {post.author.firstName + " "}
              </h4>
              <h4 className="font-bold truncate hover:underline">
                {post.author.lastName}
              </h4>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-gray-500 truncate  hover:underline">
                @{post.author.username}
              </span>
              <span className="text-gray-500 text-sm  hover:underline">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center mt-1 text-sky-500 text-sm hover:underline">
            <VisibilityIcon className="w-3 h-3 mr-1" />
            <span>{getVisibilityText()}</span>
          </div>
        </div>
      </Link>
      <PostActions post={post} />
    </div>
  );
}
