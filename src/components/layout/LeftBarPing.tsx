"use client";
import { useEffect } from "react";
import { useWebSocketStore } from "@/stores/websocket-store";
import { useAuthActions } from "@/stores/useStore";
import api from "@/lib/api/axios";
import { useChatStore } from "@/stores/chat-store";

export function LeftBarPing() {
  const { isConnected, setAccessToken } = useWebSocketStore();
  const { setChatAccessToken } = useChatStore();
  const { fetchCurrentUser } = useAuthActions();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isConnected) {
        try {
          const { data } = await api.get("auth/refresh");
          const accessToken = data.access_token;
          setAccessToken(accessToken);
          setChatAccessToken(accessToken);
        } catch (error) {
          console.error("Failed to refresh token for websocket:", error);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isConnected, setAccessToken, fetchCurrentUser, setChatAccessToken]);

  return null;
}
