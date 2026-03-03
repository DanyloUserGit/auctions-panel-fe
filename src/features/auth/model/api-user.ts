import { api } from "../../../shared/http";
import type { UpdateUser, User } from "./user-schema";

export const fetchCurrentUser = async (): Promise<User> => {
    const responce = await api.get("/auth/me");
    return responce.data;
}
export const apiLogout = async (): Promise<void> => {
    await api.post("/auth/logout");
}
export const refreshUser = async (): Promise<boolean> => {
    const response = await api.post("/auth/refresh");
    return response.status === 200 || response.status === 204;
}
export const fetchUserByQuery = async (q: string) => {
    const responce = await api.get(`/users/search/`, { params: { query: q } })
    console.log(responce.data)
    return responce.data
}
export const updateUser = async (id: string, data: UpdateUser) => {
    const responce = await api.post(`/users/${id}`, data)
    console.log(responce.data)
    return responce.data
}