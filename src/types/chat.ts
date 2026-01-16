export interface ApiUser {
  id: string;
  username: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
}

export interface ApiParticipant {
  id: string;
  userId: string;
  isActive: boolean;
  isAdmin: boolean;
  joinedAt?: string;
  unreadCount?: number;
  notificationsEnabled: boolean;
  user: ApiUser;
}

export interface ApiConversation {
  id: string;
  type: "DIRECT" | "GROUP";
  name?: string;
  avatar?: string;
  messageCount: number;
  unreadCount?: number;
  lastMessageAt?: string;
  lastMessageId?: string;
  metadata?: Record<string, object>;
  createdAt: string;
  updatedAt: string;
  participants: ApiParticipant[];
  createdBy: ApiUser;
}

export interface ApiReaction {
  id: string;
  emoji: string;
  userId: string;
  reactedAt: string;
}

export interface ApiReadReceipt {
  userId: string;
  readAt: string;
}

export interface ApiMessage {
  id: string;
  content: string;
  type: "text" | "image" | "video" | "audio" | "file" | "gif";
  status: "sent" | "delivered" | "read";
  conversationId: string;
  sender: ApiUser;
  replyTo?: ApiMessage;
  media?: MediaInfo;
  reactions: ApiReaction[];
  readReceipts: ApiReadReceipt[];
  metadata?: Record<string, object>;
  createdAt: string;
  updatedAt: string;
  deletedForUserAt?: string;
  deletedForUserId?: string;
}
export interface MediaInfo{
  url: string;
  type: string;
  size: number;
  width: number;
  height: number;
  fileSize: number;
}
export interface ChatMessage {
  id: string;
  content: string;
  type: ChatType;
  status: "sent" | "delivered" | "read";
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
  conversationId: string;
  createdAt: string;
  updatedAt?: string;
  replyTo: ChatMessage | null;
  reactions: MessageReaction[];
  media?: MediaInfo;
  readBy: string[];
  isSending?: boolean;
  isError?: boolean;
}

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  reactedAt: string;
}
export type ChatType = "text" | "image" | "video" | "audio" | "file" | "gif";

export interface ConversationParticipant {
  id: string;
  userId: string;
  isActive: boolean;
  isAdmin: boolean;
  joinedAt?: string;
  unreadCount?: number;
  notificationEnabled: boolean;
  user: ApiUser;
  isOnline: boolean;
}

export interface Conversation {
  id: string;
  type: "direct" | "group";
  name?: string;
  avatar?: string;
  lastMessage?: ChatMessage;
  lastMessageAt: string;
  unreadCount: number;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  isOnline: boolean;
  participants: ConversationParticipant[];
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  reactedAt: string;
}
