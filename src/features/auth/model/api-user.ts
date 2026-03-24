import { api } from '../../../shared/http';
import type { LoginInput } from './login-schema';
import type { ChangeRole, CreateUser, UpdateUser, User } from './user-schema';

export const login = async (data: LoginInput, token: string) => {
  const response = await api.post(
    '/auth/login',
    { ...data, token },
    {
      withCredentials: true,
    },
  );
  console.log('Успішний вхід:', response.data);
  return response.data;
};
export const fetchCurrentUser = async (): Promise<User> => {
  const responce = await api.get('/auth/me');
  return responce.data;
};
export const fetchUsers = async (): Promise<User[]> => {
  const responce = await api.get('/users');
  return responce.data;
};
export const apiLogout = async (): Promise<void> => {
  await api.post('/auth/logout');
};
export const refreshUser = async (): Promise<boolean> => {
  const response = await api.post('/auth/refresh');
  return response.status === 200 || response.status === 204;
};
interface fetchUsersByQueryResponce {
  data: User[];
  meta: { total: number; page: number; lastPage: number };
}
export const fetchUsersByQuery = async (
  query: string,
  page: number = 1,
  limit: number = 10,
): Promise<fetchUsersByQueryResponce> => {
  const response = await api.get(`/users/search/`, {
    params: {
      query,
      page,
      limit,
    },
  });
  return response.data;
};
export const fetchUserById = async (id: string): Promise<User> => {
  const responce = await api.get(`/users/${id}`);
  return responce.data;
};
export const updateProfile = async (data: UpdateUser, id: string) => {
  console.log(data);
  const responce = await api.patch(`/profile/edit`, { ...data, id });
  console.log(responce.data);
  return responce.data;
};
export const updateRole = async (data: ChangeRole) => {
  const responce = await api.patch('/profile/change-role', data);
  return responce.data;
};
export const sendResetLink = async () => {
  const responce = await api.post('/profile/send-reset-link');
  return responce.data;
};
export const changePassword = async (data: {
  token: string;
  password: string;
}) => {
  const responce = await api.patch(`/profile/change-password/${data.token}`, {
    password: data.password,
  });
  return responce.data;
};
export const fetchControlCard = async (id: string) => {
  const responce = await api.get(`/users/${id}/control-card`);
  return responce.data;
};
export const updateStatus = async (id: string) => {
  const responce = await api.get(`/users/${id}/status`);
  return responce.data;
};
export const createUser = async (data: CreateUser): Promise<User> => {
  const responce = await api.post(`/users`, data);
  return responce.data;
};
export const updateUser = async (id: string, data: UpdateUser) => {
  const responce = await api.patch(`users/${id}`, data);
  console.log(responce.data);
  return responce.data;
};
export const handleBlockUser = async (user: User) => {
  const responce = await api.patch(`/users/${user.id}/status`, {
    isActive: !user.isActive,
    isBlocked: !user.isBlocked,
  });
  return responce.data;
};
