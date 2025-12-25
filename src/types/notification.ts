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
