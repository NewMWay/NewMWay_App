import { useCustomQuery } from "../../../hooks/useCustomQuery";
import { getGoogleSettingApi } from "../apis/setting.api";
import { SettingGoogleResponse } from "../types/setting.type";

export const useGoogleSetting = () => {
    return useCustomQuery<SettingGoogleResponse, Error>(
        ['useGoogleSetting'],
        () => getGoogleSettingApi(),
        'useGoogleSetting',
        'Không thể lấy thông tin cài đặt Google.',
        true,
    )
}


