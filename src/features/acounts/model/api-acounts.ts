import { api } from "../../../shared/http"
import type { AccountCreate, AccountUpdate } from "./types"

export const fetchAcountsByAuction = async (id: string) => {
    const responce = await api.get(`/auction-auth/${id}`)
    console.log(responce.data)
    return responce.data
}
export const createAcount = async (data: AccountCreate) => {
    console.log(data)
    const responce = await api.post(`/auction-auth`, data)
    return responce.data
}
export const updateAcount = async (id: string, data: AccountUpdate) => {
    const responce = await api.patch(`/auction-auth/${id}`, data)
    return responce.data
}
export const deleteAcount = async (id: string) => {
    const responce = await api.delete(`/auction-auth/${id}`)
    return responce.data
}
