import { create } from "zustand";
import { produce } from "immer";
import { Socket } from "socket.io-client";
import type { Notification } from "@/types/notification";
import { initializeSocket, disconnectSocket } from "@/lib/websocket/socket";
import { toast } from "sonner";
import React from "react";
export interface WebSocketState {
  //* 1.State
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
  removeNotification: (notificationId: string) => void;
  clearNotifications: () => void;
  addNotification: (notification: Notification) => void;
  setUnreadCount: (count: number) => void;
}

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

    const socket = initializeSocket();

    //* Connection events
    socket.on("connect", () => {
      console.log("🔗 WebSocket connected");
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("🔴 WebSocket disconnected");
      set({ isConnected: false });
    });
    socket.on("new_notification", (notification: Notification) => {
      set(
        produce((state: WebSocketState) => {
          //* Add to top of list
          state.notifications.unshift(notification);
          if (!notification.read) {
            state.unreadCount += 1;
          }
        })
      );
      const notificationTitle = getNotificationTitle(notification);
      toast.success(notificationTitle, {
        description: getNotificationBody(notification),
        icon: React.createElement("img", {
          src: notification.actor.avatar,
          style: {
            width: "80px",
            height: "40px",
            aspectRatio: "1/1",
            borderRadius: "50%",
            objectFit: "cover",
          },
        }),
      });
      //* Show browser notification
      if (
        typeof window !== "undefined" &&
        Notification.permission === "granted"
      ) {
        const title = getNotificationTitle(notification);
        const body = getNotificationBody(notification);
        new Notification(title, { body, icon: notification.actor.avatar });
      }
    });

    //* Your backend sends unread_count
    socket.on("unread_count", (data: { count: number }) => {
      console.log("Unread count updated:", data.count);
      set({ unreadCount: data.count });
    });

    //* When user marks as read via WebSocket
    socket.on("notification_marked_as_read", (notification: Notification) => {
      console.log("Notification marked as read:", notification.id);
      set(
        produce((state: WebSocketState) => {
          const index = state.notifications.findIndex(
            (n) => n.id === notification.id
          );
          if (index !== -1) {
            state.notifications[index] = notification;
          }
          //* Update unread count if this was unread
          if (!notification.read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        })
      );
    });

    socket.on("mark_all_as_read", () => {
      console.log("All notifications marked as read");
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

    socket.on(
      "online_status",
      (statuses: Array<{ userId: string; isOnline: boolean }>) => {
        const newMap = new Map(get().onlineUsers);
        statuses.forEach(({ userId, isOnline }) => {
          newMap.set(userId, isOnline);
        });
        set({ onlineUsers: newMap });
      }
    );
    socket.on("clear_notifications", () => {
      set({ notifications: [] });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      disconnectSocket();
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
  addNotification: (notification: Notification) => {
    set(
      produce((state: WebSocketState) => {
        const exists = state.notifications.find(
          (n) => n.id === notification.id
        );
        if (!exists) {
          state.notifications.unshift(notification);
          if (!notification.read) {
            state.unreadCount += 1;
          }
        }
      })
    );
  },

  setUnreadCount: (count: number) => {
    const current = get().unreadCount;
    if (current !== count) {
      set({ unreadCount: count });
    }
  },
  syncUnreadCountFromRest: (count: number) => {
    const current = get().unreadCount;
    if (current === undefined) {
      set({ unreadCount: count });
    }
  },
}));

//* Helper functions to generate notification text
function getNotificationTitle(notification: Notification): string {
  const actorName = notification.actor.firstName || notification.actor.username;

  switch (notification.type) {
    case "LIKE":
      return `${actorName} liked your post`;
    case "REPLY":
      return `${actorName} replied to your post`;
    case "REPOST":
      return `${actorName} reposted your post`;
    case "FOLLOW":
      return `${actorName} followed you`;
    case "MENTION":
      return `${actorName} mentioned you`;
    case "SYSTEM":
      return "System notification";
    default:
      return "New notification";
  }
}

function getNotificationBody(notification: Notification): string {
  switch (notification.type) {
    case "LIKE":
      return "Click to view the post";
    case "REPLY":
      return "Click to view the reply";
    case "REPOST":
      return "Click to view the repost";
    case "FOLLOW":
      return "Click to view their profile";
    case "MENTION":
      return "Click to view the post";
    case "SYSTEM":
      return "Check your notifications for details";
    default:
      return "View notification";
  }
}
