import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  apiLogout,
  createUser,
  fetchControlCard,
  fetchCurrentUser,
  fetchUserById,
  fetchUsers,
  fetchUsersByQuery,
  changeUserStatus,
  type ChangeUserStatus,
  login,
  refreshUser,
  updateUser,
} from './api-user';
import type { CreateUser, UpdateUser, User } from './user-schema';
import { groupsKeys } from '../../groups/model/useGroups';
import { socket } from '../../../shared/http';
import { useTabsStore } from '../../sessions/model/tabs';
import type { LoginInput } from './login-schema';

export const authKeys = {
  me: ['auth', 'me'] as const,
  users: ['users'] as const,
  controlCard: (id: string) => ['auth', 'users', 'control-card', id] as const,
  login: ['login'] as const,
};
interface LoginPayload {
  data: LoginInput;
  token: string;
}

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, token }: LoginPayload) => login(data, token),
    mutationKey: authKeys.login,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      // queryClient.setQueryData(authKeys.me, response.data);
    },

    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
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
      console.error('Logout failed:', err);
    } finally {
      // Від'єднуємось від сесій (лічильники підключень зменшуються), список вкладок лишається
      // для наступного входу. Сокет сесій автентифікований cookie попереднього користувача - закриваємо його.
      useTabsStore.getState().leaveAllOnLogout();
      socket.disconnect();
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
      await refreshUser();
      return true;
    } catch (e) {
      console.error(e);
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
    queryFn: fetchUsers,
  });
  return { users: data, isLoading, isPending, error, isError };
};

export const useControlCard = (id: string) => {
  const { data, isLoading, isPending, error, isError } = useQuery({
    queryKey: authKeys.controlCard(id),
    queryFn: () => fetchControlCard(id),
    enabled: !!id,
  });
  return { userData: data, isLoading, isPending, error, isError };
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUser) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.users });
    },
    onError: (error) => {
      console.error('Помилка при створенні користувача:', error);
    },
  });
};
export const useChangeUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChangeUserStatus }) => changeUserStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.users });
      queryClient.invalidateQueries({ queryKey: ['auth', 'users'] });
    },
  });
};
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUser }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: authKeys.users,
      });
      queryClient.invalidateQueries({ queryKey: ['auth', 'users'] });
      queryClient.invalidateQueries({ queryKey: groupsKeys.all });
    },
    onError: (error) => {
      console.error('Помилка при створенні користувача:', error);
    },
  });
};
export const useUserById = (id: string | null) => {
  return useQuery({
    queryKey: [...authKeys.users, id],
    queryFn: () => {
      if (!id) throw new Error('ID is required');
      return fetchUserById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchUsers = (query: string, page: number, limit: number) => {
  return useQuery({
    queryKey: [...authKeys.users, 'search', query],
    queryFn: () => fetchUsersByQuery(query, page, limit),
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000,
  });
};
