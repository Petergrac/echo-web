"use client";

import { useEffect } from "react";
import { useWebSocketStore } from "@/stores/websocket-store";
import { useChatStore } from "@/stores/chat-store";

export function WebSocketInitializer() {
  const initializeSocket = useWebSocketStore((state) => state.initializeSocket);
  const initializeChatSocket = useChatStore(
    (state) => state.initializeChatSocket
  );

  useEffect(() => {
    //* Initialize WebSocket when component mounts
    initializeSocket();
    initializeChatSocket();
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, [initializeSocket, initializeChatSocket]);

  return null;
}
