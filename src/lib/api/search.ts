import api from "./axios";

export const searchApi = {
  getTrending: async (limit = 5) => {
    const response = await api.get(`/search/trending?limit=${limit}`);
    return response.data;
  },

  getWhoToFollow: async (limit = 3) => {
    const response = await api.get(
      `/search/discover/who-to-follow?limit=${limit}`
    );
    return response.data;
  },

  getSuggestions: async (query: string) => {
    const response = await api.get(`/search/suggestions?q=${query}`);
    return response.data;
  },
};
