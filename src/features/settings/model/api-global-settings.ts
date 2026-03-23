import { api } from "../../../shared/http"
import type { GlobalSettingsDTO } from "./types"

export const fetchGlobalSettings = async () => {
    const responce = await api.get('/global-settings')
    return responce.data
}
export const updateGlobalSettings = async (data: GlobalSettingsDTO) => {
    console.log(data)
    const responce = await api.patch('/global-settings', data)
    console.log(responce.data)
    return responce.data
}