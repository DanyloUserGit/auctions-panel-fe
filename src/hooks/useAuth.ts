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
        // 1. Спроба отримати профіль
        return await fetchCurrentUser();
      } catch (error) {
        const axiosError = error as AxiosError;

        // 2. Якщо токен протух (401), намагаємось оновити сесію через Cookies
        if (axiosError.response?.status === 401) {
          const restored = await initAuth();
          if (restored) {
            // Спроба №2: якщо refresh успішний, знову просимо дані юзера
            return await fetchCurrentUser();
          }
        }
        
        // Якщо це не 401 або refresh не вдався — юзер не авторизований
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 хвилин дані вважаються свіжими
    refetchOnWindowFocus: true, // Перевіряти сесію при поверненні на вкладку
  });

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Очищаємо кеш незалежно від успіху запиту
      queryClient.setQueryData(authKeys.me, null);
      queryClient.clear(); 
      // Можна додати navigation("/login") тут
    }
  };

  return {
    user: user ?? null,
    // Чекаємо, поки йде перше завантаження або фонове оновлення
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