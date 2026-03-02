import { api } from "../../../shared/http"
import type { GroupCreate, GroupEdit } from "./types"

export const fetchGroups = async () => {
    const responce = await api.get("/auction-groups")
    return responce.data
}
export const fetchGroupByid = async (id: string) => {
    if (!id) return {}
    const responce = await api.get(`/auction-groups/${id}`)
    return responce.data
}
export const createGroup = async (newGroup: GroupCreate) => {
    console.log(newGroup)
    const data = await api.post('/auction-groups', newGroup);
    return data
}
export const editGroup = async (groupId: string, editedGroup: GroupEdit) => {
    // if (!groupId) return {}
    console.log(editedGroup)
    const data = await api.patch(`/auction-groups/${groupId}`, editedGroup);
    return data

}

export const deleteGroup = async (groupId: string) => {
    const data = await api.delete(`/auction-groups/${groupId}`);
    return data

}