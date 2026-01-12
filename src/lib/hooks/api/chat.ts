import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { useUniversalInfiniteQuery } from "../useUniversalInfiniteQuery";
import { ChatMessage } from "@/stores/chat-store";
import { Conversation } from "@/types/chat";

interface UpdateConversationType {
  name?: string;
  avatar?: string;
  notificationsEnabled?: boolean;
}
//* Conversation endpoints
export const useConversations = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: ["conversations", page, limit],
    queryFn: async () => {
      const response = await api.get(
        `chat/conversations?page=${page}&limit=${limit}`
      );
      return response.data;
    },
  });
};

export const useConversation = (id: string) => {
  return useQuery<Conversation>({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const response = await api.get(`chat/conversations/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      participantIds: string[];
      name?: string;
      type: "DIRECT" | "GROUP";
    }) => {
      const response = await api.post("chat/conversations", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useUpdateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateConversationType;
    }) => {
      const response = await api.patch(`chat/conversations/${id}`, data);
      return response.data;
    },
    onSuccess: (variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useLeaveConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`chat/conversations/${id}/leave`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.removeQueries({ queryKey: ["conversation", id] });
    },
  });
};

//* Message endpoints
export const useMessages = (conversationId: string, limit = 50) => {
  return useUniversalInfiniteQuery<ChatMessage>(
    ["messages", conversationId],
    `chat/conversations/${conversationId}/messages`,
    limit,
    {
      enabled: !!conversationId,
    }
  );
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
      type = "text",
      replyToId,
      file,
    }: {
      conversationId: string;
      content: string;
      type?: string;
      replyToId?: string;
      file?: File;
    }) => {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("type", type);
      if (replyToId) formData.append("replyToId", replyToId);
      if (file) formData.append("file", file);

      const response = await api.post(
        `chat/conversations/${conversationId}/messages`,
        formData
      );
      return response.data;
    },
    onSuccess: (variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useEditMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      content,
    }: {
      messageId: string;
      content: string;
    }) => {
      const response = await api.patch(`chat/messages/${messageId}`, {
        content,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", conversationId],
      });
    },
  });
};

export const useDeleteMessage = () => {
  return useMutation({
    mutationFn: async ({
      messageId,
      forEveryone = false,
    }: {
      messageId: string;
      forEveryone?: boolean;
    }) => {
      const response = await api.delete(`chat/messages/${messageId}`, {
        params: { forEveryone },
      });
      return response.data;
    },
  });
};

export const useAddReaction = () => {
  return useMutation({
    mutationFn: async ({
      messageId,
      emoji,
    }: {
      messageId: string;
      emoji: string;
    }) => {
      const response = await api.post(`chat/messages/${messageId}/reactions`, {
        emoji,
      });
      return response.data;
    },
  });
};

export const useMarkAsRead = () => {
  return useMutation({
    mutationFn: async ({
      conversationId,
      messageIds,
    }: {
      conversationId: string;
      messageIds: string[];
    }) => {
      const response = await api.post(
        `chat/conversations/${conversationId}/read`,
        { messageIds }
      );
      return response.data;
    },
  });
};
