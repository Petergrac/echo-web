import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import { PaginationMeta } from "@/types/pagination-meta";

export function useUniversalInfiniteQuery<T>(
  queryKey: string[],
  endpoint: string,
  limit: number = 10,
  options: object = {}
) {
  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get(
        `${endpoint}?page=${pageParam}&limit=${limit}`
      );
      const items = (Object.values(data).find(Array.isArray) as T[]) ?? [];
      return {
        items,
        pagination: data.pagination as PaginationMeta,
      };
    },
    ...options,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });
}
