import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "@/lib/api/notifications";
import { useWebSocketStore } from "@/stores/websocket-store";
import { Notification, UnreadCountResponse } from "@/types/notification";
import { useUniversalInfiniteQuery } from "./useUniversalInfiniteQuery";
import { toast } from "sonner";
import api from "../api/axios";

const NOTIFICATIONS_QUERY_KEY = "notifications";
const UNREAD_COUNT_QUERY_KEY = "unreadCount";

//todo ============> Hook for loading notifications via REST
export function useNotifications() {
  const { notifications: wsNotifications } = useWebSocketStore();

  const {
    data,
    hasNextPage,
    refetch,
    isFetchingNextPage,
    fetchNextPage,
    isError,
    isLoading,
  } = useUniversalInfiniteQuery<Notification>(
    ["notifications"],
    "notifications",
    20
  );
  //* 2. Flatten the nested pages into a single array
  const rawData = data?.pages.flatMap((page) => page.items) ?? [];
  const fullNotifications = [...rawData, ...wsNotifications];
  //* 3. Deduplicate by notification ID
  const notifications = Array.from(
    new Map(fullNotifications.map((n) => [n.id, n])).values()
  );
  return {
    notifications,
    refetch,
    hasNextPage,
    totalItems: notifications.length,
    isError,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
  };
}

// todo ===========> Hook for unread count (combines REST initial + WebSocket updates)
export function useUnreadCount() {
  const { unreadCount: wsUnreadCount } = useWebSocketStore();

  // Fetch from REST as backup
  const query = useQuery<UnreadCountResponse>({
    queryKey: [UNREAD_COUNT_QUERY_KEY],
    queryFn: async () => {
      const { data } = await notificationsService.getUnreadCount();
      return data;
    },
    enabled: !wsUnreadCount,
    refetchOnWindowFocus: false,
  });
  const count = wsUnreadCount ?? query.data?.count ?? 0;
  return {
    isLoading: query.isLoading && !wsUnreadCount,
    isError: query.isError,
    count,
  };
}

//todo ===============>  Hook for marking as read (uses both REST and WebSocket)
export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const { markAsRead: wsMarkAsRead } = useWebSocketStore();

  return useMutation<Notification, Error, string>({
    mutationFn: async (notificationId: string) => {
      const response = await notificationsService.markAsRead(notificationId);
      return response.data;
    },
    onMutate: (notificationId) => {
      //* Optimistically update via WebSocket immediately
      wsMarkAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    },
  });
}

// todo ================> Hook for marking all as read
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  const { markAllAsRead: wsMarkAllAsRead } = useWebSocketStore();

  return useMutation<{ message: string }, Error, void>({
    mutationFn: async () => {
      const response = notificationsService.markAllAsRead();
      return (await response).data;
    },
    onMutate: () => {
      wsMarkAllAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [UNREAD_COUNT_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Failed to mark all notifications as read:", error);
    },
  });
}

//todo ===============> Hook for deleting notification
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const { removeNotification: wsRemoveNotification } = useWebSocketStore();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await notificationsService.deleteNotification(
        notificationId
      );
      return response.data;
    },
    onMutate: (notificationId) => {
      //* Optimistically remove from WebSocket store
      wsRemoveNotification(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
    onError: () => {
      toast.error("Failed to delete notification");
    },
  });
}

export function useFollowToggle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (targetName: string) => {
      await api.post(`/users/${targetName}/follow`);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      }),
  });
}
export function useMuteToggle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, mute }: { userId: string; mute: boolean }) => {
      await api.post(`/notifications/preferences/mute-user`, {
        userId,
        mute,
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["user-preferences"],
      }),
  });
}
