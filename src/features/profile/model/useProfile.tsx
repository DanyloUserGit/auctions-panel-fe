import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  changePassword,
  updateProfile,
  updateRole,
} from '../../auth/model/api-user';
import type { ChangeRole, UpdateUser } from '../../auth/model/user-schema';
import { authKeys } from '../../auth/model/useAuth';

export const useUpdateProfile = (id:string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUser) => updateProfile(data, id),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: authKeys.me,
        refetchType: 'all',
      });
    },
    onError: (error) => {
      console.error('Помилка при оновленні профілю:', error);
    },
  });
};
export const useChangeRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangeRole) => updateRole(data),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: authKeys.me,
        refetchType: 'all',
      });
    },
    onError: (error) => {
      console.error('Помилка при оновленні профілю:', error);
    },
  });
};
export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      changePassword(data),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: authKeys.me,
        refetchType: 'all',
      });
    },
    onError: (error) => {
      console.error('Помилка при оновленні профілю:', error);
    },
  });
};
