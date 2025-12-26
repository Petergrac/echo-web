import { useWebSocketStore } from "@/lib/stores/websocket-store";

export function useNotifications() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
  } = useWebSocketStore();

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return {
    notifications,
    unreadNotifications,
    readNotifications,
    unreadCount,

    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
  };
}
