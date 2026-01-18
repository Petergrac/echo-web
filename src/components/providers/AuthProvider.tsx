"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useStore";
import LeftBarSkeleton from "../layout/LeftBarSkeleton";
import PostDetailLoader from "../post/post-detail/PostDetailLoader";
import api from "@/lib/api/axios";
import { useWebSocketStore } from "@/stores/websocket-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setAccessToken = useWebSocketStore((state) => state.setAccessToken);
  const setChatAccessToken = useWebSocketStore((state) => state.setAccessToken);

  useEffect(() => {
    //* Fetch user on mount
    // const initializeAuth = async () => {
    //   try {
    //     const { data } = await api.get("auth/refresh");
    //     const token = data.access_token;
    //     setAccessToken(token);
    //     setChatAccessToken(token);
    //   } catch (_error) {
    //     window.location.href = "/login";
    //   }
    console.log("Auth token refreshed and set.");
    //* Fetch current user data
    fetchCurrentUser();
  }, [fetchCurrentUser, setAccessToken, setChatAccessToken]);

  //* 1.Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex w-full justify-between">
        <div className="hidden md:block">
          <LeftBarSkeleton />
        </div>
        <div className="flex flex-col w-150">
          {[1, 2, 3, 4].map((i) => (
            <PostDetailLoader key={i} />
          ))}
        </div>
        <div className="hidden md:block">
          <LeftBarSkeleton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
