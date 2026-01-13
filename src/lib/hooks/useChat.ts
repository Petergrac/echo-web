import { useChatStore } from "@/stores/chat-store";
import { useEffect, useCallback, useRef, useState } from "react";
import { useConversations, useSendMessage } from "./api/chat";
import { ChatType, Conversation } from "@/types/chat";
import { useCurrentUser } from "@/stores/useStore";

export const useChat = () => {
  const {
    isConnected,
    conversations,
    activeConversation,
    messages,
    typingUsers,
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
  const user = useCurrentUser();

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
      if (user) {
        const unreadMessages = getMessages(conversation.id)
          .filter((msg) => !msg.readBy?.includes(user.id))
          .map((msg) => msg.id);

        if (unreadMessages.length > 0) {
          markMessagesReadSocket(conversation.id, unreadMessages);
        }
      }
    },
    [
      activeConversation,
      setActiveConversation,
      joinConversation,
      leaveConversation,
      markMessagesReadSocket,
      getMessages,
      user,
    ]
  );

  //* Send message with both socket and API
  const sendMessage = useCallback(
    async (
      content: string,
      type: ChatType = "text",
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
        if (user && replyToId) {
          sendMessageSocket(activeConversation.id, content, type, replyToId!, {
            id: user?.id,
            username: user?.username,
            avatar: user?.avatar,
          });
        }
      }

      //* Stop typing
      setIsTyping(false);
      stopTypingSocket(activeConversation.id);
    },
    [
      activeConversation,
      sendMessageSocket,
      sendMessageApi,
      stopTypingSocket,
      user,
    ]
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
  };
};
