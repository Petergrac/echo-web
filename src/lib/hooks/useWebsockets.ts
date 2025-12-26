import { useEffect } from "react";
import { useWebSocketStore } from "../stores/websocket-store";

export const useWebSocket = () => {
  const {
    socket,
    isConnected,
    onlineUsers,
    notifications,
    unreadCount,
    initializeSocket,
    markAsRead,
    markAllAsRead,
    getOnlineStatus,
    getPreferences,
    resetPreferences,
    checkPermission,
    clearNotifications,
    removeNotification,
  } = useWebSocketStore();

  //* Auto-initialize socket on mount
  useEffect(() => {
    initializeSocket();

    return () => {
      // We might not want to disconnect on unmount
      // because other components might still need it
      // So we'll leave it connected
    };
  }, [initializeSocket]);

  return {
    socket,
    isConnected,
    onlineUsers,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getOnlineStatus,
    getPreferences,
    resetPreferences,
    checkPermission,
    clearNotifications,
    removeNotification,
  };
};

//* Hook for checking online status of specific users
export const useOnlineStatus = (userIds: string[]) => {
  const { onlineUsers, getOnlineStatus } = useWebSocket();

  useEffect(() => {
    if (userIds.length > 0) {
      getOnlineStatus(userIds);
    }
  }, [userIds, getOnlineStatus]);

  return userIds.map((userId) => ({
    userId,
    isOnline: onlineUsers.get(userId) || false,
  }));
};

//* Hook for notification preferences
export const useNotificationPreferences = () => {
  const { getPreferences, resetPreferences, checkPermission } = useWebSocket();

  return {
    getPreferences,
    resetPreferences,
    checkPermission,
  };
};
