import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { apiLogout, createUser, fetchControlCard, fetchCurrentUser, fetchUsers, handleBlockUser, refreshUser } from "./api-user";
import type { CreateUser, User } from "./user-schema";

export const authKeys = {
  me: ["auth", "me"] as const,
  users: ["users"] as const,
  controlCard: (id: string) => ["auth", "users", "control-card", id] as const,
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
      await refreshUser()
      return true
    } catch (e) {
      console.error(e)
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};
export const useUsers = () => {
  const { data, isLoading, isPending, error, isError } = useQuery({
    queryKey: authKeys.users,
    queryFn: fetchUsers
  })
  return { users: data, isLoading, isPending, error, isError }
}

export const useControlCard = (id: string) => {
  const { data, isLoading, isPending, error, isError } = useQuery({
    queryKey: authKeys.controlCard(id),
    queryFn: () => fetchControlCard(id),
    enabled: !!id
  })
  return { userData: data, isLoading, isPending, error, isError }
}

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUser) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authKeys.users,
      });
    },
    onError: (error) => {
      console.error("Помилка при створенні користувача:", error);
    }
  });
};
export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: User) => handleBlockUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authKeys.users,
      });
    },
    onError: (error) => {
      console.error("Помилка при створенні користувача:", error);
    }
  });
}