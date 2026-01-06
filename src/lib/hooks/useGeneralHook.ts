"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import { UserType } from "@/types/user-type";

export const useProfile = (username: string) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const { data } = await api.get<UserType>(`/users/${username}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useTrendingTags = () => {
  return useQuery({
    queryKey: ["trending-tags"],
    queryFn: async () => {
      const { data } = await api.get("/hashtags/trending");
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchQuery = (query: string) => {
  return useQuery({
    queryKey: ["searchTags", query],
    queryFn: async () => {
      if (!query) return [];
      const { data } = await api.get(`hashtags/search?q=${query}`);
      return data;
    },
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};
