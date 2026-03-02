import { api } from "../../../shared/http"
import type { AuctionCreate, AuctionEdit } from "./types"

export const fetchAuctions = async (groupId: string) => {
    if (!groupId) return []
    const responce = await api.get(`/auctions/${groupId}`)
    return responce.data
}
export const fetchAuctionsByQuery = async (q: string) => {
    if (!q) return []
    const responce = await api.get(`/auctions/search`, {
        params: {
            query: q
        }
    })
    return responce.data
}
export const createAuction = async (data: AuctionCreate) => {
    console.log(data)
    const responce = await api.post('auctions', data)
    return responce.data
}
export const editAuction = async (id: string, data: AuctionEdit) => {
    const responce = await api.patch(`auctions/${id}`, data)
    console.log(responce.data)
    return responce.data
}

export const deleteAuction = async (id: string) => {
    const responce = await api.delete(`auctions/${id}`)
    return responce.data
}
export const fetchAuctionsByGroup = async (groupId: string) => {
    const responce = await api.get(`auctions/${groupId}`)
    return responce.data
}