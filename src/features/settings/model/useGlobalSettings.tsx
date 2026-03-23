import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchGlobalSettings, updateGlobalSettings } from "./api-global-settings";
import type { GlobalSettingsDTO } from "./types";
export const globalSettingsKeys = {
    global: ["global"]
}
export const useGlobalSettings = () => {
    return useQuery({
        queryKey: globalSettingsKeys.global,
        queryFn: () => fetchGlobalSettings(),
        staleTime: 1000,
    });
};

export const useUpdateGlobalSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: GlobalSettingsDTO) => updateGlobalSettings(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: globalSettingsKeys.global }),
    });
};
