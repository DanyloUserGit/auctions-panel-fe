import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../shemas/schemas";
import { fetchCurrentUser, apiLogout, api } from "../http";
import { AxiosError } from "axios";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: authKeys.me,
    queryFn: async (): Promise<User | null> => {
      try {
        return await fetchCurrentUser();
      } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 401) {
          const restored = await initAuth();
          if (restored) {
            return await fetchCurrentUser();
          }
        }
        
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true, 
  });

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      queryClient.setQueryData(authKeys.me, null);
      queryClient.clear(); 
    }
  };

  return {
    user: user ?? null,
    isLoading: isLoading || isFetching,
    isAuthenticated: !!user,
    isError,
    logout,
    refetch,
  };
};


let refreshPromise: Promise<boolean> | null = null;

export const initAuth = async (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await api.post("/auth/refresh");
      return response.status === 200 || response.status === 204;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};