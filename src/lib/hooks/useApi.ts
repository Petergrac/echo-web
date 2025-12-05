/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import apiClient from "@/lib/api/axios";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const callApi = useCallback(
    async <T>(
      method: "get" | "post" | "put" | "delete",
      url: string,
      data?: any
    ): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient[method](url, data);
        return response.data as T;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { callApi, loading, error };
}
