import { Conversation, useChatStore } from "@/stores/chat-store";
import { useWebSocketStore } from "@/stores/websocket-store";
import { useEffect, useCallback, useRef, useState } from "react";
import { useConversations, useSendMessage } from "./api/chat";
import { ChatType } from "../websocket/chat-socket";

export const useChat = () => {
  const {
    isConnected,
    conversations,
    activeConversation,
    messages,
    typingUsers,
    onlineUsers,
    setConversations,
    setActiveConversation,
    joinConversation,
    leaveConversation,
    sendMessage: sendMessageSocket,
    startTyping: startTypingSocket,
    stopTyping: stopTypingSocket,
    addReaction: addReactionSocket,
    markMessagesRead: markMessagesReadSocket,
  } = useChatStore();

  const { onlineUsers: notificationOnlineUsers } = useWebSocketStore();

  const { data: conversationsData, isLoading: loadingConversations } =
    useConversations();
  const { mutateAsync: sendMessageApi } = useSendMessage();

  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);
  const [isTyping, setIsTyping] = useState(false);

  //* Sync conversations from API
  useEffect(() => {
    if (conversationsData?.conversations) {
      setConversations(conversationsData.conversations);
    }
  }, [conversationsData, setConversations]);

  //* Get current conversation messages
  const getMessages = useCallback(
    (conversationId: string) => {
      return messages.get(conversationId) || [];
    },
    [messages]
  );

  //* Get typing users for current conversation
  const getTypingUsers = (conversationId: string) => {
    return typingUsers.get(conversationId) || [];
  };

  //* Handle conversation selection
  const selectConversation = useCallback(
    (conversation: Conversation) => {
      if (activeConversation?.id) {
        leaveConversation(activeConversation.id);
      }

      setActiveConversation(conversation);
      joinConversation(conversation.id);

      //* Mark messages as read
      const unreadMessages = getMessages(conversation.id)
        .filter((msg) => !msg.readBy?.includes("current")) // You'll need current user ID
        .map((msg) => msg.id);

      if (unreadMessages.length > 0) {
        markMessagesReadSocket(conversation.id, unreadMessages);
      }
    },
    [
      activeConversation,
      setActiveConversation,
      joinConversation,
      leaveConversation,
      markMessagesReadSocket,
      getMessages,
    ]
  );

  //* Send message with both socket and API
  const sendMessage = useCallback(
    async (
      content: string,
      type: ChatType = "TEXT",
      replyToId?: string,
      file?: File
    ) => {
      if (!activeConversation) return;

      if (file) {
        //* Use API for file upload
        try {
          await sendMessageApi({
            conversationId: activeConversation.id,
            content,
            type,
            replyToId,
            file,
          });
        } catch (error) {
          console.error("Failed to send message:", error);
        }
      } else {
        //* Use socket for text messages
        sendMessageSocket(activeConversation.id, content, type, replyToId);
      }

      //* Stop typing
      setIsTyping(false);
      stopTypingSocket(activeConversation.id);
    },
    [activeConversation, sendMessageSocket, sendMessageApi, stopTypingSocket]
  );

  //* Typing handlers
  const handleTyping = useCallback(() => {
    if (!activeConversation || !isTyping) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTypingSocket(activeConversation.id);
    }, 3000);
  }, [activeConversation, isTyping, stopTypingSocket]);

  const startTyping = useCallback(() => {
    if (!activeConversation) return;

    if (!isTyping) {
      setIsTyping(true);
      startTypingSocket(activeConversation.id);
    }

    handleTyping();
  }, [activeConversation, isTyping, startTypingSocket, handleTyping]);

  //* Check if user is online
  const isUserOnline = useCallback(
    (userId: string) => {
      return onlineUsers.has(userId) || notificationOnlineUsers.has(userId);
    },
    [onlineUsers, notificationOnlineUsers]
  );

  return {
    //* State
    isConnected,
    conversations,
    activeConversation,
    getMessages,
    getTypingUsers,
    loadingConversations,

    //* Actions
    selectConversation,
    sendMessage,
    startTyping,
    stopTyping: () => {
      if (activeConversation) {
        setIsTyping(false);
        stopTypingSocket(activeConversation.id);
      }
    },
    addReaction: addReactionSocket,
    markMessagesRead: markMessagesReadSocket,
    isUserOnline,
  };
};
