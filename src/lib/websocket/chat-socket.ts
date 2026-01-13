import { ApiConversation, ApiMessage, ApiUser } from "@/types/chat";
import { io, Socket } from "socket.io-client";

const CHAT_WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";

//* Chat Socket instance
let chatSocket: Socket | null = null;

//* Event types specific to chat
export type TypingEvent = {
  conversationId: string;
  userId: string;
  username: string;
  typing: boolean;
};

export type ReadReceiptEvent = {
  conversationId: string;
  userId: string;
  messageIds: string[];
};

export type ReactionEvent = {
  messageId: string;
  reaction?: {
    emoji: string;
    userId: string;
    reactedAt: string;
  };
  userId?: string;
  emoji?: string;
};

export interface ChatWebSocketEventMap {
  //* Server → Client events
  connected: { message: string; userId: string };
  joined_conversation: { conversationId: string };
  new_message: { conversationId: string; message: ApiMessage };
  message_notification: {
    conversationId: string;
    message: ApiMessage;
    unreadCount: number;
  };
  user_typing: TypingEvent;
  reaction_added: ReactionEvent;
  reaction_removed: ReactionEvent;
  messages_read: ReadReceiptEvent;
  conversation_updated: ApiConversation;
  user_joined: { conversationId: string; user: ApiUser };
  user_left: { conversationId: string; userId: string };
  error: { message: string };
}

//* 1. Initialize chat socket
export const initializeChatSocket = (): Socket => {
  if (chatSocket?.connected) {
    return chatSocket;
  }

  chatSocket = io(`${CHAT_WS_URL}/chat`, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return chatSocket;
};

//* 2. Get the chat socket instance
export const getChatSocket = (): Socket | null => {
  return chatSocket;
};

//* 3. Cleanup
export const disconnectChatSocket = (): void => {
  if (chatSocket) {
    chatSocket.disconnect();
    chatSocket = null;
  }
};

//* 4. Helper to emit chat events
export const emitChatEvent = <T extends keyof ChatWebSocketEventMap>(
  event: T,
  data: ChatWebSocketEventMap[T]
): void => {
  if (chatSocket?.connected) {
    chatSocket.emit(event, data);
  }
};

//* 5. Join conversation room
export const joinConversationRoom = (conversationId: string): void => {
  emitChatEvent("join_conversation", { conversationId });
};

//* 6. Leave conversation room
export const leaveConversationRoom = (conversationId: string): void => {
  emitChatEvent("leave_conversation", { conversationId });
};

//* 7. Send message
export const sendChatMessage = (
  conversationId: string,
  message: {
    content: string;
    type?: string;
    replyToId?: string;
  }
): void => {
  emitChatEvent("send_message", { conversationId, message });
};

//* 8. Typing indicators
export const startTyping = (conversationId: string): void => {
  emitChatEvent("typing_start", { conversationId });
};

export const stopTyping = (conversationId: string): void => {
  emitChatEvent("typing_stop", { conversationId });
};

//* 9. Reactions
export const addReaction = (messageId: string, emoji: string): void => {
  emitChatEvent("add_reaction", { messageId, emoji });
};

//* 10. Mark messages as read
export const markMessagesAsRead = (
  conversationId: string,
  messageIds: string[]
): void => {
  emitChatEvent("mark_read", { conversationId, messageIds });
};
