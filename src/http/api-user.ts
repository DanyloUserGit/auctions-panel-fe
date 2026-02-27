import { api } from ".";
import type {  User } from "../shemas/schemas";

export const fetchCurrentUser = async (): Promise<User> => {
    const responce = await api.get("/auth/me");
    return responce.data;
}
export const apiLogout = async (): Promise<void> => {
    await api.post("/auth/logout");
}
export const refreshUser=async ():Promise<boolean>=>{
    const response = await api.post("/auth/refresh");
    return response.status === 200 || response.status === 204;
}