import apiClient from "../../../services/apis/apiClient";
import { SettingGoogleResponse } from "../types/setting.type";

export const getGoogleSettingApi = async (): Promise<SettingGoogleResponse> => {
    return apiClient<SettingGoogleResponse>({
        url: 'app-settings/google-login',
        method: 'GET',
    });
}