import {
  ApiConversation,
  ApiMessage,
  ChatMessage,
  Conversation,
} from "@/types/chat";

export function mapConversation(api: ApiConversation): Conversation {
  return {
    id: api.id,
    type: api.type,
    name: api.name,
    avatar: api.avatar,
    messageCount: api.messageCount,
    unreadCount: api.unreadCount ?? 0,
    lastMessageAt: api.lastMessageAt ?? api.createdAt,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    participants: api.participants.map((p) => ({
      id: p.user.id,
      username: p.user.username,
      avatar: p.user.avatar,
      isAdmin: p.isAdmin,
      isActive: p.isActive,
      notificationEnabled: p.notificationsEnabled,
      userId: p.userId,
      user: p.user,
      joinedAt: p.joinedAt,
      unreadCount: p.unreadCount ?? 0,
    })),
  };
}

export function mapMessage(api: ApiMessage): ChatMessage {
  return {
    id: api.id,
    content: api.content,
    type: api.type,
    conversationId: api.conversationId,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    sender: {
      id: api.sender.id,
      username: api.sender.username,
      avatar: api.sender.avatar,
    },
    reactions: api.reactions.map((r) => ({
      id: r.id,
      emoji: r.emoji,
      userId: r.userId,
      reactedAt: r.reactedAt,
    })),
    readBy: api.readReceipts.map((r) => r.userId),
  };
}
