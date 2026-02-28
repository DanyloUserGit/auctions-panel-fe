import axios from "axios";

export const baseUrl = `https://auctions-be.duckdns.org/api`

export const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});


