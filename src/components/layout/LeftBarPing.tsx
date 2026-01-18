"use client";
import { useEffect } from "react";
import { useWebSocketStore } from "@/stores/websocket-store";
import { useAuthActions } from "@/stores/useStore";
import api from "@/lib/api/axios";

export function LeftBarPing() {
  const { isConnected, setAccessToken } = useWebSocketStore();
  const { fetchCurrentUser } = useAuthActions();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isConnected) {
        try {
          const { data } = await api.get("auth/refresh");
          const accessToken = data.access_token;
          setAccessToken(accessToken);
        } catch (error) {
          console.error("Failed to refresh token for websocket:", error);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isConnected, setAccessToken, fetchCurrentUser]);

  return null;
}
