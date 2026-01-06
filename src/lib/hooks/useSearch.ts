import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios";

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  isFollowing?: boolean;
}

interface Post {
  id: string;
  content: string;
  author: User;
  likeCount: number;
  replyCount: number;
  repostCount: number;
  liked?: boolean;
  bookmarked?: boolean;
}

interface Hashtag {
  id: string;
  tag: string;
  usageCount: number;
  postCount: number;
}

interface SearchResults {
  users: User[];
  posts: Post[];
  hashtags: Hashtag[];
  total: number;
  filters: {
    query: string;
    type: string;
    limit: number;
    offset: number;
    timeframe: string;
    sortBy: string;
  };
}

interface SearchSuggestions {
  users: User[];
  hashtags: Hashtag[];
  popularQueries?: string[];
}

//* 1.Combined search hook
export const useSearch = (query: string, type: string = 'combined', enabled: boolean = true) => {
  return useQuery<SearchResults>({
    queryKey: ['search', query, type],
    queryFn: async () => {
      const { data } = await api.get('/search', {
        params: {
          q: query,
          type,
          limit: 20,
          offset: 0,
          timeframe: 'all',
          sortBy: 'relevance'
        }
      });
      return data;
    },
    enabled: enabled && query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

//* 2.Search suggestions hook
export const useSearchSuggestions = (query: string, enabled: boolean = true) => {
  return useQuery<SearchSuggestions>({
    queryKey: ['search-suggestions', query],
    queryFn: async () => {
      const { data } = await api.get('/search/suggestions', {
        params: {
          q: query,
          limit: 10
        }
      });
      return data;
    },
    enabled: enabled && query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

//* 3.Trending searches hook
export const useTrendingSearches = (limit: number = 10) => {
  return useQuery<string[]>({
    queryKey: ['trending-searches', limit],
    queryFn: async () => {
      const { data } = await api.get('/search/trending', {
        params: { limit }
      });
      return data.trendingSearches || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

//* 4.Who to follow hook
export const useWhoToFollow = (limit: number = 10) => {
  return useQuery<User[]>({
    queryKey: ['who-to-follow', limit],
    queryFn: async () => {
      const { data } = await api.get('/search/discover/who-to-follow', {
        params: { limit }
      });
      return data.suggestions || [];
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

//* 5.Trending posts hook (infinite scroll)
export const useTrendingPosts = (timeframe: 'day' | 'week' = 'day', limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['trending-posts', timeframe],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get('/search/discover/trending-posts', {
        params: {
          timeframe,
          limit,
          offset: (pageParam - 1) * limit
        }
      });
      return {
        items: data.items || data || [],
        pagination: data.pagination || {
          currentPage: pageParam,
          hasNextPage: (data?.items?.length || 0) >= limit
        }
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage ? lastPage.pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};