"use client";

import {
  Bell,
  Heart,
  MessageSquare,
  Repeat2,
  UserPlus,
  AtSign,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification } from "@/lib/stores/websocket-store";

const notificationIcons: Record<string, React.ReactNode> = {
  like: <Heart className="h-4 w-4 text-pink-500" />,
  reply: <MessageSquare className="h-4 w-4 text-blue-500" />,
  repost: <Repeat2 className="h-4 w-4 text-green-500" />,
  follow: <UserPlus className="h-4 w-4 text-purple-500" />,
  mention: <AtSign className="h-4 w-4 text-orange-500" />,
  system: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  post: <MessageSquare className="h-4 w-4 text-sky-500" />,
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: () => void;
  isRead?: boolean;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  isRead,
}: NotificationItemProps) {
  const icon = notificationIcons[notification.type] || (
    <Bell className="h-4 w-4" />
  );

  const handleClick = () => {
    if (!isRead) {
      onMarkAsRead();
    }
    //* Navigate based on metadata
    if (notification.metadata?.postId) {
      window.location.href = `/posts/${notification.metadata.postId}`;
    } else if (notification.metadata?.userId) {
      window.location.href = `/profile/${notification.metadata.userId}`;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-start gap-3 p-3 cursor-pointer hover:bg-accent transition-colors",
        !isRead && "bg-blue-50 hover:bg-blue-100"
      )}
    >
      <div className="shrink mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm line-clamp-2">{notification.title}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(notification.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      {!isRead && (
        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink" />
      )}
    </div>
  );
}
