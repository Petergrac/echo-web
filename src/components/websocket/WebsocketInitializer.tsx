"use client";

import { useEffect } from "react";
import { useWebSocketStore } from "@/stores/websocket-store";

export function WebSocketInitializer() {
  const initializeSocket = useWebSocketStore((state) => state.initializeSocket);

  useEffect(() => {
    //* Initialize WebSocket when component mounts
    initializeSocket();
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, [initializeSocket]);

  return null;
}
