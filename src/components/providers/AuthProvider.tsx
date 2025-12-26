"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/useStore";
import LeftBarSkeleton from "../layout/LeftBarSkeleton";
import PostDetailLoader from "../post/post-detail/PostDetailLoader";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    //* Fetch user on mount
    fetchCurrentUser().catch(() => {
      //* Silently fail - user might not be logged in
      //* Axios interceptor will handle redirect if needed
    });
  }, [fetchCurrentUser]);

  //* 1.Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex w-full justify-between">
        <div className="hidden md:inline">
          <LeftBarSkeleton />
        </div>
        <div className="flex flex-col w-150">
          {[1, 2, 3, 4].map((i) => (
            <PostDetailLoader key={i} />
          ))}
        </div>
        <div className="hidden md:inline">
          <LeftBarSkeleton />
        </div>
        /
      </div>
    );
  }

  return <>{children}</>;
}
