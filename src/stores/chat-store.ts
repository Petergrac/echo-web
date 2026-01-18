import { create } from "zustand";
import { enableMapSet, produce } from "immer";
import { Socket } from "socket.io-client";

enableMapSet();
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
} from "@/lib/websocket/chat-socket";
import { toast } from "sonner";
import { ChatMessage, ChatType, Conversation } from "@/types/chat";
import { mapMessage } from "@/lib/mapper";

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
  accessToken: string;

  //* Actions
  setChatAccessToken: (token: string) => void;
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
    updates: Partial<ChatMessage>,
  ) => void;
  removeMessage: (conversationId: string, messageId: string) => void;
  clearMessages: (conversationId: string) => void;

  //* Typing actions
  setTyping: (
    conversationId: string,
    userId: string,
    username: string,
    typing: boolean,
  ) => void;
  clearTyping: (conversationId: string) => void;

  //* Online status
  getOnlineUsers: () => void;
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;

  //* Socket actions
  sendMessage: (
    conversationId: string,
    content: string,
    type: ChatType,

    sender: {
      id: string;
      username: string;
      avatar?: string;
    },
    replyTo: ChatMessage | null,
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
  accessToken: "",

  //* Actions
  setChatAccessToken: (accessToken: string) => {
    set({ accessToken });
    const { socket } = get();
    if (socket) {
      if (socket.connected) socket.disconnect();
      socket.auth = { token: accessToken };
      socket.connect();
    } else {
      get().initializeChatSocket();
    }
  },

  initializeChatSocket: () => {
    const currentSocket = get().socket;
    const accessToken = get().accessToken;
    if (currentSocket?.connected) {
      return;
    }

    const socket = initializeChatSocket(accessToken);

    //* Connection events
    socket.on("connect", () => {
      console.log("Chat WebSocket Connected");
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("Chat WebSocket Disconnected");
      set({ isConnected: false });
    });

    socket.on("new_message", (data) => {
      const chatMessage = mapMessage(data.message);
      const conversationId = data.conversationId;
      console.log(chatMessage)
      //* Add message to store
      get().addMessage(conversationId, chatMessage);

      //* Update conversation last message
      const conversations = get().conversations;
      const conversationIndex = conversations.findIndex(
        (c) => c.id === conversationId,
      );

      if (conversationIndex > -1) {
        set(
          produce((state: ChatState) => {
            state.conversations[conversationIndex].lastMessage = chatMessage;
            state.conversations[conversationIndex].lastMessageAt =
              chatMessage.createdAt;

            //* If not active conversation, increment unread count
            if (state.activeConversation?.id !== conversationId) {
              state.conversations[conversationIndex].unreadCount += 1;
            }

            //* Sort conversations by last message
            state.conversations.sort(
              (a, b) =>
                new Date(b.lastMessageAt).getTime() -
                new Date(a.lastMessageAt).getTime(),
            );
          }),
        );
      }

      //* Show notification if not in active conversation
      if (get().activeConversation?.id !== conversationId) {
        toast.info("New message", {
          description: `${
            chatMessage.sender.username
          }: ${chatMessage.content.substring(0, 50)}...`,
        });
      }
    });

    socket.on("message_notification", (data: { message: ChatMessage }) => {
      toast.info("New message", {
        description: `${data.message.sender.username}: ${data.message.content.substring(0, 50)}...`,
      });
    });

    socket.on("user_typing", (data) => {
      get().setTyping(
        data.conversationId,
        data.userId,
        data.username,
        data.typing,
      );
    });

    socket.on("reaction_added", (data) => {
      const conversationId = get().activeConversation?.id;
      if (conversationId && data.reaction) {
        set(
          produce((state: ChatState) => {
            const messages = state.messages.get(conversationId) || [];
            const messageIndex = messages.findIndex(
              (m) => m.id === data.messageId,
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
                  ),
              );

              //* Add new reaction
              messages[messageIndex].reactions!.push({
                id: data.reaction.id,
                emoji: data.reaction.emoji,
                userId: data.reaction.userId,
                reactedAt: data.reaction.reactedAt,
              });
            }
          }),
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
              (m) => m.id === data.messageId,
            );

            if (messageIndex > -1 && messages[messageIndex].reactions) {
              messages[messageIndex].reactions = messages[
                messageIndex
              ].reactions!.filter(
                (r) => !(r.userId === data.userId && r.emoji === data.emoji),
              );
            }
          }),
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
          }),
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

    socket.on("online_users", (data: { onlineUsers: string[] }) => {
      set({ onlineUsers: new Set(data.onlineUsers) });
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
          (c) => c.id === conversation.id,
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
            new Date(a.lastMessageAt).getTime(),
        );
      }),
    );
  },

  setActiveConversation: (conversation) => {
    set({ activeConversation: conversation });

    //* Clear unread count for this conversation
    if (conversation) {
      set(
        produce((state: ChatState) => {
          const convIndex = state.conversations.findIndex(
            (c) => c.id === conversation.id,
          );
          if (convIndex > -1) {
            state.conversations[convIndex].unreadCount = 0;
          }
        }),
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

        //* Find if there is an optimistic message that matches this new real message
        const optimisticIndex = messages.findIndex(
          (m) =>
            m.isSending &&
            m.content === message.content &&
            m.sender.id === message.sender.id,
        );

        if (optimisticIndex > -1) {
          //* REPLACE the optimistic message with the real one from the server
          messages[optimisticIndex] = message;
        } else {
          //* Otherwise, just add it if it's not a duplicate
          if (!messages.some((m) => m.id === message.id)) {
            messages.push(message);
          }
        }

        //* Keep messages sorted
        messages.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      }),
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
      }),
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
      }),
    );
  },

  clearMessages: (conversationId) => {
    set(
      produce((state: ChatState) => {
        state.messages.delete(conversationId);
      }),
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
      }),
    );
  },

  clearTyping: (conversationId) => {
    set(
      produce((state: ChatState) => {
        state.typingUsers.delete(conversationId);
      }),
    );
  },

  //* Online status
  getOnlineUsers: () => {
    const { socket } = get();
    if (socket) {
      socket.emit("get_online_users");
    }
  },

  addOnlineUser: (userId) => {
    set(
      produce((state: ChatState) => {
        state.onlineUsers.add(userId);
      }),
    );
  },

  removeOnlineUser: (userId) => {
    set(
      produce((state: ChatState) => {
        state.onlineUsers.delete(userId);
      }),
    );
  },

  //* Socket actions
  sendMessage: (
    conversationId,
    content,
    type: ChatType = "text",
    sender,
    replyTo,
  ) => {
    const tempId = `temp-${Date.now()}`;
    console.log("Sending message:", {
      conversationId,
      content,
      type,
      sender,
      replyTo,
    });
    //* Optimistic update
    get().addMessage(conversationId, {
      id: tempId,
      content,
      type: type,
      status: "sent",
      sender: {
        id: sender.id,
        avatar: sender.avatar,
        username: sender.username,
      },
      conversationId,
      replyTo: replyTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reactions: [],
      readBy: [],
      isSending: true,
    });

    const replyToId = replyTo ? replyTo.id : undefined;
    //* Send via socket
    sendChatMessage(conversationId, { content, type, replyToId });

    //* Update status after 5 seconds if still sending
    setTimeout(() => {
      const currentMessages = get().messages.get(conversationId);
      //* Look for the specific temporary ID
      const tempMessage = currentMessages?.find((m) => m.id === tempId);

      //* If it still exists AND still has isSending, it means addMessage never replaced it
      if (tempMessage && tempMessage.isSending) {
        get().updateMessage(conversationId, tempId, {
          isError: true,
          isSending: false,
        });
      }
    }, 20000);
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
