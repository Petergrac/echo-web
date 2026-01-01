// types/notification.ts
export interface NotPrefDto {
  id: string;
  userId: string;

  // Core notification preferences
  likes: boolean;
  posts: boolean;
  replies: boolean;
  reposts: boolean;
  follows: boolean;
  mentions: boolean;
  system: boolean;

  // Email preferences
  emailDigest: boolean;
  emailSystem: boolean;

  // Push notification preferences
  pushLikes: boolean;
  pushReplies: boolean;
  pushReposts: boolean;
  pushFollows: boolean;
  pushMentions: boolean;
  pushSystem: boolean;

  // UX Preferences
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  deliveryTiming: string;

  // Muting preferences
  mutedUsers: string[];
  mutedKeywords: string[];
}

export type NotificationType =
  | "LIKE"
  | "REPLY"
  | "REPOST"
  | "FOLLOW"
  | "MENTION"
  | "SYSTEM";

export interface NotificationActor {
  id: string;
  username: string;
  firstName: string;
  avatar: string;
}

export interface Notification {
  id: string;
  createdAt: string;
  type: NotificationType;
  actor: NotificationActor;
  postId?: string;
  replyId?: string;
  read: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UnreadCountResponse {
  count: number;
}
