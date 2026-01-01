"use client";

import {
  Heart,
  MessageSquare,
  Repeat2,
  UserPlus,
  AtSign,
  AlertCircle,
  TrashIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import {
  useDeleteNotification,
  useMarkAsRead,
} from "@/lib/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const notificationIcons: Record<string, React.ReactNode> = {
  LIKE: <Heart className="h-4 w-4 text-pink-500" />,
  REPLY: <MessageSquare className="h-4 w-4 text-blue-500" />,
  REPOST: <Repeat2 className="h-4 w-4 text-green-500" />,
  FOLLOW: <UserPlus className="h-4 w-4 text-purple-500" />,
  MENTION: <AtSign className="h-4 w-4 text-orange-500" />,
  SYSTEM: <AlertCircle className="h-4 w-4 text-yellow-500" />,
};

const notificationMessages: Record<string, (actorName: string) => string> = {
  LIKE: (actorName) => `${actorName} liked your post`,
  REPLY: (actorName) => `${actorName} replied to your post`,
  REPOST: (actorName) => `${actorName} reposted your post`,
  FOLLOW: (actorName) => `${actorName} followed you`,
  MENTION: (actorName) => `${actorName} mentioned you`,
  SYSTEM: () => "System notification",
};

interface NotificationItemProps {
  notification: Notification;
  showActions?: boolean;
}

export function NotificationItem({
  notification,
  showActions = false,
}: NotificationItemProps) {
  const { mutate: markAsRead, isPending } = useMarkAsRead();
  const deleteMutation = useDeleteNotification();
  const icon = notificationIcons[notification.type] || (
    <AlertCircle className="h-4 w-4" />
  );
  const actorName = notification.actor.firstName || notification.actor.username;
  const message =
    notificationMessages[notification.type]?.(actorName) || "New notification";

  const handleClick = () => {
    if (!notification.read && !isPending) {
      markAsRead(notification.id);
    }
    if (notification.postId) {
      window.location.href = `/posts/${notification.postId}`;
    } else if (notification.type === "FOLLOW") {
      window.location.href = `/profile/${notification.actor.id}`;
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPending) {
      markAsRead(notification.id);
    }
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(notification.id);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 cursor-pointer hover:bg-accent transition-colors rounded-lg border",
        !notification.read &&
          "bg-blue-50 hover:bg-blue-100 text-black border-blue-200"
      )}
    >
      {/* Actor Avatar */}
      <Link href={`/${notification.actor.username}`}>
        <Avatar className="h-10 w-10 shrink">
          <AvatarImage src={notification.actor.avatar} alt={actorName} />
          <AvatarFallback>{actorName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>

      {/* Notification Content */}
      <div className="flex-1 min-w-0 " onClick={handleClick}>
        <div className="flex items-start gap-2">
          <div className="mt-0.5 shrink">{icon}</div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{actorName}</p>
            <p className="text-sm text-muted-foreground">{message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="items-center gap-2 flex shrink">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAsRead}
              disabled={isPending}
              className="h-6 px-2 border  text-xs"
            >
              {isPending ? "..." : "Mark read"}
            </Button>
          )}{" "}
          {!notification.read && (
            <div className="h-2 w-2 rounded-full bg-blue-500 shrink" />
          )}
          {notification.read && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isPending}
              className="h-6 px-2 text-red font-bold   text-xs"
            >
              <TrashIcon />
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
