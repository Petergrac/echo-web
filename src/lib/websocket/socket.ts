import { io, Socket } from "socket.io-client";

const WS_URL = `http://${window.location.hostname}:3000` || "http://localhost:3000";

//* Socket instance (will be initialized in the provider)
let socket: Socket | null = null;

//* Event types
export type NotificationEvent = {
  id: string;
  type: "like" | "reply" | "repost" | "follow" | "mention" | "system" | "post";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, object>;
};

export type OnlineStatusEvent = {
  userId: string;
  isOnline: boolean;
};

export type WebSocketEventMap = {
  //* Server → Client events
  connected: { message: string; userId: string };
  new_notification: NotificationEvent;
  unread_count: { count: number };
  notification_marked_as_read: NotificationEvent;
  mark_all_as_read: { message?: string };
  online_status: OnlineStatusEvent[];
  pong: { timestamp: number };
  error: { message: string };

  //* Client → Server events (acknowledgments)
  get_my_preferences_response: object;
  check_permission_response: { allowed: boolean };
  reset_notifications_response: object;
};

//* 1.Initialize socket with auth
export const initializeSocket = (): Socket => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(WS_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
};

//* 2.Get the socket instance
export const getSocket = (): Socket | null => {
  return socket;
};

//* 3.Cleanup
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
