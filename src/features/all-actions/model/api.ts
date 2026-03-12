import { api } from "../../../shared/http"

export const fetchAllActive = async (take: number = 20) => {
    return api.get(`/dispatcher/sessions?isActive=true&take=${take}`)
}

export const fetchAllClosed = async (take: number = 20) => {
    return api.get(`/dispatcher/sessions?isActive=false&take=${take}`)
}

export const fetchSessionLogs = async (id: string) => {
    return api.get(`/dispatcher/logs`, {
        params: {
            sessionId: id
        }
    })
}

export const fetchAllForbidden = async () => {
    return api.get(`/dispatcher/logs/forbidden`)
}

export const fetchAllIncidents = async () => {
    return api.get(`/dispatcher/logs/incidents`)
}

export const deleteSession = async (id: string) => {
    const responce = await api.delete(`/sessions/${id}`);
    return responce.data;
};