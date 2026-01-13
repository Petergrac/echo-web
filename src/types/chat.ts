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
  type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE" | "GIF";
  status: "SENT" | "DELIVERED" | "READ";
  conversationId: string;
  sender: ApiUser;
  replyTo?: ApiMessage;
  media?: string;
  reactions: ApiReaction[];
  readReceipts: ApiReadReceipt[];
  metadata?: Record<string, object>;
  createdAt: string;
  updatedAt: string;
  deletedForUserAt?: string;
  deletedForUserId?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  type: ChatType;
  sender: {
    id: string;
    username: string;
    avatar?: string;
  };
  conversationId: string;
  createdAt: string;
  updatedAt?: string;
  reactions: MessageReaction[];
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
export type ChatType = "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE" | "GIF";

export interface ConversationParticipant {
  id: string;
  userId: string;
  isActive: boolean;
  isAdmin: boolean;
  joinedAt?: string;
  unreadCount?: number;
  notificationEnabled: boolean;
  user: ApiUser;
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
  participants: ConversationParticipant[];
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  reactedAt: string;
}
