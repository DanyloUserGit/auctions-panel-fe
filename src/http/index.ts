import axios from "axios";
import type { User } from "../shemas/schemas";

export const baseUrl = `https://auctions-be.duckdns.org/api`

export const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

export const fetchCurrentUser = async (): Promise<User> => {
    const responce = await api.get("/auth/me");
    return responce.data;
}
export const apiLogout = async (): Promise<void> => {
    await api.post("/auth/logout");
}
export const fetchAuctions=async()=>{
    const responce=await api.get("/auctions")
    return responce.data
}
export const fetchGroups=async()=>{
    const responce=await api.get("/auction-groups")
    return responce.data
}