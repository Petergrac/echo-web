import { create } from "zustand";
import { produce } from "immer";
import { Socket } from "socket.io-client";
import {
  initializeChatSocket,
  disconnectChatSocket,
  joinConversationRoom,
  leaveConversationRoom,
  sendChatMessage,
  startTyping as startTypingSocket,
  stopTyping as stopTypingSocket,
  addReaction as addReactionSocket,
  markMessagesAsRead as markMessagesAsReadSocket,
  type ChatMessageEvent,
  ChatType,
} from "@/lib/websocket/chat-socket";
import { toast } from "sonner";

export interface Conversation {
  id: string;
  name?: string;
  type: "DIRECT" | "GROUP";
  avatar?: string;
  lastMessage?: ChatMessageEvent;
  lastMessageAt: string;
  participants: Array<{
    id: string;
    username: string;
    avatar?: string;
    isAdmin: boolean;
    joinedAt: string;
  }>;
  unreadCount: number;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage extends ChatMessageEvent {
  isSending?: boolean;
  isError?: boolean;
  reactions?: Array<{
    emoji: string;
    userId: string;
    username: string;
    reactedAt: string;
  }>;
  readBy?: string[];
}

export interface UserTyping {
  userId: string;
  username: string;
  typing: boolean;
  lastTypingAt: Date;
}

interface ChatState {
  //* State
  socket: Socket | null;
  isConnected: boolean;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Map<string, ChatMessage[]>; // conversationId -> messages
  typingUsers: Map<string, UserTyping[]>; // conversationId -> typing users
  onlineUsers: Set<string>;

  //* Actions
  initializeChatSocket: () => void;
  disconnectSocket: () => void;

  //* Conversation actions
  setConversations: (conversations: Conversation[]) => void;
  addOrUpdateConversation: (conversation: Conversation) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;

  //* Message actions
  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (
    conversationId: string,
    messageId: string,
    updates: Partial<ChatMessage>
  ) => void;
  removeMessage: (conversationId: string, messageId: string) => void;
  clearMessages: (conversationId: string) => void;

  //* Typing actions
  setTyping: (
    conversationId: string,
    userId: string,
    username: string,
    typing: boolean
  ) => void;
  clearTyping: (conversationId: string) => void;

  //* Online status
  setOnlineUsers: (users: string[]) => void;
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;

  //* Socket actions
  sendMessage: (
    conversationId: string,
    content: string,
    type?: ChatType,
    replyToId?: string
  ) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  markMessagesRead: (conversationId: string, messageIds: string[]) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  //* Initial state
  socket: null,
  isConnected: false,
  conversations: [],
  activeConversation: null,
  messages: new Map(),
  typingUsers: new Map(),
  onlineUsers: new Set(),

