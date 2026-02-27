import { api } from "."

export const fetchAuctions = async (groupId: string) => {
    if (!groupId) return []
    const responce = await api.get(`/auctions/${groupId}`)
    return responce.data
}
export const fetchAuctionsByQuery = async (q: string) => {
    if (!q) return []
    const responce = await api.get(`/auctions/search`, {
        params: {
            q: q
        }
    })
    return responce.data
}