/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

//* 1.Create axios instance
const api = axios.create({
  baseURL: "/api/backend",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

//* 2.Track refresh state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: InternalAxiosRequestConfig;
}> = [];

//* 3.Process the queue if refresh succeed or reject if refresh fails
const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(api(prom.config));
    }
  });
  failedQueue = [];
};
//* 4.Response interceptor - handles 401 and refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    //* 4.1 Only handle 401 errors (reject others)
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }
    //* 4.2 Prevent infinite retry loops => reject if the original req failed the first time
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    //* 4.3 Don't refresh if we're already trying to refresh
    if (originalRequest.url?.includes("/auth/refresh")) {
      //* Redirect to login if refresh fails
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    //* 4.4 If we're already refreshing, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    //* 4.5 Mark request as retried and start the refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      //* 4.6 Try to refresh tokens
      await api.get("/auth/refresh");

      //* 4.7 Refresh succeeded, retry original request
      const response = await api(originalRequest);

      //* 4.8 Process any queued requests => resolve
      processQueue(null);
      return response;
    } catch (refreshError) {
      //* 4.9 Refresh failed - clear queue and redirect to login
      processQueue(refreshError as Error);

      //* 5.0 Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      //* Return the error to the caller
      return Promise.reject(refreshError);
    } finally {
      //? Set refresh to false
      isRefreshing = false;
    }
  }
);

export default api;
