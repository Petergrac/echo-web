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
