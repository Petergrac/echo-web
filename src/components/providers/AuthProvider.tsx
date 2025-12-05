"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/hooks/useStore';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}