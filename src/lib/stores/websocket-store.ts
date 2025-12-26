import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { produce } from "immer";

//* Types
export type NotificationType =
  | "like"
  | "reply"
  | "repost"
  | "follow"
  | "mention"
  | "system"
  | "post";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    postId?: string;
    userId?: string;
    commentId?: string;
    [key: string]: unknown;
  };
}

export interface OnlineStatus {
  userId: string;
  isOnline: boolean;
}

export interface WebSocketState {
  //* State
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Map<string, boolean>;
  notifications: Notification[];
  unreadCount: number;

  //* Actions
  initializeSocket: () => void;
  disconnectSocket: () => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  getOnlineStatus: (userIds: string[]) => void;
  getPreferences: () => Promise<unknown>;
  resetPreferences: () => Promise<unknown>;
  checkPermission: (type: string) => Promise<boolean>;
  clearNotifications: () => void;
  removeNotification: (notificationId: string) => void;
}

//* WebSocket URL
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3000";

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  //* Initial state
  socket: null,
  isConnected: false,
  onlineUsers: new Map(),
  notifications: [],
  unreadCount: 0,

  //* Actions
  initializeSocket: () => {
    const currentSocket = get().socket;
    if (currentSocket?.connected) {
      console.log("Socket already connected");
      return;
    }

    //* Create new socket connection
    const socket = io(WS_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    //* Connection events
    socket.on("connect", () => {
      console.log("🔗 WebSocket connected");
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("🔴 WebSocket disconnected");
      set({ isConnected: false });
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    //* Notification events
    socket.on("new_notification", (data: Notification) => {
      console.log("📩 New notification:", data);

      set(
        produce((state: WebSocketState) => {
          state.notifications.unshift(data);
          if (!data.read) {
            state.unreadCount += 1;
          }
        })
      );

      //* Show browser notification
      if (
        typeof window !== "undefined" &&
        Notification.permission === "granted"
      ) {
        new Notification(data.title, { body: data.message });
      }
    });

    socket.on("unread_count", (data: { count: number }) => {
      set({ unreadCount: data.count });
    });

    socket.on("notification_marked_as_read", (notification: Notification) => {
      set(
        produce((state: WebSocketState) => {
          const index = state.notifications.findIndex(
            (n) => n.id === notification.id
          );
          if (index !== -1) {
            state.notifications[index] = notification;
          }
          if (!notification.read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        })
      );
    });

    socket.on("mark_all_as_read", () => {
      set(
        produce((state: WebSocketState) => {
          state.notifications = state.notifications.map((n) => ({
            ...n,
            read: true,
          }));
          state.unreadCount = 0;
        })
      );
    });

    socket.on("online_status", (statuses: OnlineStatus[]) => {
      const newMap = new Map(get().onlineUsers);
      statuses.forEach(({ userId, isOnline }) => {
        newMap.set(userId, isOnline);
      });
      set({ onlineUsers: newMap });
    });

    socket.on("pong", (data: { timestamp: number }) => {
      console.log("Pong received:", new Date(data.timestamp).toISOString());
    });

    socket.on("error", (data: { message: string }) => {
      console.error("WebSocket error:", data.message);
    });

    //* Store socket in state
    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  markAsRead: (notificationId: string) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit("mark_notification_read", { notificationId });
    }
  },

  markAllAsRead: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit("mark_all_as_read");
    }
  },

  getOnlineStatus: (userIds: string[]) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit("get_online_status", { userIds });
    }
  },

  getPreferences: () => {
    return new Promise((resolve, reject) => {
      const { socket } = get();
      if (!socket?.connected) {
        reject(new Error("WebSocket not connected"));
        return;
      }

      socket.emit("get_my_preferences", (response: unknown) => {
        if (response && typeof response === "object" && "error" in response) {
          reject(new Error((response as { error: string }).error));
        } else {
          resolve(response);
        }
      });
    });
  },

  resetPreferences: () => {
    return new Promise((resolve, reject) => {
      const { socket } = get();
      if (!socket?.connected) {
        reject(new Error("WebSocket not connected"));
        return;
      }

      socket.emit("reset_notifications", (response: unknown) => {
        if (response && typeof response === "object" && "error" in response) {
          reject(new Error((response as { error: string }).error));
        } else {
          resolve(response);
        }
      });
    });
  },

  checkPermission: (type: string) => {
    return new Promise((resolve, reject) => {
      const { socket } = get();
      if (!socket?.connected) {
        reject(new Error("WebSocket not connected"));
        return;
      }

      socket.emit("check_permission", { type }, (response: unknown) => {
        if (response && typeof response === "object" && "error" in response) {
          reject(new Error((response as { error: string }).error));
        } else if (
          response &&
          typeof response === "object" &&
          "allowed" in response
        ) {
          resolve((response as { allowed: boolean }).allowed);
        } else {
          resolve(false);
        }
      });
    });
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  removeNotification: (notificationId: string) => {
    set(
      produce((state: WebSocketState) => {
        const notification = state.notifications.find(
          (n) => n.id === notificationId
        );
        state.notifications = state.notifications.filter(
          (n) => n.id !== notificationId
        );
        if (notification && !notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
    );
  },
}));
