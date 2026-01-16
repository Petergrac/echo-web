"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Info,
  ShieldAlert,
  FileText,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Post {
  id: string;
  content: string;
  author: {
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  likeCount: number;
  replyCount: number;
}

interface DeletePostDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (reason?: string) => void;
}

export default function DeletePostDialog({
  post,
  open,
  onOpenChange,
  onSuccess,
}: DeletePostDialogProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for deletion");
      return;
    }

    setLoading(true);
    try {
      await onSuccess(reason);
      setReason("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-6 w-6 text-red-600" />
            <DialogTitle>Delete Post</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Alert */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2 shrink mt-0.5" />
              <div>
                <p className="font-medium text-red-800">This action cannot be undone</p>
                <p className="text-sm text-red-700 mt-1">
                  The post will be permanently deleted and removed from the system.
                </p>
              </div>
            </div>
          </div>

          {/* Post Preview */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar || ""} />
                <AvatarFallback>
                  {post.author.firstName[0]}{post.author.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">
                  {post.author.firstName} {post.author.lastName}
                </p>
                <p className="text-xs text-gray-500">@{post.author.username}</p>
              </div>
            </div>
            <div className="text-sm line-clamp-3">{post.content}</div>
            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-3">
              <div className="flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                {post.content.length} chars
              </div>
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {post.likeCount} likes • {post.replyCount} replies
              </div>
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Reason for deletion (required)
            </Label>
            <Textarea
              id="reason"
              placeholder="Explain why this post is being deleted (e.g., violates community guidelines, spam, etc.)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              required
            />
            <p className="text-xs text-gray-500">
              This reason will be recorded in the audit logs and may be reviewed.
            </p>
          </div>

          {/* Common Reasons */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Common Reasons:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Spam or commercial content",
                "Harassment or hate speech",
                "Inappropriate content",
                "Copyright violation",
                "False information",
                "Impersonation",
              ].map((commonReason) => (
                <Button
                  key={commonReason}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReason(commonReason)}
                  className="text-xs"
                >
                  {commonReason}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!reason.trim() || loading}
          >
            {loading ? "Deleting..." : "Delete Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}