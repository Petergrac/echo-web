"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useStore";
import LeftBarSkeleton from "../layout/LeftBarSkeleton";
import PostDetailLoader from "../post/post-detail/PostDetailLoader";
import { useWebSocketStore } from "@/stores/websocket-store";
import RightBarSkeleton from "../layout/RightBarSkeleton";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setAccessToken = useWebSocketStore((state) => state.setAccessToken);
  const setChatAccessToken = useWebSocketStore((state) => state.setAccessToken);

  useEffect(() => {
    //* Fetch user on mount
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
          <RightBarSkeleton />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
