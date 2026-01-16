"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  User,
  Eye,
  Heart,
  MessageSquare,
  Repeat2,
  Globe,
  Users,
  Lock,
  Calendar,
  Link,
} from "lucide-react";
import Image from "next/image";
import { Post } from "@/types/admin";

interface PostDetailsDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PostDetailsDialog({
  post,
  open,
  onOpenChange,
}: PostDetailsDialogProps) {
  const stats = [
    { icon: Heart, label: "Likes", value: post.likeCount, color: "text-red-500" },
    { icon: MessageSquare, label: "Replies", value: post.replyCount, color: "text-blue-500" },
    { icon: Repeat2, label: "Reposts", value: post.repostCount, color: "text-green-500" },
    { icon: Eye, label: "Views", value: post.viewCount, color: "text-purple-500" },
  ];

  const getVisibilityIcon = () => {
    switch (post.visibility) {
      case 'public':
        return <Globe className="h-4 w-4 text-green-600" />;
      case 'followers':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'private':
        return <Lock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Post Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="pr-4">
          <div className="space-y-6">
            {/* Post Header */}
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.avatar || ""} />
                <AvatarFallback>
                  {post.author.firstName[0]}{post.author.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">
                        {post.author.firstName} {post.author.lastName}
                      </h4>
                      {post.author.isBanned && (
                        <Badge variant="destructive">Banned</Badge>
                      )}
                      <Badge variant="outline">{post.author.role}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      @{post.author.username} • {post.author.email}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/profile/${post.author.username}`, '_blank')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="rounded-lg border p-4 bg-gray-50">
              <div className="whitespace-pre-wrap mb-4">{post.content}</div>
              
              {/* Media Preview */}
              {post.media && post.media.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Media ({post.media.length})
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {post.media.slice(0, 4).map((media) => (
                      <div
                        key={media.id}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-200"
                      >
                        {media.type === 'image' ? (
                          <Image
                            src={media.url}
                            alt="Post media"
                            className="w-full h-full object-cover"
                            height={400}
                            width={400}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-lg">🎬</div>
                              <div className="text-xs mt-1">Video</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hashtags */}
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Hashtags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.hashtags.map((hashtag) => (
                      <Badge key={hashtag} variant="secondary">
                        #{hashtag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 py-4 border-t">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <div className="flex items-center justify-center">
                        <Icon className={`h-4 w-4 mr-2 ${stat.color}`} />
                        <div className="text-lg font-bold">{stat.value}</div>
                      </div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Post Metadata */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-semibold">Post Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Visibility:</span>
                      <div className="flex items-center">
                        {getVisibilityIcon()}
                        <span className="ml-2 capitalize">{post.visibility}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Status:</span>
                      {post.deletedAt ? (
                        <Badge variant="destructive">Deleted</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Created:</span>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(post.createdAt), "PPpp")}
                      </div>
                    </div>
                    {post.updatedAt !== post.createdAt && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Last Updated:</span>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(post.updatedAt), "PPpp")}
                        </div>
                      </div>
                    )}
                    {post.deletedAt && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Deleted At:</span>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(post.deletedAt), "PPpp")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-semibold">Technical Details</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Post ID:</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {post.id.slice(0, 8)}...
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Author ID:</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {post.authorId.slice(0, 8)}...
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Character Count:</span>
                      <span>{post.content.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mentions */}
              {post.mentions && post.mentions.length > 0 && (
                <div className="rounded-lg border p-4">
                  <h5 className="font-semibold mb-3">Mentions</h5>
                  <div className="space-y-2">
                    {post.mentions.map((mention) => (
                      <div key={mention.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            {mention.firstName[0]}{mention.lastName[0]}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {mention.firstName} {mention.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              @{mention.username}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/profile/${mention.username}`, '_blank')}
                        >
                          <Link className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(post.id);
                    // You could add a toast notification here
                  }}
                >
                  Copy ID
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const url = `${window.location.origin}/posts/${post.id}`;
                    window.open(url, '_blank');
                  }}
                >
                  View Post
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}