  //* Actions
  initializeChatSocket: () => {
    const currentSocket = get().socket;
    if (currentSocket?.connected) {
      console.log("Chat socket already connected");
      return;
    }

    const socket = initializeChatSocket();

    //* Connection events
    socket.on("connect", () => {
      console.log("🔗 Chat WebSocket connected");
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Chat WebSocket disconnected");
      set({ isConnected: false });
    });

    socket.on("connected", (data) => {
      console.log("Chat socket authenticated:", data);
    });

    socket.on("joined_conversation", (data) => {
      console.log("Joined conversation:", data.conversationId);
    });

    socket.on("new_message", (data) => {
      const { conversationId, message } = data;

      //* Add message to store
      get().addMessage(conversationId, message);

      //* Update conversation last message
      const conversations = get().conversations;
      const conversationIndex = conversations.findIndex(
        (c) => c.id === conversationId
      );

      if (conversationIndex > -1) {
        set(
          produce((state: ChatState) => {
            state.conversations[conversationIndex].lastMessage = message;
            state.conversations[conversationIndex].lastMessageAt =
              message.createdAt;

            //* If not active conversation, increment unread count
            if (state.activeConversation?.id !== conversationId) {
              state.conversations[conversationIndex].unreadCount += 1;
            }

            //* Sort conversations by last message
            state.conversations.sort(
              (a, b) =>
                new Date(b.lastMessageAt).getTime() -
                new Date(a.lastMessageAt).getTime()
            );
          })
        );
      }

      //* Show notification if not in active conversation
      if (get().activeConversation?.id !== conversationId) {
        toast.info("New message", {
          description: `${message.sender.username}: ${message.content.substring(
            0,
            50
          )}...`,
        });
      }
    });

    socket.on("message_notification", (data) => {
      console.log("Message notification:", data);
      // You can show a different notification style here
    });

    socket.on("user_typing", (data) => {
      get().setTyping(
        data.conversationId,
        data.userId,
        data.username,
        data.typing
      );
    });

    socket.on("reaction_added", (data) => {
      const conversationId = get().activeConversation?.id;
      if (conversationId && data.reaction) {
        set(
          produce((state: ChatState) => {
            const messages = state.messages.get(conversationId) || [];
            const messageIndex = messages.findIndex(
              (m) => m.id === data.messageId
            );

            if (messageIndex > -1) {
              if (!messages[messageIndex].reactions) {
                messages[messageIndex].reactions = [];
              }

              //* Remove existing reaction from same user
              messages[messageIndex].reactions = messages[
                messageIndex
              ].reactions!.filter(
                (r) =>
                  !(
                    r.userId === data.reaction!.userId &&
                    r.emoji === data.reaction!.emoji
                  )
              );

              //* Add new reaction
              messages[messageIndex].reactions!.push({
                emoji: data.reaction.emoji,
                userId: data.reaction.userId,
                username: data.reaction.userId, // You might want to fetch username
                reactedAt: data.reaction.reactedAt,
              });
            }
          })
        );
      }
    });

    socket.on("reaction_removed", (data) => {
      const conversationId = get().activeConversation?.id;
      if (conversationId) {
        set(
          produce((state: ChatState) => {
            const messages = state.messages.get(conversationId) || [];
            const messageIndex = messages.findIndex(
              (m) => m.id === data.messageId
            );

            if (messageIndex > -1 && messages[messageIndex].reactions) {
              messages[messageIndex].reactions = messages[
                messageIndex
              ].reactions!.filter(
                (r) => !(r.userId === data.userId && r.emoji === data.emoji)
              );
            }
          })
        );
      }
    });

    socket.on("messages_read", (data) => {
      //* Update read receipts
      const conversationId = get().activeConversation?.id;
      if (conversationId && data.conversationId === conversationId) {
        set(
          produce((state: ChatState) => {
            const messages = state.messages.get(conversationId) || [];
            messages.forEach((msg) => {
              if (data.messageIds.includes(msg.id)) {
                if (!msg.readBy) {
                  msg.readBy = [];
                }
                if (!msg.readBy.includes(data.userId)) {
                  msg.readBy.push(data.userId);
                }
              }
            });
          })
        );
      }
    });

    socket.on("conversation_updated", (conversation) => {
      get().addOrUpdateConversation(conversation);
    });

    socket.on("error", (error) => {
      console.error("Chat WebSocket error:", error);
      toast.error("Chat error", {
        description: error.message,
      });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      disconnectChatSocket();
      set({ socket: null, isConnected: false });
    }
  },

  //* Conversation actions
  setConversations: (conversations) => {
    set({ conversations });
  },

  addOrUpdateConversation: (conversation) => {
    set(
      produce((state: ChatState) => {
        const index = state.conversations.findIndex(
          (c) => c.id === conversation.id
        );
        if (index > -1) {
          state.conversations[index] = conversation;
        } else {
          state.conversations.unshift(conversation);
        }

        //* Sort by last message
        state.conversations.sort(
          (a, b) =>
            new Date(b.lastMessageAt).getTime() -
            new Date(a.lastMessageAt).getTime()
        );
      })
    );
  },

  setActiveConversation: (conversation) => {
    set({ activeConversation: conversation });

    //* Clear unread count for this conversation
    if (conversation) {
      set(
        produce((state: ChatState) => {
          const convIndex = state.conversations.findIndex(
            (c) => c.id === conversation.id
          );
          if (convIndex > -1) {
            state.conversations[convIndex].unreadCount = 0;
          }
        })
      );
    }
  },

  joinConversation: (conversationId) => {
    joinConversationRoom(conversationId);
  },

  leaveConversation: (conversationId) => {
    leaveConversationRoom(conversationId);
  },

  //* Message actions
  addMessage: (conversationId, message) => {
    set(
      produce((state: ChatState) => {
        if (!state.messages.has(conversationId)) {
          state.messages.set(conversationId, []);
        }
        const messages = state.messages.get(conversationId)!;

        // Don't add duplicates
        if (
          !messages.some(
            (m) =>
              m.id === message.id ||
              (m.isSending && m.content === message.content)
          )
        ) {
          messages.push(message);
          //* Keep messages sorted by timestamp
          messages.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
      })
    );
  },

  updateMessage: (conversationId, messageId, updates) => {
    set(
      produce((state: ChatState) => {
        const messages = state.messages.get(conversationId);
        if (messages) {
          const index = messages.findIndex((m) => m.id === messageId);
          if (index > -1) {
            messages[index] = { ...messages[index], ...updates };
          }
        }
      })
    );
  },

  removeMessage: (conversationId, messageId) => {
    set(
      produce((state: ChatState) => {
        const messages = state.messages.get(conversationId);
        if (messages) {
          const index = messages.findIndex((m) => m.id === messageId);
          if (index > -1) {
            messages.splice(index, 1);
          }
        }
      })
    );
  },

  clearMessages: (conversationId) => {
    set(
      produce((state: ChatState) => {
        state.messages.delete(conversationId);
      })
    );
  },

  //* Typing actions
  setTyping: (conversationId, userId, username, typing) => {
    set(
      produce((state: ChatState) => {
        if (!state.typingUsers.has(conversationId)) {
          state.typingUsers.set(conversationId, []);
        }

        const typingList = state.typingUsers.get(conversationId)!;
        const existingIndex = typingList.findIndex((u) => u.userId === userId);

        if (typing) {
          if (existingIndex > -1) {
            typingList[existingIndex] = {
              userId,
              username,
              typing,
              lastTypingAt: new Date(),
            };
          } else {
            typingList.push({
              userId,
              username,
              typing,
              lastTypingAt: new Date(),
            });
          }
        } else if (existingIndex > -1) {
          typingList.splice(existingIndex, 1);
        }
      })
    );
  },

  clearTyping: (conversationId) => {
    set(
      produce((state: ChatState) => {
        state.typingUsers.delete(conversationId);
      })
    );
  },

  //* Online status
  setOnlineUsers: (users) => {
    set({ onlineUsers: new Set(users) });
  },

  addOnlineUser: (userId) => {
    set(
      produce((state: ChatState) => {
        state.onlineUsers.add(userId);
      })
    );
  },

  removeOnlineUser: (userId) => {
    set(
      produce((state: ChatState) => {
        state.onlineUsers.delete(userId);
      })
    );
  },

  //* Socket actions
  sendMessage: (
    conversationId,
    content,
    type: ChatType = "TEXT",
    replyToId
  ) => {
    const tempId = `temp-${Date.now()}`;

    // Optimistic update
    get().addMessage(conversationId, {
      id: tempId,
      content,
      type: type,
      sender: { id: "current", username: "You" }, // Will be replaced by server
      conversationId,
      createdAt: new Date().toISOString(),
      isSending: true,
    });

    // Send via socket
    sendChatMessage(conversationId, { content, type, replyToId });

    // Update status after 5 seconds if still sending
    setTimeout(() => {
      const messages = get().messages.get(conversationId);
      const tempMessage = messages?.find((m) => m.id === tempId && m.isSending);
      if (tempMessage) {
        get().updateMessage(conversationId, tempId, { isError: true });
      }
    }, 5000);
  },

  startTyping: (conversationId) => {
    startTypingSocket(conversationId);
  },

  stopTyping: (conversationId) => {
    stopTypingSocket(conversationId);
  },

  addReaction: (messageId, emoji) => {
    addReactionSocket(messageId, emoji);
  },

  markMessagesRead: (conversationId, messageIds) => {
    markMessagesAsReadSocket(conversationId, messageIds);
  },
}));
